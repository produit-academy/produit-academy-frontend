import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiFetch from '@/utils/api';
import styles from '@/styles/QuestionBank.module.css';

export default function QuestionForm({ initialData = null, onSubmit, title = "Question" }) {
    const router = useRouter();
    const categories = ['General Aptitude', 'Engineering Mathematics', 'Subject Paper'];
    const [branches, setBranches] = useState([]);

    // Form State
    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const [marks, setMarks] = useState(1);
    const [category, setCategory] = useState('');
    const [branch, setBranch] = useState('');
    const [choices, setChoices] = useState([
        { text: '', is_correct: false, image: '' },
        { text: '', is_correct: false, image: '' },
        { text: '', is_correct: false, image: '' },
        { text: '', is_correct: false, image: '' }
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiFetch('/api/branches/').then(res => res.json()).then(data => setBranches(data));

        if (initialData) {
            setText(initialData.text || '');
            setImage(initialData.image || '');
            setMarks(initialData.marks || 1);
            setCategory(initialData.category || '');
            setBranch(initialData.branch || '');
            if (initialData.choices && initialData.choices.length > 0) {
                // Ensure we have at least 4 slots if needed, or just use what's there
                // The backend likely returns exactly what was saved.
                // We'll trust the backend data but ensure structure.
                setChoices(initialData.choices);
            }
        }
    }, [initialData]);

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const handlePaste = async (e, type, index = null) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                const base64 = await convertBase64(file);

                if (type === 'question') {
                    setImage(base64);
                } else if (type === 'choice') {
                    const newChoices = [...choices];
                    newChoices[index].image = base64;
                    setChoices(newChoices);
                }
                return;
            }
        }
    };

    const handleChoiceChange = (index, field, value) => {
        const newChoices = [...choices];
        if (field === 'is_correct') {
            newChoices.forEach(c => c.is_correct = false);
            newChoices[index].is_correct = true;
        } else {
            newChoices[index][field] = value;
        }
        setChoices(newChoices);
    };

    const validate = () => {
        if (!text && !image) return "Please provide either question text or an image.";
        if (!choices.some(c => c.is_correct)) return "Please mark one option as correct.";

        for (let i = 0; i < choices.length; i++) {
            if (!choices[i].text && !choices[i].image) {
                return `Option ${i + 1} needs either text or an image.`;
            }
        }

        if (category !== 'General Aptitude' && !branch) return "Please select a branch for this subject.";

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            window.scrollTo(0, 0);
            return;
        }

        setLoading(true);

        const payload = {
            text,
            image,
            marks: parseInt(marks),
            category,
            branch: category === 'General Aptitude' ? null : branch,
            choices
        };

        try {
            await onSubmit(payload);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleGroup}>
                    <button onClick={() => router.push('/admin/questions')} className={styles.backBtn}>
                        ← Back
                    </button>
                    <h1 className={styles.pageTitle}>{title}</h1>
                </div>
            </header>

            <div className={styles.formCard}>
                {error && <div className={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Question Text & Image */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Question Text {image && <span style={{ color: '#28a745', fontSize: '0.85rem', marginLeft: '8px' }}>(Image Attached)</span>}
                        </label>
                        <p className={styles.helperText}>Paste text or image directly (Ctrl+V)</p>
                        <textarea
                            className={styles.textarea}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onPaste={(e) => handlePaste(e, 'question')}
                            rows={4}
                            placeholder="Type question text or Paste image here..."
                        />
                        {image && (
                            <div className={styles.imagePreview}>
                                <img src={image} alt="Preview" className={styles.previewImg} />
                                <button type="button" onClick={() => setImage('')} className={styles.removeBtn}>
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Metadata Row */}
                    <div className={`${styles.grid3} ${styles.formGroup}`}>
                        <div>
                            <label className={styles.label}>Category</label>
                            <select
                                className={styles.select}
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                required
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className={styles.label} style={{ opacity: category === 'General Aptitude' ? 0.5 : 1 }}>Branch</label>
                            <select
                                className={styles.select}
                                value={branch}
                                onChange={e => setBranch(e.target.value)}
                                disabled={category === 'General Aptitude'}
                                required={category !== 'General Aptitude'}
                            >
                                <option value="">-- Select Branch --</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className={styles.label}>Marks</label>
                            <input
                                className={styles.input}
                                type="number"
                                value={marks}
                                onChange={e => setMarks(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className={styles.formGroup}>
                        <h3 className={styles.label} style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Options (Select the correct one)</h3>
                        <div className={styles.optionsSection}>
                            {choices.map((choice, index) => (
                                <div key={index} className={styles.optionRow}>
                                    <input
                                        type="radio"
                                        name="correctOption"
                                        checked={choice.is_correct}
                                        onChange={() => handleChoiceChange(index, 'is_correct', true)}
                                        className={styles.radio}
                                    />
                                    <div className={styles.optionInputGroup}>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder={`Option ${index + 1} (Paste image here)`}
                                            value={choice.text}
                                            onChange={e => handleChoiceChange(index, 'text', e.target.value)}
                                            onPaste={e => handlePaste(e, 'choice', index)}
                                        />
                                        {choice.image && (
                                            <div className={styles.imagePreview} style={{ marginTop: '8px', padding: '8px' }}>
                                                <img src={choice.image} alt="Option Img" style={{ maxHeight: '80px' }} />
                                                <button type="button" onClick={() => {
                                                    const newChoices = [...choices];
                                                    newChoices[index].image = '';
                                                    setChoices(newChoices);
                                                }} className={styles.removeBtn}>Remove</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Question'}
                    </button>
                </form>
            </div>
        </div>
    );
}
