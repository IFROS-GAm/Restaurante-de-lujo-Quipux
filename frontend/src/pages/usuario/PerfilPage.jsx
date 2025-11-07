import React, { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { useAuth } from '../../context/AuthContext';
import AvatarUploader from '../../components/profile/AvatarUploader';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/apiService';

const PerfilPage = () => {
  const { user, loading, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  useEffect(() => {
    if (!user) {
      refreshUser();
    }
  }, [user, refreshUser]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      loadReservas();
    }
  }, [user]);

  async function handleSaveProfile() {
    try {
      setSaving(true);
      setSaveMsg('');
      // Guardamos únicamente campos soportados por el backend
      await api.put('/clientes/me', { name, phone });
      await refreshUser();
      setSaveMsg('Perfil actualizado');
    } catch (err) {
      setSaveMsg(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function loadReservas() {
    try {
      setLoadingReservas(true);
      const { ok, items } = await api.get('/reservas/mine');
      if (ok) setReservas(items || []);
    } catch (err) {
      // noop visual
    } finally {
      setLoadingReservas(false);
    }
  }

  const proxima = useMemo(() => {
    if (!reservas || reservas.length === 0) return null;
    // Ya vienen ordenadas por fecha y hora asc; tomamos la primera futura
    const now = new Date();
    for (const r of reservas) {
      const dt = new Date(`${r.fecha}T${r.hora}`);
      if (dt >= now) return r;
    }
    // Si ninguna es futura, mostramos la última
    return reservas[reservas.length - 1];
  }, [reservas]);

  async function handleChangePassword() {
    try {
      setPwdMsg('');
      if (!currentPassword || !newPassword) {
        setPwdMsg('Completa la contraseña actual y la nueva');
        return;
      }
      if (newPassword.length < 6) {
        setPwdMsg('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPwdMsg('La confirmación no coincide');
        return;
      }
      const { ok, message } = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPwdMsg(ok ? (message || 'Contraseña actualizada') : 'No se pudo actualizar');
      if (ok) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPwdMsg(err.message || 'Error al actualizar contraseña');
    }
  }

  function openEditPanel() {
    setEditOpen(true);
  }
  function closeEditPanel() {
    setEditOpen(false);
    setPwdMsg('');
  }

  return (
    <div className="page">
      <SectionHeader title="Perfil" subtitle="Gestiona tu información y avatar" />
      {loading && <p className="muted">Cargando perfil...</p>}
      {!loading && user && (
        <div className="profile-frame profile-card--light">
          <div className="profile-grid">
            <div>
              <AvatarUploader
                currentUrl={user.avatar_url}
                onUploaded={() => refreshUser()}
                variant="square"
                autoUpload={true}
                showSelectButton={true}
                showUploadButton={false}
              />
              <div className="profile__actions" style={{ marginTop: 8 }}>
                <button
                  className="icon-btn icon-btn--danger"
                  onClick={handleLogout}
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  {/* power icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5.5 5.5a9 9 0 1013 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="profile-form">
              <div className="form-row">
                <div>
                  <label className="profile-label">Correo electrónico</label>
                  <input className="input" value={user.email} disabled />
                </div>
              </div>
            <div className="form-row">
              <div>
                <label className="profile-label">Nombre de usuario</label>
                <div className="editable-field">
                  <input className="input" type="text" value={name} readOnly />
                  <button className="edit-icon" aria-label="Editar perfil" onClick={openEditPanel} title="Editar perfil">
                    {/* lápiz */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21l3.75-.75L19.5 7.5 16.5 4.5 4.5 16.5 3 21z" fill="currentColor"/><path d="M20 4l-3 3" stroke="currentColor" strokeWidth="2"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div>
                <label className="profile-label">Teléfono</label>
                <div className="editable-field">
                  <input className="input" type="text" value={phone} readOnly />
                  <button className="edit-icon" aria-label="Editar perfil" onClick={openEditPanel} title="Editar perfil">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21l3.75-.75L19.5 7.5 16.5 4.5 4.5 16.5 3 21z" fill="currentColor"/><path d="M20 4l-3 3" stroke="currentColor" strokeWidth="2"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div>
                <label className="profile-label">Contraseña</label>
                <div className="editable-field">
                  <input className="input" type="password" value={'********'} readOnly />
                  <button className="edit-icon" aria-label="Editar perfil" onClick={openEditPanel} title="Editar perfil">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21l3.75-.75L19.5 7.5 16.5 4.5 4.5 16.5 3 21z" fill="currentColor"/><path d="M20 4l-3 3" stroke="currentColor" strokeWidth="2"/></svg>
                  </button>
                </div>
              </div>
            </div>
              {saveMsg && (<p className="muted" style={{ marginTop: 8 }}>{saveMsg}</p>)}
            </div>
          </div>
          <div className="card" style={{ marginTop: 18 }}>
            <div className="card__body">
              <h3 className="card__title">Tu reservación</h3>
              {loadingReservas && <p className="muted">Cargando reservaciones...</p>}
              {!loadingReservas && !proxima && (
                <p className="muted">No tienes reservaciones.</p>
              )}
              {!loadingReservas && proxima && (
                <div className="grid grid-2" style={{ gap: 12 }}>
                  <div>
                    <div className="info-tile__label">Sede</div>
                    <div className="info-tile__value">{proxima.sede}</div>
                  </div>
                  <div>
                    <div className="info-tile__label">Mesa</div>
                    <div className="info-tile__value">{proxima.mesa}</div>
                  </div>
                  <div>
                    <div className="info-tile__label">Personas</div>
                    <div className="info-tile__value">{proxima.personas}</div>
                  </div>
                  <div>
                    <div className="info-tile__label">Fecha y hora</div>
                    <div className="info-tile__value">{proxima.fecha} {proxima.hora}</div>
                  </div>
                  <div>
                    <div className="info-tile__label">Estado</div>
                    <span className="tag tag--reserved">{proxima.estado || 'pendiente'}</span>
                  </div>
                  {proxima.notas && (
                    <div className="form-row" style={{ gridColumn: '1 / -1' }}>
                      <div className="info-tile__label">Notas</div>
                      <div className="card__text">{proxima.notas}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {editOpen && (
            <div className="profile-edit-overlay" role="dialog" aria-modal="true">
              <div className="profile-edit-modal card">
                <div className="card__body">
                  <div className="modal-header">
                    <h3 className="card__title">Editar perfil</h3>
                    <button className="btn btn--soft" onClick={closeEditPanel} aria-label="Cerrar">Cerrar</button>
                  </div>
                  <div className="form-row">
                    <label className="profile-label">Nombre de usuario</label>
                    <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="form-row">
                    <label className="profile-label">Teléfono</label>
                    <input className="input" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Tu teléfono" />
                  </div>
                  <div className="profile__actions" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn btn--primary" onClick={async () => { await handleSaveProfile(); closeEditPanel(); }} disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</button>
                  </div>
                  <hr className="divider" />
                  <h4 className="card__subtitle">Cambiar contraseña</h4>
                  <div className="form-row two">
                    <div>
                      <label className="profile-label">Contraseña actual</label>
                      <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Tu contraseña" />
                    </div>
                    <div>
                      <label className="profile-label">Nueva contraseña</label>
                      <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nueva contraseña" />
                    </div>
                  </div>
                  <div className="form-row">
                    <label className="profile-label">Confirmar nueva contraseña</label>
                    <input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirma nueva contraseña" />
                  </div>
                  {pwdMsg && (<p className="muted" style={{ marginTop: 6 }}>{pwdMsg}</p>)}
                  <div className="profile__actions" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={handleChangePassword}>Actualizar Contraseña</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!loading && !user && (
        <p>Necesitas iniciar sesión para ver tu perfil.</p>
      )}
    </div>
  );
};

export default PerfilPage;