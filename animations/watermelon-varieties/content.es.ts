// Spanish version of content.ts: same steps, same figures (traced in brief.md).
import type { StoryContent } from '../_shared/types';
import { content as en } from './content';

const related = en.related!;

export const content: StoryContent = {
  ...en,
  title: 'Distinguiendo variedades de sandía a partir de una foto',
  meta: 'Universidad Tecnológica de Panamá, 2021 a 2022',
  steps: [
    {
      title: 'Una fruta de exportación, clasificada a ojo',
      body: 'La sandía es uno de los cultivos de exportación de Panamá, y clasificar la fruta por variedad depende de personas que inspeccionan cada una. El objetivo era probar si un modelo de machine learning podía identificar la variedad a partir de una foto y automatizar parte de ese trabajo.',
      points: [
        'La meta: un paso de reconocimiento que pudiera funcionar sobre una banda transportadora en una línea de empaque.',
        'Trabajos anteriores del mismo grupo extraían características de color y textura con algoritmos de procesamiento de imágenes. En este estudio, las redes neuronales aprenden esas características automáticamente a partir de las fotos: descubren por sí solas qué marcas y tonos de la cáscara distinguen a cada variedad, sin que haya que programarlos de antemano.',
      ],
    },
    {
      title: 'Tres variedades',
      body: 'Anna, Joya y Quetzali son las tres variedades de exportación del estudio. Se diferencian en sus marcas, su forma y la intensidad de su verde, pero no por mucho.',
      points: [
        'Las 330 fotos forman un conjunto de datos de estas tres variedades, con frutas aportadas por la Asociación de Productores de Sandía de Exportación Cascajalillo Unido (APSECU).',
      ],
      facts: [
        { value: '120', label: 'fotos de Anna' },
        { value: '90', label: 'de Joya' },
        { value: '120', label: 'de Quetzali' },
      ],
    },
    {
      title: 'Solo 330 fotos',
      body: 'Para una red neuronal es un conjunto de datos muy pequeño, y los tres grupos son desiguales. Cada foto se recortó a un trozo de cáscara y se redujo a 40 por 40 píxeles.',
      points: [
        'Con tan pocos ejemplos, una red entrenada desde cero los memorizaría en lugar de aprender las variedades.',
        'Voltear y rotar las fotos para crear más ejemplos no ayudó: las marcas que identifican una variedad no deben deformarse.',
      ],
      stat: { value: '330', label: 'fotos, cada una reducida a 40 × 40 píxeles' },
      hood: 'Fotos de 360 × 270 px. Particiones: 80/20 para transfer learning, 60/40 para aprendizaje métrico.',
    },
    {
      title: 'Método 1: tomar prestado un ojo entrenado',
      body: 'Se reutilizan, tal como están, redes que ya aprendieron a ver con una enorme colección de fotos cotidianas. Solo se entrena una pequeña parte final para distinguir las tres variedades.',
      points: [
        'Con esas fotos, la red ya aprendió a detectar bordes, texturas y formas, que también describen la cáscara de una sandía.',
        'El estudio comparó tres redes conocidas de este tipo.',
        'Una obtuvo el puntaje más alto en el entrenamiento (94%), pero estaba memorizando las fotos. Se eligió la más consistente.',
      ],
      hood: 'Transfer learning: VGG19, ResNet50 y EfficientNetB0, preentrenadas en ImageNet, cada una con una pequeña capa de clasificación nueva, ajustadas por búsqueda en malla y validación cruzada de 5 particiones. ResNet50 obtuvo el puntaje más alto (94.33%) pero se sobreajustó, así que se eligió EfficientNetB0 (90.56%).',
    },
    {
      title: 'Método 2: aprender qué significa “parecido”',
      body: 'El segundo método no pregunta directamente “¿qué variedad es?”. Aprende a colocar cerca, en un mapa, las fotos de la misma variedad, y luego nombra una foto nueva según sus vecinas.',
      points: [
        'Aprende con tres fotos a la vez: dos de la misma variedad se acercan y una de otra variedad se aleja.',
        'Un modelo así puede aprender después una variedad nueva con muy pocos ejemplos, algo importante cuando escasean las fotos.',
        'En el mapa, Joya se superpone con las otras dos.',
      ],
      hood: 'Aprendizaje métrico con triplet loss: cada foto se convierte en un embedding compacto, y K-NN asigna a una foto nueva la variedad de sus vecinas más cercanas. Los conteos por grupo de las 100 fotos de prueba son del artículo; las posiciones son ilustrativas.',
    },
    {
      title: 'El resultado',
      body: 'Con fotos que ninguno de los dos modelos había visto, el Método 1 acertó el 84% y el Método 2, el 81%. Ambos funcionan, y ambos tropiezan con la misma variedad: Joya.',
      points: [
        'La mayoría de los errores fueron sandías Joya confundidas con alguna de las otras, o las otras confundidas con Joya.',
        'Una red más antigua llegó solo al 60% con la misma receta.',
      ],
      facts: [
        { value: '84%', label: 'Método 1: ojo prestado' },
        { value: '81%', label: 'Método 2: mapa de similitud' },
      ],
      hood: 'Ambos métodos usan EfficientNetB0, probados con 66 fotos (transfer learning) y 100 (aprendizaje métrico); VGG19 llegó solo al 60% con transfer learning. Los conteos mostrados provienen de las matrices de confusión del artículo.',
    },
    {
      title: 'Hacia dónde va',
      body: 'Con solo 330 fotos, ambos métodos reconocieron la variedad en más de 8 de cada 10 casos. El siguiente paso es integrarlos en un sistema que ayude a los productores a clasificar su fruta, por ejemplo, con una cámara sobre la banda transportadora.',
      points: [
        'El artículo concluye que ambos modelos memorizaron un poco sus fotos de entrenamiento, algo esperable con tan pocos datos.',
        'Ideas para la siguiente etapa: redes basadas en atención, imágenes generadas para ampliar los datos y aprendizaje con pocos ejemplos (few-shot).',
      ],
      hood: 'Presentado como póster en el taller LatinX in AI de ICCV 2022 (Contreras et al. 2022).',
    },
  ],
  source: {
    label: 'Lea el artículo en IEEE Xplore (autor principal)',
    href: en.source!.href,
  },
  related: [
    { ...related[0], venue: 'Artículo de congreso, IEEE ISIE 2022' },
    { ...related[1], venue: 'Póster, taller LatinX in AI en ICCV 2022' },
    related[2],
  ],
  credit:
    'Las fotografías de las tres variedades y de los trozos de cáscara son de Contreras et al. 2022 (© 2022 IEEE), reutilizadas por el autor. Los puntos del mapa son ilustrativos, pero la cantidad que cae en cada grupo sigue la matriz de confusión del artículo. Las escenas de empaque y de la banda transportadora son dibujos.',
  stageAlt:
    'Diagrama animado en siete etapas: cajas de sandías con etiquetas de interrogación; fotografías de las tres variedades, Anna, Joya y Quetzali, muy parecidas entre sí; 330 cuadros pequeños, uno por foto, y una foto ampliada que muestra sus 40 por 40 píxeles; fotos cotidianas que enseñan a una gran red a detectar bordes, texturas y formas antes de bloquearla, luego una foto de sandía que ilumina los patrones que contiene y una pequeña parte entrenada que nombra la variedad; tres fotos en una ronda de entrenamiento, dos de la misma variedad que se acercan y una de otra que se aleja, luego 100 puntos que se reúnen en tres grupos, con el grupo de Joya superpuesto a los otros dos, y una foto nueva que recibe el nombre de sus vecinas más cercanas; barras que comparan los dos métodos para cada variedad, 84% y 81% en total; y sandías que pasan bajo una cámara sobre una banda transportadora y reciben etiquetas con su nombre.',
};
