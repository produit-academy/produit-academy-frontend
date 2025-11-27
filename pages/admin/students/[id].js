import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import styles from '@/styles/Dashboard.module.css';

export default function StudentProfile() {
    const router = useRouter();
    const { id } = router.query;
    
    const [student, setStudent] = useState(null);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ totalTests: 0, avgScore: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // 1. Fetch Student Basic Info (Using existing student list API but simplified for MVP)
                // In a real app, you'd have a specific /api/admin/students/:id endpoint. 
                // For now, we reuse the list or manage view logic if available, or just fetch all and find (temporary optimization).
                // Better approach: Use the manage endpoint which we have: /api/admin/students/:id/
                
                const studentRes = await apiFetch(`/api/admin/students/${id}/`);
                const historyRes = await apiFetch(`/api/admin/students/${id}/history/`);

                if (studentRes.ok) {
                    setStudent(await studentRes.json());
                }
                if (historyRes.ok) {
                    const data = await historyRes.json();
                    setHistory(data);
                    
                    // Calculate Stats
                    const totalScore = data.reduce((acc, curr) => acc + curr.score, 0);
                    const avg = data.length > 0 ? (totalScore / data.length).toFixed(1) : 0;
                    setStats({ totalTests: data.length, avgScore: avg });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Loading Profile...</div>;
    if (!student) return <div style={{padding:'50px', textAlign:'center'}}>Student not found.</div>;

    return (
        <>
            <Head><title>{student.username} - Performance</title></Head>
            <Header />
            <main className="main-content">
                <div className="container">
                    <button onClick={() => router.back()} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>← Back to Directory</button>
                    
                    {/* 1. PROFILE CARD */}
                    <div className={styles.card} style={{ marginBottom: '30px', borderLeft: '5px solid #0070f3' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h1 style={{ margin: '0 0 10px 0' }}>{student.username}</h1>
                                <p style={{ margin: '5px 0', color: '#555' }}>📧 {student.email}</p>
                                <p style={{ margin: '5px 0', color: '#555' }}>📞 {student.phone_number || 'No Phone'}</p>
                                <p style={{ margin: '5px 0', color: '#555' }}>🎓 {student.college || 'No College Info'}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#0070f3' }}>
                                    {student.branch_name || 'N/A'}
                                </span>
                                <span style={{ color: '#888', fontSize: '0.9rem' }}>Student ID: {student.student_id}</span>
                                <div style={{ marginTop: '15px' }}>
                                    {student.is_active ? 
                                        <span style={{ background: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>Active</span> :
                                        <span style={{ background: '#f8d7da', color: '#721c24', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>Disabled</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. ACADEMIC STATS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        <div className={styles.card} style={{ textAlign: 'center', padding: '20px' }}>
                            <h3 style={{ margin: 0, color: '#555' }}>Tests Attempted</h3>
                            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>{stats.totalTests}</p>
                        </div>
                        <div className={styles.card} style={{ textAlign: 'center', padding: '20px' }}>
                            <h3 style={{ margin: 0, color: '#555' }}>Average Score</h3>
                            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', color: '#28a745' }}>{stats.avgScore}</p>
                        </div>
                    </div>

                    {/* 3. PERFORMANCE HISTORY TABLE */}
                    <h2 style={{ marginBottom: '15px' }}>Detailed Exam History</h2>
                    {history.length > 0 ? (
                        <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                                    <tr>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Exam Title</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Date</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Score</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Total Marks</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((record) => {
                                        const percent = ((record.score / record.quiz.total_marks) * 100).toFixed(1);
                                        return (
                                            <tr key={record.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '12px', fontWeight: '500' }}>{record.quiz.title}</td>
                                                <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                                                    {new Date(record.submitted_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#0070f3' }}>
                                                    {record.score}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    {record.quiz.total_marks}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    <span style={{ 
                                                        color: percent >= 50 ? 'green' : 'red', 
                                                        fontWeight: 'bold' 
                                                    }}>
                                                        {percent}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>This student has not attempted any exams yet.</p>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}