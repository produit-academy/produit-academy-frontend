import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MaterialViewer() {
    const router = useRouter();
    const { id } = router.query;

    const materialUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}/view/`;
    const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(materialUrl)}&embedded=true`;

    return (
        <>
            <Head><title>View Material - Produit Academy</title></Head>
            <Header />
            <main className="main-content">
                <div className="container" style={{ paddingTop: '5rem' }}>
                    <h1 style={{ marginBottom: '2rem' }}>Study Material Viewer</h1>
                    <div style={{ position: 'relative', width: '100%', height: '80vh', border: '1px solid #ccc' }}>
                        {id ? (
                            <iframe src={googleDocsUrl} style={{ width: '100%', height: '100%'}} title="PDF Viewer" />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}