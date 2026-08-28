export const WHATSAPP_SELLER_NUMBER = import.meta.env.VITE_WHATSAPP_SELLER_NUMBER || '221781662009';
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

/**
 * Formate le numéro de téléphone pour l'affichage (ex: +221 78 166 20 09)
 */
export const getFormattedPhoneNumber = (number: string = WHATSAPP_SELLER_NUMBER): string => {
  const clean = number.replace(/\D/g, '');
  if (clean.length === 12 && clean.startsWith('221')) {
    return `+221 ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8, 10)} ${clean.slice(10, 12)}`;
  }
  return number;
};

