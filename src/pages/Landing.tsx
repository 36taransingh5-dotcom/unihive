import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, PartyPopper, MapPin, GraduationCap, Bug } from 'lucide-react';
import { Header } from '@/components/Header';
import { AskHive } from '@/components/AskHive';
import { FeaturedEventStack } from '@/components/FeaturedEventStack';
import { useTheme } from '@/hooks/useTheme';
import { toast } from '@/components/ui/sonner';

// ── Sticker data ────────────────────────────────────────────────────
const STICKERS = [
    { id: 1, emoji: '🐝', label: 'Bee', color: '#FFDE59', x: -220, y: -100 },
    { id: 2, emoji: '🍕', label: 'Pizza', color: '#FF6B6B', x: 200, y: -140 },
    { id: 3, emoji: '', label: 'B32', color: '#22d3ee', x: -180, y: 120, icon: 'mappin' },
    { id: 4, emoji: '', label: 'Society', color: '#bef264', x: 240, y: 80, icon: 'grad' },
    { id: 5, emoji: '🎉', label: 'Party', color: '#d946ef', x: -60, y: 180 },
    { id: 6, emoji: '', label: 'Bolt', color: '#f97316', x: 120, y: -180, icon: 'zap' },
];

function getRandomRotation() {
    return Math.random() * 30 - 15; // -15 to 15
}

// ── Sticker Component ───────────────────────────────────────────────
function Sticker({
    sticker,
    constraintsRef,
}: {
    sticker: (typeof STICKERS)[number];
    constraintsRef: React.RefObject<HTMLDivElement>;
}) {
    const rotation = useRef(getRandomRotation());

    const renderIcon = () => {
        if (sticker.emoji) {
            return <span className="text-3xl md:text-4xl select-none">{sticker.emoji}</span>;
        }
        switch (sticker.icon) {
            case 'mappin':
                return <MapPin className="w-7 h-7 md:w-8 md:h-8" />;
            case 'grad':
                return <GraduationCap className="w-7 h-7 md:w-8 md:h-8" />;
            case 'zap':
                return <Zap className="w-7 h-7 md:w-8 md:h-8" />;
            default:
                return <Bug className="w-7 h-7 md:w-8 md:h-8" />;
        }
    };

    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.15}
            whileDrag={{ scale: 1.15, zIndex: 100 }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
            initial={{ scale: 0, rotate: 0, x: 0, y: 0, opacity: 0 }}
            animate={{
                scale: [0, 1.25, 1],
                rotate: rotation.current,
                x: sticker.x,
                y: sticker.y,
                opacity: 1,
            }}
            transition={{
                delay: Math.random() * 0.4 + 0.2,
                duration: 0.5,
                type: 'spring',
                stiffness: 300,
                damping: 15,
            }}
            className="sticker absolute cursor-grab active:cursor-grabbing z-10"
            style={{ touchAction: 'none' }}
        >
            <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-[3px] border-black dark:border-white/20 flex items-center justify-center select-none"
                style={{
                    backgroundColor: sticker.color,
                    boxShadow: `3px 3px 0px 0px rgba(0,0,0,0.9)`,
                }}
            >
                {renderIcon()}
            </div>
            <span className="block text-center text-[10px] font-black mt-1 uppercase tracking-wider text-foreground">
                {sticker.label}
            </span>
        </motion.div>
    );
}

// ── Main Landing Page ───────────────────────────────────────────────
export default function Landing() {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const heroRef = useRef<HTMLDivElement>(null!);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Form state
    const [email, setEmail] = useState('');
    const [uniName, setUniName] = useState('');

    // ── Flashlight mouse tracking ───────────────────────────────────
    const handleMouseMove = useCallback((e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            window.addEventListener('mousemove', handleMouseMove);
        }
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isDarkMode, handleMouseMove]);

    // ── Form submit ─────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !uniName.trim()) return;
        toast.success(`🐝 Buzzing into ${uniName} soon!`);
        setEmail('');
        setUniName('');
    };

    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden">
            {/* ── Dark Mode Flashlight Overlay ─────────────────────────── */}
            {isDarkMode && (
                <div
                    className="fixed inset-0 pointer-events-none z-[60] transition-none"
                    style={{
                        background: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.85) 100%)`,
                    }}
                />
            )}

            <Header />

            {/* ━━━━━━━━ HERO SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section
                ref={heroRef}
                className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-32 overflow-hidden bg-[url('/grid.svg')] bg-[length:40px_40px]"
            >
                {/* Stickers */}
                {STICKERS.map((s, idx) => {
                    // Constrain to left and right 15% zones
                    const isLeft = idx % 2 === 0;
                    const xRange = isLeft ? [-40, -15] : [15, 40];
                    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
                    const constrainedX = isLeft
                        ? -(viewportWidth * 0.35 + Math.random() * 50)
                        : (viewportWidth * 0.35 + Math.random() * 50);

                    return (
                        <Sticker
                            key={s.id}
                            sticker={{ ...s, x: constrainedX }}
                            constraintsRef={heroRef}
                        />
                    );
                })}

                {/* Central content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative z-20 text-center max-w-2xl mx-auto"
                >
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.05] text-foreground mb-4">
                        Soton&apos;s Social
                        <br />
                        <span
                            className="relative inline-block"
                            style={{
                                WebkitTextStroke: isDarkMode ? '1.5px #bef264' : undefined,
                            }}
                        >
                            <span className="bg-gradient-to-r from-[#FFDE59] via-[#d946ef] to-[#22d3ee] bg-clip-text text-transparent">
                                Heartbeat.
                            </span>
                        </span>
                    </h1>

                    <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Every event, every society, every free&nbsp;slice&nbsp;of&nbsp;pizza
                        — all in one&nbsp;feed.
                    </p>

                    {/* CTA button */}
                    <motion.button
                        whileHover={{ scale: 1.05, translateY: -4 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate('/app')}
                        className="mt-12 inline-flex items-center gap-2 px-10 py-5 text-xl font-black rounded-xl border-[4px] border-black dark:border-white/20 bg-[#bef264] text-black transition-all duration-150"
                        style={{
                            boxShadow: isDarkMode
                                ? '0 0 40px rgba(190,242,100,0.45)'
                                : '8px 8px 0px 0px rgba(0,0,0,1)',
                        }}
                    >
                        Enter the Hive
                        <ArrowRight className="w-6 h-6" strokeWidth={3.5} />
                    </motion.button>
                </motion.div>

                {/* Ticket Stack */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-full mt-16 pb-12"
                >
                    <FeaturedEventStack />
                </motion.div>
            </section>

            {/* ━━━━━━━━ ASK HIVE DEMO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section className="relative z-20 container max-w-xl mx-auto px-4 -mt-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        ✨ Try our AI search
                    </p>
                    <div
                        className={`landing-flashlight-reveal rounded-2xl p-1 transition-opacity duration-300 ${isDarkMode ? 'opacity-0 hover:opacity-100' : ''
                            } ${isDarkMode ? 'neon-border-glow' : ''}`}
                    >
                        <AskHive events={[]} onFilterEvents={() => { }} />
                    </div>
                </motion.div>
            </section>

            {/* ━━━━━━━━ BRING HIVE TO YOUR UNI ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section className="relative z-20 container max-w-xl mx-auto px-4 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5 }}
                    className="brutal-card dark:bg-card dark:border-gray-800 p-8 md:p-10"
                    style={{
                        boxShadow: isDarkMode
                            ? '0 0 30px rgba(34,211,238,0.15)'
                            : '6px 6px 0px 0px #000',
                    }}
                >
                    <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                        🐝 Bring Hive to Your Uni
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                        Want this for your university? Drop your details and we&apos;ll
                        buzz over.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            required
                            placeholder="you@uni.ac.uk"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="brutal-input w-full px-4 py-3 text-sm font-medium bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#22d3ee] dark:bg-black dark:border-gray-700"
                        />
                        <input
                            type="text"
                            required
                            placeholder="University Name"
                            value={uniName}
                            onChange={(e) => setUniName(e.target.value)}
                            className="brutal-input w-full px-4 py-3 text-sm font-medium bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#bef264] dark:bg-black dark:border-gray-700"
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="brutal-button-primary w-full py-3 text-base"
                        >
                            Let&apos;s Go 🚀
                        </motion.button>
                    </form>
                </motion.div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer className="relative z-20 text-center py-8 text-xs text-muted-foreground">
                Built with 🍯 by students, for students.
            </footer>
        </div>
    );
}
