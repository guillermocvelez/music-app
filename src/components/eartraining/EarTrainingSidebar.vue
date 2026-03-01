<script setup>
import { computed, onMounted } from 'vue';
import { useEarTrainingCourse } from '../../composables/useEarTrainingCourse';

const {
  COURSE,
  selectedUnitId,
  completionPercent,
  isUnitCompleted,
  setSelectedUnit,
  initCourseProgress,
} = useEarTrainingCourse();

const allUnits = computed(() => COURSE.flatMap((level) => level.units));
const completedCount = computed(() => allUnits.value.filter((u) => isUnitCompleted(u.id)).length);

function unitIcon(unit) {
  if (isUnitCompleted(unit.id)) return 'check_circle';
  if (selectedUnitId.value === unit.id) return 'play_circle';
  return 'radio_button_unchecked';
}

onMounted(() => { initCourseProgress(); });
</script>

<template>
  <aside class="course-sidebar">

    <!-- Progress Header -->
    <div class="sidebar-head">
      <span class="progress-label">Progreso del Curso</span>
      <h3 class="sidebar-title">Ear Training</h3>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: completionPercent + '%' }"></div>
      </div>
      <p class="progress-text">
        {{ completedCount }} de {{ allUnits.length }} unidades completadas
      </p>
    </div>

    <!-- Unit List -->
    <div class="unit-list">
      <button
        v-for="unit in allUnits"
        :key="unit.id"
        class="unit-row"
        :class="{
          completed: isUnitCompleted(unit.id),
          active: selectedUnitId === unit.id && !isUnitCompleted(unit.id),
          selected: selectedUnitId === unit.id,
        }"
        @click="setSelectedUnit(unit.id)"
      >
        <span
          class="material-symbols-outlined unit-icon"
          :class="{ 'filled-icon': isUnitCompleted(unit.id) }"
        >{{ unitIcon(unit) }}</span>
        <span class="unit-name">{{ unit.title }}</span>
      </button>
    </div>

    <!-- Footer -->
    <div class="sidebar-footer">
      <button class="syllabus-btn">
        <span class="material-symbols-outlined">menu_book</span>
        Ver Temario
      </button>
    </div>

  </aside>
</template>

<style scoped>
.course-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow: hidden;
}

/* Progress Header */
.sidebar-head {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex-shrink: 0;
}

.progress-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0.2rem 0 0;
}

.progress-track {
  width: 100%;
  height: 8px;
  background: var(--color-panel-border);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.6rem;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.progress-text {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  margin: 0.3rem 0 0;
}

/* Unit List */
.unit-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.unit-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.75rem;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
}

.unit-row:hover {
  background: var(--color-surface-1);
  color: var(--color-text-primary);
}

.unit-row.selected {
  background: var(--color-surface-2);
  border-color: rgba(255, 107, 0, 0.3);
  color: var(--color-text-primary);
}

.unit-row.completed {
  background: rgba(255, 107, 0, 0.06);
  border-color: rgba(255, 107, 0, 0.15);
  color: var(--color-text-primary);
}

.unit-icon {
  font-size: 1.25rem !important;
  flex-shrink: 0;
  color: var(--color-text-secondary);
}

.unit-row.completed .unit-icon,
.unit-row.active .unit-icon {
  color: var(--color-accent);
}

.unit-name {
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.35;
}

/* Footer */
.sidebar-footer {
  flex-shrink: 0;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-panel-border);
}

.syllabus-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem;
  border: 1px solid var(--color-panel-border);
  border-radius: 12px;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
}

.syllabus-btn:hover {
  background: var(--color-surface-1);
  border-color: var(--color-accent);
}
</style>
