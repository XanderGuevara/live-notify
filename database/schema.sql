-- database/schema.sql
-- LiveNotify Initial Schema

CREATE TABLE IF NOT EXISTS config (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    channel_type TEXT NOT NULL, -- 'email', 'telegram', 'whatsapp'
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    video_url TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL, -- 'detected', 'processing', 'completed'
    detected_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_logs (
    id TEXT PRIMARY KEY,
    event_id TEXT,
    channel_type TEXT NOT NULL,
    status TEXT NOT NULL, -- 'success', 'failed'
    details TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Insertar configuración inicial (mocks)
INSERT OR IGNORE INTO config (id, key, value) VALUES 
('1', 'youtube_channel_id', 'UC_x5XG1OV2P6uZZ5FSM9Ttw'),
('2', 'active_providers', '["email", "telegram"]');

-- Insertar plantilla básica de ejemplo
INSERT OR IGNORE INTO templates (id, channel_type, name, content) VALUES
('1', 'telegram', 'Alerta en Vivo General', '🔴 ¡ESTAMOS EN VIVO!\n\nHoy hablamos de: *{{video_title}}*\n\n¡Entra ya!\n👉 {{youtube_url}}');
