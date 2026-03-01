<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useEarTraining } from '../../composables/useEarTraining';
import { useEarTrainingCourse } from '../../composables/useEarTrainingCourse';

const { generateExercise, playExercise, INTERVALS, CHORDS } = useEarTraining();
const { COURSE, selectedUnit, initCourseProgress } = useEarTrainingCourse();

// ── Practice engine ───────────────────────────────────────────────────────────
const key = ref('Random');
const exerciseResult = ref(null);
const currentOptions = ref([]);
const isRevealed = ref(false);
const selectedAnswer = ref(null);
const isPlaying = ref(false);

// ── Lesson accordion ─────────────────────────────────────────────────────────
const openSectionId = ref(null);

watch(
  selectedUnit,
  (unit) => {
    openSectionId.value = unit?.sections?.[0]?.id ?? null;
    // Reset practice state when unit changes
    exerciseResult.value = null;
    currentOptions.value = [];
    selectedAnswer.value = null;
    isRevealed.value = false;
  },
  { immediate: true },
);

function toggleSection(id) {
  openSectionId.value = openSectionId.value === id ? null : id;
}
const streak = ref(0);
const totalAnswers = ref(0);
const correctAnswers = ref(0);

const accuracy = computed(() => {
  if (!totalAnswers.value) return '--';
  return Math.round((correctAnswers.value / totalAnswers.value) * 100) + '%';
});

const currentLevel = computed(() => {
  if (!selectedUnit.value) return '';
  for (const level of COURSE) {
    if (level.units.some((u) => u.id === selectedUnit.value.id)) return level.title;
  }
  return '';
});

const unitShortName = computed(() => {
  if (!selectedUnit.value) return '';
  return selectedUnit.value.title.match(/^(Unidad \d+)/)?.[1] ?? '';
});

const unitLongName = computed(() => {
  if (!selectedUnit.value) return '';
  return selectedUnit.value.title.replace(/^Unidad \d+:\s*/, '');
});

const correctAnswer = computed(() => {
  if (!exerciseResult.value) return null;
  return exerciseResult.value.tipo === 'acorde'
    ? exerciseResult.value.grado
    : exerciseResult.value.intervalo;
});

const waveHeights = [48, 80, 128, 96, 160, 112, 64, 128, 48];

function buildOptions(exercise) {
  if (!exercise) return [];
  if (exercise.tipo === 'intervalo') {
    const correct = exercise.intervalo;
    const dist = INTERVALS.map((i) => i.name)
      .filter((n) => n !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 1);
    return [correct, ...dist].sort(() => Math.random() - 0.5);
  } else if (exercise.tipo === 'acorde') {
    const correct = exercise.grado;
    const dist = Object.values(CHORDS)
      .map((c) => c.name)
      .filter((n) => n !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 1);
    return [correct, ...dist].sort(() => Math.random() - 0.5);
  }
  return [exercise.grado];
}

const generateForCurrentUnit = () => {
  const unit = selectedUnit.value;
  if (!unit) return;
  isRevealed.value = false;
  selectedAnswer.value = null;
  exerciseResult.value = generateExercise({
    tonalidad: key.value,
    tipo: unit.practice.tipo,
    dificultad: unit.practice.dificultad,
    rango: unit.practice.rango,
  });
  currentOptions.value = buildOptions(exerciseResult.value);
};

const playExerciseAgain = () => {
  if (!exerciseResult.value) return;
  isPlaying.value = true;
  playExercise(exerciseResult.value);
  setTimeout(() => { isPlaying.value = false; }, 2500);
};

const revealAnswer = () => { isRevealed.value = true; };

const selectAnswer = (option) => {
  if (selectedAnswer.value !== null) return;
  selectedAnswer.value = option;
  totalAnswers.value++;
  if (option === correctAnswer.value) {
    correctAnswers.value++;
    streak.value++;
  } else {
    streak.value = 0;
    isRevealed.value = true;
  }
};

onMounted(() => { initCourseProgress(); });
</script>

<template>
  <div class="practice-view">

    <!-- ── Breadcrumbs & Stats ─────────────────────────────── -->
    <div class="practice-header">
      <div class="header-left">
        <div class="breadcrumbs">
          <span>{{ currentLevel }}</span>
          <span class="material-symbols-outlined bc-chevron">chevron_right</span>
          <span class="bc-unit">{{ unitShortName }}</span>
        </div>
        <h1 class="practice-title">{{ unitLongName }}</h1>
        <p class="practice-desc">{{ selectedUnit?.themes?.join(' · ') }}</p>
      </div>
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-label">Racha</span>
          <span class="stat-value accent">{{ streak }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Precisión</span>
          <span class="stat-value">{{ accuracy }}</span>
        </div>
      </div>
    </div>

    <!-- ── Lesson Content Accordion ───────────────────────── -->
    <div v-if="selectedUnit?.sections?.length" class="lesson-block">
      <div class="lesson-block-header">
        <span class="material-symbols-outlined lesson-block-icon">menu_book</span>
        <span class="lesson-block-title">Contenido de la Unidad</span>
      </div>

      <div class="sections-accordion">
        <div
          v-for="section in selectedUnit.sections"
          :key="section.id"
          class="accordion-item"
          :class="{ open: openSectionId === section.id }"
        >
          <button class="accordion-header" @click="toggleSection(section.id)">
            <span class="accordion-title">{{ section.title }}</span>
            <span class="material-symbols-outlined accordion-icon">expand_more</span>
          </button>

          <div class="accordion-collapsible">
            <div class="accordion-body">

              <p v-if="section.intro" class="section-intro">{{ section.intro }}</p>

              <div v-if="section.keyPoints?.length" class="key-points">
                <div class="kp-label">
                  <span class="material-symbols-outlined kp-icon">lightbulb</span>
                  Puntos clave
                </div>
                <ul class="kp-list">
                  <li v-for="(point, i) in section.keyPoints" :key="i">{{ point }}</li>
                </ul>
              </div>

              <div v-if="section.exercise?.length" class="exercise-block">
                <div class="ex-label">
                  <span class="material-symbols-outlined ex-icon">fitness_center</span>
                  Ejercicio
                </div>
                <ol class="ex-steps">
                  <li v-for="(step, i) in section.exercise" :key="i">{{ step }}</li>
                </ol>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Practice Engine ────────────────────────────────── -->
    <div class="engine-card">

      <div class="engine-card-header">
        <span class="material-symbols-outlined engine-label-icon">fitness_center</span>
        <span class="engine-label-text">Practice Lab</span>
      </div>

      <!-- Waveform visualization -->
      <div class="waveform-area">
        <div
          v-for="(h, i) in waveHeights"
          :key="i"
          class="wave-bar"
          :class="{ playing: isPlaying }"
          :style="{ '--bar-h': h + 'px', animationDelay: i * 0.1 + 's' }"
        ></div>
      </div>

      <!-- Main controls -->
      <div class="main-controls">
        <button class="ctrl-btn" title="Nuevo ejercicio" @click="generateForCurrentUnit">
          <span class="material-symbols-outlined">refresh</span>
        </button>
        <button
          class="ctrl-btn play"
          :disabled="!exerciseResult"
          title="Reproducir"
          @click="playExerciseAgain"
        >
          <span class="material-symbols-outlined play-icon">play_arrow</span>
        </button>
        <button
          class="ctrl-btn"
          :disabled="!exerciseResult || isRevealed"
          title="Revelar respuesta"
          @click="revealAnswer"
        >
          <span class="material-symbols-outlined">visibility</span>
        </button>
      </div>

      <!-- Answer options -->
      <div v-if="exerciseResult && currentOptions.length" class="answer-grid">
        <button
          v-for="opt in currentOptions"
          :key="opt"
          class="answer-btn"
          :class="{
            correct: selectedAnswer !== null && opt === correctAnswer,
            wrong: selectedAnswer === opt && opt !== correctAnswer,
          }"
          :disabled="selectedAnswer !== null"
          @click="selectAnswer(opt)"
        >
          {{ opt }}
        </button>
      </div>

      <!-- Start prompt (no exercise yet) -->
      <div v-else class="start-prompt">
        <button class="start-btn" @click="generateForCurrentUnit">
          <span class="material-symbols-outlined">play_circle</span>
          Comenzar ejercicio
        </button>
      </div>

      <!-- Reveal panel -->
      <Transition name="fade-up">
        <div v-if="isRevealed && exerciseResult" class="reveal-panel">
          <div class="reveal-row">
            <span>Notas</span>
            <strong>{{ exerciseResult.notas.join(' → ') }}</strong>
          </div>
          <div class="reveal-row">
            <span>Respuesta correcta</span>
            <strong>{{ correctAnswer }}</strong>
          </div>
          <div class="reveal-row">
            <span>Descripción</span>
            <strong>{{ exerciseResult.explicación }}</strong>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ── Footer Settings ────────────────────────────────── -->
    <div class="engine-footer">
      <div class="engine-info">
        <span class="material-symbols-outlined footer-icon">piano</span>
        <div>
          <h4>Piano Engine</h4>
          <p>Tono sinusoidal (Web Audio API)</p>
        </div>
      </div>
      <div class="footer-btns">
        <button class="footer-btn">
          <span class="material-symbols-outlined">tune</span>
          AJUSTES
        </button>
        <button class="footer-btn">
          <span class="material-symbols-outlined">help</span>
          CONSEJOS
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────────────────────── */
.practice-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 56rem;
  margin: 0 auto;
  box-sizing: border-box;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.practice-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-left { flex: 1; min-width: 0; }

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.4rem;
}
.bc-chevron { font-size: 0.9rem !important; }
.bc-unit { color: var(--color-accent); font-weight: 500; }

.practice-title {
  font-size: 1.7rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.2;
}

.practice-desc {
  margin: 0.4rem 0 0;
  color: var(--color-text-secondary);
  font-size: 0.82rem;
}

.stats-row { display: flex; gap: 0.75rem; flex-shrink: 0; }

.stat-card {
  background: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  border-radius: 12px;
  padding: 0.7rem 1.1rem;
  text-align: center;
  min-width: 72px;
}
.stat-label {
  display: block;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}
.stat-value { display: block; font-size: 1.4rem; font-weight: 900; }
.stat-value.accent { color: var(--color-accent); }

/* ── Lesson Block ────────────────────────────────────────────────────────────── */
.lesson-block {
  background: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  border-radius: 20px;
  overflow: hidden;
}

.lesson-block-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-panel-border);
}

.lesson-block-icon {
  font-size: 1.1rem !important;
  color: var(--color-accent);
}

.lesson-block-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* ── Accordion ───────────────────────────────────────────────────────────────── */
.sections-accordion {
  display: flex;
  flex-direction: column;
}

.accordion-item {
  border-bottom: 1px solid var(--color-panel-border);
}
.accordion-item:last-child { border-bottom: none; }

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.25rem;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.accordion-header:hover { background: var(--color-overlay-soft); }

.accordion-item.open .accordion-header { background: var(--color-overlay-soft); }

.accordion-title {
  font-size: 0.9rem;
  font-weight: 600;
}

.accordion-icon {
  font-size: 1.25rem !important;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  transition: transform 0.25s ease;
}
.accordion-item.open .accordion-icon { transform: rotate(180deg); }

/* ── Accordion Body ──────────────────────────────────────────────────────────── */
.accordion-collapsible {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.28s ease;
}

.accordion-item.open .accordion-collapsible {
  grid-template-rows: 1fr;
}

.accordion-body {
  overflow: hidden;
  padding: 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* padding-bottom transitions with the grid */
  padding-bottom: 0;
  transition: padding-bottom 0.28s ease;
}

.accordion-item.open .accordion-body {
  padding-bottom: 1.25rem;
}

.section-intro {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  margin: 0;
}

/* Key Points */
.key-points {
  border-left: 3px solid var(--color-accent);
  background: rgba(255, 107, 0, 0.05);
  border-radius: 0 10px 10px 0;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.kp-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
}
.kp-icon { font-size: 0.9rem !important; }

.kp-list {
  margin: 0;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.kp-list li {
  font-size: 0.85rem;
  color: var(--color-text-primary);
  line-height: 1.5;
}

/* Exercise Steps */
.exercise-block {
  background: var(--color-surface-1);
  border: 1px solid var(--color-panel-border);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ex-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}
.ex-icon { font-size: 0.9rem !important; }

.ex-steps {
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  counter-reset: step-counter;
}

.ex-steps li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: var(--color-text-primary);
  line-height: 1.5;
  counter-increment: step-counter;
}

.ex-steps li::before {
  content: counter(step-counter);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  background: var(--color-accent);
  color: #000;
  font-size: 0.65rem;
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* ── Engine Card ─────────────────────────────────────────────────────────────── */
.engine-card {
  background: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  border-radius: 24px;
  padding: 2.5rem 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
}

.engine-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
}
.engine-label-icon {
  font-size: 1rem !important;
  color: var(--color-accent);
}
.engine-label-text {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* Waveform */
.waveform-area {
  width: 100%;
  height: 9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.wave-bar {
  width: 8px;
  height: var(--bar-h);
  background: var(--color-accent);
  border-radius: 4px;
  opacity: 0.18;
  transition: opacity 0.3s ease;
}

.wave-bar.playing {
  opacity: 1;
  animation-name: wave-pulse;
  animation-duration: 0.6s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes wave-pulse {
  from { transform: scaleY(0.55); }
  to   { transform: scaleY(1.15); }
}

/* Controls */
.main-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.ctrl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  border: 2px solid var(--color-panel-border);
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: border-color 0.18s, color 0.18s, background 0.18s, transform 0.15s;
}

.ctrl-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(255, 107, 0, 0.08);
}

.ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.ctrl-btn.play {
  width: 5.5rem;
  height: 5.5rem;
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #000;
  box-shadow: 0 8px 24px rgba(255, 107, 0, 0.35);
}

.ctrl-btn.play:hover:not(:disabled) {
  transform: scale(1.06);
  color: #000;
  box-shadow: 0 12px 32px rgba(255, 107, 0, 0.5);
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.ctrl-btn.play:active:not(:disabled) { transform: scale(0.95); }

.play-icon {
  font-size: 2.5rem !important;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Answer grid */
.answer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  width: 100%;
  max-width: 28rem;
}

.answer-btn {
  padding: 1.4rem 1rem;
  background: var(--color-bg);
  border: 2px solid transparent;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s, color 0.18s;
  text-align: center;
}

.answer-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(255, 107, 0, 0.05);
}

.answer-btn.correct {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.answer-btn.wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.answer-btn:disabled { cursor: not-allowed; }

/* Start prompt */
.start-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 2rem;
  background: var(--color-accent);
  color: #000;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 0, 0.35);
}

/* Reveal panel */
.reveal-panel {
  width: 100%;
  border-top: 1px solid var(--color-panel-border);
  padding-top: 1.25rem;
  display: grid;
  gap: 0.65rem;
}

.reveal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.88rem;
  padding-bottom: 0.45rem;
  border-bottom: 1px solid var(--color-panel-border);
}
.reveal-row:last-child { border-bottom: none; }
.reveal-row span { color: var(--color-text-secondary); }

.fade-up-enter-active,
.fade-up-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-up-enter-from,
.fade-up-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── Footer ──────────────────────────────────────────────────────────────────── */
.engine-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 1.4rem;
  background: var(--color-overlay-soft);
  border: 1px dashed var(--color-panel-border);
  border-radius: 14px;
  flex-wrap: wrap;
  gap: 1rem;
}

.engine-info { display: flex; align-items: center; gap: 0.9rem; }

.footer-icon { color: var(--color-text-secondary); }

.engine-info h4 { margin: 0; font-size: 0.82rem; font-weight: 700; }
.engine-info p { margin: 0; font-size: 0.72rem; color: var(--color-text-secondary); }

.footer-btns { display: flex; gap: 1.5rem; }

.footer-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: color 0.18s;
}
.footer-btn:hover { color: var(--color-accent); }
.footer-btn .material-symbols-outlined { font-size: 1.05rem !important; }

/* ── Responsive ──────────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .practice-header { flex-direction: column; align-items: flex-start; }
  .practice-title { font-size: 1.3rem; }
  .engine-card { padding: 1.5rem; gap: 1.5rem; }
  .answer-grid { grid-template-columns: 1fr; }
}
</style>
