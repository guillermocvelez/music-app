<script setup>
import { computed, ref } from 'vue';
import { useMetronome } from '../../composables/useMetronome';
import AppTooltip from '../ui/AppTooltip.vue';

const {
    isPlaying,
    togglePlay,
    startMetronome,
    isTimerScheduled,
    scheduleStopTimer,
    clearScheduledStopTimer,
    setBpm,
    bpm,
    volume,
    setVolume,
    precision,
    setPrecision
} = useMetronome();

const isTimerModalOpen = ref( false );
const timerMinutes = ref( 5 );
const timerSeconds = ref( 0 );
const timerError = ref( '' );

const timerButtonLabel = computed( () =>
{
    if ( !isTimerScheduled.value ) return 'TIMER';
    return 'ARMED';
} );

const openTimerModal = () =>
{
    timerError.value = '';
    isTimerModalOpen.value = true;
};

const closeTimerModal = () =>
{
    timerError.value = '';
    isTimerModalOpen.value = false;
};

const scheduleMetronomeTimer = () =>
{
    const minutes = Number( timerMinutes.value ) || 0;
    const seconds = Number( timerSeconds.value ) || 0;
    const totalMs = ( minutes * 60 + seconds ) * 1000;

    if ( totalMs <= 0 )
    {
        timerError.value = 'El tiempo debe ser mayor a 0 segundos.';
        return;
    }

    if ( !isPlaying.value )
    {
        startMetronome();
    }
    scheduleStopTimer( totalMs );

    closeTimerModal();
};

const cancelTimerProgram = () =>
{
    clearScheduledStopTimer();
    closeTimerModal();
};

// Tap Tempo Logic
let tapTimes = [];
const handleTap = () =>
{
    const now = Date.now();
    tapTimes.push( now );

    // Keep only last 4 taps
    if ( tapTimes.length > 4 ) tapTimes.shift(); // remove oldest

    if ( tapTimes.length > 1 )
    {
        // Calculate average interval
        let intervals = [];
        for ( let i = 1; i < tapTimes.length; i++ )
        {
            intervals.push( tapTimes[ i ] - tapTimes[ i - 1 ] );
        }

        // Remove interruptions (pauses > 2 sec)
        const lastInterval = intervals[ intervals.length - 1 ];
        if ( lastInterval > 2000 )
        {
            tapTimes = [ now ]; // Reset if too long pause
            return;
        }

        const avgInterval = intervals.reduce( ( a, b ) => a + b, 0 ) / intervals.length;
        const newBpm = Math.round( 60000 / avgInterval );
        setBpm( newBpm );
    }
}

</script>

<template>
    <div class="bottom-controls">
        <div class="left-group">
            <label>PRECISION {{ precision }}%</label>
            <input type="range" class="precision-slider" min="0" max="100" :value="precision"
                @input="setPrecision(Number($event.target.value))" />
        </div>

        <div class="center-group">
            <AppTooltip text="Toca varias veces para calcular el BPM promedio." position="top">
                <button class="control-btn" @click="handleTap">
                    <div class="icon-tap">👆</div>
                    <span>TAP TEMPO</span>
                </button>
            </AppTooltip>

            <button class="play-btn" @click="togglePlay" :class="{ 'is-playing': isPlaying }">
                <span v-if="!isPlaying" class="play-icon">▶</span>
                <span v-else class="pause-icon">❚❚</span>
            </button>

            <AppTooltip text="Programa cuánto tiempo debe sonar el metrónomo." position="top">
                <button class="control-btn" :class="{ armed: isTimerScheduled }" @click="openTimerModal">
                    <div class="icon-timer">⏱</div>
                    <span>{{ timerButtonLabel }}</span>
                </button>
            </AppTooltip>
        </div>

        <div class="right-group">
            <label>VOLUME</label>
            <div class="volume-slider-container">

                <input type="range" class="volume-slider" min="0" max="100" :value="volume"
                    @input="setVolume(Number($event.target.value))" />

            </div>
        </div>
    </div>

    <div v-if="isTimerModalOpen" class="timer-modal-overlay" @click.self="closeTimerModal">
        <div class="timer-modal" role="dialog" aria-modal="true" aria-labelledby="timer-modal-title">
            <h3 id="timer-modal-title">Programar Temporizador</h3>
            <p class="timer-description">El metrónomo se detendrá automáticamente cuando termine este tiempo.</p>

            <form class="timer-form" @submit.prevent="scheduleMetronomeTimer">
                <label for="timer-minutes">Minutos</label>
                <input id="timer-minutes" v-model.number="timerMinutes" type="number" min="0" max="180" />

                <label for="timer-seconds">Segundos</label>
                <input id="timer-seconds" v-model.number="timerSeconds" type="number" min="0" max="59" />

                <p v-if="timerError" class="timer-error">{{ timerError }}</p>

                <div class="timer-actions">
                    <button type="button" class="timer-cancel-btn" @click="cancelTimerProgram">Cancelar</button>
                    <button type="submit" class="timer-submit-btn">Programar</button>
                </div>
            </form>
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

.left-group,
.right-group {
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
    background: var(--color-surface-2);
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
    background: var(--color-surface-3);
    color: var(--color-text-primary);
}

.control-btn span {
    font-size: 0.6rem;
    font-weight: 700;
}

.control-btn.armed {
    color: var(--color-accent);
    border: 1px solid var(--color-accent);
}

.play-btn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--color-accent);
    border: none;
    color: var(--color-on-accent);
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(45, 212, 191, 0.2);
    transition: transform 0.1s, box-shadow 0.2s;
}

.play-btn>span {
    display: block;
    line-height: 1;
}

.play-icon {
    transform: translateX(2px);
}

.pause-icon {
    transform: translateX(0);
}

.play-btn:active {
    transform: scale(0.95);
}

.play-btn.is-playing {
    background: var(--color-text-primary);
    color: var(--color-panel);
    box-shadow: 0 0 30px rgba(45, 212, 191, 0.4);
}

.volume-slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.timer-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.timer-modal {
    width: min(420px, calc(100vw - 2rem));
    background: var(--color-panel);
    border: 1px solid var(--color-panel-border);
    border-radius: 12px;
    padding: 1rem;
    color: var(--color-text-primary);
}

.timer-modal h3 {
    margin: 0 0 0.4rem;
}

.timer-description {
    margin: 0 0 1rem;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.timer-form {
    display: grid;
    gap: 0.5rem;
}

.timer-form input {
    width: 100%;
    padding: 0.6rem;
    border-radius: 8px;
    border: 1px solid var(--color-panel-border);
    background: var(--color-bg);
    color: var(--color-text-primary);
}

.timer-error {
    margin: 0.25rem 0 0;
    color: #ef4444;
    font-size: 0.85rem;
}

.timer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.timer-cancel-btn,
.timer-submit-btn {
    border: none;
    border-radius: 8px;
    padding: 0.55rem 0.85rem;
    cursor: pointer;
}

.timer-cancel-btn {
    background: var(--color-surface-2);
    color: var(--color-text-primary);
}

.timer-submit-btn {
    background: var(--color-accent);
    color: var(--color-on-accent);
}

.bt-btn {
    background: var(--color-surface-2);
    border: none;
    padding: 8px;
    border-radius: 4px;
    color: var(--color-accent);
    font-size: 1.2rem;
    cursor: pointer;
}
</style>
