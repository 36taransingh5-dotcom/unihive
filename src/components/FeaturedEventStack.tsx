import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventCard } from './EventCard';
import type { Event } from '@/types/event';

const MOCK_FEATURED_EVENTS: Event[] = [
    {
        id: 'f1',
        society_id: 's1',
        title: 'Neon Night Rave',
        description: 'The biggest underground electronic music event of the semester. Lasers, smoke machines, and non-stop beats.',
        location: 'The Bunker',
        starts_at: new Date(Date.now() + 86400000 * 2).toISOString(),
        ends_at: new Date(Date.now() + 86400000 * 2 + 14400000).toISOString(),
        category: 'social',
        tags: ['Music', 'Party', 'Late Night'],
        image_url: 'https://images.unsplash.com/photo-1514525253361-ca6515f39230?w=800&q=80',
        societies: { id: 's1', name: 'Electronic Music Society', logo_url: null },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        food_detail: null,
        latitude: null,
        longitude: null,
        external_link: null
    },
    {
        id: 'f2',
        society_id: 's2',
        title: 'Brutalist Design Lab',
        description: 'Learn the principles of Swiss design and Brutalist aesthetics. Workshop on typography and grid systems.',
        location: 'Design Studio 4',
        starts_at: new Date(Date.now() + 86400000 * 5).toISOString(),
        ends_at: new Date(Date.now() + 86400000 * 5 + 7200000).toISOString(),
        category: 'workshop',
        tags: ['Design', 'Learning', 'Creativity'],
        image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
        societies: { id: 's2', name: 'Art & Design Collective', logo_url: null },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        food_detail: null,
        latitude: null,
        longitude: null,
        external_link: null
    },
    {
        id: 'f3',
        society_id: 's3',
        title: 'Pizza & Pitches',
        description: 'Present your startup idea in 2 minutes and win prizes. Free pizza for all attendees!',
        location: 'Enterprise Hub',
        starts_at: new Date(Date.now() + 86400000).toISOString(),
        ends_at: new Date(Date.now() + 86400000 + 10800000).toISOString(),
        category: 'social',
        tags: ['Networking', 'Food', 'Startup'],
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        societies: { id: 's3', name: 'Entrepreneurship Society', logo_url: null },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        food_detail: null,
        latitude: null,
        longitude: null,
        external_link: null
    }
];

export function FeaturedEventStack() {
    const [index, setIndex] = useState(0);

    const cycle = () => {
        setIndex((prev) => (prev + 1) % MOCK_FEATURED_EVENTS.length);
    };

    return (
        <div className="relative w-full max-w-[280px] sm:max-w-sm h-[280px] sm:h-[320px] mx-auto mt-8 sm:mt-12 perspective-1000">
            <AnimatePresence initial={false}>
                {[...MOCK_FEATURED_EVENTS]
                    .map((_, i) => (index + i) % MOCK_FEATURED_EVENTS.length)
                    .reverse()
                    .map((eventIdx, i) => {
                        const isTop = i === MOCK_FEATURED_EVENTS.length - 1;
                        const event = MOCK_FEATURED_EVENTS[eventIdx];

                        return (
                            <motion.div
                                key={event.id}
                                style={{
                                    zIndex: i,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                }}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1 - (MOCK_FEATURED_EVENTS.length - 1 - i) * 0.05,
                                    y: (MOCK_FEATURED_EVENTS.length - 1 - i) * -10,
                                    rotate: (MOCK_FEATURED_EVENTS.length - 1 - i) * 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: 100,
                                    rotate: 10,
                                    transition: { duration: 0.2 }
                                }}
                                whileHover={isTop ? { scale: 1.02, y: -20 } : {}}
                                onClick={isTop ? cycle : undefined}
                                className={`cursor-pointer ${!isTop ? 'pointer-events-none' : ''}`}
                            >
                                <div className="relative transformTransition">
                                    <EventCard event={event} />
                                    {isTop && (
                                        <div className="absolute inset-0 bg-transparent rounded-xl flex items-end justify-center pb-2 opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                                                Click to Next
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
            </AnimatePresence>
        </div>
    );
}
