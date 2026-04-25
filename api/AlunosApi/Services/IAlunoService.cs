using AlunosApi.Model;

namespace AlunosApi.Services
{
    public interface IAlunoService
    {
        Task<IEnumerable<Aluno>> GetAlunos();
        Task<Aluno> GetAlunoById(int id);
        Task<IEnumerable<Aluno>> GetAlunosByName(string nome);
        Task<Aluno> CreateAluno(Aluno aluno);
        Task<Aluno> UpdateAluno(Aluno aluno);
        Task<bool> DeleteAluno(Aluno aluno);
    }
}
