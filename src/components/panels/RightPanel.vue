<script setup>
import { useMetronome } from '../../composables/useMetronome';

const { timeSignature, subdivision, clickSound } = useMetronome();

const signatures = [
    { num: 2, den: 4, label: '2 / 4' },
    { num: 3, den: 4, label: '3 / 4' },
    { num: 4, den: 4, label: '4 / 4' },
    { num: 5, den: 4, label: '5 / 4' },
    { num: 6, den: 8, label: '6 / 8' },
    { num: 7, den: 8, label: '7 / 8' },
    { num: 9, den: 8, label: '9 / 8' },
    { num: 12, den: 8, label: '12 / 8' },
];

const setSignature = (s) => {
    timeSignature.value = { numerator: s.num, denominator: s.den };
};

const isSelected = (s) => s.num === timeSignature.value.numerator && s.den === timeSignature.value.denominator;

</script>

<template>
  <div class="right-panel-content">
    
    <!-- Time Signatures -->
    <section>
        <h3 class="section-title">TIME SIGNATURES</h3>
        <div class="grid-2">
            <button 
                v-for="sig in signatures" 
                :key="sig.label"
                class="sig-btn"
                :class="{ active: isSelected(sig) }"
                @click="setSignature(sig)"
            >
                {{ sig.label }}
            </button>
        </div>
    </section>

    <!-- Subdivisions -->
    <section>
        <h3 class="section-title">SUBDIVISIONS</h3>
        <div class="list-options">
            <div class="option-row" @click="subdivision = 1">
                <span>Quarter Notes</span>
                <div class="check" :class="{ active: subdivision === 1 }"></div>
            </div>
            <div class="option-row" @click="subdivision = 2">
                <span>Eighth Notes</span>
                <div class="check" :class="{ active: subdivision === 2 }"></div>
            </div>
             <div class="option-row" @click="subdivision = 3">
                <span>Triplets</span>
                <div class="check" :class="{ active: subdivision === 3 }"></div>
            </div>
        </div>
    </section>

    <!-- Click Sound -->
    <section>
        <h3 class="section-title">CLICK SOUND</h3>
        <div class="sound-selector">
            <button class="sound-btn" :class="{ active: clickSound === 'woodblock' }" @click="clickSound = 'woodblock'">WOODBLOCK</button>
            <button class="sound-btn" :class="{ active: clickSound === 'digital' }" @click="clickSound = 'digital'">DIGITAL</button>
            <button class="sound-btn" :class="{ active: clickSound === 'snare' }" @click="clickSound = 'snare'">SNARE</button>
        </div>
    </section>

  </div>
</template>

<style scoped>
.right-panel-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.section-title {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    letter-spacing: 1px;
    margin-bottom: 1rem;
    font-weight: 600;
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.sig-btn {
    background: transparent;
    border: 1px solid var(--color-panel-border);
    color: #fff;
    padding: 0.8rem;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
}

.sig-btn:hover {
    border-color: var(--color-text-secondary);
}

.sig-btn.active {
    border-color: var(--color-accent);
    color: var(--color-accent);
    box-shadow: 0 0 10px rgba(45,212,191,0.1);
}

/* Subdivisions */
.list-options {
    background: #111317; /* Slight darker */
    border-radius: 8px;
    overflow: hidden;
}

.option-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    border-bottom: 1px solid var(--color-panel-border);
    transition: background 0.2s;
}
.option-row:hover {
    background: #1a1d24;
}
.option-row:last-child {
    border-bottom: none;
}

.check {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--color-text-secondary);
}
.check.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    position: relative;
}
.check.active::after {
    content: '✔'; /* Simplified check */
    color: #000;
    font-size: 0.7rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}

/* Sounds */
.sound-selector {
    background: #1a1e26;
    padding: 0.5rem;
    border-radius: 20px;
    display: flex;
    gap: 0.5rem;
}

.sound-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    padding: 0.5rem;
    border-radius: 16px;
    font-size: 0.7rem;
    cursor: pointer;
    font-weight: 700;
}
.sound-btn.active {
    background: var(--color-accent);
    color: #000;
}
</style>
