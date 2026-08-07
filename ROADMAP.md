# Roadmap de LiveNotify

El siguiente mapa de ruta detalla la planificación de lanzamiento de los módulos de LiveNotify. Al ser un proyecto Open Source, estas versiones y fechas estimadas están sujetas a la velocidad de la comunidad y prioridades de los contribuyentes.

| Módulo | Versión | Descripción |
|--------|---------|-------------|
| **Autenticación** | 1.0 | Sistema de login básico y seguro (JWT/Sesiones) para un usuario administrador único para proteger el panel de control. |
| **Canales de YouTube** | 1.0 | Conexión con YouTube Data API, configuración del ID del canal objetivo y lógica de polling/cron para detectar el estado "Live". |
| **Notificaciones** | 1.0 | Arquitectura base modular. Soporte inicial integrado para Email (Resend), Telegram y Webhooks genéricos. |
| **Centro de Compartir** | 1.0 | Panel UI para generar enlaces de WhatsApp Web (`wa.me`) con texto predefinido, opciones de "Copiar al portapapeles" y botones rápidos sociales. |
| **Historial** | 1.0 | Registro en base de datos D1 de todos los eventos detectados y el estado de entrega (Logs) de las notificaciones enviadas. |
| **Configuración** | 1.0 | Panel de gestión para crear y editar plantillas de mensajes (con variables), e interfaz para gestionar las API Keys de los proveedores. |
| **Usuarios** | 1.1 | Sistema Multi-usuario. Capacidad de invitar a otros miembros del equipo (Community Managers) con roles definidos (Admin vs Editor). |
| **Múltiples Fuentes** | 1.1 | Soporte para monitorear más de un canal de YouTube de manera simultánea desde la misma cuenta. |
| **Discord & Slack** | 1.1 | Inclusión nativa de proveedores de notificación para Discord Webhooks y Slack. |
| **Estadísticas** | 1.2 | Dashboard analítico: Gráficos de transmisiones a lo largo del tiempo, tiempos promedios de detección y tasas de éxito en entregabilidad de mensajes. |
| **WhatsApp Oficial** | 1.2 | Integración directa con WhatsApp Business Cloud API para envío 100% automatizado, superando la limitación manual del Centro de Compartir. |
| **Automatizaciones** | 2.0 | Motor de reglas: Ejecutar diferentes canales o plantillas basados en condiciones (ej. palabras clave en el título del stream, día de la semana). |
| **Portal Público** | 2.0 | Creación de páginas de aterrizaje (Landing Pages) dinámicas donde los usuarios finales puedan suscribirse para recibir alertas, generando una base de datos de audiencia propia. |
| **Twitch & FB Live** | 2.X | Expansión de la detección más allá de YouTube, soportando las APIs de otras grandes plataformas de streaming. |

---
*Nota para contribuyentes: Si deseas trabajar en alguna funcionalidad listada en versiones futuras (1.1+), siéntete libre de abrir un Issue o Pull Request. El orden de desarrollo es flexible.*
