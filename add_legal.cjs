const fs = require('fs');
const path = 'src/components/Tutorial.tsx';
let code = fs.readFileSync(path, 'utf8');

const newSection = `,
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
];`;

code = code.replace(/}\n\];/, '}' + newSection);

fs.writeFileSync(path, code);
