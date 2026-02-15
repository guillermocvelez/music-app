import { ref, watch } from 'vue';

const bpm = ref(92);
const isPlaying = ref(false);
const timeSignature = ref({ numerator: 4, denominator: 4 });
const subdivision = ref(1); // 1 = quarter, 2 = eighth, 3 = triplet, 4 = sixteenth
const clickSound = ref('woodblock'); // woodblock, digital, snare

// Audio Context (initialized on user action)
let audioContext = null;
let nextNoteTime = 0.0;
let timerID = null;
let beatCount = 0;
let noiseBuffer = null;

const lookahead = 25.0; 
const scheduleAheadTime = 0.1;

export function useMetronome() {

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
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
    
    nextNoteTime += interval;
    beatCount++;
    
    // Reset beat count at measure end
    const measureLength = timeSignature.value.numerator * notesPerBeat;
    if (beatCount >= measureLength) {
        beatCount = 0;
    }
  }

  function playOscillator(time, freq, type, decay) {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.frequency.value = freq;
    osc.type = type;

    gainNode.gain.value = 1.0;
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
     noiseEnvelope.connect(audioContext.destination);
     
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
         // Woodblock: high sine/triangle
        const freq = isMeasureDownbeat ? 1200 : (isQuarterDownbeat ? 800 : 600);
        playOscillator(time, freq, 'sine', 0.1);
    
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

  function togglePlay() {
    isPlaying.value = !isPlaying.value;
    if (isPlaying.value) {
        initAudio();
        if(audioContext.state === 'suspended') {
            audioContext.resume();
        }
        beatCount = 0;
        nextNoteTime = audioContext.currentTime + 0.1;
        scheduler();
    } else {
        window.clearTimeout(timerID);
    }
  }

  function setBpm(val) {
      if(val >= 20 && val <= 300) bpm.value = val;
  }

  return {
    bpm,
    isPlaying,
    timeSignature,
    subdivision,
    clickSound,
    togglePlay,
    setBpm
  }
}
