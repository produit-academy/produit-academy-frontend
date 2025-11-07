import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import styles from '@/styles/Quiz.module.css';

export default function QuizPage() {
  const router = useRouter();
  const { quiz_id } = router.query;

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Stores { question_id: choice_id }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the quiz data
  useEffect(() => {
    if (quiz_id) {
      const fetchQuiz = async () => {
        try {
          const res = await apiFetch(`/api/student/quizzes/${quiz_id}/`);
          if (res.ok) {
            setQuiz(await res.json());
          } else {
            setError('Failed to load quiz. You may not have access.');
          }
        } catch (err) {
          setError('An error occurred while fetching the quiz.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuiz();
    }
  }, [quiz_id]);

  const handleSelectAnswer = (questionId, choiceId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit your test?')) {
      return;
    }

    const answers = Object.entries(selectedAnswers).map(([qId, cId]) => ({
      question_id: parseInt(qId),
      choice_id: parseInt(cId),
    }));

    try {
      const res = await apiFetch(`/api/student/quizzes/${quiz_id}/submit/`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        const result = await res.json();
        // Redirect to analytics page to show the result
        router.push(`/student/analytics?result_id=${result.id}`);
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to submit quiz.');
      }
    } catch (err) {
      setError('An error occurred during submission.');
    }
  };

  if (isLoading) return <p>Loading quiz...</p>;
  if (error) return <p>{error}</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedChoice = selectedAnswers[currentQuestion.id];

  return (
    <>
      <Head><title>{quiz.title} - Produit Academy</title></Head>
      <Header />
      <main className="main-content">
        <div className="container">
          <h1 className={styles.quizTitle}>{quiz.title}</h1>
          
          <div className={styles.quizContainer}>
            <div className={styles.questionHeader}>
              <h2 className={styles.questionText}>
                Q{currentQuestionIndex + 1}: {currentQuestion.text}
              </h2>
              <span className={styles.questionMarks}>{currentQuestion.marks} Mark(s)</span>
            </div>

            <div className={styles.choicesGrid}>
              {currentQuestion.choices.map(choice => (
                <button
                  key={choice.id}
                  className={`${styles.choiceButton} ${selectedChoice === choice.id ? styles.selected : ''}`}
                  onClick={() => handleSelectAnswer(currentQuestion.id, choice.id)}
                >
                  {choice.text}
                </button>
              ))}
            </div>

            <div className={styles.navigation}>
              <button onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              <span className={styles.questionProgress}>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button onClick={handleSubmit} className={styles.submitButton}>
                  Submit Test
                </button>
              ) : (
                <button onClick={handleNext}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}