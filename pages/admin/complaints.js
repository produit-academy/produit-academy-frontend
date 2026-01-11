import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminComplaints() {
    const router = useRouter();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        if (role !== 'admin') {
            router.push('/login');
            return;
        }
        fetchComplaints();
    }, [router]);

    const fetchComplaints = async () => {
        try {
            const res = await apiFetch('/api/admin/complaints/');
            if (res.ok) {
                const data = await res.json();
                setComplaints(data);
            }
        } catch (err) {
            console.error("Failed to fetch complaints", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        const comment = prompt('Enter a resolution comment (optional):');
        if (comment === null) return; // Cancelled

        try {
            const res = await apiFetch(`/api/admin/complaints/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Resolved', resolution_comment: comment })
            });

            if (res.ok) {
                setComplaints(prev => prev.map(c =>
                    c.id === id ? { ...c, status: 'Resolved', resolution_comment: comment, resolved_at: new Date().toISOString() } : c
                ));
            } else {
                alert('Failed to update status.');
            }
        } catch (err) {
            alert('An error occurred.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Head><title>Manage Complaints - Produit Academy</title></Head>
            <Header />
            <main className="main-content">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h1>Student Complaints</h1>
                        <button onClick={() => router.push('/admin/dashboard')} className="glass-btn">
                            Back to Dashboard
                        </button>
                    </div>

                    {complaints.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <h3>No complaints found.</h3>
                            <p style={{ color: '#666' }}>All systems operational!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {complaints.map(complaint => (
                                <div key={complaint.id} style={{
                                    padding: '20px',
                                    background: 'white',
                                    border: '1px solid #eee',
                                    borderLeft: `5px solid ${complaint.status === 'Resolved' ? '#28a745' : '#dc3545'}`,
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0' }}>{complaint.subject}</h3>
                                            <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                                <strong>{complaint.student_name}</strong> • {new Date(complaint.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            background: complaint.status === 'Resolved' ? '#d4edda' : '#fff3cd',
                                            color: complaint.status === 'Resolved' ? '#155724' : '#856404',
                                            fontWeight: 'bold'
                                        }}>
                                            {complaint.status}
                                        </span>
                                    </div>

                                    <p style={{ background: '#f9f9f9', padding: '15px', borderRadius: '4px', margin: '0 0 15px 0', whiteSpace: 'pre-wrap' }}>
                                        {complaint.description}
                                    </p>

                                    {complaint.status !== 'Resolved' && (
                                        <div style={{ textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleResolve(complaint.id)}
                                                style={{
                                                    padding: '8px 20px',
                                                    background: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Mark as Resolved
                                            </button>
                                        </div>
                                    )}
                                    {complaint.resolved_at && (
                                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999' }}>
                                            Resolved on: {new Date(complaint.resolved_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
