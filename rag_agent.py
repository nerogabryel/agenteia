import os
import argparse
import glob
import uuid

import openai
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions


# ------------------------------
# Configuration Helpers
# ------------------------------

def get_vector_store(persist_dir: str = "db", collection_name: str = "rag_collection"):
    """Return (client, collection) pair, creating them if necessary."""

    client = chromadb.Client(
        Settings(
            persist_directory=persist_dir,
            chroma_db_impl="duckdb+parquet",
        )
    )

    collection = client.get_or_create_collection(
        name=collection_name,
        embedding_function=embedding_functions.OpenAIEmbeddingFunction(
            model_name="text-embedding-3-small",
            api_key=os.environ.get("OPENAI_API_KEY"),
        ),
    )

    return client, collection


# ------------------------------
# Ingestion
# ------------------------------

def ingest_folder(path: str, collection):
    """Recursively ingest all .txt files under *path* into the collection."""

    txt_files = glob.glob(os.path.join(path, "**", "*.txt"), recursive=True)
    if not txt_files:
        print(f"No .txt files found under {path}. Nothing to ingest.")
        return

    documents = []
    metadatas = []
    ids = []

    for file_path in txt_files:
        with open(file_path, "r", encoding="utf-8") as fp:
            text = fp.read()
        documents.append(text)
        metadatas.append({"source": file_path})
        ids.append(str(uuid.uuid4()))

    collection.add(documents=documents, metadatas=metadatas, ids=ids)
    print(f"Ingested {len(documents)} documents into the vector store.")


# ------------------------------
# Retrieval & Generation
# ------------------------------

def retrieve_documents(query: str, collection, top_k: int = 4):
    """Retrieve *top_k* relevant documents for *query* from *collection*."""

    results = collection.query(query_texts=[query], n_results=top_k)
    docs = results["documents"][0]
    return docs


def generate_answer(query: str, docs: list[str]):
    """Generate an answer for *query* using *docs* as context via OpenAI chat completion."""

    context = "\n\n---\n\n".join(docs)
    system_prompt = (
        "Você é um assistente de IA que responde às perguntas do usuário com base no contexto "
        "fornecido. Se a resposta não puder ser respondida a partir desse contexto, seja honesto "
        "e diga que não sabe."
    )

    user_prompt = (
        f"Contexto:\n{context}\n\nPergunta: {query}\n\nResposta (em português):"
    )

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content.strip()


# ------------------------------
# CLI Interface
# ------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Agente LLM com RAG usando OpenAI + ChromaDB.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    # ingest
    ingest_parser = subparsers.add_parser(
        "ingest", help="Ingerir arquivos .txt de um diretório para o banco de vetores."
    )
    ingest_parser.add_argument(
        "path", type=str, help="Caminho para o diretório contendo arquivos .txt"
    )
    ingest_parser.add_argument(
        "--persist_dir", type=str, default="db", help="Diretório onde o banco será salvo."
    )

    # query
    query_parser = subparsers.add_parser(
        "query", help="Consultar o agente (consulta com RAG)."
    )
    query_parser.add_argument("question", type=str, help="Pergunta para o agente")
    query_parser.add_argument(
        "--top_k", type=int, default=4, help="Número de documentos a recuperar"
    )
    query_parser.add_argument(
        "--persist_dir", type=str, default="db", help="Diretório onde o banco está salvo."
    )

    args = parser.parse_args()

    # ------------------
    # Load vector store
    # ------------------
    _, collection = get_vector_store(persist_dir=args.persist_dir)

    if args.command == "ingest":
        ingest_folder(args.path, collection)
        # Persist após ingestão
        collection._client.persist()
        print("✅ Banco de vetores salvo com sucesso.")
    elif args.command == "query":
        docs = retrieve_documents(args.question, collection, top_k=args.top_k)
        answer = generate_answer(args.question, docs)
        print("\nResposta:\n", answer)


if __name__ == "__main__":
    # Verifica se a variável de ambiente da chave da OpenAI está definida
    if not os.getenv("OPENAI_API_KEY"):
        raise EnvironmentError(
            "Defina a variável de ambiente OPENAI_API_KEY com sua chave da OpenAI."
        )
    main()