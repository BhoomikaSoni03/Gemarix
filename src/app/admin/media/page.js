'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadCloud, Trash2, Copy, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function MediaManagerPage() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [configured, setConfigured] = useState(true);
    const [toast, setToast] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchMedia = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/media');
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        const data = await res.json();
        setConfigured(data.configured);
        if (data.configured) setMedia(data.resources || []);
        setLoading(false);
    };

    useEffect(() => { fetchMedia(); }, []);

    const handleFiles = async (files) => {
        if (!files || files.length === 0) return;
        setUploading(true);

        const newMedia = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;
            
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
                if (res.ok) {
                    const data = await res.json();
                    newMedia.push(data);
                }
            } catch (err) {
                console.error('Upload failed', err);
            }
        }

        if (newMedia.length > 0) {
            showToast(`Uploaded ${newMedia.length} image(s)`);
            setMedia(prev => [...newMedia, ...prev]);
        } else {
            showToast('Failed to upload', 'error');
        }
        
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const deleteMedia = async (publicId) => {
        if (!confirm('Permanently delete this image?')) return;
        
        const res = await fetch('/api/admin/media', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicIds: [publicId] })
        });
        
        if (res.ok) {
            showToast('Image deleted');
            setMedia(prev => prev.filter(m => m.publicId !== publicId));
        } else {
            showToast('Failed to delete', 'error');
        }
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        showToast('URL copied to clipboard!');
    };

    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    if (loading) return <div className="admin-page"><div className="admin-spinner" /></div>;

    if (!configured) {
        return (
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1 className="admin-page-title">Media Library</h1>
                </div>
                <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <UploadCloud size={48} style={{ color: 'var(--a-amber)', marginBottom: 16 }} />
                    <h2 style={{ margin: '0 0 10px' }}>Cloudinary Not Configured</h2>
                    <p style={{ color: 'var(--a-text-muted)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                        To enable the media manager, copy the "API Environment variable" from your Cloudinary Dashboard and add it to your `.env.local` and Vercel project:
                    </p>
                    <div style={{ background: 'var(--a-surface2)', padding: 16, borderRadius: 8, textAlign: 'left', display: 'inline-block', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Media Library</h1>
                    <p className="admin-page-subtitle">Upload and manage images for blogs and inventory</p>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary" disabled={uploading}>
                    {uploading ? <Loader2 size={16} className="admin-spinner" style={{ border: 'none' }} /> : <UploadCloud size={16} />}
                    {uploading ? 'Uploading...' : 'Upload Images'}
                </button>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFiles(e.target.files)}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Dropzone */}
            <div
                className="admin-card"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                style={{
                    marginBottom: 24,
                    padding: '40px 20px',
                    textAlign: 'center',
                    border: `2px dashed ${isDragging ? 'var(--a-gold)' : 'var(--a-border2)'}`,
                    background: isDragging ? 'var(--a-gold-dim)' : 'var(--a-surface)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                }}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <UploadCloud size={32} style={{ color: isDragging ? 'var(--a-gold)' : 'var(--a-text-muted)', marginBottom: 12 }} />
                <h3 style={{ margin: '0 0 4px', fontSize: '1rem', color: isDragging ? 'var(--a-gold)' : 'var(--a-text)' }}>
                    Drop images here to upload
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--a-text-muted)' }}>
                    Supports JPG, PNG, WEBP (Auto-optimized on upload)
                </p>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {media.length === 0 && !uploading && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--a-text-muted)' }}>
                        <ImageIcon size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
                        <div>No images found in your Cloudinary account.</div>
                    </div>
                )}
                {media.map((item) => (
                    <div key={item.publicId} className="admin-card" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--a-surface2)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={item.url}
                                alt="media"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                loading="lazy"
                            />
                            <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4, fontSize: '0.65rem' }}>
                                {(item.bytes / 1024).toFixed(0)} KB
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => copyToClipboard(item.url)} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                                <Copy size={13} /> Copy URL
                            </button>
                            <button onClick={() => deleteMedia(item.publicId)} className="btn btn-danger btn-icon btn-sm">
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {toast && <div className={`admin-toast admin-toast-${toast.type}`}>{toast.text}</div>}
        </div>
    );
}
