require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'Royal Canine Adult Dog Dry Food - Real Chicken & Rice Formula',
    category: 'Dog Food',
    description: 'Premium high-protein dry dog food formulated for adult dogs. Rich in essential omega-3 & omega-6 fatty acids for a shiny coat, strong muscles, and healthy gut digestion. Made with real farm-raised chicken.',
    price: 1899,
    originalPrice: 2299,
    discount: 17,
    rating: 4.8,
    reviewCount: 342,
    stock: 25,
    brand: 'Royal Canine',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800',
    ],
    features: [
      '100% Real Chicken meal base',
      'No artificial preservatives or colorants',
      'Supports joint health with Glucosamine',
      'Formulated for all adult medium & large breeds',
    ],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: 'Purrfect Care Growth Formula Puppy Kibble',
    category: 'Dog Food',
    description: 'Nourishing, easy-to-chew mini kibble crafted specifically for growing puppies aged 2 to 12 months. Packed with DHA from salmon oil for brain & vision development.',
    price: 1499,
    originalPrice: 1799,
    discount: 16,
    rating: 4.9,
    reviewCount: 215,
    stock: 18,
    brand: 'Purrfect Care',
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Enriched with natural DHA for smart puppy training',
      'Calcium & Phosphorus for strong bones & teeth',
      'High digestibility prebiotics',
    ],
    isFeatured: true,
    isBestSeller: false,
  },
  {
    name: 'Whiskers & Co. Salmon & Tuna Gourmet Cat Food',
    category: 'Cat Food',
    description: 'Delectable wet cat food pouches packed with real Atlantic salmon and tuna chunks in rich gravy. Hydrating formula that cats adore, keeping urinary tract healthy.',
    price: 999,
    originalPrice: 1199,
    discount: 16,
    rating: 4.7,
    reviewCount: 189,
    stock: 40,
    brand: 'Whiskers & Co.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Real fish protein source',
      'Taurine rich for healthy eyesight and heart function',
      'Balanced moisture content for optimal hydration',
    ],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: 'Felini Gentle Start Kitten Wet & Dry Combo',
    category: 'Cat Food',
    description: 'Specially formulated starter kit for young kittens. Small kibble size and gentle wet pouches designed for tender digestive systems and delicate teeth.',
    price: 1249,
    originalPrice: 1450,
    discount: 13,
    rating: 4.8,
    reviewCount: 94,
    stock: 12,
    brand: 'Felini',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800'],
    features: [
      'High antioxidant immune support complex',
      'Soft texture options for easy weaning',
      'No wheat, soy, or corn fillers',
    ],
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: 'ToughBite Natural Rubber Fetch & Dental Chew Toy',
    category: 'Toys',
    description: 'Ultra-durable non-toxic natural rubber toy for aggressive chewers. Unique textured grooves massage gums and clean teeth while your dog plays fetch or chews.',
    price: 649,
    originalPrice: 799,
    discount: 18,
    rating: 4.6,
    reviewCount: 412,
    stock: 35,
    brand: 'ToughBite',
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Treat dispenser slot inside',
      'Ergonomic dental ridge design',
      '100% BPA-free and eco-friendly rubber',
    ],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: 'FeatherWand Interactive LED & Bell Cat Teaser',
    category: 'Toys',
    description: 'Keep your feline active and mentally stimulated! Flexible carbon-fiber wand with natural feathers, bell rattle, and gentle red light beam for endless hunting fun.',
    price: 499,
    originalPrice: 650,
    discount: 23,
    rating: 4.9,
    reviewCount: 278,
    stock: 50,
    brand: 'PlayPaw',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Interchangeable feather attachments included',
      'Reinforced break-resistant wand tip',
      'Stimulates natural feline hunting instincts',
    ],
    isFeatured: false,
    isBestSeller: true,
  },
  {
    name: 'CloudRest Orthopedic Memory Foam Pet Bed',
    category: 'Accessories',
    description: 'Luxurious plush memory foam bed engineered to relieve joint strain and provide therapeutic comfort for dogs and cats. Comes with a removable, machine-washable waterproof cover.',
    price: 3499,
    originalPrice: 4299,
    discount: 18,
    rating: 4.9,
    reviewCount: 160,
    stock: 15,
    brand: 'CloudRest',
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80&w=800'],
    features: [
      'High-density orthopedic support foam',
      'Waterproof inner liner protection',
      'Non-skid rubber bottom grip',
    ],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: 'ErgoFeeder Stainless Steel Non-Slip Dual Food & Water Bowls',
    category: 'Accessories',
    description: 'Rust-resistant double bowl set with an elevated eco-bamboo stand. Reduces neck strain during feeding and keeps your floor clean with spill-proof silicone mats.',
    price: 1199,
    originalPrice: 1499,
    discount: 20,
    rating: 4.6,
    reviewCount: 133,
    stock: 22,
    brand: 'ErgoFeeder',
    image: 'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Food-grade 304 stainless steel construction',
      'Dishwasher safe bowls',
      'Elevated 15-degree tilt for smooth digestion',
    ],
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: 'SafePaws Reflective Padded Leather Dog Collar',
    category: 'Accessories',
    description: 'Premium genuine leather collar lined with soft breathable neoprene padding to prevent chafing. Embedded 3M reflective stitching ensures safety during night walks.',
    price: 799,
    originalPrice: 999,
    discount: 20,
    rating: 4.8,
    reviewCount: 204,
    stock: 30,
    brand: 'SafePaws',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Heavy-duty zinc alloy buckle & D-ring',
      '3M Scotchlite high-visibility reflective strip',
      'Weather-proof treated full-grain leather',
    ],
    isFeatured: false,
    isBestSeller: true,
  },
  {
    name: 'FlexiGrip Heavy-Duty Shock-Absorbing Pet Leash',
    category: 'Accessories',
    description: '5ft tactical nylon leash featuring an elastic bungee buffer to absorb sudden pulls. Includes a padded dual-handle for maximum control in crowded streets or parks.',
    price: 899,
    originalPrice: 1099,
    discount: 18,
    rating: 4.7,
    reviewCount: 156,
    stock: 28,
    brand: 'FlexiGrip',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Heavy-duty 360-degree rotating alloy clip',
      'Padded traffic handle near clip for quick control',
      'Car seatbelt safety buckle attachment',
    ],
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: 'SilkCoat Self-Cleaning Slicker Grooming Brush',
    category: 'Grooming',
    description: 'Effortlessly remove loose fur, tangles, and dander without scratching sensitive skin. One-click push button retracts bristles to instantly dump collected hair into the trash.',
    price: 699,
    originalPrice: 899,
    discount: 22,
    rating: 4.9,
    reviewCount: 310,
    stock: 45,
    brand: 'SilkCoat',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Fine bent wire bristles with rubber massage beads',
      'One-click hair release mechanism',
      'Suitable for short, medium, and long coat pets',
    ],
    isFeatured: true,
    isBestSeller: false,
  },
  {
    name: 'BioClean Organic Oatmeal & Lavender Pet Shampoo',
    category: 'Grooming',
    description: 'Hypoallergenic, tear-free pet shampoo infused with natural colloidal oatmeal, aloe vera, and soothing lavender extract. Relieves dry, itchy skin while leaving coat silky fresh.',
    price: 599,
    originalPrice: 749,
    discount: 20,
    rating: 4.8,
    reviewCount: 198,
    stock: 38,
    brand: 'BioClean',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800'],
    features: [
      '100% Paraben, sulfate, and alcohol-free',
      'Deodorizes with natural therapeutic lavender fragrance',
      'pH balanced specifically for dog & cat skin',
    ],
    isFeatured: false,
    isBestSeller: true,
  },
  {
    name: 'PawProtect Waterproof Dog Rain Jacket & Harness',
    category: 'Accessories',
    description: 'All-weather waterproof jacket with integrated harness for dogs. Keeps your dog warm and dry during monsoon walks, with reflective strips for visibility.',
    price: 1599,
    originalPrice: 1999,
    discount: 20,
    rating: 4.5,
    reviewCount: 87,
    stock: 20,
    brand: 'PawProtect',
    image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Adjustable harness built into jacket body',
      '100% waterproof outer shell with fleece lining',
      'High-visibility reflective seam stitching',
    ],
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: 'ZenNip Organic Catnip Stuffed Plush Mouse Toy',
    category: 'Toys',
    description: 'Soft, crinkle-core stuffed mouse filled with premium organic catnip from North America. The rustling crinkle sound and irresistible scent will drive your cat wild.',
    price: 349,
    originalPrice: 449,
    discount: 22,
    rating: 4.7,
    reviewCount: 321,
    stock: 60,
    brand: 'ZenNip',
    image: 'https://images.unsplash.com/photo-1608096309213-33ae5ca6b36e?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1608096309213-33ae5ca6b36e?auto=format&fit=crop&q=80&w=800'],
    features: [
      'USDA certified organic catnip filling',
      'Refillable zipper pocket for fresh catnip',
      'Machine washable outer plush fabric',
    ],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: 'NailEase Professional Pet Nail Grinder Kit',
    category: 'Grooming',
    description: 'Ultra-quiet rechargeable nail grinder with 3 grinding ports for small, medium, and large pets. Whisper-quiet motor under 45dB keeps anxious pets calm during grooming.',
    price: 1299,
    originalPrice: 1799,
    discount: 27,
    rating: 4.6,
    reviewCount: 145,
    stock: 32,
    brand: 'NailEase',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800'],
    features: [
      'Ultra-quiet < 45dB brushless motor',
      '2-speed settings with LED light guide',
      'USB-C rechargeable, 2-hour battery life',
    ],
    isFeatured: false,
    isBestSeller: false,
  },
];

// Demo admin account seeded
const adminUser = {
  name: 'Admin',
  email: 'admin@petzone.com',
  password: 'Admin@123',
  role: 'admin',
};

const seedDB = async () => {
  await connectDB();

  console.log('🌱 Starting PetZone database seeding...\n');

  // Clear existing data
  await Product.deleteMany({});
  await User.deleteMany({ role: 'admin' });
  console.log('🗑️  Cleared existing products and admin users.\n');

  // Seed products
  const createdProducts = await Product.insertMany(products);
  console.log(`✅ Seeded ${createdProducts.length} products.\n`);

  // Seed admin user
  const admin = await User.create(adminUser);
  console.log(`✅ Admin user created:`);
  console.log(`   Email    : ${adminUser.email}`);
  console.log(`   Password : ${adminUser.password}`);
  console.log(`   Role     : ${admin.role}\n`);

  console.log('🎉 Database seeding completed successfully!');
  process.exit(0);
};

seedDB().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
