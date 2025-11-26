import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiFetch from '@/utils/api';

export default function CreateQuiz() {
    const router = useRouter();
    const [branches, setBranches] = useState([]);
    const [quizData, setQuizData] = useState({
        title: '', branch: '', duration_minutes: 180, total_marks: 100, questions: []
    });

    useEffect(() => {
        apiFetch('/api/branches/').then(r => r.json()).then(setBranches);
        addQuestion(); // Start with 1 empty question
    }, []);

    const addQuestion = () => {
        setQuizData(prev => ({
            ...prev,
            questions: [...prev.questions, { 
                text: '', marks: 1, 
                choices: [{ text: '', is_correct: false }, { text: '', is_correct: false }, { text: '', is_correct: false }, { text: '', is_correct: false }] 
            }]
        }));
    };

    const handleQChange = (index, field, value) => {
        const newQ = [...quizData.questions];
        newQ[index][field] = value;
        setQuizData({ ...quizData, questions: newQ });
    };

    const handleChoiceChange = (qIndex, cIndex, field, value) => {
        const newQ = [...quizData.questions];
        if (field === 'is_correct') {
            // Ensure only one correct answer per question (Radio behavior)
            newQ[qIndex].choices.forEach(c => c.is_correct = false);
        }
        newQ[qIndex].choices[cIndex][field] = value;
        setQuizData({ ...quizData, questions: newQ });
    };

    const handleSubmit = async () => {
        const res = await apiFetch('/api/admin/quizzes/create/', {
            method: 'POST', body: JSON.stringify(quizData)
        });
        if(res.ok) {
            alert('Quiz Created!');
            router.push('/admin/dashboard');
        } else {
            alert('Failed to create quiz');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Create New Quiz</h1>
            
            <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
                <input placeholder="Quiz Title" onChange={e => setQuizData({...quizData, title: e.target.value})} style={{padding: '10px'}} />
                <select onChange={e => setQuizData({...quizData, branch: e.target.value})} style={{padding: '10px'}}>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <input type="number" placeholder="Duration (mins)" value={quizData.duration_minutes} onChange={e => setQuizData({...quizData, duration_minutes: e.target.value})} style={{padding: '10px'}} />
            </div>

            {quizData.questions.map((q, qIdx) => (
                <div key={qIdx} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
                    <h3>Question {qIdx + 1}</h3>
                    <textarea placeholder="Question Text" value={q.text} onChange={e => handleQChange(qIdx, 'text', e.target.value)} style={{width: '100%', marginBottom: '10px'}} />
                    <input type="number" value={q.marks} onChange={e => handleQChange(qIdx, 'marks', e.target.value)} style={{width: '50px'}} /> Marks
                    
                    <div style={{ marginTop: '10px' }}>
                        {q.choices.map((c, cIdx) => (
                            <div key={cIdx} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                                <input type="radio" name={`q${qIdx}`} checked={c.is_correct} onChange={e => handleChoiceChange(qIdx, cIdx, 'is_correct', e.target.checked)} />
                                <input placeholder={`Option ${cIdx + 1}`} value={c.text} onChange={e => handleChoiceChange(qIdx, cIdx, 'text', e.target.value)} style={{flex: 1}} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button onClick={addQuestion} style={{ padding: '10px', marginRight: '10px' }}>+ Add Question</button>
            <button onClick={handleSubmit} style={{ padding: '10px', background: 'blue', color: 'white' }}>Save Quiz</button>
        </div>
    );
}