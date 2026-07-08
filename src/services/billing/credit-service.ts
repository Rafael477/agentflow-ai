export function consumeAgentCredits(currentCredits: number, amount = 1) {
  return {
    credits: Math.max(currentCredits - amount, 0),
    transaction: {
      amount: -amount,
      type: "usage" as const,
      description: `Consumo de ${amount} crédito(s) por resposta do agente`
    }
  };
}
