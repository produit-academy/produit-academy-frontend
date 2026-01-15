import Head from 'next/head';
import Header from '../components/Header';

export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <title>Privacy Policy - Produit Academy</title>
                <meta name="description" content="Privacy Policy of Produit Academy." />
            </Head>
            <Header />
            <main className="main-content">
                <div className="container">
                    <section style={{ padding: '60px 0', minHeight: '60vh' }}>
                        <h1 style={{ marginBottom: '30px', fontSize: '2.5rem', color: 'var(--accent-green)' }}>Privacy Policy</h1>
                        <div className="glass-card" style={{ padding: '40px' }}>
                            <p style={{ marginBottom: '20px' }}>Last updated: Jan 2024</p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>1. Introduction</h3>
                            <p style={{ marginBottom: '15px' }}>
                                Produit Academy respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                            </p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>2. Data We Collect</h3>
                            <p style={{ marginBottom: '15px' }}>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows: Identity Data, Contact Data, Technical Data, and Usage Data.
                            </p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>3. How We Use Your Data</h3>
                            <p style={{ marginBottom: '15px' }}>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                <ul>
                                    <li>To register you as a new customer.</li>
                                    <li>To manage our relationship with you.</li>
                                    <li>To improve our website, products/services, marketing or customer relationships.</li>
                                </ul>
                            </p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>4. Data Security</h3>
                            <p style={{ marginBottom: '15px' }}>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                            </p>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>5. Contact Us</h3>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:produitacademy@gmail.com">produitacademy@gmail.com</a>
                            </p>
                        </div>
                    </section>
                </div>
            </main>

        </>
    );
}
