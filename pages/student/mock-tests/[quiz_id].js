import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from '@/styles/GateExam.module.css';
import apiFetch from '@/utils/api';

export default function GateExamInterface() {
    const router = useRouter();
    const { quiz_id } = router.query;
    const [quiz, setQuiz] = useState(null);
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [status, setStatus] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!quiz_id) return;

        apiFetch(`/api/student/quizzes/${quiz_id}/`)
            .then(res => res.json())
            .then(data => {
                setQuiz(data);
                const initStatus = {};
                data.questions.forEach(q => initStatus[q.id] = 'not_visited');
                if (data.questions.length > 0) initStatus[data.questions[0].id] = 'not_answered';
                setStatus(initStatus);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [quiz_id]);

    const changeQuestion = (index) => {
        const currentQId = quiz.questions[qIndex].id;

        if (status[currentQId] === 'not_visited') {
            setStatus(prev => ({ ...prev, [currentQId]: 'not_answered' }));
        }

        setQIndex(index);

        const newQId = quiz.questions[index].id;
        if (status[newQId] === 'not_visited') {
            setStatus(prev => ({ ...prev, [newQId]: 'not_answered' }));
        }
    };

    const handleAnswer = (choiceId) => {
        setAnswers(prev => ({ ...prev, [quiz.questions[qIndex].id]: choiceId }));
    };

    const saveAndNext = () => {
        const qId = quiz.questions[qIndex].id;
        setStatus(prev => ({
            ...prev,
            [qId]: answers[qId] ? 'answered' : 'not_answered'
        }));
        if (qIndex < quiz.questions.length - 1) changeQuestion(qIndex + 1);
    };

    const markForReview = () => {
        const qId = quiz.questions[qIndex].id;
        setStatus(prev => ({ ...prev, [qId]: 'marked' }));
        if (qIndex < quiz.questions.length - 1) changeQuestion(qIndex + 1);
    };

    const submitExam = async () => {
        if (!confirm("Are you sure you want to submit?")) return;

        const payload = Object.entries(answers).map(([qid, cid]) => ({
            question_id: parseInt(qid),
            choice_id: parseInt(cid)
        }));

        const res = await apiFetch(`/api/student/quizzes/${quiz_id}/submit/`, {
            method: 'POST',
            body: JSON.stringify({ answers: payload })
        });

        if (res.ok) {
            alert("Exam Submitted Successfully!");
            router.push('/student/dashboard');
        } else {
            alert("Submission failed. Please try again.");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!quiz) return <div style={{ padding: '20px' }}>Quiz not found.</div>;

    const currentQ = quiz.questions[qIndex];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>{quiz.title}</div>
                <div className={styles.timer}>Time Remaining: {quiz.duration_minutes}:00</div>
            </header>

            <div className={styles.mainContent}>
                {/* Left Area: Question */}
                <div className={styles.questionArea}>
                    <div className={styles.questionHeader}>
                        <span>Question {qIndex + 1}</span>
                        <span>Marks: {currentQ.marks}</span>
                    </div>

                    <div className={styles.questionText}>
                        {currentQ.text}
                        {currentQ.image && <div style={{ margin: '15px 0' }}><img src={currentQ.image} alt="Question" style={{ maxWidth: '100%', maxHeight: '300px' }} /></div>}
                    </div>

                    <div>
                        {currentQ.choices.map(c => (
                            <label key={c.id} className={styles.optionLabel} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="opt"
                                        className={styles.radio}
                                        checked={answers[currentQ.id] === c.id}
                                        onChange={() => handleAnswer(c.id)}
                                    />
                                    {c.text}
                                </div>
                                {c.image && <div style={{ marginLeft: '30px', marginTop: '5px' }}><img src={c.image} alt="Option" style={{ maxWidth: '200px', maxHeight: '150px' }} /></div>}
                            </label>
                        ))}
                    </div>

                    <div className={styles.footerButtons}>
                        <button className={`${styles.btn} ${styles.btnReview}`} onClick={markForReview}>Mark for Review</button>
                        <button className={`${styles.btn} ${styles.btnClear}`} onClick={() => {
                            const newAns = { ...answers }; delete newAns[currentQ.id]; setAnswers(newAns);
                        }}>Clear Response</button>
                        <button className={`${styles.btn} ${styles.btnSave}`} onClick={saveAndNext}>Save & Next</button>
                    </div>
                </div>

                {/* Right Area: Palette */}
                <div className={styles.sidebar}>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}><span className={`${styles.dot} ${styles.status_answered}`}></span> Answered</div>
                        <div className={styles.legendItem}><span className={`${styles.dot} ${styles.status_not_answered}`}></span> Not Ans</div>
                        <div className={styles.legendItem}><span className={`${styles.dot} ${styles.status_marked}`}></span> Marked</div>
                        <div className={styles.legendItem}><span className={`${styles.dot} ${styles.status_not_visited}`}></span> Not Visit</div>
                    </div>

                    <div className={styles.paletteGrid}>
                        {quiz.questions.map((q, idx) => (
                            <button
                                key={q.id}
                                className={`${styles.paletteBtn} ${styles[status[q.id]]} ${qIndex === idx ? styles.active : ''}`}
                                onClick={() => changeQuestion(idx)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <button className={styles.submitBtn} onClick={submitExam}>Submit Test</button>
                </div>
            </div>
        </div>
    );
}