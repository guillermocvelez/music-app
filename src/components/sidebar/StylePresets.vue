<script setup>
import { useMetronome } from '../../composables/useMetronome';

const { setBpm, bpm } = useMetronome();

const presets = [
    { name: 'Largo', range: '40-60', bpm: 50 },
    { name: 'Adagio', range: '66-76', bpm: 70 },
    { name: 'Andante', range: '76-108', bpm: 90 },
    { name: 'Moderato', range: '108-120', bpm: 110 },
    { name: 'Allegro', range: '120-156', bpm: 140 },
    { name: 'Presto', range: '168-200', bpm: 180 },
];

const isActive = (p) => {
    // Check if current BPM falls in range? Or just simple active state if matched exact preset?
    // Let's check range for active highlight, it feels more "smart".
    const [min, max] = p.range.split('-').map(Number);
    return bpm.value >= min && bpm.value <= max;
};

</script>

<template>
  <div class="sidebar-content">
      <h3 class="section-title">STYLE PRESETS</h3>
      <div class="presets-list">
          <div 
            v-for="preset in presets" 
            :key="preset.name" 
            class="preset-item"
            :class="{ active: isActive(preset) }"
            @click="setBpm(preset.bpm)"
          >
              <div class="preset-icon">
                  <!-- Simple icon or based on name -->
                  <div class="icon-circle"></div>
              </div>
              <span class="preset-name">{{ preset.name }}</span>
              <span class="preset-range">{{ preset.range }}</span>
          </div>
      </div>
  </div>
</template>

<style scoped>
.sidebar-content {
    display: flex;
    flex-direction: column;
}

.section-title {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    letter-spacing: 1px;
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.presets-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.preset-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
}

.preset-item:hover {
    background: rgba(255,255,255,0.03);
}

.preset-item.active {
    background: rgba(45,212,191,0.05); /* Very subtle tint */
    border: 1px solid rgba(45,212,191,0.3); /* Border like in image design */
}

/* Icon */
.preset-icon {
    width: 24px;
    height: 24px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2a2e38;
}

.active .icon-circle {
    background: var(--color-accent);
    box-shadow: 0 0 8px var(--color-accent-glow);
}

.preset-name {
    flex: 1;
    font-weight: 600;
    color: #fff;
    font-size: 0.95rem;
}

.active .preset-name {
    color: var(--color-accent);
}

.preset-range {
    font-size: 0.8rem;
    color: var(--color-text-muted);
}
</style>
