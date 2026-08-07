# Arquitectura y Sistema de Notificaciones

## Canales de Notificación Soportados

LiveNotify está diseñado para ser agnóstico al canal, permitiendo la integración de múltiples plataformas para llegar a la audiencia donde se encuentre.

- **Email:** A través de la API de Resend para una alta entregabilidad.
- **Telegram:** A través de la API de Telegram Bots (envío a canales, grupos o individuos).
- **Discord:** A través de Webhooks, ideal para comunidades de gaming o tecnología.
- **WhatsApp Business (Futuro):** A través de la API oficial de Cloud de Meta.
- **Slack:** A través de Incoming Webhooks para entornos corporativos.
- **Webhooks Genéricos:** Permite enviar una carga útil HTTP POST a cualquier URL (útil para integraciones con Zapier, Make o sistemas internos).

## El Centro de Compartir (Share Hub)

Reconociendo que la automatización total a veces necesita intervención humana, LiveNotify incluye un **Centro de Compartir**. Esta es una sección dentro del panel de control que se activa en cuanto se detecta una transmisión.

Funcionalidades del Centro de Compartir:
- **Botones de 1 Clic:** Botones para compartir instantáneamente en Twitter/X, Facebook, LinkedIn.
- **Copiar al Portapapeles:** Bloques de texto pre-formateados con el título y enlace listos para copiar.
- **Códigos QR:** Generación automática de un código QR apuntando a la transmisión en vivo para compartir en redes visuales (Instagram, presentaciones físicas).

## Generación de Enlaces de WhatsApp Web Automáticos

Dado que la API oficial de WhatsApp puede ser costosa o tener barreras de entrada para proyectos pequeños, LiveNotify incluye una solución ingeniosa: **Generación de Enlaces `wa.me`**.

El sistema utiliza las plantillas predefinidas y el enlace de la transmisión para generar automáticamente enlaces de WhatsApp Web (`https://wa.me/?text=...`). 
- El administrador puede configurar múltiples grupos de WhatsApp.
- El sistema genera un botón o enlace por cada grupo.
- El administrador hace clic en el enlace, lo que abre WhatsApp Web o la App nativa con el texto ya redactado y el enlace de YouTube incluido, requiriendo solo pulsar "Enviar".
- Esto semi-automatiza WhatsApp sin costos de API.

## Sistema de Plantillas Personalizables

Cada canal de notificación tiene su propio motor de plantillas, permitiendo adaptar el mensaje al formato adecuado (ej. Markdown para Telegram, HTML para Email).

Se utilizan etiquetas (tags) dinámicas que el Worker reemplaza en tiempo de ejecución:
- `{{youtube_url}}`: El enlace directo de la transmisión.
- `{{video_title}}`: El título extraído de YouTube.
- `{{channel_name}}`: El nombre del canal de YouTube.
- `{{date_time}}`: La fecha y hora actual formateada.

Ejemplo de plantilla para Telegram:
```text
🔴 ¡ESTAMOS EN VIVO! 🔴
Hoy hablaremos sobre: *{{video_title}}*

No te lo pierdas, entra ahora:
👉 {{youtube_url}}
```

## Arquitectura Modular de Proveedores

Para garantizar la escalabilidad y facilitar las contribuciones Open Source, el sistema de envío de notificaciones en el Cloudflare Worker utiliza una arquitectura de plugins/proveedores. 

Cada servicio de notificación es completamente independiente y debe implementar una interfaz común (`NotificationProvider`).

### Ejemplo de Estructura de Directorios (Worker)

```text
worker/
├── src/
│   ├── index.js                  # Entry point del Worker
│   ├── youtube/                  # Lógica de detección de API YouTube
│   ├── database/                 # Consultas D1
│   ├── services/
│   │   ├── notificationManager.js # Orquestador que itera sobre los proveedores activos
│   │   └── notifications/        # Módulos de proveedores
│   │       ├── interface.js      # Definición de la interfaz base
│   │       ├── email-resend.js   # Implementación para Resend
│   │       ├── telegram.js       # Implementación para Telegram
│   │       ├── discord.js        # Implementación para Discord
│   │       ├── webhook.js        # Implementación genérica de HTTP Webhook
│   │       └── whatsapp-link.js  # Generador de enlaces wa.me
│   └── utils/
```

### Contrato del Proveedor (Provider Interface)

Cualquier nuevo proveedor que la comunidad desee añadir solo necesita crear un archivo (ej. `slack.js`) que exporte una clase con el siguiente método principal:

```javascript
// interface conceptual
class NotificationProvider {
  /**
   * @param {Object} config - Credenciales y configuración del proveedor
   * @param {Object} messagePayload - Datos ya procesados (texto, url, metadata)
   * @returns {Promise<Boolean>} Éxito o fracaso del envío
   */
  async send(config, messagePayload) {
    throw new Error("Method 'send()' must be implemented.");
  }
}
```

El `notificationManager.js` se encarga de leer de la base de datos qué canales están activos, cargar el proveedor correspondiente, procesar la plantilla y ejecutar la función `send()`, registrando el resultado en el historial.
