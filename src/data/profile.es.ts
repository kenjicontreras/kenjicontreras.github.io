// Spanish text for profile.ts. Everything that is not text (email, links, CV
// file, tool icons) comes from the English file, so it is set in one place.
// Technical terms with no settled Spanish use (machine learning) stay in English.

import { profile, skills, about, type Skill, type Reference } from './profile';

export const profileEs: typeof profile = {
  ...profile,
  role: 'Científico de datos e investigador',
  location: 'Ciudad de Panamá, Panamá',
  headline: 'IA para descifrar datos complejos.',
  intro:
    'Encuentro respuestas claras en datos incompletos, desordenados o contaminados.',
  background: 'Más de cinco años en investigación aplicada y ciencia de datos, con métodos publicados en revistas científicas indexadas, y experiencia en la empresa privada desarrollando herramientas de IA que automatizan el trabajo repetitivo.',
  availability:
    'Disponible para proyectos de ciencia de datos, herramientas de IA y automatización de flujos de trabajo. Trabajo remoto, en español o en inglés.',
};

const tools = skills.find((s) => s.tools)?.tools ?? [];

export const skillsEs: Skill[] = [
  {
    name: 'Machine learning',
    line: 'Implementación y optimización de modelos para datos científicos, empresariales y de campo, incluso cuando son ruidosos, escasos o no están etiquetados.',
  },
  {
    name: 'IA generativa y análisis de texto',
    line: 'Herramientas de IA generativa y procesamiento de lenguaje natural (NLP) que leen, clasifican y resumen textos en español o inglés, redactan informes y automatizan el trabajo repetitivo, con revisión humana de los resultados y con los datos siempre bajo su control.',
  },
  {
    name: 'Visión por computadora',
    line: 'Detección y clasificación de objetos en fotos y videos, desde censos de fauna con drones hasta el reconocimiento de variedades de fruta.',
  },
  {
    name: 'Procesamiento de audio y señales',
    line: 'Limpieza y análisis de señales de distintos tipos, desde audio hasta mediciones de laboratorio, para separar la información útil del ruido.',
  },
  {
    name: 'Estadística y dashboards interactivos',
    line: 'Análisis estadístico de encuestas y proyectos de investigación en SPSS y Python, desde la limpieza de los datos hasta los dashboards en Power BI o en herramientas web.',
  },
  {
    name: 'Investigación aplicada',
    line: 'Investigación revisada por pares en bioacústica, entomología, agricultura y análisis de textos en español, en colaboración con especialistas de cada campo, publicada en revistas indexadas y presentada en congresos de ingeniería.',
  },
  {
    name: 'Programación y herramientas',
    line: 'Python (TensorFlow, PyTorch, OpenCV); JavaScript, HTML y CSS; Power BI y SPSS.',
    tools: tools.map((t) => (t.name === 'HTML and CSS' ? { ...t, name: 'HTML y CSS' } : t)),
  },
];

const refsEs: Pick<Reference, 'role' | 'work' | 'link'>[] = [
  { role: 'Científico permanente, Smithsonian Tropical Research Institute', work: 'Supervisor de investigación: monitoreo acústico de manatíes', link: 'Perfil en STRI' },
  { role: 'Investigador, Facultad de Ingeniería Eléctrica, UTP', work: 'Supervisor de investigación: monitoreo acústico de manatíes, identificación de vectores de enfermedades', link: 'Perfil en la UTP' },
  { role: 'Investigador, Facultad de Ingeniería de Sistemas Computacionales, UTP', work: 'Supervisor de investigación: clasificación de sandías, identificación de vectores de enfermedades', link: 'Perfil en la UTP' },
  { role: 'Investigador, Facultad de Ingeniería Eléctrica, UTP', work: 'Supervisor de investigación: clasificación de sandías', link: 'Perfil en la UTP' },
  { role: 'Directora regional, CID Gallup', work: 'Gerente de proyectos: análisis de encuestas y herramientas de IA', link: 'LinkedIn' },
  { role: 'Director, Academia de Artes Marciales León', work: 'Enseñanza de artes marciales', link: 'WhatsApp +507 6550-9596' },
];

export const aboutEs: typeof about = {
  paragraphs: [
    'Me formé como ingeniero en telecomunicaciones, pero desde siempre me ha interesado entender cómo funciona la naturaleza. Me fascinaba cómo los números y la estadística podían dar sentido a algo tan complejo como los sonidos de los animales o la diversidad de los insectos. Desde entonces, la mayoría de los datos con los que he trabajado han sido escasos, se han registrado en campo o han estado contaminados con ruido, así que aprendí a desarrollar IA que funcione justamente en esas condiciones.',
    'Fuera del trabajo, practico artes marciales desde hace diez años y actualmente doy clases a personas de todas las edades. El entrenamiento y su filosofía me dan un equilibrio que complementa mi forma de trabajar. Además, me encanta aprender idiomas: aparte del español y el inglés, he estudiado alemán y japonés para ampliar mi bagaje cultural y mis habilidades de comunicación.',
  ],
  education: [
    { title: 'Licenciatura en Ingeniería en Telecomunicaciones', place: 'Facultad de Ingeniería Eléctrica, Universidad Tecnológica de Panamá', years: '2016 a 2022' },
  ],
  teaching: {
    title: 'Instructor de artes marciales, cinturón negro en taekwondo y Haidong Gumdo (espada coreana)',
    place: 'Academia de Artes Marciales León',
    years: '2023 a la fecha',
    href: about.teaching.href,
  },
  languages: ['Español, nativo', 'Inglés, avanzado', 'Alemán, básico', 'Japonés, básico'],
  // Same people and links as in English; only the descriptions change.
  references: about.references.map((r, i) => ({ ...r, ...refsEs[i] })),
};
