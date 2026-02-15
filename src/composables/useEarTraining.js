import { ref } from 'vue';

export function useEarTraining() {
  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Basic intervals from root
  const INTERVALS = [
    { name: 'Unison', semitones: 0 },
    { name: 'Minor 2nd', semitones: 1 },
    { name: 'Major 2nd', semitones: 2 },
    { name: 'Minor 3rd', semitones: 3 },
    { name: 'Major 3rd', semitones: 4 },
    { name: 'Perfect 4th', semitones: 5 },
    { name: 'Tritone', semitones: 6 },
    { name: 'Perfect 5th', semitones: 7 },
    { name: 'Minor 6th', semitones: 8 },
    { name: 'Major 6th', semitones: 9 },
    { name: 'Minor 7th', semitones: 10 },
    { name: 'Major 7th', semitones: 11 },
    { name: 'Octave', semitones: 12 }
  ];

  const CHORDS = {
    major: { name: 'Major', intervals: [0, 4, 7] },
    minor: { name: 'Minor', intervals: [0, 3, 7] },
    diminished: { name: 'Diminished', intervals: [0, 3, 6] },
    augmented: { name: 'Augmented', intervals: [0, 4, 8] },
    maj7: { name: 'Major 7', intervals: [0, 4, 7, 11] },
    min7: { name: 'Minor 7', intervals: [0, 3, 7, 10] },
    dom7: { name: 'Dominant 7', intervals: [0, 4, 7, 10] }
  };

  /**
   * Generates a random note from the chromatic scale
   */
  const getRandomNote = () => {
    return NOTES[Math.floor(Math.random() * NOTES.length)];
  };

  /**
   * Helper to get a note n semitones away
   */
  const getNoteByInterval = (root, semitones) => {
    const rootIndex = NOTES.indexOf(root);
    const newIndex = (rootIndex + semitones) % 12;
    return NOTES[newIndex];
  };

  const generateExercise = ({ tonalidad, tipo, dificultad, rango }) => {
    // Default to 'C' if tonalidad is not provided or 'Random'
    let root = tonalidad;
    if (!root || root === 'Random') {
      root = getRandomNote(); 
    }

    // Determine Logic based on 'tipo'
    if (tipo === 'intervalo') {
      return generateIntervalExercise(root, dificultad, rango);
    } else if (tipo === 'acorde') {
      return generateChordExercise(root, dificultad, rango);
    } else if (tipo === 'progresión') {
       return generateProgressionExercise(root, dificultad, rango);
    }

    return { error: 'Invalid type' };
  };

  const generateIntervalExercise = (root, difficulty, range) => {
    // Logic to select an interval based on difficulty
    // Difficulty 1: Basic (Perfects, Major 3rd)
    // Difficulty 5: All (including Tritone, Minor 2nd, Major 7th)
    
    let allowedIntervals = [];

    if (difficulty <= 1) {
      allowedIntervals = INTERVALS.filter(i => [0, 4, 5, 7, 12].includes(i.semitones));
    } else if (difficulty <= 2) {
      allowedIntervals = INTERVALS.filter(i => [0, 2, 4, 5, 7, 9, 12].includes(i.semitones)); // Add 2nd, 6th
    } else if (difficulty <= 3) {
      allowedIntervals = INTERVALS.filter(i => [0, 2, 3, 4, 5, 7, 8, 9, 12].includes(i.semitones)); // Add Minors
    } else {
       allowedIntervals = INTERVALS; // All
    }

    // Handle Range (extended > 12 semitones ?)
    // For now, let's stick to simple intervals, maybe `extended` allows > octave
    if (range === 'extended') {
       // Placeholder: specific logic for > octave could be added here
    }

    const interval = allowedIntervals[Math.floor(Math.random() * allowedIntervals.length)];
    const note2 = getNoteByInterval(root, interval.semitones);

    return {
      notas: [root, note2],
      intervalo: interval.name,
      grado: `${interval.semitones} semitonos`, // Or actual scale degree if we had scale context
      dificultad: difficulty,
      explicación: `Intervalo de ${interval.name} entre ${root} y ${note2}`
    };
  };

  const generateChordExercise = (root, difficulty, range) => {
    let allowedChords = ['major', 'minor'];
    
    if (difficulty >= 2) allowedChords.push('diminished');
    if (difficulty >= 3) allowedChords.push('augmented');
    if (difficulty >= 4) allowedChords.push('dom7');
    if (difficulty >= 5) allowedChords.push('maj7', 'min7');

    const chordTypeKey = allowedChords[Math.floor(Math.random() * allowedChords.length)];
    const chordData = CHORDS[chordTypeKey];

    const notes = chordData.intervals.map(semitones => getNoteByInterval(root, semitones));

    return {
      notas: notes,
      intervalo: 'N/A', // Chords are not single intervals
      grado: chordData.name,
      dificultad: difficulty,
      explicación: `Acorde ${chordData.name} con fundamental en ${root}: ${notes.join(', ')}`
    };
  };

  const generateProgressionExercise = (root, difficulty, range) => {
    // Simple progression logic: I-IV-V-I etc.
    // For now, let's just return a placeholder progression
    const progression = ['I', 'IV', 'V', 'I'];
    // In a real app we'd map these to notes based on the key
    
    return {
      notas: [root], // Just root for now
      intervalo: 'Progresión',
      grado: progression.join(' - '),
      dificultad: difficulty,
      explicación: `Progresión básica en ${root}: ${progression.join(' - ')}`
    };
  };

  // --- Audio Logic ---
  let audioCtx = null;

  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const noteToFreq = (note) => {
    // Basic mapping for middle octave (C4 - B4)
    // We can extend this logic or use a library, but for now let's map C4 as reference
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const baseFreq = 261.63; // C4
    const semitones = notes.indexOf(note); // This assumes the note is just the name without octave
    // If we want more octaves we need to parse Note+Octave
    // For this simple version, let's just assume everything is within C4-B5 range
    
    // Better approach: calculate semitones from A4 (440)
    // Frequency = 440 * 2^((n-69)/12) where n is MIDI note
    // Let's implement a simple look-up or calculation relative to C4
    
    // Note: The generated notes in `generateExercise` are just names like 'C', 'F#'.
    // We need to handle octaves to avoid weird jumps if we just map names.
    // For now, let's just assume the root is in Octave 4, and intervals go up.
    
    return baseFreq * Math.pow(2, semitones / 12);
  };
  
  // Refined noteToFreq that handles octave wrapping for intervals/chords
  // This is a bit tricky without full note objects (Note + Octave).
  // Let's rely on the fact that `getNoteByInterval` returns a note name. 
  // We should probably return MIDI numbers or freq from the generator to be precise.
  // BUT, to keep it simple:
  
  const getFrequency = (noteName, minOctave = 4) => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteIndex = notes.indexOf(noteName);
    // Simple logic: return frequency for that note in the given octave
    return 261.63 * Math.pow(2, noteIndex / 12) * Math.pow(2, minOctave - 4);
  };

  const playTone = (freq, startTime, duration = 0.5) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine'; // Smooth tone
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const playExercise = async (exercise) => {
    initAudio();
    const now = audioCtx.currentTime;
    
    // Parse notes to frequencies
    // The generator returns ['C', 'G'] for example.
    // We need to assume the first note is the root (e.g. C4) and the others are relative.
    // If the logical interval went "up", the second note should be higher.
    
    const rootName = exercise.notas[0];
    const rootIndex = NOTES.indexOf(rootName);
    
    const freqs = exercise.notas.map((noteName, i) => {
        if (i === 0) return getFrequency(noteName, 4);
        
        // Determine octave for subsequent notes
        // If the note index is lower than root index, it must be in next octave (for ascending intervals)
        const noteIndex = NOTES.indexOf(noteName);
        const octave = noteIndex < rootIndex ? 5 : 4; 
        return getFrequency(noteName, octave);
    });

    if (exercise.intervalo === 'Progresión') {
        // Play sequentially as chords (not implemented fully in generator yet)
        // For now, play single notes sequentially
        freqs.forEach((f, i) => {
            playTone(f, now + i * 0.8, 0.6);
        });
    } else if (exercise.tipo === 'acorde' || exercise.intervalo !== 'N/A') {
        // Arpeggiate slightly then hold? 
        // Or play harmonic then melodic?
        
        // Let's play melodically (sequence) then harmonically (together)
        
        // Melodic (Ascending)
        freqs.forEach((f, i) => {
            playTone(f, now + i * 0.6, 0.5);
        });
        
        // Harmonic (Chord) after sequence
        const harmonicTime = now + (freqs.length * 0.6) + 0.5;
        freqs.forEach(f => {
            playTone(f, harmonicTime, 1.5);
        });
    } else {
        // Fallback
        playTone(freqs[0], now, 0.5);
    }
  };

  return {
    generateExercise,
    playExercise, // Export this
    NOTES,
    INTERVALS,
    CHORDS
  };
}
