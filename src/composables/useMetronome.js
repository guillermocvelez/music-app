import { ref, watch } from 'vue';

const bpm = ref(92);
const isPlaying = ref(false);
const timeSignature = ref({ numerator: 4, denominator: 4 });
const subdivision = ref(1); // 1 = quarter, 2 = eighth, 3 = triplet, 4 = sixteenth
const clickSound = ref('woodblock'); // woodblock, digital, snare
const volume = ref(80); // 0-100
const precision = ref(100); // 0-100 (100 = exact timing)
const isTimerScheduled = ref(false);
const timerRemainingMs = ref(0);

// Audio Context (initialized on user action)
let audioContext = null;
let nextNoteTime = 0.0;
let timerID = null;
let beatCount = 0;
let noiseBuffer = null;
let masterGain = null;
let hasVolumeWatcher = false;
let stopTimerId = null;
let countdownIntervalId = null;

const lookahead = 25.0; 
const scheduleAheadTime = 0.1;

export function useMetronome() {

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioContext.createGain();
      masterGain.connect(audioContext.destination);
      masterGain.gain.value = volume.value / 100;
      
      // Create Noise Buffer for Snare
      const bufferSize = audioContext.sampleRate * 2.0; // 2 seconds
      noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
  }

  function nextNote() {
    // Logic for next note time calculation
    const notesPerBeat = (subdivision.value === 3 ? 3 : subdivision.value);
    const secondsPerBeat = 60.0 / bpm.value;
    const interval = secondsPerBeat / notesPerBeat;
    const looseness = (100 - precision.value) / 100;
    const jitterRange = interval * looseness * 0.08; // max +/-8% deviation
    const jitter = (Math.random() * 2 - 1) * jitterRange;
    const adjustedInterval = Math.max(interval * 0.5, interval + jitter);
    
    nextNoteTime += adjustedInterval;
    beatCount++;
    
    // Reset beat count at measure end
    const measureLength = timeSignature.value.numerator * notesPerBeat;
    if (beatCount >= measureLength) {
        beatCount = 0;
    }
  }

  function playOscillator(time, freq, type, decay, volume = 1.0) {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.frequency.value = freq;
    osc.type = type;

    gainNode.gain.setValueAtTime(volume, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.start(time);
    osc.stop(time + decay);
  }

  function playNoise(time, decay) {
     const noise = audioContext.createBufferSource();
     noise.buffer = noiseBuffer;
     const noiseFilter = audioContext.createBiquadFilter();
     noiseFilter.type = 'highpass';
     noiseFilter.frequency.value = 1000;
     const noiseEnvelope = audioContext.createGain();
     
     noise.connect(noiseFilter);
     noiseFilter.connect(noiseEnvelope);
     noiseEnvelope.connect(masterGain);
     
     noiseEnvelope.gain.setValueAtTime(1, time);
     noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + decay);
     
     noise.start(time);
     noise.stop(time + decay);
  }

  function scheduleNote(beatNumber, time) {
    // Determine accent
    const notesPerBeat = (subdivision.value === 3 ? 3 : subdivision.value);
    const measureLength = timeSignature.value.numerator * notesPerBeat;
    const isMeasureDownbeat = (beatNumber % measureLength === 0);
    const isQuarterDownbeat = (beatNumber % notesPerBeat === 0);

    // Frequencies / Synthesis based on ClickSound
    if (clickSound.value === 'woodblock') {
         // Woodblock: high sine/triangle (Now louder and sharper)
        const freq = isMeasureDownbeat ? 1200 : (isQuarterDownbeat ? 800 : 600);
        playOscillator(time, freq, 'triangle', 0.1, 1.5);
    
    } else if (clickSound.value === 'digital') {
        // Digital: Square beep
        const freq = isMeasureDownbeat ? 880 : (isQuarterDownbeat ? 440 : 220);
        playOscillator(time, freq, 'square', 0.05);
    
    } else if (clickSound.value === 'snare') {
        // Snare: Noise burst + tone
        if(isMeasureDownbeat) playOscillator(time, 400, 'triangle', 0.1); // Kick-ish
        playNoise(time, 0.1);
    }
  }

  function scheduler() {
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        scheduleNote(beatCount, nextNoteTime);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
  }

  function clearScheduledStopTimer() {
    if (stopTimerId !== null) {
      window.clearTimeout(stopTimerId);
      stopTimerId = null;
    }

    if (countdownIntervalId !== null) {
      window.clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    }

    isTimerScheduled.value = false;
    timerRemainingMs.value = 0;
  }

  function scheduleStopTimer(totalMs) {
    if (!Number.isFinite(totalMs) || totalMs <= 0) return false;

    clearScheduledStopTimer();

    const endAt = Date.now() + totalMs;
    isTimerScheduled.value = true;
    timerRemainingMs.value = totalMs;

    countdownIntervalId = window.setInterval(() => {
      const remaining = Math.max(0, endAt - Date.now());
      timerRemainingMs.value = remaining;
      if (remaining <= 0) {
        if (countdownIntervalId !== null) {
          window.clearInterval(countdownIntervalId);
          countdownIntervalId = null;
        }
      }
    }, 250);

    stopTimerId = window.setTimeout(() => {
      stopMetronome();
      clearScheduledStopTimer();
    }, totalMs);

    return true;
  }

  function startMetronome() {
    if (isPlaying.value) return;

    isPlaying.value = true;
    initAudio();
    if(audioContext.state === 'suspended') {
        audioContext.resume();
    }
    beatCount = 0;
    nextNoteTime = audioContext.currentTime + 0.1;
    scheduler();
  }

  function stopMetronome() {
    if (!isPlaying.value) return;

    isPlaying.value = false;
    if (timerID !== null) {
      window.clearTimeout(timerID);
      timerID = null;
    }
    clearScheduledStopTimer();
  }

  function togglePlay() {
    if (isPlaying.value) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }

  function setBpm(val) {
      if(val >= 20 && val <= 300) bpm.value = val;
  }

  function setVolume(val) {
      if (val >= 0 && val <= 100) {
        volume.value = val;
      }
  }

  function setPrecision(val) {
      if (val >= 0 && val <= 100) {
        precision.value = val;
      }
  }

  if (!hasVolumeWatcher) {
    watch(volume, (newVolume) => {
      if (audioContext && masterGain) {
        masterGain.gain.setTargetAtTime(newVolume / 100, audioContext.currentTime, 0.01);
      }
    });
    hasVolumeWatcher = true;
  }

  return {
    bpm,
    isPlaying,
    timeSignature,
    subdivision,
    clickSound,
    volume,
    precision,
    isTimerScheduled,
    timerRemainingMs,
    togglePlay,
    startMetronome,
    stopMetronome,
    scheduleStopTimer,
    clearScheduledStopTimer,
    setBpm,
    setVolume,
    setPrecision
  }
}
