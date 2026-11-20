// Spanish version of content.ts: same steps, same figures (traced in brief.md).
import type { StoryContent } from '../_shared/types';
import { content as en } from './content';

export const content: StoryContent = {
  ...en,
  title: 'Encontrando manatíes en fotos de dron del Canal de Panamá',
  meta: 'Smithsonian Tropical Research Institute y UTP, 2023 a 2025',
  steps: [
    {
      title: 'Manatíes en el Canal de Panamá',
      body: 'En 1964 se liberaron en el lago Gatún nueve manatíes del Caribe y un manatí amazónico para que comieran maleza acuática. El experimento se abandonó. Los animales escaparon de su encierro y se quedaron.',
      points: [
        'El lago se creó en 1913 como reserva de agua del Canal, y pronto se cubrió de plantas flotantes.',
        'Se esperaba que los manatíes, al pastar, limpiaran las plantas y ayudaran a combatir los mosquitos de la malaria.',
        'Son manatíes del Gran Caribe, una subespecie en peligro protegida en Panamá desde 1967.',
      ],
      stat: { value: '20 a 25', label: 'manatíes viven hoy en la cuenca del Canal, según las estimaciones' },
    },
    {
      title: 'Un lago demasiado grande para vigilarlo',
      body: 'El lago Gatún cubre unos 436 km², con un canal de navegación en medio. Los censos desde avionetas son costosos y difíciles sobre agua turbia y plantas flotantes densas.',
      points: [
        'El equipo dividió todo el lago en 44 áreas de muestreo de 48 a 856 hectáreas.',
        'Las áreas evitan el canal de navegación principal, donde la Autoridad del Canal restringe los vuelos.',
        'Los drones pequeños son una alternativa asequible y no invasiva.',
      ],
      stat: { value: '436 km²', label: 'de lago, divididos en 44 áreas de muestreo' },
    },
    {
      title: 'Así que volamos',
      body: 'Dos drones recorrieron líneas preprogramadas sobre cada área, a entre 60 y 100 m de altura, con una foto cada 3 a 5 segundos. Los vuelos se hicieron por la mañana, cada 15 días aproximadamente, de febrero de 2023 a abril de 2024.',
      points: [
        'Las fotos se solapan, así que un animal en la superficie suele aparecer en varias fotos seguidas.',
        'Tras las primeras rondas, el esfuerzo se concentró en las áreas que los manatíes más usaban.',
      ],
      facts: [
        { value: '65', label: 'vuelos' },
        { value: '221 h', label: 'en el aire' },
        { value: '26,678 ha', label: 'cubiertas' },
      ],
      hood: 'Dos drones DJI volaron transectos matutinos preprogramados, cada uno con un piloto certificado. Las fotos consecutivas se solapan, de modo que el mismo animal puede seguirse a lo largo de una secuencia.',
    },
    {
      title: 'Unos pocos píxeles en miles de fotos',
      body: 'Primero revisamos 57,332 fotos y encontramos 76 manatíes. Desde el aire, un manatí es una mancha pálida en un amplio cuadro de agua, y un tronco flotante puede verse casi igual.',
      points: [
        'Se vieron dieciséis parejas de madre y cría en nueve días de muestreo.',
        'Las sequías bajan el nivel del lago y dejan al descubierto muchos troncos, algunos con la silueta de un manatí.',
        'Los reflejos en el agua y las formas del fondo del lago engañan al ojo, y también a un modelo.',
      ],
      stat: { value: '57,332', label: 'fotos revisadas a ojo; 76 manatíes vistos' },
      hood: 'Fotos de hasta 9,504 × 6,336 px, separadas por secuencia para que fotos casi idénticas nunca queden a ambos lados de la división entre entrenamiento y prueba.',
    },
    {
      title: 'Cortar cada foto en recuadros',
      body: 'En una foto completa, el animal es demasiado pequeño para que un detector lo vea. Por eso cada foto se corta en recuadros que se solapan, el modelo revisa cada uno y sus hallazgos se trasladan a la foto completa.',
      points: [
        'El modelo aprendió a encontrar dos cosas: los manatíes y los troncos que no debe confundir con ellos.',
        'Los recuadros se solapan para que un animal en el borde no quede partido en dos.',
        'Aprendió con las fotos de un piloto y se probó con las del otro, que eran más difíciles: animales más tenues y peor luz.',
      ],
      stat: { value: '640 px', label: 'por recuadro; cada uno se revisa por separado' },
      hood: 'Un detector de objetos YOLOv8 ajustado (fine-tuning) y con inferencia por recortes (SAHI): cada foto se corta en recuadros solapados y las detecciones se fusionan sobre la foto completa. En validación cruzada de diez particiones, el mejor modelo alcanzó 93% de precisión y 92% de mAP50.',
    },
    {
      title: '¿Uno, una pareja o un grupo?',
      body: 'Para contar no basta con “aquí hay un manatí”. ¿Es un animal, una madre con su cría o un grupo? Un segundo modelo compara cada hallazgo con cinco descripciones escritas y elige la más cercana.',
      points: [
        'No necesita fotos de entrenamiento: las clases se describen con palabras. Visto desde arriba, un manatí tiene “la forma de un pez”.',
        'Primero se quita el color, para que el tono del agua y la luz pesen menos.',
        'En este ejemplo, que muestra a una madre con su cría y a un tercer manatí, las dos primeras respuestas casi empatan, y ambas son razonables.',
      ],
      hood: 'Clasificación zero-shot con AltCLIP, un modelo de visión y lenguaje: cada recorte en escala de grises se puntúa frente a las cinco descripciones, sin imágenes de entrenamiento. Se muestra un ejemplo del artículo con sus puntuaciones publicadas.',
    },
    {
      title: 'Qué tan bien funciona',
      body: 'Siguiendo a cada animal a lo largo de su secuencia de fotos, el sistema encontró a los manatíes en 27 de 30 secuencias de los vuelos con los que aprendió, y en 11 de 15 de vuelos que nunca había visto.',
      points: [
        'Foto por foto, en los vuelos nuevos es prudente: el 86% de lo que señala sí es un manatí, pero solo detecta 44 de cada 100.',
        'Los fallos ocurrieron sobre todo cuando un animal aparecía en solo una o dos fotos, o cuando había reflejos o muchos objetos en el agua.',
        'Agrupación: la respuesta correcta está entre sus dos primeras opciones el 89% de las veces. Los animales solos son fáciles; las parejas y los grupos, difíciles.',
      ],
      facts: [
        { value: '27 de 30', label: 'secuencias encontradas, vuelos con los que aprendió' },
        { value: '11 de 15', label: 'secuencias encontradas, vuelos nuevos' },
      ],
      factsLayout: 'list',
      hood: 'En las fotos del piloto no visto, la precisión fue de 86.2% y la exhaustividad (recall) de 43.8%. La agrupación zero-shot, probada en 316 recortes, acertó a la primera en el 70.6% de los casos y entre las dos primeras en el 88.9%; los manatíes solos fueron fáciles, las parejas de madre y cría, difíciles.',
    },
    {
      title: 'Para qué sirve',
      body: 'Es la primera mirada detallada a los manatíes de la cuenca del Canal, y un censo que puede repetirse sin capturar ni molestar a ningún animal: volar sobre el lago y dejar que el software revise las fotos.',
      points: [
        'Lo siguiente: detectar mejor las parejas de madre y cría, que muestran si la población se reproduce.',
        'Reconocer al mismo animal en distintas fotos, para no contar ninguno dos veces.',
        'El modelo es pequeño a propósito: la meta es un sistema que funcione en el propio dron, en tiempo real.',
      ],
      hood: 'Publicado en acceso abierto en Drones (MDPI), 2025.',
    },
  ],
  source: {
    label: 'Lea el artículo en Drones',
    href: en.source!.href,
  },
  credit:
    'Contorno del lago, áreas de muestreo, posiciones de las secuencias y fotografías de dron según Sanchez-Galan et al. 2025, Drones 9:230, CC BY 4.0 (fotografías recortadas; posiciones aproximadas; las secuencias grabadas en el mismo punto se dibujan como un solo punto). Las escenas dibujadas, y las manchas, recuadros y marcos sobre la foto dibujada, son ilustrativos.',
  stageAlt:
    'Diagrama animado en ocho etapas, todas vistas desde arriba: una hembra de manatí y su cría en el lago Gatún junto a la canoa de un pescador y plantas flotantes; un mapa del lago dividido en 44 áreas de muestreo; un dron que recorre líneas sobre un área y toma fotos; un muro de miles de fotos, y luego una foto en la que un manatí y varios troncos son manchas pequeñas; la foto cortada en recuadros solapados que se revisan uno a uno, con marcos sobre un manatí y los troncos; una foto real de dron con tres manatíes puntuada frente a cinco descripciones escritas, con dos respuestas casi empatadas; el mapa de nuevo con las secuencias encontradas y perdidas; y un dron que pasa sobre la madre y su cría.',
};
