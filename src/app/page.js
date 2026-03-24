import Link from 'next/link';
import MarbleScene from '@/components/3d/MarbleScene';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <MarbleScene />

      <div className={styles.hero}>
        <div className={styles.heroContent}>
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

      <section className={styles.collectionSection}>
        <div className={styles.collectionContent}>
          <h2 className={styles.sectionTitle}>The Aesthetic Collection</h2>
          <p className={styles.sectionText}>Scrolling through perfection. Experience the flawless textures of exotic natural stone.</p>

          <div className={styles.cardList}>
            <div className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <Image src="/images/premium-dark.png" alt="Exotic Black Marble" fill className={styles.cardImage} />
              </div>
              <div className={styles.cardInfo}>
                <h3>Exotic Gold Noir</h3>
                <p>Deep black canvas pierced by striking golden veins.</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <Image src="/images/premium-white.png" alt="Calacatta White" fill className={styles.cardImage} />
              </div>
              <div className={styles.cardInfo}>
                <h3>Pristine Calacatta</h3>
                <p>Immaculate white foundation with delicate grey and gold sweeps.</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <div className={`${styles.cardImage} ${styles.placeholderFallback}`}></div>
              </div>
              <div className={styles.cardInfo}>
                <h3>And many more...</h3>
                <Link href="/catalog" className={styles.viewAllLink}>View Full Catalog &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
