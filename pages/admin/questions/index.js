import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAllQuestions, deleteQuestion } from '../../../utils/api';

export default function QuestionBank() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = () => fetchAllQuestions().then(res => setQuestions(res.data));

    const handleDelete = async (id) => {
        if (confirm('Delete this question?')) {
            await deleteQuestion(id);
            loadQuestions();
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '40px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Question Bank</h1>
                <button
                    onClick={() => router.push('/admin/questions/create')}
                    style={{ padding: '12px 24px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    + Add New Question
                </button>
            </div>

            {questions.length === 0 ? <p>No questions found. Add one!</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {questions.map(q => (
                        <div key={q.id} className="card" style={{ padding: '20px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                    {q.category_name || 'Uncategorized'}
                                </span>
                                <span style={{ fontWeight: 'bold' }}>Marks: {q.marks}</span>
                            </div>
                            <p style={{ margin: '15px 0', fontSize: '16px' }}>{q.text}</p>

                            {/* Simple Option Preview */}
                            <div style={{ fontSize: '14px', color: '#555', marginBottom: '15px' }}>
                                {q.choices.map((c, i) => (
                                    <span key={c.id} style={{ marginRight: '15px', color: c.is_correct ? 'green' : 'inherit' }}>
                                        {String.fromCharCode(65 + i)}. {c.text} {c.is_correct ? '✔' : ''}
                                    </span>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', textAlign: 'right' }}>
                                <button
                                    onClick={() => handleDelete(q.id)}
                                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Delete Question
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}