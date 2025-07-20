export interface DocumentProcessor {
  process: (path: string) => Promise<void>;
}

export interface VectorEmbedding {
  generate: (text: string) => Promise<number[]>;
}

export interface SemanticSearch {
  query: (text: string, topK?: number) => Promise<{ text: string; metadata?: any }[]>;
}

export interface LLMGenerator {
  generate: (prompt: string) => Promise<string>;
}

export interface RAGPipeline {
  ingestion: DocumentProcessor;
  embedding: VectorEmbedding;
  storage: unknown; // Pinecone client instance
  retrieval: SemanticSearch;
  generation: LLMGenerator;
}