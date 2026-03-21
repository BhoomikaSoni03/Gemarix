import Link from 'next/link';
import styles from './page.module.css';

// Mock list of marbles for the showcase UI.
const mockMarbles = [
    { id: 1, name: 'Calacatta Gold', type: 'Marble', description: 'Classic Italian marble with striking gold veins.', isChosenOne: true, img: 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Nero Marquina', type: 'Marble', description: 'Deep black marble with striking white veins from Spain.', isChosenOne: true, img: 'https://images.unsplash.com/photo-1598373356870-ab4d57c5bf38?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'Blue Bahia', type: 'Granite', description: 'Exotic blue granite from Brazil for luxury accents.', isChosenOne: false, img: 'https://images.unsplash.com/photo-1620021614275-f0ea9f8638b9?auto=format&fit=crop&q=80&w=800' },
];

export default function Catalog() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>The Collection</h1>
                <p className={styles.subtitle}>Browse our curated selection of premium stones.</p>
                <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>
            </header>

            <div className={styles.grid}>
                {mockMarbles.map((marble) => (
                    <div key={marble.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <div className={styles.placeholderImg} style={{ backgroundImage: `url(${marble.img})` }}>
                                {marble.isChosenOne && <span className={styles.badge}>Chosen One</span>}
                            </div>
                        </div>
                        <div className={styles.cardInfo}>
                            <div className={styles.cardHeader}>
                                <h3>{marble.name}</h3>
                                <span className={styles.type}>{marble.type}</span>
                            </div>
                            <p className={styles.description}>{marble.description}</p>

                            <Link href={`/contact?marble=${marble.name}`} className={styles.enquireBtn}>
                                Enquire Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
