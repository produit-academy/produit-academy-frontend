import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAllQuestions, deleteQuestion } from '@/utils/api';
import styles from '@/styles/QuestionBank.module.css';

export default function QuestionBank() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const categories = ['General Aptitude', 'Engineering Mathematics', 'Subject Paper'];

    useEffect(() => {
        if (!router.isReady) return;
        loadQuestions(currentPage);
    }, [currentPage, router.isReady]);

    const loadQuestions = async (page) => {
        setLoading(true);
        try {
            const res = await fetchAllQuestions(page);
            if (res.data) {
                // Handle both paginated and non-paginated responses for safety
                if (Array.isArray(res.data)) {
                    setQuestions(res.data);
                    setNextPage(null);
                    setPrevPage(null);
                } else if (res.data.results) {
                    setQuestions(res.data.results);
                    setNextPage(res.data.next);
                    setPrevPage(res.data.previous);
                }
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this question?')) {
            try {
                await deleteQuestion(id);
                loadQuestions(currentPage);
            } catch (error) {
                console.error("Error deleting question:", error);
                alert('Question might have already been deleted. Refreshing list.');
                loadQuestions(currentPage);
            }
        }
    };

    const handlePageChange = (direction) => {
        if (direction === 'next' && nextPage) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'prev' && prevPage) {
            setCurrentPage(prev => prev - 1);
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

            {loading ? (
                <div className={styles.loadingState}>
                    <p>Loading questions...</p>
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No questions found.</p>
                </div>
            ) : (
                <>
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
                                    {q.question_type === 'NAT' ? (
                                        <div className={styles.option} style={{ backgroundColor: '#e3f2fd', borderColor: '#2196f3' }}>
                                            <span style={{ fontWeight: 'bold' }}>Answer Range: </span>
                                            {q.nat_min} - {q.nat_max}
                                        </div>
                                    ) : (
                                        q.choices.map((c, i) => (
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
                                        ))
                                    )}
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

                    {/* PAGINATION CONTROLS */}
                    <div className={styles.pagination}>
                        <button
                            onClick={() => handlePageChange('prev')}
                            disabled={!prevPage}
                            className={styles.pageBtn}
                        >
                            Previous
                        </button>
                        <span className={styles.pageInfo}>Page {currentPage}</span>
                        <button
                            onClick={() => handlePageChange('next')}
                            disabled={!nextPage}
                            className={styles.pageBtn}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}