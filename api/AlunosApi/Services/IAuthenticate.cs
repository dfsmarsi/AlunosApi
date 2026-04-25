using Microsoft.AspNetCore.Identity;

namespace AlunosApi.Services
{
    public interface IAuthenticate
    {
        Task<bool> Authenticate(string email, string password);
        Task<IdentityResult> RegisterUser(string email, string password);
        Task Logout();
    }
}
