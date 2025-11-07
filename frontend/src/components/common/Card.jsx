import React from 'react';

const Card = ({ image, title, description, price, footer }) => {
  return (
    <div className="card">
      {image && (
        <div className="card__media">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        {description && <p className="card__desc">{description}</p>}
        {(price || footer) && (
          <div className="card__footer">
            {typeof price !== 'undefined' && (
              <span className="price">${price}</span>
            )}
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;