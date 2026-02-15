<script setup>
import { useMetronome } from '../../composables/useMetronome';

const { isPlaying, togglePlay, setBpm, bpm } = useMetronome();

// Tap Tempo Logic
let tapTimes = [];
const handleTap = () => {
    const now = Date.now();
    tapTimes.push(now);
    
    // Keep only last 4 taps
    if (tapTimes.length > 4) tapTimes.shift(); // remove oldest
    
    if (tapTimes.length > 1) {
        // Calculate average interval
        let intervals = [];
        for(let i=1; i < tapTimes.length; i++) {
             intervals.push(tapTimes[i] - tapTimes[i-1]);
        }
        
        // Remove interruptions (pauses > 2 sec)
        const lastInterval = intervals[intervals.length-1];
        if (lastInterval > 2000) {
            tapTimes = [now]; // Reset if too long pause
            return;
        }
        
        const avgInterval = intervals.reduce((a,b) => a+b, 0) / intervals.length;
        const newBpm = Math.round(60000 / avgInterval);
        setBpm(newBpm);
    }
}

</script>

<template>
  <div class="bottom-controls">
    <div class="left-group">
        <label>PRECISION SLIDER</label>
        <input type="range" class="precision-slider" min="0" max="100" />
    </div>

    <div class="center-group">
        <button class="control-btn" @click="handleTap">
            <div class="icon-tap">👆</div>
            <span>TAP TEMPO</span>
        </button>

        <button class="play-btn" @click="togglePlay" :class="{ 'is-playing': isPlaying }">
            <span v-if="!isPlaying">▶</span>
            <span v-else>❚❚</span>
        </button>

        <button class="control-btn">
            <div class="icon-timer">⏱</div>
            <span>TIMER</span>
        </button>
    </div>

    <div class="right-group">
        <label>VOLUME</label>
        <div class="volume-slider-container">
             <span class="vol-icon">🔈</span>
             <input type="range" class="volume-slider" min="0" max="100" />
             <span class="vol-icon">🔊</span>
        </div>
        <button class="bt-btn">Bluetooth</button>
    </div>
  </div>
</template>

<style scoped>
.bottom-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    color: var(--color-text-secondary);
}

.left-group, .right-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 250px;
}
.right-group {
    align-items: flex-end;
}

label {
    font-size: 0.7rem;
    letter-spacing: 1px;
    font-weight: 600;
    color: var(--color-text-muted);
}

/* Sliders */
input[type=range] {
    width: 100%;
    accent-color: var(--color-accent);
    background: transparent;
    cursor: pointer;
}

.center-group {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.control-btn {
    background: #1f232c;
    border: none;
    border-radius: 8px;
    width: 60px;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.control-btn:hover {
    background: #2a303c;
    color: #fff;
}

.control-btn span {
    font-size: 0.6rem;
    font-weight: 700;
}

.play-btn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--color-accent);
    border: none;
    color: #000;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(45,212,191,0.2);
    transition: transform 0.1s, box-shadow 0.2s;
}

.play-btn:active {
    transform: scale(0.95);
}

.play-btn.is-playing {
    background: #fff; /* Or Keep accent */
    box-shadow: 0 0 30px rgba(45,212,191,0.4);
}

.volume-slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bt-btn {
   background: #1f232c;
   border: none;
   padding: 8px;
   border-radius: 4px;
   color: var(--color-accent);
   font-size: 1.2rem;
   cursor: pointer;
}
</style>
