import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import Link from 'next/link';

const slideInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [courseRequests, setCourseRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, materialsRes, requestsRes] = await Promise.all([
          apiFetch('/api/student/dashboard/'),
          apiFetch('/api/materials/'),
          apiFetch('/api/courserequest/')
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (materialsRes.ok) setMaterials(await materialsRes.json());
        if (requestsRes.ok) setCourseRequests(await requestsRes.json());

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
      case 'Approved':
        return 'var(--accent-green)';
      case 'Rejected':
        return 'var(--accent-red)';
      case 'Pending':
      default:
        return 'var(--accent-blue)';
    }
  };

  if (isLoading) {
    return (
      <>
        <Head><title>Dashboard - Produit Academy</title></Head>
        <Header />
        <main className="main-content"><div className="container"><p>Loading dashboard...</p></div></main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head><title>Dashboard - Produit Academy</title></Head>
      <Header />
      <main className="main-content">
        <div className="container">
          <motion.div variants={slideInUp} initial="hidden" animate="visible">
            <h1 className="dashboard-title">My Dashboard</h1>
            
            {/* Welcome Message */}
            {user && (
              <div className="dashboard-section welcome-message">
                <h2 className="section-title">Welcome, {user.username}!</h2>
                <p>Your Student ID: <strong>{user.student_id}</strong></p>
              </div>
            )}

            {/* Course Request Status Section */}
            <div className="dashboard-section">
              <h2 className="section-title">My Course Status</h2>
              {courseRequests.length > 0 ? (
                <div 
                  className="status-badge" 
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    color: '#fff',
                    backgroundColor: getStatusColor(courseRequests[0].status)
                  }}
                >
                  {courseRequests[0].status}
                </div>
              ) : (
                <p>You have not requested any course access.</p>
              )}
              {courseRequests.length > 0 && courseRequests[0].status === 'Pending' && (
                <p style={{marginTop: '10px', color: 'var(--text-secondary)'}}>
                  Your request is pending approval. You will get access to materials and mock tests once approved.
                </p>
              )}
            </div>

            {/* Materials Section - COMING SOON */}
            <div className="dashboard-section">
              <h2 className="section-title">Study Materials</h2>
              <div className="coming-soon-placeholder" style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: 'var(--card-bg)',
                borderRadius: '8px',
                border: '1px solid var(--card-border)'
              }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Coming Soon!</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
                  Our full library of study materials is being prepared and will be available here shortly.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}