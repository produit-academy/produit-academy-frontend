import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimatedNumber from '../components/AnimatedNumber';
import Carousel from '../components/Carousel';
import { SwiperSlide } from 'swiper/react';
import Image from 'next/image';

// --- Data for our carousels ---
const coursesData = [
  { title: "GATE for Electrical Engineering", description: "Comprehensive coverage of all core subjects, from circuits to power systems." },
  { title: "GATE for Mechanical Engineering", description: "Master thermodynamics, fluid mechanics, and machine design with expert guidance." },
  { title: "GATE for Civil Engineering", description: "Build a strong foundation in structural analysis, geotechnical, and environmental engineering." },
  { title: "GATE for Computer Science", description: "Deep dive into algorithms, data structures, and computer networks to ace the exam." },
  { title: "GATE for Electronics & Comm.", description: "Explore digital circuits, communication systems, and advanced electronics." },
];

// --- Animation Variants ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const slideInUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };

const spinLogo = {
  initial: { opacity: 0, scale: 0.5, rotate: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 360,
    transition: {
      opacity: { duration: 0.8 },
      scale: { duration: 0.8 },
      rotate: {
        repeat: Infinity,
        duration: 8,
        ease: "linear",
      },
    },
  },
};


export default function Home() {
  return (
    <>
      <Head>
        <title>Produit Academy - GATE Coaching</title>
        <meta name="description" content="Professional educational platform for GATE coaching." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul className="floating-elements">
        <li>α</li>
        <li>β</li>
        <li>Σ</li>
        <li>π</li>
        <li>∫</li>
        <li>λ</li>
        <li>ω</li>
        <li>μ</li>
        <li>δ</li>
        <li>ε</li>
      </ul>

      <Header />

      <main className="main-content">
        <div className="container">
          <section className="hero">
            <motion.h1 className="hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              Unlock Your Potential with <span className="highlight">Produit Academy</span>
            </motion.h1>
            <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              A premier educational platform for excelling in GATE. Access expert-led classes, comprehensive materials, and track your progress seamlessly.
            </motion.p>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <button className="cta-btn">Explore Courses</button>
            </motion.div>
            
            {/* --- NEW: Kites Container --- */}
            <div className="kites-container">
              <div className="kite">🪁</div>
              <div className="kite">📚</div>
              <div className="kite">🔬</div>
              <div className="kite">💡</div>
            </div>

          </section>
        </div>

        <motion.section className="stats-bar" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
          <div className="container">
            <motion.div variants={itemVariants} className="stat-item">
              <h3><AnimatedNumber value={50} />+</h3>
              <p>Students Enrolled</p>
            </motion.div>
            <motion.div variants={itemVariants} className="stat-item">
              <h3><AnimatedNumber value={10} />+</h3>
              <p>Expert Mentors</p>
            </motion.div>
            <motion.div variants={itemVariants} className="stat-item">
              <h3><AnimatedNumber value={100} />+</h3>
              <p>Hours of Content</p>
            </motion.div>
            <motion.div variants={itemVariants} className="stat-item">
              <h3><AnimatedNumber value={100} />%</h3>
              <p>Success Rate</p>
            </motion.div>
          </div>
        </motion.section>

        <section className="animated-logo-section section">
          <motion.div
            variants={slideInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="section-title">Innovating Education, One Step at a Time</h2>
            <p className="section-subtitle">
              Our commitment to excellence is reflected in everything we do, powered by cutting-edge technology.
            </p>
          </motion.div>
          <motion.div
            className="logo-animation-container"
            variants={spinLogo}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
          >
             <Image
                src="/logo.png"
                alt="Produit Academy Animated Logo"
                width={200}
                height={200}
             />
          </motion.div>
        </section>

        <div className="container">
          <section id="features" className="section">
            <motion.div variants={slideInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <h2 className="section-title">Why Choose Produit Academy?</h2>
              <p className="section-subtitle">We provide a complete ecosystem for GATE preparation, engineered for your success.</p>
            </motion.div>
            
            <motion.div className="features-grid" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                <motion.div variants={itemVariants} className="feature-card">
                    <div className="feature-icon">🧠</div>
                    <h3>AI-Powered Assistance</h3>
                    <p>Get instant, branch-aware academic help from our AI Chatbot whenever you&apos;re stuck on a concept.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="feature-card">
                    <div className="feature-icon">📚</div>
                    <h3>Structured Materials</h3>
                    <p>Access Previous Year Questions (PYQ), detailed notes, and concise short notes, all logically organized.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>In-Depth Analytics</h3>
                    <p>Track your exam scores and view detailed personal progress reports to identify and improve weak topics.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="feature-card">
                    <div className="feature-icon">👨‍🏫</div>
                    <h3>Dedicated Mentorship</h3>
                    <p>Our Premium Plan includes a dedicated mentor who analyzes your progress reports and provides targeted feedback.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="feature-card">
                    <div className="feature-icon">📅</div>
                    <h3>Flexible Learning Plans</h3>
                    <p>Choose between Normal and Premium course types with flexible 6-month or 1-year plan durations to fit your schedule.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="feature-card">
                    <div className="feature-icon">📝</div>
                    <h3>Comprehensive Exams</h3>
                    <p>Our system supports both auto-graded Multiple Choice Questions (MCQs) and manually graded subjective questions for thorough evaluation.</p>
                </motion.div>
            </motion.div>
          </section>
          
          <section id="courses" className="section">
             <motion.div variants={slideInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <h2 className="section-title">Our Premier Courses</h2>
              <p className="section-subtitle">Specialized curriculum designed by experts for each engineering discipline.</p>
            </motion.div>
            <Carousel>
              {coursesData.map((course, index) => (
                <SwiperSlide key={index}>
                  <div className="course-card">
                    <h4>{course.title}</h4>
                    <p>{course.description}</p>
                    <a href="#">Learn More &rarr;</a>
                  </div>
                </SwiperSlide>
              ))}
            </Carousel>
          </section>
        </div>

        <motion.section className="cta-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
          <div className="container">
            <h2>Ready to Start Your GATE Preparation?</h2>
            <p>Join thousands of students who trust Produit Academy to achieve their dreams.</p>
            <button className="cta-btn">Enroll Now</button>
          </div>
        </motion.section>

        <div className="container">
          <section id="contact" className="section">
             <motion.div
              variants={slideInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="section-title">Get In Touch</h2>
              <p className="section-subtitle">Have questions? We&apos;re here to help you on your journey to success.</p>
            </motion.div>
            <motion.form 
              className="contact-form"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea placeholder="Your Message" rows="5" required></textarea>
                <button type="submit" className="cta-btn">Send Message</button>
            </motion.form>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}