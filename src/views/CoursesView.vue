<script setup>
import { RouterLink } from 'vue-router';
import { useEarTrainingCourse } from '../composables/useEarTrainingCourse';

const { completionPercent, initCourseProgress } = useEarTrainingCourse();
initCourseProgress();

const COMING_SOON = [
  {
    icon: 'piano',
    title: 'Teoría Musical',
    description: 'Escalas, modos, armonía funcional y análisis de partituras.',
    units: 12,
    levels: 3,
  },
  {
    icon: 'music_note',
    title: 'Ritmo y Tiempo',
    description: 'Solfeo rítmico, poliritmia, subdivisiones y dictado.',
    units: 8,
    levels: 2,
  },
  {
    icon: 'mic',
    title: 'Improvisación',
    description: 'Frases melódicas, llamada y respuesta, vocabulario jazz y rock.',
    units: 10,
    levels: 3,
  },
];
</script>

<template>
  <div class="courses-view">
    <div class="courses-inner">

      <!-- Header -->
      <div class="courses-header">
        <span class="courses-eyebrow">theMusicTools</span>
        <h1 class="courses-title">Cursos</h1>
        <p class="courses-subtitle">
          Mejora tu musicalidad con ejercicios interactivos y contenido estructurado por niveles.
        </p>
      </div>

      <!-- Available -->
      <section class="catalog-section">
        <h2 class="section-label">Disponibles</h2>
        <div class="courses-grid">

          <RouterLink to="/courses/ear-training" class="course-card available">
            <div class="card-top">
              <div class="card-icon-wrap">
                <span class="material-symbols-outlined card-icon">hearing</span>
              </div>
              <span class="card-badge badge-available">Disponible</span>
            </div>
            <h3 class="card-title">Entrenamiento Auditivo</h3>
            <p class="card-desc">
              Desarrolla tu oído identificando intervalos, acordes y progresiones. Del principiante al avanzado.
            </p>
            <div class="card-meta">
              <span>10 unidades</span>
              <span class="meta-sep">·</span>
              <span>3 niveles</span>
            </div>
            <div class="card-progress">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: completionPercent + '%' }"></div>
              </div>
              <span class="progress-label">{{ completionPercent }}% completado</span>
            </div>
            <div class="card-cta">
              <span>{{ completionPercent > 0 ? 'Continuar curso' : 'Comenzar curso' }}</span>
              <span class="material-symbols-outlined cta-icon">arrow_forward</span>
            </div>
          </RouterLink>

        </div>
      </section>

      <!-- Coming soon -->
      <section class="catalog-section">
        <h2 class="section-label">Próximamente</h2>
        <div class="courses-grid">
          <div v-for="course in COMING_SOON" :key="course.title" class="course-card locked">
            <div class="card-top">
              <div class="card-icon-wrap locked-icon">
                <span class="material-symbols-outlined card-icon">{{ course.icon }}</span>
              </div>
              <span class="card-badge badge-soon">Próximamente</span>
            </div>
            <h3 class="card-title">{{ course.title }}</h3>
            <p class="card-desc">{{ course.description }}</p>
            <div class="card-meta">
              <span>{{ course.units }} unidades</span>
              <span class="meta-sep">·</span>
              <span>{{ course.levels }} niveles</span>
            </div>
            <div class="card-lock">
              <span class="material-symbols-outlined lock-icon">lock</span>
              <span>En desarrollo</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.courses-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: var(--color-bg);
}

.courses-inner {
  max-width: 64rem;
  margin: 0 auto;
  padding: 3rem 2rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Header */
.courses-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.courses-eyebrow {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.courses-title {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
}

.courses-subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin: 0.25rem 0 0;
  max-width: 40rem;
  line-height: 1.6;
}

/* Section */
.catalog-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-panel-border);
}

/* Grid */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

/* Card base */
.course-card {
  background: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  text-decoration: none;
  color: var(--color-text-primary);
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.course-card.available {
  cursor: pointer;
}

.course-card.available:hover {
  border-color: var(--color-accent);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(255, 107, 0, 0.15);
}

.course-card.locked {
  opacity: 0.6;
  cursor: default;
}

/* Card top row */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 12px;
  background: rgba(255, 107, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon-wrap.locked-icon {
  background: var(--color-surface-1);
}

.card-icon {
  font-size: 1.5rem !important;
  color: var(--color-accent);
}

.locked-icon .card-icon {
  color: var(--color-text-secondary);
}

/* Badges */
.card-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.3rem 0.65rem;
  border-radius: 50px;
}

.badge-available {
  background: rgba(255, 107, 0, 0.15);
  color: var(--color-accent);
}

.badge-soon {
  background: var(--color-surface-1);
  color: var(--color-text-secondary);
}

/* Card content */
.card-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.3;
}

.card-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.55;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.meta-sep {
  opacity: 0.4;
}

/* Progress */
.card-progress {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.progress-track {
  width: 100%;
  height: 5px;
  background: var(--color-panel-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 3px;
  transition: width 0.4s ease;
  min-width: 0%;
}

.progress-label {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
}

/* CTA */
.card-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-panel-border);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-accent);
}

.cta-icon {
  font-size: 1.1rem !important;
  transition: transform 0.2s;
}

.course-card.available:hover .cta-icon {
  transform: translateX(4px);
}

/* Lock indicator */
.card-lock {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-panel-border);
}

.lock-icon {
  font-size: 0.9rem !important;
}

@media (max-width: 640px) {
  .courses-inner {
    padding: 2rem 1rem 3rem;
  }
  .courses-title {
    font-size: 1.8rem;
  }
  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>
