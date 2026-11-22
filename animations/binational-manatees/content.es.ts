// Spanish version of content.ts: same steps, same figures (traced in brief.md).
// Numbers keep Panama's format (2,500 and 83.75%). Paper titles stay in English.
import type { StoryContent } from '../_shared/types';
import { content as en } from './content';

export const content: StoryContent = {
  ...en,
  title: 'Reconociendo al manatí antillano por sus vocalizaciones, entre Panamá y Costa Rica',
  meta: 'Smithsonian Tropical Research Institute y UTP, 2021 a la fecha',
  intro: 'El equipo utilizó grabaciones submarinas para identificar a los manatíes por sus vocalizaciones y estudiar sus desplazamientos entre Panamá y Costa Rica.',
  steps: [
    {
      title: '¿Quiénes son los manatíes del Gran Caribe?',
      body: 'Trichechus manatus manatus es un gran mamífero acuático y un ingeniero de ecosistemas: al pastar, moldea la vegetación y los humedales donde se alimenta.',
      points: [
        'Una subespecie del manatí de las Américas, también conocida como manatí antillano.',
        'Vive en costas salobres, ríos y lagunas, entre pastos marinos y manglares.',
        'Madres y crías se reconocen por sus vocalizaciones cuando se reencuentran.',
      ],
      facts: [
        { value: 'Hasta 600 kg', label: 'de peso' },
        { value: '3 a 4 m', label: 'de largo' },
      ],
    },
    {
      title: 'En peligro y difíciles de contar',
      body: 'Viven desde el sur de México hasta el norte de Brasil, amenazados por las redes de pesca, la pérdida de humedales, la contaminación del agua y los choques con embarcaciones. En el agua turbia de los humedales apenas se ven, y menos aún se pueden contar.',
      points: [
        'Se proyecta una disminución adicional del 20% en las próximas dos generaciones.',
        'Las poblaciones son pequeñas y aisladas, y muchas apenas se han estudiado.',
        'Por eso, el equipo optó por escuchar en lugar de mirar, con micrófonos submarinos.',
      ],
      stat: { value: '< 2,500', label: 'adultos estimados en libertad. Lista Roja de la UICN: En Peligro.' },
      hood: 'Estado en la UICN de T. m. manatus: menos de 2,500 individuos maduros y una disminución proyectada del 20% en dos generaciones (Guzman et al. 2025, §1). Distribución, tamaño y amenazas: resumen público del laboratorio.',
    },
    {
      title: 'Una huella acústica',
      body: 'Cada manatí se comunica con su propia entonación. Un espectrograma convierte una vocalización en una imagen: las vocalizaciones de un animal varían, pero comparten rasgos que lo distinguen de los demás.',
      points: [
        'En promedio, un manatí vocaliza una o dos veces cada cinco minutos.',
        'Las vocalizaciones difieren en tono, registro y forma. El estudio usó dos tipos bien definidos: squeaks (planas) y high-squeaks (en forma de colina).',
        'La voz de un individuo puede seguir siendo reconocible durante años.',
      ],
      hood: 'Espectrogramas (transformada de Fourier de tiempo corto): tiempo en x, frecuencia en y, energía como brillo. Las vocalizaciones difieren en frecuencia, ancho de banda y contorno. Cada columna: dos vocalizaciones de un manatí, dos individuos conocidos y dos identificados en Panamá.',
    },
    {
      title: 'De las vocalizaciones a los individuos',
      body: 'El software compara miles de vocalizaciones y agrupa las que suenan parecido. Cada grupo se considera un manatí, y el software los encuentra sin que nadie le indique quién es quién ni cuántos hay.',
      points: [
        'Al probarlo primero con 23 manatíes capturados y grabados en un corral flotante, el método estimó 24.',
        'Los grupos se fusionaron, se revisaron a mano y se filtraron; todo grupo dudoso se descartó.',
        'Luego se compararon los grupos de ambos países para encontrar al mismo manatí en los dos.',
      ],
      hood: 'Cada vocalización se describe con características de scattering wavelets, se proyecta a un espacio de dimensiones reducidas con PaCMAP y se agrupa por clustering basado en densidad (HDBSCAN), de modo que el número de individuos no se fija de antemano. Las agrupaciones casi duplicadas se fusionan y se revisan a mano, y luego se emparejan entre los dos países. El método proviene de Merchan et al. 2024, donde se validó con 23 manatíes en cautiverio: 24 agrupaciones y 83.75% de las vocalizaciones asignadas correctamente.',
    },
    {
      title: 'Cómo lo hicimos, paso a paso',
      body: 'Un manatí vocaliza. Los hidrófonos graban. El audio se limpia y se filtra, una red neuronal confirma cada vocalización y el algoritmo la asigna a un individuo.',
      points: [
        'Hasta 15 hidrófonos graban 2 minutos cada 8 a 10 minutos: en Panamá desde 2015 y en Costa Rica desde 2020.',
        'Reproducidas una tras otra, las grabaciones durarían más de siete años.',
      ],
      stat: { value: '1,931,079', label: 'archivos de audio analizados: más de 64,000 horas de grabación' },
      facts: [{ value: '83.75%', label: 'de las vocalizaciones asignadas al manatí correcto, en pruebas con animales conocidos' }],
      hood: 'Las grabaciones se filtran y se limpian de ruido, un detector por autocorrelación (ACF-RMS) marca las vocalizaciones candidatas y una red convolucional (MobileNet, ajustada con transfer learning) confirma cuáles son de manatí. Las 30,928 vocalizaciones confirmadas pasan al clustering.',
    },
    {
      title: 'Lo que descubrimos',
      body: 'A partir de sus vocalizaciones, el estudio identificó 61 manatíes en Panamá y 49 en Costa Rica. Nueve se escucharon en ambos países, lo que revela una conexión entre los dos. La mayoría permaneció en una misma región durante largos periodos.',
      points: [
        'La primera evidencia acústica de que los manatíes conectan Panamá y Costa Rica.',
        'Los nueve salieron de Panamá por el río Changuinola; la mayoría entró a Costa Rica por Barra del Colorado.',
      ],
      stat: { value: '9', label: 'individuos cruzaron la frontera' },
      facts: [
        { value: '1,059 días', label: 'de permanencia promedio en Panamá' },
        { value: '292 días', label: 'de permanencia promedio en Costa Rica' },
        { value: '340 días', label: 'en promedio entre detecciones en los dos países' },
      ],
      factsLayout: 'list',
      hood: 'Se trata de individuos presuntos, ya que la identidad se infiere solo a partir de las vocalizaciones. Los nueve que cruzaron se cuentan en el total de cada país, y las permanencias más largas fueron de 3,026 días en Panamá y 1,160 en Costa Rica.',
    },
    {
      title: '¿Cuándo viajan?',
      body: 'Los cruces coincidieron con épocas más lluviosas y cálidas: en los periodos con cruces hubo más lluvia y el aire estuvo más cálido que en los demás. Las crecidas estacionales podrían abrir rutas hacia humedales y zonas de alimentación.',
      points: [
        'Datos climáticos satelitales de 2020 a 2024, comparados entre periodos con y sin cruces.',
        'Ambos países son muy vulnerables al cambio climático: temperaturas más altas, lluvias cambiantes y fenómenos extremos.',
      ],
      facts: [
        { value: '12.3 mm', label: 'de lluvia en el origen durante los cruces, frente a 8.3 mm' },
        { value: '+0.97 °C', label: 'de anomalía en la temperatura del aire, frente a +0.80 °C' },
      ],
      factsLayout: 'list',
      hood: 'Los datos climáticos satelitales, comparados en periodos de 15 días, muestran más lluvia y aire más cálido durante los cruces (p < 0.0001) y un nivel del mar algo más bajo, mientras que la temperatura superficial del mar no mostró relación. Es una asociación, no una causa demostrada.',
    },
    {
      title: 'Propuesta clave: un corredor binacional',
      body: 'Los datos de movimiento muestran que los manatíes no reconocen fronteras. El estudio propone que la conservación tampoco lo haga: un solo corredor protegido a lo largo de la costa caribeña de ambos países.',
      points: [
        '220 km de costa en Costa Rica y 764 km en Panamá, que unen áreas protegidas existentes.',
        'Mantiene conectados los humedales de alimentación y reproducción para animales que se mueven entre ellos.',
        'Las poblaciones conectadas conservan su diversidad genética, lo que protege a los grupos pequeños de la endogamia.',
      ],
      stat: { value: '984 km', label: 'de corredor binacional propuesto' },
      facts: [
        { value: '18', label: 'áreas protegidas' },
        { value: '4', label: 'humedales Ramsar' },
        { value: '57+', label: 'ríos' },
      ],
      hood: 'El corredor abarca ecosistemas marinos costeros y de humedal hasta la isóbata de 20 m; lo atraviesan 57 ríos y une 18 áreas protegidas y cuatro sitios Ramsar. Los próximos pasos son la telemetría satelital y la captura-recaptura acústica, para estimar el tamaño de la población.',
    },
    {
      title: 'Por qué importa',
      body: 'Es la primera evidencia acústica de que los manatíes conectan Panamá y Costa Rica. Da a ambos países una razón compartida, y datos compartidos, para protegerlos juntos.',
      points: [
        'Escuchar funciona donde mirar falla: de día y de noche, en agua turbia, sin capturar ni molestar a ningún animal.',
        'Las mismas grabaciones servirán para estimar cuántos manatíes viven en la zona, una cifra que aún no existe.',
        'El método puede seguir a otros animales que se oyen con más facilidad de lo que se ven.',
      ],
    },
  ],
  stack: ['Python', 'TensorFlow', 'MobileNet', 'Scattering wavelets (Kymatio)', 'PaCMAP', 'HDBSCAN'],
  source: {
    shortLabel: 'Leer el artículo',
    label: 'Lea el artículo en Frontiers in Marine Science',
    href: en.source!.href,
  },
  credit:
    'Mapas de Natural Earth; la distribución de la especie está simplificada. Las posiciones de los hidrófonos y los espectrogramas están adaptados de Guzman et al. 2025 (CC BY 4.0), con los espectrogramas recoloreados. Los puntos de vocalizaciones e individuos, y las huellas de voz del último paso, son ilustrativos.',
  stageAlt:
    'Diagrama animado en nueve etapas: una hembra de manatí y su cría, con su tamaño y peso; un mapa de la distribución de la especie de México a Brasil con sus principales amenazas; espectrogramas de dos vocalizaciones de cada uno de cuatro manatíes; las vocalizaciones de muchos manatíes ordenadas en grupos, uno por animal; el método en cinco pasos con sus cifras clave; un mapa de Costa Rica y Panamá con 49 y 61 manatíes identificados y nueve trayectorias a través de la frontera; las condiciones del clima durante los cruces; el corredor protegido propuesto de 984 km; y la madre con su cría de vuelta en el humedal, donde el agua se enturbia y las oculta mientras hidrófonos en Costa Rica y Panamá graban la misma voz.',
};
