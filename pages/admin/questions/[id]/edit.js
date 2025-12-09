import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiFetch from '@/utils/api';
import QuestionForm from '@/components/QuestionForm';

export default function EditQuestion() {
    const router = useRouter();
    const { id } = router.query;
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            apiFetch(`/api/admin/questions/${id}/`)
                .then(res => res.json())
                .then(data => {
                    setQuestion(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load question", err);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleSubmit = async (payload) => {
        const res = await apiFetch(`/api/admin/questions/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            router.push('/admin/questions');
        } else {
            const data = await res.json();
            throw new Error(JSON.stringify(data));
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    if (!question) return <div style={{ padding: '40px', textAlign: 'center' }}>Question not found.</div>;

    return <QuestionForm initialData={question} onSubmit={handleSubmit} title="Edit Question" />;
}
