import Link from 'next/link';
import MarbleScene from '@/components/3d/MarbleScene';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <MarbleScene />

      <div className={styles.hero}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Discover the <span className="premium-gradient-text">Finest Marbles</span>
          </h1>
          <p className={styles.subtitle}>
            An exclusive B2B collection curated for visionary architects and designers.
          </p>

          <div className={styles.actions}>
            <Link href="/catalog" className={styles.primaryButton}>
              Explore Collection
            </Link>
            <Link href="/contact" className={styles.secondaryButton}>
              Enquire Now
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Uncompromising Quality.</h2>
          <p className={styles.sectionText}>Every slab tells a story of geological perfection.</p>
        </div>
      </div>
    </>
  );
}
