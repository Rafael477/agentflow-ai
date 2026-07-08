import type { WhatsappMetaConfig, WhatsappWebConfig } from "@/services/whatsapp/whatsapp-types";

export type ChannelConnection =
  | { type: "whatsapp-meta"; config: WhatsappMetaConfig }
  | { type: "whatsapp-web"; config: WhatsappWebConfig };

export function createMockQrCode(sessionId: string): WhatsappWebConfig {
  return {
    sessionId,
    qrCode: `agentflow-qr-${sessionId}`,
    status: "pending"
  };
}
