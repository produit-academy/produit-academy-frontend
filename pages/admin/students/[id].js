import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import LoadingSpinner from '@/components/LoadingSpinner';
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
                const studentRes = await apiFetch(`/api/admin/students/${id}/`);
                const historyRes = await apiFetch(`/api/admin/students/${id}/history/`);

                if (studentRes.ok) {
                    setStudent(await studentRes.json());
                }
                if (historyRes.ok) {
                    const data = await historyRes.json();
                    setHistory(data);
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

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this student? This action cannot be undone and will remove all their data.')) return;

        try {
            const res = await apiFetch(`/api/admin/students/${id}/`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Student deleted successfully.');
                router.push('/admin/students');
            } else {
                alert('Failed to delete student.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred.');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!student) return <div style={{ padding: '50px', textAlign: 'center' }}>Student not found.</div>;

    return (
        <>
            <Head><title>{student.username} - Performance</title></Head>
            <Header />
            <main className="main-content">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '40px' }}>
                        <button onClick={() => router.back()} className="glass-btn">← Back to Directory</button>
                        <button onClick={handleDelete} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Delete Student</button>
                    </div>

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
                                    {(() => {
                                        const status = student.course_request_status;
                                        if (status === 'Approved') return <span style={{ background: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>Approved</span>;
                                        if (status === 'Pending') return <span style={{ background: '#fff3cd', color: '#856404', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>Pending</span>;
                                        if (status === 'Rejected') return <span style={{ background: '#f8d7da', color: '#721c24', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>Rejected</span>;
                                        return <span style={{ background: '#e2e3e5', color: '#383d41', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>Not Requested</span>;
                                    })()}
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
                                    {history.map((record, index) => {
                                        const totalMarks = record.total_marks || record.total_questions; // Fallback
                                        const percent = totalMarks > 0 ? ((record.score / totalMarks) * 100).toFixed(1) : 0;
                                        return (
                                            <tr key={record.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '12px', fontWeight: '500' }}>Mock Test #{history.length - index}</td>
                                                <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                                                    {new Date(record.completed_at || record.created_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#0070f3' }}>
                                                    {record.score}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    {totalMarks}
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