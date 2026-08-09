process.on('uncaughtException', (err) => {
    console.error('[FATAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('[FATAL] Unhandled Rejection:', reason);
});

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const { connectToWhatsApp, getStatus, sendMessage } = require('./whatsapp');
const { initGoogleAuth, getAuthUrl, handleCallback } = require('./googleAuth');
const { getActiveLiveStream } = require('./youtube');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
function getConfig() {
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return { recipients: '' };
}
function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

let currentLiveStream = null;
let lastNotifiedVideoId = null;

const app = express();

// Configurar CORS dinámico (Para permitir localhost en dev, y el dominio de GitHub Pages en prod)
const frontendUrl = process.env.FRONTEND_URL || '*';
let corsOrigin = '*';
if (frontendUrl !== '*') {
    try {
        corsOrigin = new URL(frontendUrl).origin; // Solo esquema + dominio para CORS
    } catch (e) {
        corsOrigin = frontendUrl;
    }
}
app.use(cors({ origin: corsOrigin }));
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
console.log('[Server] Iniciando conexión a WhatsApp...');
connectToWhatsApp().catch(err => {
    console.error('[Server] Error crítico al iniciar WhatsApp:', err);
});
console.log('[Server] Configuración de servidor completa, esperando peticiones...');

// --- SISTEMA DE DETECCIÓN Y ALERTAS ---
setInterval(async () => {
    console.log('[Poller] Buscando directos activos...');
    const stream = await getActiveLiveStream();
    currentLiveStream = stream; // Guardar en memoria para el Frontend

    if (stream) {
        console.log(`[Poller] ¡Directo detectado! ID: ${stream.id}`);
        // Si es un directo nuevo que no hemos notificado
        if (stream.id !== lastNotifiedVideoId) {
            lastNotifiedVideoId = stream.id;
            
            const config = getConfig();
            if (config.recipients && config.recipients.trim().length > 0) {
                const message = `🔴 ¡ESTAMOS EN VIVO!\n\nHoy hablamos de: ${stream.title}\n👉 ${stream.url}`;
                const numbers = config.recipients.split(',').map(n => n.trim());
                
                for (const number of numbers) {
                    try {
                        console.log(`[Poller] Enviando alerta por WhatsApp a ${number}...`);
                        await sendMessage(number, message);
                    } catch (err) {
                        console.error(`[Poller] Error enviando a ${number}:`, err.message);
                    }
                }
            } else {
                console.log('[Poller] No hay destinatarios configurados para enviar la alerta.');
            }
        }
    } else {
        // console.log('[Poller] No hay directos activos en este momento.');
    }
}, 5 * 60 * 1000); // 5 minutos

app.get('/api/status', (req, res) => {
    res.json({
        server: 'online',
        version: '3.0.0',
        whatsapp: getStatus()
    });
});

app.get('/api/live', (req, res) => {
    res.json({ live: currentLiveStream });
});

app.get('/api/debug/youtube', async (req, res) => {
    try {
        const { getOauth2Client } = require('./googleAuth');
        const { google } = require('googleapis');
        const oauth2Client = getOauth2Client();
        if (!oauth2Client || !oauth2Client.credentials || Object.keys(oauth2Client.credentials).length === 0) {
            return res.json({ error: 'No autenticado con Google' });
        }
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        const response = await youtube.liveBroadcasts.list({
            part: 'snippet,status',
            broadcastStatus: 'all',
            broadcastType: 'all'
        });
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get('/api/config', (req, res) => {
    res.json(getConfig());
});

app.post('/api/config', (req, res) => {
    const newConfig = { ...getConfig(), ...req.body };
    saveConfig(newConfig);
    res.json({ success: true, config: newConfig });
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
        res.redirect(`${frontendUrl}/#/settings?auth=success`);
    } catch (error) {
        console.error('Error in OAuth callback:', error);
        res.status(500).send('Authentication failed');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
