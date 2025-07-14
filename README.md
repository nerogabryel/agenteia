# Agente LLM com RAG (Retrieval-Augmented Generation)

Este projeto demonstra como criar um agente LLM utilizando a API da OpenAI combinado com RAG (Retrieval-Augmented Generation) em um banco de dados vetorial local (ChromaDB).

## Requisitos

* Python 3.9+
* Conta na OpenAI com chave de API válida

## Instalação

```bash
# Clone seu repositório ou copie os arquivos para uma pasta
cd /caminho/do/projeto

# (Opcional) Crie e ative um ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate    # Windows (Powershell)

# Instale as dependências
pip install -r requirements.txt
```

## Configuração da OpenAI

Defina a variável de ambiente `OPENAI_API_KEY` com a sua chave:

```bash
export OPENAI_API_KEY="sua-chave-aqui"
```

> Em Windows (cmd): `set OPENAI_API_KEY=...`

## Como usar

### 1. Ingestão de documentos

Coloque arquivos `.txt` que você deseja indexar em uma pasta (por exemplo, `docs/`). Em seguida, execute:

```bash
python rag_agent.py ingest docs/
```

Isso irá:
1. Ler todos os arquivos de texto na pasta `docs/` recursivamente.
2. Gerar embeddings para cada documento usando o endpoint de embeddings da OpenAI.
3. Persistir os vetores e metadados no diretório `db/` (padrão) usando o ChromaDB.

### 2. Fazendo perguntas (RAG)

Após indexar, você pode consultar o agente:

```bash
python rag_agent.py query "Qual é o objetivo deste projeto?"
```

O agente:
1. Gera o embedding da sua pergunta.
2. Recupera os documentos mais relevantes (default `top_k=4`).
3. Envia os documentos como contexto para o modelo chat da OpenAI.
4. Retorna a resposta em português.

Opcionalmente, ajuste o número de documentos ou o local do banco:

```bash
python rag_agent.py query "Como instalar?" --top_k 6 --persist_dir outra_pasta
```

## Estrutura dos arquivos

```
├── rag_agent.py       # Script principal com CLI para ingestão e queries
├── requirements.txt   # Dependências Python
└── README.md          # Este guia
```

## Próximos passos

* Integrar com outros bancos vetoriais (Pinecone, Weaviate, Qdrant)
* Suporte a mais formatos de documentos (PDF, DOCX)
* Interface web (Streamlit, Gradio) para testes interativos