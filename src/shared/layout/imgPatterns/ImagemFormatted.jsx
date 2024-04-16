import React from 'react';

function ImagemFormatted({ src, alt, className }) {
  return (
    <div className={`foto-padrao ${className}`}>
      <img
        className="foto-padrao-img"
        src={src}
        alt={alt}
      />
    </div>
  );
}

export default ImagemFormatted;
