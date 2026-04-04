'use client';

import Link from 'next/link';
import Image from 'next/image';
import MarbleScene from '@/components/3d/MarbleScene';
import Footer from '@/components/ui/Footer';
import styles from './page.module.css';
import { useEffect, useState } from 'react';

const inSituImages = [
  { img: '/images/insitu-bathroom.png', label: 'Master Bathroom', desc: 'Pristine Calacatta' },
  { img: '/images/insitu-office.png', label: 'Executive Office', desc: 'Exotic Gold Noir' },
  { img: '/images/insitu-home.png', label: 'Living Room', desc: 'Statuario Premium' },
  { img: '/images/insitu-hotel.png', label: 'Hotel Lobby', desc: 'Rosso Levanto' },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(1000);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollProgress = windowHeight > 0 ? Math.min(Math.max(scrollY / windowHeight, 0), 1) : 0;
  // Company name fades in only AFTER balls have settled (past 85% scroll progress)
  const showBrand = scrollProgress > 0.85;

  return (
    <div className={styles.scrollytellingWrapper}>
      <MarbleScene />

      <header className={styles.topNav}>
        <Link href="/" className={styles.logo}>Gemarix</Link>
        <div className={styles.navLinks}>
          <Link href="/catalog">Gallery</Link>
          <Link href="/blogs">Journal</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </header>

      {/* Spacer to trigger scroll physics */}
      <div className={styles.scrollSpacer}></div>

      {/* Company name appears AFTER the three balls have settled at the bottom */}
      <div className={`${styles.brandSection} ${showBrand ? styles.visible : ''}`}>
        <h1 className={styles.brandTitle}>Gemarix</h1>
        <p className={styles.tagline}>Timeless Stone. Modern Elegance.</p>
        <Link href="/catalog" className={styles.exploreBtn}>Explore Collection</Link>
      </div>

      {/* === Sections below the fold (normal scroll) === */}
      <div className={styles.belowFold}>

        {/* In-Situ Gallery Section */}
        <section className={styles.inSituSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Stone in the Wild</h2>
            <p className={styles.sectionSubtitle}>Where our marble meets the world's most extraordinary spaces.</p>
          </div>

          <div className={styles.inSituGrid}>
            {inSituImages.map((item) => (
              <div key={item.label} className={styles.inSituCard}>
                <div className={styles.inSituImgWrapper}>
                  <Image src={item.img} alt={item.label} fill className={styles.inSituImg} />
                  <div className={styles.inSituOverlay}>
                    <span className={styles.inSituLabel}>{item.label}</span>
                    <span className={styles.inSituDesc}>{item.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
