import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EventCard } from "./EventCard";
import { mockEvents } from "@/data/mockEvents";

const DISPLAY_EVENTS = mockEvents.slice(0, 3);

export function FeaturedEventStack() {
    const [index, setIndex] = useState(0);

    const cycle = () => {
        setIndex((prev) => (prev + 1) % DISPLAY_EVENTS.length);
    };

    return (
        <div className="relative w-full max-w-[280px] sm:max-w-sm h-[280px] sm:h-[320px] mx-auto mt-8 sm:mt-12 perspective-1000">
            <AnimatePresence initial={false}>
                {[...DISPLAY_EVENTS]
                    .map((_, i) => (index + i) % DISPLAY_EVENTS.length)
                    .reverse()
                    .map((eventIdx, i) => {
                        // Limit visible rendered cards in stack for performance, max 4 cards visible at a time
                        if ((DISPLAY_EVENTS.length - 1 - i) > 4) return null;

                        const isTop = i === DISPLAY_EVENTS.length - 1;
                        const event = DISPLAY_EVENTS[eventIdx];

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
                                    scale: 1 - (DISPLAY_EVENTS.length - 1 - i) * 0.05,
                                    y: (DISPLAY_EVENTS.length - 1 - i) * -10,
                                    rotate: (DISPLAY_EVENTS.length - 1 - i) * 1,
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
