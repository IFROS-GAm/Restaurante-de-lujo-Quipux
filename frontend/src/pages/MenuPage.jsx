import React, { useEffect, useMemo, useState } from 'react';
import Hero from '../components/common/Hero';
import SectionHeader from '../components/common/SectionHeader';
import Card from '../components/common/Card';
import MenuTabs from '../components/menu/MenuTabs';
import { api } from '../services/apiService';

const MenuPage = () => {
  const [cats, setCats] = useState([]);
  const [menu, setMenu] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setError('');
        const [{ categorias }, { items }] = await Promise.all([
          api.get('/menu/categorias'),
          api.get('/menu')
        ]);
        const mappedCats = (categorias || []).map((c) => ({ id: c.id, label: c.nombre }));
        setCats(mappedCats);
        setMenu(items || []);
        if (!activeCat) {
          const firstCat = mappedCats[0]?.id || (items?.[0]?.categoria || '');
          setActiveCat(firstCat);
        }
      } catch (err) {
        setError(err.message || 'No se pudo cargar el menú');
      }
    })();
  }, []);

  const items = useMemo(() => menu.filter(m => m.categoria === activeCat), [menu, activeCat]);

  return (
    <div className="page">
      <Hero
        title="Experiencia gastronómica"
        subtitle="Sabores de temporada, ingredientes seleccionados y técnica impecable"
        ctaText="Reservar mesa"
      />
      <SectionHeader
        title="Menú por tiempos"
        subtitle="Explore entradas, fuertes, postres y bebidas"
      />

      {cats.length > 0 ? (
        <MenuTabs categories={cats} value={activeCat} onChange={setActiveCat} />
      ) : (
        <p className="muted">{error || 'Cargando categorías...'}</p>
      )}

      <div className="grid grid-3">
        {items.map((item) => (
          <Card
            key={item.id}
            image={item.imagen}
            title={item.titulo}
            description={item.descripcion}
            price={item.precio}
          />
        ))}
        {cats.length > 0 && items.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card__content">
              <p className="muted">No hay platos para esta categoría.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;