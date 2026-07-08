export interface AgentRuntimeInput {
  agentId: string;
  message: string;
  model: string;
  apiKey?: string;
}

export interface AgentRuntimeResult {
  answer: string;
  creditsUsed: number;
  provider: "mock" | "openai" | "openrouter" | "groq" | "anthropic" | "gemini";
}

export async function generateAgentAnswer(input: AgentRuntimeInput): Promise<AgentRuntimeResult> {
  if (!input.apiKey) {
    return {
      answer: `Recebi sua mensagem: "${input.message}". Vou te ajudar com simpatia e coletar as informações necessárias para o atendimento.`,
      creditsUsed: 1,
      provider: "mock"
    };
  }

  return {
    answer: "Provider real ainda não configurado nesta base.",
    creditsUsed: 1,
    provider: "mock"
  };
}
