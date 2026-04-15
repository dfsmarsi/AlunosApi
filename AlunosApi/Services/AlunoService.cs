using AlunosApi.Context;
using AlunosApi.Model;
using Microsoft.EntityFrameworkCore;

namespace AlunosApi.Services
{
    public class AlunoService : IAlunoService
    {
        private readonly AppDbContext _context;

        public AlunoService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Aluno>> GetAlunos()
        {
            try
            {
                return await _context.Alunos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao buscar todos os alunos GetAlunos: {ex.Message}");
            }
        }

        public async Task<Aluno> GetAlunoById(int id)
        {
            try
            {
                return await _context.Alunos.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao buscar aluno por ID GetAlunoById: {ex.Message}");
            }
            
        }

        public async Task<IEnumerable<Aluno>> GetAlunosByName(string nome)
        {
            try
            {
                return await _context.Alunos
                .Where(a => EF.Functions.ILike(a.Nome, $"%{nome}%"))
                .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao buscar aluno por nome GetAlunoByName: {ex.Message}");
            }
        }

        public async Task<Aluno> UpdateAluno(Aluno aluno)
        {
            if (aluno == null || aluno.Id == 0)
            {
                throw new ArgumentException("Aluno inválido para atualização.");
            }

            var existingAluno = await _context.Alunos.FindAsync(aluno.Id);
            if (existingAluno == null)
            {
                throw new KeyNotFoundException($"Aluno com ID {aluno.Id} não encontrado para atualização.");
            }

            existingAluno.Nome = aluno.Nome;
            existingAluno.Email = aluno.Email;
            existingAluno.Idade = aluno.Idade;
            try
            {
                _context.Alunos.Update(existingAluno);
                await _context.SaveChangesAsync();
                return existingAluno;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao atualizar aluno {aluno.Id} UpdateAluno: {ex.Message}");
            }

        }

        public async Task<Aluno> CreateAluno(Aluno aluno)
        {
            try
            {
                _context.Alunos.Add(aluno);
                await _context.SaveChangesAsync();
                return aluno;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao criar aluno CreateAluno: {ex.Message}");
            }
        }

        public async Task<bool> DeleteAluno(Aluno aluno)
        {
            try{
                _context.Alunos.Remove(aluno);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao deletar aluno DeleteAluno: {ex.Message}");
            }
        }
    }
}
