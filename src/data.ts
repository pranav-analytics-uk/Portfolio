// Portfolio content, sourced from Pranav's LinkedIn profile.

export const PROFILE = {
  firstName: 'Pranav',
  name: 'Pranav Raj Singh',
  tagline: 'campaign strategy & brand communications, making brand work people stop scrolling for',
  location: 'Glasgow, Scotland, UK',
  linkedin: 'https://www.linkedin.com/in/thepranavraj021',
  email: 'pranavrajsinghrajput@gmail.com',
  phone: '+44 7721 553986',
  phoneHref: 'tel:+447721553986',
  availability: 'Open to UK graduate roles from April 2027',
  about:
    "I'm a marketer and photographer who owns campaigns end to end, from the first idea to the final cut. At TECNO Mobile India I created Heroes, a six-part portrait series shot entirely on TECNO phones. Now I'm completing an MSc in Marketing at Strathclyde, building my AI and paid media skills. Let's make something people remember!",
};

export const STATS = [
  { value: '~253K', label: 'Likes on the Heroes series' },
  { value: '6', label: 'Posts, one per day, 1 to 6 Aug 2025' },
  { value: '3', label: 'Handsets at three price tiers' },
  { value: '11', label: 'Films & reels published for TECNO' },
];

export const EXPERIENCE = [
  {
    role: 'Industry Project: Digital Marketing & Brand Strategy',
    company: 'YJC Foods Co. Ltd',
    period: 'Jul 2026 – Present',
    place: 'Edinburgh · On-site',
    description:
      'MSc final project for a pre-trading Edinburgh startup making craft tinned seafood from Scottish fish. Qualitative consumer research across Glasgow and Edinburgh specialty retailers to shape brand positioning, messaging and channel strategy for UK market entry.',
  },
  {
    role: 'Creative Marketing Associate: Campaign Production & Social Strategy',
    company: 'TECNO Mobile India',
    period: 'Jan 2025 – Oct 2025',
    place: 'Delhi · Hybrid',
    description:
      'Owned campaigns end to end: concept, creative direction, agency management and final sign-off. Created and shot the Heroes series, directed #BetterAskElla, the POVA Curve 5G launch and Flipkart partnership content, and set social strategy across the CAMON, POVA and SPARK ranges.',
  },
  {
    role: 'Social Media & Content Strategist',
    company: 'Totapari',
    period: 'Jan 2024 – Jan 2025',
    place: 'Delhi · Hybrid',
    description:
      'Ran the social function single-handed for a jewellery brand: content calendar built around Diwali and wedding season, trend-led reels, and creative direction on the Diwali wedding collection launch, from set design to the final edit.',
  },
  {
    role: 'Student Placement Representative',
    company: 'AAFT',
    period: 'May 2024 – Jan 2025',
    place: 'Noida · On-site',
    description:
      'Advised students on portfolios, CVs and presentation, and connected them with recruiters and job opportunities.',
  },
];

export const EDUCATION = [
  { school: 'University of Strathclyde', degree: 'MSc Marketing', period: 'Jan 2026 – Mar 2027' },
  { school: 'Noida International University', degree: "Bachelor's, Photography · Grade A+", period: 'Jul 2022 – Jun 2025' },
];

export const CERTIFICATIONS = [
  'Google Ads Search Certification (2026)',
  'Google Analytics Certification (2026)',
  'SEO with Squarespace · Coursera',
  'Advanced Google Ads · LinkedIn',
  'Advanced Prompt Engineering Techniques · LinkedIn',
];

// The six Heroes posts, in publishing order.
// `url` is the Instagram post link; when set, the card opens it on tap.
export const HERO_POSTS = [
  { file: 3, url: '', title: 'A heart full of flame.', subject: 'Welder', device: 'CAMON 30 Premier 5G', date: '1 Aug 2025', likes: '46.6K' },
  { file: 2, url: '', title: 'Brewed with Pride', subject: 'Chai vendor', device: 'CAMON 30 Premier 5G', date: '2 Aug 2025', likes: '69K' },
  { file: 1, url: '', title: 'Grease, Grind & Grit.', subject: 'Cycle mechanic', device: 'POVA Curve 5G', date: '3 Aug 2025', likes: '45.5K' },
  { file: 4, url: '', title: 'Blisters on his hand, fire in his heart.', subject: 'Metal grinder', device: 'CAMON 30 Premier 5G', date: '4 Aug 2025', likes: '48.9K' },
  { file: 5, url: '', title: 'Craft defies Conformity', subject: 'Workshop craftsmen', device: 'CAMON 30 Premier 5G', date: '5 Aug 2025', likes: '39.5K' },
  { file: 6, url: '', title: 'Carrying the weight of Quiet Courage', subject: 'Porter', device: 'SPARK 30C 5G', date: '6 Aug 2025', likes: '3.4K' },
];

export const TECNO_INSTAGRAM = 'https://www.instagram.com/tecnomobileindia/';

// Asset paths go through BASE_URL so the site works under /Portfolio/ on GitHub Pages.
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const heroPhoto = (n: number) => asset(`hero-campaign/photo-${n}.jpg`);
export const heroScreenshot = (n: number) => asset(`hero-campaign/hero-${n}.jpg`);
export const heroScreenshotSmall = (n: number) => asset(`hero-campaign/hero-${n}-sm.jpg`);

export const FILMS = [
  { id: '8JRVesGVlO0', title: 'India, Stop At Nothing.', series: 'TECNO Mobile India' },
  { id: 'MBukK9OuYWM', title: 'Dhokha Ab Nahi Hoga', series: '#BetterAskElla' },
  { id: 'LcIE3BWg1t4', title: 'Scams Ka The End', series: '#BetterAskElla' },
  { id: 'XDZ9F9rTcmU', title: 'Fraud Se Bacho', series: '#BetterAskElla' },
  { id: '2jQoR4MezO4', title: 'Ella Sab Janti Hai', series: 'POVA Curve 5G' },
  { id: 'R_AhDzPXYMQ', title: 'Ella Se Pucho', series: 'POVA Curve 5G' },
  { id: 'l_RHQk32I0g', title: 'Signal Kamaal Ka', series: 'POVA Curve 5G' },
  { id: '0TlESolhj8w', title: 'Sabse Strong Signal', series: 'POVA Curve 5G' },
];

export const REELS = [
  { url: 'https://www.instagram.com/reel/DLXr6G7yCgG/', title: 'Bhai ne humein gift bheja', brand: 'TECNO × Flipkart' },
  { url: 'https://www.instagram.com/reel/DLfH7K-Sqaj/', title: 'Yeh dosti hum nahi todenge', brand: 'TECNO × Flipkart' },
  { url: 'https://www.instagram.com/reel/DNVhbxsKETw/', title: 'Signal Week', brand: 'TECNO Mobile India' },
  { url: 'https://www.instagram.com/reel/DBy2d6zyYSe/', title: 'Diwali Wedding Collection launch', brand: 'Totapari' },
  { url: 'https://www.instagram.com/reel/C91XzZESvPs/', title: 'Festive Meenakari collection', brand: 'Totapari' },
  { url: 'https://www.instagram.com/reel/C3zfA0fy852/', title: "Recreating Alia Bhatt's pearl look", brand: 'Totapari' },
  { url: 'https://www.instagram.com/reel/DE0AgqkyPCJ/', title: 'Maa ka Pitara launch', brand: 'Totapari' },
  { url: 'https://www.instagram.com/reel/DFA1R4GS52G/', title: 'Totapari reel', brand: 'Totapari' },
];
