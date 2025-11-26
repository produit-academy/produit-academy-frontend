import { useState, useEffect } from 'react';
import apiFetch from '@/utils/api';
import styles from '@/styles/Dashboard.module.css';

export default function Analytics() {
    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);

    useEffect(() => {
        apiFetch('/api/student/analytics/').then(r => r.json()).then(setResults);
    }, []);

    const viewAnalysis = async (id) => {
        const res = await apiFetch(`/api/student/analytics/${id}/`);
        const data = await res.json();
        setSelectedResult(data);
    };

    return (
        <div className={styles.container} style={{ padding: '20px' }}>
            <h1>Performance Analytics</h1>
            
            {/* List of Attempts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {results.map(r => (
                    <div key={r.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: 'white' }}>
                        <h3>{r.quiz.title}</h3>
                        <p>Score: <strong>{r.score}</strong> / {r.quiz.total_marks}</p>
                        <p>Date: {new Date(r.submitted_at).toLocaleDateString()}</p>
                        <button onClick={() => viewAnalysis(r.id)} style={{ marginTop: '10px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>View Analysis</button>
                    </div>
                ))}
            </div>

            {/* Detailed Analysis View */}
            {selectedResult && (
                <div style={{ background: '#f9f9f9', padding: '20px', borderTop: '2px solid #333' }}>
                    <h2>Analysis: {selectedResult.quiz.title}</h2>
                    {selectedResult.quiz.questions.map((q, idx) => (
                        <div key={q.id} style={{ marginBottom: '20px', padding: '10px', background: 'white', border: '1px solid #eee' }}>
                            <h4>Q{idx + 1}: {q.text}</h4>
                            <ul>
                                {q.choices.map(c => (
                                    <li key={c.id} style={{ 
                                        color: c.is_correct ? 'green' : 'black', 
                                        fontWeight: c.is_correct ? 'bold' : 'normal'
                                    }}>
                                        {c.text} {c.is_correct && "(Correct Answer)"}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <button onClick={() => setSelectedResult(null)} style={{ padding: '10px', background: '#333', color: 'white' }}>Close Analysis</button>
                </div>
            )}
        </div>
    );
}