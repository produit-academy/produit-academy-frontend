import { useRouter } from 'next/router';
import apiFetch from '@/utils/api';
import QuestionForm from '@/components/QuestionForm';

export default function CreateQuestion() {
    const router = useRouter();

    const handleSubmit = async (payload) => {
        const res = await apiFetch('/api/admin/questions/', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            router.push('/admin/questions');
        } else {
            const data = await res.json();
            throw new Error(JSON.stringify(data));
        }
    };

    return <QuestionForm onSubmit={handleSubmit} title="Add New Question" />;
}