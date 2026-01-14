import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function StudentComplaints() {
    const router = useRouter();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await apiFetch('/api/student/complaints/');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await apiFetch('/api/student/complaints/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, description })
            });

            if (res.ok) {
                setSuccessMsg('Complaint submitted successfully!');
                setSubject('');
                setDescription('');
                fetchComplaints();
            } else {
                setErrorMsg('Failed to submit complaint. Please try again.');
            }
        } catch (err) {
            setErrorMsg('An error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Head><title>H&S Support - Produit Academy</title></Head>
            <Header />
            <main className="main-content">
                <div className="container" style={{ maxWidth: '1000px', marginTop: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '2rem', color: '#333' }}>Help & Support</h1>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => router.push('/student/dashboard')} className="glass-btn">
                                ← Back to Dashboard
                            </button>
                            <button onClick={fetchComplaints} className="glass-btn primary">
                                ↻ Refresh Status
                            </button>
                        </div>
                    </div>

                    {/* Submission Form */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        marginBottom: '40px',
                        border: '1px solid #f0f0f0'
                    }}>
                        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#444' }}>Report an Issue</h2>
                        <form onSubmit={handleSubmit}>
                            {successMsg && <div style={{ padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '20px' }}>{successMsg}</div>}
                            {errorMsg && <div style={{ padding: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '20px' }}>{errorMsg}</div>}

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        background: '#fafafa',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0070f3'}
                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                    placeholder="Brief summary of the issue..."
                                />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows="5"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        fontFamily: 'inherit',
                                        background: '#fafafa',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0070f3'}
                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                    placeholder="Detailed explanation..."
                                />
                            </div>

                            <button type="submit" disabled={submitting} style={{
                                padding: '10px 20px',
                                background: submitting ? '#ccc' : '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}>
                                {submitting ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </form>
                    </div>

                    {/* Complaint History */}
                    <div>
                        <h2 style={{ marginBottom: '20px' }}>Your Ticket History</h2>
                        {complaints.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No tickets found.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {complaints.map(complaint => (
                                    <div key={complaint.id} style={{
                                        padding: '20px',
                                        background: 'white',
                                        border: '1px solid #eee',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{complaint.subject}</h3>
                                            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                                {new Date(complaint.created_at).toLocaleString()}
                                            </p>
                                            <p style={{ margin: '10px 0 0 0', whiteSpace: 'pre-wrap' }}>{complaint.description}</p>
                                            {complaint.status === 'Resolved' && complaint.resolution_comment && (
                                                <div style={{ marginTop: '10px', padding: '10px', background: '#d4edda', borderRadius: '4px', fontSize: '0.9rem', color: '#155724' }}>
                                                    <strong>Admin Comment:</strong> {complaint.resolution_comment}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                background: complaint.status === 'Resolved' ? '#d4edda' : '#fff3cd',
                                                color: complaint.status === 'Resolved' ? '#155724' : '#856404',
                                                fontWeight: 'bold'
                                            }}>
                                                {complaint.status}
                                            </span>
                                            {complaint.resolved_at && (
                                                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                                                    Resolved: {new Date(complaint.resolved_at).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
