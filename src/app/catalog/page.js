import Link from 'next/link';
import styles from './page.module.css';

// Mock list of marbles for the showcase UI.
const mockMarbles = [
    { id: 1, name: 'Calacatta Gold', type: 'Marble', description: 'Classic Italian marble with striking gold veins. Perfect for luxurious countertops, feature walls, and high-end residential projects.', isChosenOne: true, img: 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Nero Marquina', type: 'Marble', description: 'Deep black marble with striking white veins from Spain. Excellent for contrasting floors, modern bathrooms, and statement pieces.', isChosenOne: true, img: 'https://images.unsplash.com/photo-1598373356870-ab4d57c5bf38?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'Blue Bahia', type: 'Granite', description: 'Exotic blue granite from Brazil for luxury accents. Highly durable and rare, featuring stunning semi-precious sodalite blue patterns.', isChosenOne: false, img: 'https://images.unsplash.com/photo-1620021614275-f0ea9f8638b9?auto=format&fit=crop&q=80&w=800' },
    { id: 4, name: 'Carrara White', type: 'Marble', description: 'Timeless white and grey marble sourced from Tuscany. The absolute classic choice for elegant sculpting, traditional kitchens, and sophisticated commercial spaces.', isChosenOne: false, img: 'https://images.unsplash.com/photo-1598443915124-780826955dfc?auto=format&fit=crop&q=80&w=800' },
    { id: 5, name: 'Statuario', type: 'Marble', description: 'One of the most precious marbles in the world. Bright white background with distinct, bold grey veining. Highly sought after by elite designers.', isChosenOne: true, img: 'https://images.unsplash.com/photo-1610488019323-999331825227?auto=format&fit=crop&q=80&w=800' },
    { id: 6, name: 'Onyx Verde', type: 'Onyx', description: 'A translucent green onyx stone that can be backlit for a breathtaking glowing effect in premium bars and hotel lobbies.', isChosenOne: true, img: 'https://images.unsplash.com/photo-1601666872901-d7ad1a21e05d?auto=format&fit=crop&q=80&w=800' },
    { id: 7, name: 'Emperador Dark', type: 'Marble', description: 'Rich, dark brown marble with intricate webbing. Provides warmth and sophistication to traditional interiors, libraries, or cigar lounges.', isChosenOne: false, img: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&q=80&w=800' },
    { id: 8, name: 'Taj Mahal Quartzite', type: 'Quartzite', description: 'The elegant look of marble but the durability of granite. Soft creamy tones perfect for high-traffic luxury kitchens.', isChosenOne: false, img: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800' }
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
