import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Document, Page, pdfjs } from 'react-pdf';
import apiFetch from '@/utils/api';
import styles from '@/styles/Dashboard.module.css';
import dynamic from 'next/dynamic';

// Configure PDF Worker

const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), {
    ssr: false,
    loading: () => <p>Loading PDF viewer...</p>,
});
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), {
    ssr: false,
});

if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

export default function SecurePdfViewer() {
    const router = useRouter();
    const { id } = router.query;
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [fileUrl, setFileUrl] = useState(null);

    useEffect(() => {
        if (!id) return;
        // Fetch the Signed URL or File URL
        apiFetch(`/api/materials/${id}/view/`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load");
                return res.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                setFileUrl(url);
            })
            .catch(err => console.error("Error loading PDF"));
    }, [id]);

    const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

    // Disable Right Click
    const handleContextMenu = (e) => e.preventDefault();

    return (
        <div className={styles.container} onContextMenu={handleContextMenu}>
            <div className={styles.header}>
                <button onClick={() => router.back()} style={{ padding: '5px 10px', cursor: 'pointer' }}>Back</button>
                <span>Page {pageNumber} of {numPages || '--'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', background: '#555', padding: '20px', minHeight: '80vh', overflow: 'auto' }}>
                {fileUrl && (
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={<div style={{ color: 'white' }}>Failed to load PDF.</div>}
                        loading={<div style={{ color: 'white' }}>Loading...</div>}
                    >
                        <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} height={800} />
                    </Document>
                )}
            </div>

            <div className={styles.controls}>
                <button disabled={pageNumber <= 1} onClick={() => setPageNumber(prev => prev - 1)}>Previous</button>
                <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(prev => prev + 1)}>Next</button>
            </div>
        </div>
    );
}