import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import styles from '@/styles/Dashboard.css';

export default function MockTests() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await apiFetch('/api/student/quizzes/');
        if (res.ok) {
          setQuizzes(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <>
      <Head><title>Mock Tests - Produit Academy</title></Head>
      <Header />
      <main className="main-content">
        <div className="container">
          <h1 className="dashboard-title">Available Mock Tests</h1>
          <div className="dashboard-section">
            {isLoading ? (
              <p>Loading tests...</p>
            ) : quizzes.length > 0 ? (
              <ul className="materials-list">
                {quizzes.map(quiz => (
                  <li key={quiz.id} className="material-item">
                    <Link href={`/student/mock-tests/${quiz.id}`} passHref>
                      <span className="material-title">{quiz.title}</span>
                      <span className="material-classification">{quiz.duration_minutes} Minutes</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No mock tests are available for your branch right now.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}