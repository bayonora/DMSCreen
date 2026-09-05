import React, { useState } from "react";
import { Info, X, Shield, Map as MapIcon, Package, ScrollText, CheckCircle2, Target, Sword, Calculator, Settings, HelpCircle, ChevronRight, Users, Store, Backpack } from "lucide-react";
import { useStore, actions } from "../store/useStore";
import { Button } from "./ui/Input";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function WelcomeModal() {
  const { uiState } = useStore();
  const [isOpen, setIsOpen] = useState(!uiState.hasSeenWelcome);

  const handleClose = () => {
    setIsOpen(false);
    actions.updateUI({ hasSeenWelcome: true });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1e1a17] border border-[#c1a063] rounded-lg max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-bold tracking-widest uppercase text-[#c1a063] mb-4 flex items-center gap-3 border-b border-[#3a302a] pb-4">
          <Shield className="text-[#8b7355] shrink-0" size={28} />
          Bienvenid@ a Nellie's DM Screen
        </h2>
        
        <p className="text-[#e6e2da] text-sm leading-relaxed mb-6 mt-4">
          Esta herramienta está diseñada para que tengas todo el control de tu campaña de rol en un solo lugar de forma ágil y ordenada.
        </p>

        <ul className="space-y-4 text-sm text-[#e6e2da] mb-8 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
          <li className="flex items-start gap-3 bg-[#14110f] p-3 border border-[#3a302a] rounded-sm">
            <Users size={20} className="text-[#c1a063] shrink-0 mt-0.5" />
            <span><strong>Grupo y Actores:</strong> Gestiona a tus jugadores, NPCs relevantes y tu propio bestiario de criaturas, todos listos para saltar a la iniciativa con un clic.</span>
          </li>
          <li className="flex items-start gap-3 bg-[#14110f] p-3 border border-[#3a302a] rounded-sm">
            <Sword size={20} className="text-[#c1a063] shrink-0 mt-0.5" />
            <span><strong>Iniciativa Dinámica:</strong> Gestiona combates con cálculo automático. ¡Tip pro: Puedes escribir sumas o restas (ej. <code className="text-[#c1a063] font-bold">-15</code>) directamente en la casilla de vida!</span>
          </li>
          <li className="flex items-start gap-3 bg-[#14110f] p-3 border border-[#3a302a] rounded-sm">
            <Target size={20} className="text-[#c1a063] shrink-0 mt-0.5" />
            <span><strong>Misiones (Árbol Dinámico):</strong> Estructura tus tramas de izquierda a derecha. Añade derivadas y detalles ocultos a cada nodo.</span>
          </li>
          <li className="flex items-start gap-3 bg-[#14110f] p-3 border border-[#3a302a] rounded-sm">
            <Store size={20} className="text-[#c1a063] shrink-0 mt-0.5" />
            <span><strong>Tiendas:</strong> Crea mercaderes, dales un presupuesto de oro y adminístrales un stock de objetos para que tus jugadores puedan comerciar fácilmente.</span>
          </li>
          <li className="flex items-start gap-3 bg-[#14110f] p-3 border border-[#3a302a] rounded-sm">
            <Backpack size={20} className="text-[#c1a063] shrink-0 mt-0.5" />
            <span><strong>Objetos y Recompensas:</strong> Diseña items personalizados mágicos y crea Tablas de Botín para generar recompensas aleatorias equilibradas al vuelo.</span>
          </li>
        </ul>

        <div className="bg-[#14110f] border-l-2 border-[#8b7355] p-3 text-xs text-[#8b7355] mb-6 flex items-start gap-2">
          <HelpCircle size={16} className="shrink-0 text-[#c1a063]" />
          <p>
            Para un tutorial detallado sobre cómo aprovechar cada rincón, pulsa el <strong>botón (i)</strong> junto a la calculadora en el menú lateral.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleClose} className="px-8 font-bold tracking-widest text-xs h-10 hover:scale-105 transition-transform">
            ¡Entendido, a jugar!
          </Button>
        </div>
      </div>
    </div>
  );
}

const TUTORIAL_SECTIONS = [
  {
    id: "party",
    title: "Grupo, NPCs y Criaturas",
    icon: <Shield size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Aquí gestionas los actores principales de tu mundo: los jugadores, NPCs recurrentes y un bestiario propio de Criaturas.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Añadir y Editar:</strong> Crea fichas rápidas con clase/tipo, CA y Vida máxima.</li>
          <li><strong className="text-[#c1a063]">Criaturas vs NPCs:</strong> Usa la sección de Criaturas para tu bestiario base y NPCs para personajes con nombre.</li>
          <li><strong className="text-[#c1a063]">A la Iniciativa:</strong> Cualquier actor creado aquí se puede enviar al tracker de combate con un clic (icono de la espada).</li>
        </ul>
      </div>
    )
  },
  {
    id: "initiative",
    title: "Iniciativa y Combate",
    icon: <Sword size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>El corazón de la acción. Un tracker inteligente que ordena automáticamente a los combatientes y separa visualmente aliados de enemigos.</p>
        <div className="bg-[#1e1a17] p-4 border border-[#c1a063]/30 rounded-sm my-2">
          <h4 className="text-[#c1a063] font-bold mb-2 uppercase tracking-wider text-xs">Mecánica de Daño Rápido</h4>
          <p>¡No pierdas tiempo calculando mentalmente! En la casilla de vida, escribe operaciones directamente. Por ejemplo, si un goblin tiene 25 HP y recibe 8 de daño, simplemente escribe <code className="text-[#c1a063] bg-[#14110f] px-1 py-0.5 rounded">-8</code> y pulsa Enter.</p>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Combatientes al vuelo:</strong> El botón 'Añadir Personaje/Monstruo' permite crear enemigos rápidos que sólo existirán en este combate (marcados como Temporales). Así tu bestiario principal se mantiene limpio.</li>
          <li><strong className="text-[#c1a063]">Estados Alterados:</strong> Añade condiciones temporales (Cegado, Derribado) desde el menú de opciones (3 puntos) de cada combatiente.</li>
          <li><strong className="text-[#c1a063]">El Cementerio:</strong> Cuando la vida llega a 0, puedes mandar al combatiente al cementerio. Quedará registrado por si necesitas consultar el botín o revivirlo (icono de calavera).</li>
        </ul>
      </div>
    )
  },
  {
    id: "maps",
    title: "Mapas y Lugares",
    icon: <MapIcon size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Construye tu mundo de forma visual y organizada.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Mapas Interactivos:</strong> Ábrelos a pantalla completa para hacer zoom y desplazarte libremente. Ideal para mostrar planos en una pantalla secundaria a tus jugadores.</li>
          <li><strong className="text-[#c1a063]">Lugares (Wiki):</strong> Tarjetas dedicadas a localizaciones importantes con su nombre, región, imagen y una descripción detallada.</li>
          <li><strong className="text-[#c1a063]">Compartir Mapas:</strong> Al usar la función 'Importar' de esta pestaña, los nuevos mapas y lugares se <em>fusionan</em> con los tuyos (añadiéndose), en lugar de borrar tu contenido previo. ¡Perfecto para pasarse packs de mapas entre Másters!</li>
        </ul>
      </div>
    )
  },
  {
    id: "quests",
    title: "Misiones y Notas",
    icon: <Target size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Estructura tramas complejas y mantén tu lore organizado con el sistema de jerarquías.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Árbol de Misiones:</strong> Crea una 'Misión Raíz' y usa el botón 'Ramificar' (flechas) para crear sub-misiones. Así generas árboles visuales de la trama.</li>
          <li><strong className="text-[#c1a063]">Estados y Pistas:</strong> Haz clic en el icono circular para cambiar el estado (Activa, Completada, Fallada). Usa el icono '+' para añadir recompensas, objetivos o pistas dentro de cada nodo.</li>
          <li><strong className="text-[#c1a063]">Diario de Notas:</strong> Un espacio Markdown enriquecido para escribir tu lore. Usa colores para categorizar y dar personalidad a tus libretas.</li>
        </ul>
      </div>
    )
  },
  {
    id: "shops",
    title: "Objetos y Tiendas",
    icon: <Package size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Un compendio total para la economía y las recompensas del grupo.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Objetos Personalizados:</strong> Crea tu propio arsenal de items mágicos con rarezas, valores e imágenes, guardándolos como plantillas para el futuro.</li>
          <li><strong className="text-[#c1a063]">Tablas de Botín:</strong> Define recompensas y su probabilidad (peso). Pulsa el botón del 'Dado' y la app generará un resultado aleatorio equilibrado basándose en los pesos que pusiste.</li>
          <li><strong className="text-[#c1a063]">Tiendas de NPCs:</strong> Crea tenderos, añádeles oro y asígnales directamente objetos desde tu base de datos de Objetos Personalizados para controlar su stock.</li>
        </ul>
      </div>
    )
  },
  {
    id: "general",
    title: "Importar, Exportar y Sistema",
    icon: <Settings size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Tu información siempre es tuya, privada y está blindada contra accidentes.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Autoguardado Local:</strong> Funciona 100% offline. Tus partidas no dependen de ningún servidor.</li>
          <li><strong className="text-[#c1a063]">Copia de Seguridad Global (Engranaje):</strong> Desde el botón del engranaje situado en la esquina superior derecha de la pantalla principal, la 'Exportación Total' genera un <code>.json</code> con TODO (Misiones, Objetos, Combatientes, Mapas...). El importador global es inteligente y bloqueará cualquier archivo incompleto para evitar que sobreescribas tu campaña por error.</li>
          <li><strong className="text-[#c1a063]">Exportación Modular:</strong> Todas las pestañas individuales tienen sus propios iconos de exportar/importar en la esquina superior derecha. Sirven para compartir sólo esa sección (ej: "Quiero pasarte un archivo de Objetos, pero sin hacerte spoilers de mis Misiones").</li>
        </ul>
        <div className="bg-[#1e1a17] p-4 border border-[#c1a063]/30 rounded-sm mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="p-2 bg-[#14110f] rounded-full border border-[#3a302a] shrink-0">
            <Calculator size={20} className="text-[#c1a063]" />
          </div>
          <div>
            <h4 className="text-[#c1a063] font-bold uppercase tracking-wider text-xs">Calculadora y Dados</h4>
            <p className="text-xs text-[#8b7355] mt-1">Recuerda que pulsando el icono del dado en el menú lateral principal, invocas en cualquier momento la calculadora universal y el tirador de dados.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "legal",
    title: "Legal y Privacidad",
    icon: <ScrollText size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <div className="bg-[#1e1a17] p-4 border border-[#c1a063]/30 rounded-sm">
          <h4 className="text-[#c1a063] font-bold mb-2 uppercase tracking-wider text-xs">Política de Privacidad</h4>
          <p>Esta aplicación funciona bajo un modelo <strong>Local-First</strong>. No recopilamos, procesamos, almacenamos en la nube ni transferimos ningún dato personal. Toda la información de tus partidas, personajes y notas se almacena <strong>exclusivamente de forma local en tu navegador</strong> mediante <code>localStorage</code> y/o <code>IndexedDB</code>.</p>
        </div>
        <div className="bg-[#1e1a17] p-4 border border-[#c1a063]/30 rounded-sm">
          <h4 className="text-[#c1a063] font-bold mb-2 uppercase tracking-wider text-xs">Aviso Legal y Exención de Responsabilidad</h4>
          <p>Dado que los datos residen únicamente en tu dispositivo, el desarrollador no se hace responsable de la pérdida accidental de datos producida por borrar la caché, restablecer el navegador, o el uso de modos incógnito/privados. <strong>Te recomendamos encarecidamente utilizar la función de Exportar Datos periódicamente para mantener copias de seguridad de tus campañas.</strong> El servicio se ofrece "tal cual", sin garantías de ningún tipo.</p>
        </div>
        <div className="bg-[#1e1a17] p-4 border border-[#c1a063]/30 rounded-sm">
          <h4 className="text-[#c1a063] font-bold mb-2 uppercase tracking-wider text-xs">Aviso sobre Derechos de Autor (D&D 5e)</h4>
          <p>Esta herramienta es un recurso para fans y no está afiliada, respaldada, patrocinada, ni aprobada específicamente por Wizards of the Coast LLC. Esta aplicación está sujeta y construida en conformidad con la Fan Content Policy de WotC y la Open Game License (OGL). Ningún material oficial de pago de Dungeons & Dragons se incluye de forma pre-cargada. Los usuarios son responsables del contenido (incluyendo imágenes o textos) que decidan introducir en su almacenamiento local.</p>
        </div>
      </div>
    )
  }
];

export function FullTutorialModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeSection, setActiveSection] = useState(TUTORIAL_SECTIONS[0].id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#14110f] border border-[#c1a063]/50 rounded-lg max-w-4xl w-full h-[80vh] shadow-2xl relative flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#1e1a17] border-r border-[#3a302a] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#3a302a] flex justify-between items-center bg-[#1a1614]">
            <h2 className="text-[#c1a063] font-bold tracking-widest uppercase text-sm flex items-center gap-2">
              <HelpCircle size={16} /> Manual del Máster
            </h2>
            <button onClick={onClose} className="md:hidden text-[#8b7355] hover:text-[#c1a063]">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {TUTORIAL_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-sm flex items-center gap-3 text-sm font-medium transition-colors",
                  activeSection === sec.id 
                    ? "bg-[#c1a063]/10 text-[#c1a063] border border-[#c1a063]/30" 
                    : "text-[#8b7355] hover:bg-[#1a1614] hover:text-[#e6e2da] border border-transparent"
                )}
              >
                {sec.icon}
                <span className="flex-1 truncate">{sec.title}</span>
                {activeSection === sec.id && <ChevronRight size={14} />}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-[#3a302a] text-left mt-auto">
            <span className="text-[10px] text-[#8b7355] opacity-40 font-mono tracking-wider select-none">DMScreen 1.0 | © 2026 bayonora</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
          <button onClick={onClose} className="hidden md:flex absolute top-4 right-4 text-[#8b7355] hover:text-white transition-colors z-10 bg-[#1e1a17] p-1 rounded-sm border border-[#3a302a]">
            <X size={20} />
          </button>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-0">
            <AnimatePresence mode="wait">
              {TUTORIAL_SECTIONS.map((sec) => (
                sec.id === activeSection && (
                  <motion.div
                    key={sec.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#3a302a]">
                      <div className="p-3 bg-[#1e1a17] rounded-md border border-[#c1a063]/30 text-[#c1a063]">
                        {sec.icon}
                      </div>
                      <h3 className="text-2xl font-light tracking-widest uppercase text-white">
                        {sec.title}
                      </h3>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      {sec.content}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          
          <div className="p-4 border-t border-[#3a302a] bg-[#1a1614] flex justify-end">
             <Button onClick={onClose} className="px-6 text-xs tracking-widest">Cerrar Manual</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
