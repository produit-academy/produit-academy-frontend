import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

import apiFetch from '@/utils/api';
import styles from '@/styles/Dashboard.module.css';

export default function CompleteProfile() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        college: '',
        phone_number: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await apiFetch('/api/profile/', {
                method: 'PATCH',
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/student/dashboard');
            } else {
                const data = await res.json();
                setError(data.detail || 'Failed to update profile. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Complete Profile - Produit Academy</title>
            </Head>
            <Header />
            <main className="main-content">
                <div className="container" style={{ maxWidth: '600px', marginTop: '50px' }}>
                    <div className={styles.dashboardSection}>
                        <h1 className={styles.sectionTitle}>Complete Your Profile</h1>
                        <p style={{ marginBottom: '20px', color: '#666' }}>
                            Please provide your college name and phone number to continue to your dashboard.
                        </p>

                        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>College Name</label>
                                <input
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                    placeholder="e.g. IIT Bombay"
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                    placeholder="e.g. 9876543210"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#228B22',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isSubmitting ? 'Saving...' : 'Save & Continue'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

        </>
    );
}
