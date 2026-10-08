// Static seed data for Jejak Nusantara.
// Destinations are chosen by the traveler; guides only declare the region they cover.

export const SERVICE_FEE_RATE = 0.10;
export const CUSTOM_BASE_FEE = 300000;  // guide fee per person, custom trip
export const CUSTOM_PER_STOP = 150000;  // per destination, per person
export const MAX_PAX = 8;
export const MAX_STOPS = 8;

export const PROMO_CODES = {
  BUDAYA2026: { type: 'percent', value: 0.10, label: '10% off' },
  NUSANTARA50: { type: 'flat', value: 50000, label: 'IDR 50,000 off' },
};

export const REGIONS = [
  { name: 'Bali', tagline: 'Island of the Gods', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=70' },
  { name: 'Yogyakarta', tagline: 'Heart of Javanese culture', image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=900&q=70' },
  { name: 'Jakarta', tagline: 'Old town, new stories', image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=900&q=70' },
  { name: 'Toraja', tagline: 'Land of the ancestors', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=900&q=70' },
];

export const DEST_CATALOG = {
  Bali: ['Tanah Lot Temple', 'Uluwatu Temple', 'Tirta Empul', 'Tegallalang Rice Terrace', 'Ubud Royal Palace', 'Besakih Temple', 'Penglipuran Village', 'Kintamani Volcano', 'Ubud Art Market', 'Sekumpul Waterfall'],
  Yogyakarta: ['Borobudur Temple', 'Prambanan Temple', 'Kraton Palace', 'Taman Sari', 'Malioboro Street', 'Kotagede Silver Village', 'Merapi Lava Tour', 'Parangtritis Beach', 'Giriloyo Batik Village'],
  Jakarta: ['Kota Tua (Old Town)', 'National Monument (Monas)', 'Istiqlal Mosque', 'Sunda Kelapa Harbour', 'National Museum', 'Setu Babakan Betawi Village', 'Glodok Chinatown'],
  Toraja: ['Kete Kesu Village', 'Lemo Cliff Graves', 'Londa Burial Caves', 'Batutumonga Highlands', 'Pasar Bolu Market', 'Palawa Traditional House', 'Tilanga Natural Pool'],
};

export const CATEGORIES = ['Heritage', 'Temple', 'Culinary', 'Village', 'Art'];
export const LANGUAGES = ['English', 'Japanese', 'Mandarin', 'German', 'French', 'Dutch'];

const face = (id) => `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&q=70`;

export const GUIDES = [
  {
    id: 1, name: 'Wayan Dharma', region: 'Bali', categories: ['Temple', 'Heritage'],
    rating: 4.9, reviewCount: 127, languages: ['English', 'Japanese'], years: 15,
    verified: true, ambassador: true, photo: face('photo-1506794778202-cad84cf45f1d'),
    attire: 'Balinese udeng & kamen',
    bio: 'Born in Ubud, I have shared the sacred stories of Balinese temples for 15 years. I wear traditional udeng and kamen on every tour and explain the meaning of each offering you see.',
    packages: [
      { id: 'w1', name: 'Sacred Temples of Ubud', hours: 4, price: 750000, stops: ['Tirta Empul', 'Ubud Royal Palace', 'Tegallalang Rice Terrace'] },
      { id: 'w2', name: 'Sunset at Uluwatu & Kecak', hours: 5, price: 950000, stops: ['Uluwatu Temple'] },
    ],
    reviews: [
      { name: 'Emma', from: 'Berlin, Germany', rating: 5, text: 'Wayan made temples come alive. Every story felt personal.', date: '2026-09-02' },
      { name: 'Takeshi', from: 'Tokyo, Japan', rating: 5, text: 'Fluent Japanese and very patient. Highly recommended.', date: '2026-08-14' },
    ],
  },
  {
    id: 2, name: 'Siti Rahayu', region: 'Yogyakarta', categories: ['Heritage', 'Art'],
    rating: 4.8, reviewCount: 98, languages: ['English', 'German'], years: 9,
    verified: true, ambassador: true, photo: face('photo-1494790108377-be9c29b29330'),
    attire: 'Javanese kebaya & batik',
    bio: 'A Javanese cultural historian focused on the Mataram kingdom. I guide in kebaya and batik, and I love teaching guests the philosophy hidden in batik motifs.',
    packages: [
      { id: 's1', name: 'Borobudur Sunrise Wisdom', hours: 5, price: 900000, stops: ['Borobudur Temple'] },
      { id: 's2', name: 'Kraton & Batik Heritage', hours: 6, price: 1100000, stops: ['Kraton Palace', 'Taman Sari', 'Giriloyo Batik Village'] },
    ],
    reviews: [
      { name: 'Sarah', from: 'Melbourne, Australia', rating: 5, text: 'Siti explained batik symbols beautifully. A true ambassador.', date: '2026-09-10' },
    ],
  },
  {
    id: 3, name: 'Komang Suryadi', region: 'Bali', categories: ['Culinary', 'Village'],
    rating: 4.7, reviewCount: 85, languages: ['English'], years: 6,
    verified: true, ambassador: false, photo: face('photo-1500648767791-00dcc994a43e'),
    attire: 'Balinese casual adat',
    bio: 'Spice lover from Gianyar. I take you to local warungs, morning markets and family kitchens beyond the tourist trail.',
    packages: [
      { id: 'k1', name: 'Bali Spice & Market Trail', hours: 4, price: 650000, stops: ['Ubud Art Market', 'Penglipuran Village'] },
    ],
    reviews: [
      { name: 'Marco', from: 'Rome, Italy', rating: 5, text: 'Best food day of my life. Komang knows everyone!', date: '2026-07-22' },
    ],
  },
  {
    id: 4, name: 'Ratna Dewi', region: 'Jakarta', categories: ['Heritage', 'Culinary'],
    rating: 4.9, reviewCount: 156, languages: ['English', 'Mandarin', 'Dutch'], years: 11,
    verified: true, ambassador: true, photo: face('photo-1438761681033-6461ffad8d80'),
    attire: 'Betawi kebaya encim',
    bio: 'Betawi storyteller. I reveal Batavia\'s colonial past, Chinatown legends and the flavours of Betawi cuisine — in kebaya encim.',
    packages: [
      { id: 'r1', name: 'Batavia Old Town Stories', hours: 4, price: 600000, stops: ['Kota Tua (Old Town)', 'Sunda Kelapa Harbour'] },
      { id: 'r2', name: 'Glodok Food & Temple Walk', hours: 3, price: 500000, stops: ['Glodok Chinatown'] },
    ],
    reviews: [
      { name: 'Chen Wei', from: 'Shanghai, China', rating: 5, text: 'Ratna speaks perfect Mandarin. Glodok tour was fantastic.', date: '2026-09-18' },
    ],
  },
  {
    id: 5, name: 'Andi Mappanyukki', region: 'Toraja', categories: ['Village', 'Heritage'],
    rating: 4.8, reviewCount: 64, languages: ['English', 'Dutch'], years: 12,
    verified: true, ambassador: true, photo: face('photo-1507003211169-0a1dd7228f2d'),
    attire: 'Torajan pa\'tannun weave',
    bio: 'Descendant of a Torajan noble family. I explain tongkonan houses, Rambu Solo ceremonies and ancestral beliefs with respect and depth.',
    packages: [
      { id: 'a1', name: 'Tongkonan & Ancestral Graves', hours: 7, price: 1300000, stops: ['Kete Kesu Village', 'Lemo Cliff Graves', 'Londa Burial Caves'] },
    ],
    reviews: [
      { name: 'Jessica', from: 'New York, USA', rating: 5, text: 'Deep, respectful and moving. Andi is a gem.', date: '2026-08-30' },
    ],
  },
  {
    id: 6, name: 'Luh Putu Ayu', region: 'Bali', categories: ['Art', 'Village'],
    rating: 4.6, reviewCount: 72, languages: ['English', 'French'], years: 5,
    verified: true, ambassador: false, photo: face('photo-1544005313-94ddf0286df2'),
    attire: 'Balinese kebaya',
    bio: 'Legong dancer and painter. I introduce guests to Balinese dance, painting villages and artisan workshops.',
    packages: [
      { id: 'l1', name: 'Art Villages of Ubud', hours: 5, price: 800000, stops: ['Ubud Art Market', 'Ubud Royal Palace'] },
    ],
    reviews: [
      { name: 'Claire', from: 'Lyon, France', rating: 4, text: 'Lovely day, great dance lesson. Merci Ayu!', date: '2026-06-11' },
    ],
  },
];
