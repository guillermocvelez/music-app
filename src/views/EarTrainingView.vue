<script setup>
import { RouterLink } from 'vue-router';
import EarTrainingLab from '../components/eartraining/EarTrainingLab.vue';
import EarTrainingSidebar from '../components/eartraining/EarTrainingSidebar.vue';
</script>

<template>
  <div class="eartraining-view">
    <aside class="eartraining-sidebar">
      <RouterLink to="/courses" class="back-link">
        <span class="material-symbols-outlined back-icon">arrow_back</span>
        Cursos
      </RouterLink>
      <EarTrainingSidebar />
    </aside>

    <main class="eartraining-center">
      <EarTrainingLab />
    </main>
  </div>
</template>

<style scoped>
.eartraining-view {
  display: grid;
  grid-template-columns: 260px 1fr;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.eartraining-sidebar {
  border-right: 1px solid var(--color-panel-border);
  padding: var(--spacing-lg);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  transition: color 0.18s, background 0.18s;
  align-self: flex-start;
  margin-bottom: 0.25rem;
}

.back-link:hover {
  color: var(--color-accent);
  background: rgba(255, 107, 0, 0.07);
}

.back-icon {
  font-size: 1rem !important;
}

.eartraining-center {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
}
</style>
