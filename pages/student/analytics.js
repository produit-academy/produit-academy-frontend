import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import styles from '@/styles/Dashboard.css';

export default function Analytics() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiFetch('/api/student/analytics/');
        if (res.ok) {
          setResults(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <>
      <Head><title>My Analytics - Produit Academy</title></Head>
      <Header />
      <main className="main-content">
        <div className="container">
          <h1 className="dashboard-title">My Analytics</h1>
          <div className="dashboard-section">
            <h2 className="section-title">Past Test Results</h2>
            {isLoading ? (
              <p>Loading results...</p>
            ) : results.length > 0 ? (
              <ul className="materials-list">
                {results.map(result => (
                  <li key={result.id} className="material-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <span className="material-title">{result.quiz}</span>
                      <span className="material-classification" style={{display: 'block', marginTop: '5px'}}>
                        Taken on: {new Date(result.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <span style={{fontSize: '1.2rem', fontWeight: '600', color: 'var(--accent-blue)'}}>
                      Score: {result.score} / {result.total_marks}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have not completed any tests yet.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}