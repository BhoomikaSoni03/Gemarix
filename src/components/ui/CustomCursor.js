'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        // Hide the default cursor only on devices that support hover (desktop)
        if (window.matchMedia("(any-hover: hover)").matches) {
            document.body.style.cursor = 'none';
        } else {
            return; // Disable custom cursor on mobile
        }

        const cursor = cursorRef.current;
        if (!cursor) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        // Ensure we only track mouse movements
        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        let animationFrameId;

        const animate = () => {
            // Easing / LERP for smooth follow effect
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMouseMove);
        animate();

        // Sophisticated detection of interactive elements for the expand effect
        const handleMouseOver = (e) => {
            const isClickable =
                e.target.tagName.toLowerCase() === 'a' ||
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.closest('a') ||
                e.target.closest('button') ||
                window.getComputedStyle(e.target).cursor === 'pointer';

            setIsHovering(isClickable);
        };

        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationFrameId);
            document.body.style.cursor = 'auto'; // Restore default cursor on unmount
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className={`${styles.cursor} ${isHovering ? styles.hovering : ''}`}
        ></div>
    );
}
