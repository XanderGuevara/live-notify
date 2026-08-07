const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const pino = require('pino');

let sock = null;
let currentQR = null;
let connectionStatus = 'DISCONNECTED'; // DISCONNECTED, CONNECTING, CONNECTED

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }) // Evita saturar la consola
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            connectionStatus = 'CONNECTING';
            // Generar Data URI del QR para mostrarlo en el Frontend
            currentQR = await qrcode.toDataURL(qr);
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            connectionStatus = 'DISCONNECTED';
            currentQR = null;
            
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            
            // reconectar si no ha cerrado sesión explícitamente
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('opened connection');
            connectionStatus = 'CONNECTED';
            currentQR = null;
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

function getStatus() {
    return {
        status: connectionStatus,
        qr: currentQR
    };
}

async function sendMessage(to, text) {
    if (connectionStatus !== 'CONNECTED') {
        throw new Error('WhatsApp is not connected');
    }
    
    // Baileys requiere el formato jid: numero@s.whatsapp.net
    const jid = `${to}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: text });
    return true;
}

module.exports = {
    connectToWhatsApp,
    getStatus,
    sendMessage
};
