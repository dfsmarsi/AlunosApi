import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import logoCadastro from '../assets/logo.svg';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErros(prev => ({ ...prev, [name]: undefined, api: undefined }));
  };

  const validar = () => {
    const novos = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      novos.email = 'Informe um e-mail válido.';
    if (!form.password || form.password.length < 6)
      novos.password = 'A senha deve ter pelo menos 6 caracteres.';
    if (form.password !== form.confirmPassword)
      novos.confirmPassword = 'As senhas não conferem.';
    return novos;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errosValidacao = validar();
    if (Object.keys(errosValidacao).length > 0) { setErros(errosValidacao); return; }

    setLoading(true);
    try {
      await api.post('/Account/CreateUser', {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      navigate('/login', { state: { sucesso: 'Conta criada! Faça login para continuar.' } });
    } catch (error) {
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : 'Erro ao criar conta. Verifique os dados e tente novamente.';
      setErros({ api: msg });
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
          <p>Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {erros.api && <div className="erro-api">{erros.api}</div>}

          <div className="campo-grupo">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={erros.email ? 'is-invalid' : ''}
              autoComplete="email"
            />
            {erros.email && <div className="erro-campo">{erros.email}</div>}
          </div>

          <div className="campo-grupo">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className={erros.password ? 'is-invalid' : ''}
              autoComplete="new-password"
            />
            {erros.password && <div className="erro-campo">{erros.password}</div>}
          </div>

          <div className="campo-grupo">
            <label>Confirmar senha</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repita a senha"
              className={erros.confirmPassword ? 'is-invalid' : ''}
              autoComplete="new-password"
            />
            {erros.confirmPassword && <div className="erro-campo">{erros.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-link">
          Já tem conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
