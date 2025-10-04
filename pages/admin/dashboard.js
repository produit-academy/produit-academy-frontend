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

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [branch, setBranch] = useState('');
  const [classification, setClassification] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [requestsRes, branchesRes, studentsRes] = await Promise.all([
                apiFetch('http://127.0.0.1:8000/api/admin/dashboard/'),
                apiFetch('http://127.0.0.1:8000/api/branches/'),
                apiFetch('http://127.0.0.1:8000/api/admin/students/')
            ]);

            if (requestsRes.ok) setRequests(await requestsRes.json());
            if (branchesRes.ok) setBranches(await branchesRes.json());
            if (studentsRes.ok) setStudents(await studentsRes.json());
        } catch (error) {
            if (error.message !== 'Session expired') {
                console.error("Failed to fetch dashboard data:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchInitialData();
  }, []);

  const handleRequestUpdate = async (requestId, newStatus) => {
    try {
        const response = await apiFetch(`http://127.0.0.1:8000/api/courserequests/${requestId}/update/`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
        });
        if (response.ok) {
            alert(`Request has been ${newStatus}.`);
            setRequests(prev => prev.filter(req => req.id !== requestId));
        } else { alert('Failed to update request.'); }
    } catch (error) {
        if (error.message !== 'Session expired') {
            console.error('An error occurred:', error);
        }
    }
  };
  
  const handleDisableAccount = async (studentId) => {
    if (!confirm('Are you sure you want to disable this account?')) return;
    try {
        const response = await apiFetch(`http://127.0.0.1:8000/api/admin/students/${studentId}/`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Account has been disabled.');
            setStudents(prev => prev.filter(s => s.id !== studentId));
        } else { alert('Failed to disable account.'); }
    } catch (error) {
        if (error.message !== 'Session expired') {
            console.error('An error occurred:', error);
        }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !branch || !classification || !title) { alert('Please fill all upload fields.'); return; }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('branch', branch);
    formData.append('classification', classification);
    formData.append('title', title);
    
    try {
        const response = await apiFetch('http://127.0.0.1:8000/api/materials/upload/', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            alert('File uploaded successfully!');
            e.target.reset(); setTitle(''); setFile(null); setBranch(''); setClassification('');
        } else { alert('Upload failed.'); }
    } catch (error) {
        if (error.message !== 'Session expired') {
            console.error('An error occurred:', error);
        }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Head><title>Admin Dashboard - Produit Academy</title></Head>
      <Header />
      <main className="main-content">
        <div className="container">
          <motion.div className="dashboard-container" variants={slideInUp} initial="hidden" animate="visible">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <div className="dashboard-section">
              <h2 className="section-title">Pending Course Requests</h2>
              {requests.length > 0 ? requests.map(req => (
                  <div key={req.id} className="request-item">
                    <span>{req.student.student_id} - {req.student.username} ({req.branch.name})</span>
                    <div className="request-actions">
                      <button className="btn btn-approve" onClick={() => handleRequestUpdate(req.id, 'Approved')}>Approve</button>
                      <button className="btn btn-reject" onClick={() => handleRequestUpdate(req.id, 'Rejected')}>Reject</button>
                    </div>
                  </div>
                )) : <p>No pending requests.</p>}
            </div>
            <div className="dashboard-section">
              <h2 className="section-title">Upload Materials</h2>
              <form className="upload-form" onSubmit={handleUpload}>
                <input type="text" placeholder="Material Title" required onChange={(e) => setTitle(e.target.value)} />
                <select required onChange={(e) => setBranch(e.target.value)}>
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select required onChange={(e) => setClassification(e.target.value)}>
                  <option value="">Select Classification</option>
                  <option value="PYQ">PYQ</option>
                  <option value="Notes">Notes</option>
                  <option value="One-shots">One-Shots</option>
                </select>
                <input type="file" required onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit" className="cta-btn">Upload</button>
              </form>
            </div>
            <div className="dashboard-section">
                <h2 className="section-title">Manage Students</h2>
                {students.map(student => (
                    <div key={student.id} className="student-item">
                        <span>{student.student_id} - {student.username}</span>
                        <div className="student-actions">
                            <button className="btn btn-reject" onClick={() => handleDisableAccount(student.id)}>Disable Account</button>
                        </div>
                    </div>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}