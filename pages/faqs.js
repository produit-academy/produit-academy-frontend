import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FAQs() {
    return (
        <>
            <Head>
                <title>FAQs - Produit Academy</title>
                <meta name="description" content="Frequently Asked Questions about Produit Academy." />
            </Head>
            <Header />
            <main className="main-content">
                <div className="container">
                    <section style={{ padding: '60px 0', minHeight: '60vh' }}>
                        <h1 style={{ marginBottom: '40px', fontSize: '2.5rem', color: 'var(--accent-green)' }}>Frequently Asked Questions</h1>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '10px' }}>What test series do you offer?</h3>
                                <p>We specialize in GATE mock test series for Electrical, Mechanical, Civil, Computer Science, and Electronics & Communication Engineering.</p>
                            </div>

                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '10px' }}>What are Custom Mock Tests?</h3>
                                <p>Our platform allows you to create your own tests by selecting the number of questions, time limit, and question types to practice at your own pace.</p>
                            </div>

                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '10px' }}>Is the content free?</h3>
                                <p>Our comprehensive Custom Mock Test platform is available for a one-time fee of just <strong>₹29</strong>.</p>
                            </div>

                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '10px' }}>How can I access the mock tests?</h3>
                                <p>To get access, please <strong>Contact Produit Academy</strong>. Once enrolled, you can access the test builder from your dashboard.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
