export interface WhatsAppMessageLog {
    msgId: string;
    phoneNumber: string;
    message: string;
    status: string;
    sentAt: Date; // or Date
}  