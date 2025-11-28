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


export default function AdminDashboard() {
  // --- State Management ---
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const router = useRouter();

  // Upload Form State
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [branch, setBranch] = useState('');
  const [classification, setClassification] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);

  // Login Kick
  useEffect(() => {
      const role = localStorage.getItem('user_role');
      if (role !== 'admin') {
          router.push('/login');
      }
  }, []);

  // --- Fetch Data on Load ---
  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [requestsRes, branchesRes, studentsRes, quizzesRes, subsRes] = await Promise.all([
                apiFetch('/api/admin/dashboard/'),
                apiFetch('/api/branches/'),
                apiFetch('/api/admin/students/'),
                apiFetch('/api/admin/quizzes/'),   // Fetch Quizzes
                apiFetch('/api/admin/analytics/')  // Fetch Global Analytics/Submissions
            ]);

            if (requestsRes.ok) setRequests(await requestsRes.json());
            if (branchesRes.ok) setBranches(await branchesRes.json());
            if (studentsRes.ok) setStudents(await studentsRes.json());
            if (quizzesRes.ok) setQuizzes(await quizzesRes.json());
            if (subsRes.ok) setSubmissions(await subsRes.json());

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  // --- Action Handlers ---

  const handleRequestUpdate = async (requestId, newStatus) => {
    const res = await apiFetch(`/api/courserequests/${requestId}/update/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
        alert(`Request has been ${newStatus}.`);
        setRequests(prev => prev.filter(req => req.id !== requestId));
    } else {
        alert('Failed to update request.');
    }
  };
  
  const handleDisableAccount = async (studentId) => {
    if (!confirm('Are you sure you want to disable this account?')) return;
    const res = await apiFetch(`/api/admin/students/${studentId}/`, {
        method: 'DELETE',
    });
    if (res.ok) {
        alert('Account has been disabled.');
        setStudents(prev => prev.filter(s => s.id !== studentId));
    } else {
        alert('Failed to disable account.');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return;
    
    const res = await apiFetch(`/api/admin/quizzes/${quizId}/`, {
        method: 'DELETE',
    });

    if (res.ok) {
        alert('Quiz deleted successfully.');
        setQuizzes(prev => prev.filter(q => q.id !== quizId));
    } else {
        alert('Failed to delete quiz.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !branch || !classification || !title) {
        alert('Please fill all upload fields.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('branch', branch);
    formData.append('classification', classification);
    formData.append('title', title);
    
    const res = await apiFetch('/api/materials/upload/', {
        method: 'POST',
        body: formData,
    });

    if (res.ok) {
        alert('File uploaded successfully!');
        e.target.reset();
        setTitle('');
        setFile(null);
        setBranch('');
        setClassification('');
    } else {
        alert('Upload failed.');
    }
  };

  if (isLoading) return <div style={{padding:'50px', textAlign:'center', fontSize:'1.2rem'}}>Loading Admin Dashboard...</div>;

  return (
    <>
      <Head><title>Admin Dashboard - Produit Academy</title></Head>
      <Header />
      <main className="main-content">
        <div className="container">
          <motion.div className="dashboard-container" variants={slideInUp} initial="hidden" animate="visible">
            
            {/* --- TOP HEADER & ACTIONS --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <h1 className="dashboard-title" style={{margin:0}}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Link href="/admin/students" style={{ 
                        background: '#0070f3', color: 'white', padding: '12px 20px', 
                        borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        👥 Existing Students
                    </Link>
                    
                    <Link href="/admin/create-quiz" style={{ 
                        backgroundColor: '#28a745', color: 'white', padding: '12px 20px', 
                        borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', 
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        + Create Quiz
                    </Link>
                </div>
            </div>

            {/* --- SECTION 1: MANAGE QUIZZES --- */}
            <div className="dashboard-section">
                <h2 className="section-title">Manage Quizzes</h2>
                {quizzes.length > 0 ? (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {quizzes.map(quiz => (
                            <div key={quiz.id} style={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '15px', background: 'white', border: '1px solid #ddd', borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div>
                                    <h3 style={{margin: '0 0 5px 0', fontSize: '1.1rem', color:'#333'}}>{quiz.title}</h3>
                                    <span style={{fontSize: '0.9rem', color: '#666'}}>
                                        ID: {quiz.id} • Duration: {quiz.duration_minutes}m • Marks: {quiz.total_marks}
                                    </span>
                                </div>
                                <div style={{display:'flex', gap:'10px'}}>
                                    <Link href={`/admin/edit-quiz/${quiz.id}`} style={{
                                        background:'#ffc107', color: '#333', border:'none', padding:'8px 12px', 
                                        borderRadius:'4px', cursor:'pointer', textDecoration:'none', fontWeight:'bold', fontSize:'0.9rem'
                                    }}>
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteQuiz(quiz.id)}
                                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight:'bold' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{color:'#666', fontStyle:'italic'}}>No quizzes created yet. Click "Create Quiz" to add one.</p>
                )}
            </div>

            {/* --- SECTION 2: RECENT STUDENT ACTIVITY --- */}
            <div className="dashboard-section">
                <h2 className="section-title">Recent Student Submissions</h2>
                {submissions.length > 0 ? (
                    <div style={{ overflowX: 'auto', border:'1px solid #ddd', borderRadius:'8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Student</th>
                                    <th style={{ padding: '12px' }}>Quiz Title</th>
                                    <th style={{ padding: '12px' }}>Score</th>
                                    <th style={{ padding: '12px' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.slice(0, 5).map(sub => (
                                    <tr key={sub.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>
                                            {/* Handle possible missing user data safely */}
                                            {students.find(s => s.id === sub.student)?.username || `Student #${sub.student}`}
                                        </td>
                                        <td style={{ padding: '12px' }}>{sub.quiz.title}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#007bff' }}>
                                            {sub.score} / {sub.quiz.total_marks}
                                        </td>
                                        <td style={{ padding: '12px', color:'#666' }}>
                                            {new Date(sub.submitted_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {submissions.length > 5 && (
                            <div style={{padding:'10px', textAlign:'center', background:'#f8f9fa'}}>
                                <Link href="/admin/students" style={{color:'#0070f3', fontWeight:'bold'}}>View all in Student Directory</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <p style={{color:'#666'}}>No recent exam submissions.</p>
                )}
            </div>

            {/* --- SECTION 3: PENDING REQUESTS --- */}
            <div className="dashboard-section">
              <h2 className="section-title">Pending Course Requests</h2>
              {requests.length > 0 ? requests.map(req => (
                  <div key={req.id} className="request-item">
                    <span>
                        <strong>{req.student.username}</strong> ({req.student.student_id}) 
                        <span style={{color:'#666'}}> wants to join </span> 
                        <strong style={{color:'#0070f3'}}>{req.branch.name}</strong>
                    </span>
                    <div className="request-actions">
                      <button className="btn btn-approve" onClick={() => handleRequestUpdate(req.id, 'Approved')}>Approve</button>
                      <button className="btn btn-reject" onClick={() => handleRequestUpdate(req.id, 'Rejected')}>Reject</button>
                    </div>
                  </div>
                )) : <p style={{color:'#666'}}>No pending requests.</p>}
            </div>

            {/* --- SECTION 4: UPLOAD MATERIALS --- */}
            <div className="dashboard-section">
              <h2 className="section-title">Upload Study Materials</h2>
              <form className="upload-form" onSubmit={handleUpload}>
                <input type="text" placeholder="Material Title (e.g. Thermodynamics Notes)" required onChange={(e) => setTitle(e.target.value)} />
                
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <select required onChange={(e) => setBranch(e.target.value)}>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <select required onChange={(e) => setClassification(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="PYQ">PYQ</option>
                    <option value="Notes">Notes</option>
                    <option value="One-shots">One-Shots</option>
                    </select>
                </div>

                <input type="file" required onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit" className="cta-btn">Upload Material</button>
              </form>
            </div>

          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}