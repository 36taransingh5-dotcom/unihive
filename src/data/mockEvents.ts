import { addHours, addDays, setHours, setMinutes } from 'date-fns';
import type { Event } from '@/types/event';

const generateEventTime = (daysFromNow: number, hour: number, durationHours: number = 2) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  const end = new Date(d);
  end.setHours(hour + durationHours);
  return { starts_at: d.toISOString(), ends_at: end.toISOString() };
};

export const mockEvents: Event[] = [
  // ━━━━ SOCIALS / NIGHTLIFE ━━━━
  {
    id: 'f1', society_id: 'susu', title: 'Jesters Monday Shoes Defiler',
    description: 'The legendary Jesters Monday. Wear shoes you never want to see clean again. 4-pint jugs of Jesticle await.',
    location: 'Jesters Nightclub, Bevois Valley', category: 'social', tags: ['Nightlife', '18+', 'Soton Classic'], food_detail: null,
    latitude: 50.9161, longitude: -1.3980, external_link: null, image_url: 'https://images.unsplash.com/photo-1574393664320-94e8db036b53?w=800&q=80',
    societies: { id: 'susu', name: 'SUSU Events', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(1, 22, 4)
  },
  {
    id: 'f2', society_id: 'su-dance', title: 'Sobar Tuesdays: R&B Night',
    description: '£1.50 doubles before midnight! The ultimate student Tuesday night out at Sobar in Bevois Valley.',
    location: 'Sobar, Bevois Valley', category: 'social', tags: ['Music', 'Party', 'Student Drink Promos'], food_detail: null,
    latitude: 50.9160, longitude: -1.3982, external_link: null, image_url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&q=80',
    societies: { id: 'su-dance', name: 'Southampton R&B Society', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(2, 22, 3)
  },
  {
    id: 'f3', society_id: 'susu', title: 'SUSU Saturday: Neon Rave',
    description: 'The Basement is transforming into a neon wonderland. Glow sticks, UV paint, and drum & bass.',
    location: 'The Cube, SUSU Building 42', category: 'social', tags: ['Rave', 'D&B', 'On Campus'], food_detail: null,
    latitude: 50.9341, longitude: -1.3966, external_link: 'https://susu.org/events', image_url: 'https://images.unsplash.com/photo-1514525253361-ca6515f39230?w=800&q=80',
    societies: { id: 'susu', name: 'SUSU Events', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(5, 22, 5)
  },
  {
    id: 'f4', society_id: 'cocktail', title: 'Trago Lounge Cocktail Masterclass',
    description: 'Learn to mix 3 classic cocktails with the Cocktail Society. Ingredients and shakers provided!',
    location: 'Trago Lounge, Portswood', category: 'social', tags: ['Mixology', 'Chill'], food_detail: 'Cocktails',
    latitude: 50.9255, longitude: -1.3951, external_link: null, image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    societies: { id: 'cocktail', name: 'Cocktail Society', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(3, 19, 2)
  },
  {
    id: 'f5', society_id: 'boardgames', title: 'Café Thrive Board Game Café',
    description: 'Casual board games, vegan snacks, and good vibes. Bring your own games or play ours!',
    location: 'Café Thrive, Hanover Buildings', category: 'social', tags: ['Sober', 'Vegan Friendly', 'Chill'], food_detail: 'Vegan Snacks',
    latitude: 50.9025, longitude: -1.4035, external_link: null, image_url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffaed?w=800&q=80',
    societies: { id: 'boardgames', name: 'Tabletop Gaming', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(4, 14, 3)
  },
  {
    id: 'f6', society_id: 'soton-karaoke', title: 'Karaoke at The Stag\'s',
    description: 'Warm up your vocal cords. Every Thursday is Karaoke night at the campus pub!',
    location: 'The Stag\'s Head Pub, SUSU', category: 'social', tags: ['Karaoke', 'Campus Pub', 'Free'], food_detail: null,
    latitude: 50.9341, longitude: -1.3966, external_link: null, image_url: 'https://images.unsplash.com/photo-1516280440502-613861d85fb4?w=800&q=80',
    societies: { id: 'soton-karaoke', name: 'K-Pop & Karaoke Soc', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(3, 20, 3)
  },

  // ━━━━ SPORTS & ATHLETICS ━━━━
  {
    id: 'f7', society_id: 'team-soton', title: 'Varsity Rugby: Soton vs Portsmouth',
    description: 'The biggest rivalry on the south coast! Support Team Southampton as we take on Pompey at home.',
    location: 'Wide Lane Sports Grounds', category: 'sports', tags: ['Varsity', 'Rugby', 'Spectator'], food_detail: 'Burger Van',
    latitude: 50.9571, longitude: -1.3789, external_link: 'https://susu.org/sports', image_url: 'https://images.unsplash.com/photo-1543661858-debd0eb79b94?w=800&q=80',
    societies: { id: 'team-soton', name: 'Team Southampton', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(6, 14, 3)
  },
  {
    id: 'f8', society_id: 'soton-surf', title: 'Surf Soc Weekend Trip Briefing',
    description: 'Pre-trip Briefing for the upcoming Newquay weekend trip. Mandatory for all ticket holders!',
    location: 'Building 174, Room 1021', category: 'meeting', tags: ['Surfing', 'Trip Briefing'], food_detail: null,
    latitude: 50.9360, longitude: -1.3970, external_link: null, image_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    societies: { id: 'soton-surf', name: 'Southampton Surf Society (Wessex Scene)', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(1, 18, 1)
  },
  {
    id: 'f9', society_id: 'bouldering', title: 'Boulder Shack Intro Session',
    description: 'Never climbed before? Join us at Boulder Shack! Free shoe rental for students with valid student ID.',
    location: 'Boulder Shack Climbing Gym', category: 'sports', tags: ['Climbing', 'Beginners Welcome'], food_detail: null,
    latitude: 50.9315, longitude: -1.3900, external_link: 'https://bouldershack.co.uk/', image_url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80',
    societies: { id: 'bouldering', name: 'Mountaineering Society', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(2, 16, 2)
  },
  {
    id: 'f10', society_id: 'team-soton', title: 'Jubilee Gym Inductions',
    description: 'New to the campus gym? Get a free 30-minute induction showing you how to use the equipment safely.',
    location: 'Jubilee Sports Centre', category: 'sports', tags: ['Fitness', 'Free', 'Campus'], food_detail: null,
    latitude: 50.9355, longitude: -1.3950, external_link: null, image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    societies: { id: 'team-soton', name: 'Sport & Wellbeing', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(0, 10, 8)
  },
  {
    id: 'f11', society_id: 'soton-tennis', title: 'Intramural Tennis League Finals',
    description: 'Watch the campus intramural league finals! Open to all spectators.',
    location: 'Avenue Campus Tennis Courts', category: 'sports', tags: ['Tennis', 'Finals', 'Free'], food_detail: null,
    latitude: 50.9288, longitude: -1.4011, external_link: null, image_url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
    societies: { id: 'soton-tennis', name: 'Tennis Club', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(4, 12, 3)
  },
  {
    id: 'f12', society_id: 'rowing', title: 'Learn to Row - Tryout #2',
    description: 'Wessex Southampton Boat Club invites you to try rowing! Meet at the boat house.',
    location: 'Southampton University Boat House, River Itchen', category: 'sports', tags: ['Rowing', 'Water Sports'], food_detail: null,
    latitude: 50.9351, longitude: -1.3780, external_link: null, image_url: 'https://images.unsplash.com/photo-1535694206001-f2f29b71e72e?w=800&q=80',
    societies: { id: 'rowing', name: 'Wessex Boat Club', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(3, 7, 2)
  },

  // ━━━━ ACADEMIC & WORKSHOPS ━━━━
  {
    id: 'f13', society_id: 'ecss', title: 'React & Vite BootCamp',
    description: 'A 2-hour intensive fast-track to building frontend web apps by ECSS. Free pizza halfway through!',
    location: 'Building 32 (Zepler), Level 4 Labs', category: 'workshop', tags: ['Coding', 'CS', 'Free Pizza'], food_detail: 'Dominos Pizza',
    latitude: 50.9370, longitude: -1.3976, external_link: null, image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    societies: { id: 'ecss', name: 'Electronics & Computer Science Society', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(1, 15, 2)
  },
  {
    id: 'f14', society_id: 'library', title: 'Hartley Library: Referencing 101',
    description: 'Struggling with Harvard referencing? Join the Academic Skills hub for a quick masterclass.',
    location: 'Hartley Library, Level 2 Training Room', category: 'workshop', tags: ['Study Skills', 'Academic'], food_detail: null,
    latitude: 50.9358, longitude: -1.3978, external_link: 'https://library.soton.ac.uk/', image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    societies: { id: 'library', name: 'University Library', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(2, 13, 1)
  },
  {
    id: 'f15', society_id: 'soton-med', title: 'MedSoc: OSCE Mock Scenarios',
    description: 'Practice for your OSCEs with senior years running mock wards. Open to Y2-Y4 Med Students.',
    location: 'Southampton General Hospital, SGH Skills Lab', category: 'workshop', tags: ['Medicine', 'Study'], food_detail: null,
    latitude: 50.9329, longitude: -1.4285, external_link: null, image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    societies: { id: 'soton-med', name: 'Medical Society (MedSoc)', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(3, 17, 3)
  },
  {
    id: 'f16', society_id: 'fin-soc', title: 'Bloomberg Terminal Training',
    description: 'Learn how to navigate and strictly analyze markets using the Bloomberg Terminals in the Business School.',
    location: 'Building 2 (Music/Business), Room 1022', category: 'workshop', tags: ['Finance', 'Business School'], food_detail: null,
    latitude: 50.9353, longitude: -1.3965, external_link: null, image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    societies: { id: 'fin-soc', name: 'Finance & Investment Society', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(5, 14, 2)
  },
  {
    id: 'f17', society_id: 'law-soc', title: 'Mooting Competition Quarter-Finals',
    description: 'Watch the Law Society quarter-finalists battle it out in a simulated courtroom environment.',
    location: 'Building 4, Moot Court Room', category: 'meeting', tags: ['Law', 'Debate', 'Spectator'], food_detail: null,
    latitude: 50.9348, longitude: -1.3960, external_link: null, image_url: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&q=80',
    societies: { id: 'law-soc', name: 'Law Society', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(4, 18, 3)
  },
  {
    id: 'f18', society_id: 'art-soc', title: 'Life Drawing at Winchester School of Art',
    description: 'Take the shuttle bus to WSA for a relaxed 2-hour life drawing session. Charcoal and paper provided.',
    location: 'Winchester School of Art', category: 'workshop', tags: ['Art', 'WSA Campus'], food_detail: null,
    latitude: 51.0650, longitude: -1.3114, external_link: null, image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    societies: { id: 'art-soc', name: 'Art Society', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(6, 16, 2)
  },

  // ━━━━ FREEBIES, FOOD, & OTHER ━━━━
  {
    id: 'f19', society_id: 'susu', title: 'Plant Sale on the Concourse',
    description: 'Brighten up your uni room! Huge selection of succulents, snake plants, and monsteras starting at £3.',
    location: 'Red Brick Area (Outside SUSU)', category: 'social', tags: ['Plants', 'Shopping', 'Campus'], food_detail: null,
    latitude: 50.9342, longitude: -1.3966, external_link: null, image_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
    societies: { id: 'susu', name: 'SUSU Events', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(1, 10, 6)
  },
  {
    id: 'f20', society_id: 'susu-careers', title: 'Spring Career Fair: Tech & Engineering',
    description: 'Over 50 employers including BAE Systems, Google, and Dyson looking for summer interns and grads.',
    location: 'Jubilee Sports Hall', category: 'meeting', tags: ['Careers', 'Networking', 'Internships'], food_detail: 'Free corporate swag',
    latitude: 50.9355, longitude: -1.3950, external_link: 'https://soton.ac.uk/careers', image_url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    societies: { id: 'susu-careers', name: 'Careers & Employability', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(7, 11, 4)
  },
  {
    id: 'f21', society_id: 'vegan-soc', title: 'Pancake Day Free Breakfast',
    description: 'Free vegan pancakes with maple syrup and berries to celebrate Pancake Day! First come, first served.',
    location: ' SUSU Redbrick / Concourse', category: 'social', tags: ['Free Food', 'Vegan', 'Breakfast'], food_detail: 'Pancakes',
    latitude: 50.9341, longitude: -1.3966, external_link: null, image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    societies: { id: 'vegan-soc', name: 'Southampton Vegan Society', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(2, 9, 2)
  },
  {
    id: 'f22', society_id: 'dogs', title: 'Puppy Therapy Session',
    description: 'Take a break from studying! Guide Dogs UK are bringing 10 puppies to campus to help relieve exam stress.',
    location: 'Building 42 (SUSU), The Bridge', category: 'social', tags: ['Wellbeing', 'Dogs', 'Stress Relief'], food_detail: null,
    latitude: 50.9341, longitude: -1.3966, external_link: null, image_url: 'https://images.unsplash.com/photo-1546527868-ccb7ee7fdad9?w=800&q=80',
    societies: { id: 'dogs', name: 'Student Wellbeing', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(3, 13, 3)
  },
  {
    id: 'f23', society_id: 'soton-cinema', title: 'Union Films: Interstellar (70mm)',
    description: 'Experience Nolan\'s masterpiece in highest quality. Cinematic surround sound in the Union Films theatre.',
    location: 'Union Films, SUSU Level 3', category: 'social', tags: ['Cinema', 'Film', 'Sci-Fi'], food_detail: 'Popcorn',
    latitude: 50.9341, longitude: -1.3966, external_link: 'https://unionfilms.org/', image_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
    societies: { id: 'soton-cinema', name: 'Union Films', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(4, 20, 3)
  },
  {
    id: 'f24', society_id: 'islamoc', title: 'Grand Iftar on Campus',
    description: 'Breaking of the fast together! Free hot meals provided. Everyone of all faiths is welcome to join.',
    location: 'The Cube, SUSU', category: 'social', tags: ['Faith', 'Free Food', 'Community'], food_detail: 'Biryani & Dates',
    latitude: 50.9341, longitude: -1.3966, external_link: null, image_url: 'https://images.unsplash.com/photo-1596484552834-6a58f850d0fa?w=800&q=80',
    societies: { id: 'islamoc', name: 'Islamic Society (ISOC)', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(5, 18, 2)
  },
  {
    id: 'f25', society_id: 'soton-astro', title: 'Stargazing at the Soton Observatory',
    description: 'Using the university telescopes on the roof of Physics to view Saturn\'s rings! Weather permitting.',
    location: 'Physics Building 46 Roof Observatory', category: 'workshop', tags: ['Astronomy', 'Science', 'Night'], food_detail: null,
    latitude: 50.9349, longitude: -1.3961, external_link: null, image_url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&q=80',
    societies: { id: 'soton-astro', name: 'Astronomy Society', logo_url: null }, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    ...generateEventTime(6, 21, 2)
  }
];
