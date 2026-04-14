using AlunosApi.Model;
using Microsoft.EntityFrameworkCore;

namespace AlunosApi.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Aluno> Alunos { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<Aluno>().HasData(
                    new Aluno { Id = 1, Nome = "João", Email = "joao@example.com", Idade = 20 },
                    new Aluno { Id = 2, Nome = "Braia", Email = "braia@example.com", Idade = 22 },
                    new Aluno { Id = 3, Nome = "Pedro", Email = "pedro@example.com", Idade = 19 }
                );
        }
    }
}
