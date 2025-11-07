import React from 'react';

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="section-header">
      <h2 className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;