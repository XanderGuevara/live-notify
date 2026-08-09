<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const quickText = ref('');
const copySuccess = ref(false);
const liveStreams = ref([]);
const selectedStream = ref(null);
const isLoading = ref(true);

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
let pollInterval;

const updateQuickText = () => {
  if (selectedStream.value) {
    quickText.value = `🔴 ¡ESTAMOS EN VIVO!\nCanal: ${selectedStream.value.channelName || 'Tu Canal'}\nTema: ${selectedStream.value.title}\n👉 ${selectedStream.value.url}`;
  }
}

const fetchLiveStream = async () => {
  try {
    const res = await fetch(`${backendUrl}/api/live`);
    const data = await res.json();
    liveStreams.value = data.live || [];
    
    if (liveStreams.value.length > 0) {
      if (!selectedStream.value || !liveStreams.value.find(s => s.id === selectedStream.value.id)) {
        selectedStream.value = liveStreams.value[0];
      }
      updateQuickText();
    } else {
      selectedStream.value = null;
      quickText.value = '';
    }
  } catch(e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}

const copyToClipboard = async () => {
  if (!quickText.value) return;
  try {
    await navigator.clipboard.writeText(quickText.value);
    copySuccess.value = true;
    setTimeout(() => copySuccess.value = false, 2000);
  } catch (err) {
    console.error('Error al copiar: ', err);
  }
}

onMounted(() => {
  fetchLiveStream();
  pollInterval = setInterval(fetchLiveStream, 30000); // Poll cada 30 segs
})

onUnmounted(() => {
  clearInterval(pollInterval);
})
</script>

<template>
  <div class="animate-fade-in">
    <h2 class="mb-4">Share Hub</h2>
    <p class="text-muted">Comparte la transmisión actual rápidamente en diferentes canales.</p>

    <div class="card mb-4 border-primary">
      <div class="card-body">
        <h5 class="card-title text-primary"><i class="bi bi-youtube"></i> Transmisión Activa</h5>
        
        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted mb-0">Buscando directos...</p>
        </div>
        
        <div v-else-if="liveStreams.length > 0">
          <div v-for="stream in liveStreams" :key="stream.id" 
               class="mb-3 p-3 border rounded position-relative" 
               :class="{'bg-light border-primary border-2': selectedStream?.id === stream.id}" 
               @click="selectedStream = stream; updateQuickText()"
               style="cursor: pointer;">
            
            <div v-if="selectedStream?.id === stream.id" class="position-absolute top-0 end-0 p-2">
              <span class="badge bg-primary rounded-pill"><i class="bi bi-check-circle-fill"></i> Seleccionado</span>
            </div>

            <h4 class="mt-1 me-5">{{ stream.title }} <span class="badge bg-danger fs-6 align-middle ms-2">EN VIVO</span></h4>
            <p class="text-muted mb-1"><i class="bi bi-person-video"></i> {{ stream.channelName || 'Tu Canal' }}</p>
            <a :href="stream.url" target="_blank" class="text-decoration-none d-block mt-2">
              {{ stream.url }}
            </a>
          </div>
        </div>
        
        <div v-else class="text-center py-4 text-muted">
          <i class="bi bi-camera-video-off fs-1 text-secondary mb-2 d-block"></i>
          <h5>No hay transmisión activa</h5>
          <p class="mb-0">Cuando inicies un directo en YouTube, aparecerá aquí automáticamente.</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title"><i class="bi bi-whatsapp text-success"></i> Grupos de WhatsApp</h5>
            <p class="card-text small text-muted">Genera enlaces wa.me pre-redactados para enviar con 1 clic.</p>
            
            <div class="d-grid gap-2">
              <a href="#" class="btn btn-success text-start">
                <i class="bi bi-whatsapp"></i> Enviar a "Comunidad General"
              </a>
              <a href="#" class="btn btn-success text-start">
                <i class="bi bi-whatsapp"></i> Enviar a "Equipo Interno"
              </a>
              <a href="#" class="btn btn-success text-start">
                <i class="bi bi-whatsapp"></i> Enviar a "Canal Anuncios"
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title"><i class="bi bi-share"></i> Redes Sociales Rápidas</h5>
            <p class="card-text small text-muted">Abre la ventana de compartir nativa.</p>
            
            <div class="d-flex gap-2 mb-3">
              <button class="btn btn-outline-dark"><i class="bi bi-twitter-x"></i> Postear en X</button>
              <button class="btn btn-outline-primary"><i class="bi bi-facebook"></i> Facebook</button>
              <button class="btn btn-outline-info"><i class="bi bi-linkedin"></i> LinkedIn</button>
            </div>

            <hr>
            
            <h6>Texto rápido para portapapeles</h6>
            <p class="small text-muted mb-2">Puedes editar este texto antes de copiarlo.</p>
            <div class="input-group">
              <textarea class="form-control" rows="4" v-model="quickText"></textarea>
              <button class="btn" :class="copySuccess ? 'btn-success' : 'btn-outline-primary'" @click="copyToClipboard">
                <i class="bi" :class="copySuccess ? 'bi-check-lg' : 'bi-clipboard'"></i> 
                {{ copySuccess ? 'Copiado!' : 'Copiar' }}
              </button>
            </div>
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
