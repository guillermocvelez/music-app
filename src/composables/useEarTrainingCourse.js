import { computed, ref } from 'vue';

const COURSE = [
  {
    id: 'nivel-1',
    title: 'Nivel 1 — Fundamentos',
    description: 'Base auditiva para principiantes.',
    units: [
      {
        id: 'u1',
        title: 'Unidad 1: Percepción del Sonido',
        themes: ['Altura (Pitch)', 'Duración', 'Intensidad', 'Timbre'],
        activities: [
          'Cantar nota hasta eliminar el batimiento',
          'Distinguir sonidos graves vs agudos',
          'Contraste vocal pianissimo–fortissimo',
          'Comparar timbres de 5 instrumentos',
        ],
        practice: { tipo: 'intervalo', dificultad: 1, rango: 'within_octave' },
        sections: [
          {
            id: 's1-1',
            title: '1. Altura (Pitch)',
            intro:
              'La altura es qué tan grave o agudo es un sonido. Físicamente depende de la frecuencia (Hz): más frecuencia = más agudo.',
            keyPoints: [
              'Las notas no son etiquetas (Do, Re…). Son alturas relativas.',
              'El oído primero aprende direcciones: subir y bajar. Luego aprende distancias.',
            ],
            exercise: [
              'Toca una nota en el piano.',
              'Cántala hasta que desaparezca el "batimiento" (cuando tu voz y la nota coinciden afinadas).',
              'Toca una segunda nota.',
              'Decide: ¿sube o baja?',
              'Haz esto 10 minutos diarios.',
            ],
          },
          {
            id: 's1-2',
            title: '2. Duración',
            intro:
              'Duración es cuánto tiempo permanece un sonido. No tiene que ver con qué nota es, sino cuánto dura.',
            keyPoints: ['Error común: enfocarse en la nota y olvidar el tiempo.'],
            exercise: [
              'Toca una nota corta (1 pulso).',
              'Toca una nota larga (4 pulsos).',
              'Cántalas igualando exactamente la duración.',
            ],
          },
          {
            id: 's1-3',
            title: '3. Intensidad',
            intro:
              'Intensidad es el volumen del sonido (fuerte o suave). Entrenar el control de dinámicas fortalece tu percepción y tu expresión.',
            keyPoints: [],
            exercise: [
              'Canta una nota pianissimo (muy suave).',
              'Luego cántala fortissimo (muy fuerte).',
              'Practica gradaciones intermedias entre ambos extremos.',
            ],
          },
          {
            id: 's1-4',
            title: '4. Timbre',
            intro:
              'El timbre es el color del sonido. Un Do en piano no suena igual que un Do en guitarra, aunque la altura sea idéntica.',
            keyPoints: [],
            exercise: [
              'Escucha 5 instrumentos diferentes tocando la misma nota.',
              'Describe con palabras el color de cada uno.',
              'Identifica qué los hace diferentes: ataque, resonancia, armónicos.',
            ],
          },
        ],
      },
      {
        id: 'u2',
        title: 'Unidad 2: Intervalos Básicos',
        themes: ['Segunda Mayor', 'Tercera Mayor', 'Cuarta Justa', 'Quinta Justa'],
        activities: [
          'Cantar Do–Re 20 veces (Segunda Mayor)',
          'Alternar Tercera Mayor y Menor',
          'Cantar intervalos desde notas aleatorias',
          'Cantar intervalos descendentes',
        ],
        practice: { tipo: 'intervalo', dificultad: 2, rango: 'within_octave' },
        sections: [
          {
            id: 's2-0',
            title: 'Qué es un Intervalo',
            intro:
              'Un intervalo es la distancia entre dos alturas. No memorices nombres — memoriza sensaciones.',
            keyPoints: [
              'Cántalos dentro de escala.',
              'Cántalos desde notas aleatorias.',
              'Escúchalos aislados sin contexto.',
              'Cántalos descendentes.',
              'Si puedes cantar cualquier intervalo desde cualquier nota, ya lo dominaste.',
            ],
            exercise: [],
          },
          {
            id: 's2-1',
            title: 'Segunda Mayor',
            intro: 'Sonido cercano, paso conjunto. Sensación: inicio de la escala mayor. Do–Re.',
            keyPoints: [],
            exercise: [
              'Canta Do–Re 20 veces hasta que el sonido sea familiar.',
              'Luego cántalo desde Re, Mi, Fa, Sol…',
            ],
          },
          {
            id: 's2-2',
            title: 'Tercera Mayor',
            intro: 'Sonido brillante y estable. Do–Mi.',
            keyPoints: [
              'La Tercera Menor (Do–Mib) tiene una emoción radicalmente diferente.',
            ],
            exercise: [
              'Alterna Do–Mi (mayor) y Do–Mib (menor).',
              'Escucha cómo cambia la emoción.',
              'Repite hasta que el cambio sea instantáneo.',
            ],
          },
          {
            id: 's2-3',
            title: 'Cuarta Justa',
            intro: 'Sonido abierto. Do–Fa.',
            keyPoints: [],
            exercise: [
              'Canta Do–Fa ascendente y descendente.',
              'Luego cántalo desde notas aleatorias.',
            ],
          },
          {
            id: 's2-4',
            title: 'Quinta Justa',
            intro: 'Muy estable y poderosa. Do–Sol.',
            keyPoints: [],
            exercise: [
              'Canta Do–Sol. Siente su estabilidad.',
              'Compárala con la Cuarta (Do–Fa): ¿cuál se siente más resuelto?',
            ],
          },
        ],
      },
      {
        id: 'u3',
        title: 'Unidad 3: Ritmo Básico',
        themes: ['Pulso', 'Subdivisión', 'Figuras: negra, blanca, corchea'],
        activities: [
          'Caminar marcando pulso 3 minutos',
          'Marcar negras, corcheas y semicorcheas con metrónomo',
          'Dictado rítmico simple',
        ],
        practice: { tipo: 'progresión', dificultad: 1, rango: 'within_octave' },
        sections: [
          {
            id: 's3-1',
            title: 'El Pulso',
            intro:
              'El pulso es el latido constante de la música. El ritmo NO se cuenta — se siente corporalmente.',
            keyPoints: ['El pulso es interno. El metrónomo es solo un punto de referencia.'],
            exercise: [
              'Camina marcando pulso durante 3 minutos sin perder estabilidad.',
              'Añade palmadas en cada paso.',
              'Intenta caminar a diferentes tempos: lento, medio, rápido.',
            ],
          },
          {
            id: 's3-2',
            title: 'Subdivisión',
            intro:
              'La subdivisión divide el pulso en partes iguales. Es la base del ritmo complejo.',
            keyPoints: [
              'Si pierdes el pulso al subdividir, baja el tempo hasta que sea completamente estable.',
            ],
            exercise: [
              'Con metrónomo a 60 BPM, marca negras (1 por click).',
              'Luego corcheas (2 por click).',
              'Luego semicorcheas (4 por click).',
              'Vuelve a negras sin perder el pulso.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'nivel-2',
    title: 'Nivel 2 — Intermedio',
    description: 'Consolidación tonal, armónica y de intervalos.',
    units: [
      {
        id: 'u4',
        title: 'Unidad 4: Escalas y Tonalidad',
        themes: ['Escala Mayor', 'Escala Menor Natural', 'Grados y Tónica'],
        activities: [
          'Cantar 1–3–5–7–1 sintiendo la tensión del 7',
          'Comparar Do–Mi vs Do–Mib',
          'Dictado melódico en tonalidad mayor',
        ],
        practice: { tipo: 'intervalo', dificultad: 3, rango: 'extended' },
        sections: [
          {
            id: 's4-1',
            title: 'Tonalidad y Jerarquía',
            intro:
              'Una tonalidad es un sistema jerárquico. Hay una nota más importante: la TÓNICA. Todas las demás notas orbitan alrededor de ella.',
            keyPoints: [
              'Grado 1 = casa (reposo total)',
              'Grado 5 = estabilidad',
              'Grado 7 = tensión fuerte que quiere resolver al 1',
            ],
            exercise: [],
          },
          {
            id: 's4-2',
            title: 'Escala Mayor',
            intro:
              'Fórmula: Tono – Tono – Semitono – Tono – Tono – Tono – Semitono. En Do mayor: Do Re Mi Fa Sol La Si Do.',
            keyPoints: [],
            exercise: [
              'Canta la escala de Do mayor ascendente y descendente.',
              'Canta la secuencia 1–3–5–7–1.',
              'Detente en el 7 (Si). Siente cómo quiere resolver.',
              'Resuelve al 1 (Do). Siente el descanso.',
            ],
          },
          {
            id: 's4-3',
            title: 'Escala Menor Natural',
            intro:
              'La escala menor tiene un color más oscuro. La tercera menor cambia completamente la emoción respecto a la mayor.',
            keyPoints: [],
            exercise: [
              'Canta Do–Mi (mayor). Siente el brillo.',
              'Canta Do–Mib (menor). Siente la oscuridad.',
              'Alterna entre ambas hasta que el cambio sea instantáneo.',
            ],
          },
        ],
      },
      {
        id: 'u5',
        title: 'Unidad 5: Acordes y Función',
        themes: ['Triadas Mayor y Menor', 'Función Tonal: I, IV, V'],
        activities: [
          'Identificar acordes mayor vs menor por color',
          'Escuchar I–V–I hasta que la resolución sea obvia',
          'Cantar arpegios de triadas',
        ],
        practice: { tipo: 'acorde', dificultad: 3, rango: 'within_octave' },
        sections: [
          {
            id: 's5-1',
            title: 'Triadas',
            intro:
              'Un acorde es notas superpuestas por terceras. No escuches notas individuales — escucha el COLOR.',
            keyPoints: ['Mayor: 1–3–5 (brillante)', 'Menor: 1–b3–5 (oscuro)'],
            exercise: [
              'Escucha un acorde mayor. Descríbelo con una emoción.',
              'Escucha un acorde menor. Descríbelo con otra emoción.',
              'Canta el arpegio ascendente de cada uno.',
            ],
          },
          {
            id: 's5-2',
            title: 'Función Tonal',
            intro: 'Cada acorde tiene una función en relación a la tónica.',
            keyPoints: [
              'I = reposo (casa)',
              'IV = movimiento (tensión suave)',
              'V = tensión que resuelve a I',
            ],
            exercise: [
              'Escucha una progresión I–V–I repetidamente.',
              'Siente cómo el V quiere resolver.',
              'Luego escucha I–IV–V–I. Identifica cada función.',
            ],
          },
        ],
      },
      {
        id: 'u6',
        title: 'Unidad 6: Sextas y Séptimas',
        themes: ['Sextas Mayor y Menor', 'Séptima Mayor', 'Séptima Dominante'],
        activities: [
          'Cantar 1–3–5–7 sobre acorde Maj7',
          'Cantar 1–3–5–b7 sobre acorde Dominante',
          'Comparar emoción de Maj7 vs Dom7',
        ],
        practice: { tipo: 'intervalo', dificultad: 4, rango: 'extended' },
        sections: [
          {
            id: 's6-1',
            title: 'Sextas',
            intro:
              'Las sextas suenan amplias y cálidas. Son el complemento invertido de las terceras.',
            keyPoints: [],
            exercise: [
              'Canta Do–La (Sexta Mayor).',
              'Canta Do–Lab (Sexta Menor).',
              'Compara su amplitud con las terceras equivalentes.',
            ],
          },
          {
            id: 's6-2',
            title: 'Séptimas',
            intro:
              'Las séptimas suenan tensas. La diferencia entre Maj7 y Dom7 es solo un semitono, pero el cambio emocional es enorme.',
            keyPoints: [
              'Mayor 7 (Maj7): sofisticada, estable en jazz',
              'Dominante 7 (Dom7): quiere resolver, tensión activa',
            ],
            exercise: [
              'Canta 1–3–5–7 sobre un acorde Maj7.',
              'Luego canta 1–3–5–b7 sobre un acorde Dominante.',
              'Escucha la diferencia emocional.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'nivel-3',
    title: 'Nivel 3 — Avanzado',
    description: 'Escucha armónica funcional y aplicación musical real.',
    units: [
      {
        id: 'u7',
        title: 'Unidad 7: Armonía Funcional Compleja',
        themes: ['Acordes séptima', 'Cadencias', 'Dominantes secundarios'],
        activities: [
          'Identificar tipos de séptima por emoción',
          'Reconocer cadencias en fragmentos',
          'Dictado armónico con 4 acordes',
        ],
        practice: { tipo: 'acorde', dificultad: 5, rango: 'extended' },
        sections: [
          {
            id: 's7-1',
            title: 'Los 4 Acordes Séptima',
            intro:
              'Cada tipo de acorde séptima tiene una personalidad sonora distinta. Entrenar el oído para distinguirlos por emoción es más efectivo que memorizarlos por teoría.',
            keyPoints: [
              'Maj7 → suave, estable, sofisticado',
              '7 (Dom7) → tensión activa, quiere resolver',
              'm7 → melancólico, fluido',
              'm7b5 → inestable, angustiante',
            ],
            exercise: [
              'Escucha progresiones lentas con cada tipo de acorde.',
              'Pregúntate: ¿Dónde está la tensión? ¿Dónde descansa?',
              'Asigna una palabra emocional a cada tipo.',
            ],
          },
        ],
      },
      {
        id: 'u8',
        title: 'Unidad 8: Modulación',
        themes: ['Centro tonal', 'Modulación directa', 'Modulación pivot'],
        activities: [
          'Detectar cambio de tónica en canciones reales',
          'Cantar nueva tónica sin instrumento',
          'Dictado melódico con modulación',
        ],
        practice: { tipo: 'progresión', dificultad: 4, rango: 'extended' },
        sections: [
          {
            id: 's8-1',
            title: 'Qué es Modular',
            intro:
              'Modular es cambiar de centro tonal. La música se mueve a una nueva "casa". El oído entrenado detecta el momento exacto del cambio.',
            keyPoints: [
              'Si puedes cantar la nueva tónica sin instrumento, estás escuchando correctamente.',
            ],
            exercise: [
              'Escucha una canción que modula.',
              'Cuando sientas que la "casa" cambia, para la música.',
              'Canta la nueva tónica.',
              'Verifica con instrumento.',
            ],
          },
        ],
      },
      {
        id: 'u9',
        title: 'Unidad 9: Polirritmia',
        themes: ['3 contra 2', 'Compases compuestos', 'Síncopa'],
        activities: [
          'Practicar 3:2 extremadamente lento',
          'Dictado rítmico complejo',
          'Transcripción rítmica',
        ],
        practice: { tipo: 'intervalo', dificultad: 4, rango: 'extended' },
        sections: [
          {
            id: 's9-1',
            title: '3 Contra 2',
            intro:
              'La polirritmia es cuando dos patrones rítmicos distintos ocurren simultáneamente. El ejemplo más común es 3 contra 2.',
            keyPoints: [
              'Nunca practiques esto rápido sin dominarlo lento primero.',
            ],
            exercise: [
              'Mano izquierda marca 2 pulsos iguales.',
              'Mano derecha marca 3 pulsos iguales en el mismo tiempo.',
              'Cuenta en voz alta: "1-la-li  2-la-li".',
              'Practica extremadamente lento hasta que salga natural.',
            ],
          },
        ],
      },
      {
        id: 'u10',
        title: 'Unidad 10: Transcripción',
        themes: ['Método de transcripción', 'Identificación de intervalos', 'Escritura melódica'],
        activities: [
          'Transcribir 2 compases cantando primero',
          'Identificar progresión ii–V–I',
          'Improvisación guiada por oído',
        ],
        practice: { tipo: 'progresión', dificultad: 5, rango: 'extended' },
        sections: [
          {
            id: 's10-1',
            title: 'La Prueba Máxima',
            intro:
              'Transcribir es la prueba máxima del oído musical. Si puedes transcribir con precisión, puedes escuchar con precisión.',
            keyPoints: [
              'Nunca escribas sin cantar primero.',
              'Si no puedes cantarlo, reproducirlo sin instrumento, o reconocer su función — aún no lo dominas.',
            ],
            exercise: [
              'Escucha un fragmento de 2 compases.',
              'Canta lo que escuchaste.',
              'Encuentra la tónica.',
              'Identifica los intervalos uno por uno.',
              'Escribe.',
              'Repite hasta que coincida exactamente.',
            ],
          },
        ],
      },
    ],
  },
];

const STORAGE_KEY = 'ear-training-course-progress';
const selectedUnitId = ref('u1');
const completedUnits = ref([]);
let initialized = false;

const allUnits = computed(() => COURSE.flatMap((level) => level.units));
const selectedUnit = computed(
  () => allUnits.value.find((unit) => unit.id === selectedUnitId.value) || allUnits.value[0],
);
const completionPercent = computed(() => {
  const total = allUnits.value.length;
  if (!total) return 0;
  return Math.round((completedUnits.value.length / total) * 100);
});

function isUnitCompleted(unitId) {
  return completedUnits.value.includes(unitId);
}

function setSelectedUnit(unitId) {
  selectedUnitId.value = unitId;
}

function markUnitCompleted(unitId) {
  if (completedUnits.value.includes(unitId)) return;
  completedUnits.value = [...completedUnits.value, unitId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completedUnits.value));
}

function unmarkUnitCompleted(unitId) {
  completedUnits.value = completedUnits.value.filter((id) => id !== unitId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completedUnits.value));
}

function initCourseProgress() {
  if (initialized) return;
  initialized = true;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    const validIds = new Set(allUnits.value.map((u) => u.id));
    completedUnits.value = parsed.filter((id) => validIds.has(id));
  } catch (_err) {
    completedUnits.value = [];
  }
}

export function useEarTrainingCourse() {
  return {
    COURSE,
    selectedUnitId,
    selectedUnit,
    completionPercent,
    isUnitCompleted,
    setSelectedUnit,
    markUnitCompleted,
    unmarkUnitCompleted,
    initCourseProgress,
  };
}
