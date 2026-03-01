<script setup>
import { ref } from 'vue';

// ── Toolbar state ─────────────────────────────────────────────────────────────
const selectedDuration = ref('quarter');
const selectedRest = ref(null);
const selectedAccidental = ref(null);
const isDotted = ref(false);
const isTriplet = ref(false);
const isPlaying = ref(false);
const zoom = ref(100);

// ── Score setup ───────────────────────────────────────────────────────────────
const instrument = ref('Grand Piano');
const keySignature = ref('C Major');
const timeSignature = ref('4/4');
const orientation = ref('portrait');
const scoreTitle = ref('Untitled Score');
const composer = ref('theMusicTools User');

const instruments = ['Grand Piano', 'Acoustic Guitar', 'Violin Section', 'Flute Solo', 'Classical Guitar'];
const keySigs = ['C Major', 'G Major', 'D Major', 'F Major', 'Bb Major', 'A Minor'];
const timeSigs = ['4/4', '3/4', '6/8', '2/4'];
const dynamics = ['pp', 'p', 'mp', 'mf', 'f', 'ff'];

const durations = [
  { id: 'whole',         symbol: '𝅝',   label: 'Redonda (1)' },
  { id: 'half',          symbol: '𝅗𝅥',  label: 'Blanca (2)' },
  { id: 'quarter',       symbol: '𝅘𝅥',  label: 'Negra (4)' },
  { id: 'eighth',        symbol: '𝅘𝅥𝅮', label: 'Corchea (8)' },
  { id: 'sixteenth',     symbol: '𝅘𝅥𝅯', label: 'Semicorchea (16)' },
  { id: 'thirty-second', symbol: '𝅘𝅥𝅰', label: 'Fusa (32)' },
];

const rests = [
  { id: 'whole-rest',         symbol: '𝄻', label: 'Silencio redonda' },
  { id: 'half-rest',          symbol: '𝄼', label: 'Silencio blanca' },
  { id: 'quarter-rest',       symbol: '𝄽', label: 'Silencio negra' },
  { id: 'eighth-rest',        symbol: '𝄾', label: 'Silencio corchea' },
  { id: 'sixteenth-rest',     symbol: '𝄿', label: 'Silencio semicorchea' },
  { id: 'thirty-second-rest', symbol: '𝅀', label: 'Silencio fusa' },
];

const accidentals = [
  { id: 'sharp',   symbol: '♯', label: 'Sostenido' },
  { id: 'flat',    symbol: '♭', label: 'Bemol' },
  { id: 'natural', symbol: '♮', label: 'Natural' },
];

function selectDuration(id) {
  selectedDuration.value = id;
  selectedRest.value = null;
}
function selectRest(id) {
  selectedRest.value = selectedRest.value === id ? null : id;
  if (selectedRest.value) selectedDuration.value = null;
}
function toggleAccidental(id) {
  selectedAccidental.value = selectedAccidental.value === id ? null : id;
}
</script>

<template>
  <div class="sm-view">

    <!-- ── Toolbar ────────────────────────────────────────────── -->
    <div class="sm-toolbar">
      <div class="toolbar-tools">

        <!-- Select tool -->
        <button class="tool-btn" title="Seleccionar">
          <span class="material-symbols-outlined">near_me</span>
        </button>
        <div class="tsep"></div>

        <!-- Note durations -->
        <div class="tool-group">
          <button
            v-for="d in durations" :key="d.id"
            class="tool-btn music-sym"
            :class="{ active: selectedDuration === d.id }"
            :title="d.label"
            @click="selectDuration(d.id)"
          >{{ d.symbol }}</button>
        </div>
        <div class="tsep"></div>

        <!-- Rests -->
        <div class="tool-group">
          <button
            v-for="r in rests" :key="r.id"
            class="tool-btn music-sym"
            :class="{ active: selectedRest === r.id }"
            :title="r.label"
            @click="selectRest(r.id)"
          >{{ r.symbol }}</button>
        </div>
        <div class="tsep"></div>

        <!-- Modifiers -->
        <div class="tool-group">
          <button class="tool-btn dot-btn" :class="{ active: isDotted }" title="Puntillo" @click="isDotted = !isDotted">
            <span>.</span>
          </button>
          <button class="tool-btn triplet-btn" :class="{ active: isTriplet }" title="Tresillo" @click="isTriplet = !isTriplet">
            <span>3</span>
          </button>
        </div>
        <div class="tsep"></div>

        <!-- Accidentals -->
        <div class="tool-group">
          <button
            v-for="a in accidentals" :key="a.id"
            class="tool-btn music-sym"
            :class="{ active: selectedAccidental === a.id }"
            :title="a.label"
            @click="toggleAccidental(a.id)"
          >{{ a.symbol }}</button>
        </div>
        <div class="tsep"></div>

        <!-- Dynamics -->
        <div class="tool-group">
          <button v-for="d in dynamics" :key="d" class="tool-btn dynamic-btn" :title="d">
            {{ d }}
          </button>
        </div>
      </div>

      <!-- Right: actions + zoom -->
      <div class="toolbar-actions">
        <div class="undo-redo">
          <button class="action-pill-btn">Deshacer</button>
          <button class="action-pill-btn">Rehacer</button>
        </div>
        <button class="playback-btn" :class="{ playing: isPlaying }" @click="isPlaying = !isPlaying">
          <span class="material-symbols-outlined">{{ isPlaying ? 'stop' : 'play_arrow' }}</span>
          {{ isPlaying ? 'Detener' : 'Reproducir' }}
        </button>
        <div class="zoom-display">
          <span class="zoom-label">Zoom</span>
          <span class="zoom-val">{{ zoom }}%</span>
        </div>
      </div>
    </div>

    <!-- ── Main area ──────────────────────────────────────────── -->
    <div class="sm-main">

      <!-- Left panel -->
      <aside class="sm-left">
        <section class="panel-section">
          <h3 class="panel-title">Score Setup</h3>

          <div class="panel-field">
            <label class="field-label">Instrumento</label>
            <select v-model="instrument" class="field-select">
              <option v-for="inst in instruments" :key="inst">{{ inst }}</option>
            </select>
          </div>

          <div class="panel-field">
            <label class="field-label">Armadura</label>
            <div class="key-grid">
              <button
                v-for="k in keySigs" :key="k"
                class="grid-btn"
                :class="{ active: keySignature === k }"
                @click="keySignature = k"
              >{{ k }}</button>
            </div>
          </div>

          <div class="panel-field">
            <label class="field-label">Compás</label>
            <div class="row-btns">
              <button
                v-for="ts in timeSigs" :key="ts"
                class="grid-btn"
                :class="{ active: timeSignature === ts }"
                @click="timeSignature = ts"
              >{{ ts }}</button>
            </div>
          </div>
        </section>

        <section class="panel-section bordered">
          <h3 class="panel-title muted">Elementos</h3>
          <div class="elements-grid">
            <button class="element-btn">
              <span class="material-symbols-outlined">text_fields</span>
              <span>Letra</span>
            </button>
            <button class="element-btn">
              <span class="material-symbols-outlined">format_overline</span>
              <span>Ligadura</span>
            </button>
            <button class="element-btn">
              <span class="material-symbols-outlined">expand</span>
              <span>Crescendo</span>
            </button>
            <button class="element-btn">
              <span class="material-symbols-outlined">radio_button_checked</span>
              <span>Fermata</span>
            </button>
          </div>
        </section>
      </aside>

      <!-- Score canvas -->
      <main class="sm-canvas">
        <div class="score-paper" :class="{ landscape: orientation === 'landscape' }">

          <div class="score-header">
            <h1 class="score-title">{{ scoreTitle }}</h1>
            <p class="score-composer">Composed by {{ composer }}</p>
          </div>

          <div class="staff-systems">
            <div v-for="n in 3" :key="n" class="staff-system">
              <div class="staff-left-gutter">
                <span class="clef">𝄞</span>
                <div v-if="n === 1" class="time-sig">
                  <span>{{ timeSignature.split('/')[0] }}</span>
                  <span>{{ timeSignature.split('/')[1] }}</span>
                </div>
              </div>

              <div class="staff-body">
                <div class="staff-lines">
                  <div v-for="l in 5" :key="l" class="staff-line"></div>
                </div>
                <!-- Example note on first system -->
                <div v-if="n === 1" class="note-head"></div>
                <div v-if="n === 1" class="note-stem"></div>
              </div>

              <div class="barline-end"></div>
            </div>
          </div>

          <div class="page-number">1</div>
        </div>
      </main>

      <!-- Right panel -->
      <aside class="sm-right">
        <section class="panel-section">
          <h3 class="panel-title muted">Propiedades</h3>

          <div class="panel-field">
            <label class="field-label">Orientación</label>
            <div class="toggle-row">
              <button class="toggle-btn" :class="{ active: orientation === 'portrait' }" @click="orientation = 'portrait'">Vertical</button>
              <button class="toggle-btn" :class="{ active: orientation === 'landscape' }" @click="orientation = 'landscape'">Horizontal</button>
            </div>
          </div>

          <div class="panel-field">
            <label class="field-label">Espaciado de Pentagrama</label>
            <input type="range" class="field-range" min="1" max="100" value="50" />
          </div>

          <div class="panel-field">
            <label class="field-label">Zoom</label>
            <input type="range" class="field-range" min="50" max="200" v-model="zoom" />
          </div>
        </section>

        <section class="export-section">
          <h3 class="panel-title muted">Exportar</h3>
          <div class="export-list">
            <button class="export-btn">
              <div class="export-info">
                <span class="material-symbols-outlined">picture_as_pdf</span>
                <span>PDF</span>
              </div>
              <span class="material-symbols-outlined export-icon">download</span>
            </button>
            <button class="export-btn">
              <div class="export-info">
                <span class="material-symbols-outlined">code</span>
                <span>MusicXML</span>
              </div>
              <span class="material-symbols-outlined export-icon">download</span>
            </button>
            <button class="export-btn">
              <div class="export-info">
                <span class="material-symbols-outlined">audio_file</span>
                <span>MIDI</span>
              </div>
              <span class="material-symbols-outlined export-icon">download</span>
            </button>
          </div>
          <button class="share-btn">
            <span class="material-symbols-outlined">share</span>
            Compartir enlace
          </button>
        </section>
      </aside>
    </div>

    <!-- ── Status bar ─────────────────────────────────────────── -->
    <footer class="sm-statusbar">
      <div class="status-left">
        <span class="status-dot"></span>
        <span>Guardado en la nube</span>
        <span class="status-sep">|</span>
        <span>Compás 1, Tiempo 1</span>
      </div>
      <div class="status-right">
        <span>{{ instrument }}</span>
        <span class="status-sep">|</span>
        <span>Atajos de teclado (H)</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ── Root ────────────────────────────────────────────────────────────────────── */
.sm-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg);
}

/* ── Toolbar ─────────────────────────────────────────────────────────────────── */
.sm-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  height: 48px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-panel-border);
  background: var(--color-panel);
  overflow-x: auto;
  gap: 1rem;
}

.toolbar-tools {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.tsep {
  width: 1px;
  height: 24px;
  background: var(--color-panel-border);
  margin: 0 0.5rem;
  flex-shrink: 0;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.tool-btn.active {
  background: rgba(255, 107, 0, 0.15);
  border-color: rgba(255, 107, 0, 0.4);
  color: var(--color-accent);
}

.tool-btn .material-symbols-outlined {
  font-size: 1.1rem !important;
}

/* Music symbol buttons */
.music-sym {
  font-family: serif;
  font-size: 1.35rem;
  line-height: 1;
}

/* Dot / triplet */
.dot-btn span {
  font-size: 1.6rem;
  line-height: 0.5;
  font-weight: 900;
  margin-top: -4px;
}

.triplet-btn span {
  font-size: 0.65rem;
  font-weight: 900;
  border: 1px solid currentColor;
  padding: 0 3px;
  border-radius: 3px;
}

/* Dynamics */
.dynamic-btn {
  font-family: 'Times New Roman', serif;
  font-style: italic;
  font-size: 0.9rem;
  font-weight: 700;
  width: auto;
  padding: 0 0.35rem;
}

/* Toolbar right */
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.undo-redo {
  display: flex;
  background: var(--color-bg);
  border: 1px solid var(--color-panel-border);
  border-radius: 8px;
  overflow: hidden;
}

.action-pill-btn {
  padding: 0.3rem 0.7rem;
  font-size: 0.72rem;
  font-weight: 700;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.15s;
}

.action-pill-btn:hover {
  color: var(--color-text-primary);
}

.playback-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  background: var(--color-accent);
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
}

.playback-btn:hover { opacity: 0.9; transform: scale(1.02); }
.playback-btn.playing { background: #ef4444; color: #fff; }
.playback-btn .material-symbols-outlined { font-size: 0.9rem !important; }

.zoom-display {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  background: var(--color-bg);
  border: 1px solid var(--color-panel-border);
  border-radius: 8px;
}

.zoom-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.zoom-val {
  font-size: 0.75rem;
  font-weight: 600;
}

/* ── Main ────────────────────────────────────────────────────────────────────── */
.sm-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── Left Panel ──────────────────────────────────────────────────────────────── */
.sm-left {
  width: 240px;
  flex-shrink: 0;
  border-right: 1px solid var(--color-panel-border);
  background: var(--color-bg);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.panel-section {
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-section.bordered {
  border-top: 1px solid var(--color-panel-border);
}

.panel-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0;
}

.panel-title.muted { color: var(--color-text-secondary); }

.panel-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.field-select {
  width: 100%;
  background: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: 0.82rem;
  padding: 0.45rem 0.6rem;
  cursor: pointer;
  outline: none;
}

.field-select:focus { border-color: var(--color-accent); }

.key-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}

.row-btns {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.grid-btn {
  padding: 0.4rem 0.5rem;
  background: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  border-radius: 7px;
  color: var(--color-text-primary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  text-align: center;
}

.grid-btn:hover { border-color: var(--color-accent); }
.grid-btn.active {
  border-color: var(--color-accent);
  background: rgba(255, 107, 0, 0.1);
  color: var(--color-accent);
}

.elements-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.element-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.65rem 0.5rem;
  background: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  border-radius: 10px;
  color: var(--color-text-secondary);
  font-size: 0.62rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.element-btn .material-symbols-outlined { font-size: 1.2rem !important; }
.element-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }

/* ── Score Canvas ────────────────────────────────────────────────────────────── */
.sm-canvas {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2.5rem;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.03) 0%, transparent 60%),
    #1c1c1c;
}

/* White paper */
.score-paper {
  width: 816px;
  min-height: 1056px;
  background: #ffffff;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0,0,0,0.3);
  border-radius: 2px;
  padding: 80px 80px 60px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.score-paper.landscape {
  width: 1056px;
  min-height: 816px;
}

.score-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.score-title {
  font-family: 'Times New Roman', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 0.3rem;
}

.score-composer {
  font-family: 'Times New Roman', serif;
  font-size: 0.85rem;
  color: #444;
  margin: 0;
}

/* Staff systems */
.staff-systems {
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.staff-system {
  display: flex;
  align-items: flex-start;
  position: relative;
}

.staff-left-gutter {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 4px;
}

.clef {
  font-family: 'Times New Roman', serif;
  font-style: italic;
  font-size: 2.8rem;
  color: #111;
  line-height: 1;
  margin-right: 2px;
  margin-top: -12px;
}

.time-sig {
  display: flex;
  flex-direction: column;
  line-height: 1;
  font-size: 1.1rem;
  font-weight: 900;
  color: #111;
  font-family: 'Times New Roman', serif;
  margin-top: -2px;
  margin-right: 6px;
}

.staff-body {
  flex: 1;
  position: relative;
}

.staff-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.staff-line {
  height: 1px;
  background: #111;
  width: 100%;
}

/* Example quarter note */
.note-head {
  position: absolute;
  left: 80px;
  top: 20px;
  width: 12px;
  height: 9px;
  background: #111;
  border-radius: 50%;
  transform: rotate(-15deg);
}

.note-stem {
  position: absolute;
  left: 91px;
  top: -8px;
  width: 1.5px;
  height: 28px;
  background: #111;
}

.barline-end {
  width: 1.5px;
  height: 45px;
  background: #111;
  flex-shrink: 0;
  margin-top: 0;
}

.page-number {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Times New Roman', serif;
  font-size: 0.85rem;
  color: #888;
}

/* ── Right Panel ─────────────────────────────────────────────────────────────── */
.sm-right {
  width: 256px;
  flex-shrink: 0;
  border-left: 1px solid var(--color-panel-border);
  background: var(--color-bg);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.toggle-row {
  display: flex;
  background: var(--color-panel);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.toggle-btn {
  flex: 1;
  padding: 0.3rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.toggle-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.field-range {
  width: 100%;
  accent-color: var(--color-accent);
  cursor: pointer;
}

/* Export */
.export-section {
  padding: 1.1rem;
  margin-top: auto;
  border-top: 1px solid var(--color-panel-border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.export-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.export-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0.85rem;
  background: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  border-radius: 10px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: border-color 0.15s;
  width: 100%;
}

.export-btn:hover { border-color: var(--color-accent); }

.export-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.82rem;
  font-weight: 500;
}

.export-info .material-symbols-outlined { font-size: 1.1rem !important; color: var(--color-text-secondary); }
.export-btn:hover .export-info .material-symbols-outlined { color: var(--color-accent); }

.export-icon { font-size: 0.9rem !important; color: var(--color-text-secondary); }

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.75rem;
  background: var(--color-accent);
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
  box-shadow: 0 4px 16px rgba(255, 107, 0, 0.25);
}

.share-btn:hover { opacity: 0.9; transform: scale(1.02); }
.share-btn .material-symbols-outlined { font-size: 1rem !important; }

/* ── Status bar ──────────────────────────────────────────────────────────────── */
.sm-statusbar {
  height: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-top: 1px solid var(--color-panel-border);
  background: var(--color-bg);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
}

.status-sep {
  opacity: 0.3;
}
</style>
