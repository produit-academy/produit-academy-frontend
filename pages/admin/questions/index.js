import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAllQuestions, deleteQuestion } from '@/utils/api';
import styles from '@/styles/QuestionBank.module.css';

export default function QuestionBank() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const categories = ['General Aptitude', 'Engineering Mathematics', 'Subject Paper'];

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const res = await fetchAllQuestions();
            if (res.data) setQuestions(res.data);
        } catch (error) {
            console.error("Failed to load data", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this question?')) {
            try {
                await deleteQuestion(id);
            } catch (error) {
                console.error("Error deleting question:", error);
                // Even if it fails (e.g. 404), we should refresh the list to show current state
                alert('Question might have already been deleted. Refreshing list.');
            }
            const res = await fetchAllQuestions();
            if (res.data) setQuestions(res.data);
        }
    };

    const filteredQuestions = filterCategory === 'All'
        ? questions
        : questions.filter(q => q.category === filterCategory);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleGroup}>
                    <button onClick={() => router.push('/admin/dashboard')} className={styles.backBtn}>
                        ← Back
                    </button>
                    <h1 className={styles.pageTitle}>Question Bank</h1>
                </div>

                <div className={styles.actions}>
                    {/* CATEGORY FILTER DROPDOWN */}
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Filter:</span>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={styles.select}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={() => router.push('/admin/questions/create')}
                        className={styles.addBtn}
                    >
                        + Add New Question
                    </button>
                </div>
            </header>

            {filteredQuestions.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No questions found.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredQuestions.map(q => (
                        <div key={q.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.metaTags}>
                                    <span className={`${styles.tag} ${styles.tagCategory}`}>
                                        {q.category || 'Uncategorized'}
                                    </span>
                                    {q.branch_name && (
                                        <span className={`${styles.tag} ${styles.tagBranch}`}>
                                            {q.branch_name}
                                        </span>
                                    )}
                                </div>
                                <span className={styles.marks}>Marks: {q.marks}</span>
                            </div>

                            <p className={styles.questionText}>{q.text}</p>
                            {q.image && <div style={{ marginBottom: '15px' }}><img src={q.image} alt="Question" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #eee' }} /></div>}

                            <div className={styles.optionsGrid}>
                                {q.choices.map((c, i) => (
                                    <div
                                        key={c.id}
                                        className={`${styles.option} ${c.is_correct ? styles.correctOption : ''}`}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                                                {String.fromCharCode(65 + i)}.
                                            </span>
                                            {c.text}
                                            {c.is_correct && <span style={{ marginLeft: '5px' }}>✔</span>}
                                        </div>
                                        {c.image && <div style={{ marginTop: '5px', marginLeft: '25px' }}><img src={c.image} alt="Option" style={{ maxHeight: '80px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.cardFooter}>
                                <button
                                    onClick={() => router.push(`/admin/questions/${q.id}/edit`)}
                                    className={styles.editBtn}
                                >
                                    Edit Question
                                </button>
                                <button
                                    onClick={() => handleDelete(q.id)}
                                    className={styles.deleteBtn}
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