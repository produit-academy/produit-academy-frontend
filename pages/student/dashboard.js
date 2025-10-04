import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api'; // Import the new utility

const slideInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseRequest, setCourseRequest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [studentRes, requestRes, materialsRes] = await Promise.all([
                apiFetch('http://127.0.0.1:8000/api/student/dashboard/'),
                apiFetch('http://127.0.0.1:8000/api/courserequest/'),
                apiFetch('http://127.0.0.1:8000/api/materials/')
            ]);

            if (studentRes.ok) setStudent(await studentRes.json());
            if (requestRes.ok) setCourseRequest((await requestRes.json())[0]); 
            if (materialsRes.ok) setMaterials(await materialsRes.json());
            
        } catch (error) {
            if (error.message !== 'Session expired') {
                console.error("Failed to fetch dashboard data:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, []);

  const handleMaterialView = async (materialId) => {
    try {
      const response = await apiFetch(`http://127.0.0.1:8000/api/materials/${materialId}/view/`);
      if (response.ok) {
        const fileBlob = await response.blob();
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
      } else {
        alert("Error: Could not access the material.");
      }
    } catch (error) {
        if (error.message !== 'Session expired') {
            console.error("An error occurred while fetching the material:", error);
        }
    }
  };

  if (isLoading || !student) {
    return <div>Loading...</div>;
  }
  
  const isApproved = courseRequest?.status === 'Approved';

  return (
    <>
      <Head><title>Student Dashboard - Produit Academy</title></Head>
      <Header />
      <main className="main-content">
        <div className="container">
          <motion.div className="dashboard-container" variants={slideInUp} initial="hidden" animate="visible">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Welcome, {student.username}</h1>
              {courseRequest && (
                <div className={`status-badge ${isApproved ? 'status-approved' : 'status-pending'}`}>
                  Course Status: {courseRequest.status}
                </div>
              )}
            </div>
            
            <div className="materials-container">
              <h2 className="section-title">{isApproved ? 'Your Study Materials' : 'Course Preview'}</h2>
              {!isApproved && <p>Your course request is pending. In the meantime, you can view a limited selection of our materials.</p>}
              
              <div className="materials-list" style={{marginTop: '1.5rem'}}>
                {materials.length > 0 ? materials.map(material => (
                  <div 
                    key={material.id} 
                    className="material-item"
                    style={{cursor: 'pointer'}}
                    onClick={() => handleMaterialView(material.id)}
                  >
                    {material.title}
                  </div>
                )) : <p>No materials available for your branch yet.</p>}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}