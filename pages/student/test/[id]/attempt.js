import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { submitMockTest } from '../../../utils/api';
import styles from '../../../styles/GateExam.module.css'; // You will need to create this CSS file

export default function AttemptTest() {
    const router = useRouter();
    const { id } = router.query;

    // Test Data
    const [testData, setTestData] = useState(null);
    const [questions, setQuestions] = useState([]);

    // User State
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { question_id: choice_id }
    const [visited, setVisited] = useState(new Set([0]));
    const [markedForReview, setMarkedForReview] = useState(new Set());

    // Timer
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const timerRef = useRef(null);

    // Load Data
    useEffect(() => {
        const stored = localStorage.getItem('currentTestSession');
        if (stored) {
            const data = JSON.parse(stored);
            setTestData(data);
            setQuestions(data.questions);
            setTimeLeft(data.time_limit_minutes * 60);
        }
    }, [id]);

    // Timer Logic
    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmit(true); // Auto submit
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft]);

    // Format Time (HH:MM:SS)
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Navigation & Status Logic
    const handleQuestionSelect = (index) => {
        setCurrentQIndex(index);
        setVisited(prev => new Set(prev).add(index));
    };

    const handleOptionSelect = (qId, cId) => {
        setAnswers(prev => ({ ...prev, [qId]: cId }));
    };

    const handleSaveNext = () => {
        // Saving is automatic via 'answers' state, just move next
        if (currentQIndex < questions.length - 1) {
            handleQuestionSelect(currentQIndex + 1);
        }
    };

    const handleMarkReviewNext = () => {
        setMarkedForReview(prev => new Set(prev).add(questions[currentQIndex].question_id));
        if (currentQIndex < questions.length - 1) {
            handleQuestionSelect(currentQIndex + 1);
        }
    };

    const handleClearResponse = () => {
        const qId = questions[currentQIndex].question_id;
        const newAnswers = { ...answers };
        delete newAnswers[qId];
        setAnswers(newAnswers);
    };

    const handleSubmit = async (auto = false) => {
        if (!auto && !confirm("Are you sure you want to submit the test?")) return;

        // Transform answers map to array for API
        const payload = Object.entries(answers).map(([qId, cId]) => ({
            question_id: parseInt(qId),
            choice_id: parseInt(cId)
        }));

        try {
            await submitMockTest(testData.id, payload);
            localStorage.removeItem('currentTestSession');
            router.push(`/student/test/${testData.id}/result`);
        } catch (error) {
            alert("Submission failed. Please try again.");
        }
    };

    // --- RENDER HELPERS ---

    const getPaletteColor = (index, qId) => {
        const isAnswered = answers.hasOwnProperty(qId);
        const isMarked = markedForReview.has(qId);
        const isVisited = visited.has(index);

        if (isAnswered && isMarked) return 'purple-green'; // Custom class
        if (isMarked) return 'purple';
        if (isAnswered) return 'green';
        if (isVisited && !isAnswered) return 'red';
        return 'white';
    };

    if (!testData || questions.length === 0) return <div>Loading Exam Interface...</div>;

    const currentQ = questions[currentQIndex];

    return (
        <div className={styles.examContainer}>
            {/* --- HEADER --- */}
            <div className={styles.header}>
                <div><strong>Produit Academy Mock Test</strong></div>
                <div className={styles.timer}>Time Left: {formatTime(timeLeft)}</div>
            </div>

            <div className={styles.mainContent}>
                {/* --- QUESTION AREA (LEFT) --- */}
                <div className={styles.questionArea}>
                    <div className={styles.questionHeader}>
                        <h3>Question {currentQIndex + 1}</h3>
                        <div className={styles.marks}>Marks: {currentQ.marks}</div>
                    </div>

                    <div className={styles.questionText}>
                        {currentQ.question_text}
                    </div>

                    <div className={styles.optionsList}>
                        {currentQ.choices.map(choice => (
                            <label key={choice.id} className={styles.optionItem}>
                                <input
                                    type="radio"
                                    name={`q-${currentQ.question_id}`}
                                    checked={answers[currentQ.question_id] === choice.id}
                                    onChange={() => handleOptionSelect(currentQ.question_id, choice.id)}
                                />
                                <span>{choice.text}</span>
                            </label>
                        ))}
                    </div>

                    <div className={styles.footerButtons}>
                        <button className={styles.btnSecondary} onClick={handleMarkReviewNext}>Mark for Review & Next</button>
                        <button className={styles.btnSecondary} onClick={handleClearResponse}>Clear Response</button>
                        <button className={styles.btnPrimary} onClick={handleSaveNext}>Save & Next</button>
                    </div>
                </div>

                {/* --- SIDEBAR PALETTE (RIGHT) --- */}
                <div className={styles.sidebar}>
                    <div className={styles.profileSection}>
                        <img src="/default-avatar.png" alt="User" width="50" />
                        <span>Candidate</span>
                    </div>

                    <div className={styles.paletteGrid}>
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                className={`${styles.paletteBtn} ${styles[getPaletteColor(idx, q.question_id)]}`}
                                onClick={() => handleQuestionSelect(idx)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <div className={styles.legend}>
                        <div><span className={`${styles.dot} ${styles.green}`}></span> Answered</div>
                        <div><span className={`${styles.dot} ${styles.red}`}></span> Not Answered</div>
                        <div><span className={`${styles.dot} ${styles.white}`}></span> Not Visited</div>
                        <div><span className={`${styles.dot} ${styles.purple}`}></span> Marked for Review</div>
                    </div>

                    <button className={styles.submitBtn} onClick={() => handleSubmit(false)}>Submit Test</button>
                </div>
            </div>
        </div>
    );
}