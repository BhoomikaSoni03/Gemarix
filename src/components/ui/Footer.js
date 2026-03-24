import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.column}>
                    <h2 className={styles.brand}>Gemarix</h2>
                    <p className={styles.description}>
                        The ultimate B2B luxury marble destination. Perfecting the art of natural stone.
                    </p>
                </div>

                <div className={styles.column}>
                    <h3>Collections</h3>
                    <Link href="/catalog?type=exotic">Exotic Granite</Link>
                    <Link href="/catalog?type=white">Premium White</Link>
                    <Link href="/catalog?type=onyx">Luxury Onyx</Link>
                </div>

                <div className={styles.column}>
                    <h3>Company</h3>
                    <Link href="/about">Our Story</Link>
                    <Link href="/contact">Inquiries</Link>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} Gemarix Premium Marbles. All rights reserved.</p>
            </div>
        </footer>
    );
}
