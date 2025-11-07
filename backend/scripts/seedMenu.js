import dotenv from 'dotenv';
import { supabase } from '../config/supabaseConfig.js';

dotenv.config();

async function seedCategorias() {
  const categorias = [
    { id: 'entradas', nombre: 'Entradas', orden: 1 },
    { id: 'fuertes', nombre: 'Fuertes', orden: 2 },
    { id: 'postres', nombre: 'Postres', orden: 3 },
    { id: 'bebidas', nombre: 'Bebidas', orden: 4 }
  ];
  const { error } = await supabase
    .from('categorias_menu')
    .upsert(categorias, { onConflict: 'id' });
  if (error) throw error;
  console.log('[seed] Categorías sembradas/actualizadas');
}

async function existsMenuItem(titulo) {
  const { data, error } = await supabase
    .from('menu')
    .select('id')
    .eq('titulo', titulo)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error; // ignore not found
  return !!data;
}

async function seedMenu() {
  const items = [
    {
      titulo: 'Bruschetta clásica',
      descripcion: 'Pan tostado con tomate, albahaca y aceite de oliva',
      imagen: null,
      precio: 5.9,
      categoria: 'entradas',
      activo: true
    },
    {
      titulo: 'Ensalada César',
      descripcion: 'Lechuga romana, parmesano y aderezo césar',
      imagen: null,
      precio: 7.5,
      categoria: 'entradas',
      activo: true
    },
    {
      titulo: 'Lomo saltado',
      descripcion: 'Clásico salteado de res con papas y arroz',
      imagen: null,
      precio: 14.9,
      categoria: 'fuertes',
      activo: true
    },
    {
      titulo: 'Pasta al pesto',
      descripcion: 'Pesto de albahaca con parmesano y piñones',
      imagen: null,
      precio: 12.5,
      categoria: 'fuertes',
      activo: true
    },
    {
      titulo: 'Cheesecake de frutos rojos',
      descripcion: 'Base crocante con crema y frutos rojos',
      imagen: null,
      precio: 6.9,
      categoria: 'postres',
      activo: true
    },
    {
      titulo: 'Limonada de la casa',
      descripcion: 'Refrescante, con toque de hierbabuena',
      imagen: null,
      precio: 3.5,
      categoria: 'bebidas',
      activo: true
    }
  ];

  for (const item of items) {
    const already = await existsMenuItem(item.titulo);
    if (already) {
      console.log(`[seed] Ya existe: ${item.titulo}`);
      continue;
    }
    const { data, error } = await supabase.from('menu').insert(item).select();
    if (error) throw error;
    const created = Array.isArray(data) ? data[0] : data;
    console.log(`[seed] Insertado: ${created.titulo}`);
  }
}

async function main() {
  try {
    console.log('[seed] Iniciando siembra de categorías y menú...');
    await seedCategorias();
    await seedMenu();
    console.log('[seed] Listo. Puedes probar GET /api/menu');
    process.exit(0);
  } catch (err) {
    console.error('[seed] Error:', err);
    process.exit(1);
  }
}

main();