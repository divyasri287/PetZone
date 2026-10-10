import os

catfood_dir = r'c:\Users\admin\Desktop\petzone\public\images\catfood'
os.makedirs(catfood_dir, exist_ok=True)

svg_templates = {
    'whiskas.svg': {
        'bg': '#FAF5EE',
        'pouch': '#6B21A8', # Purple
        'accent': '#E08838',
        'brand': 'Whiskas',
        'sub': 'Ocean Fish in Gravy',
        'badge': '85g Pouch',
        'kibble_color': '#D97706',
        'tag': 'ADULT 1+'
    },
    'sheba.svg': {
        'bg': '#FAF5EE',
        'pouch': '#B45309', # Gold / Bronze
        'accent': '#F59E0B',
        'brand': 'Sheba',
        'sub': 'Fine Flakes Chicken',
        'badge': '70g Can',
        'kibble_color': '#92400E',
        'tag': 'PREMIUM WET'
    },
    'meo.svg': {
        'bg': '#FAF5EE',
        'pouch': '#D97706', # Bright Yellow / Orange
        'accent': '#2563EB',
        'brand': 'Me-O',
        'sub': 'Seafood Adult Dry Food',
        'badge': '1.2 kg Bag',
        'kibble_color': '#78350F',
        'tag': 'TRIPLE PLUS'
    },
    'royalcanin.svg': {
        'bg': '#FAF5EE',
        'pouch': '#BE185D', # Pink / Red White
        'accent': '#991B1B',
        'brand': 'Royal Canin',
        'sub': 'Fit 32 Adult Cat',
        'badge': '2 kg Bag',
        'kibble_color': '#9A3412',
        'tag': 'HEALTH NUTRITION'
    },
    'purepet.svg': {
        'bg': '#FAF5EE',
        'pouch': '#0D9488', # Teal
        'accent': '#F59E0B',
        'brand': 'Purepet',
        'sub': 'Tuna & Salmon Gravy',
        'badge': '80g Pouch',
        'kibble_color': '#B45309',
        'tag': 'REAL FISH'
    },
    'felix.svg': {
        'bg': '#FAF5EE',
        'pouch': '#DC2626', # Red
        'accent': '#1E40AF',
        'brand': 'Felix',
        'sub': 'As Good As It Looks',
        'badge': '85g Pouch',
        'kibble_color': '#7F1D1D',
        'tag': 'MEATY CHUNKS'
    },
    'kitcat.svg': {
        'bg': '#FAF5EE',
        'pouch': '#047857', # Emerald Green
        'accent': '#FBBF24',
        'brand': 'Kit Cat',
        'sub': 'Wild Grain-Free Mousse',
        'badge': '80g Can',
        'kibble_color': '#065F46',
        'tag': 'GRAIN FREE'
    },
    'farmina.svg': {
        'bg': '#FAF5EE',
        'pouch': '#4D7C0F', # Olive Green
        'accent': '#C2410C',
        'brand': 'Farmina N&amp;D',
        'sub': 'Venison &amp; Apple Feline',
        'badge': '1.5 kg Bag',
        'kibble_color': '#854D0E',
        'tag': 'ANCESTRAL GRAIN'
    }
}

for filename, data in svg_templates.items():
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <!-- Studio Background -->
  <rect width="500" height="500" fill="{data['bg']}"/>
  <ellipse cx="250" cy="440" rx="140" ry="25" fill="#E5DCCE" opacity="0.8"/>

  <!-- Stand-up Cat Food Pouch / Bag Packaging -->
  <g transform="translate(0, 10)">
    <!-- Main Pouch Shape -->
    <path d="M 160 90 L 340 90 L 370 410 C 370 425, 350 435, 250 435 C 150 435, 130 425, 130 410 Z" fill="{data['pouch']}" stroke="#2C221E" stroke-width="3"/>
    
    <!-- Top Seal & Notch -->
    <rect x="155" y="80" width="190" height="20" rx="4" fill="#2C221E" opacity="0.15"/>
    <line x1="160" y1="90" x2="340" y2="90" stroke="#FFFFFF" stroke-width="2" opacity="0.5"/>
    <path d="M 140 100 L 148 100 M 352 100 L 360 100" stroke="#2C221E" stroke-width="3"/>

    <!-- Pouch Highlight / Sheen -->
    <path d="M 165 95 L 210 95 L 180 415 L 145 405 Z" fill="#FFFFFF" opacity="0.12"/>

    <!-- Brand Header Banner -->
    <rect x="150" y="125" width="200" height="35" rx="6" fill="#FFFFFF"/>
    <text x="250" y="149" font-family="'Inter', 'Montserrat', sans-serif" font-weight="900" font-size="20" fill="{data['pouch']}" text-anchor="middle" letter-spacing="1">{data['brand'].upper()}</text>

    <!-- Tag Badge -->
    <rect x="190" y="168" width="120" height="20" rx="10" fill="{data['accent']}"/>
    <text x="250" y="182" font-family="sans-serif" font-weight="800" font-size="10" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">{data['tag']}</text>

    <!-- Product Subtitle -->
    <text x="250" y="215" font-family="sans-serif" font-weight="800" font-size="15" fill="#FFFFFF" text-anchor="middle">{data['sub']}</text>

    <!-- Food Graphic Window (Heart / Circle with kibble) -->
    <circle cx="250" cy="285" r="50" fill="#FFFFFF" stroke="{data['accent']}" stroke-width="4"/>
    
    <!-- Bowl / Kibble inside window -->
    <path d="M 215 295 Q 250 325 285 295 Z" fill="{data['kibble_color']}"/>
    <circle cx="235" cy="275" r="8" fill="{data['kibble_color']}"/>
    <circle cx="250" cy="268" r="9" fill="{data['kibble_color']}"/>
    <circle cx="265" cy="276" r="8" fill="{data['kibble_color']}"/>
    <circle cx="242" cy="284" r="7" fill="{data['accent']}"/>
    <circle cx="258" cy="284" r="7" fill="{data['accent']}"/>

    <!-- Paw / Heart Icon -->
    <path d="M 250 235 C 245 228 235 228 235 235 C 235 242 250 250 250 250 C 250 250 265 242 265 235 C 265 228 255 228 250 235 Z" fill="{data['accent']}"/>

    <!-- Feature Icons & Weight Footer -->
    <text x="250" y="360" font-family="sans-serif" font-weight="700" font-size="11" fill="#FFFFFF" text-anchor="middle">100% COMPLETE NUTRITION</text>

    <rect x="180" y="380" width="140" height="28" rx="14" fill="#FFFFFF"/>
    <text x="250" y="398" font-family="sans-serif" font-weight="900" font-size="13" fill="#2C221E" text-anchor="middle">NET WT. {data['badge']}</text>
  </g>
</svg>
'''
    filepath = os.path.join(catfood_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f'Created {filename}')

print('Done creating cat food SVG packaging graphics!')
