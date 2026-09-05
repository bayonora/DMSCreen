const fs = require('fs');

const content = fs.readFileSync('src/components/Tutorial.tsx', 'utf8');

const newSections = `const TUTORIAL_SECTIONS = [
  {
    id: "initiative",
    title: "1. Iniciativa y Combate",
    icon: <Sword size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>El tracker de combate es el corazón de la acción, diseñado para ordenar automáticamente los turnos e identificar fácilmente aliados (verde) de enemigos (rojo).</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Añadir desde Grupo:</strong> El icono superior te permite traer cualquier Personaje, NPC o Criatura de tu base de datos directamente al combate con su iniciativa tirada.</li>
          <li><strong className="text-[#c1a063]">Combatientes Temporales ("Al Vuelo"):</strong> Si surge un combate imprevisto (ej. bandidos genéricos), usa la opción 'Temporal' para añadirlos sin que se guarden permanentemente en tu bestiario, manteniendo la base de datos limpia.</li>
          <li><strong className="text-[#c1a063]">Mecánica de Salud Rápida (¡Truco!):</strong> La casilla de HP soporta matemáticas en vivo. No calcules mentalmente: si un goblin de 30 HP recibe 12 de daño, simplemente haz clic en su salud, escribe <code className="text-[#c1a063] bg-[#14110f] px-1 py-0.5 rounded">-12</code> y pulsa Enter. Se restará solo. Funciona igual con curaciones (<code className="text-[#c1a063] bg-[#14110f] px-1 py-0.5 rounded">+15</code>).</li>
          <li><strong className="text-[#c1a063]">Estados Alterados:</strong> En el menú de 3 puntos de cada personaje puedes aplicar estados (Cegado, Paralizado...). Se mostrará un icono identificativo para que no te olvides de penalizar sus tiradas.</li>
          <li><strong className="text-[#c1a063]">El Cementerio:</strong> Cuando la vida llega a 0, puedes mandar al combatiente al cementerio (el botón de la calavera). Quedará guardado en un registro aparte para que puedas consultar sus stats o loot tras el combate, o revivirlo si resulta ser un no-muerto.</li>
        </ul>
      </div>
    )
  },
  {
    id: "party",
    title: "2. Grupo, NPCs y Criaturas",
    icon: <Shield size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Tu base de datos de actores. Todo lo que crees aquí puede mandarse al combate con el icono de la espada en su ficha.</p>
        <div className="bg-[#1e1a17] p-4 border border-[#c1a063]/30 rounded-sm my-2">
          <h4 className="text-[#c1a063] font-bold mb-2 uppercase tracking-wider text-xs">Sub-pestañas:</h4>
          <ul className="list-disc pl-5 space-y-1 text-[#8b7355]">
            <li><strong>Jugadores:</strong> Las fichas de los héroes (Clase, Nivel, Percepción Pasiva).</li>
            <li><strong>NPCs:</strong> Personajes de la trama, tenderos o aliados relevantes (con sus motivaciones y habilidades).</li>
            <li><strong>Criaturas:</strong> Tu bestiario de monstruos puros, listos para ser carne de cañón.</li>
          </ul>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Fichas de Estadísticas:</strong> Cada actor guarda su AC, Vida Máxima y Atributos (FUE, DEX...). Al abrir la ficha completa verás su bloque de estadísticas estilo D&D oficial.</li>
          <li><strong className="text-[#c1a063]">Exportación/Importación Modular:</strong> Cada sub-pestaña tiene su icono de guardar/subir. Puedes descargar un JSON sólo con tus Criaturas y pasárselo a otro máster sin destriparle quiénes son tus NPCs importantes. El sistema permite elegir si <em>Fusionar</em> (añadir a lo que ya tienes) o <em>Sobrescribir</em>.</li>
        </ul>
      </div>
    )
  },
  {
    id: "maps",
    title: "3. Mapas y Lugares",
    icon: <MapIcon size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Construye tu mundo visualmente y ten a mano el lore geopolítico.</p>
        <div className="bg-[#1e1a17] p-4 border border-[#c1a063]/30 rounded-sm my-2">
          <h4 className="text-[#c1a063] font-bold mb-2 uppercase tracking-wider text-xs">Sub-pestañas:</h4>
          <ul className="list-disc pl-5 space-y-1 text-[#8b7355]">
            <li><strong>Mapas Interactivos:</strong> Sube URLs de mapas, ábrelos a pantalla completa y haz zoom o arrástralos como en un VTT virtual. Muy útil para mostrar planos en una TV.</li>
            <li><strong>Lugares:</strong> Una mini-wiki de localizaciones. Ciudades, tabernas, o mazmorras con su descripción y región a la que pertenecen.</li>
          </ul>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Visualizador Inmersivo:</strong> Al pulsar un mapa, el entorno se oscurece y elimina las distracciones para que puedas orientarte a la perfección.</li>
        </ul>
      </div>
    )
  },
  {
    id: "quests",
    title: "4. Misiones (Quest Tracker)",
    icon: <Target size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Un sistema de ramificación (árbol jerárquico) para tramas complejas, evitando las típicas listas interminables.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Misión Raíz vs Submisión:</strong> Creas primero las tramas principales. Usando el icono de las flechas divergentes ("Ramificar") puedes crear misiones derivadas vinculadas visualmente a la principal (ej. Misión: Entrar al castillo -> Submisión: Conseguir la llave del pozo).</li>
          <li><strong className="text-[#c1a063]">Estados Rotativos:</strong> El icono circular a la izquierda del título te permite hacer clic para ciclar el estado de la misión: <span className="text-yellow-500">Pendiente</span> &rarr; <span className="text-green-500">Completada</span> &rarr; <span className="text-red-500">Fallida</span>.</li>
          <li><strong className="text-[#c1a063]">Pistas y Recompensas (+):</strong> Con el botón de suma puedes añadir notas internas a un nodo (una pista sobre el asesino, el tesoro que encontrarán...).</li>
          <li><strong className="text-[#c1a063]">Modo Lectura:</strong> Hacer clic en el propio título o imagen de la misión la abrirá en un modal grande, limpio, perfecto para leerle el texto introductorio a tus jugadores sin forzar la vista.</li>
        </ul>
      </div>
    )
  },
  {
    id: "notes",
    title: "5. Notas (Diario del DM)",
    icon: <BookOpen size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Tu libreta de diseño de campaña con soporte Markdown avanzado.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Formato Markdown:</strong> Escribe texto enriquerico rápidamente usando símbolos estándar: <code className="text-[#c1a063]"># Título</code>, <code className="text-[#c1a063]">**Negrita**</code>, <code className="text-[#c1a063]">- Lista</code>. Se renderizará perfectamente al visualizar la nota.</li>
          <li><strong className="text-[#c1a063]">Codificación por Color:</strong> A cada nota puedes asignarle una textura/color visual (Rojo para combates peligrosos, Azul para Lore antiguo...). Así reconoces tus archivos de un vistazo.</li>
        </ul>
      </div>
    )
  },
  {
    id: "shops",
    title: "6. Tiendas",
    icon: <Store size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Tenderos, mercancías y economía a tu alcance.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Oro del Tendero:</strong> Puedes asignarle un presupuesto de oro a cada comerciante para recordar cuánto pueden pagar si los jugadores les venden sus basuras.</li>
          <li><strong className="text-[#c1a063]">Inventario Híbrido:</strong> Cuando añades un objeto a una tienda, puedes escribir sus datos a mano, o mucho mejor: seleccionarlo de tu inventario global de la pestaña de 'Objetos'.</li>
          <li><strong className="text-[#c1a063]">Control de Stock:</strong> Puedes indicar cuántas unidades les quedan (ej. 5 Pociones Curativas) y restarlas conforme compren.</li>
        </ul>
      </div>
    )
  },
  {
    id: "items",
    title: "7. Objetos y Tablas de Botín",
    icon: <Package size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Tu arsenal personal y el sistema RNG (aleatorio) de recompensas.</p>
        <div className="bg-[#1e1a17] p-4 border border-[#c1a063]/30 rounded-sm my-2">
          <h4 className="text-[#c1a063] font-bold mb-2 uppercase tracking-wider text-xs">Sub-pestañas:</h4>
          <ul className="list-disc pl-5 space-y-1 text-[#8b7355]">
            <li><strong>Objetos Personalizados:</strong> Crea la Gran Espada Flameante. Dale rareza (Legendario, Común), precio e imagen. Podrás usarla en tiendas y tablas.</li>
            <li><strong>Tablas de Botín (RNG):</strong> El sistema estrella para loot aleatorio.</li>
          </ul>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Cómo hacer una Tabla (Probabilidades):</strong> Creas una tabla (ej. "Cadáver Orco"). Le añades filas. Cada fila tiene un <strong className="text-[#c1a063]">Peso</strong>. Si un ítem tiene peso 10 y otro peso 1, el de 10 saldrá 10 veces más frecuentemente.</li>
          <li><strong className="text-[#c1a063]">Tirar el Dado:</strong> Dentro de tu tabla, pulsa el botón en forma de Dado. El sistema calculará el total de pesos y generará un resultado totalmente matemático según esas probabilidades. No tienes que tirar porcentuales físicos nunca más.</li>
        </ul>
      </div>
    )
  },
  {
    id: "global",
    title: "8. Sistema Global y Herramientas",
    icon: <Settings size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Herramientas omnipresentes para no tener que salir nunca de la página de Rol.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Autoguardado 100% Offline:</strong> No hay servidores, todo se guarda en tu navegador automáticamente, a prueba de cortes de internet.</li>
          <li><strong className="text-[#c1a063]">Buscador Global (La lupa):</strong> En la barra superior. Si tus jugadores mencionan "El Zafiro Negro", escríbelo ahí y la app buscará en Notas, Objetos, NPCs y Mapas a la vez.</li>
          <li><strong className="text-[#c1a063]">Calculadora y Dados Virtuales:</strong> Accesible desde cualquier lugar en el icono lateral derecho. No ensucies la mesa con hojas en sucio, haz sumas rápidas o tira "4d6 + 5" directamente.</li>
          <li><strong className="text-[#c1a063]">Exportación Total (Engranaje):</strong> Genera tu <code>ndms_datos_completos.json</code> para guardar un backup de absolutamente TODO, pasarlo a otro PC, o restaurar la partida tras formatear el ordenador. Al importar, podrás elegir Fusionar (juntar datos) o Sobrescribir (borrar todo y dejar solo lo nuevo).</li>
        </ul>
      </div>
    )
  },
  {
    id: "legal",`;

const [beforeSections, rest] = content.split('const TUTORIAL_SECTIONS = [');
if (!rest) {
  console.log("Could not find TUTORIAL_SECTIONS array.");
  process.exit(1);
}

const [_, afterLegal] = rest.split('  {\n    id: "legal",');

if (!afterLegal) {
  console.log("Could not find legal section to reconstruct.");
  process.exit(1);
}

const newContent = beforeSections + newSections + afterLegal;

fs.writeFileSync('src/components/Tutorial.tsx', newContent);
console.log("Success");
