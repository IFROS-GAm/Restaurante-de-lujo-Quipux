import React, { useRef, useState } from 'react';
import { api } from '../../services/apiService';

const AvatarUploader = ({ currentUrl, onUploaded, variant = 'circle', autoUpload = false, showSelectButton = true, showUploadButton = true }) => {
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const fileRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSelectedName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
    if (autoUpload) {
      await uploadFile(file);
    }
  }

  async function uploadFile(file) {
    try {
      setBusy(true);
      const fd = new FormData();
      fd.append('avatar', file);
      const { ok, user } = await api.upload('/clientes/avatar', fd, 'PUT');
      if (ok && onUploaded) onUploaded(user);
    } catch (err) {
      setError(err.message || 'Error subiendo avatar');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Selecciona una imagen');
      return;
    }
    await uploadFile(file);
  }

  const imgSrc = preview || currentUrl || 'https://via.placeholder.com/300x300.png?text=Avatar';

  function onAvatarClick() {
    fileRef.current?.click();
  }

  return (
    <div>
      <div className={`profile__avatar ${variant === 'square' ? 'profile__avatar--square' : ''}`} aria-label="Foto de perfil" role="button" tabIndex={0} onClick={onAvatarClick} onKeyDown={(e) => e.key === 'Enter' && onAvatarClick()}>
        <img src={imgSrc} alt="Avatar" />
        <div className="avatar-overlay">Cambiar</div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
      <div className="profile__actions" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        {showSelectButton && (
          <button className="btn btn--soft" onClick={() => fileRef.current?.click()} disabled={busy}>
            Elegir imagen
          </button>
        )}
        <p className="muted" style={{ marginTop: 6 }}>{selectedName || 'Ningún archivo seleccionado'}</p>
      </div>
      {showUploadButton && (
        <div className="profile__actions">
          <button className="btn btn--accent" onClick={handleUpload} disabled={busy}>
            {busy ? 'Subiendo...' : 'Guardar avatar'}
          </button>
        </div>
      )}
      {error && <p className="muted" style={{ color: '#f87171' }}>{error}</p>}
    </div>
  );
};

export default AvatarUploader;