import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

// A clean, angled wooden stick (top-right to bottom-left)
const DIPPER_PATH = "M 75 15 L 85 25 L 45 65 L 35 55 Z";

// A neat, ribbed honey dipper head at the bottom-left of the stick
const DIPPER_HEAD = `
  M 45 65 
  C 48 68, 48 72, 45 75 
  C 42 78, 38 78, 35 75 
  C 32 72, 32 68, 35 65 
  Z
  M 40 60
  C 45 65, 40 70, 35 65
  M 50 70
  C 45 75, 40 70, 45 65
`;

// A slick honey droplet clinging perfectly to the bottom-left tip of the head
const DROPLET_PATH = "M 32 72 C 20 85, 35 95, 42 78 C 38 75, 35 72, 32 72 Z";

export function HoneyDropCursor() {
    const { isDarkMode } = useTheme();
    const [isHovering, setIsHovering] = useState(false);
    const [isPointerFine, setIsPointerFine] = useState(true);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Main cursor spring (Instant, very stiff to follow cursor exactly with micro-smoothing)
    const springConfig = { stiffness: 1000, damping: 40 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // Trails for the liquid gooey effect! 
    // Increased stiffness to keep them tight to the cursor, preventing excessive lag
    const trail1X = useSpring(mouseX, { stiffness: 800, damping: 50 });
    const trail1Y = useSpring(mouseY, { stiffness: 800, damping: 50 });

    const trail2X = useSpring(mouseX, { stiffness: 600, damping: 65 });
    const trail2Y = useSpring(mouseY, { stiffness: 600, damping: 65 });

    const trail3X = useSpring(mouseX, { stiffness: 450, damping: 80 });
    const trail3Y = useSpring(mouseY, { stiffness: 450, damping: 80 });

    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastTime = useRef(Date.now());

    const velocityX = useMotionValue(0);
    const velocityY = useMotionValue(0);

    const rotationAngle = useTransform([velocityX, velocityY], ([vx, vy]) => {
        const x = typeof vx === 'number' ? vx : 0;
        const y = typeof vy === 'number' ? vy : 0;
        if (x === 0 && y === 0) return 0;
        return (Math.atan2(y, x) * 180) / Math.PI;
    });

    const stretchScaleX = useTransform([velocityX, velocityY], ([vx, vy]) => {
        const x = typeof vx === 'number' ? vx : 0;
        const y = typeof vy === 'number' ? vy : 0;
        const speed = Math.sqrt(x * x + y * y);
        const stretch = 1 + Math.min(speed / 1000, 0.5);
        return isHovering ? 1.5 : stretch;
    });

    const stretchScaleY = useTransform([velocityX, velocityY], ([vx, vy]) => {
        const x = typeof vx === 'number' ? vx : 0;
        const y = typeof vy === 'number' ? vy : 0;
        const speed = Math.sqrt(x * x + y * y);
        const squash = Math.max(1 - (speed / 1000) * 0.5, 0.8);
        return isHovering ? 1.5 : squash;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(pointer: fine)");
        setIsPointerFine(mediaQuery.matches);

        const handleMediaChange = (e: MediaQueryListEvent) => {
            setIsPointerFine(e.matches);
        };
        mediaQuery.addEventListener("change", handleMediaChange);

        const handleMouseMove = (e: MouseEvent) => {
            const currentTime = Date.now();
            const dt = Math.max(currentTime - lastTime.current, 1);

            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;

            velocityX.set((dx / dt) * 50);
            velocityY.set((dy / dt) * 50);

            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            lastMousePos.current = { x: e.clientX, y: e.clientY };
            lastTime.current = currentTime;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'input' ||
                target.closest('button') !== null ||
                target.closest('a') !== null ||
                getComputedStyle(target).cursor === 'pointer' ||
                getComputedStyle(target).cursor === 'grab' ||
                getComputedStyle(target).cursor === 'grabbing';

            setIsHovering(isClickable);
        };

        if (mediaQuery.matches) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseover', handleMouseOver);
        }

        const interval = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime - lastTime.current > 50) {
                velocityX.set(velocityX.get() * 0.8);
                velocityY.set(velocityY.get() * 0.8);
            }
        }, 16);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            clearInterval(interval);
        };
    }, [mouseX, mouseY, velocityX, velocityY]);

    if (!isPointerFine) return null;

    // Theming
    const fillColor = isDarkMode ? '#bef264' : '#FFCE00'; // Soton Goldish (tweaked for honey)
    const dropShadow = isDarkMode
        ? 'drop-shadow(0 0 12px rgba(190,242,100,0.8))'
        : 'drop-shadow(3px 3px 0px rgba(0,0,0,1))';

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{ filter: dropShadow }}
        >
            {/* SVG defining the goo and the glossy gradients */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="honey-goo" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* LAYER 1: Gooey Blobs (No detailed borders/highlights so they merge fluidly) */}
            <div className="absolute inset-0" style={{ filter: "url('#honey-goo')" }}>

                {/* Trail Particles dropping from the exact center of the dipper's honey drop. 
                    The drop's bottom-left tip is at roughly (32, 85) in the viewBox. 
                    Since the viewBox is 100x100 mapped to a w-12 h-12 (48px) container,
                    the scale factor is ~0.48. Position is translated to match.
                */}
                <motion.div
                    style={{ x: trail3X, y: trail3Y, backgroundColor: fillColor }}
                    className="absolute top-0 left-0 w-3 h-3 ml-[7px] mt-[30px] rounded-full"
                />
                <motion.div
                    style={{ x: trail2X, y: trail2Y, backgroundColor: fillColor }}
                    className="absolute top-0 left-0 w-4 h-4 ml-[5px] mt-[26px] rounded-full"
                />
                <motion.div
                    style={{ x: trail1X, y: trail1Y, backgroundColor: fillColor }}
                    className="absolute top-0 left-0 w-6 h-6 ml-[1px] mt-[16px] rounded-full"
                />

                {/* Main solid dropping shape for the gooey trail to connect to */}
                <motion.div
                    style={{ x: cursorX, y: cursorY }}
                    className="absolute top-0 left-0"
                >
                    <motion.div
                        animate={{
                            scaleX: isHovering ? 1.5 : stretchScaleX.get(),
                            scaleY: isHovering ? 1.5 : stretchScaleY.get(),
                            rotate: isHovering ? 0 : rotationAngle.get(),
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-8 h-8 -ml-4 -mt-4 origin-center"
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full origin-center">
                            {/* Hidden base area so the gooey trail correctly connects to the dipper head */}
                            <path d={DIPPER_HEAD} fill={fillColor} />
                            <path d={DROPLET_PATH} fill={fillColor} />
                        </svg>
                    </motion.div>
                </motion.div>

            </div>

            {/* LAYER 2: Detailed Overlay (The Wooden Dipper & Glossy drops) */}
            <div className="absolute inset-0">
                <motion.div
                    style={{ x: cursorX, y: cursorY }}
                    className="absolute top-0 left-0"
                >
                    <motion.div
                        animate={{
                            scale: isHovering ? 1.2 : 1, // Only scale up on hover now, no squash/stretch for physical wood
                            rotate: isHovering ? -15 : 0, // Slight tip when hovering
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-12 h-12 -ml-3 -mt-3 origin-top-left"
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full origin-center">
                            {/* Wooden Handle */}
                            <path
                                d={DIPPER_PATH}
                                fill="#D4A373"
                                stroke="#A98467"
                                strokeWidth="4"
                                strokeLinejoin="round"
                            />

                            {/* Honey Dipper Head Ridges (Wooden) */}
                            <path
                                d={DIPPER_HEAD}
                                fill="#FAEDCD"
                                stroke="#A98467"
                                strokeWidth="4"
                                strokeLinejoin="round"
                            />

                            {/* Solid Honey Coating on the Head */}
                            <path
                                d="M 35 60 C 30 75, 45 80, 50 65 C 50 60, 35 55, 35 60 Z"
                                fill={fillColor}
                                stroke="black"
                                strokeWidth="3"
                                strokeLinejoin="round"
                            />

                            {/* Droplet separating from head */}
                            <path
                                d={DROPLET_PATH}
                                fill={fillColor}
                                stroke="black"
                                strokeWidth="3"
                                strokeLinejoin="round"
                                className="transition-all duration-300 ease-out"
                            />

                            {/* Glossy Curved Highlight on Honey Coating */}
                            <path
                                d="M 38 72 C 35 78, 42 85, 46 76"
                                fill="none"
                                stroke="rgba(255,255,255,0.7)"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
