'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

const COMMON_TYPES = ['Marble', 'Granite', 'Onyx', 'Quartzite', 'Travertine'];
const THICKNESS_OPTS = ['16mm', '18mm', '20mm', '30mm'];

export default function EditMarblePage({ params }) {
    const router = useRouter();
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const load = async () => {
            const { id } = await params;
            const res = await fetch(`/api/admin/marbles/${id}`);
            if (res.status === 401) { window.location.href = '/admin/login'; return; }
            if (res.ok) {
                const data = await res.json();
                setForm({
                    ...data.marble,
                    images: data.marble.images?.length ? data.marble.images : [''],
                    thickness: data.marble.thickness || []
                });
            } else {
                router.push('/admin/marbles');
            }
        };
        load();
    }, [params, router]);

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const toggleThickness = (val) => {
        setForm(f => ({
            ...f,
            thickness: f.thickness.includes(val)
                ? f.thickness.filter(t => t !== val)
                : [...f.thickness, val]
        }));
    };

    const handleImageChange = (index, val) => {
        const newImages = [...form.images];
        newImages[index] = val;
        setForm({ ...form, images: newImages });
    };

    const addImage = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
    const removeImage = (idx) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

    const save = async () => {
        if (!form.name.trim()) { showToast('Name is required', 'error'); return; }
        setSaving(true);
        const { id } = await params;
        const payload = { ...form, images: form.images.filter(img => img.trim() !== '') };
        const res = await fetch(`/api/admin/marbles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        
        if (res.ok) {
            showToast('Marble updated successfully!');
            setTimeout(() => router.push('/admin/marbles'), 1000);
        } else {
            showToast('Failed to update', 'error');
            setSaving(false);
        }
    };

    if (!form) return <div className="admin-page"><div className="admin-spinner" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link href="/admin/marbles" className="btn btn-ghost btn-icon btn-sm">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="admin-page-title">Edit Marble</h1>
                        <p className="admin-page-subtitle">Update {form.name}</p>
                    </div>
                </div>
                <button onClick={save} disabled={saving} className="btn btn-primary">
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="form-grid-2">
                {/* Basic Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="admin-card">
                        <h2 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Basic Details</h2>
                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input name="name" className="form-input" value={form.name} onChange={handleChange} />
                        </div>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Material Type</label>
                                <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                                    {COMMON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category / Collection</label>
                                <input name="category" className="form-input" value={form.category} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-textarea" rows={4} value={form.description} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="admin-card">
                        <h2 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Technical & Pricing (B2B)</h2>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Origin Country</label>
                                <input name="origin" className="form-input" value={form.origin} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Surface Finish</label>
                                <select name="finish" className="form-select" value={form.finish} onChange={handleChange}>
                                    <option value="Polished">Polished</option>
                                    <option value="Honed">Honed</option>
                                    <option value="Leathered">Leathered</option>
                                    <option value="Flamed">Flamed</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Available Thicknesses</label>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {THICKNESS_OPTS.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => toggleThickness(t)}
                                        className={`btn btn-sm ${form.thickness.includes(t) ? 'btn-primary' : 'btn-ghost'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-grid-3">
                            <div className="form-group">
                                <label className="form-label">Stock (sq.ft)</label>
                                <input type="number" name="availability" className="form-input" value={form.availability} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Retail / sqft</label>
                                <input type="number" name="priceRetail" className="form-input" value={form.priceRetail} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Wholesale / sqft</label>
                                <input type="number" name="priceBulk" className="form-input" value={form.priceBulk} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media & Visibility */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="admin-card">
                        <h2 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Media Assets</h2>
                        <div className="form-group">
                            <label className="form-label">Images</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {form.images.map((img, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 8 }}>
                                        <input className="form-input" value={img} onChange={(e) => handleImageChange(i, e.target.value)} />
                                        {form.images.length > 1 && (
                                            <button onClick={() => removeImage(i)} className="btn btn-ghost btn-icon" style={{ flexShrink: 0 }}><X size={16} /></button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addImage} className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}><Plus size={14} /> Add Image</button>
                            </div>
                        </div>
                        <div className="admin-divider" />
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">3D Model (.glb URL)</label>
                            <input name="model3DUrl" className="form-input" value={form.model3DUrl} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="admin-card">
                        <h2 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Visibility Flags</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <label className="toggle-wrap" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Featured Showcase</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--a-text-muted)' }}>Display this on the homepage hero section</div>
                                </div>
                                <div className="toggle">
                                    <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                                    <div className="toggle-slider"></div>
                                </div>
                            </label>
                            
                            <label className="toggle-wrap" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Editor's Choice</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--a-text-muted)' }}>Highlights product with an exclusive badge</div>
                                </div>
                                <div className="toggle">
                                    <input type="checkbox" name="isChosenOne" checked={form.isChosenOne} onChange={handleChange} />
                                    <div className="toggle-slider"></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>}
        </div>
    );
}
