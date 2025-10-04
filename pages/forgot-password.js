import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/password-reset-otp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                // Redirect to the new reset page with the email
                router.push(`/reset-password?email=${email}`);
            } else {
                setError('No account found with that email address.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <Head><title>Forgot Password - Produit Academy</title></Head>
            <Header />
            <main className="main-content auth-page">
                <div className="auth-container">
                    <h1 className="auth-title">Forgot Password</h1>
                    <p className="auth-subtitle">Enter your email to receive a password reset OTP.</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input type="email" placeholder="Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button type="submit" className="cta-btn">Send Reset OTP</button>
                        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
                        {error && <p className="auth-error">{error}</p>}
                    </form>
                    <p className="auth-switch">
                        Remember your password? <Link href="/login">Login</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}