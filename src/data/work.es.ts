// Spanish text for work.ts: tab labels and the work history. Ids, scenes and
// grant numbers are the same as in English.

import { projects, type Project, type Role } from './work';

const tabs: Record<Project['id'], string> = {
  'binational-manatees': 'Rastreando manatíes por su voz',
  'drone-manatees': 'Detección aérea de manatíes',
  'vector-spectra': 'Huellas de mosquitos y garrapatas',
  'watermelon-varieties': 'Clasificación automática de sandías',
  'survey-nlp': 'Patrones en lo que dice la gente',
};

export const projectsEs: Project[] = projects.map((p) => ({ ...p, tab: tabs[p.id] }));

export const experienceEs: Role[] = [
  {
    title: 'Científico de datos en investigación',
    org: 'Universidad Tecnológica de Panamá y Smithsonian Tropical Research Institute',
    orgNote:
      'La universidad nacional de ingeniería de Panamá y el centro de investigación del Smithsonian en el país, junto con INDICASAT-AIP, el instituto público de investigación científica y tecnológica.',
    years: 'Ene. 2021 a la fecha',
    summary:
      'Investigación y desarrollo de software para organizar, limpiar y preparar los datos con los que se entrenan y optimizan modelos de machine learning, sobre todo en Python, y visualizaciones de datos en HTML, CSS y JavaScript. Redacción de artículos científicos para publicar los resultados en revistas indexadas. Trabajo principalmente con investigadores de la UTP y del STRI, y con instituciones externas como INDICASAT-AIP.',
    itemsHead: 'Proyectos de investigación financiados por la SENACYT, la Secretaría Nacional de Ciencia, Tecnología e Innovación de Panamá',
    items: [
      {
        label: 'Monitoreo acústico de manatíes',
        text: 'Monitoreo acústico en tiempo real de manatíes en los humedales de Panamá, primero como un sistema basado en LoRa y luego automatizado de principio a fin.',
        codes: ['Proyecto FID18-076 · Sistema de monitoreo basado en LoRa', 'Proyecto FID23-106 · Sistema de monitoreo automatizado'],
      },
      {
        label: 'Clasificación de sandías',
        text: 'Un sistema de procesamiento de imágenes que clasifica por variedad las sandías de exportación.',
        codes: ['Proyecto FID18-060'],
      },
      {
        label: 'Identificación de vectores de enfermedades',
        text: 'Espectrometría de masas (MALDI-TOF) para identificar mosquitos y garrapatas por especie.',
        codes: ['Proyecto GRID15-002'],
      },
    ],
  },
  {
    title: 'Analista de datos y consultor de IA',
    org: 'CID Gallup, Panamá',
    orgNote: 'Una firma de encuestas e investigación de mercados que trabaja en toda América Latina.',
    years: 'Nov. 2024 a ene. 2026',
    summary:
      'Análisis de datos de encuestas en SPSS, con resultados presentados a los clientes en dashboards de Power BI. Desarrollo de herramientas de IA que automatizan el procesamiento de datos y tareas internas, como la validación de encuestas, a partir de mi investigación previa sobre textos en español.',
    items: [
      {
        label: 'Respuestas abiertas',
        text: 'Un sistema que propone una lista de temas para cada pregunta abierta y etiqueta cada respuesta, de modo que los analistas pueden contar los temas sin perder las palabras originales.',
      },
      {
        label: 'Auditoría de entrevistas',
        text: 'Un puntaje que ordena las entrevistas completadas según su duración, las preguntas sin responder, la variedad de las respuestas y la misma opción repetida a lo largo de una lista, para que los supervisores sepan cuáles revisar primero.',
      },
    ],
  },
];
