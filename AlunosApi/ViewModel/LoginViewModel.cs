using System.ComponentModel.DataAnnotations;

namespace AlunosApi.ViewModel
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "O campo Email é obrigatório.")]
        [EmailAddress(ErrorMessage = "O campo Email deve ser um endereço de email válido.")]
        public string Email { get; set; }
        [Required(ErrorMessage = "O campo Password é obrigatório.")]
        [MinLength(6, ErrorMessage = "A senha deve conter no mínimo 6 caracteres.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
