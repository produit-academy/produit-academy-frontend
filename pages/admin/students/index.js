import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';

import apiFetch from '@/utils/api';
import Link from 'next/link';
import styles from '@/styles/Dashboard.module.css';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        apiFetch('/api/admin/students/')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Sort by registered date (newest first)
                    // Assuming 'date_joined' or 'id' available. Using date_joined as it's standard.
                    const sorted = data.sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined));
                    setStudents(sorted);
                } else {
                    setStudents([]);
                }
            });
    }, []);

    const filteredStudents = students.filter(s =>
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head><title>All Students - Produit Academy</title></Head>
            <Header />
            <main className="main-content">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h1>Existing Students Directory</h1>
                        <div style={{ position: 'relative', width: '300px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/search.png" alt="Search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', opacity: 0.6 }} />
                            <input
                                placeholder="Search by Name or ID..."
                                style={{ padding: '10px 10px 10px 38px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.card} style={{ padding: 0, overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                                <tr>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Student ID</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Branch</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Contact</th>
                                    <th style={{ padding: '15px', textAlign: 'left' }}>Date Joined</th>
                                    <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px', color: '#555' }}>{student.student_id || 'N/A'}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{student.username}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ background: '#e6f7ff', color: '#0050b3', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>
                                                {student.branch_name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>{student.email}</td>
                                        <td style={{ padding: '15px' }}>
                                            {student.date_joined ? new Date(student.date_joined).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : 'N/A'}
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <Link href={`/admin/students/${student.id}`} className="glass-btn primary" style={{
                                                padding: '6px 12px',
                                                textDecoration: 'none',
                                                fontSize: '0.9rem'
                                            }}>
                                                View Performance
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && <p style={{ padding: '20px', textAlign: 'center' }}>No students found.</p>}
                    </div>
                </div>
            </main>

        </>
    );
}