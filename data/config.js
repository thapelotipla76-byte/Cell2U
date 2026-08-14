// Cell2U Store Configuration & CMS Settings
// Edit this file to update your business contact details, WhatsApp numbers, and round-robin routing.

window.CELL2U_CONFIG = {
  storeName: "Cell2U",
  tagline: "Your trusted online cellphone store in South Africa. Premium devices, honest prices, delivered fast.",
  
  // WhatsApp Sales & Support Numbers Pool (Round-Robin with Fallback)
  whatsappPool: [
    { number: "+27123456789", label: "Sales Line 1", enabled: true, priority: 1 },
    { number: "+27829876543", label: "Sales Line 2", enabled: true, priority: 2 },
    { number: "+27712223344", label: "Support & Dispatch", enabled: true, priority: 3 }
  ],
  
  // Fallback number used if active pool numbers are disabled
  whatsappFallback: "+27123456789",
  
  // supportEmail removed
  operatingHours: "Mon-Fri: 8am-6pm | Sat: 9am-2pm",
  currency: "R",
  enableOnlinePayment: false
};

/**
 * Get the next WhatsApp number using round-robin distribution with enabled-status fallback.
 */
window.getCell2UWhatsAppNumber = function() {
  const config = window.CELL2U_CONFIG;
  const pool = (config.whatsappPool || []).filter(item => item.enabled);
  
  if (pool.length === 0) {
    return config.whatsappFallback || "+27123456789";
  }
  
  // Retrieve last used index from localStorage
  let currentIndex = parseInt(localStorage.getItem('cell2u_wa_index') || '0', 10);
  if (isNaN(currentIndex) || currentIndex >= pool.length) {
    currentIndex = 0;
  }
  
  const selected = pool[currentIndex];
  
  // Advance index for next customer (round-robin)
  const nextIndex = (currentIndex + 1) % pool.length;
  localStorage.setItem('cell2u_wa_index', nextIndex.toString());
  
  return selected.number;
};
