import { CUSTOM_BASE_FEE, CUSTOM_PER_STOP, SERVICE_FEE_RATE, PROMO_CODES, MAX_PAX, MAX_STOPS } from './data.js';

/**
 * Calculates the total cost of a custom trip.
 * @param {number} pax - Number of people
 * @param {number} numStops - Number of destinations chosen
 * @param {string} promoCode - Promo code string (optional)
 * @returns {object} Breakdown of the trip cost
 */
export function calculateTripCost(pax, numStops, promoCode = '') {
  // 1. Validation
  let errors = [];
  if (pax < 1 || pax > MAX_PAX) errors.push(`Number of people must be between 1 and ${MAX_PAX}`);
  if (numStops < 1 || numStops > MAX_STOPS) errors.push(`Number of destinations must be between 1 and ${MAX_STOPS}`);
  
  if (errors.length > 0) {
    return { error: true, messages: errors };
  }

  // 2. Base Calculation
  const baseGuideFee = CUSTOM_BASE_FEE * pax;
  const stopsFee = (CUSTOM_PER_STOP * numStops) * pax;
  const subtotal = baseGuideFee + stopsFee;

  // 3. Discount
  let discount = 0;
  const promo = PROMO_CODES[promoCode.toUpperCase()];
  if (promo) {
    if (promo.type === 'percent') {
      discount = subtotal * promo.value;
    } else if (promo.type === 'flat') {
      discount = promo.value;
    }
  }
  
  // Prevent negative subtotal
  let discountedSubtotal = subtotal - discount;
  if (discountedSubtotal < 0) discountedSubtotal = 0;

  // 4. Service Fee (Calculated from discounted subtotal)
  const serviceFee = discountedSubtotal * SERVICE_FEE_RATE;

  // 5. Total
  const total = discountedSubtotal + serviceFee;

  return {
    error: false,
    pax,
    numStops,
    baseGuideFee,
    stopsFee,
    subtotal,
    discountAmount: discount,
    promoApplied: !!promo,
    serviceFee,
    total
  };
}

/**
 * Formats IDR currency
 * @param {number} amount 
 * @returns {string} Formatted string e.g., "Rp 350.000"
 */
export function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}
