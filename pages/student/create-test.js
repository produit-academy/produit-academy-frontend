import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiFetch from '@/utils/api';
import { motion } from 'framer-motion';

export default function CreateTest() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form Config
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [numQuestions, setNumQuestions] = useState(10);
    const [timeLimit, setTimeLimit] = useState(15);
    const [allowRepeats, setAllowRepeats] = useState(true);

    useEffect(() => {
        // Fetch Categories via Admin endpoint (or public/student read-only endpoint if separate)
        const loadCats = async () => {
            try {
                // Assuming we created a public/student readable endpoint or re-using admin for simplicity
                // ideally: /api/categories/ (public)
                // For now using the admin one if permissons allow, OR check api.js for student specific
                const res = await apiFetch('/api/admin/categories/');
                if (res.ok) setCategories(await res.json());
            } catch (e) { console.error(e); }
        }
        loadCats();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            category_ids: selectedCategories.length > 0 ? selectedCategories : null,
            number_of_questions: parseInt(numQuestions),
            time_limit_minutes: parseInt(timeLimit),
            allow_repeats: allowRepeats
        };

        try {
            const res = await apiFetch('/api/student/tests/generate/', {
                method: 'POST',
                body: JSON.stringify(config)
            });

            if (res.ok) {
                const sessionData = await res.json();
                // Save session for quick access in instructions
                localStorage.setItem('currentTestSession', JSON.stringify(sessionData));
                router.push(`/student/test/${sessionData.id}/instructions`);
            } else {
                const err = await res.json();
                alert("Generation Failed: " + (err.error || "Unknown Error"));
            }
        } catch (error) {
            console.error(error);
            alert("Network Error");
        } finally {
            setLoading(false);
        }
    };

    const toggleCat = (id) => {
        if (selectedCategories.includes(id)) setSelectedCategories(prev => prev.filter(c => c !== id));
        else setSelectedCategories(prev => [...prev, id]);
    };

    return (
        <>
            <Head><title>Create Mock Test - Produit Academy</title></Head>
            <Header />
            <main className="main-content">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Configure Your Mock Test</h1>

                        <form onSubmit={handleGenerate}>

                            {/* 1. Category Selection */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Select Topics (Optional)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {categories.map(cat => (
                                        <div key={cat.id}
                                            onClick={() => toggleCat(cat.id)}
                                            style={{
                                                padding: '8px 15px', borderRadius: '20px', cursor: 'pointer',
                                                border: '1px solid #0070f3',
                                                background: selectedCategories.includes(cat.id) ? '#0070f3' : 'white',
                                                color: selectedCategories.includes(cat.id) ? 'white' : '#0070f3',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cat.name}
                                        </div>
                                    ))}
                                    {categories.length === 0 && <span style={{ color: '#888' }}>No categories found. Test will be mixed.</span>}
                                </div>
                            </div>

                            {/* 2. Sliders/Inputs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Questions</label>
                                    <input type="number" min="1" max="50" value={numQuestions} onChange={e => setNumQuestions(e.target.value)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time (Minutes)</label>
                                    <input type="number" min="5" max="180" value={timeLimit} onChange={e => setTimeLimit(e.target.value)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                            </div>

                            {/* 3. Repeats Toggle */}
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={allowRepeats} onChange={e => setAllowRepeats(e.target.checked)} style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                                    <span>Include questions I have already attempted?</span>
                                </label>
                            </div>

                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold',
                                background: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer'
                            }}>
                                {loading ? 'Generating...' : 'Start Test Now'}
                            </button>

                        </form>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}