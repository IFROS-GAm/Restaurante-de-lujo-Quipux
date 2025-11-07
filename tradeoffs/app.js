function createRadar(id, labels, datasets) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'radar',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: false }
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 10,
          grid: { color: 'rgba(0,0,0,0.06)' },
          angleLines: { color: 'rgba(0,0,0,0.06)' },
          pointLabels: { color: '#4a2b1c' }
        }
      }
    }
  });
}

function createBar(id, labels, dataBien, dataMejorable, labelBien = 'Hecho bien', labelMejorable = 'Mejorable') {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: labelBien, data: dataBien, backgroundColor: 'rgba(98,195,180,0.6)', borderColor: '#62c3b4' },
        { label: labelMejorable, data: dataMejorable, backgroundColor: 'rgba(246,166,35,0.6)', borderColor: '#f6a623' }
      ]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: { suggestedMin: 0, suggestedMax: 10, grid: { color: 'rgba(0,0,0,0.06)' } },
        y: { grid: { color: 'rgba(0,0,0,0.06)' } }
      },
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

const CALIDAD_WEB = {
  labels: ['Rendimiento', 'Usabilidad', 'Seguridad', 'Mantenibilidad', 'Escalabilidad'],
  datasets: [
    { label: 'Aplicación', data: [7, 8, 6, 7, 6], borderColor: '#62c3b4', backgroundColor: 'rgba(98,195,180,0.25)', pointBackgroundColor: '#62c3b4' }
  ]
};

const DETALLE_ATRIBUTOS = {
  rendimiento: { labels: ['Optimización actual'], bien: [7], mejorable: [3] },
  usabilidad: { labels: ['Flujos y responsive'], bien: [8], mejorable: [2] },
  seguridad: { labels: ['Controles y auth'], bien: [6], mejorable: [4] },
  mantenibilidad: { labels: ['Arquitectura y código'], bien: [7], mejorable: [3] },
  escalabilidad: { labels: ['Preparación de escalado'], bien: [6], mejorable: [4] }
};

const TECNOLOGIAS_RADAR = {
  labels: ['Rendimiento', 'Usabilidad', 'Seguridad', 'Mantenibilidad', 'Escalabilidad'],
  datasets: [
    { label: 'React', data: [7, 9, 6, 8, 7], borderColor: '#62c3b4', backgroundColor: 'rgba(98,195,180,0.25)' },
    { label: 'Node.js', data: [7, 6, 6, 7, 7], borderColor: '#f6a623', backgroundColor: 'rgba(246,166,35,0.25)' },
    { label: 'Supabase', data: [8, 7, 7, 7, 6], borderColor: '#8d6bd1', backgroundColor: 'rgba(141,107,209,0.25)' },
    { label: 'MVC', data: [6, 6, 7, 8, 6], borderColor: '#d16b6b', backgroundColor: 'rgba(209,107,107,0.25)' }
  ]
};

const DETALLE_TECNOLOGIAS = {
  react: { labels: ['Implementación'], bien: [8], mejorable: [2] },
  node: { labels: ['Back-end'], bien: [7], mejorable: [3] },
  supabase: { labels: ['Data/Auth'], bien: [7], mejorable: [3] },
  mvc: { labels: ['Estructura'], bien: [8], mejorable: [2] }
};

// Viabilidad del código (radar)
const VIABILIDAD_RADAR = {
  labels: ['Modularidad', 'Legibilidad', 'Control de complejidad', 'Cobertura de pruebas', 'Mantenibilidad'],
  datasets: [
    { label: 'Estado actual', data: [5, 4, 4, 3, 4], borderColor: '#d16b6b', backgroundColor: 'rgba(209,107,107,0.25)' },
    { label: 'Objetivo local', data: [8, 8, 7, 7, 8], borderColor: '#62c3b4', backgroundColor: 'rgba(98,195,180,0.25)' }
  ]
};

// Datos para comparativas extra (5 nuevos radares de 5 puntas)
// Trade-offs por flujos de la página (entorno local)
const FLUJOS_RADAR = {
  clientes: {
    labels: ['Claridad flujo', 'Rendimiento local', 'Errores', 'Accesibilidad', 'Satisfacción'],
    datasets: [
      { label: 'Estado actual', data: [8, 7, 6, 7, 7], borderColor: '#62c3b4', backgroundColor: 'rgba(98,195,180,0.25)' },
      { label: 'Objetivo local', data: [9, 8, 8, 8, 8], borderColor: '#f6a623', backgroundColor: 'rgba(246,166,35,0.25)' }
    ]
  },
  menus: {
    labels: ['Navegación', 'Edición básica', 'Validación', 'Consistencia visual', 'Carga local'],
    datasets: [
      { label: 'Estado actual', data: [8, 7, 6, 8, 7], borderColor: '#62c3b4', backgroundColor: 'rgba(98,195,180,0.25)' },
      { label: 'Objetivo local', data: [9, 8, 8, 9, 8], borderColor: '#f6a623', backgroundColor: 'rgba(246,166,35,0.25)' }
    ]
  },
  mesas: {
    labels: ['Estado visual', 'Asignación', 'Capacidad', 'Conflictos', 'Respuesta local'],
    datasets: [
      { label: 'Estado actual', data: [7, 6, 8, 5, 7], borderColor: '#62c3b4', backgroundColor: 'rgba(98,195,180,0.25)' },
      { label: 'Objetivo local', data: [8, 7, 8, 7, 8], borderColor: '#f6a623', backgroundColor: 'rgba(246,166,35,0.25)' }
    ]
  },
  reservas: {
    labels: ['Formulario', 'Validaciones', 'Feedback', 'Pasos claros', 'Confirmación'],
    datasets: [
      { label: 'Estado actual', data: [7, 6, 7, 7, 7], borderColor: '#62c3b4', backgroundColor: 'rgba(98,195,180,0.25)' },
      { label: 'Objetivo local', data: [8, 8, 8, 8, 8], borderColor: '#f6a623', backgroundColor: 'rgba(246,166,35,0.25)' }
    ]
  },
  sedes: {
    labels: ['Ubicación', 'Detalle', 'Comparación', 'Atributos visibles', 'Coherencia UI'],
    datasets: [
      { label: 'Estado actual', data: [9, 7, 5, 7, 8], borderColor: '#62c3b4', backgroundColor: 'rgba(98,195,180,0.25)' },
      { label: 'Objetivo local', data: [9, 8, 7, 8, 9], borderColor: '#f6a623', backgroundColor: 'rgba(246,166,35,0.25)' }
    ]
  }
};

window.addEventListener('DOMContentLoaded', () => {
  // Calidad general de la web
  createRadar('radarCalidadWeb', CALIDAD_WEB.labels, CALIDAD_WEB.datasets);

  // Detalle por atributo (5 gráficas separadas)
  createBar('barPerformance', DETALLE_ATRIBUTOS.rendimiento.labels, DETALLE_ATRIBUTOS.rendimiento.bien, DETALLE_ATRIBUTOS.rendimiento.mejorable);
  createBar('barUsabilidad', DETALLE_ATRIBUTOS.usabilidad.labels, DETALLE_ATRIBUTOS.usabilidad.bien, DETALLE_ATRIBUTOS.usabilidad.mejorable);
  createBar('barSeguridad', DETALLE_ATRIBUTOS.seguridad.labels, DETALLE_ATRIBUTOS.seguridad.bien, DETALLE_ATRIBUTOS.seguridad.mejorable);
  createBar('barMantenibilidad', DETALLE_ATRIBUTOS.mantenibilidad.labels, DETALLE_ATRIBUTOS.mantenibilidad.bien, DETALLE_ATRIBUTOS.mantenibilidad.mejorable);
  createBar('barEscalabilidad', DETALLE_ATRIBUTOS.escalabilidad.labels, DETALLE_ATRIBUTOS.escalabilidad.bien, DETALLE_ATRIBUTOS.escalabilidad.mejorable);

  // Radar de tecnologías
  createRadar('radarTecnologiasStack', TECNOLOGIAS_RADAR.labels, TECNOLOGIAS_RADAR.datasets);

  // Radar de viabilidad del código
  createRadar('radarViabilidad', VIABILIDAD_RADAR.labels, VIABILIDAD_RADAR.datasets);

  // Detalle por tecnología
  createBar('barReact', DETALLE_TECNOLOGIAS.react.labels, DETALLE_TECNOLOGIAS.react.bien, DETALLE_TECNOLOGIAS.react.mejorable);
  createBar('barNode', DETALLE_TECNOLOGIAS.node.labels, DETALLE_TECNOLOGIAS.node.bien, DETALLE_TECNOLOGIAS.node.mejorable);
  createBar('barSupabase', DETALLE_TECNOLOGIAS.supabase.labels, DETALLE_TECNOLOGIAS.supabase.bien, DETALLE_TECNOLOGIAS.supabase.mejorable);
  createBar('barMVC', DETALLE_TECNOLOGIAS.mvc.labels, DETALLE_TECNOLOGIAS.mvc.bien, DETALLE_TECNOLOGIAS.mvc.mejorable);

  // Radar de restaurantes (se mantiene para el mapeo de DB)
  createRadar('radarRestaurantes', ['Tiempo atención', 'Personal', 'Capacidad', 'Ruido', 'Calidad', 'Ubicación'], [
    { label: 'Sede A', data: [7, 6, 8, 3, 8, 9], borderColor: '#62c3b4', backgroundColor: 'rgba(98,195,180,0.25)' },
    { label: 'Sede B', data: [6, 7, 7, 4, 7, 8], borderColor: '#f6a623', backgroundColor: 'rgba(246,166,35,0.25)' }
  ]);

  // Flujos principales de la página (5 tablas de 5 puntas)
  createRadar('radarClientes', FLUJOS_RADAR.clientes.labels, FLUJOS_RADAR.clientes.datasets);
  createRadar('radarMenus', FLUJOS_RADAR.menus.labels, FLUJOS_RADAR.menus.datasets);
  createRadar('radarMesas', FLUJOS_RADAR.mesas.labels, FLUJOS_RADAR.mesas.datasets);
  createRadar('radarReservas', FLUJOS_RADAR.reservas.labels, FLUJOS_RADAR.reservas.datasets);
  createRadar('radarSedes', FLUJOS_RADAR.sedes.labels, FLUJOS_RADAR.sedes.datasets);
});