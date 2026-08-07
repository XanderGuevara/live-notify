<template>
  <div class="animate-fade-in">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h2 class="fw-bold text-dark mb-1">Dashboard</h2>
        <p class="text-muted mb-0">Resumen general de tus transmisiones en vivo.</p>
      </div>
      <button class="btn btn-primary px-4 py-2 rounded-pill fw-medium">
        <i class="bi bi-arrow-repeat me-2"></i> Refrescar Estado
      </button>
    </div>
    
    <div class="row g-4 mb-5">
      <div class="col-md-6">
        <div class="premium-card gradient-success p-4 border-0 h-100">
          <div class="d-flex align-items-start justify-content-between">
            <div>
              <p class="text-white-50 text-uppercase fw-bold small mb-1">Estado del Sistema</p>
              <h3 class="display-6 fw-bold text-white mb-2">En Vivo</h3>
              <p class="mb-0 text-white-50 small d-flex align-items-center">
                <i class="bi bi-clock me-1"></i> Última detección: Hace 2 minutos
              </p>
            </div>
            <div class="bg-white bg-opacity-25 rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
              <i class="bi bi-broadcast fs-3 text-white"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="premium-card gradient-primary p-4 border-0 h-100">
          <div class="d-flex align-items-start justify-content-between">
            <div>
              <p class="text-white-50 text-uppercase fw-bold small mb-1">Notificaciones Enviadas</p>
              <h3 class="display-6 fw-bold text-white mb-2">2,450</h3>
              <p class="mb-0 text-white-50 small d-flex align-items-center">
                <i class="bi bi-envelope-check me-1"></i> A través de Email y Telegram
              </p>
            </div>
            <div class="bg-white bg-opacity-25 rounded-circle p-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
              <i class="bi bi-send-check fs-3 text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="premium-card bg-white">
      <div class="card-header bg-transparent border-0 px-4 pt-4 pb-2">
        <h5 class="fw-bold text-dark mb-0">Últimas Transmisiones</h5>
      </div>
      <div class="card-body px-4 pb-4">
        <div class="table-responsive">
          <table class="table table-hover table-borderless">
            <thead>
              <tr>
                <th class="ps-3">Estado</th>
                <th>Título</th>
                <th>Fecha</th>
                <th class="text-end pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="align-middle shadow-sm rounded mb-2 bg-light">
                <td class="ps-3 py-3 rounded-start"><span class="badge-live">EN VIVO</span></td>
                <td class="py-3 fw-medium text-dark">Lanzamiento de LiveNotify v1.0</td>
                <td class="py-3 text-muted">Hoy, 10:00 AM</td>
                <td class="text-end pe-3 py-3 rounded-end">
                  <router-link to="/share" class="btn btn-sm btn-primary rounded-pill px-3">
                    <i class="bi bi-share me-1"></i> Compartir
                  </router-link>
                </td>
              </tr>
              <tr style="height: 10px;"></tr>
              <tr class="align-middle border-bottom">
                <td class="ps-3 py-3"><span class="badge bg-secondary px-3 py-2 rounded-pill text-white">FINALIZADO</span></td>
                <td class="py-3 text-dark">Prueba de integración con Telegram</td>
                <td class="py-3 text-muted">Ayer, 18:30 PM</td>
                <td class="text-end pe-3 py-3">
                  <button class="btn btn-sm btn-light text-muted rounded-pill px-3 border" disabled>
                    <i class="bi bi-journal-text me-1"></i> Logs
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
