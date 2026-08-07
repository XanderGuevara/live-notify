<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="d-flex" style="height: 100vh; background-color: var(--bg-color);">
    <!-- Sidebar -->
    <div class="sidebar d-flex flex-column flex-shrink-0 p-4" style="width: 260px;">
      <a href="/" class="d-flex align-items-center mb-4 text-white text-decoration-none">
        <div class="bg-danger rounded-circle p-2 d-flex align-items-center justify-content-center me-3 shadow-sm" style="width:40px; height:40px;">
          <i class="bi bi-broadcast fs-5 text-white"></i>
        </div>
        <span class="fs-4 fw-bold tracking-tight">LiveNotify</span>
      </a>
      
      <div class="text-uppercase text-secondary small fw-bold mb-3 ms-2 letter-spacing-1">Menu</div>
      
      <ul class="nav nav-pills flex-column mb-auto gap-2">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link d-flex align-items-center fw-medium" active-class="active">
            <i class="bi bi-grid-1x2-fill me-3 fs-5"></i> Dashboard
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/share" class="nav-link d-flex align-items-center fw-medium" active-class="active">
            <i class="bi bi-share-fill me-3 fs-5"></i> Share Hub
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/settings" class="nav-link d-flex align-items-center fw-medium" active-class="active">
            <i class="bi bi-gear-fill me-3 fs-5"></i> Configuración
          </RouterLink>
        </li>
      </ul>
      
      <div class="mt-auto pt-3 border-top border-secondary">
        <div class="d-flex align-items-center text-white">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff" alt="" width="32" height="32" class="rounded-circle me-2">
          <strong class="small">Admin Workspace</strong>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1 p-5 overflow-auto">
      <div class="container-fluid max-w-7xl mx-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracking-tight {
  letter-spacing: -0.5px;
}
.letter-spacing-1 {
  letter-spacing: 1px;
}
.max-w-7xl {
  max-width: 1200px;
}
</style>
