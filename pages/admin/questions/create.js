import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAllCategories, createQuestion } from '../../../utils/api';

export default function CreateQuestion() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);

    // Form State
    const [text, setText] = useState('');
    const [marks, setMarks] = useState(1);
    const [categoryId, setCategoryId] = useState('');
    const [choices, setChoices] = useState([
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false }
    ]);

    useEffect(() => {
        fetchAllCategories().then(res => setCategories(res.data));
    }, []);

    const handleChoiceChange = (index, field, value) => {
        const newChoices = [...choices];
        if (field === 'is_correct') {
            // Ensure only one is correct (Radio button behavior manually)
            newChoices.forEach(c => c.is_correct = false);
            newChoices[index].is_correct = true;
        } else {
            newChoices[index].text = value;
        }
        setChoices(newChoices);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!choices.some(c => c.is_correct)) {
            alert("Please mark one option as correct.");
            return;
        }

        const payload = {
            text,
            marks,
            category: categoryId || null,
            choices
        };

        try {
            await createQuestion(payload);
            router.push('/admin/questions');
        } catch (err) {
            alert("Failed to create question");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '40px auto' }}>
            <h1>Add New Question</h1>
            <div className="card" style={{ padding: '30px', border: '1px solid #ddd' }}>
                <form onSubmit={handleSubmit}>

                    {/* Question Text */}
                    <div style={{ marginBottom: '20px' }}>
                        <label>Question Text</label>
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            required
                            rows={4}
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        />
                    </div>

                    {/* Metadata Row */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Category</label>
                            <select
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Marks</label>
                            <input
                                type="number"
                                value={marks}
                                onChange={e => setMarks(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <h3>Options (Select the correct one)</h3>
                    <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
                        {choices.map((choice, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={choice.is_correct}
                                    onChange={() => handleChoiceChange(index, 'is_correct', true)}
                                    style={{ width: '20px', height: '20px', marginRight: '10px' }}
                                />
                                <input
                                    type="text"
                                    placeholder={`Option ${index + 1}`}
                                    value={choice.text}
                                    onChange={e => handleChoiceChange(index, 'text', e.target.value)}
                                    required
                                    style={{ flex: 1, padding: '8px' }}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '20px',
                            width: '100%',
                            padding: '15px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Save Question
                    </button>
                </form>
            </div>
        </div>
    );
}