import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import apiFetch from '@/utils/api';
import styles from '@/styles/CreateQuiz.module.css'
import Header from '@/components/Header';

export default function EditQuiz() {
    const router = useRouter();
    const { id } = router.query;
    const [branches, setBranches] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [quizData, setQuizData] = useState({
        title: '', branch: '', duration_minutes: 180, total_marks: 100, questions: []
    });

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const branchRes = await apiFetch('/api/branches/');
                if (branchRes.ok) setBranches(await branchRes.json());
                const quizRes = await apiFetch(`/api/admin/quizzes/${id}/`);
                if (quizRes.ok) {
                    const data = await quizRes.json();
                    setQuizData({
                        title: data.title,
                        branch: data.branch,
                        duration_minutes: data.duration_minutes,
                        total_marks: data.total_marks,
                        questions: data.questions
                    });
                } else {
                    setError("Failed to load quiz data.");
                }
            } catch (err) {
                console.error(err);
                setError("Network error.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const addQuestion = () => {
        setQuizData(prev => ({
            ...prev,
            questions: [...prev.questions, {
                text: '', marks: 1,
                choices: [
                    { text: '', is_correct: false }, { text: '', is_correct: false },
                    { text: '', is_correct: false }, { text: '', is_correct: false }
                ]
            }]
        }));
    };

    const removeQuestion = (index) => {
        if (quizData.questions.length === 1) return;
        const newQs = quizData.questions.filter((_, i) => i !== index);
        setQuizData({ ...quizData, questions: newQs });
    };

    const updateQuestion = (index, field, value) => {
        const newQs = [...quizData.questions];
        newQs[index][field] = value;
        setQuizData({ ...quizData, questions: newQs });
    };

    const updateChoice = (qIndex, cIndex, value) => {
        const newQs = [...quizData.questions];
        newQs[qIndex].choices[cIndex].text = value;
        setQuizData({ ...quizData, questions: newQs });
    };

    const setCorrectChoice = (qIndex, cIndex) => {
        const newQs = [...quizData.questions];
        newQs[qIndex].choices.forEach(c => c.is_correct = false);
        newQs[qIndex].choices[cIndex].is_correct = true;
        setQuizData({ ...quizData, questions: newQs });
    };

    const validateForm = () => {
        if (!quizData.title.trim()) return "Quiz Title is required.";
        if (!quizData.branch) return "Please select a branch.";
        if (quizData.questions.length === 0) return "Add at least one question.";

        for (let i = 0; i < quizData.questions.length; i++) {
            const q = quizData.questions[i];
            if (!q.text.trim()) return `Question ${i + 1} text is empty.`;
            if (q.marks <= 0) return `Question ${i + 1} marks must be positive.`;
            const filledOptions = q.choices.filter(c => c.text.trim() !== '');
            if (filledOptions.length < 2) return `Question ${i + 1} must have at least 2 filled options.`;
            const hasCorrect = q.choices.some(c => c.is_correct);
            if (!hasCorrect) return `Question ${i + 1}: Select a correct answer.`;
        }
        return null;
    };

    const handleSubmit = async () => {
        setError('');
        const validationMsg = validateForm();
        if (validationMsg) { setError(validationMsg); window.scrollTo(0, 0); return; }

        if (!confirm("Save changes to this quiz?")) return;

        setIsSubmitting(true);
        try {
            const res = await apiFetch(`/api/admin/quizzes/${id}/`, {
                method: 'PUT',
                body: JSON.stringify(quizData)
            });

            if (res.ok) {
                alert('Quiz Updated Successfully!');
                router.push('/admin/dashboard');
            } else {
                const data = await res.json();
                setError(data.detail || 'Failed to update quiz.');
            }
        } catch (err) {
            setError('Network error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Quiz...</div>;

    return (
        <>
            <Head><title>Edit Quiz - Produit Academy</title></Head>
            <Header />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Edit Quiz</h1>
                    <button onClick={() => router.push('/admin/dashboard')} style={{ background: 'transparent', border: '1px solid #ccc', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </div>

                {error && <div className={styles.errorMsg}>⚠️ {error}</div>}

                {/* Quiz Details */}
                <div className={styles.section}>
                    <h3 style={{ marginBottom: '15px' }}>Quiz Settings</h3>
                    <div className={styles.row}>
                        <div className={styles.group} style={{ flex: 2 }}>
                            <label className={styles.label}>Quiz Title</label>
                            <input className={styles.input} value={quizData.title} onChange={e => setQuizData({ ...quizData, title: e.target.value })} />
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Branch</label>
                            <select className={styles.select} value={quizData.branch} onChange={e => setQuizData({ ...quizData, branch: e.target.value })}>
                                <option value="">Select Branch</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.group}><label className={styles.label}>Duration (Mins)</label><input type="number" className={styles.input} value={quizData.duration_minutes} onChange={e => setQuizData({ ...quizData, duration_minutes: e.target.value })} /></div>
                        <div className={styles.group}><label className={styles.label}>Total Marks</label><input type="number" className={styles.input} value={quizData.total_marks} onChange={e => setQuizData({ ...quizData, total_marks: e.target.value })} /></div>
                    </div>
                </div>

                {/* Questions */}
                <div>
                    {quizData.questions.map((q, qIdx) => (
                        <div key={qIdx} className={styles.questionCard}>
                            <div className={styles.qHeader}>
                                <span>Question {qIdx + 1}</span>
                                <button className={styles.deleteBtn} onClick={() => removeQuestion(qIdx)}>🗑 Delete</button>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <textarea className={styles.input} style={{ width: '100%', minHeight: '80px' }} value={q.text} onChange={e => updateQuestion(qIdx, 'text', e.target.value)} />
                            </div>
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <label className={styles.label}>Marks:</label>
                                <input type="number" className={styles.input} style={{ width: '80px' }} value={q.marks} onChange={e => updateQuestion(qIdx, 'marks', e.target.value)} />
                            </div>
                            <div className={styles.group}>
                                <label className={styles.label}>Options:</label>
                                {q.choices.map((c, cIdx) => (
                                    <div key={cIdx} className={styles.optionRow}>
                                        <input type="radio" name={`q_${qIdx}`} className={styles.radio} checked={c.is_correct} onChange={() => setCorrectChoice(qIdx, cIdx)} />
                                        <input className={styles.optionInput} value={c.text} onChange={e => updateChoice(qIdx, cIdx, e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px', marginBottom: '50px' }}>
                    <button className={styles.addBtn} onClick={addQuestion}>+ Add Question</button>
                    <button className={styles.saveBtn} onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '15px', fontSize: '1.2rem', marginTop: '10px' }}>
                        {isSubmitting ? 'Updating...' : '💾 Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
}