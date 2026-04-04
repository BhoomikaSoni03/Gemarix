'use client';

import { useState, useEffect } from 'react';
import { Save, AlertCircle, MessageCircle, BarChart3, Globe } from 'lucide-react';

export default function SettingsPage() {
    const [form, setForm] = useState({
        whatsappNumber: '',
        whatsappMessage: '',
        ga4MeasurementId: '',
        seoSiteTitle: '',
        seoSiteDescription: '',
        seoKeywords: '',
        sitemapEnabled: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await fetch('/api/admin/settings');
            if (res.status === 401) { window.location.href = '/admin/login'; return; }
            if (res.ok) {
                const data = await res.json();
                if (data.settings) setForm(prev => ({ ...prev, ...data.settings }));
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const saveSettings = async () => {
        setSaving(true);
        const res = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        
        if (res.ok) {
            showToast('Settings saved successfully');
        } else {
            showToast('Failed to save settings', 'error');
        }
        setSaving(false);
    };

    if (loading) return <div className="admin-page"><div className="admin-spinner" /></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Integration & Settings</h1>
                    <p className="admin-page-subtitle">Configure third-party tools and global SEO</p>
                </div>
                <button onClick={saveSettings} disabled={saving} className="btn btn-primary">
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* WhatsApp */}
                <div className="admin-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ background: 'var(--a-green-dim)', color: 'var(--a-green)', padding: 8, borderRadius: 8 }}>
                            <MessageCircle size={20} />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>WhatsApp Integration</h2>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number (with country code)</label>
                        <input
                            name="whatsappNumber"
                            className="form-input"
                            placeholder="e.g. 919876543210"
                            value={form.whatsappNumber}
                            onChange={handleChange}
                        />
                        <p className="form-hint">Do not include +, spaces, or dashes.</p>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Default Message Text</label>
                        <textarea
                            name="whatsappMessage"
                            className="form-textarea"
                            rows={2}
                            placeholder="Hi, I'm interested in your marble collection!"
                            value={form.whatsappMessage}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Google Analytics */}
                <div className="admin-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ background: 'var(--a-amber-dim)', color: 'var(--a-amber)', padding: 8, borderRadius: 8 }}>
                            <BarChart3 size={20} />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Google Analytics (GA4)</h2>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Measurement ID</label>
                        <input
                            name="ga4MeasurementId"
                            className="form-input"
                            placeholder="e.g. G-ABC123XYZ"
                            value={form.ga4MeasurementId}
                            onChange={handleChange}
                        />
                        <p className="form-hint">Adding an ID here will automatically inject the GA4 script into your website.</p>
                    </div>
                </div>

                {/* Global SEO */}
                <div className="admin-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ background: 'var(--a-blue-dim)', color: 'var(--a-blue)', padding: 8, borderRadius: 8 }}>
                            <Globe size={20} />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Global SEO Defaults</h2>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Default Site Title</label>
                        <input
                            name="seoSiteTitle"
                            className="form-input"
                            placeholder="Gemarix — Premium Marble"
                            value={form.seoSiteTitle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Default Meta Description</label>
                        <textarea
                            name="seoSiteDescription"
                            className="form-textarea"
                            rows={3}
                            placeholder="Describe your business in 1-2 sentences for search engines."
                            value={form.seoSiteDescription}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Global Keywords</label>
                        <input
                            name="seoKeywords"
                            className="form-input"
                            placeholder="marble, luxury stone, imports"
                            value={form.seoKeywords}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="admin-divider" />
                    
                    <label className="toggle-wrap" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>Enable Auto-Sitemap</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--a-text-muted)' }}>Dynamically generate sitemap.xml for Google indexing</div>
                        </div>
                        <div className="toggle">
                            <input type="checkbox" name="sitemapEnabled" checked={form.sitemapEnabled} onChange={handleChange} />
                            <div className="toggle-slider"></div>
                        </div>
                    </label>
                </div>
                
            </div>

            {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>}
        </div>
    );
}
