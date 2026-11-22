// Interface strings for the two page languages. The English page is at /, the
// Spanish one at /es/. Content (skills, experience, stories) lives in src/data
// and animations/<id>/content(.es).ts; this file holds the words the
// components themselves print.

export type Lang = 'en' | 'es';
export const langs: Lang[] = ['en', 'es'];

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Root path of the landing page in `lang`. */
export const pathFor = (lang: Lang) => `${base}/${lang === 'es' ? 'es/' : ''}`;

export const ui = {
  en: {
    metaTitle: (name: string) => `${name}, data scientist and researcher`,
    metaDescription:
      'Data scientist and researcher in Panama. Machine learning, computer vision, LLM-powered tools and AI workflow automation for research and business.',
    ogLocale: 'en_US',
    jobTitle: 'Data Scientist & Researcher',
    skip: 'Skip to content',
    navLabel: 'Sections',
    nav: { skills: 'Skills', work: 'Projects', experience: 'Experience', about: 'About', contact: 'Contact' },
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    langLabel: 'Language',
    langName: { en: 'English', es: 'Español' },
    hero: {
      discuss: 'Discuss your project',
      see: 'See the projects',
      cv: 'Download my CV (PDF)',
      trust: 'Research and work with',
    },
    skills: { title: 'What I do', tools: 'Tools' },
    work: {
      title: 'Projects, step by step',
      lede: 'Five projects, from field research to tools for business. Pick one and scroll to see how it works, step by step.',
      tablist: 'Projects',
      sceneError: 'The animation could not load. You can still read every step below.',
      next: 'Next project:',
    },
    experience: {
      title: 'Experience',
      lede: 'Four funded research projects with the Smithsonian, UTP and INDICASAT-AIP, then survey analytics at CID Gallup.',
    },
    about: {
      title: 'About me',
      education: 'Education',
      teaching: 'Teaching',
      languages: 'Languages',
      venues: 'Peer-reviewed in',
      publications: 'All 13 publications',
      refsTitle: 'References',
      altGumdo: 'Kenji Contreras in a blue Haidong Gumdo uniform, holding a sword',
      altTkd: 'Kenji Contreras in a white taekwondo uniform with a black belt',
    },
    contact: {
      title: 'What are you trying to find out or automate?',
      lede: 'Tell me what you’re working on, whether it’s data to analyse or a repetitive process to automate, and what a good result looks like. I’ll tell you whether I can help, and how I’d do it.',
      email: 'Email me',
      cv: 'Download CV (PDF)',
      or: 'or write to',
      howTitle: 'How it works',
      how: 'We start with a short call about your data or process and what it should achieve. You then get a written proposal with the scope, timeline and price, and the work is delivered in stages you can check, with code and documentation at the end. In English or Spanish.',
      city: 'Panama City',
    },
    story: { hood: 'Under the hood:', tools: 'Tools used', related: 'Related papers', lead: 'Lead author' },
  },
  es: {
    metaTitle: (name: string) => `${name}, científico de datos e investigador`,
    metaDescription:
      'Científico de datos e investigador en Panamá. Machine learning, visión por computadora, herramientas con modelos de lenguaje (LLM) y automatización de flujos de trabajo con IA para investigación y empresas.',
    ogLocale: 'es_PA',
    jobTitle: 'Científico de datos e investigador',
    skip: 'Saltar al contenido',
    navLabel: 'Secciones',
    nav: { skills: 'Habilidades', work: 'Proyectos', experience: 'Experiencia', about: 'Sobre mí', contact: 'Contacto' },
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    langLabel: 'Idioma',
    langName: { en: 'English', es: 'Español' },
    hero: {
      discuss: 'Hablemos de su proyecto',
      see: 'Explore los proyectos',
      cv: 'Descargar mi CV (PDF, en inglés)',
      trust: 'Investigación y trabajo con',
    },
    skills: { title: 'Lo que hago', tools: 'Herramientas' },
    work: {
      title: 'Proyectos, paso a paso',
      lede: 'Cinco proyectos, de la investigación de campo a las herramientas para empresas. Elija uno y siga bajando para ver cómo funciona, paso a paso.',
      tablist: 'Proyectos',
      sceneError: 'No se pudo cargar la animación. Puede leer todos los pasos a continuación.',
      next: 'Siguiente proyecto:',
    },
    experience: {
      title: 'Experiencia',
      lede: 'Cuatro proyectos de investigación financiados, con el Smithsonian, la UTP e INDICASAT-AIP, y luego análisis de encuestas y herramientas de IA en CID Gallup.',
    },
    about: {
      title: 'Sobre mí',
      education: 'Formación',
      teaching: 'Docencia',
      languages: 'Idiomas',
      venues: 'Publicado en',
      publications: 'Las 13 publicaciones',
      refsTitle: 'Referencias',
      altGumdo: 'Kenji Contreras con uniforme azul de Haidong Gumdo, sosteniendo una espada',
      altTkd: 'Kenji Contreras con uniforme blanco de taekwondo y cinturón negro',
    },
    contact: {
      title: '¿Qué quiere averiguar o automatizar?',
      lede: 'Cuénteme en qué está trabajando, ya sean datos por analizar o un proceso repetitivo por automatizar, y cómo sería un buen resultado. Le diré si puedo ayudarle y cómo lo haría.',
      email: 'Escríbame',
      cv: 'Descargar CV (PDF, en inglés)',
      or: 'o escriba a',
      howTitle: 'Cómo trabajo',
      how: 'Empezamos con una llamada breve sobre sus datos o su proceso y lo que debe lograr. Luego recibe una propuesta escrita con el alcance, el plazo y el precio, y el trabajo se entrega por etapas que usted puede revisar, con el código y la documentación al final. En español o en inglés.',
      city: 'Ciudad de Panamá',
    },
    story: { hood: 'Detalle técnico:', tools: 'Herramientas usadas', related: 'Artículos relacionados', lead: 'Autor principal' },
  },
} as const;

export const t = (lang: Lang) => ui[lang];
