// store.js - Handles localStorage persistence and current state
import { canTransition, canReview, validateReview } from './logic.js';

const STORE_KEY = 'jejak_nusantara_data';

// Default initial state
const defaultState = {
  user: null, // e.g., { name: 'Demitri', email: 'demitri@example.com' }
  bookings: [], // Array of booking objects
  currentTripDraft: null, // Temporary storage when building a trip
};

// Initialize store if empty
function initStore() {
  const data = localStorage.getItem(STORE_KEY);
  if (!data) {
    saveState(defaultState);
  }
}

// Get the entire state
function getState() {
  try {
    const data = JSON.parse(localStorage.getItem(STORE_KEY));
    return data ? { ...structuredClone(defaultState), ...data } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

// Save the entire state
function saveState(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

// ====================
// Specific Actions
// ====================

export const store = {
  // User Management
  login(userData) {
    const state = getState();
    state.user = userData;
    saveState(state);
  },
  
  logout() {
    const state = getState();
    state.user = null;
    saveState(state);
  },
  
  getUser() {
    return getState().user;
  },

  // Trip Draft Management
  saveTripDraft(draft) {
    const state = getState();
    state.currentTripDraft = draft;
    saveState(state);
  },

  getTripDraft() {
    return getState().currentTripDraft;
  },

  clearTripDraft() {
    const state = getState();
    state.currentTripDraft = null;
    saveState(state);
  },

  // Booking Management
  addBooking(booking) {
    const state = getState();
    // Generate a simple ID
    booking.id = 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    booking.dateCreated = new Date().toISOString();
    booking.status = 'Pending';
    
    state.bookings.push(booking);
    saveState(state);
    return booking;
  },

  getBookings() {
    return getState().bookings;
  },

  cancelBooking(bookingId) {
    return this.setBookingStatus(bookingId, 'Cancelled');
  },

  setBookingStatus(bookingId, status) {
    const state = getState();
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!booking || !canTransition(booking.status, status)) return false;
    booking.status = status;
    saveState(state);
    return true;
  },

  reviewBooking(bookingId, review) {
    const state = getState();
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!canReview(booking) || !validateReview(review).valid) return false;
    booking.review = { rating: review.rating, text: review.text.trim(), date: new Date().toISOString() };
    saveState(state);
    return true;
  },

  getUserReviews(guideId) {
    return getState().bookings
      .filter(b => b.guide.id === guideId && b.review)
      .map(b => ({ name: b.travelerName || 'Traveler', from: 'Jejak Nusantara user', ...b.review }));
  }
};

// Run initialization
initStore();
