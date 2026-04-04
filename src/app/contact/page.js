'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

function ContactForm() {
    const searchParams = useSearchParams();
    const defaultProduct = searchParams.get('marble') || '';

    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        companyName: '',
        interestedProduct: defaultProduct,
        message: ''
    });
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (defaultProduct) {
            setFormData(f => ({ ...f, interestedProduct: defaultProduct }));
        }
    }, [defaultProduct]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, source: 'Website Catalog' }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setFormData({ customerName: '', email: '', phone: '', companyName: '', interestedProduct: '', message: '' });
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    if (status === 'success') {
        return (
            <div className={styles.success} style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
                <h2 style={{ marginBottom: 16 }}>Inquiry Sent Successfully!</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Our sales experts have received your message and will contact you shortly.</p>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="customerName">Full Name *</label>
                <input required type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Business Email *</label>
                    <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 ..." />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className={styles.inputGroup}>
                    <label htmlFor="companyName">Company Name</label>
                    <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="interestedProduct">Interested Product</label>
                    <input type="text" id="interestedProduct" name="interestedProduct" value={formData.interestedProduct} onChange={handleChange} placeholder="e.g. Statuario Premium" />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="message">How can we help? *</label>
                <textarea required id="message" name="message" rows="5" value={formData.message} onChange={handleChange} />
            </div>

            {status === 'error' && <div className={styles.error} style={{ color: '#ef4444', marginBottom: 16 }}>{errorMessage}</div>}

            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                {status === 'loading' ? 'Verifying & Sending...' : 'Submit Inquiry'}
            </button>
        </form>
    );
}

export default function Contact() {
    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Request an Inquiry</h1>
                <p className={styles.subtitle} style={{ marginBottom: 40 }}>Our experts will get back to you within 24 hours.</p>

                <Suspense fallback={<div style={{ textAlign: 'center', opacity: 0.5 }}>Loading form...</div>}>
                    <ContactForm />
                </Suspense>
            </div>
        </div>
    );
}
