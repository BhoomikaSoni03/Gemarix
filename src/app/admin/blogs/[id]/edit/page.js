'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Send, Eye, Code2 } from 'lucide-react';

const CATEGORIES = ['General', 'Marble Guide', 'Design Tips', 'Industry News', 'Projects', 'Company'];

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function EditBlogPage({ params }) {
    const router = useRouter();
    const [form, setForm] = useState({
        title: '', slug: '', content: '', excerpt: '',
        featuredImage: '', category: 'General', tags: '',
        metaTitle: '', metaDescription: '', status: 'draft'
    });
    const [tab, setTab] = useState('editor');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            const resolvedParams = await params;
            const res = await fetch(`/api/admin/blogs/${resolvedParams.id}`);
            if (res.status === 401) { window.location.href = '/admin/login'; return; }
            if (res.ok) {
                const data = await res.json();
                const blog = data.blog;
                setForm({
                    ...blog,
                    tags: blog.tags ? blog.tags.join(', ') : '',
                });
            } else {
                showToast('Blog not found', 'error');
                router.push('/admin/blogs');
            }
            setLoading(false);
        };
        fetchBlog();
    }, [params, router]);

    const set = (key) => (e) => {
        const val = e.target ? e.target.value : e;
        setForm(f => {
            const next = { ...f, [key]: val };
            if (key === 'title' && (!f.slug || f.slug === slugify(f.title))) {
                next.slug = slugify(val);
            }
            return next;
        });
    };

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 3000);
    };

    const save = async (status = form.status) => {
        if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
        if (!form.content.trim()) { showToast('Content is required', 'error'); return; }
        setSaving(true);
        const resolvedParams = await params;
        const payload = {
            ...form,
            status,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        };
        const res = await fetch(`/api/admin/blogs/${resolvedParams.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        if (data.blog) {
            showToast(status === 'published' ? '🚀 Published!' : '💾 Saved as draft');
            setTimeout(() => router.push('/admin/blogs'), 1500);
        } else {
            showToast(data.error || 'Failed to save', 'error');
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="admin-page"><div className="admin-spinner" /></div>;
    }

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="admin-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link href="/admin/blogs" className="btn btn-ghost btn-icon btn-sm">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="admin-page-title">Edit Blog Post</h1>
                        <p className="admin-page-subtitle">Update your content</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => save('draft')} disabled={saving} className="btn btn-secondary">
                        <Save size={15} /> {saving ? 'Saving…' : 'Save Draft'}
                    </button>
                    <button onClick={() => save('published')} disabled={saving} className="btn btn-primary">
                        <Send size={15} /> {saving ? 'Publishing…' : 'Publish'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                {/* Main Editor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Title */}
                    <div className="admin-card">
                        <div className="form-group">
                            <label className="form-label">Post Title *</label>
                            <input
                                className="form-input"
                                placeholder="e.g. Why Italian Marble is Worth the Investment"
                                value={form.title}
                                onChange={set('title')}
                                style={{ fontSize: '1.1rem', fontWeight: 600 }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Slug (URL)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--a-text-muted)', flexShrink: 0 }}>/blog/</span>
                                <input className="form-input" value={form.slug} onChange={set('slug')} />
                            </div>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--a-border)', padding: '0 16px' }}>
                            {['editor', 'preview'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`admin-tab${tab === t ? ' active' : ''}`}
                                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                >
                                    {t === 'editor' ? <Code2 size={14} /> : <Eye size={14} />}
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--a-text-muted)' }}>Supports HTML tags</span>
                            </div>
                        </div>
                        {tab === 'editor' ? (
                            <textarea
                                className="form-textarea"
                                placeholder={`Write your blog content here...\n\nYou can use basic HTML:\n<h2>Section Heading</h2>\n<p>Your paragraph text</p>\n<ul><li>Bullet point</li></ul>\n<strong>Bold text</strong>, <em>Italic text</em>`}
                                value={form.content}
                                onChange={set('content')}
                                style={{
                                    borderRadius: 0, border: 'none', minHeight: 420,
                                    fontFamily: 'monospace', fontSize: '0.85rem',
                                    background: 'var(--a-surface)', padding: 16,
                                }}
                            />
                        ) : (
                            <div
                                style={{ minHeight: 420, padding: 24, lineHeight: 1.8, color: 'var(--a-text)' }}
                                dangerouslySetInnerHTML={{ __html: form.content || '<p style="color:#475569">Nothing to preview yet…</p>' }}
                            />
                        )}
                    </div>

                    {/* Excerpt */}
                    <div className="admin-card">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Excerpt (optional)</label>
                            <textarea
                                className="form-textarea"
                                rows={3}
                                placeholder="Brief summary shown in blog listing (max 300 chars)"
                                maxLength={300}
                                value={form.excerpt}
                                onChange={set('excerpt')}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Category & Tags */}
                    <div className="admin-card">
                        <h3 style={{ margin: '0 0 14px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--a-text)' }}>
                            Categorization
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-select" value={form.category} onChange={set('category')}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Tags</label>
                            <input
                                className="form-input"
                                placeholder="marble, luxury, interior (comma separated)"
                                value={form.tags}
                                onChange={set('tags')}
                            />
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="admin-card">
                        <h3 style={{ margin: '0 0 14px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--a-text)' }}>
                            Featured Image
                        </h3>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Image URL</label>
                            <input
                                className="form-input"
                                placeholder="Paste Cloudinary or any image URL"
                                value={form.featuredImage}
                                onChange={set('featuredImage')}
                            />
                            {form.featuredImage && (
                                <img
                                    src={form.featuredImage}
                                    alt="preview"
                                    style={{ width: '100%', borderRadius: 8, marginTop: 10, objectFit: 'cover', height: 120 }}
                                    onError={e => e.target.style.display = 'none'}
                                />
                            )}
                            <p className="form-hint">
                                💡 Upload to <Link href="/admin/media" style={{ color: 'var(--a-gold)' }}>Media Library</Link> first, then paste URL here.
                            </p>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="admin-card">
                        <h3 style={{ margin: '0 0 14px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--a-text)' }}>
                            SEO Settings
                        </h3>
                        <div className="form-group">
                            <label className="form-label">
                                Meta Title
                                <span style={{ float: 'right', color: 'var(--a-text-muted)' }}>
                                    {form.metaTitle?.length || 0}/70
                                </span>
                            </label>
                            <input
                                className="form-input"
                                maxLength={70}
                                placeholder="SEO title (leave blank to use post title)"
                                value={form.metaTitle}
                                onChange={set('metaTitle')}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">
                                Meta Description
                                <span style={{ float: 'right', color: 'var(--a-text-muted)' }}>
                                    {form.metaDescription?.length || 0}/160
                                </span>
                            </label>
                            <textarea
                                className="form-textarea"
                                rows={3}
                                maxLength={160}
                                placeholder="Brief description for Google search results"
                                value={form.metaDescription}
                                onChange={set('metaDescription')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>}
        </div>
    );
}
