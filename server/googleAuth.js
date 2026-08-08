const { google } = require('googleapis');

// Inicializar el cliente OAuth2 (Los valores se configuran en index.js)
let oauth2Client = null;

function initGoogleAuth(clientId, clientSecret, redirectUri) {
    oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
    );
}

// Genera la URL para la pantalla de consentimiento de Google
function getAuthUrl() {
    if (!oauth2Client) throw new Error('OAuth2 client not initialized');
    
    const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly' // Para ver directos no listados
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline', // Para recibir un refresh token
        scope: scopes,
        prompt: 'consent' // Fuerza a mostrar la pantalla de consentimiento
    });
}

// Intercambia el código que devuelve Google por un token de acceso real
async function handleCallback(code) {
    if (!oauth2Client) throw new Error('OAuth2 client not initialized');
    
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // TODO: Aquí deberíamos guardar "tokens" en la base de datos (SQLite)
    // para usar el refresh_token más adelante. Por ahora lo dejamos en memoria.
    
    return tokens;
}

module.exports = {
    initGoogleAuth,
    getAuthUrl,
    handleCallback,
    getOauth2Client: () => oauth2Client
};
