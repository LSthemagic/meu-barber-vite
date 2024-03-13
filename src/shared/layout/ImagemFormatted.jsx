import React from 'react';

const ImagemFormatada = ({ src }) => {
  return (
    <div style={{ maxWidth: '100%', height: 'auto', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={src}
        alt="Imagem formatada"
        style={{ maxHeight: '100%', width: 'auto' }}
      />
    </div>
  );
};

export default ImagemFormatada;
