import Head from 'next/head';
import Header from '../components/Header';

export default function TermsAndConditions() {
    return (
        <>
            <Head>
                <title>Terms & Conditions - Produit Academy</title>
                <meta name="description" content="Terms and Conditions for using Produit Academy." />
            </Head>
            <Header />
            <main className="main-content">
                <div className="container">
                    <section style={{ padding: '60px 0', minHeight: '60vh' }}>
                        <h1 style={{ marginBottom: '30px', fontSize: '2.5rem', color: 'var(--accent-green)' }}>Terms & Conditions</h1>
                        <div className="glass-card" style={{ padding: '40px' }}>
                            <p style={{ marginBottom: '20px' }}>Last updated: Jan 2024</p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>1. Agreement to Terms</h3>
                            <p style={{ marginBottom: '15px' }}>
                                By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of the terms, then you may not access the service.
                            </p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>2. Intellectual Property</h3>
                            <p style={{ marginBottom: '15px' }}>
                                The Service and its original content, features, and functionality are and will remain the exclusive property of Produit Academy and its licensors.
                            </p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>3. User Accounts</h3>
                            <p style={{ marginBottom: '15px' }}>
                                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                            </p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>4. Termination</h3>
                            <p style={{ marginBottom: '15px' }}>
                                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            </p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>5. Changes</h3>
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
                            </p>
                        </div>
                    </section>
                </div>
            </main>

        </>
    );
}
