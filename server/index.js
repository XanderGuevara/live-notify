const express = require('express');
const cors = require('cors');
const { connectToWhatsApp, getStatus, sendMessage } = require('./whatsapp');

const app = express();
app.use(cors());
app.use(express.json());

// Iniciar WhatsApp al arrancar el servidor
connectToWhatsApp();

app.get('/api/status', (req, res) => {
    res.json({
        server: 'online',
        version: '2.0.0',
        whatsapp: getStatus()
    });
});

app.post('/api/whatsapp/send', async (req, res) => {
    try {
        const { to, message } = req.body;
        await sendMessage(to, message);
        res.json({ success: true, message: 'Message sent' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// OAuth Mock
app.get('/api/auth/google', (req, res) => {
    res.json({ url: 'https://accounts.google.com/o/oauth2/v2/auth?mock' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
