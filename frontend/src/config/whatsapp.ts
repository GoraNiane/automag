export const WHATSAPP_SELLER_NUMBER = import.meta.env.VITE_WHATSAPP_SELLER_NUMBER || '221770000000';
export const WHATSAPP_DEFAULT_MESSAGE = "Bonjour, je suis intéressé par vos véhicules et j'aimerais avoir plus d'informations.";

/**
 * Génère le lien WhatsApp complet (compatible Desktop & Mobile).
 */
export const getWhatsAppLink = (
  number: string = WHATSAPP_SELLER_NUMBER,
  message: string = WHATSAPP_DEFAULT_MESSAGE
): string => {
  // Nettoyage du numéro pour ne garder que les chiffres
  const cleanNumber = number.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};
