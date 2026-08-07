# Definición de Producto: LiveNotify

## El Problema

Las organizaciones, iglesias, creadores de contenido y medios que realizan transmisiones en vivo (livestreams) diariamente o con alta frecuencia en YouTube enfrentan un problema crítico: **la entrega de notificaciones**.

YouTube cambia dinámicamente la URL de la transmisión en cada nuevo evento en vivo. El algoritmo de la plataforma decide a qué suscriptores notificar, a menudo dejando a una gran parte de la audiencia sin avisar. Los equipos se ven obligados a:
1. Esperar a que inicie la transmisión.
2. Copiar manualmente el nuevo enlace.
3. Redactar mensajes manualmente.
4. Pegar y enviar el enlace en grupos de WhatsApp, canales de Telegram y boletines de correo.

Este proceso manual es propenso a errores, consume tiempo crítico en los primeros minutos de una transmisión (donde el engagement inicial es vital para el algoritmo de YouTube) y no es escalable.

## Usuarios Objetivo

1. **Administradores de Comunidades / Community Managers:** Personas encargadas de asegurar que la audiencia participe en las transmisiones. Buscan automatización y ahorro de tiempo.
2. **Organizaciones y Medios (Iglesias, Academias, Noticias):** Entidades que transmiten eventos regulares (clases, servicios, noticieros) y necesitan confiabilidad en las comunicaciones corporativas.
3. **Creadores de Contenido Independientes:** Youtubers o Streamers que desean ser dueños de su audiencia y no depender únicamente de la campanita de YouTube.

## Funcionalidades de la Versión 1.0 (MVP)

La versión 1.0 se enfocará en el núcleo de valor: detección automática y envío robusto.

- **Detección Automática de Livestreams:** Monitoreo de un canal de YouTube configurado para detectar automáticamente el inicio de una transmisión.
- **Panel de Control Web:** Interfaz gráfica (Vue 3) segura y responsive para administrar el sistema.
- **Gestión de Plantillas:** Creación de mensajes predefinidos con variables dinámicas (`{{titulo_video}}`, `{{enlace_youtube}}`).
- **Centro de Compartir (Share Hub):** Un panel dedicado que genera enlaces pre-construidos y botones para compartir rápidamente de forma manual si el administrador lo desea.
- **Notificaciones por Email:** Integración nativa con Resend.
- **Notificaciones por Telegram:** Integración con bots de Telegram.
- **Historial Básico:** Registro de las transmisiones detectadas y el estado de los mensajes enviados (éxito/error).
- **Autenticación Simple:** Acceso seguro al panel de administración para un único administrador.

## Funcionalidades Futuras

### Versión 1.1 (Mejoras de Usuario)
- Soporte para múltiples canales de YouTube simultáneos.
- Gestión de múltiples usuarios administradores con roles básicos.
- Integración con Discord (Webhooks).
- Soporte para envío de notificaciones de transmisiones programadas (notificar *antes* de que empiece).

### Versión 1.2 (Estadísticas y WhatsApp)
- Panel de métricas: CTR (Click-Through Rate), tiempos de entrega, transmisiones más populares.
- Integración oficial con WhatsApp Business API.
- Generación masiva de enlaces de WhatsApp Web para distribución manual estructurada.

### Versión 2.0 (Automatización Avanzada)
- Flujos de automatización condicional ("Si el título contiene 'Urgente', notificar también por SMS").
- Soporte para Twitch y Facebook Live.
- Portal público de suscripción: Los usuarios finales pueden entrar a una página alojada en la plataforma para suscribirse a alertas específicas.

## Instalación y Despliegue

LiveNotify está diseñado para ser desplegado fácilmente en el ecosistema de Cloudflare.

1. **Requisitos:** Una cuenta de Cloudflare (gratuita), cuenta de GitHub, y claves API de YouTube y Resend.
2. **Proceso de instalación:**
   - Hacer un *Fork* del repositorio.
   - Configurar los secretos (API Keys) en GitHub Actions o directamente en el dashboard de Cloudflare.
   - Conectar Cloudflare Pages al repositorio de GitHub para el Frontend.
   - Desplegar el Worker y las migraciones de base de datos D1 mediante el CLI de Wrangler (provisto en los scripts del proyecto).
3. **Mantenimiento Cero:** Al usar tecnologías Serverless, no hay servidores que actualizar ni parches de SO que aplicar.

## Contribución de la Comunidad

Al ser un proyecto Open Source (Licencia MIT), fomentamos activamente la contribución de la comunidad mediante:
- **Arquitectura Modular de Notificaciones:** Documentación clara para que los desarrolladores puedan enviar PRs (Pull Requests) añadiendo nuevos proveedores de mensajería (ej. Slack, SMS, Push).
- **Traducciones:** Archivos de internacionalización (i18n) en el frontend para soportar múltiples idiomas.
- **Issues y Discusiones:** Uso activo de GitHub Issues para reporte de bugs y GitHub Discussions para debatir nuevas características (Roadmap público).
