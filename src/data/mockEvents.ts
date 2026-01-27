import { addHours, addDays, setHours, setMinutes, startOfHour } from 'date-fns';
import type { Event } from '@/types/event';

// Generate realistic event times based on current time
function generateEventTime(daysFromNow: number, hour: number, durationHours: number = 2) {
  const now = new Date();
  const eventDate = addDays(now, daysFromNow);
  const starts_at = setMinutes(setHours(eventDate, hour), 0);
  const ends_at = addHours(starts_at, durationHours);
  return { starts_at: starts_at.toISOString(), ends_at: ends_at.toISOString() };
}

// Create a "happening now" event
function happeningNowTime() {
  const now = new Date();
  const starts_at = addHours(now, -1);
  const ends_at = addHours(now, 1);
  return { starts_at: starts_at.toISOString(), ends_at: ends_at.toISOString() };
}

export const mockEvents: Event[] = [
  // Happening Now
  {
    id: 'mock-1',
    society_id: 'mock-society-1',
    title: 'EconSoc Poker Night',
    description: 'Join us for a casual poker night! All skill levels welcome. Chips and snacks provided. Prize for the winner! No real money involved.',
    location: 'SUSU Building, Room 3',
    category: 'social',
    ...happeningNowTime(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-1', name: 'Economics Society', logo_url: null },
  },
  // Later Today
  {
    id: 'mock-2',
    society_id: 'mock-society-2',
    title: 'Intro to Python',
    description: 'Learn the basics of Python programming! Perfect for complete beginners. Bring your laptop with Python installed. We\'ll cover variables, loops, and build a simple project.',
    location: 'Building 32, Lab 2001',
    category: 'workshop',
    ...generateEventTime(0, new Date().getHours() + 2, 2),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-2', name: 'Computer Science Society', logo_url: null },
  },
  {
    id: 'mock-3',
    society_id: 'mock-society-3',
    title: 'Badminton Club Session',
    description: 'Weekly club session. Courts will be set up for both casual play and competitive practice. Rackets available to borrow.',
    location: 'Jubilee Sports Centre',
    category: 'sports',
    ...generateEventTime(0, new Date().getHours() + 3, 2),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-3', name: 'Badminton Club', logo_url: null },
  },
  // Tomorrow
  {
    id: 'mock-4',
    society_id: 'mock-society-4',
    title: 'Yoga & Meditation',
    description: 'Start your day right with a calming yoga and meditation session. Mats provided. Wear comfortable clothing.',
    location: 'Hartley Library Lawn',
    category: 'sports',
    ...generateEventTime(1, 9, 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-4', name: 'Wellness Society', logo_url: null },
  },
  {
    id: 'mock-5',
    society_id: 'mock-society-5',
    title: 'Startup Brainstorm',
    description: 'Got an idea? Share it with fellow entrepreneurs! Network with like-minded students and get feedback on your startup concepts.',
    location: 'SUSU Lounge',
    category: 'workshop',
    ...generateEventTime(1, 14, 2),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-5', name: 'Entrepreneurs Society', logo_url: null },
  },
  {
    id: 'mock-6',
    society_id: 'mock-society-1',
    title: 'Finance Careers Talk',
    description: 'Alumni from Goldman Sachs and JP Morgan will share their experiences and answer questions about breaking into finance.',
    location: 'Building 58, Lecture Theatre A',
    category: 'meeting',
    ...generateEventTime(1, 17, 2),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-1', name: 'Economics Society', logo_url: null },
  },
  // This Week
  {
    id: 'mock-7',
    society_id: 'mock-society-2',
    title: 'Game Dev Workshop',
    description: 'Build your first game using Unity! No prior experience needed. By the end, you\'ll have a playable prototype.',
    location: 'Building 32, Lab 1001',
    category: 'workshop',
    ...generateEventTime(3, 15, 3),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-2', name: 'Computer Science Society', logo_url: null },
  },
  {
    id: 'mock-8',
    society_id: 'mock-society-3',
    title: 'Mixed Doubles Tournament',
    description: 'Annual mixed doubles badminton tournament! Sign up in pairs. Prizes for winners and best sportsmanship.',
    location: 'Jubilee Sports Centre',
    category: 'sports',
    ...generateEventTime(4, 13, 4),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-3', name: 'Badminton Club', logo_url: null },
  },
  {
    id: 'mock-9',
    society_id: 'mock-society-1',
    title: 'End of Term Social',
    description: 'Celebrate the end of term with food, drinks, and games! All EconSoc members and friends welcome.',
    location: 'The Stag\'s Head',
    category: 'social',
    ...generateEventTime(5, 19, 3),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-1', name: 'Economics Society', logo_url: null },
  },
  {
    id: 'mock-10',
    society_id: 'mock-society-4',
    title: 'Committee Meeting',
    description: 'Monthly committee meeting to discuss upcoming events and society plans. All committee members required.',
    location: 'SUSU Meeting Room 4',
    category: 'meeting',
    ...generateEventTime(2, 12, 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    societies: { id: 'mock-society-4', name: 'Wellness Society', logo_url: null },
  },
];
