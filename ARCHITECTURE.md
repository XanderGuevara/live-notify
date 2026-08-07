# Arquitectura de LiveNotify

## Diagrama de Arquitectura General

```ascii
                                            +-------------------+
                                            |                   |
                                            |  YouTube Data API |
                                            |                   |
                                            +---------+---------+
                                                      |
                                                      v (Polling/Webhook)
+------------------------+                  +-------------------------+
|                        |                  |                         |
|   Frontend (Vue 3)     |                  |   Cloudflare Worker     |
|   Hosted on:           |<---------------->|   (Backend API)         |
|   Cloudflare Pages     |   REST API       |                         |
|                        |                  |                         |
+------------------------+                  +----+---------------+----+
                                                 |               |
                                                 |               |
                                                 v               v
                                      +-------------+   +-------------------+
                                      |             |   |                   |
                                      | Cloudflare  |   | Proveedores de    |
                                      | D1 (SQLite) |   | Notificaciones    |
                                      |             |   | (Resend, Telegram,|
                                      +-------------+   | WhatsApp, etc.)   |
                                                        |                   |
                                                        +-------------------+
```

## Estructura de Carpetas del Proyecto

```text
live-notify/
├── app/                    # Aplicación Frontend (Vue 3 + Vite)
├── worker/                 # Backend Serverless (Cloudflare Worker)
├── database/               # Esquemas SQL y migraciones (D1)
├── docs/                   # Documentación adicional
├── .github/                # Configuración GitHub Actions / Workflows
├── README.md               # Overview del proyecto
├── LICENSE                 # Licencia Open Source
├── VISION.md               # Visión a futuro del proyecto
├── PRODUCT.md              # Definición del producto
├── ARCHITECTURE.md         # Este documento
├── NOTIFICATIONS.md        # Arquitectura de notificaciones
├── ROADMAP.md              # Plan de versiones
└── .gitignore              # Archivos ignorados por git
```

## Componentes Principales

### 1. Frontend (App)
- **Tecnologías:** Vue 3 (Composition API), Vite (Build Tool), Bootstrap 5 (UI/CSS), Bootstrap Icons (Iconografía), Vue Router (Enrutamiento), Pinia (Gestión de estado).
- **Alojamiento:** Cloudflare Pages.
- **Responsabilidad:** Proporcionar una interfaz gráfica moderna, responsive y amigable para que el administrador configure canales, vea historiales y gestione los canales de notificación y el "Centro de Compartir".

### 2. Backend (Worker)
- **Tecnologías:** Cloudflare Workers (JavaScript/TypeScript).
- **Responsabilidad:** Actuar como el orquestador principal. Expone una API REST consumida por el Frontend, interactúa con la base de datos D1, consulta la API de YouTube para detectar transmisiones y despacha los trabajos a los proveedores de notificaciones.
- **Cron Triggers:** Utiliza las funcionalidades de tareas programadas (cron) de Cloudflare Workers para revisar periódicamente el estado del canal de YouTube objetivo.

### 3. Base de Datos (Database)
- **Tecnologías:** Cloudflare D1 (Base de datos relacional Serverless basada en SQLite).
- **Responsabilidad:** Almacenar de forma segura la configuración del sistema, credenciales encriptadas de las APIs, historial de notificaciones enviadas, plantillas de mensajes y registros de usuarios/canales.

### 4. Integraciones (APIs Externas)
- **YouTube Data API v3:** Se utiliza para detectar cuándo un canal cambia su estado a "en vivo" y recuperar el ID del video y la URL de la transmisión.
- **Proveedores de Notificaciones (ej. Resend, Telegram, Meta):** APIs externas llamadas por el Worker para despachar los mensajes finales a los usuarios.

## Flujo de Datos

1. **Detección de Transmisión:**
   - Un Cron Trigger en el Cloudflare Worker se ejecuta cada 'X' minutos.
   - El Worker consulta la API de YouTube para verificar si hay una transmisión activa.
   - Si se detecta una nueva transmisión, el Worker extrae los metadatos (Título, URL, Thumbnail).

2. **Procesamiento de Notificaciones:**
   - El Worker registra el evento en Cloudflare D1.
   - El Worker recupera las plantillas de mensajes y las configuraciones de los canales de notificación activos.
   - Se procesan las plantillas insertando las variables dinámicas (URL del video, Título).

3. **Despacho:**
   - El Worker invoca de manera asíncrona los módulos de proveedores de notificaciones (ej. Resend para Emails, Telegram API para grupos, etc.).
   - Los resultados del envío (éxitos/fallos) se guardan en D1.

4. **Interacción del Usuario Administrador:**
   - El administrador accede a la SPA (Vue 3) en Cloudflare Pages.
   - El frontend autentica al usuario y consume la API del Worker para mostrar el historial de envíos, permitir pruebas manuales y actualizar la configuración de plantillas y proveedores.

## Justificación de la Arquitectura Elegida

La elección del stack técnico está profundamente alineada con la filosofía del proyecto:

- **Edge Computing & Serverless (Cloudflare):** Permite que el proyecto sea gratuito o de costo casi nulo en su capa inicial, eliminando la necesidad de gestionar servidores tradicionales (VPS). Cloudflare Workers y D1 ofrecen latencia global ultrabaja y despliegues instantáneos.
- **Vue 3 + Bootstrap 5:** Proporciona un desarrollo rápido, una curva de aprendizaje suave para nuevos contribuyentes Open Source y asegura que el panel de administración sea moderno, responsive y funcional sin depender de herramientas de compilación CSS complejas a menos que sea estrictamente necesario.
- **Modularidad:** Separar el Frontend (Pages) del Backend (Workers) y utilizar un patrón modular para los proveedores de notificaciones asegura que el sistema sea fácilmente escalable y mantenible. Cualquier desarrollador puede agregar un nuevo módulo de notificación sin alterar el núcleo del sistema.
