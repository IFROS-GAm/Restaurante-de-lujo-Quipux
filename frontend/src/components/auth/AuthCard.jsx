import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../../services/apiService";
import "../../styles/auth-demo.css";
import { useAuth } from "../../context/AuthContext";

export default function AuthCard({ defaultMode = "login" }) {
  const initialChecked = useMemo(() => defaultMode === "register", [defaultMode]);
  const [checked, setChecked] = useState(initialChecked);
  const [logEmail, setLogEmail] = useState("");
  const [logPass, setLogPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  async function handleLogin() {
    try {
      setLoading(true);
      setMessage("");
      const { token } = await api.post("/auth/login", { email: logEmail, password: logPass });
      setToken(token);
      await refreshUser();
      setMessage("Acceso correcto");
      navigate("/usuario/perfil");
    } catch (err) {
      setMessage(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    try {
      setLoading(true);
      setMessage("");
      const { token } = await api.post("/auth/register", { name: regName, email: regEmail, password: regPass });
      setToken(token);
      await refreshUser();
      setMessage("Registro correcto");
      navigate("/usuario/perfil");
    } catch (err) {
      setMessage(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-demo">
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 200 }}>
          <Link to="/usuario/menu" className="btn">Volver al menú</Link>
        </div>
      </div>
      {/* Opcional: logo del demo */}
      {/* <a href="https://front.codes/" className="logo" target="_blank" rel="noreferrer">
        <img src="https://assets.codepen.io/1462889/fcy.png" alt="Front Codes" />
      </a> */}

      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>
                <input
                  className="checkbox"
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <label htmlFor="reg-log" aria-label="Alternar entre iniciar sesión y registrarse"></label>

                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    {/* FRONT - LOGIN */}
                    <div className="card-front">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Log In</h4>
                          <div className="form-group">
                            <input type="email" name="logemail" className="form-style" placeholder="Your Email" autoComplete="off" value={logEmail} onChange={(e) => setLogEmail(e.target.value)} />
                            <i className="input-icon uil uil-at" />
                          </div>
                          <div className="form-group mt-2">
                            <input type="password" name="logpass" className="form-style" placeholder="Your Password" autoComplete="off" value={logPass} onChange={(e) => setLogPass(e.target.value)} />
                            <i className="input-icon uil uil-lock-alt" />
                          </div>
                          <button className="btn mt-4" type="button" onClick={handleLogin} disabled={loading}>submit</button>
                          <p className="mb-0 mt-4 text-center"><a href="#0" className="link">Forgot your password?</a></p>
                          {message && !checked && (<p style={{ marginTop: 10 }}>{message}</p>)}
                        </div>
                      </div>
                    </div>

                    {/* BACK - REGISTER */}
                    <div className="card-back">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Sign Up</h4>
                          <div className="form-group">
                            <input type="text" name="logname" className="form-style" placeholder="Your Full Name" autoComplete="off" value={regName} onChange={(e) => setRegName(e.target.value)} />
                            <i className="input-icon uil uil-user" />
                          </div>
                          <div className="form-group mt-2">
                            <input type="email" name="logemail" className="form-style" placeholder="Your Email" autoComplete="off" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                            <i className="input-icon uil uil-at" />
                          </div>
                          <div className="form-group mt-2">
                            <input type="password" name="logpass" className="form-style" placeholder="Your Password" autoComplete="off" value={regPass} onChange={(e) => setRegPass(e.target.value)} />
                            <i className="input-icon uil uil-lock-alt" />
                          </div>
                          <button className="btn mt-4" type="button" onClick={handleRegister} disabled={loading}>submit</button>
                          {message && checked && (<p style={{ marginTop: 10 }}>{message}</p>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}