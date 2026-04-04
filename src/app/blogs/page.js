import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Footer from '@/components/ui/Footer';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

export default async function Blogs() {
    await dbConnect();
    const rawBlogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 }).lean();

    const blogs = rawBlogs.map(b => ({
        id: b._id.toString(),
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt || 'Read this article to learn more about our premium stone collection.',
        category: b.category || 'General',
        img: b.featuredImage || '/images/premium-dark.png',
        date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }));

    return (
        <div className={styles.container}>
            <header className={styles.topNav}>
                <div className={styles.navInner}>
                    <Link href="/" className={styles.brand}>Gemarix</Link>
                    <div className={styles.navLinks}>
                        <Link href="/catalog">Catalog</Link>
                        <Link href="/contact">Contact</Link>
                    </div>
                </div>
            </header>

            <section className={styles.heroSection}>
                <div className={styles.heroText}>
                    <h1>The Journal</h1>
                    <p>Insights, trends, and comprehensive guides into the world of luxury natural stone.</p>
                </div>
            </section>

            <section className={styles.blogGrid}>
                {blogs.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No articles have been published yet. Check back soon.</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {blogs.map(blog => (
                            <Link href={`/blogs/${blog.slug}`} key={blog.id} className={styles.blogCard}>
                                <div className={styles.blogImageWrapper}>
                                    <Image src={blog.img} alt={blog.title} fill className={styles.blogImage} />
                                    <div className={styles.categoryBadge}>{blog.category}</div>
                                </div>
                                <div className={styles.blogContent}>
                                    <span className={styles.date}>{blog.date}</span>
                                    <h2>{blog.title}</h2>
                                    <p>{blog.excerpt}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
