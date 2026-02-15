import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ControladorCard from './ControladorCard';

// 401 Interceptor: Auto-logout on token expiry
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

function App() {
  // Autenticação
  const [auth, setAuth] = useState({ token: '', usuario: null });
  const [loginForm, setLoginForm] = useState({ email: '', senha: '' });
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [cadastroForm, setCadastroForm] = useState({ nome: '', email: '', senha: '' });

  // Usuários
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioForm, setUsuarioForm] = useState({ nome: '', email: '', id: null });

  // Controladores de Voo
  const [controladores, setControladores] = useState([]);
  const [controladorForm, setControladorForm] = useState({ nome: '', matricula: '', id: null });

  // Menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('usuarios');

  useEffect(() => {
    const parsed = JSON.parse(localStorage.getItem('auth') || '{}');
    if (parsed.token && parsed.usuario) {
      setAuth(parsed);
      if (parsed.token) axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
  }, []);

  // Load data when auth changes
  useEffect(() => {
    if (auth.token) {
      carregarUsuarios();
      carregarControladores();
    }
  }, [auth]);

  // === Login ===
  const fazerLogin = (e) => {
    e.preventDefault();
    axios.post('/login', loginForm)
      .then(res => {
        const { token, usuario } = res.data;
        setAuth({ token, usuario });
        localStorage.setItem('auth', JSON.stringify({ token, usuario }));
        if (res.data.token) axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      })
      .catch(() => alert('Email ou senha inválidos'));
  };

  const fazerLogout = () => {
    setAuth({ token: '', usuario: null });
    localStorage.removeItem('auth');
    delete axios.defaults.headers.common['Authorization'];
  };

  // === Usuários ===
  const carregarUsuarios = () => {
    axios.get('/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error('Erro ao carregar usuários:', err));
  };

  const salvarUsuario = (e) => {
    e.preventDefault();
    const metodo = usuarioForm.id ? 'put' : 'post';
    const url = usuarioForm.id ? `/usuarios/${usuarioForm.id}` : '/usuarios';

    axios[metodo](url, usuarioForm)
      .then(() => {
        setUsuarioForm({ nome: '', email: '', id: null });
        carregarUsuarios();
      })
      .catch(err => console.error('Erro ao salvar usuário:', err));
  };

  const editarUsuario = (usuario) => setUsuarioForm(usuario);
  const excluirUsuario = (id) => {
    axios.delete(`/usuarios/${id}`)
      .then(carregarUsuarios)
      .catch(err => console.error('Erro ao excluir usuário:', err));
  };

  // === Controladores de Voo ===
  const carregarControladores = () => {
    axios.get('/controladores', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
      .then(res => setControladores(res.data))
      .catch(err => console.error('Erro ao carregar controladores:', err));
  };
  const fazerCadastro = (e) => {
  e.preventDefault();
  axios.post('/register', cadastroForm)
    .then(() => {
      alert('Cadastro realizado com sucesso!');
      setCadastroForm({ nome: '', email: '', senha: '' });
      setMostrarCadastro(false);
    })
    .catch(() => alert('Erro ao cadastrar usuário'));
};
  const salvarControlador = (e) => {
    e.preventDefault();
    const metodo = controladorForm.id ? 'put' : 'post';
    const url = controladorForm.id ? `/controladores/${controladorForm.id}` : '/controladores';

    axios[metodo](url, controladorForm, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
      .then(() => {
        setControladorForm({ nome: '', matricula: '', id: null });
        carregarControladores();
      })
      .catch(err => console.error('Erro ao salvar controlador:', err));
  };

  const editarControlador = (controlador) => setControladorForm(controlador);
  const excluirControlador = (id) => {
    axios.delete(`/controladores/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
      .then(carregarControladores)
      .catch(err => console.error('Erro ao excluir controlador:', err));
  };

  if (!auth.token) {
    return (
      <div className="app-auth">
        <div className="auth-container">
          {mostrarCadastro ? (
            <>
              <h2>Cadastro</h2>
              <form onSubmit={fazerCadastro}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={cadastroForm.nome}
                  onChange={e => setCadastroForm({ ...cadastroForm, nome: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={cadastroForm.email}
                  onChange={e => setCadastroForm({ ...cadastroForm, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={cadastroForm.senha}
                  onChange={e => setCadastroForm({ ...cadastroForm, senha: e.target.value })}
                  required
                />
                <button className="btn" type="submit">Cadastrar</button>
              </form>
              <div className="auth-footer">
                <button onClick={() => setMostrarCadastro(false)}>Voltar para Login</button>
              </div>
            </>
          ) : (
            <>
              <h2>Login</h2>
              <form onSubmit={fazerLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={loginForm.senha}
                  onChange={e => setLoginForm({ ...loginForm, senha: e.target.value })}
                  required
                />
                <button className="btn" type="submit">Entrar</button>
              </form>
              <div className="auth-footer">
                <p>Ainda não tem conta? <button onClick={() => setMostrarCadastro(true)}>Cadastrar</button></p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`app-root ${menuOpen ? 'menu-open' : ''}`}>
      <header className="app-header">
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="app-title">Controladores da DNB SBVT</h1>
        <div className="header-actions">
          <span className="user-name">{auth.usuario.nome}</span>
          <button className="btn" onClick={fazerLogout}>Logout</button>
        </div>
      </header>

      <nav className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button 
          className={`sidebar-item ${currentPage === 'usuarios' ? 'active' : ''}`}
          onClick={() => { setCurrentPage('usuarios'); setMenuOpen(false); }}
        >
          📋 Usuários
        </button>
        <button 
          className={`sidebar-item ${currentPage === 'controladores' ? 'active' : ''}`}
          onClick={() => { setCurrentPage('controladores'); setMenuOpen(false); }}
        >
          ✈️ Controladores
        </button>
        <button 
          className={`sidebar-item ${currentPage === 'informacoes' ? 'active' : ''}`}
          onClick={() => { setCurrentPage('informacoes'); setMenuOpen(false); }}
        >
          ℹ️ Informações
        </button>
        <button 
          className={`sidebar-item ${currentPage === 'webmaster' ? 'active' : ''}`}
          onClick={() => { setCurrentPage('webmaster'); setMenuOpen(false); }}
        >
          👤 Webmaster
        </button>
      </nav>

      {/* Overlay para fechar menu */}
      {menuOpen && (
        <div className="sidebar-overlay visible" onClick={() => setMenuOpen(false)}></div>
      )}

      <main className="app-main">
        {/* Página 1: Usuários */}
        {currentPage === 'usuarios' && (
          <section className="panel">
            <h2>Usuários</h2>
            <form className="form-inline small" onSubmit={salvarUsuario}>
              <input
                type="text"
                placeholder="Nome"
                value={usuarioForm.nome}
                onChange={e => setUsuarioForm({ ...usuarioForm, nome: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={usuarioForm.email}
                onChange={e => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
                required
              />
              <button className="btn" type="submit">{usuarioForm.id ? 'Atualizar' : 'Criar'}</button>
              {usuarioForm.id && (
                <button className="btn ghost" type="button" onClick={() => setUsuarioForm({ nome: '', email: '', id: null })}>
                  Cancelar
                </button>
              )}
            </form>

            <div className="list">
              {usuarios.map(u => (
                <div key={u.id} className="list-item">
                  <div>
                    <strong>{u.nome}</strong>
                    <div className="muted">{u.email}</div>
                  </div>
                  <div>
                    <button className="btn small" onClick={() => editarUsuario(u)}>Editar</button>
                    <button className="btn small danger" onClick={() => excluirUsuario(u.id)}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Página 2: Controladores */}
        {currentPage === 'controladores' && (
          <section className="panel">
            <div className="panel-header">
              <h2>Controladores do APP Vitória</h2>
              <form className="form-inline small" onSubmit={salvarControlador}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={controladorForm.nome}
                  onChange={e => setControladorForm({ ...controladorForm, nome: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Matrícula"
                  value={controladorForm.matricula}
                  onChange={e => setControladorForm({ ...controladorForm, matricula: e.target.value })}
                  required
                />
                <button className="btn" type="submit">{controladorForm.id ? 'Atualizar' : 'Criar'}</button>
                {controladorForm.id && (
                  <button className="btn ghost" type="button" onClick={() => setControladorForm({ nome: '', matricula: '', id: null })}>
                    Cancelar
                  </button>
                )}
              </form>
            </div>

            <div className="cards-grid">
              {controladores.map(c => (
                <ControladorCard key={c.id} controlador={c} onEdit={editarControlador} onDelete={excluirControlador} />
              ))}
            </div>
          </section>
        )}

        {/* Página 3: Informações */}
        {currentPage === 'informacoes' && (
          <section className="panel">
            <div className="panel-header">
              <h2>Informações</h2>
            </div>
            
            <div className="info-content">
              <div className="info-box">
                <h3>📱 APP Vitória</h3>
                <p>Sistema de gerenciamento de Controladores de Voo com autenticação segura e interface moderna.</p>
              </div>

              <div className="info-box">
                <h3>🔐 Segurança</h3>
                <p>Todos os dados são protegidos com criptografia bcrypt e autenticação JWT. Suas informações estão seguras conosco.</p>
              </div>

              <div className="info-box">
                <h3>👥 Funcionalidades</h3>
                <ul>
                  <li>Gerenciar usuários do sistema</li>
                  <li>Controlar controladores de voo</li>
                  <li>Rastrear edições com informações de quem editou</li>
                  <li>Interface responsiva e intuitiva</li>
                </ul>
              </div>

              <div className="info-box">
                <h3>📊 Versão</h3>
                <p><strong>APP Vitória v1.0.0</strong></p>
                <p>Desenvolvido com React, Node.js e SQLite</p>
              </div>

              <div className="info-box">
                <h3>📧 Suporte</h3>
                <p>Para dúvidas ou sugestões, entre em contato com o administrador do sistema.</p>
              </div>
            </div>
          </section>
        )}

        {/* Página 4: Webmaster */}
        {currentPage === 'webmaster' && (
          <section className="panel">
            <h2>Webmaster</h2>
            <div className="webmaster-container">
              <div className="webmaster-card">
                <div className="webmaster-avatar">👤</div>
                <div className="webmaster-info">
                  <h3>Gest. Alexandre Campagner Carvalho</h3>
                  <p className="role">Gestor e Webmaster</p>
                  <div className="contact-info">
                    <p><strong>📧 Email:</strong> <a href="mailto:campagnercarvalho@gmail.com">campagnercarvalho@gmail.com</a></p>
                  </div>
                  <p className="description">Responsável pela gestão técnica e desenvolvimento do APP Vitória.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
