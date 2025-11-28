import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Document, Page, pdfjs } from 'react-pdf';
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
            </div>
        </div>
    );
}