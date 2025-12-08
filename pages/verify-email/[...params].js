import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function VerifyEmail() {
    const router = useRouter();
    const { params } = router.query;
    const [message, setMessage] = useState('Verifying your email, please wait...');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!params || params.length < 4) {
            setMessage('Invalid verification link.');
            setIsError(true);
            return;
        }

        const [uidb64, token] = params;

        const verify = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-email/${uidb64}/${token}/`);
                if (response.ok) {
                    setMessage('Email successfully verified! You can now log in.');
                    setIsError(false);
                } else {
                    setMessage('This verification link is invalid or has expired.');
                    setIsError(true);
                }
            } catch (err) {
                setMessage('An error occurred during verification.');
                setIsError(true);
            }
        };

        verify();
    }, [params]);

    return (
        <>
            <Head><title>Email Verification - Produit Academy</title></Head>
            <Header />
            <main className="main-content auth-page">
                <div className="auth-container">
                    <h1 className="auth-title">Email Verification</h1>
                    <p style={{ color: isError ? 'red' : 'green', fontSize: '1.2rem', marginTop: '1rem' }}>{message}</p>
                    {!isError && (
                        <Link href="/login" passHref>
                            <button className="cta-btn" style={{ marginTop: '2rem' }}>Go to Login</button>
                        </Link>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}