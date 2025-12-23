import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ExamInstructions() {
    const router = useRouter();
    const { id } = router.query;
    const [isChecked, setIsChecked] = useState(false);
    const [testData, setTestData] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('currentTestSession');
        if (stored) setTestData(JSON.parse(stored));
    }, []);

    const startExam = () => {
        if (isChecked && id) {
            router.push(`/student/test/${id}/attempt`);
        }
    };

    if (!testData) return <LoadingSpinner />;

    return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '10px' }}>General Instructions</h1>

            <div style={{ marginTop: '20px', lineHeight: '1.6' }}>
                <p><strong>Total Duration:</strong> {testData.time_limit_minutes} min</p>
                <p><strong>Total Questions:</strong> {testData.total_questions}</p>

                <h3>1. General Instructions:</h3>
                <ol>
                    <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination.</li>
                    <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</li>
                </ol>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '15px', margin: '20px 0', border: '1px solid #ccc', padding: '15px' }}>
                    <div style={styles.colorBox('white')}>1</div> <div>You have not visited the question yet.</div>
                    <div style={styles.colorBox('#d9534f', 'white')}>3</div> <div>You have not answered the question.</div>
                    <div style={styles.colorBox('#5cb85c', 'white')}>5</div> <div>You have answered the question.</div>
                    <div style={styles.colorBox('#6f42c1', 'white')}>7</div> <div>You have NOT answered the question, but have marked the question for review.</div>
                    <div style={styles.colorBox('#6f42c1', 'white', true)}>9</div> <div>The question(s) &quot;Answered and Marked for Review&quot; will be considered for evaluation.</div>
                </div>

                <h3>2. Navigating to a Question:</h3>
                <ol>
                    <li>Click on the question number in the Question Palette to go to that numbered question directly.</li>
                    <li>Click on <strong>Save & Next</strong> to save your answer for the current question and then go to the next question.</li>
                    <li>Click on <strong>Mark for Review & Next</strong> to save your answer for the current question, mark it for review, and then go to the next question.</li>
                </ol>

                <div style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '18px' }}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            style={{ width: '20px', height: '20px', marginRight: '10px' }}
                        />
                        I have read and understood the instructions. I agree that I am not carrying any prohibited gadgets like mobile phones etc.
                    </label>
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button
                        onClick={startExam}
                        disabled={!isChecked}
                        style={{
                            padding: '15px 40px',
                            fontSize: '18px',
                            backgroundColor: isChecked ? '#0070f3' : '#ccc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isChecked ? 'pointer' : 'not-allowed'
                        }}
                    >
                        I am ready to begin
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    colorBox: (bg, color = 'black', hasDot = false) => ({
        width: '40px', height: '40px',
        backgroundColor: bg,
        color: color,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        border: '1px solid #ccc', fontWeight: 'bold',
        position: 'relative',
        borderRadius: '5px'
    })
};