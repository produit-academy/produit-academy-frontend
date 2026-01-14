export default function handler(req, res) {
    if (req.method === 'POST') {
        // Process the contact form submission
        const { name, email, phone, course, message } = req.body;

        // Log the submission (for now) or integrate with an email service/backend
        console.log('Contact form submission:', { name, email, phone, course, message });

        // Simulate a successful response
        res.status(200).json({ message: 'Success' });
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
