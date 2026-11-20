// Spanish version of content.ts: same steps, same figures (traced in brief.md).
import type { StoryContent } from '../_shared/types';
import { content as en } from './content';

export const content: StoryContent = {
  ...en,
  title: 'Identificando por su huella de proteínas a los mosquitos y garrapatas que transmiten enfermedades',
  meta: 'UTP, INDICASAT-AIP y Smithsonian Tropical Research Institute, 2022 a 2023',
  steps: [
    {
      title: 'Animales pequeños, enfermedades graves',
      body: 'Algunos mosquitos transmiten la malaria y algunas garrapatas, la fiebre manchada. Estas enfermedades se contienen sobre todo vigilando y controlando a los animales que las transmiten, y eso empieza por saber qué especies hay.',
      points: [
        'Panamá tiene más especies descritas de mosquitos y garrapatas duras que cualquier otro país de Centroamérica.',
        'Los estudios se han centrado en unas pocas especies; la gran mayoría sigue sin estudiarse.',
      ],
      stat: { value: '265', label: 'especies de mosquitos se han registrado en Panamá' },
    },
    {
      title: 'Especies que se parecen',
      body: 'Un especialista distingue las especies con un microscopio y una clave de identificación. Es un trabajo lento, y algunas especies se parecen tanto que es fácil confundirlas.',
      points: [
        'Se llaman especies crípticas: casi el mismo cuerpo, distintos linajes evolutivos.',
        'Han faltado alternativas precisas, confiables y asequibles a la identificación visual.',
      ],
    },
    {
      title: 'Una huella de proteínas',
      body: 'Un espectrómetro de masas ofrece otro camino. Un láser libera las proteínas de una muestra de las patas del animal y las envía por un tubo, donde las moléculas más livianas llegan primero. Los tiempos de llegada forman un espectro: una huella de la especie.',
      points: [
        'La misma técnica ya se usa para identificar bacterias y otros microorganismos por sus proteínas.',
        'Cada espécimen se midió tres veces.',
        'Aquí, un espectro es una curva de unos 52,000 valores.',
      ],
      hood: 'MALDI-TOF: desorción/ionización láser asistida por matriz, con tiempo de vuelo. Especímenes recolectados en campo: mosquitos congelados en seco y garrapatas guardadas durante años en etanol al 70%.',
    },
    {
      title: 'Los datos: 1,136 espectros, 30 especies',
      body: 'Dos colecciones de estudios anteriores en Panamá, con cada espécimen identificado primero por un especialista. Algunas especies están bien representadas. Otras tienen solo seis espectros.',
      points: [
        'Cubren cerca del 70% del grupo de mosquitos de la malaria y del 50% de las garrapatas duras reportadas en Panamá.',
        'Trabajos anteriores limpiaban cada espectro en varios pasos ajustados a mano antes de clasificarlo. Aquí los espectros entran sin procesar.',
      ],
      facts: [
        { value: '826', label: 'espectros de 12 especies de mosquitos' },
        { value: '310', label: 'espectros de 18 especies de garrapatas duras' },
      ],
      factsLayout: 'list',
      hood: 'Cerca del 70% de los taxones de anofelinos y el 50% de los de garrapatas duras reportados en Panamá. De 24 a 192 espectros por especie de mosquito y de 6 a 60 por especie de garrapata; pesos por clase para compensar el desbalance.',
    },
    {
      title: 'Aprender a comparar, no a memorizar',
      body: 'Con tan pocos ejemplos de algunas especies, aprenderse cada una de memoria da resultados frágiles. En cambio, la red aprende una sola habilidad: acercar los espectros de la misma especie y alejar los de especies distintas.',
      points: [
        'Una versión ve dos espectros a la vez y decide si son “iguales” o “distintos”.',
        'Otra ve tres: un espectro de referencia, otro de la misma especie y otro de una especie distinta. Entrena con los casos más difíciles: las especies que se parecen.',
        'Una sola red pequeña lee todos los espectros, sin paso de limpieza.',
      ],
      hood: 'Aprendizaje métrico con una red siamesa (pérdida contrastiva) y una red de tripletas (triplet loss con minería de negativos difíciles). Ambas comparten un codificador convolucional 1D compacto que convierte cada espectro en un embedding normalizado.',
    },
    {
      title: 'Un mapa donde las especies forman islas',
      body: 'La red convierte cada espectro en un punto. Antes del entrenamiento, los espectros de una especie están dispersos por todo el mapa. Después quedan juntos, y las especies con espectros parecidos se vuelven vecinas.',
      points: [
        'Cada punto es un espectro. El mapa se reduce a dos dimensiones para poder verlo.',
        'Mosquitos y garrapatas se entrenaron por separado, así que hay dos mapas.',
      ],
      hood: 'Embeddings proyectados con PaCMAP. Los puntos por isla son conteos reales; las posiciones son ilustrativas.',
    },
    {
      title: 'Qué tan bien funciona',
      body: 'Un espectro nuevo recibe el nombre de sus vecinos más cercanos en el mapa. Con la versión que compara tres a la vez, el 99% de los espectros de mosquitos y el 93% de los de garrapatas reservados para la prueba recibieron la especie correcta.',
      points: [
        'Entre los mosquitos, todos los espectros de prueba menos uno se identificaron bien.',
        'Las garrapatas son más difíciles: menos espectros por especie, y los años en etanol degradan las proteínas.',
        'Para las garrapatas, el método anterior, ajustado a mano, fue casi igual de preciso (94%). La ventaja del nuevo es que no requiere preparar los espectros.',
      ],
      facts: [
        { value: '99%', label: 'mosquitos' },
        { value: '93%', label: 'garrapatas' },
      ],
      hood: 'K-NN sobre los embeddings de tripletas, validación cruzada Monte Carlo: exactitud de 99.8% en mosquitos y 93.2% en garrapatas. Redes siamesas: 91.9% y 91.5%.',
    },
    {
      title: 'Por qué importa',
      body: 'Una medición y un modelo entrenado pueden identificar un espécimen de forma rápida y consistente. Eso hace viable vigilar a las especies que transmiten enfermedades, incluidas las raras.',
      points: [
        'El mismo enfoque funcionó con dos grupos de animales muy distintos.',
        'Aprende a medir similitudes en lugar de memorizar una lista fija de especies, así que puede crecer a medida que se agregan espectros de otras.',
        'Límites: los especímenes vinieron del campo, y la causa de los pocos errores aún debe estudiarse.',
      ],
      hood: 'Publicado en acceso abierto en Artificial Intelligence in the Life Sciences (Elsevier), 2023.',
    },
  ],
  stack: ['Python', 'TensorFlow', 'scikit-learn', 'Redes siamesas', 'Triplet loss', 'K-NN', 'PaCMAP'],
  source: {
    label: 'Lea el artículo en Artificial Intelligence in the Life Sciences',
    href: en.source!.href,
  },
  credit:
    'Conteos de especies y espectros de Merchan et al. 2023 (tablas 1 y 2). Los dibujos, las curvas de los espectros y las posiciones de los puntos en los mapas son ilustrativos; no son las figuras del artículo ni datos medidos.',
  stageAlt:
    'Diagrama animado en ocho etapas: un mosquito y una garrapata con las enfermedades que transmiten; dos mosquitos casi idénticos bajo una lupa; un láser que incide sobre una muestra, moléculas que viajan por un tubo a distintas velocidades y un espectro que se dibuja; barras con cuántos espectros tiene cada una de 12 especies de mosquitos y 18 de garrapatas; tres espectros que pasan por una red, que acerca dos de la misma especie y aleja el tercero; dos mapas de puntos que se reúnen en una isla por especie; un punto nuevo que recibe el nombre de sus vecinos más cercanos, con 99% y 93% de acierto; y el mosquito y la garrapata de nuevo, ya identificados.',
};
