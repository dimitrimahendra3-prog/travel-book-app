import { REGIONS, GUIDES, DEST_CATALOG, CATEGORIES } from './data.js';
import { calculateTripCost, formatIDR } from './logic.js';
import { store } from './store.js';

const appView = document.getElementById('app-view');

// Global state for explore filters
let exploreFilters = { region: '', category: '' };

function router() {
    let hash = window.location.hash.slice(1) || '/';
    
    if (hash === '/') return renderHome();
    if (hash === '/explore') return renderExplore();
    if (hash === '/bookings') return renderBookings();
    if (hash === '/profile') return renderProfile();
    if (hash === '/checkout') return renderCheckout();
    if (hash.startsWith('/confirmation')) return renderConfirmation(hash.split('/')[2]);
    if (hash.startsWith('/guide/')) return renderGuideProfile(hash.split('/')[2]);
    if (hash.startsWith('/build/')) return renderBuild(hash.split('/')[2]);

    renderHome();
}

function renderHome() {
    const regionCards = REGIONS.map(region => `
        <div class="glass-panel card">
            <div class="card-image-wrapper">
                <div class="card-image" style="background-image: url('${region.image}'); background-size: cover;"></div>
            </div>
            <h3>${region.name}</h3>
            <p>${region.tagline}</p>
            <a href="#/explore" onclick="setRegionFilter('${region.name}')" class="btn btn-glass" style="margin-top: 1rem; width: 100%; text-align: center; box-sizing: border-box;">Find Guides</a>
        </div>
    `).join('');

    appView.innerHTML = `
        <div class="glass-panel hero-section">
            <video autoplay loop muted playsinline class="hero-video">
                <source src="https://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4">
            </video>
            <h1>Discover Authentic Indonesia</h1>
            <p>Connect with curated local Cultural Ambassadors for personalized and flexible journeys.</p>
            <a href="#/explore" class="btn btn-primary">Start Exploring</a>
        </div>
        
        <h2>Featured Destinations</h2>
        <div class="grid-cards">
            ${regionCards}
        </div>
    `;
}

window.setRegionFilter = (region) => {
    exploreFilters.region = region;
};

function renderExplore() {
    const filteredGuides = GUIDES.filter(g => {
        if (exploreFilters.region && g.region !== exploreFilters.region) return false;
        if (exploreFilters.category && !g.categories.includes(exploreFilters.category)) return false;
        return true;
    });

    const guideCards = filteredGuides.map(guide => `
        <div class="glass-panel card">
            <div class="card-image-wrapper">
                <div class="card-image" style="background-image: url('${guide.photo}'); background-size: cover; background-position: center;"></div>
            </div>
            <h3>${guide.name}</h3>
            <p><strong>${guide.region}</strong> | ${guide.categories.join(', ')}</p>
            <p>⭐ ${guide.rating} (${guide.reviews ? guide.reviews.length : guide.reviewCount} reviews)</p>
            <p>${guide.bio.substring(0, 80)}...</p>
            <a href="#/guide/${guide.id}" class="btn btn-primary" style="margin-top: 1rem; width: 100%; text-align: center; box-sizing: border-box;">View Profile</a>
        </div>
    `).join('');

    appView.innerHTML = `
        <h2>Explore Guides & Destinations</h2>
        <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <div>
                    <label>Region:</label>
                    <select id="filter-region" class="glass-panel" style="padding: 0.5rem;">
                        <option value="">All Regions</option>
                        ${REGIONS.map(r => `<option value="${r.name}" ${exploreFilters.region === r.name ? 'selected' : ''}>${r.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label>Category:</label>
                    <select id="filter-category" class="glass-panel" style="padding: 0.5rem;">
                        <option value="">All Categories</option>
                        ${CATEGORIES.map(c => `<option value="${c}" ${exploreFilters.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                </div>
                <button id="btn-apply-filters" class="btn btn-glass">Apply</button>
            </div>
        </div>
        <div class="grid-cards">
            ${guideCards.length ? guideCards : '<p>No guides found matching your filters.</p>'}
        </div>
    `;

    document.getElementById('btn-apply-filters').addEventListener('click', () => {
        exploreFilters.region = document.getElementById('filter-region').value;
        exploreFilters.category = document.getElementById('filter-category').value;
        renderExplore();
    });
}

function renderGuideProfile(guideId) {
    const guide = GUIDES.find(g => g.id === parseInt(guideId));
    if (!guide) {
        appView.innerHTML = `<div class="glass-panel card"><h2>Guide not found</h2></div>`;
        return;
    }

    appView.innerHTML = `
        <div class="glass-panel" style="padding: 2rem;">
            <div style="display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap;">
                <img src="${guide.photo}" style="width: 200px; height: 200px; border-radius: 16px; object-fit: cover;">
                <div>
                    <h2>${guide.name}</h2>
                    <p><strong>Region:</strong> ${guide.region}</p>
                    <p><strong>Rating:</strong> ⭐ ${guide.rating} (${guide.reviewCount} reviews)</p>
                    <p><strong>Languages:</strong> ${guide.languages.join(', ')}</p>
                    <p><strong>Specialties:</strong> ${guide.categories.join(', ')}</p>
                </div>
            </div>
            <div style="margin-top: 2rem;">
                <h3>About ${guide.name}</h3>
                <p>${guide.bio}</p>
                
                <h3 style="margin-top: 1.5rem;">Sample Destinations</h3>
                <ul>
                    ${guide.packages ? guide.packages.map(p => `<li>${p.name} - ${formatIDR(p.price)}</li>`).join('') : '<li>Custom based on your preference</li>'}
                </ul>
                
                <a href="#/build/${guide.id}" class="btn btn-primary" style="margin-top: 2rem;">Build Your Custom Trip</a>
            </div>
        </div>
    `;
}

function renderBuild(guideId) {
    const guide = GUIDES.find(g => g.id === parseInt(guideId));
    const destinations = DEST_CATALOG[guide.region] || [];
    
    appView.innerHTML = `
        <h2>Build Trip with ${guide.name}</h2>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div>
                <div class="glass-panel" style="padding: 2rem; margin-bottom: 2rem;">
                    <h3>1. Number of People</h3>
                    <input type="number" id="build-pax" value="2" min="1" max="8" class="glass-panel" style="padding: 0.5rem; width: 100px;">
                </div>
                <div class="glass-panel" style="padding: 2rem;">
                    <h3>2. Choose Destinations</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                        ${destinations.map((d, i) => `
                            <label style="display: flex; align-items: center; gap: 0.5rem;">
                                <input type="checkbox" class="dest-checkbox" value="${d}"> ${d}
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div>
                <div class="glass-panel" style="padding: 2rem; position: sticky; top: 2rem;">
                    <h3>Trip Summary</h3>
                    <div id="build-summary">
                        <p>Select destinations to see price.</p>
                    </div>
                    <button id="btn-proceed" class="btn btn-primary" style="width: 100%; margin-top: 1rem;" disabled>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    `;

    const paxInput = document.getElementById('build-pax');
    const checkboxes = document.querySelectorAll('.dest-checkbox');
    const summaryDiv = document.getElementById('build-summary');
    const btnProceed = document.getElementById('btn-proceed');

    function updateSummary() {
        const pax = parseInt(paxInput.value) || 1;
        const selectedStops = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);
        
        if (selectedStops.length === 0) {
            summaryDiv.innerHTML = '<p>Select destinations to see price.</p>';
            btnProceed.disabled = true;
            return;
        }

        const cost = calculateTripCost(pax, selectedStops.length);
        if (cost.error) {
            summaryDiv.innerHTML = `<p style="color: red;">${cost.messages.join('<br>')}</p>`;
            btnProceed.disabled = true;
            return;
        }

        summaryDiv.innerHTML = `
            <p><strong>People:</strong> ${pax}</p>
            <p><strong>Destinations:</strong> ${selectedStops.length}</p>
            <p>Subtotal: ${formatIDR(cost.subtotal)}</p>
            <p>Service Fee: ${formatIDR(cost.serviceFee)}</p>
            <h3>Total: ${formatIDR(cost.total)}</h3>
        `;
        btnProceed.disabled = false;
        
        btnProceed.onclick = () => {
            store.saveTripDraft({
                guide,
                pax,
                stops: selectedStops,
                cost
            });
            window.location.hash = '/checkout';
        };
    }

    paxInput.addEventListener('change', updateSummary);
    checkboxes.forEach(c => c.addEventListener('change', updateSummary));
}

function renderCheckout() {
    const draft = store.getTripDraft();
    if (!draft) {
        window.location.hash = '/explore';
        return;
    }

    appView.innerHTML = `
        <h2>Checkout</h2>
        <div class="glass-panel" style="padding: 2rem;">
            <h3>Trip with ${draft.guide.name}</h3>
            <p><strong>People:</strong> ${draft.pax}</p>
            <p><strong>Destinations:</strong> ${draft.stops.join(', ')}</p>
            <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 1rem 0;">
            
            <div id="checkout-cost">
                <p>Subtotal: ${formatIDR(draft.cost.subtotal)}</p>
                <p>Service Fee: ${formatIDR(draft.cost.serviceFee)}</p>
                <h3>Total: ${formatIDR(draft.cost.total)}</h3>
            </div>
            
            <div style="margin-top: 2rem;">
                <input type="text" id="promo-code" placeholder="Promo Code" class="glass-panel" style="padding: 0.5rem;">
                <button id="btn-apply-promo" class="btn btn-glass">Apply</button>
            </div>
            
            <button id="btn-confirm" class="btn btn-primary" style="margin-top: 2rem; width: 100%;">Confirm Booking</button>
        </div>
    `;

    document.getElementById('btn-apply-promo').addEventListener('click', () => {
        const code = document.getElementById('promo-code').value;
        const newCost = calculateTripCost(draft.pax, draft.stops.length, code);
        if (!newCost.error) {
            draft.cost = newCost;
            store.saveTripDraft(draft); // Update draft with promo
            document.getElementById('checkout-cost').innerHTML = `
                <p>Subtotal: ${formatIDR(draft.cost.subtotal)}</p>
                ${newCost.promoApplied ? `<p style="color: #4ade80;">Discount: -${formatIDR(newCost.discountAmount)}</p>` : ''}
                <p>Service Fee: ${formatIDR(draft.cost.serviceFee)}</p>
                <h3>Total: ${formatIDR(draft.cost.total)}</h3>
            `;
            if(!newCost.promoApplied) alert('Invalid promo code');
        }
    });

    document.getElementById('btn-confirm').addEventListener('click', () => {
        const booking = store.addBooking({
            guide: draft.guide,
            pax: draft.pax,
            stops: draft.stops,
            cost: draft.cost
        });
        store.clearTripDraft();
        window.location.hash = '/confirmation/' + booking.id;
    });
}

function renderConfirmation(id) {
    appView.innerHTML = `
        <div class="glass-panel card" style="text-align: center; padding: 4rem 2rem;">
            <h2>🎉 Booking Confirmed!</h2>
            <p>Your booking ID is <strong>${id}</strong></p>
            <p>The Cultural Ambassador will contact you shortly.</p>
            <a href="#/bookings" class="btn btn-primary" style="margin-top: 2rem;">View Bookings</a>
        </div>
    `;
}

function renderBookings() {
    const bookings = store.getBookings();
    
    const bHtml = bookings.length === 0 ? `
        <p>You have no bookings.</p>
        <a href="#/explore" class="btn btn-primary">Find a Guide</a>
    ` : bookings.reverse().map(b => `
        <div class="glass-panel card" style="margin-bottom: 1rem;">
            <h3>Booking ID: ${b.id}</h3>
            <p><strong>Guide:</strong> ${b.guide.name}</p>
            <p><strong>Status:</strong> <span style="color: ${b.status === 'Cancelled' ? '#f87171' : '#4ade80'};">${b.status}</span></p>
            <p><strong>Date Booked:</strong> ${new Date(b.dateCreated).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ${formatIDR(b.cost.total)}</p>
            ${b.status !== 'Cancelled' ? `<button class="btn btn-glass" onclick="cancelBkg('${b.id}')" style="margin-top: 1rem;">Cancel Booking</button>` : ''}
        </div>
    `).join('');

    appView.innerHTML = `
        <h2>My Bookings</h2>
        ${bHtml}
    `;
}

window.cancelBkg = (id) => {
    if(confirm('Are you sure you want to cancel this booking?')) {
        store.cancelBooking(id);
        renderBookings();
    }
};

function renderProfile() {
    const user = store.getUser();
    
    if (!user) {
        appView.innerHTML = `
            <h2>Profile</h2>
            <div class="glass-panel card">
                <p>You are not logged in.</p>
                <button id="btn-login-cust" class="btn btn-primary" style="margin-right: 1rem;">Login as Customer</button>
                <button id="btn-login-guide" class="btn btn-glass">Login as Guide</button>
            </div>
        `;
        document.getElementById('btn-login-cust').onclick = () => {
            store.login({ name: 'Guest Traveler', role: 'customer' });
            renderProfile();
        };
        document.getElementById('btn-login-guide').onclick = () => {
            store.login({ name: 'Wayan Dharma', role: 'guide', guideId: 1 });
            renderProfile();
        };
        return;
    }

    if (user.role === 'guide') {
        const b = store.getBookings().filter(bk => bk.guide.id === user.guideId);
        appView.innerHTML = `
            <h2>Guide Dashboard</h2>
            <div class="glass-panel" style="padding: 2rem; margin-bottom: 2rem;">
                <h3>Welcome back, ${user.name}</h3>
                <button id="btn-logout" class="btn btn-glass" style="margin-top: 1rem;">Logout</button>
            </div>
            <h3>Received Bookings</h3>
            ${b.length === 0 ? '<p>No bookings yet.</p>' : b.map(bk => `
                <div class="glass-panel card">
                    <p><strong>ID:</strong> ${bk.id}</p>
                    <p><strong>Status:</strong> ${bk.status}</p>
                    <p><strong>Pax:</strong> ${bk.pax} | <strong>Stops:</strong> ${bk.stops.length}</p>
                    <p><strong>Earnings:</strong> ${formatIDR(bk.cost.subtotal)}</p>
                </div>
            `).join('')}
        `;
    } else {
        appView.innerHTML = `
            <h2>Customer Profile</h2>
            <div class="glass-panel" style="padding: 2rem;">
                <h3>Welcome, ${user.name}</h3>
                <button id="btn-logout" class="btn btn-glass" style="margin-top: 1rem;">Logout</button>
            </div>
        `;
    }

    document.getElementById('btn-logout').onclick = () => {
        store.logout();
        renderProfile();
    };
}

// Listen for hash changes
window.addEventListener('hashchange', router);

// Initial load
window.addEventListener('load', router);
