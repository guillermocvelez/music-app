<script setup>
import { ref } from 'vue';
import { useEarTraining } from '../../composables/useEarTraining';

const { generateExercise, playExercise, NOTES } = useEarTraining();

const tonalidad = ref('C');
const tipo = ref('intervalo');
const dificultad = ref(1);
const rango = ref('within_octave');

const exerciseResult = ref(null);
const isRevealed = ref(false);

const generate = () => {
  isRevealed.value = false;
  exerciseResult.value = generateExercise({
    tonalidad: tonalidad.value,
    tipo: tipo.value,
    dificultad: dificultad.value,
    rango: rango.value
  });
  play();
};

const play = () => {
  if (exerciseResult.value) {
    playExercise(exerciseResult.value);
  }
};

const reveal = () => {
  isRevealed.value = true;
};
</script>

<template>
  <div class="ear-training-container">
    <div class="controls-panel">
      <h2>Ear Training</h2>
      
      <div class="control-group">
        <label>Tonalidad (Key)</label>
        <select v-model="tonalidad">
          <option v-for="note in NOTES" :key="note" :value="note">{{ note }}</option>
          <option value="Random">Random</option>
        </select>
      </div>

      <div class="control-group">
        <label>Tipo (Type)</label>
        <select v-model="tipo">
          <option value="intervalo">Intervalo</option>
          <option value="acorde">Acorde</option>
          <option value="progresión">Progresión</option>
        </select>
      </div>

      <div class="control-group">
        <label>Dificultad (1-5)</label>
        <input type="range" v-model.number="dificultad" min="1" max="5" />
        <span>{{ dificultad }}</span>
      </div>

      <div class="control-group">
        <label>Rango</label>
        <div class="toggle-switch">
          <label>
            <input type="radio" value="within_octave" v-model="rango"> Within Octave
          </label>
          <label>
            <input type="radio" value="extended" v-model="rango"> Extended
          </label>
        </div>
      </div>

      <button @click="generate" class="generate-btn">Generate Exercise</button>
    </div>

    <div class="result-panel" v-if="exerciseResult">
      <h3>Exercise</h3>
      
      <div class="action-buttons">
          <button @click="play" class="action-btn play-btn">▶ Play Again</button>
          <button v-if="!isRevealed" @click="reveal" class="action-btn reveal-btn">👁 Reveal Answer</button>
      </div>

      <div class="result-content" v-if="isRevealed">
        <pre>{{ JSON.stringify(exerciseResult, null, 2) }}</pre>
        
        <div class="result-details">
            <div class="detail-item">
            <span class="label">Notas:</span>
            <span class="value">{{ exerciseResult.notas }}</span>
            </div>
            <div class="detail-item">
            <span class="label">Intervalo/Acorde:</span>
            <span class="value">{{ exerciseResult.intervalo }}</span>
            </div>
            <div class="detail-item">
            <span class="label">Grado:</span>
            <span class="value">{{ exerciseResult.grado }}</span>
            </div>
            <div class="detail-item">
            <span class="label">Explicación:</span>
            <span class="value">{{ exerciseResult.explicación }}</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ear-training-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  color: var(--color-text-primary);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--color-panel-border);
}

h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-accent);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

select, input[type="range"] {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-panel-border);
  color: var(--color-text-primary);
  padding: 0.5rem;
  border-radius: 6px;
}

.generate-btn {
  background-color: var(--color-accent);
  color: #000;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.generate-btn:hover {
  opacity: 0.9;
}

.result-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--color-panel-border);
}

.action-buttons {
    display: flex;
    gap: 1rem;
}

.action-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: 1px solid var(--color-panel-border);
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text-primary);
    transition: background 0.2s;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.play-btn {
    background: rgba(45, 212, 191, 0.2);
    border-color: rgba(45, 212, 191, 0.5);
}

.reveal-btn {
    background: rgba(255, 255, 255, 0.1);
}

pre {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  overflow-x: auto;
}

.result-details {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.detail-item .label {
  color: var(--color-text-secondary);
}
</style>
