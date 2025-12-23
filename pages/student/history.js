import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function History() {
    const router = useRouter();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/api/student/dashboard/')
            .then(res => res.json())
            .then(user => {
                if (!user.college || !user.phone_number) {
                    router.push('/student/complete-profile');
                } else {
                    return apiFetch('/api/student/tests/history/');
                }
            })
            .then(res => res.json())
            .then(data => {
                setTests(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [router]);

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Head><title>Test History - Produit Academy</title></Head>
            <Header />
            <main className="main-content">
                <div className="container">
                    <h1 style={{ marginBottom: '30px' }}>My Test History</h1>

                    {tests.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px' }}>
                            <h3>No tests found.</h3>
                            <button onClick={() => router.push('/student/create-test')} style={{ marginTop: '15px', padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Create Your First Test
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {tests.map(test => (
                                <div key={test.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '20px', background: 'white', border: '1px solid #ddd', borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>Mock Test #{test.id}</h3>
                                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                            {new Date(test.created_at).toLocaleString()} • {test.total_questions} Questions
                                        </p>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: test.is_completed ? '#28a745' : '#e0a800' }}>
                                            {test.is_completed ? `Score: ${test.score}` : 'In Progress'}
                                        </div>

                                        <div style={{ marginTop: '10px' }}>
                                            {test.is_completed ? (
                                                <button onClick={() => router.push(`/student/test/${test.id}/result`)}
                                                    style={{ padding: '6px 12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                    View Analytics
                                                </button>
                                            ) : (
                                                <button onClick={() => router.push(`/student/test/${test.id}/attempt`)}
                                                    style={{ padding: '6px 12px', background: '#e0a800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                    Resume Test
                                                </button>
                                            )}
                                        </div>
                                    </div>
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