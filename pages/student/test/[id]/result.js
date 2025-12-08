import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchTestAnalytics } from '@/utils/api';
import styles from '@/styles/Dashboard.module.css';

export default function TestResult() {
    const router = useRouter();
    const { id } = router.query;
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (id) {
            fetchTestAnalytics(id).then(res => setResult(res.data));
        }
    }, [id]);

    if (!result) return <div>Loading Results...</div>;

    const percentage = ((result.score / (result.questions.length * 1)) * 100).toFixed(2); // Assuming 1 mark avg for simplicity in calculation

    return (
        <div className="container" style={{ padding: '40px' }}>
            <h1 style={{ textAlign: 'center' }}>Test Result Analysis</h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '30px 0' }}>
                <div className="card" style={{ padding: '20px', textAlign: 'center', minWidth: '150px' }}>
                    <h3>Score</h3>
                    <h1 style={{ color: '#0070f3' }}>{result.score}</h1>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center', minWidth: '150px' }}>
                    <h3>Questions</h3>
                    <h1>{result.total_questions}</h1>
                </div>
                <div className="card" style={{ padding: '20px', textAlign: 'center', minWidth: '150px' }}>
                    <h3>Accuracy</h3>
                    <h1>{percentage}%</h1>
                </div>
            </div>

            <h2>Detailed Analysis</h2>
            <div style={{ marginTop: '20px' }}>
                {result.questions.map((q, index) => (
                    <div key={q.id} className="card" style={{ marginBottom: '15px', padding: '15px', borderLeft: q.is_correct ? '5px solid green' : '5px solid red' }}>
                        <p><strong>Q{index + 1}: {q.question.text}</strong></p>

                        <div style={{ margin: '10px 0' }}>
                            {q.question.choices.map(c => (
                                <div key={c.id} style={{
                                    padding: '5px',
                                    backgroundColor: c.is_correct ? '#d4edda' : (q.selected_choice?.id === c.id ? '#f8d7da' : 'transparent'),
                                    color: c.is_correct ? '#155724' : (q.selected_choice?.id === c.id ? '#721c24' : 'black')
                                }}>
                                    {c.text} {c.is_correct && <strong>(Correct Answer)</strong>} {q.selected_choice?.id === c.id && <strong>(Your Answer)</strong>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={() => router.push('/student/dashboard')} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
                Back to Dashboard
            </button>
        </div>
    );
}