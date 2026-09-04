import React, { useState } from "react";
import { Info, X, Shield, Map as MapIcon, Package, ScrollText, CheckCircle2, Target, Sword, Calculator, Settings, HelpCircle, ChevronRight } from "lucide-react";
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
          Bienvenido a la DM Screen
        </h2>
        
        <p className="text-[#e6e2da] text-sm leading-relaxed mb-6 mt-4">
          Esta herramienta está diseñada para que tengas todo el control de tu campaña de rol en un solo lugar de forma ágil y oscura.
          Aquí tienes un vistazo rápido de su poder:
        </p>

        <ul className="space-y-4 text-sm text-[#e6e2da] mb-8">
          <li className="flex items-start gap-3 bg-[#14110f] p-3 border border-[#3a302a] rounded-sm">
            <Sword size={20} className="text-[#c1a063] shrink-0 mt-0.5" />
            <span><strong>Iniciativa Dinámica:</strong> Gestiona combates con cálculo automático. ¡Tip pro: Puedes escribir sumas o restas (ej. <code className="text-[#c1a063] font-bold">-15</code>) directamente en la casilla de vida!</span>
          </li>
          <li className="flex items-start gap-3 bg-[#14110f] p-3 border border-[#3a302a] rounded-sm">
            <Target size={20} className="text-[#c1a063] shrink-0 mt-0.5" />
            <span><strong>Misiones (Árbol Dinámico):</strong> Estructura tus tramas de izquierda a derecha. Añade derivadas y detalles ocultos a cada nodo.</span>
          </li>
          <li className="flex items-start gap-3 bg-[#14110f] p-3 border border-[#3a302a] rounded-sm">
            <MapIcon size={20} className="text-[#c1a063] shrink-0 mt-0.5" />
            <span><strong>Mundo Visual:</strong> Sube tus propios mapas y lugares, visualízalos a pantalla completa con zoom interactivo y enriquece tu mundo.</span>
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
    title: "Grupo y NPCs",
    icon: <Shield size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Aquí gestionas a los jugadores y a los NPCs principales de tu campaña.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Añadir / Editar:</strong> Crea fichas rápidas con clase, raza, CA y Vida.</li>
          <li><strong className="text-[#c1a063]">NPCs:</strong> Puedes diferenciar entre aliados o enemigos recurrentes.</li>
          <li><strong className="text-[#c1a063]">A la Iniciativa:</strong> Los personajes creados aquí pueden enviarse fácilmente al Tracker de Iniciativa haciendo clic en el botón de la espada.</li>
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
        <p>El corazón de la acción. Este tracker ordena automáticamente por tirada de iniciativa y diferencia entre Grupo, Enemigos (Rojo) y Aliados.</p>
        <div className="bg-[#1e1a17] p-4 border border-[#c1a063]/30 rounded-sm my-2">
          <h4 className="text-[#c1a063] font-bold mb-2 uppercase tracking-wider text-xs">Mecánica de Daño Rápido</h4>
          <p>¡No pierdas tiempo calculando! En la casilla de vida de cualquier criatura, puedes escribir operaciones directamente. Por ejemplo, si el goblin tiene 25 de vida y recibe 8 de daño, simplemente escribe <code className="text-[#c1a063] bg-[#14110f] px-1 py-0.5 rounded">-8</code> y pulsa Enter. Se restará automáticamente.</p>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Avance de Turno:</strong> Pulsa 'Siguiente Turno' para marcar al actor actual (borde brillante).</li>
          <li><strong className="text-[#c1a063]">Estados alterados:</strong> Añade condiciones (Cegado, Derribado) haciendo clic en los 3 puntos y seleccionando añadir estado.</li>
          <li><strong className="text-[#c1a063]">Cementerio:</strong> Al morir, un combatiente va al Cementerio, pudiendo ser revivido o consultado más tarde.</li>
        </ul>
      </div>
    )
  },
  {
    id: "quests",
    title: "Árbol de Misiones",
    icon: <Target size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Un sistema dinámico horizontal para estructurar tu trama sin perder el hilo.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Raíces vs Ramas:</strong> Crea una 'Nueva Misión' raíz (ej: "Investigar el Culto"). Luego, usa el botón 'Ramificar' para crear sub-misiones derivadas de esa decisión.</li>
          <li><strong className="text-[#c1a063]">Detalles y Notas (+):</strong> Dentro de cada tarjeta, usa '+' para añadir pistas concretas, notas para ti o recompensas ocultas. Aparecerán como botones clicables.</li>
          <li><strong className="text-[#c1a063]">Estados:</strong> Pulsa en el icono circular de estado para alternar entre Activa, Completada (Verde) o Fallada (Rojo).</li>
        </ul>
      </div>
    )
  },
  {
    id: "maps",
    title: "Galería y Mapas",
    icon: <MapIcon size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Sube imágenes para ilustrar tu mundo a los jugadores.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Mapas Interactivos:</strong> Ábrelos a pantalla completa para poder hacer zoom interactivo (scroll o pellizcar) y moverte por la imagen para describir escenarios con detalle.</li>
          <li><strong className="text-[#c1a063]">Lugares:</strong> Crea tarjetas para localizaciones importantes con su nombre, región y descripción detallada para tener el contexto a mano.</li>
          <li><strong className="text-[#c1a063]">Optimización Automática:</strong> Las imágenes subidas se comprimen automáticamente de forma interna para que puedas tener muchos recursos visuales sin sobrecargar el navegador.</li>
        </ul>
      </div>
    )
  },
  {
    id: "shops",
    title: "Tiendas y NPCs",
    icon: <Package size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Gestiona inventarios de mercaderes y genera botín aleatorio al vuelo.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Tablas de Botín:</strong> Define colecciones de objetos con su probabilidad (peso) y tira los dados digitales para generar recompensas justas.</li>
          <li><strong className="text-[#c1a063]">Tiendas:</strong> Crea una tienda, añade objetos y controla su stock.</li>
          <li><strong className="text-[#c1a063]">Objetos Personalizados:</strong> Puedes crear items mágicos únicos (armas, equipo) y mantenerlos guardados para darlos cuando sea el momento.</li>
        </ul>
      </div>
    )
  },
  {
    id: "general",
    title: "Importar, Exportar y Guardado",
    icon: <Settings size={18} />,
    content: (
      <div className="space-y-4 text-sm text-[#e6e2da] leading-relaxed">
        <p>Tu información siempre es tuya y está protegida.</p>
        <ul className="list-disc pl-5 space-y-2 text-[#8b7355]">
          <li><strong className="text-[#c1a063]">Autoguardado Local:</strong> Todo lo que haces se guarda instantáneamente de forma local en tu navegador. No necesitas conexión.</li>
          <li><strong className="text-[#c1a063]">Ajustes Globales (Engranaje):</strong> Desde el menú lateral inferior, puedes Exportar un archivo `.json` con TODO el contenido de tu campaña como copia de seguridad, o Importar uno previo.</li>
          <li><strong className="text-[#c1a063]">Módulos Específicos:</strong> Además, en secciones como Notas o Misiones, encontrarás botones exclusivos para importar/exportar SÓLO esos elementos, útil para pasar listas de items entre campañas.</li>
        </ul>
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
