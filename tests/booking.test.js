import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransition, canReview, validateReview, escapeHtml } from '../js/logic.js';

// Minimal localStorage mock so store.js can run under Node
const mem = new Map();
globalThis.localStorage = {
    getItem: k => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: k => mem.delete(k),
};
const { store } = await import('../js/store.js');

const guide = { id: 1, name: 'Wayan Dharma' };
const newBooking = () => store.addBooking({ guide, pax: 2, stops: ['Tanah Lot Temple'], cost: { total: 1 } });
const get = id => store.getBookings().find(b => b.id === id);
const goodReview = { rating: 5, text: 'Wonderful guide, very knowledgeable.' };

test('canTransition follows booking lifecycle', () => {
    assert.ok(canTransition('Pending', 'Accepted'));
    assert.ok(canTransition('Pending', 'Declined'));
    assert.ok(canTransition('Accepted', 'Completed'));
    assert.ok(canTransition('Confirmed', 'Cancelled')); // legacy data
    assert.ok(!canTransition('Pending', 'Completed'));
    assert.ok(!canTransition('Cancelled', 'Accepted'));
    assert.ok(!canTransition('Completed', 'Cancelled'));
    assert.ok(!canTransition('Unknown', 'Accepted'));
});

test('canReview only for completed, unreviewed bookings', () => {
    assert.ok(canReview({ status: 'Completed' }));
    assert.ok(!canReview({ status: 'Completed', review: {} }));
    assert.ok(!canReview({ status: 'Accepted' }));
    assert.ok(!canReview(undefined));
});

test('validateReview checks rating and text length', () => {
    assert.ok(validateReview(goodReview).valid);
    assert.equal(validateReview({ rating: 0, text: goodReview.text }).valid, false);
    assert.equal(validateReview({ rating: 3.5, text: goodReview.text }).valid, false);
    assert.equal(validateReview({ rating: 4, text: '   short  ' }).valid, false);
    assert.equal(validateReview({ rating: 4, text: 'x'.repeat(501) }).valid, false);
    assert.equal(validateReview().valid, false);
});

test('escapeHtml neutralises markup', () => {
    assert.equal(escapeHtml('<img src=x onerror="a()">'), '&lt;img src=x onerror=&quot;a()&quot;&gt;');
    assert.equal(escapeHtml(null), '');
});

test('store: new booking is Pending, guide accepts, completes, traveler reviews', () => {
    const b = newBooking();
    assert.equal(b.status, 'Pending');
    assert.equal(store.reviewBooking(b.id, goodReview), false, 'cannot review before completion');
    assert.equal(store.setBookingStatus(b.id, 'Completed'), false, 'cannot skip Accepted');
    assert.ok(store.setBookingStatus(b.id, 'Accepted'));
    assert.ok(store.setBookingStatus(b.id, 'Completed'));
    assert.equal(store.reviewBooking(b.id, { rating: 9, text: goodReview.text }), false);
    assert.ok(store.reviewBooking(b.id, goodReview));
    assert.equal(store.reviewBooking(b.id, goodReview), false, 'only one review');
    assert.equal(get(b.id).review.rating, 5);
    const reviews = store.getUserReviews(1);
    assert.ok(reviews.some(r => r.text === goodReview.text));
    assert.equal(store.getUserReviews(2).length, 0);
});

test('store: cancel and decline rules', () => {
    const a = newBooking();
    assert.ok(store.cancelBooking(a.id));
    assert.equal(get(a.id).status, 'Cancelled');
    assert.equal(store.setBookingStatus(a.id, 'Accepted'), false);

    const d = newBooking();
    assert.ok(store.setBookingStatus(d.id, 'Declined'));
    assert.equal(store.cancelBooking(d.id), false);
    assert.equal(store.cancelBooking('BKG-NOPE'), false);
});

test('store: corrupted storage falls back to defaults', () => {
    localStorage.setItem('jejak_nusantara_data', '{not json');
    assert.deepEqual(store.getBookings(), []);
    assert.equal(store.getUser(), null);
});
