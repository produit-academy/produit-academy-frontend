import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimatedNumber from '../components/AnimatedNumber';
import Carousel from '../components/Carousel';
import { SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Data: cards shown in the courses carousel
const coursesData = [
  { title: "GATE for Electrical Engineering", description: "Comprehensive coverage of all core subjects, from circuits to power systems." },
  { title: "GATE for Mechanical Engineering", description: "Master thermodynamics, fluid mechanics, and machine design with expert guidance." },
  { title: "GATE for Civil Engineering", description: "Build a strong foundation in structural analysis, geotechnical, and environmental engineering." },
  { title: "GATE for Computer Science", description: "Deep dive into algorithms, data structures, and computer networks to ace the exam." },
  { title: "GATE for Electronics & Comm.", description: "Explore digital circuits, communication systems, and advanced electronics." },
];

// Animation variants used across sections
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
      rotate: { repeat: Infinity, duration: 8, ease: 'linear' },
    },
  },
};

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', course: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult({ type: '', message: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSubmitResult({ type: 'success', message: 'Message sent successfully. We will get back to you shortly.' });
      setFormData({ name: '', email: '', phone: '', course: '', message: '' });
    } catch (err) {
      setSubmitResult({ type: 'error', message: 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Produit Academy - GATE Coaching</title>
        <meta name="description" content="Professional educational platform for GATE coaching." />
        <link rel="icon" href="/logo.ico" />
      </Head>

      {/* Background, header, and main content */}
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
              Unlock Your Potential with <span className="highlight"><br />Produit Academy</span>
            </motion.h1>
            <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              A premier educational platform for excelling in GATE. Access expert-led classes, comprehensive materials, and track your progress seamlessly.
            </motion.p>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <a href="#courses" className="cta-btn">Explore Courses</a>
            </motion.div>
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

        {/* Animated logo highlight section */}
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

        {/* Features */}
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

          {/* Courses */}
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

        {/* CTA */}
        <motion.section className="cta-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
          <div className="container">
            <h2>Ready to Start Your GATE Preparation?</h2>
            <p>Join thousands of students who trust Produit Academy to achieve their dreams.</p>
            <Link href="/signup" className="cta-btn">Enroll Now</Link>
          </div>
        </motion.section>

        {/* Contact */}
        <div className="container">
          <section id="contact" className="section">
            <motion.div
              variants={slideInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="section-title">Contact Us</h2>
              <p className="section-subtitle">We are here to help you. Feel free to contact us.</p>
            </motion.div>

            <motion.div
              className="contact-container"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Mobile Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., 9876543210" required />
                </div>
                <div className="form-group">
                  <label htmlFor="course">Course</label>
                  <select id="course" name="course" value={formData.course} onChange={handleChange} required>
                    <option value="">Select a course</option>
                    <option value="GATE EE">GATE Electrical</option>
                    <option value="GATE ME">GATE Mechanical</option>
                    <option value="GATE CE">GATE Civil</option>
                    <option value="GATE CS">GATE Computer Science</option>
                    <option value="GATE ECE">GATE Electronics & Comm.</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="cta-btn" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send Message'}</button>
                {submitResult.message && (
                  <p style={{ marginTop: '0.75rem', color: submitResult.type === 'success' ? 'green' : 'crimson' }}>
                    {submitResult.message}
                  </p>
                )}
              </form>

              <div className="contact-info">
                <div className="contact-info-image">
                  <Image src="/logo.png" alt="Contact" width={125} height={125} />
                </div>
                <div className="contact-info-item">
                  <h3>Address</h3>
                  <p>Produit Academy, Kollam, Kerala</p>
                </div>
                <div className="contact-info-item">
                  <h4>Email</h4>
                  <p><a href="mailto:produitacademy@gmail.com">produitacademy@gmail.com</a></p>
                </div>
                <div className="contact-info-item">
                  <h4>Phone</h4>
                  <p><a href="tel:9876543210">9876543210</a></p>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}