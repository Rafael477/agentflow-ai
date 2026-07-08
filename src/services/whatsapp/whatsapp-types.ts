export interface WhatsappMetaConfig {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
  verifyToken: string;
  webhookUrl: string;
}

export interface WhatsappWebConfig {
  sessionId: string;
  qrCode: string;
  status: "pending" | "connected" | "disconnected";
  connectedAt?: Date;
  disconnectedAt?: Date;
}
