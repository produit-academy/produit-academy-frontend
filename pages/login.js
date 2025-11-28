import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const slideInUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // API call to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        // 1. Store Tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        const role = data.role === 'admin' ? 'admin' : 'student';
        localStorage.setItem('user_role', role);
        
        // 2. Redirect based on Role (Sent from backend)
        if (data.role === 'admin') {
            window.location.href = '/admin/dashboard';
        } else {
            window.location.href = '/student/dashboard';
        }
      } else {
        console.error('Backend Error:', data); 
        
        // Handle Inactive Account (Redirect to Verify OTP)
        if (data.detail && data.detail.toLowerCase().includes('inactive')) {
            router.push(`/verify-otp?email=${email}`);
        } else {
            // Show specific error or generic message
            setError(data.detail || 'No active account found with the given credentials.');
        }
      }
    } catch (error) { 
        setError('A network or parsing error occurred. Please try again.'); 
        console.error('Fetch Error:', error);
    }
  };

  return (
    <>
      <Head><title>Login - Produit Academy</title></Head>
      <Header />
      <main className="main-content auth-page">
        <div className="container">
          <motion.div className="auth-container" variants={slideInUp} initial="hidden" animate="visible">
            <h1 className="auth-title">Welcome Back!</h1>
            <p className="auth-subtitle">Sign in to continue your GATE preparation journey.</p>
            
            {error && <p className="auth-error">{error}</p>}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Your Email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Your Password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button type="submit" className="cta-btn">Login</button>
            </form>
            
            <div className="auth-switch" style={{display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', alignItems: 'center'}}>
                <Link href="/forgot-password" style={{color: 'var(--accent-green)'}}>
                    Forgot Password?
                </Link>
                <span style={{textAlign: 'right'}}>
                    Don&apos;t have an account? <br />
                    <Link href="/signup" style={{color: 'var(--accent-green)'}}>Sign Up</Link>
                </span>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}