import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Footer from '@/components/ui/Footer';
import CatalogBackground from '@/components/3d/CatalogBackground';

const featuredMarble = {
    id: 'statuario',
    name: 'Statuario Premium',
    type: 'Marble',
    description: 'The absolute pinnacle of luxury. Pure brilliantly white background with bold, dramatic sweeping dark grey veins. The finest choice for an immaculate showcase.',
    img: '/images/statuario-premium.png'
};

const mockMarbles = [
    { id: 1, name: 'Exotic Gold Noir', type: 'Marble', description: 'Deep black canvas pierced by striking golden veins.', img: '/images/premium-dark.png' },
    { id: 2, name: 'Pristine Calacatta', type: 'Marble', description: 'Immaculate white foundation with delicate grey sweeps.', img: '/images/premium-white.png' },
    { id: 3, name: 'Emerald Onyx', type: 'Onyx', description: 'Translucent dark green with glowing gold patterns.', img: '/images/emerald-onyx.png' },
    { id: 4, name: 'Blue Sodalite', type: 'Granite', description: 'Deep ocean blue colors mixed with stark white.', img: '/images/blue-sodalite.png' },
    { id: 5, name: 'Rosso Levanto', type: 'Marble', description: 'Deep burgundy red background with white veins.', img: '/images/rosso-levanto.png' },
];

export default function Catalog() {
    return (
        <div className={styles.container}>
            <CatalogBackground />
            <header className={styles.topNav}>
                <div className={styles.navInner}>
                    <Link href="/" className={styles.brand}>Gemarix</Link>
                    <Link href="/" className={styles.backLink}>Exit Catalog ✕</Link>
                </div>
            </header>

            <section className={styles.featuredSection}>
                <div className={styles.featuredImageWrapper}>
                    <Image src={featuredMarble.img} alt={featuredMarble.name} fill className={styles.featuredImage} priority />
                    <div className={styles.overlay}></div>
                </div>
                <div className={styles.featuredContent}>
                    <div className={styles.featuredText}>
                        <span className={styles.badge}>The Finest</span>
                        <h1 className={styles.featuredTitle}>{featuredMarble.name}</h1>
                        <p className={styles.featuredDesc}>{featuredMarble.description}</p>
                        <Link href={`/contact?marble=${featuredMarble.name}`} className={styles.primaryBtn}>Enquire Now</Link>
                    </div>
                </div>
            </section>

            <section className={styles.gridSection}>
                <div className={styles.gridHeader}>
                    <h2 className={styles.gridTitle}>The Masterpiece Collection</h2>
                    <p className={styles.gridSubtitle}>A curated selection of the Earth's rarest natural stones.</p>
                </div>

                <div className={styles.bentoGrid}>
                    {mockMarbles.map((marble, idx) => (
                        <div key={marble.id} className={`${styles.bentoCard} ${styles['bento' + idx]}`}>
                            <Link href={`/contact?marble=${marble.name}`} className={styles.cardLink}>
                                <div className={styles.cardImageWrapper}>
                                    <Image src={marble.img} alt={marble.name} fill className={styles.cardImage} />
                                    <div className={styles.cardOverlay}>
                                        <div className={styles.bentoInfo}>
                                            <h3>{marble.name}</h3>
                                            <span>{marble.type}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
