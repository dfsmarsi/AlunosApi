import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api';
import { saveAuth } from '../auth';
import logoCadastro from '../assets/logo.svg';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const mensagemSucesso = location.state?.sucesso;
  const [form, setForm] = useState({ email: '', password: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErro('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/Account/LoginUser', {
        email: form.email,
        password: form.password,
      });
      saveAuth(response.data.token, form.email);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErro('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logoCadastro} alt="Logo" />
          <h2>Sistema de Alunos</h2>
          <p>Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {mensagemSucesso && <div className="erro-api" style={{ background: '#dcfce7', color: '#166534' }}>{mensagemSucesso}</div>}
          {erro && <div className="erro-api">{erro}</div>}

          <div className="campo-grupo">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          <div className="campo-grupo">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link">
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
