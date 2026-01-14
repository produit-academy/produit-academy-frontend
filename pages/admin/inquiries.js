import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Inquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Pending, Resolved
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        if (role !== 'admin') {
            router.push('/login');
        } else {
            fetchInquiries();
        }
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await apiFetch('/api/admin/contacts/');
            if (res.ok) {
                const data = await res.json();
                setInquiries(data);
            }
        } catch (error) {
            console.error("Failed to fetch inquiries", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkDone = async (id) => {
        try {
            const res = await apiFetch(`/api/admin/contacts/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'Resolved' }),
            });
            if (res.ok) {
                setInquiries(prev => prev.map(inq =>
                    inq.id === id ? { ...inq, status: 'Resolved' } : inq
                ));
            }
        } catch (error) {
            console.error("Failed to update inquiry", error);
        }
    };

    const filteredInquiries = inquiries.filter(inq => {
        if (filter === 'All') return true;
        return inq.status === filter;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Head><title>Contact Inquiries - Admin</title></Head>
            <Header />
            <main className="main-content">
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h1>Contact Inquiries</h1>
                        <button onClick={() => router.push('/admin/dashboard')} className="glass-btn">
                            ← Back to Dashboard
                        </button>
                    </div>

                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                        {['All', 'Pending', 'Resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid #ddd',
                                    background: filter === f ? '#0070f3' : 'white',
                                    color: filter === f ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {filteredInquiries.length > 0 ? filteredInquiries.map(inq => (
                            <motion.div
                                key={inq.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: '20px',
                                    background: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #eee',
                                    borderLeft: `5px solid ${inq.status === 'Pending' ? '#dc3545' : '#28a745'}`,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{inq.name}</h3>
                                        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                                            {inq.email} • {inq.phone} • <strong>{inq.course}</strong>
                                        </div>
                                        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                                            {inq.message}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#999' }}>
                                            Received: {new Date(inq.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    <div>
                                        {inq.status === 'Pending' ? (
                                            <button
                                                onClick={() => handleMarkDone(inq.id)}
                                                style={{
                                                    background: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 16px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                ✓ Mark as Done
                                            </button>
                                        ) : (
                                            <span style={{
                                                color: '#28a745',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                padding: '8px 16px',
                                                background: '#d4edda',
                                                borderRadius: '20px'
                                            }}>
                                                ✓ Resolved
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                No inquiries found.
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
