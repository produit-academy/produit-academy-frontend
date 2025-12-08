import React from "react";
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function WorkInProgress() {
  const router = useRouter();

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f8fa', color: '#f7f8fa', fontFamily: 'sans-serif' }}>

      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '20px' }}>
        <Image
          src="/work-in-progress.png"
          alt="Work in Progress"
          width={500}
          height={400}
          style={{ maxWidth: '100%', height: 'auto', marginBottom: '30px' }}
        />

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#33ae78' }}>Under Construction</h1>
        <p style={{ fontSize: '1.2rem', color: '#228B22', marginBottom: '2rem' }}>
          We&apos;re working hard to improve this page. Please check back later!
        </p>

        <button
          onClick={() => router.back()}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            backgroundColor: '#33ae78',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#003820ff'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#33ae78'}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}