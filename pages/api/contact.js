import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { name, email, phone, course, message } = req.body || {};

  if (!name || !email || !message || !phone || !course) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  // Basic phone sanity: digits only, 7-15 length (adjust as needed)
  const phoneDigits = String(phone).replace(/\D/g, '');
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return res.status(400).json({ ok: false, error: 'Invalid phone number' });
  }

  try {
    // Configure Nodemailer transport via SMTP env vars
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Boolean(process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const ownerEmail = process.env.OWNER_EMAIL || 'produitacademy@gmail.com';
    if (!ownerEmail) {
      return res.status(500).json({ ok: false, error: 'OWNER_EMAIL not configured' });
    }

    const subject = `New enquiry from ${name} • ${course}`;
    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Course:</strong> ${course}</p>
      <p><strong>Message:</strong></p>
      <p>${String(message).replace(/\n/g, '<br/>')}</p>
    `;

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@produit.academy',
      to: ownerEmail,
      replyTo: email,
      subject,
      html,
    });

    return res.status(200).json({ ok: true, message: 'Message sent' });
  } catch (e) {
    console.error('Contact send error:', e);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
}
