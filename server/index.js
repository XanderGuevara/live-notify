require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToWhatsApp, getStatus, sendMessage } = require('./whatsapp');
const { initGoogleAuth, getAuthUrl, handleCallback } = require('./googleAuth');

const app = express();

// Configurar CORS dinámico (Para permitir localhost en dev, y el dominio de GitHub Pages en prod)
const frontendUrl = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: frontendUrl }));
app.use(express.json());

// Inicializar Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    initGoogleAuth(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
    );
}

// Iniciar WhatsApp al arrancar el servidor
connectToWhatsApp();

app.get('/api/status', (req, res) => {
    res.json({
        server: 'online',
        version: '3.0.0',
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

// Endpoint que devuelve la URL real de autenticación
app.get('/api/auth/google', (req, res) => {
    try {
        const url = getAuthUrl();
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: 'OAuth no configurado (Faltan variables en .env)' });
    }
});

// Endpoint de callback (Google redirige aquí después del login)
app.get('/api/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('No authorization code provided');
    }

    try {
        await handleCallback(code);
        // Redirigir de vuelta al panel de control (Settings)
        res.redirect(`${frontendUrl}/settings?auth=success`);
    } catch (error) {
        console.error('Error in OAuth callback:', error);
        res.status(500).send('Authentication failed');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
