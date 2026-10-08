import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTripCost, formatIDR } from '../js/logic.js';
import { CUSTOM_BASE_FEE, CUSTOM_PER_STOP, SERVICE_FEE_RATE } from '../js/data.js';

test('formatIDR formats currency correctly', () => {
    assert.match(formatIDR(350000), /Rp\s?350\.000/);
});

test('calculateTripCost validation', () => {
    let res = calculateTripCost(0, 1);
    assert.strictEqual(res.error, true);
    assert.match(res.messages[0], /Number of people must be between/);

    res = calculateTripCost(1, 9);
    assert.strictEqual(res.error, true);
    assert.match(res.messages[0], /Number of destinations must be between/);
});

test('calculateTripCost correct calculation without promo', () => {
    // 2 pax, 3 stops
    // base: 300k * 2 = 600k
    // stops: (150k * 3) * 2 = 900k
    // subtotal = 1.5m
    // service fee = 10% = 150k
    // total = 1.65m
    const res = calculateTripCost(2, 3);
    assert.strictEqual(res.error, false);
    assert.strictEqual(res.subtotal, 1500000);
    assert.strictEqual(res.serviceFee, 150000);
    assert.strictEqual(res.total, 1650000);
});

test('calculateTripCost correct calculation with flat promo', () => {
    // 1 pax, 1 stop
    // base: 300k
    // stops: 150k
    // subtotal: 450k
    // promo NUSANTARA50 = 50k flat
    // disc sub: 400k
    // fee: 40k
    // total: 440k
    const res = calculateTripCost(1, 1, 'NUSANTARA50');
    assert.strictEqual(res.error, false);
    assert.strictEqual(res.promoApplied, true);
    assert.strictEqual(res.discountAmount, 50000);
    assert.strictEqual(res.total, 440000);
});

test('calculateTripCost correct calculation with percent promo', () => {
    // 1 pax, 1 stop = 450k
    // BUDAYA2026 = 10% = 45k
    // disc sub = 405k
    // fee = 40.5k
    // total = 445.5k
    const res = calculateTripCost(1, 1, 'BUDAYA2026');
    assert.strictEqual(res.error, false);
    assert.strictEqual(res.promoApplied, true);
    assert.strictEqual(res.discountAmount, 45000);
    assert.strictEqual(res.total, 445500);
});
