<script setup>
import { computed, onMounted, ref } from 'vue';
import { useMetronome } from '../../composables/useMetronome';
import AppTooltip from '../ui/AppTooltip.vue';

const { bpm, setBpm, isTimerScheduled, timerRemainingMs } = useMetronome();
const favoriteBpms = ref([]);
const favoritesStorageKey = 'metronome-favorite-bpms';
const showManualInput = ref(false);
const manualBpmInput = ref('');
const manualInputError = ref('');

const decrease = () => setBpm(bpm.value - 1);
const increase = () => setBpm(bpm.value + 1);

// Visual ring calculation
const radius = 120;
const stroke = 8;
const normalizedRadius = radius - stroke * 2;
const circumference = normalizedRadius * 2 * Math.PI;
// Simple visual mapping: 20bpm = 0%, 250bpm = 100%
const progress = computed(() => {
    const min = 40;
    const max = 220;
    const val = Math.max(min, Math.min(max, bpm.value));
    const percentage = (val - min) / (max - min);
    return circumference - (percentage * circumference); // Stroke dashoffset
});

const timerLabel = computed(() => {
    const totalSeconds = Math.max(0, Math.ceil(timerRemainingMs.value / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const isFavorite = computed(() => favoriteBpms.value.includes(bpm.value));

const saveFavorites = () => {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(favoriteBpms.value));
};

const loadFavorites = () => {
    const raw = localStorage.getItem(favoritesStorageKey);
    if (!raw) return;
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        favoriteBpms.value = parsed
            .map((v) => Number(v))
            .filter((v) => Number.isInteger(v) && v >= 20 && v <= 300)
            .sort((a, b) => a - b)
            .slice(0, 12);
    } catch (_error) {
        favoriteBpms.value = [];
    }
};

const addCurrentBpmToFavorites = () => {
    if (isFavorite.value) return;
    favoriteBpms.value.push(bpm.value);
    favoriteBpms.value.sort((a, b) => a - b);
    favoriteBpms.value = favoriteBpms.value.slice(0, 12);
    saveFavorites();
};

const openManualInput = () => {
    showManualInput.value = true;
    manualBpmInput.value = '';
    manualInputError.value = '';
};

const addManualBpmToFavorites = () => {
    const value = Number(manualBpmInput.value);
    if (!Number.isInteger(value) || value < 20 || value > 300) {
        manualInputError.value = 'Ingresa un BPM entre 20 y 300.';
        return;
    }
    if (favoriteBpms.value.includes(value)) {
        manualInputError.value = 'Ese BPM ya está en favoritos.';
        return;
    }

    favoriteBpms.value.push(value);
    favoriteBpms.value.sort((a, b) => a - b);
    favoriteBpms.value = favoriteBpms.value.slice(0, 12);
    saveFavorites();

    showManualInput.value = false;
    manualBpmInput.value = '';
    manualInputError.value = '';
};

const cancelManualInput = () => {
    showManualInput.value = false;
    manualBpmInput.value = '';
    manualInputError.value = '';
};

const removeFavorite = (value) => {
    favoriteBpms.value = favoriteBpms.value.filter((item) => item !== value);
    saveFavorites();
};

onMounted(() => {
    loadFavorites();
});

</script>

<template>
  <div class="bpm-dial-container">
    <div class="dial-wrapper">
        <!-- Background Ring -->
        <svg :height="radius * 2" :width="radius * 2" class="ring-svg">
            <circle
                class="ring-bg"
                :stroke-width="stroke"
                stroke="transparent"
                :r="normalizedRadius"
                :cx="radius"
                :cy="radius"
            />
            <circle
                class="ring-progress"
                :stroke-width="stroke"
                fill="transparent"
                :r="normalizedRadius"
                :cx="radius"
                :cy="radius"
                :style="{ strokeDashoffset: progress }"
                :stroke-dasharray="circumference + ' ' + circumference"
            />
        </svg>
        
        <!-- Center Content -->
        <div class="dial-content">
            <div class="label">BPM</div>
            <div class="bpm-display">{{ bpm }}</div>
            <div class="controls">
                <button @click="decrease" class="icon-btn">−</button>
                <div class="divider">|</div>
                <button @click="increase" class="icon-btn">＋</button>
            </div>
        </div>
    </div>
    <div v-if="isTimerScheduled" class="timer-countdown">⏱ {{ timerLabel }}</div>

    <h3 class="favorites-subtitle">Favorite BPM</h3>
    <section class="favorites-panel">
        <div class="favorites-header">
            <div class="favorite-actions">
                <button
                    class="favorite-add-btn"
                    :disabled="isFavorite"
                    @click="addCurrentBpmToFavorites"
                >
                    {{ isFavorite ? 'Guardado' : 'Guardar BPM actual' }}
                </button>
                <AppTooltip text="Agregar BPM" position="top">
                    <button
                        class="favorite-plus-btn"
                        @click="openManualInput"
                        aria-label="Agregar BPM"
                    >
                        +
                    </button>
                </AppTooltip>
            </div>
        </div>
        <form v-if="showManualInput" class="manual-input-row" @submit.prevent="addManualBpmToFavorites">
            <input
                v-model.trim="manualBpmInput"
                type="number"
                min="20"
                max="300"
                step="1"
                class="manual-bpm-input"
                placeholder="Ej: 128"
            />
            <button type="submit" class="manual-save-btn">Agregar</button>
            <button type="button" class="manual-cancel-btn" @click="cancelManualInput">Cancelar</button>
        </form>
        <p v-if="manualInputError" class="manual-input-error">{{ manualInputError }}</p>

        <div v-if="favoriteBpms.length" class="favorite-list">
            <div
                v-for="value in favoriteBpms"
                :key="value"
                class="favorite-chip"
            >
                <button
                    class="favorite-value"
                    @click="setBpm(value)"
                    :title="`Usar ${value} BPM`"
                >
                    {{ value }}
                </button>
                <button
                    class="remove-chip"
                    title="Eliminar favorito"
                    @click="removeFavorite(value)"
                >
                    ×
                </button>
            </div>
        </div>
        <p v-else class="favorites-empty">Todavía no tienes BPM favoritos.</p>
    </section>
  </div>
</template>

<style scoped>
.bpm-dial-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    gap: 1rem;
}

.dial-wrapper {
    position: relative;
    width: 240px;
    height: 240px;
}

.ring-svg {
    transform: rotate(-90deg); /* Start from top */
}

.ring-bg {
    stroke: var(--color-ring-track);
}

.ring-progress {
    stroke: var(--color-accent);
    stroke-linecap: round;
    transition: stroke-dashoffset 0.35s;
}

.dial-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.label {
    color: #fff;
    font-size: 0.8rem;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
}

.bpm-display {
    font-size: 5rem;
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1;
}

.controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
}

.icon-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.2s;
}

.icon-btn:hover {
    color: #fff;
}

.divider {
    color: var(--color-panel-border);
}

.timer-countdown {
    margin-top: 0.9rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-primary);
    background: var(--color-surface-2);
    border: 1px solid var(--color-panel-border);
    border-radius: 999px;
    padding: 0.35rem 0.7rem;
}

.favorites-panel {
    width: min(360px, 100%);
    background: var(--color-overlay-soft);
    border: 1px solid var(--color-panel-border);
    border-radius: 10px;
    padding: 0.75rem;
}

.favorites-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
}

.favorites-subtitle {
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    font-weight: 700;
    width: min(360px, 100%);
    text-align: center;
}

.favorite-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.4rem;
    width: 100%;
}

.favorite-add-btn {
    border: 1px solid var(--color-panel-border);
    background: var(--color-surface-2);
    color: var(--color-text-primary);
    border-radius: 8px;
    font-size: 0.75rem;
    padding: 0.35rem 0.55rem;
    cursor: pointer;
}

.favorite-add-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.favorite-plus-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--color-panel-border);
    background: var(--color-surface-2);
    color: var(--color-text-primary);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
}

.favorite-plus-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.favorite-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.manual-input-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
}

.manual-bpm-input {
    flex: 1;
    min-width: 0;
    border: 1px solid var(--color-panel-border);
    background: var(--color-bg);
    color: var(--color-text-primary);
    border-radius: 8px;
    padding: 0.4rem 0.55rem;
}

.manual-save-btn,
.manual-cancel-btn {
    border: 1px solid var(--color-panel-border);
    border-radius: 8px;
    padding: 0.35rem 0.55rem;
    background: var(--color-surface-2);
    color: var(--color-text-primary);
    cursor: pointer;
    font-size: 0.75rem;
}

.manual-save-btn {
    background: var(--color-accent);
    color: var(--color-on-accent);
    border-color: var(--color-accent);
}

.manual-input-error {
    margin: 0 0 0.6rem;
    font-size: 0.78rem;
    color: #ef4444;
}

.favorite-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border: 1px solid var(--color-panel-border);
    background: var(--color-surface-1);
    color: var(--color-text-primary);
    border-radius: 999px;
    padding: 0.35rem 0.55rem;
    font-size: 0.82rem;
}

.favorite-chip:hover {
    border-color: var(--color-accent);
}

.favorite-value {
    border: none;
    background: transparent;
    color: var(--color-text-primary);
    cursor: pointer;
    font-size: 0.82rem;
}

.remove-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-panel-border);
    color: var(--color-text-primary);
    font-size: 0.78rem;
    line-height: 1;
    border: none;
    cursor: pointer;
}

.favorites-empty {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.82rem;
}
</style>
