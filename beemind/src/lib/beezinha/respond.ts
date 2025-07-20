export interface SimpleResponse {
  message: string;
}

// TODO: Implement RAG-powered response generation using LangChain + OpenAI + Pinecone.
export async function sendMessage(question: string): Promise<SimpleResponse> {
  // Placeholder implementation
  return {
    message: 'Resposta de teste. Sistema RAG ainda em construção.',
  };
}