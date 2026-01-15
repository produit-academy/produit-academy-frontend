import Head from 'next/head';
import Header from '../components/Header';


export default function HelpCenter() {
    return (
        <>
            <Head>
                <title>Help Center - Produit Academy</title>
                <meta name="description" content="Get help and support for Produit Academy." />
            </Head>
            <Header />
            <main className="main-content">
                <div className="container">
                    <section style={{ padding: '60px 0', minHeight: '60vh' }}>
                        <h1 style={{ marginBottom: '20px', fontSize: '2.5rem', color: 'var(--accent-green)' }}>Help Center</h1>
                        <p style={{ marginBottom: '30px', fontSize: '1.2rem' }}>
                            Welcome to the Produit Academy Help Center. How can we assist you today?
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '15px' }}>Account & Login</h3>
                                <p>Issues with signing up, logging in, or resetting your password.</p>
                            </div>
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '15px' }}>Test Series & Content</h3>
                                <p>Questions about accessing test series, study materials, and mock tests.</p>
                            </div>
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '15px' }}>Technical Support</h3>
                                <p>Report bugs, performance issues, or feature requests.</p>
                            </div>
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '15px' }}>Contact Support</h3>
                                <p>Still need help? Reach out to us at <a href="mailto:produitacademy@gmail.com">produitacademy@gmail.com</a></p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

        </>
    );
}
