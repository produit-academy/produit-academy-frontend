import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courseReq, setCourseReq] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Fetch User Data, Course Request Status, and Recent Test History
        const [userRes, reqRes, historyRes] = await Promise.all([
          apiFetch('/api/student/dashboard/'),
          apiFetch('/api/courserequest/'),
          apiFetch('/api/student/tests/history/')
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (reqRes.ok) {
          const reqs = await reqRes.json();
          if (reqs.length > 0) setCourseReq(reqs[0]);
        }
        if (historyRes.ok) {
          const history = await historyRes.json();
          setRecentTests(history.slice(0, 3)); // Show only top 3 recent
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <>
      <Head><title>Student Dashboard - Produit Academy</title></Head>
      <Header />
      <main className="main-content">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* 1. Welcome Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                <h1 style={{ margin: 0 }}>Welcome, {user?.username}!</h1>
                <p style={{ color: '#666', marginTop: '5px' }}>
                  {user?.branch_name ? `Branch: ${user.branch_name}` : 'No Branch Selected'}
                  {courseReq && ` • Status: ${courseReq.status}`}
                </p>
              </div>
              <button onClick={() => router.push('/profile')} style={{ padding: '8px 16px', border: '1px solid #ccc', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                Edit Profile
              </button>
            </div>

            {/* 2. Main Action Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>

              {/* Create Test Card */}
              <div className="card-hover" onClick={() => router.push('/student/create-test')}
                style={{ padding: '25px', background: 'linear-gradient(135deg, #0070f3 0%, #005bb5 100%)', color: 'white', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,112,243,0.3)' }}>
                <h2 style={{ margin: '0 0 10px 0' }}>🚀 Take a Mock Test</h2>
                <p style={{ margin: 0, opacity: 0.9 }}>Generate a custom test based on your preferences. Choose topics, time, and questions.</p>
              </div>

              {/* Study Materials Card */}
              <div className="card-hover" onClick={() => router.push('/materials')}
                style={{ padding: '25px', background: 'white', border: '1px solid #eee', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>📚 Study Materials</h2>
                <p style={{ color: '#666', margin: 0 }}>Access Notes, PYQs, and One-shots for your branch.</p>
              </div>

              {/* Analytics/History Card */}
              <div className="card-hover" onClick={() => router.push('/student/history')}
                style={{ padding: '25px', background: 'white', border: '1px solid #eee', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>📊 Past Results</h2>
                <p style={{ color: '#666', margin: 0 }}>View detailed analytics and review answers of your previous attempts.</p>
              </div>
            </div>

            {/* 3. Recent Activity Section */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '10px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Recent Test History</h2>
                <button onClick={() => router.push('/student/history')} style={{ color: '#0070f3', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>View All &rarr;</button>
              </div>

              {recentTests.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left', color: '#888' }}>
                      <th style={{ padding: '10px 0' }}>Date</th>
                      <th style={{ padding: '10px 0' }}>Status</th>
                      <th style={{ padding: '10px 0' }}>Score</th>
                      <th style={{ padding: '10px 0', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTests.map(test => (
                      <tr key={test.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                        <td style={{ padding: '15px 0' }}>{new Date(test.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '15px 0' }}>
                          <span style={{
                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                            background: test.is_completed ? '#d4edda' : '#fff3cd',
                            color: test.is_completed ? '#155724' : '#856404'
                          }}>
                            {test.is_completed ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        <td style={{ padding: '15px 0', fontWeight: 'bold' }}>
                          {test.is_completed ? test.score : '-'}
                        </td>
                        <td style={{ padding: '15px 0', textAlign: 'right' }}>
                          {test.is_completed ? (
                            <button onClick={() => router.push(`/student/test/${test.id}/result`)} style={{ color: '#0070f3', background: 'none', border: 'none', cursor: 'pointer' }}>View Analysis</button>
                          ) : (
                            <button onClick={() => router.push(`/student/test/${test.id}/attempt`)} style={{ color: '#e0a800', background: 'none', border: 'none', cursor: 'pointer' }}>Resume</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>You haven't taken any tests yet.</p>
              )}
            </div>

          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}