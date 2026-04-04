import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from '../page.module.css';
import Footer from '@/components/ui/Footer';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    await dbConnect();
    const blog = await Blog.findOne({ slug, status: 'published' }).lean();

    if (!blog) return { title: 'Not Found' };

    return {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt,
        openGraph: {
            images: [blog.featuredImage || '/images/premium-dark.png']
        }
    };
}

export default async function BlogPost({ params }) {
    const { slug } = await params;
    
    await dbConnect();
    const blogRaw = await Blog.findOne({ slug, status: 'published' }).lean();

    if (!blogRaw) {
        notFound();
    }

    const blog = {
        title: blogRaw.title,
        content: blogRaw.content,
        category: blogRaw.category || 'General',
        img: blogRaw.featuredImage || '/images/premium-dark.png',
        date: new Date(blogRaw.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    return (
        <div className={styles.container}>
            <header className={styles.topNav}>
                <div className={styles.navInner}>
                    <Link href="/" className={styles.brand}>Gemarix</Link>
                    <div className={styles.navLinks}>
                        <Link href="/blogs">Back to Journal ✕</Link>
                    </div>
                </div>
            </header>

            <article>
                <div className={styles.articleHero}>
                    <Image src={blog.img} alt={blog.title} fill className={styles.heroImage} priority />
                    <div className={styles.heroOverlay}></div>
                    <div className={styles.articleHeader}>
                        <span className={styles.articleCategory}>{blog.category}</span>
                        <h1 className={styles.articleTitle}>{blog.title}</h1>
                        <span className={styles.articleMeta}>{blog.date}</span>
                    </div>
                </div>

                <div className={styles.articleBodyWrapper}>
                    {/* The HTML stored in DB must be rendered dangerously */}
                    <div className={styles.articleBody} dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                </div>
            </article>

            <Footer />
        </div>
    );
}
