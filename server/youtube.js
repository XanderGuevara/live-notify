const { google } = require('googleapis');
const { getOauth2Client } = require('./googleAuth');

async function getActiveLiveStream() {
    const oauth2Client = getOauth2Client();
    
    // Si no hay cliente o no hay credenciales, no estamos conectados a Google
    if (!oauth2Client || !oauth2Client.credentials || Object.keys(oauth2Client.credentials).length === 0) {
        return null;
    }

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    
    try {
        // Buscar transmisiones en vivo activas del canal autenticado
        const response = await youtube.liveBroadcasts.list({
            part: 'snippet',
            broadcastStatus: 'active',
            broadcastType: 'all',
            mine: true
        });

        const items = response.data.items;
        if (items && items.length > 0) {
            // Tomamos el primer directo activo que encontremos
            const broadcast = items[0];
            return {
                id: broadcast.id,
                title: broadcast.snippet.title,
                thumbnail: broadcast.snippet.thumbnails?.high?.url || broadcast.snippet.thumbnails?.default?.url,
                url: `https://youtube.com/watch?v=${broadcast.id}`
            };
        }
        return null; // No hay directos activos
    } catch (error) {
        console.error('[YouTube API Error] No se pudo obtener el directo:', error.message);
        return null;
    }
}

module.exports = { getActiveLiveStream };
