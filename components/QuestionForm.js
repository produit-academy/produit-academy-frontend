import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiFetch from '@/utils/api';
import styles from '@/styles/QuestionBank.module.css';

export default function QuestionForm({ initialData = null, onSubmit, title = "Question" }) {
    const router = useRouter();
    const categories = ['General Aptitude', 'Engineering Mathematics', 'Subject Paper'];
    const questionTypes = [
        { id: 'MCQ', label: 'Multiple Choice (MCQ)' },
        { id: 'MSQ', label: 'Multiple Select (MSQ)' },
        { id: 'NAT', label: 'Numerical Answer (NAT)' }
    ];
    const [branches, setBranches] = useState([]);

    // Form State
    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const [marks, setMarks] = useState(1);
    const [category, setCategory] = useState('');
    const [branch, setBranch] = useState('');
    const [questionType, setQuestionType] = useState('MCQ');

    // NAT Fields
    const [natMin, setNatMin] = useState('');
    const [natMax, setNatMax] = useState('');

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
            setQuestionType(initialData.question_type || 'MCQ');

            if (initialData.question_type === 'NAT') {
                setNatMin(initialData.nat_min ?? '');
                setNatMax(initialData.nat_max ?? '');
            } else if (initialData.choices && initialData.choices.length > 0) {
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
            if (questionType === 'MCQ') {
                newChoices.forEach(c => c.is_correct = false);
                newChoices[index].is_correct = true;
            } else if (questionType === 'MSQ') {
                newChoices[index].is_correct = !newChoices[index].is_correct;
            }
        } else {
            newChoices[index][field] = value;
        }
        setChoices(newChoices);
    };

    const validate = () => {
        if (!text && !image) return "Please provide either question text or an image.";

        if (questionType === 'NAT') {
            if (natMin === '' || natMax === '') return "Please provide both Min and Max values for the answer range.";
            if (parseFloat(natMin) > parseFloat(natMax)) return "Min value cannot be greater than Max value.";
        } else {
            // MCQ and MSQ
            if (!choices.some(c => c.is_correct)) return "Please mark at least one option as correct.";
            if (questionType === 'MCQ' && choices.filter(c => c.is_correct).length > 1) return "MCQ can only have one correct answer.";

            for (let i = 0; i < choices.length; i++) {
                if (!choices[i].text && !choices[i].image) {
                    return `Option ${i + 1} needs either text or an image.`;
                }
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
            question_type: questionType,
            choices: questionType === 'NAT' ? [] : choices,
            nat_min: questionType === 'NAT' ? parseFloat(natMin) : null,
            nat_max: questionType === 'NAT' ? parseFloat(natMax) : null,
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

                    <div className={`${styles.grid3} ${styles.formGroup}`}>
                        <div>
                            <label className={styles.label}>Question Type</label>
                            <select
                                className={styles.select}
                                value={questionType}
                                onChange={e => {
                                    setQuestionType(e.target.value);
                                    if (e.target.value === 'MCQ') {
                                        const newChoices = [...choices];
                                        newChoices.forEach(c => c.is_correct = false);
                                        setChoices(newChoices);
                                    }
                                }}
                                required
                            >
                                {questionTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                        </div>

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
                    </div>

                    <div className={styles.formGroup} style={{ maxWidth: '200px' }}>
                        <label className={styles.label}>Marks</label>
                        <input
                            className={styles.input}
                            type="number"
                            value={marks}
                            onChange={e => setMarks(e.target.value)}
                        />
                    </div>

                    <hr className={styles.divider} style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

                    {questionType === 'NAT' ? (
                        <div className={styles.formGroup}>
                            <h3 className={styles.label} style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Correct Answer Range</h3>
                            <p className={styles.helperText}>Enter the acceptable range for the numerical answer.</p>
                            <div className={styles.grid2} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label className={styles.label}>Minimum Value</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className={styles.input}
                                        value={natMin}
                                        onChange={e => setNatMin(e.target.value)}
                                        placeholder="e.g. 10.5"
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>Maximum Value</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className={styles.input}
                                        value={natMax}
                                        onChange={e => setNatMax(e.target.value)}
                                        placeholder="e.g. 10.6"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.formGroup}>
                            <h3 className={styles.label} style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
                                Options
                                <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
                                    (Select {questionType === 'MCQ' ? 'one correct option' : 'all correct options'})
                                </span>
                            </h3>
                            <div className={styles.optionsSection}>
                                {choices.map((choice, index) => (
                                    <div key={index} className={styles.optionRow}>
                                        <input
                                            type={questionType === 'MCQ' ? "radio" : "checkbox"}
                                            name={questionType === 'MCQ' ? "correctOption" : `correctOption_${index}`}
                                            checked={choice.is_correct}
                                            onChange={() => handleChoiceChange(index, 'is_correct', true)}
                                            className={styles.radio}
                                            style={{ width: '20px', height: '20px', marginRight: '15px', cursor: 'pointer' }}
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
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                        style={{ marginTop: '20px' }}
                    >
                        {loading ? 'Saving...' : 'Save Question'}
                    </button>
                </form>
            </div>
        </div>
    );
}