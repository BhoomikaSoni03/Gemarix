'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, IndianRupee, Image as ImageIcon } from 'lucide-react';

export default function MarblesPage() {
    const [marbles, setMarbles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [toast, setToast] = useState(null);

    // States for bulk pricing tool
    const [isBulkEditing, setIsBulkEditing] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkPriceChange, setBulkPriceChange] = useState({ type: 'retail', value: '' });

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchMarbles = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/marbles');
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        setMarbles(data.marbles || []);
        setLoading(false);
    };

    useEffect(() => { fetchMarbles(); }, []);

    const deleteMarble = async (id, name) => {
        if (!confirm(`Delete "${name}"? This will remove it from the catalog permanently.`)) return;
        const res = await fetch(`/api/admin/marbles/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Marble deleted');
            setSelectedIds(prev => prev.filter(vid => vid !== id));
            fetchMarbles();
        } else {
            showToast('Failed to delete', 'error');
        }
    };

    const handleBulkUpdate = async () => {
        if (!selectedIds.length || !bulkPriceChange.value) return;

        const val = parseFloat(bulkPriceChange.value);
        if (isNaN(val)) { showToast('Invalid price', 'error'); return; }

        const payload = { ids: selectedIds };
        if (bulkPriceChange.type === 'retail') payload.priceRetail = val;
        else payload.priceBulk = val;

        const res = await fetch('/api/admin/marbles', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showToast(`Updated pricing for ${selectedIds.length} items`);
            setIsBulkEditing(false);
            setSelectedIds([]);
            fetchMarbles();
        } else {
            showToast('Update failed', 'error');
        }
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        if (selectedIds.length === filtered.length) setSelectedIds([]);
        else setSelectedIds(filtered.map(m => m._id));
    };

    const categories = ['All', ...new Set(marbles.map(m => m.category || 'General'))];
    
    const filtered = marbles.filter(m => {
        const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase()) || m.type?.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === 'All' || (m.category || 'General') === categoryFilter;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Marble Inventory</h1>
                    <p className="admin-page-subtitle">Manage catalog, pricing, and stock availability</p>
                </div>
                <Link href="/admin/marbles/new" className="btn btn-primary">
                    <Plus size={16} /> Add Marble
                </Link>
            </div>

            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-toolbar-left" style={{ flex: 1 }}>
                    <div className="admin-search" style={{ maxWidth: 300 }}>
                        <Search />
                        <input
                            placeholder="Search inventory..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Category Filter */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-ghost'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="admin-toolbar-right">
                    <button
                        onClick={() => setIsBulkEditing(!isBulkEditing)}
                        className={`btn btn-sm ${isBulkEditing ? 'btn-secondary' : 'btn-ghost'}`}
                    >
                        <IndianRupee size={14} /> Bulk Pricing
                    </button>
                </div>
            </div>

            {/* Bulk Actions Panel */}
            {isBulkEditing && (
                <div className="admin-alert admin-alert-blue" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <strong>Bulk Price Edit:</strong> Select items below to apply a uniform price.
                        <span style={{ marginLeft: 10, color: 'var(--a-text-soft)' }}>
                            {selectedIds.length} selected
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <select
                            className="form-select" style={{ padding: '6px 10px', fontSize: '0.8rem', width: 130 }}
                            value={bulkPriceChange.type}
                            onChange={e => setBulkPriceChange({ ...bulkPriceChange, type: e.target.value })}
                        >
                            <option value="retail">Retail Price</option>
                            <option value="bulk">Wholesale Price</option>
                        </select>
                        <input
                            type="number"
                            className="form-input" style={{ width: 100, padding: '6px 10px', fontSize: '0.8rem' }}
                            placeholder="Set to ₹"
                            value={bulkPriceChange.value}
                            onChange={e => setBulkPriceChange({ ...bulkPriceChange, value: e.target.value })}
                        />
                        <button onClick={handleBulkUpdate} className="btn btn-primary btn-sm" disabled={!selectedIds.length || !bulkPriceChange.value}>
                            Apply
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="admin-table-wrap">
                {loading ? (
                    <div className="admin-empty"><div className="admin-spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty">
                        <ImageIcon size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <h3>No marbles found</h3>
                        <p>Your inventory is empty or no matches found.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                {isBulkEditing && (
                                    <th style={{ width: 40 }}>
                                        <input type="checkbox" onChange={toggleAll} checked={selectedIds.length === filtered.length && filtered.length > 0} />
                                    </th>
                                )}
                                <th>Product</th>
                                <th>Type / Finish</th>
                                <th>Pricing (/sqft)</th>
                                <th>Stock</th>
                                <th>Display</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(marble => (
                                <tr key={marble._id}>
                                    {isBulkEditing && (
                                        <td>
                                            <input type="checkbox" checked={selectedIds.includes(marble._id)} onChange={() => toggleSelection(marble._id)} />
                                        </td>
                                    )}
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--a-surface3)', overflow: 'hidden', flexShrink: 0 }}>
                                                {marble.images?.[0] ? (
                                                    <img src={marble.images[0]} alt={marble.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                                                ) : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--a-text-muted)' }}><ImageIcon size={16}/></div>}
                                            </div>
                                            <div>
                                                <div className="text-main" style={{ fontWeight: 600 }}>{marble.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--a-text-muted)', marginTop: 2 }}>
                                                    {marble.origin || 'Unknown Origin'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem' }}>{marble.type}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--a-text-muted)' }}>{marble.finish}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem' }}>
                                            Retail: <span className="text-main">₹{marble.priceRetail || 0}</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--a-text-muted)' }}>
                                            B2B: ₹{marble.priceBulk || 0}
                                        </div>
                                    </td>
                                    <td>
                                        {marble.availability > 0 ? (
                                            <span className="badge badge-green">{marble.availability} sqft</span>
                                        ) : (
                                            <span className="badge badge-red">Out of Stock</span>
                                        )}
                                    </td>
                                    <td>
                                        {marble.isFeatured && <span className="badge badge-gold" style={{ marginBottom: 4, display: 'block', width: 'fit-content' }}>Featured</span>}
                                        {marble.model3DUrl && <span className="badge badge-purple" style={{ display: 'block', width: 'fit-content' }}>3D Model</span>}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                            <Link href={`/admin/marbles/${marble._id}/edit`} className="btn btn-ghost btn-icon btn-sm">
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                onClick={() => deleteMarble(marble._id, marble.name)}
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

            {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>}
        </div>
    );
}
