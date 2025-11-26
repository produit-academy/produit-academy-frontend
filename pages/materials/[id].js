import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Document, Page, pdfjs } from 'react-pdf';
import apiFetch from '@/utils/api';
import styles from '@/styles/Dashboard.module.css';

// Configure PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function SecurePdfViewer() {
    const router = useRouter();
    const { id } = router.query;
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [fileUrl, setFileUrl] = useState(null);

    useEffect(() => {
        if(!id) return;
        // Fetch the Signed URL or File URL
        apiFetch(`/api/materials/${id}/view/`)
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                setFileUrl(url);
            })
            .catch(err => alert("Error loading PDF"));
    }, [id]);

    const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

    // Disable Right Click
    const handleContextMenu = (e) => e.preventDefault();

    return (
        <div className={styles.container} onContextMenu={handleContextMenu}>
            <div className={styles.header}>
                <button onClick={() => router.back()}>Back</button>
                <span>Page {pageNumber} of {numPages}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', background: '#555', padding: '20px', minHeight: '100vh' }}>
                {fileUrl && (
                    <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
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