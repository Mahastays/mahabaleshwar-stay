const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const Explore = require('./models/exploreModel');

// Use Google DNS to resolve MongoDB Atlas SRV records
// (fixes issues on networks that block SRV lookups)
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const places = [
  {
    name: 'Venna Lake',
    slug: 'venna-lake',
    tagline: 'The Heart of Mahabaleshwar',
    category: 'Lake',
    description:
      'Venna Lake is the most popular and beautiful artificial lake in Mahabaleshwar. Surrounded by dense forests and lush greenery, it is the perfect spot for boating, horse riding, and watching the misty Sahyadri hills. The lake is named after the Venna River and was built in 1942. It\'s the social hub of Mahabaleshwar — stalls selling fresh strawberries, corn, and local snacks line the shores.',
    history:
      'Venna Lake was constructed in 1942 by Shri Appasaheb Maharaj of Satara for the purpose of providing water to Mahabaleshwar. The lake covers approximately 28 acres and has since become the most iconic recreational spot of the hill station. The British who made Mahabaleshwar their summer capital frequently visited the lake, and colonial-era boathouses still stand around its banks.',
    images: [
      'https://images.unsplash.com/photo-1609766857865-d1c8e0b3c0b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    ],
    bestTime: 'October to June. Monsoon (July–Sept) closes boating but makes the lake breathtakingly scenic.',
    thingsToDo: [
      'Paddle & speed boating on the lake',
      'Horse riding along the shores',
      'Strawberry picking at nearby farms',
      'Shopping at the local market stalls',
      'Photography during golden hour',
    ],
    entryFee: 'Free (Boating: ₹80–₹150 per ride)',
    distance: '2 km from main market',
    isFeatured: true,
  },
  {
    name: 'Pratapgad Fort',
    slug: 'pratapgad-fort',
    tagline: 'Where Shivaji\'s Legend Was Born',
    category: 'Fort',
    description:
      'Pratapgad Fort is a mountain fort located about 24 km from Mahabaleshwar and is one of the most historically significant forts in Maharashtra. It was here that the legendary Maratha king Chhatrapati Shivaji Maharaj defeated the Adilshahi general Afzal Khan in 1659 — a pivotal battle that shaped the course of Maratha history. The fort stands at 1,080 metres above sea level and offers sweeping views of the Sahyadri ranges.',
    history:
      'Built in 1656 under the orders of Chhatrapati Shivaji Maharaj, the fort was strategically constructed to control the Par pass — a key route in the Sahyadris. The fort is divided into an upper fort (madhala killa) and a lower fort. The famous meeting between Shivaji and Afzal Khan took place at the base of this fort on November 10, 1659. A statue of Shivaji Maharaj erected in 1957 by Prime Minister Jawaharlal Nehru stands at the fort today.',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
    ],
    bestTime: 'November to February for clear skies. Avoid monsoon as roads get slippery.',
    thingsToDo: [
      'Visit the Goddess Bhavani temple inside the fort',
      'See the Afzal Khan\'s tomb at the base',
      'Trek up the steps to the upper battlement',
      'Enjoy panoramic valley views',
      'Photography of the historic cannons',
    ],
    entryFee: '₹15 for Indians, ₹200 for foreigners',
    distance: '24 km from Mahabaleshwar',
    isFeatured: true,
  },
  {
    name: 'Arthur\'s Seat',
    slug: 'arthurs-seat',
    tagline: 'Queen of All Points',
    category: 'Viewpoint',
    description:
      'Arthur\'s Seat is the most famous viewpoint in Mahabaleshwar, perched at a dramatic cliff edge at 1,470 metres. Often called the "Queen of All Points," it offers a stunning, near-vertical drop of about 600 metres into the Savitri River valley below. On a clear day, you can see straight to Raigad Fort. On windy days, legends say you can toss a hat and the upward air current will bring it back up.',
    history:
      'Named after Sir Arthur Malet who built the first bungalow on this cliff in the colonial era, Arthur\'s Seat has been a celebrated viewpoint since the British made Mahabaleshwar their summer retreat. The viewpoint was developed during the British Raj and the famous "returning hat" phenomenon has been documented since the 1800s. The nearby Echo Point adds to the mystique of this dramatic escarpment.',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    ],
    bestTime: 'October to May. Avoid monsoon due to fog and dangerous conditions.',
    thingsToDo: [
      'Witness the famous "hat returning" wind phenomenon',
      'Spot Raigad Fort on clear days',
      'Visit nearby Echo Point',
      'Watch the Savitri River 600m below',
      'Sunrise photography',
    ],
    entryFee: 'Free',
    distance: '12 km from main market',
    isFeatured: true,
  },
  {
    name: 'Elephant\'s Head Point',
    slug: 'elephants-head-point',
    tagline: 'Nature\'s Greatest Sculpture',
    category: 'Viewpoint',
    description:
      'Elephant\'s Head Point, also known as Needle Hole Point, is one of the most unique viewpoints in Mahabaleshwar. Here, a rocky formation juts out like the head and trunk of an elephant over the valley — a stunning natural sculpture crafted by centuries of wind and rain. The viewpoint is dramatically situated at the edge of the Western Ghats and offers breathtaking views of the Krishna River valley.',
    history:
      'Elephant\'s Head Point has been a landmark of Mahabaleshwar since British times. The natural rock formation fascinated colonial visitors who documented it extensively. The nearby Needle Hole — a natural arch in the cliff face — was considered an engineering marvel by early British surveyors. The point is located on the famed "Bombay Point circuit" created during the British Raj.',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    ],
    bestTime: 'October to June. Best at sunrise for clear valley views.',
    thingsToDo: [
      'Spot the elephant trunk rock formation',
      'Photography of the Needle Hole arch',
      'Valley views of the Krishna basin',
      'Short trek along the cliff path',
      'Watch eagles soaring below your feet',
    ],
    entryFee: 'Free',
    distance: '9 km from main market',
    isFeatured: false,
  },
  {
    name: 'Mapro Garden',
    slug: 'mapro-garden',
    tagline: 'Strawberry Heaven of the Sahyadris',
    category: 'Nature',
    description:
      'Mapro Garden is not just a garden — it is an experience. Home to the famous Mapro Foods brand, this sprawling garden near Panchgani is the go-to destination for strawberry lovers. Walk through acres of strawberry farms, enjoy freshly-made strawberry crushes, chocolates, jams, and the famous Mapro milkshakes. The garden also has a large food court, a kids\' play area, and the iconic strawberry fountain.',
    history:
      'Mapro Foods Pvt. Ltd. was founded in 1959 by Kishore Vora. The company started making fruit-based products from the abundant strawberries grown in the Mahabaleshwar-Panchgani belt. Over the decades, Mapro became a household name in Maharashtra, and the Mapro Garden opened to the public as a tourist attraction showcasing the brand\'s heritage and the region\'s agricultural legacy.',
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=1200&q=80',
    ],
    bestTime: 'November to May (Strawberry season peaks Dec–Feb). Avoid monsoon.',
    thingsToDo: [
      'Fresh strawberry picking in the fields',
      'Try the legendary Mapro strawberry milkshake',
      'Buy jams, chocolates, and crush bottles',
      'Walk through the rose garden',
      'Kids\' play area and souvenir shopping',
    ],
    entryFee: 'Free entry (purchases are extra)',
    distance: '15 km from Mahabaleshwar (near Panchgani)',
    isFeatured: true,
  },
  {
    name: 'Panchganga Temple',
    slug: 'panchganga-temple',
    tagline: 'The Sacred Source of Five Rivers',
    category: 'Temple',
    description:
      'The ancient Panchganga Temple is one of the most sacred sites in Mahabaleshwar. It is believed to be the source of five holy rivers — Krishna, Venna, Koyna, Gayatri, and Savitri — all originating from the mouth of a stone cow\'s head (Gomukh) inside the temple. The temple is an important pilgrimage site and is steeped in mythological significance. The confluence of these rivers makes it spiritually powerful.',
    history:
      'The original temple is estimated to be over 1,000 years old and dedicated to Lord Shiva and Vishnu. The Panchganga temple predates British settlement in Mahabaleshwar by centuries. According to ancient Hindu texts, this is the "Kshetra" from which the rivers of the Deccan are born. The temple was rebuilt multiple times, most recently under Maratha patronage. It remains one of the holiest spots in the Sahyadris.',
    images: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1200&q=80',
    ],
    bestTime: 'Year-round. Kartik Purnima (October–November) is the most auspicious time.',
    thingsToDo: [
      'Witness the five rivers emerging from a single stone Gomukh',
      'Attend the morning aarti',
      'Visit the adjacent old Mahabaleshwar temple',
      'Explore the ancient stone carvings',
      'Take a sacred dip in the temple tank',
    ],
    entryFee: 'Free',
    distance: '6 km from main market (Old Mahabaleshwar)',
    isFeatured: false,
  },
  {
    name: 'Wilson Point (Sunrise Point)',
    slug: 'wilson-point',
    tagline: 'Highest Peak — First Light',
    category: 'Viewpoint',
    description:
      'Wilson Point, also known as Sunrise Point, is the highest point in Mahabaleshwar at 1,439 metres above sea level. It is the only viewpoint from which both sunrise and sunset can be witnessed. At dawn, the entire landscape is painted in hues of gold and crimson as the sun rises over the Eastern Ghats. The 360-degree panoramic view from this point is simply unmatched in the region.',
    history:
      'Named after Sir Leslie Wilson, the Governor of Bombay (1923–1926), this peak has been significant since the colonial period. The British Raj established Mahabaleshwar as its official summer retreat in 1828, and Wilson Point became the centrepiece of the hill station\'s identity. Numerous historical photographs from the 1800s show British officers at this point admiring the views. It remains the highest accessible point in Mahabaleshwar.',
    images: [
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=1200&q=80',
    ],
    bestTime: 'October to May. Arrive by 5:30 AM for sunrise. Avoid monsoon season.',
    thingsToDo: [
      'Watch the spectacular sunrise over the valley',
      'See both eastern and western horizons simultaneously',
      '360° photography',
      'Spot the Sahyadri mountain ranges',
      'Early morning nature walk',
    ],
    entryFee: 'Free',
    distance: '3 km from main market',
    isFeatured: false,
  },
];

async function seedExplore() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected...');

    await Explore.deleteMany({});
    console.log('Cleared existing explore places...');

    const inserted = await Explore.insertMany(places);
    console.log(`✅ Successfully seeded ${inserted.length} explore places.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding explore data:', error);
    process.exit(1);
  }
}

seedExplore();
