'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, FileText } from 'lucide-react';

const STATUS_COLORS = { published: 'badge-green', draft: 'badge-gray' };

export default function BlogsPage() {
    const [blogs, setBlogs]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [toast, setToast]   = useState(null);

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchBlogs = async () => {
        setLoading(true);
        const params = filter !== 'all' ? `?status=${filter}` : '';
        const res = await fetch(`/api/admin/blogs${params}`);
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        setBlogs(data.blogs || []);
        setLoading(false);
    };

    useEffect(() => { fetchBlogs(); }, [filter]);

    const deleteBlog = async (id, title) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Blog deleted');
            fetchBlogs();
        } else {
            showToast('Failed to delete', 'error');
        }
    };

    const toggleStatus = async (blog) => {
        const newStatus = blog.status === 'published' ? 'draft' : 'published';
        const res = await fetch(`/api/admin/blogs/${blog._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            showToast(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'}`);
            fetchBlogs();
        }
    };

    const filtered = blogs.filter(b =>
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Blog & CMS</h1>
                    <p className="admin-page-subtitle">Create and manage your blog content</p>
                </div>
                <Link href="/admin/blogs/new" className="btn btn-primary">
                    <Plus size={16} /> New Blog Post
                </Link>
            </div>

            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                    <div className="admin-search">
                        <Search />
                        <input
                            placeholder="Search posts..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="admin-toolbar-right">
                    {['all', 'published', 'draft'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                {loading ? (
                    <div className="admin-empty"><div className="admin-spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty">
                        <FileText size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <h3>No blog posts yet</h3>
                        <p>Start writing to build trust with your customers.</p>
                        <Link href="/admin/blogs/new" className="btn btn-primary">Write First Post</Link>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(blog => (
                                <tr key={blog._id}>
                                    <td>
                                        <div className="text-main" style={{ maxWidth: 300 }}>{blog.title}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--a-text-muted)', marginTop: 2 }}>
                                            /{blog.slug}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-blue">{blog.category || 'General'}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${STATUS_COLORS[blog.status] || 'badge-gray'}`}>
                                            {blog.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--a-text-muted)' }}>
                                        {new Date(blog.updatedAt).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                            <button
                                                onClick={() => toggleStatus(blog)}
                                                className="btn btn-ghost btn-icon btn-sm"
                                                title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                                            >
                                                {blog.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                            <Link href={`/admin/blogs/${blog._id}/edit`} className="btn btn-ghost btn-icon btn-sm">
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => deleteBlog(blog._id, blog.title)}
                                                className="btn btn-danger btn-icon btn-sm"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {toast && (
                <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>
            )}
        </div>
    );
}
