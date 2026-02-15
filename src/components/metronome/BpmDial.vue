<script setup>
import { computed } from 'vue';
import { useMetronome } from '../../composables/useMetronome';

const { bpm, setBpm } = useMetronome();

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
  </div>
</template>

<style scoped>
.bpm-dial-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
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
    stroke: var(--color-panel-border);
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
    color: var(--color-text-secondary);
    font-size: 0.8rem;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
}

.bpm-display {
    font-size: 5rem;
    font-weight: 700;
    color: #fff;
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
    color: var(--color-text-secondary);
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
</style>
