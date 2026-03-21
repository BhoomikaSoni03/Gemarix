'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        companyName: '',
        message: ''
    });
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setFormData({ customerName: '', email: '', companyName: '', message: '' });
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Request an Inquiry</h1>
                <p className={styles.subtitle}>Our experts will get back to you within 24 hours.</p>

                {status === 'success' ? (
                    <div className={styles.success}>
                        <h2>Inquiry Sent Successfully!</h2>
                        <p>Your email domain was verified and our sales team has received your message.</p>
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="customerName">Full Name *</label>
                            <input required type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Business Email *</label>
                            <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                            <small className={styles.hint}>We actively verify the deliverability of the email domain.</small>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="companyName">Company Name</label>
                            <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="message">How can we help? *</label>
                            <textarea required id="message" name="message" rows="5" value={formData.message} onChange={handleChange} />
                        </div>

                        {status === 'error' && <div className={styles.error}>{errorMessage}</div>}

                        <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                            {status === 'loading' ? 'Verifying Email & Sending...' : 'Submit Inquiry'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
