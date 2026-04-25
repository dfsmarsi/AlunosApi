import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from '../assets/logo.svg';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { clearAuth, getUser } from '../auth';

const CampoTexto = ({ label, name, type = 'text', readOnly = false, value, onChange, erro }) => (
  <div className="campo-grupo">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      className={erro ? 'is-invalid' : ''}
      onChange={readOnly ? undefined : onChange}
      value={value ?? ''}
      readOnly={readOnly}
    />
    {erro && <div className="erro-campo">{erro}</div>}
  </div>
);

function Dashboard() {
  const navigate = useNavigate();
  const userEmail = getUser();

  const [data, setData] = useState([]);
  const [modalIncluirAluno, setModalIncluirAluno] = useState(false);
  const [modalEditarAluno, setModalEditarAluno] = useState(false);
  const [modalExcluirAluno, setModalExcluirAluno] = useState(false);
  const [erros, setErros] = useState({});
  const [updateData, setUpdateData] = useState(true);
  const [busca, setBusca] = useState('');
  const [buscando, setBuscando] = useState(false);

  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '', nome: '', email: '', idade: ''
  });

  const abrirEFecharModalIncluirAluno = () => {
    setErros({});
    setAlunoSelecionado({ id: '', nome: '', email: '', idade: '' });
    setModalIncluirAluno(prev => !prev);
  };

  const abrirEFecharModalEditarAluno = () => {
    setErros({});
    setModalEditarAluno(prev => !prev);
  };

  const abrirEFecharModalExcluirAluno = () => {
    setModalExcluirAluno(prev => !prev);
  };

  const validar = (aluno) => {
    const novosErros = {};
    if (!aluno.nome || aluno.nome.trim().length < 3)
      novosErros.nome = 'Nome deve ter ao menos 3 caracteres.';
    if (!aluno.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aluno.email))
      novosErros.email = 'Informe um e-mail válido.';
    if (!aluno.idade || isNaN(aluno.idade) || parseInt(aluno.idade) <= 0)
      novosErros.idade = 'Informe uma idade válida.';
    return novosErros;
  };

  const pedidoGet = async () => {
    try {
      const response = await api.get('/Alunos');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const pedidoBusca = async (termo) => {
    if (!termo.trim()) { setUpdateData(true); return; }
    setBuscando(true);
    try {
      const response = await api.get(`/Alunos/AlunosPorNome?nome=${encodeURIComponent(termo)}`);
      setData(response.data);
    } catch (error) {
      if (error.response?.status !== 404) console.error(error);
      setData([]);
    } finally {
      setBuscando(false);
    }
  };

  const pedidoPost = async () => {
    const errosValidacao = validar(alunoSelecionado);
    if (Object.keys(errosValidacao).length > 0) { setErros(errosValidacao); return; }
    const payload = { ...alunoSelecionado, idade: parseInt(alunoSelecionado.idade) };
    delete payload.id;
    try {
      await api.post('/Alunos', payload);
      abrirEFecharModalIncluirAluno();
      setBusca('');
      setUpdateData(true);
    } catch (error) {
      setErros({ api: error.response?.data?.title || 'Erro ao incluir aluno.' });
    }
  };

  const pedidoPut = async () => {
    const errosValidacao = validar(alunoSelecionado);
    if (Object.keys(errosValidacao).length > 0) { setErros(errosValidacao); return; }
    const payload = { ...alunoSelecionado, idade: parseInt(alunoSelecionado.idade) };
    try {
      const response = await api.put(`/Alunos/${payload.id}`, payload);
      setData(prev => prev.map(a => a.id === payload.id ? response.data : a));
      abrirEFecharModalEditarAluno();
    } catch (error) {
      setErros({ api: error.response?.data?.title || 'Erro ao atualizar aluno.' });
    }
  };

  const pedidoDelete = async () => {
    try {
      await api.delete(`/Alunos/${alunoSelecionado.id}`);
      setData(prev => prev.filter(a => a.id !== alunoSelecionado.id));
      abrirEFecharModalExcluirAluno();
    } catch (error) {
      setErros({ api: error.response?.data?.title || 'Erro ao excluir aluno.' });
    }
  };

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);
    opcao === 'Editar' ? abrirEFecharModalEditarAluno() : abrirEFecharModalExcluirAluno();
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setAlunoSelecionado(prev => ({ ...prev, [name]: value }));
    setErros(prev => ({ ...prev, [name]: undefined }));
  };

  const handleBuscaSubmit = e => {
    e.preventDefault();
    pedidoBusca(busca);
  };

  const handleBuscaChange = e => {
    const v = e.target.value;
    setBusca(v);
    if (!v.trim()) setUpdateData(true);
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData]);

  return (
    <div className="dashboard-wrapper">

      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-brand">
          <img src={logoCadastro} alt="Logo" />
          <span>Painel de Alunos</span>
        </div>
        <div className="dashboard-nav-user">
          <span className="user-badge" title={userEmail}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            {userEmail}
          </span>
          <button className="btn-sair" onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="dashboard-content">

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-info">
              <span className="stat-valor">{data.length}</span>
              <span className="stat-label">Total de Alunos</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <form className="busca-form" onSubmit={handleBuscaSubmit}>
            <input
              type="text"
              className="busca-input"
              placeholder="Buscar por nome…"
              value={busca}
              onChange={handleBuscaChange}
            />
            <button type="submit" className="btn-buscar" disabled={buscando}>
              {buscando ? '…' : '🔍'}
            </button>
          </form>
          <button className="btn-adicionar" onClick={abrirEFecharModalIncluirAluno}>
            <span className="icone">＋</span> Adicionar aluno
          </button>
        </div>

        {/* Tabela */}
        <div className="tabela-card">
          <table className="aluno-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Idade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="5" className="tabela-vazia">Nenhum aluno encontrado.</td></tr>
              ) : (
                data.map(aluno => (
                  <tr key={aluno.id}>
                    <td data-label="Id">{aluno.id}</td>
                    <td data-label="Nome">{aluno.nome}</td>
                    <td data-label="Email">{aluno.email}</td>
                    <td data-label="Idade">{aluno.idade}</td>
                    <td data-label="Ações">
                      <div className="acoes">
                        <button className="btn-icone btn-editar" title="Editar" onClick={() => selecionarAluno(aluno, 'Editar')}>✏️</button>
                        <button className="btn-icone btn-excluir" title="Excluir" onClick={() => selecionarAluno(aluno, 'Excluir')}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Incluir */}
      <Modal isOpen={modalIncluirAluno}>
        <ModalHeader><span className="modal-titulo">Incluir aluno</span></ModalHeader>
        <ModalBody>
          {erros.api && <div className="erro-api">{erros.api}</div>}
          <CampoTexto label="Nome" name="nome" value={alunoSelecionado.nome} onChange={handleChange} erro={erros.nome} />
          <CampoTexto label="E-mail" name="email" type="email" value={alunoSelecionado.email} onChange={handleChange} erro={erros.email} />
          <CampoTexto label="Idade" name="idade" type="number" value={alunoSelecionado.idade} onChange={handleChange} erro={erros.idade} />
        </ModalBody>
        <ModalFooter>
          <div className="modal-footer-acoes">
            <button className="btn-cancelar" onClick={abrirEFecharModalIncluirAluno}>Cancelar</button>
            <button className="btn-gravar" onClick={pedidoPost}>Gravar</button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={modalEditarAluno}>
        <ModalHeader><span className="modal-titulo">Editar aluno</span></ModalHeader>
        <ModalBody>
          {erros.api && <div className="erro-api">{erros.api}</div>}
          <CampoTexto label="Id" name="id" readOnly value={alunoSelecionado.id} />
          <CampoTexto label="Nome" name="nome" value={alunoSelecionado.nome} onChange={handleChange} erro={erros.nome} />
          <CampoTexto label="E-mail" name="email" type="email" value={alunoSelecionado.email} onChange={handleChange} erro={erros.email} />
          <CampoTexto label="Idade" name="idade" type="number" value={alunoSelecionado.idade} onChange={handleChange} erro={erros.idade} />
        </ModalBody>
        <ModalFooter>
          <div className="modal-footer-acoes">
            <button className="btn-cancelar" onClick={abrirEFecharModalEditarAluno}>Cancelar</button>
            <button className="btn-gravar" onClick={pedidoPut}>Gravar</button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Modal Excluir */}
      <Modal isOpen={modalExcluirAluno}>
        <ModalHeader><span className="modal-titulo">Confirmar exclusão</span></ModalHeader>
        <ModalBody>
          {erros.api && <div className="erro-api">{erros.api}</div>}
          <p>Deseja excluir o aluno(a): <strong>{alunoSelecionado.nome}</strong>?</p>
        </ModalBody>
        <ModalFooter>
          <div className="modal-footer-acoes">
            <button className="btn-cancelar" onClick={abrirEFecharModalExcluirAluno}>Cancelar</button>
            <button className="btn btn-danger" onClick={pedidoDelete}>Excluir</button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Dashboard;
