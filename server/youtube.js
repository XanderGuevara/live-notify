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
            broadcastType: 'all'
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

async function checkOtherChannels(channelIds) {
    const oauth2Client = getOauth2Client();
    if (!oauth2Client || !oauth2Client.credentials || Object.keys(oauth2Client.credentials).length === 0) {
        return [];
    }
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    let activeStreams = [];

    for (const channelId of channelIds) {
        try {
            // 1. Fetch RSS Feed (0 quota cost)
            const rssRes = await fetch(`https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`);
            if (!rssRes.ok) continue;
            const xml = await rssRes.text();
            
            const matches = [...xml.matchAll(/<yt:videoId>(.*?)<\/yt:videoId>/g)];
            const videoIds = matches.map(m => m[1]).slice(0, 3); // Revisar los 3 videos más recientes
            
            if (videoIds.length === 0) continue;
            
            // 2. Fetch status for those specific videos (1 quota cost)
            const videoRes = await youtube.videos.list({
                part: 'snippet',
                id: videoIds.join(',')
            });
            
            for (const item of videoRes.data.items) {
                if (item.snippet.liveBroadcastContent === 'live') {
                    activeStreams.push({
                        id: item.id,
                        title: item.snippet.title,
                        channelName: item.snippet.channelTitle,
                        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
                        url: `https://youtube.com/watch?v=${item.id}`
                    });
                }
            }
        } catch(e) {
            console.error(`[YouTube API Error] Channel ${channelId}:`, e.message);
        }
    }
    return activeStreams;
}

module.exports = { getActiveLiveStream, checkOtherChannels };
