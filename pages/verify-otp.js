import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';


export default function VerifyOTP() {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (router.query.email) {
            setEmail(router.query.email);
        }
    }, [router.query.email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Account verified successfully! Redirecting to login...');
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setError(data.detail || 'Failed to verify OTP.');
            }
        } catch (err) { setError('An error occurred.'); }
    };

    const handleResend = async () => {
        setMessage(''); setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resend-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.detail || 'A new OTP has been sent.');
            } else {
                setError(data.detail || 'Failed to resend OTP.');
            }
        } catch (err) { setError('An error occurred while resending.'); }
    };

    return (
        <>
            <Head><title>Verify OTP - Produit Academy</title></Head>
            <Header />
            <main className="main-content auth-page">
                <div className="auth-container">
                    <h1 className="auth-title">Verify Your Account</h1>
                    <p className="auth-subtitle">An OTP has been sent to {email}. Please enter it below.</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Enter 6-Digit OTP" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <button type="submit" className="cta-btn">Verify Account</button>
                        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
                        {error && <p className="auth-error">{error}</p>}
                    </form>
                    <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', marginTop: '1rem' }}>
                        Resend OTP
                    </button>
                </div>
            </main>

        </>
    );
}   