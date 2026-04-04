import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Footer from '@/components/ui/Footer';
import CatalogBackground from '@/components/3d/CatalogBackground';
import dbConnect from '@/lib/db';
import Marble from '@/models/Marble';

export const dynamic = 'force-dynamic';

export default async function Catalog() {
    await dbConnect();
    // Fetch real marbles from MongoDB
    const marblesRes = await Marble.find({}).sort({ createdAt: -1 }).lean();
    
    // Fallback safely if db is empty
    if (!marblesRes || marblesRes.length === 0) {
        return (
            <div className={styles.container}>
                <CatalogBackground />
                <header className={styles.topNav}>
                    <div className={styles.navInner}>
                        <Link href="/" className={styles.brand}>Gemarix</Link>
                        <Link href="/" className={styles.backLink}>Exit Catalog ✕</Link>
                    </div>
                </header>
                <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <h2>Our collection is currently being updated.</h2>
                </div>
            </div>
        );
    }
    
    // Find the primary featured marble, or fallback to the first one available
    const featuredMarbleRaw = marblesRes.find(m => m.isFeatured) || marblesRes[0];
    
    // Construct standard DTOs
    const featuredMarble = {
        name: featuredMarbleRaw.name,
        type: featuredMarbleRaw.type,
        description: featuredMarbleRaw.description || 'The absolute pinnacle of luxury stone.',
        img: (featuredMarbleRaw.images && featuredMarbleRaw.images.length > 0) ? featuredMarbleRaw.images[0] : '/images/statuario-premium.png'
    };

    const regularMarbles = marblesRes.filter(m => m._id !== featuredMarbleRaw._id).map((marble) => ({
        id: marble._id.toString(),
        name: marble.name,
        type: marble.type,
        description: marble.description,
        img: (marble.images && marble.images.length > 0) ? marble.images[0] : '/images/premium-dark.png',
        badge: marble.isChosenOne ? "Editor's Choice" : null
    }));

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
                        <Link href={`/contact?marble=${encodeURIComponent(featuredMarble.name)}`} className={styles.primaryBtn}>Enquire Now</Link>
                    </div>
                </div>
            </section>

            <section className={styles.gridSection}>
                <div className={styles.gridHeader}>
                    <h2 className={styles.gridTitle}>The Masterpiece Collection</h2>
                    <p className={styles.gridSubtitle}>A curated selection of the Earth's rarest natural stones.</p>
                </div>

                <div className={styles.bentoGrid}>
                    {regularMarbles.map((marble, idx) => (
                        <div key={marble.id} className={`${styles.bentoCard} ${styles['bento' + (idx % 6)]}`}>
                            <Link href={`/contact?marble=${encodeURIComponent(marble.name)}`} className={styles.cardLink}>
                                <div className={styles.cardImageWrapper}>
                                    <Image src={marble.img} alt={marble.name} fill className={styles.cardImage} />
                                    <div className={styles.cardOverlay}>
                                        <div className={styles.bentoInfo}>
                                            {marble.badge && <span className={styles.cardBadge} style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--a-gold)', color: '#000', borderRadius: 4, display: 'inline-block', marginBottom: 4 }}>{marble.badge}</span>}
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
