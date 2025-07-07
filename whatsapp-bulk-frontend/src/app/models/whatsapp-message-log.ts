export interface WhatsAppMessageLog {
    msgId: string;
    phoneNumber: string;
    message: string;
    status: string;
    sentAt: Date; 
    files: string;
    campaignName: 'My WhatsApp Campaign',
    dataSource: 'Excel Sheet',     
    messageSource: 'Typed Message'
}