import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import Marble from '@/models/Marble';
import Blog from '@/models/Blog';
import Link from 'next/link';
import { Users, Gem, FileText, Clock, Plus, TrendingUp } from 'lucide-react';
import DashboardActivity from './DashboardActivity';

export const metadata = { title: 'Dashboard — Gemarix Admin' };

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/admin/login');

    await connectDB();

    const [totalLeads, newLeads, totalMarbles, totalBlogs, publishedBlogs, recentLeads] =
        await Promise.all([
            Inquiry.countDocuments(),
            Inquiry.countDocuments({ status: { $in: ['New', 'Pending'] } }),
            Marble.countDocuments(),
            Blog.countDocuments(),
            Blog.countDocuments({ status: 'published' }),
            Inquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
        ]);

    const statusColor = {
        New: 'badge-amber', Pending: 'badge-amber',
        Contacted: 'badge-blue', Converted: 'badge-green',
        Lost: 'badge-red',   Resolved: 'badge-green',
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Dashboard</h1>
                    <p className="admin-page-subtitle">
                        Welcome back, {session.user?.name} 👋 Here's what's happening today.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <Link href="/admin/marbles/new" className="btn btn-secondary btn-sm">
                        <Plus style={{ width: 14, height: 14 }} /> Add Marble
                    </Link>
                    <Link href="/admin/blogs/new" className="btn btn-primary btn-sm">
                        <Plus style={{ width: 14, height: 14 }} /> New Blog
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="admin-stats">
                <div className="admin-stat amber">
                    <div className="admin-stat-icon"><Users size={18} /></div>
                    <div className="admin-stat-value">{totalLeads}</div>
                    <div className="admin-stat-label">Total Leads</div>
                </div>
                <div className="admin-stat red">
                    <div className="admin-stat-icon"><Clock size={18} /></div>
                    <div className="admin-stat-value">{newLeads}</div>
                    <div className="admin-stat-label">Needs Attention</div>
                </div>
                <div className="admin-stat gold">
                    <div className="admin-stat-icon"><Gem size={18} /></div>
                    <div className="admin-stat-value">{totalMarbles}</div>
                    <div className="admin-stat-label">Marble Products</div>
                </div>
                <div className="admin-stat green">
                    <div className="admin-stat-icon"><TrendingUp size={18} /></div>
                    <div className="admin-stat-value">{publishedBlogs}</div>
                    <div className="admin-stat-label">Live Blogs</div>
                </div>
                <div className="admin-stat blue">
                    <div className="admin-stat-icon"><FileText size={18} /></div>
                    <div className="admin-stat-value">{totalBlogs - publishedBlogs}</div>
                    <div className="admin-stat-label">Draft Blogs</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
                {/* Recent Leads Table */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--a-text)' }}>
                            Recent Leads
                        </h2>
                        <Link href="/admin/leads" className="btn btn-ghost btn-sm">View All →</Link>
                    </div>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Product Interest</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLeads.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--a-text-muted)' }}>
                                            No leads yet. Share your catalog link! 🚀
                                        </td>
                                    </tr>
                                )}
                                {recentLeads.map(lead => (
                                    <tr key={lead._id.toString()}>
                                        <td className="text-main">{lead.customerName}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{lead.email}</td>
                                        <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {lead.interestedProduct || lead.companyName || '—'}
                                        </td>
                                        <td>
                                            <span className={`badge ${statusColor[lead.status] || 'badge-gray'}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--a-text-muted)' }}>
                                            {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <DashboardActivity totalLeads={totalLeads} />
                    <div>
                        <h2 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600, color: 'var(--a-text)' }}>
                            Quick Actions
                        </h2>
                        <div className="admin-card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { href: '/admin/leads',    emoji: '📋', label: 'Manage Leads' },
                                { href: '/admin/marbles',  emoji: '💎', label: 'Marble Inventory' },
                                { href: '/admin/blogs',    emoji: '📝', label: 'Blog & Content' },
                                { href: '/admin/media',    emoji: '🖼️', label: 'Media Library' },
                                { href: '/admin/settings', emoji: '⚙️', label: 'Integrations & SEO' },
                            ].map(({ href, emoji, label }) => (
                                <Link key={href} href={href} className="btn btn-ghost"
                                    style={{ justifyContent: 'flex-start', gap: 10, padding: '9px 12px' }}>
                                    <span>{emoji}</span>
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
