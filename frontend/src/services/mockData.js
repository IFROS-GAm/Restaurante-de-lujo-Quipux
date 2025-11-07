// Datos de ejemplo para sedes, mesas, especiales y reservas

export const sedes = [
  {
    id: 'centro',
    nombre: 'Sede Centro',
    direccion: 'Av. Principal 123',
    pisos: [1, 2],
    imagen: 'https://picsum.photos/seed/centro/800/500',
  },
  {
    id: 'norte',
    nombre: 'Sede Norte',
    direccion: 'Calle Dorada 45',
    pisos: [1, 2],
    imagen: 'https://picsum.photos/seed/norte/800/500',
  },
];

export const mesasPorSedeYPiso = {
  centro: {
    1: [
      { id: 'C1-01', capacidad: 2, estado: 'libre' },
      { id: 'C1-02', capacidad: 4, estado: 'libre' },
      { id: 'C1-03', capacidad: 4, estado: 'ocupada' },
    ],
    2: [
      { id: 'C2-01', capacidad: 2, estado: 'libre' },
      { id: 'C2-02', capacidad: 6, estado: 'libre' },
      { id: 'C2-03', capacidad: 2, estado: 'ocupada' },
    ],
  },
  norte: {
    1: [
      { id: 'N1-01', capacidad: 4, estado: 'libre' },
      { id: 'N1-02', capacidad: 2, estado: 'libre' },
      { id: 'N1-03', capacidad: 6, estado: 'ocupada' },
    ],
    2: [
      { id: 'N2-01', capacidad: 2, estado: 'libre' },
      { id: 'N2-02', capacidad: 4, estado: 'libre' },
      { id: 'N2-03', capacidad: 4, estado: 'ocupada' },
    ],
  },
};

export const especiales = {
  especialCasa: {
    titulo: 'Especial de la Casa',
    descripcion: 'Filete mignon con salsa de trufas y puré de patatas cremoso.',
    imagen: 'https://picsum.photos/seed/especial/800/600',
    precio: 42,
  },
  platoNoche: {
    titulo: 'Plato de la Noche',
    descripcion: 'Risotto de setas silvestres con queso parmesano envejecido.',
    imagen: 'https://picsum.photos/seed/noche/800/600',
    precio: 28,
  },
};

export const reservasEjemplo = [
  {
    id: 'R-001', cliente: 'Ana López', sede: 'centro', piso: 1, mesa: 'C1-02', personas: 2,
    fecha: new Date().toISOString().slice(0, 10), hora: '20:00'
  },
  {
    id: 'R-002', cliente: 'Carlos Pérez', sede: 'norte', piso: 2, mesa: 'N2-02', personas: 4,
    fecha: new Date(Date.now() + 24*60*60*1000).toISOString().slice(0,10), hora: '21:30'
  },
  {
    id: 'R-003', cliente: 'María Gómez', sede: 'centro', piso: 1, mesa: 'C1-01', personas: 2,
    fecha: new Date(Date.now() + 3*24*60*60*1000).toISOString().slice(0,10), hora: '19:00'
  },
];

// Menú por tiempos/categorías (solo visual)
export const menuItems = [
  { id: 'm-entr-1', categoria: 'entradas', titulo: 'Ostras Frescas', descripcion: 'Selección de ostras del día con aderezos.', precio: 34, imagen: 'https://picsum.photos/seed/entradas-ostras/800/600' },
  { id: 'm-entr-2', categoria: 'entradas', titulo: 'Tartar de Atún', descripcion: 'Corte fino con aguacate, sésamo y cítricos.', precio: 26, imagen: 'https://picsum.photos/seed/entradas-atun/800/600' },
  { id: 'm-entr-3', categoria: 'entradas', titulo: 'Carpaccio de Res', descripcion: 'Láminas finas con rúcula y parmesano.', precio: 22, imagen: 'https://picsum.photos/seed/entradas-carpaccio/800/600' },

  { id: 'm-fuer-1', categoria: 'fuertes', titulo: 'Filete Wagyu', descripcion: 'Corte premium sellado con mantequilla de hierbas.', precio: 72, imagen: 'https://picsum.photos/seed/fuertes-wagyu/800/600' },
  { id: 'm-fuer-2', categoria: 'fuertes', titulo: 'Lomo de Cordero', descripcion: 'Cocción lenta con romero y reducción de vino.', precio: 48, imagen: 'https://picsum.photos/seed/fuertes-cordero/800/600' },
  { id: 'm-fuer-3', categoria: 'fuertes', titulo: 'Risotto de Trufa', descripcion: 'Arborio con trufa negra y parmesano añejo.', precio: 29, imagen: 'https://picsum.photos/seed/fuertes-risotto/800/600' },

  { id: 'm-post-1', categoria: 'postres', titulo: 'Soufflé de Chocolate', descripcion: 'Centro fundente con helado de vainilla bourbon.', precio: 18, imagen: 'https://picsum.photos/seed/postres-souffle/800/600' },
  { id: 'm-post-2', categoria: 'postres', titulo: 'Crème Brûlée', descripcion: 'Vainilla de Madagascar con costra dorada.', precio: 16, imagen: 'https://picsum.photos/seed/postres-creme/800/600' },

  { id: 'm-bebi-1', categoria: 'bebidas', titulo: 'Cóctel de la Casa', descripcion: 'Mezcla exclusiva con notas cítricas y florales.', precio: 14, imagen: 'https://picsum.photos/seed/bebidas-coctel/800/600' },
  { id: 'm-bebi-2', categoria: 'bebidas', titulo: 'Vino Tinto Reserva', descripcion: 'Selección sommelier, cuerpo medio y taninos suaves.', precio: 9, imagen: 'https://picsum.photos/seed/bebidas-vino/800/600' },
];

export const categoriasMenu = [
  { id: 'entradas', label: 'Entradas' },
  { id: 'fuertes', label: 'Platos Fuertes' },
  { id: 'postres', label: 'Postres' },
  { id: 'bebidas', label: 'Bebidas' },
];