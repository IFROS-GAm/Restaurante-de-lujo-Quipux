import React from 'react';

const Hero = ({ title, subtitle, ctaText, ctaHref = '/reservas' }) => {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <h1 className="hero__title">{title}</h1>
        {subtitle && <p className="hero__subtitle">{subtitle}</p>}
        {ctaText && (
          <a href={ctaHref} className="btn btn--accent">{ctaText}</a>
        )}
      </div>
    </section>
  );
};

export default Hero;