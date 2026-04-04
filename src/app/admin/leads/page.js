'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Trash2, Phone, Save, MessageSquare } from 'lucide-react';

const STATUS_COLORS = {
    New: 'badge-amber',
    Contacted: 'badge-blue',
    Converted: 'badge-green',
    Lost: 'badge-red',
    Pending: 'badge-amber',
    Resolved: 'badge-green',
};

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [toast, setToast] = useState(null);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [noteDraft, setNoteDraft] = useState('');

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchLeads = async () => {
        setLoading(true);
        const params = filter !== 'all' ? `?status=${filter}` : '';
        const res = await fetch(`/api/admin/leads${params}`);
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        setLeads(data.leads || []);
        setLoading(false);
    };

    useEffect(() => { fetchLeads(); }, [filter]);

    const updateStatus = async (id, status) => {
        const res = await fetch(`/api/admin/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            showToast('Status updated');
            fetchLeads();
        } else {
            showToast('Failed to update status', 'error');
        }
    };

    const saveNotes = async (id) => {
        const res = await fetch(`/api/admin/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes: noteDraft })
        });
        if (res.ok) {
            showToast('Notes saved');
            setEditingNoteId(null);
            fetchLeads();
        } else {
            showToast('Failed to save notes', 'error');
        }
    };

    const deleteLead = async (id, name) => {
        if (!confirm(`Delete lead "${name}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Lead deleted');
            fetchLeads();
        } else {
            showToast('Failed to delete', 'error');
        }
    };

    const handleExport = () => {
        window.location.href = `/api/admin/leads?export=csv${filter !== 'all' ? `&status=${filter}` : ''}`;
    };

    const filtered = leads.filter(l =>
        l.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        l.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.interestedProduct?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Lead CRM</h1>
                    <p className="admin-page-subtitle">Track and manage customer inquiries</p>
                </div>
                <button onClick={handleExport} className="btn btn-secondary">
                    <Download size={15} /> Export CSV
                </button>
            </div>

            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                    <div className="admin-search">
                        <Search />
                        <input
                            placeholder="Search names, emails, products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="admin-toolbar-right">
                    {['all', 'New', 'Contacted', 'Converted', 'Lost'].map(s => (
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
                        <Search size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <h3>No leads found</h3>
                        <p>No inquiries match the current filters.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table" style={{ minWidth: 1000 }}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Contact</th>
                                    <th>Interest / Message</th>
                                    <th>Status</th>
                                    <th>Notes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(lead => (
                                    <tr key={lead._id}>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--a-text-muted)' }}>
                                            {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short'
                                            })}
                                        </td>
                                        <td>
                                            <div className="text-main" style={{ fontWeight: 600 }}>{lead.customerName}</div>
                                            {lead.companyName && (
                                                <div style={{ fontSize: '0.75rem', color: 'var(--a-text-muted)', marginTop: 2 }}>
                                                    {lead.companyName}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.8rem', marginBottom: 2 }}>{lead.email}</div>
                                            {lead.phone && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--a-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Phone size={12} /> {lead.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ maxWidth: 250 }}>
                                            <div className="text-main" style={{ fontSize: '0.85rem', marginBottom: 4 }}>
                                                {lead.interestedProduct || '-'}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--a-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={lead.message}>
                                                {lead.message}
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                className={`badge ${STATUS_COLORS[lead.status] || 'badge-gray'}`}
                                                value={lead.status}
                                                onChange={(e) => updateStatus(lead._id, e.target.value)}
                                                style={{ border: 'none', appearance: 'none', cursor: 'pointer', outline: 'none' }}
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Lost">Lost</option>
                                                {/* Keep old ones for backwards compat */}
                                                <option value="Pending">Pending</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </td>
                                        <td style={{ maxWidth: 200 }}>
                                            {editingNoteId === lead._id ? (
                                                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                                                    <textarea
                                                        className="form-textarea"
                                                        style={{ minHeight: 60, padding: '4px 8px', fontSize: '0.8rem' }}
                                                        value={noteDraft}
                                                        onChange={(e) => setNoteDraft(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                        <button onClick={() => saveNotes(lead._id)} className="btn btn-primary btn-icon btn-sm">
                                                            <Save size={14} />
                                                        </button>
                                                        <button onClick={() => setEditingNoteId(null)} className="btn btn-ghost btn-icon btn-sm">
                                                            <Trash2 size={14} /> {/* using trash icon as cancel for compact UI */}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--a-text-soft)', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                        {lead.notes || <span style={{ opacity: 0.5 }}>No notes</span>}
                                                    </div>
                                                    <button
                                                        onClick={() => { setEditingNoteId(lead._id); setNoteDraft(lead.notes || ''); }}
                                                        className="btn btn-ghost btn-icon btn-sm" style={{ padding: 4 }} title="Edit notes"
                                                    >
                                                        <PencilIcon size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => deleteLead(lead._id, lead.customerName)}
                                                className="btn btn-danger btn-icon btn-sm"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>}
        </div>
    );
}

// Simple edit pencil icon component within file
function PencilIcon({ size = 24, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
      <path d="m15 5 4 4"/>
    </svg>
  );
}
