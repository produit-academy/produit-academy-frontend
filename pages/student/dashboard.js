import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import Link from 'next/link';
import { useRouter } from 'next/router';

const slideInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [courseRequests, setCourseRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const role = localStorage.getItem('user_role');
      if (role !== 'student') {
          router.push('/login'); 
      }
  }, []);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Added /api/student/quizzes/ to the fetch list
        const [userRes, materialsRes, requestsRes, quizzesRes] = await Promise.all([
          apiFetch('/api/student/dashboard/'),
          apiFetch('/api/materials/'),
          apiFetch('/api/courserequest/'),
          apiFetch('/api/student/quizzes/') // Assuming you created this endpoint in backend
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (materialsRes.ok) setMaterials(await materialsRes.json());
        if (requestsRes.ok) setCourseRequests(await requestsRes.json());
        if (quizzesRes.ok) setQuizzes(await quizzesRes.json());

      } catch (error) {
        if (error.message !== 'Session expired') {
          console.error("Failed to fetch dashboard data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'var(--accent-green)';
      case 'Rejected': return 'var(--accent-red)';
      default: return 'var(--accent-blue)';
    }
  };

  if (isLoading) return <div className="container">Loading...</div>;

  return (
    <>
      <Head><title>Dashboard - Produit Academy</title></Head>
      <Header />
      <main className="main-content">
        <div className="container">
          <motion.div variants={slideInUp} initial="hidden" animate="visible">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="dashboard-title">My Dashboard</h1>
                <Link href="/student/analytics" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    View Performance Analytics
                </Link>
            </div>
            
            {/* Welcome & Status */}
            {user && (
              <div className="dashboard-section welcome-message">
                <h2 className="section-title">Welcome, {user.username}!</h2>
                <p>Student ID: <strong>{user.student_id}</strong></p>
                <div style={{ marginTop: '10px' }}>
                     Status: 
                     <span style={{ 
                         marginLeft: '10px', fontWeight: 'bold', 
                         color: getStatusColor(courseRequests[0]?.status || 'Pending') 
                     }}>
                        {courseRequests[0]?.status || 'None'}
                     </span>
                </div>
              </div>
            )}

            {/* QUIZZES SECTION (NEW) */}
            <div className="dashboard-section">
              <h2 className="section-title">Mock Tests & Quizzes</h2>
              {quizzes.length > 0 ? (
                <div className="materials-grid" style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                  {quizzes.map(quiz => (
                    <div key={quiz.id} className="card" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3>{quiz.title}</h3>
                        <p>{quiz.duration_minutes} Mins | {quiz.total_marks} Marks</p>
                        <Link href={`/student/mock-tests/${quiz.id}`} style={{ 
                            display: 'block', marginTop: '10px', textAlign: 'center', 
                            background: '#0070f3', color: 'white', padding: '8px', 
                            borderRadius: '5px', textDecoration: 'none' 
                        }}>
                            Attempt Test
                        </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No quizzes available for your branch yet.</p>
              )}
            </div>

            {/* MATERIALS SECTION (FIXED) */}
            <div className="dashboard-section">
              <h2 className="section-title">Study Materials</h2>
              {materials.length > 0 ? (
                <ul className="materials-list" style={{ listStyle: 'none', padding: 0 }}>
                  {materials.map(mat => (
                    <li key={mat.id} style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        padding: '15px', borderBottom: '1px solid #eee' 
                    }}>
                      <div>
                        <strong>{mat.title}</strong>
                        <span style={{ marginLeft: '10px', fontSize: '0.8rem', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
                            {mat.classification}
                        </span>
                      </div>
                      <Link href={`/materials/${mat.id}`} style={{ color: '#0070f3', fontWeight: 'bold' }}>
                        View PDF
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="coming-soon-placeholder" style={{ padding: '20px', textAlign: 'center', background: '#f9f9f9' }}>
                   <p>No materials uploaded for your branch yet.</p>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}