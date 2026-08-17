/**
 * Shared random world-flight data generator. Used by the MongoDB seed script
 * and by the in-memory fallback store so both backends produce the same shape.
 */

const AIRPORTS = [
  { city: 'New York', country: 'United States', code: 'JFK', airport: 'John F. Kennedy Intl' },
  { city: 'Los Angeles', country: 'United States', code: 'LAX', airport: 'Los Angeles Intl' },
  { city: 'Chicago', country: 'United States', code: 'ORD', airport: "O'Hare Intl" },
  { city: 'San Francisco', country: 'United States', code: 'SFO', airport: 'San Francisco Intl' },
  { city: 'Miami', country: 'United States', code: 'MIA', airport: 'Miami Intl' },
  { city: 'London', country: 'United Kingdom', code: 'LHR', airport: 'Heathrow' },
  { city: 'Paris', country: 'France', code: 'CDG', airport: 'Charles de Gaulle' },
  { city: 'Frankfurt', country: 'Germany', code: 'FRA', airport: 'Frankfurt Intl' },
  { city: 'Amsterdam', country: 'Netherlands', code: 'AMS', airport: 'Schiphol' },
  { city: 'Madrid', country: 'Spain', code: 'MAD', airport: 'Barajas' },
  { city: 'Rome', country: 'Italy', code: 'FCO', airport: 'Leonardo da Vinci' },
  { city: 'Istanbul', country: 'Turkey', code: 'IST', airport: 'Istanbul Intl' },
  { city: 'Dubai', country: 'United Arab Emirates', code: 'DXB', airport: 'Dubai Intl' },
  { city: 'Doha', country: 'Qatar', code: 'DOH', airport: 'Hamad Intl' },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', code: 'AUH', airport: 'Zayed Intl' },
  { city: 'Tokyo', country: 'Japan', code: 'HND', airport: 'Haneda' },
  { city: 'Seoul', country: 'South Korea', code: 'ICN', airport: 'Incheon Intl' },
  { city: 'Beijing', country: 'China', code: 'PEK', airport: 'Capital Intl' },
  { city: 'Shanghai', country: 'China', code: 'PVG', airport: 'Pudong Intl' },
  { city: 'Hong Kong', country: 'Hong Kong', code: 'HKG', airport: 'Hong Kong Intl' },
  { city: 'Singapore', country: 'Singapore', code: 'SIN', airport: 'Changi' },
  { city: 'Bangkok', country: 'Thailand', code: 'BKK', airport: 'Suvarnabhumi' },
  { city: 'Delhi', country: 'India', code: 'DEL', airport: 'Indira Gandhi Intl' },
  { city: 'Mumbai', country: 'India', code: 'BOM', airport: 'Chhatrapati Shivaji' },
  { city: 'Karachi', country: 'Pakistan', code: 'KHI', airport: 'Jinnah Intl' },
  { city: 'Lahore', country: 'Pakistan', code: 'LHE', airport: 'Allama Iqbal Intl' },
  { city: 'Islamabad', country: 'Pakistan', code: 'ISB', airport: 'Islamabad Intl' },
  { city: 'Sydney', country: 'Australia', code: 'SYD', airport: 'Kingsford Smith' },
  { city: 'Melbourne', country: 'Australia', code: 'MEL', airport: 'Tullamarine' },
  { city: 'Auckland', country: 'New Zealand', code: 'AKL', airport: 'Auckland Intl' },
  { city: 'Toronto', country: 'Canada', code: 'YYZ', airport: 'Pearson Intl' },
  { city: 'Vancouver', country: 'Canada', code: 'YVR', airport: 'Vancouver Intl' },
  { city: 'Mexico City', country: 'Mexico', code: 'MEX', airport: 'Benito Juárez' },
  { city: 'Sao Paulo', country: 'Brazil', code: 'GRU', airport: 'Guarulhos' },
  { city: 'Buenos Aires', country: 'Argentina', code: 'EZE', airport: 'Ministro Pistarini' },
  { city: 'Cairo', country: 'Egypt', code: 'CAI', airport: 'Cairo Intl' },
  { city: 'Lagos', country: 'Nigeria', code: 'LOS', airport: 'Murtala Muhammed' },
  { city: 'Johannesburg', country: 'South Africa', code: 'JNB', airport: 'O. R. Tambo' },
  { city: 'Nairobi', country: 'Kenya', code: 'NBO', airport: 'Jomo Kenyatta' },
  { city: 'Moscow', country: 'Russia', code: 'SVO', airport: 'Sheremetyevo' },
  { city: 'Warsaw', country: 'Poland', code: 'WAW', airport: 'Chopin' },
  { city: 'Athens', country: 'Greece', code: 'ATH', airport: 'Eleftherios Venizelos' },
  { city: 'Lisbon', country: 'Portugal', code: 'LIS', airport: 'Humberto Delgado' },
  { city: 'Vienna', country: 'Austria', code: 'VIE', airport: 'Schwechat' },
  { city: 'Zurich', country: 'Switzerland', code: 'ZRH', airport: 'Zurich Intl' },
  { city: 'Stockholm', country: 'Sweden', code: 'ARN', airport: 'Arlanda' },
  { city: 'Oslo', country: 'Norway', code: 'OSL', airport: 'Gardermoen' },
  { city: 'Helsinki', country: 'Finland', code: 'HEL', airport: 'Vantaa' },
  { city: 'Manila', country: 'Philippines', code: 'MNL', airport: 'Ninoy Aquino' },
  { city: 'Jakarta', country: 'Indonesia', code: 'CGK', airport: 'Soekarno-Hatta' },
  { city: 'Kuala Lumpur', country: 'Malaysia', code: 'KUL', airport: 'Kuala Lumpur Intl' },
  { city: 'Ho Chi Minh City', country: 'Vietnam', code: 'SGN', airport: 'Tan Son Nhat' },
  { city: 'Taipei', country: 'Taiwan', code: 'TPE', airport: 'Taoyuan' },
  { city: 'Copenhagen', country: 'Denmark', code: 'CPH', airport: 'Kastrup' },
  { city: 'Munich', country: 'Germany', code: 'MUC', airport: 'Franz Josef Strauss' },
  { city: 'Barcelona', country: 'Spain', code: 'BCN', airport: 'El Prat' },
  { city: 'Prague', country: 'Czech Republic', code: 'PRG', airport: 'Václav Havel' },
  { city: 'Berlin', country: 'Germany', code: 'BER', airport: 'Brandenburg' },
];

const AIRLINES = [
  'American Airlines', 'Delta Airlines', 'United Airlines', 'Emirates',
  'Qatar Airways', 'British Airways', 'Lufthansa', 'Air France',
  'Singapore Airlines', 'Turkish Airlines', 'Etihad Airways', 'Cathay Pacific',
  'Japan Airlines', 'KLM Royal Dutch', 'Pakistan International Airlines',
  'Qantas', 'Air Canada', 'Aeroflot', 'Ethiopian Airlines', 'Air India',
];

const CABIN_CLASSES = ['Economy', 'Business', 'First'];
const GATES = 'ABCDEF'.split('');

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function durationLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

function makeFlight(origin, destination, startDaysFromNow) {
  const airline = pick(AIRLINES);
  const airlineCode = airline
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const flightNumber = `${airlineCode}${rand(100, 9999)}`;

  const departure = new Date();
  departure.setDate(departure.getDate() + startDaysFromNow);
  departure.setHours(rand(0, 23), rand(0, 59), 0, 0);

  const durationMinutes = rand(120, 900);
  const arrival = new Date(departure.getTime() + durationMinutes * 60000);

  return {
    flightNumber,
    airline,
    origin,
    destination,
    departureTime: departure,
    arrivalTime: arrival,
    durationMinutes,
    durationLabel: durationLabel(durationMinutes),
    price: rand(90, 1400),
    currency: 'USD',
    cabinClass: pick(CABIN_CLASSES),
    seatsAvailable: rand(4, 240),
    gate: `${pick(GATES)}${rand(1, 30)}`,
  };
}

module.exports = { AIRPORTS, AIRLINES, CABIN_CLASSES, rand, pick, makeFlight, durationLabel };
