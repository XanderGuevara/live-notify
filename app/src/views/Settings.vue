<script setup>
import { ref } from 'vue'

const activeTab = ref('integrations')
const isConnecting = ref(false)
const connectionStatus = ref('No conectado')

const waStatus = ref('DISCONNECTED')
const waQrCode = ref(null)

const fetchWaStatus = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/status')
    const data = await res.json()
    waStatus.value = data.whatsapp.status
    waQrCode.value = data.whatsapp.qr
  } catch(e) {
    console.error(e)
  }
}

// Cargar estado al inicio
fetchWaStatus();

const connectGoogle = () => {
  isConnecting.value = true;
  // Simulamos un retraso de red y luego "redirigimos" (aquí solo mostramos alerta)
  setTimeout(() => {
    isConnecting.value = false;
    alert("En un entorno real, esto te redirigiría a la pantalla de login de Google (OAuth 2.0).");
    connectionStatus.value = 'Esperando Autenticación...';
  }, 1000);
}
</script>

<template>
  <div class="animate-fade-in">
    <h2 class="mb-4">Configuración</h2>
    
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'general' }" href="#" @click.prevent="activeTab = 'general'">
          General
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'integrations' }" href="#" @click.prevent="activeTab = 'integrations'">
          Integraciones
        </a>
      </li>
    </ul>

    <!-- Tab General -->
    <div v-if="activeTab === 'general'" class="card animate-fade-in">
      <div class="card-body">
        <h5 class="card-title">Ajustes Generales</h5>
        <form @submit.prevent>
          <div class="mb-3">
            <label class="form-label">Intervalo de Comprobación</label>
            <select class="form-select">
              <option value="5">Cada 5 minutos (Recomendado)</option>
              <option value="1">Cada 1 minuto (Consume cuota API)</option>
              <option value="15">Cada 15 minutos</option>
            </select>
            <div class="form-text">Frecuencia con la que el Cron revisará si hay un nuevo directo.</div>
          </div>
          <button class="btn btn-primary">Guardar Configuración</button>
        </form>
      </div>
    </div>

    <!-- Tab Integraciones -->
    <div v-if="activeTab === 'integrations'" class="row g-4 animate-fade-in">
      <!-- Columna YouTube -->
      <div class="col-md-6">
        <div class="card h-100 border-danger">
          <div class="card-header bg-danger text-white">
            <i class="bi bi-youtube me-2"></i> Conexión con YouTube
          </div>
          <div class="card-body">
            <p class="text-muted small">
              Para detectar transmisiones <strong>No Listadas</strong> (Ocultas), necesitas vincular tu cuenta de Google para que la aplicación tenga permisos de lectura sobre tus directos.
            </p>
            
            <div class="d-flex align-items-center mb-4 p-3 bg-light rounded border">
              <i class="bi bi-google text-danger fs-3 me-3"></i>
              <div>
                <strong class="d-block">Estado de Conexión</strong>
                <span class="badge" :class="connectionStatus === 'No conectado' ? 'bg-secondary' : 'bg-warning text-dark'">
                  {{ connectionStatus }}
                </span>
              </div>
              <button 
                class="btn btn-outline-danger ms-auto" 
                @click="connectGoogle" 
                :disabled="isConnecting">
                <span v-if="isConnecting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-box-arrow-in-right me-1"></i> 
                {{ isConnecting ? 'Conectando...' : 'Conectar con Google' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna WhatsApp (Baileys) -->
      <div class="col-md-6">
        <div class="card h-100 border-success">
          <div class="card-header bg-success text-white">
            <i class="bi bi-whatsapp me-2"></i> Vinculación WhatsApp Web
          </div>
          <div class="card-body">
            <p class="text-muted small">
              Escanea el código QR con tu aplicación de WhatsApp (Dispositivos Vinculados) para permitir el envío automático.
            </p>
            
            <div class="text-center mb-4 p-3 bg-light rounded border">
              <div v-if="waStatus === 'CONNECTED'" class="text-success fw-bold fs-5">
                <i class="bi bi-check-circle-fill me-2"></i> WhatsApp Conectado
              </div>
              
              <div v-else-if="waStatus === 'CONNECTING' && waQrCode">
                <img :src="waQrCode" alt="WhatsApp QR Code" class="img-fluid border rounded shadow-sm" style="max-width: 200px;">
                <p class="mt-2 fw-bold text-dark mb-0">Escanea este código</p>
              </div>

              <div v-else class="text-muted">
                <div class="spinner-border text-success spinner-border-sm me-2" role="status"></div>
                Esperando estado de conexión...
              </div>
            </div>

            <form @submit.prevent>
              <div class="mb-3">
                <label class="form-label fw-bold">Destinatarios (Separados por coma)</label>
                <input type="text" class="form-control" placeholder="5215555555555, 34666666666">
                <div class="form-text">Números con código de país a los que se enviará la alerta.</div>
              </div>
              <button class="btn btn-outline-success w-100" @click="fetchWaStatus">
                <i class="bi bi-arrow-repeat"></i> Refrescar Estado QR
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
