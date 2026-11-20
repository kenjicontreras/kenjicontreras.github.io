// Spanish version of content.ts: same steps, same figures (traced in brief.md).
// The CID Gallup part stays within ../nlp/nlp_systems.md; poll examples are invented.
import type { StoryContent } from '../_shared/types';
import { content as en } from './content';

const P1 = 'Proyecto 1 · Temas del parlamento';
const P2 = 'Proyecto 2 · Respuestas abiertas';
const P3 = 'Proyecto 3 · Auditoría de entrevistas';

export const content: StoryContent = {
  ...en,
  title: 'Encontrando patrones en lo que dice la gente, del parlamento a la investigación por encuestas',
  meta: 'Universidad Tecnológica de Panamá, 2022 · CID Gallup, 2024 a 2026',
  steps: [
    {
      title: 'Tres proyectos, un mismo hilo',
      body: 'Los tres encuentran patrones en lo que dice la gente. Todo empezó con mi investigación publicada sobre la Asamblea Nacional de Panamá. Con esa base, en CID Gallup (una firma de encuestas e investigación de mercados que trabaja en toda América Latina) creé una herramienta que clasifica las respuestas abiertas de las encuestas y, después, otra que revisa la calidad de las entrevistas.',
      points: [
        'El Proyecto 1 es investigación publicada. Los proyectos 2 y 3 son herramientas que creé para analistas de encuestas y supervisores de campo.',
        'Los datos de encuestas de CID Gallup son confidenciales, así que todos los ejemplos de encuestas aquí son inventados.',
      ],
    },
    {
      part: P1,
      title: '¿De qué habla un parlamento?',
      body: 'En mi investigación publicada usé machine learning para identificar los temas debatidos en la Asamblea Nacional de Panamá durante quince años, directamente a partir de las transcripciones y sin etiquetarlas previamente a mano.',
      points: [
        'El lenguaje político en español, lleno de expresiones locales, es más difícil para herramientas creadas sobre todo para el inglés.',
        'Reuní 2,791 documentos y conservé los 2,086 que registraban debates reales.',
      ],
      stat: { value: '2,086', label: 'textos parlamentarios, de 2005 a 2020' },
      hood: 'Extraídos del sitio web de la Asamblea; procesados, limpiados y lematizados en Python.',
    },
    {
      part: P1,
      title: 'Dos formas de encontrar un tema',
      body: 'Un método busca palabras que tienden a aparecer juntas. El otro agrupa pasajes que significan cosas parecidas, aunque usen palabras distintas. El segundo encontró temas más nítidos y específicos.',
      points: [
        'Temas amplios como salud, transporte o elecciones, frente a casos específicos como un escándalo de envenenamiento o los derechos territoriales indígenas.',
        'El segundo método también aparta los pasajes que no encajan en ningún tema, en lugar de forzarlos a entrar en uno.',
      ],
      facts: [
        { value: '17', label: 'temas, palabras que aparecen juntas' },
        { value: '33', label: 'temas, pasajes con significado parecido' },
      ],
      factsLayout: 'list',
      hood: 'LDA frente a BERTopic, comparados por puntaje de coherencia: menos de 0.20 frente a más de 0.45.',
    },
    {
      part: P1,
      title: 'Un lenguaje que cambia con el tiempo',
      body: 'Las mismas herramientas pueden seguir un tema a lo largo de los años. En los debates de salud, las palabras pasaron de asuntos rutinarios a crisis específicas. Leer el texto por su significado, y no solo por sus palabras, es lo que llevé a CID Gallup.',
      points: [
        'Al principio: “salud pública” y “cirugía”.',
        'Después: los envenenamientos con dietilenglicol, el río La Villa y el humo del vertedero de Cerro Patacón.',
      ],
      hood: 'Modelado dinámico de temas con BERTopic. Presentado en IEEE CONCAPAN, 2022.',
    },
    {
      part: P2,
      title: '¿Qué dijo la gente?',
      body: 'En CID Gallup me enfrenté a una pregunta parecida: ¿de qué habla la gente? Esta vez el texto eran respuestas abiertas de encuestas, escritas con las propias palabras de las personas. Mi herramienta extrae las frases clave, y la IA las convierte en una lista de temas que los analistas revisan y ajustan.',
      points: [
        '“Se roban la plata del pueblo” nunca dice “corrupción”, pero eso es lo que significa. Una búsqueda por palabras no lo encontraría.',
        'La herramienta también lee la pregunta, porque “más seguridad” significa algo distinto en una pregunta sobre empleo.',
        'Como con los temas del parlamento, los temas salen de las propias respuestas. Los analistas también pueden agregar los suyos.',
      ],
      hood: 'KeyBERT extrae las frases clave; un agente de IA basado en Gemini redacta el libro de códigos a partir de esas frases y de la pregunta de la encuesta.',
    },
    {
      part: P2,
      title: 'Cuatro comparaciones, un tema',
      body: 'Cada respuesta se compara con cada tema de cuatro formas: significado, palabras compartidas, escritura parecida y tono. Los cuatro resultados se combinan para elegir el tema.',
      points: [
        'Una respuesta puede contar para más de un tema cuando los resultados son cercanos.',
        'El resultado son columnas comunes de hoja de cálculo, listas para contar, con las palabras originales al lado.',
      ],
      hood: 'Un clasificador de texto híbrido: sentence embeddings, BM25, coincidencia aproximada (fuzzy matching) y análisis de sentimiento, combinados con pesos ajustables; puede asignar más de un tema cuando los puntajes son cercanos.',
    },
    {
      part: P3,
      title: '¿Qué entrevistas merecen una segunda mirada?',
      body: 'La segunda herramienta busca patrones en cómo se respondió cada entrevista, no en lo que se dijo. Una pista es la entropía, una medida de variedad. Las opiniones reales varían; quien da siempre la misma respuesta muestra poca o ninguna variedad.',
      points: [
        'La persona A confía más en unas instituciones que en otras, una variación natural.',
        'La persona B responde “Ninguna” siete veces seguidas: cero variedad, conviene revisarla.',
      ],
      hood: 'La entropía de Shannon mide qué tan variadas son las respuestas de cada persona: 2.24 bits para A y 0 para B, de un máximo de 2.32 con cinco opciones.',
    },
    {
      part: P3,
      title: 'Cuatro señales de alerta, una clasificación',
      body: 'Cada entrevista se revisa en busca de cuatro señales de alerta: una duración inusualmente corta, muchas preguntas sin responder, poca variedad y la misma respuesta repetida a lo largo de una lista. Las entrevistas que destacan suben en la lista.',
      points: [
        'Ninguna señal decide por sí sola. Las cuatro se combinan en un solo puntaje.',
        'Cada señal se mide frente al resto del mismo lote, así que lo que cuenta como inusual se ajusta a cada encuesta.',
      ],
      hood: 'Cada señal se puntúa por su distancia al promedio del lote en desviaciones estándar, y las cuatro se promedian en una sola clasificación. Se muestran 60 entrevistas inventadas.',
    },
    {
      part: P3,
      title: 'Para qué sirve',
      body: 'El tercio superior pasa a los supervisores, ordenado por entrevista y por encuestador, con la señal de alerta detrás de cada caso. La herramienta indica dónde mirar primero. Una llamada de vuelta a la persona entrevistada lo confirma.',
      points: [
        'Los supervisores dedican su tiempo a las entrevistas que más probablemente lo necesitan.',
        'Una pregunta omitida a propósito puede parecer una respuesta faltante, así que el cuestionario se lee junto con el puntaje.',
      ],
      stat: { value: '⅓', label: 'de las entrevistas pasa a revisión' },
      hood: 'Desarrollado en CID Gallup, 2024 a 2026. Los datos y resultados de los clientes son confidenciales.',
    },
  ],
  stack: ['Python', 'LDA', 'BERTopic', 'KeyBERT', 'IA generativa', 'Sentence embeddings', 'BM25'],
  source: {
    label: 'Lea el artículo del Proyecto 1 en IEEE Xplore (autor principal)',
    href: en.source!.href,
  },
  credit:
    'Proyecto 1: el número de temas y sus palabras son de Contreras et al. 2022 (IEEE CONCAPAN). Los proyectos 2 y 3 usaron datos confidenciales de clientes en CID Gallup, así que la encuesta, sus respuestas, las personas y las 60 entrevistas son inventadas. Los puntajes de variedad y de revisión se calculan a partir de ellas de la misma forma que lo hacen las herramientas. Todos los dibujos son ilustraciones.',
  stageAlt:
    'Diagrama animado en nueve etapas que cubre tres proyectos. Una vista general muestra tres tarjetas, temas del parlamento, respuestas abiertas y auditoría de entrevistas, unidas por una flecha: la investigación lleva a la herramienta de respuestas abiertas y luego a la auditoría de entrevistas. Proyecto 1: una pila de actas parlamentarias se convierte en 2,086 pequeños mosaicos; tres listas de palabras que aparecen juntas están junto a puntos que se reúnen en tres grupos de significado parecido; el tema de salud se extiende a lo largo de una línea de tiempo de 2005 a 2020 con sus palabras. Proyecto 2: respuestas inventadas de una encuesta se convierten en frases clave y en una lista de tres temas; una respuesta se compara de cuatro formas y se escribe en columnas de hoja de cálculo. Proyecto 3: las respuestas de dos personas, una variada y otra igual siete veces, con un medidor de variedad; 60 entrevistas se ubican según cuatro señales de alerta y se combinan en una sola clasificación; una lista de revisión marca el tercio superior, junto a un encuestador en una puerta. Una barra en la parte superior del escenario muestra qué proyecto está en pantalla.',
};
