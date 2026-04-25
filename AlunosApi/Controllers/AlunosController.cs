using AlunosApi.Model;
using AlunosApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlunosApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize (AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class AlunosController : ControllerBase
    {
        private IAlunoService _alunoService;

        public AlunosController(IAlunoService alunoService)
        {
            _alunoService = alunoService;
        }

        [HttpGet]
        public async Task<ActionResult<IAsyncEnumerable<Aluno>>> GetAlunos()
        {
            try
            {
                var alunos = await _alunoService.GetAlunos();
                return Ok(alunos.OrderBy(a => a.Nome));
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro ao obter os alunos.");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Aluno>> GetAlunoById(int id)
        {
            try
            {
                var aluno = await _alunoService.GetAlunoById(id);
                if (aluno == null)
                {
                    return NotFound();
                }
                return Ok(aluno);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro ao obter o aluno.");
            }
        }

        [HttpGet("AlunosPorNome")]
        public async Task<ActionResult<IAsyncEnumerable<Aluno>>> GetAlunosByName([FromQuery] string nome)
        {
            try
            {
                var alunos = await _alunoService.GetAlunosByName(nome);
                if (alunos == null)
                {
                    return NotFound();
                }
                return Ok(alunos);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro ao obter os alunos.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Aluno>> CreateAluno(Aluno aluno)
        {
            try
            {
                await _alunoService.CreateAluno(aluno);
                return CreatedAtAction(nameof(GetAlunoById), new { id = aluno.Id }, aluno);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro ao criar o aluno.");
            }
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Aluno>> UpdateAluno(int id, Aluno aluno)
        {
            if (id != aluno.Id)
                return BadRequest("O ID da URL não corresponde ao ID do aluno.");

            try
            {
                var existingAluno = await _alunoService.GetAlunoById(id);
                if (existingAluno == null)
                {
                    return NotFound();
                }
                var updated = await _alunoService.UpdateAluno(aluno);
                return Ok(updated);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro ao atualizar o aluno.");
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteAluno(int id)
        {
            try
            {
                var existingAluno = await _alunoService.GetAlunoById(id);
                if (existingAluno == null)
                {
                    return NotFound();
                }
                await _alunoService.DeleteAluno(existingAluno);
                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro ao deletar o aluno.");
            }
        }
    }
}
