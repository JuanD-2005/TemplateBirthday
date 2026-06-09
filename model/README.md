Coloca aquí el modelo 3D en formato GLB.

Ruta esperada por la página: `model/pinguino.glb`

Instrucciones rápidas:
- Usa un GLB/GLTF exportado desde Blender o similar.
- Optimiza el tamaño para la web (draco si quieres, pero necesitarás el decoder).
- Si el archivo no existe, la página mostrará un modelo de marcador de posición en 3D.

Ejemplo de uso en `Birthday.html` y `js/main.js` ya incluidos:
- Se carga `three.min.js`, `OrbitControls.js` y `GLTFLoader.js` desde CDN.
- El script `js/main.js` intentará `loader.load('model/pinguino.glb', ...)`.

¿Quieres que coloque un archivo GLB de ejemplo pequeño como marcador de posición? (puedo generarlo si quieres).