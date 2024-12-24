namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data.Models;
    using MONATE.Web.Server.Data.Packets.PortfolioInfo;
    using MONATE.Web.Server.Helpers;
    using MONATE.Web.Server.Logics;
    using System.Text;

    [ApiController]
    [Route("[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly MonateDbContext _context;

        public PortfolioController(MonateDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int page, string? query)
        {
            var _portfolios = await GetPortfoliosByQueryAsync(query);
            int _firstIndex = (page - 1) * 16;
            int _lastIndex = Math.Min(page * 16, _portfolios.Count);
            var _sendingData = new List<PortfolioResponseData>();

            if (_firstIndex >= _lastIndex)
                return Ok(new { portfolios = _sendingData, maxPage = 1 });

            var _sendingPortfolios = _portfolios[_firstIndex.._lastIndex];
            for (int i = 0; i < _sendingPortfolios.Count; i++)
            {
                var _categories = new List<string>();
                if (_sendingPortfolios[i].Categories != null) {
                    var categories = _sendingPortfolios[i].Categories.ToArray();
                    for (int j = 0; j < categories.Length; j++)
                        _categories.Add(categories[j].Name);
                }
                _sendingData.Add(new PortfolioResponseData
                {
                    Title = _sendingPortfolios[i].Title,
                    Url = _sendingPortfolios[i].Url,
                    Image = await System.IO.File.ReadAllTextAsync("Portfolios\\" + _sendingPortfolios[i].ImagePath),
                    Categories = _categories
                });
            }

            return Ok(new { portfolios = _sendingData, maxPage = ((_portfolios.Count - 1) / 16 + 1) });
        }

        [HttpPost("UploadPortfolio", Name = "Post /Portfolio/UploadPortfolio")]
        public async Task<IActionResult> UploadPortfolio([FromBody] PortfolioData portfolio)
        {
            if (string.IsNullOrEmpty(portfolio.Email) || string.IsNullOrEmpty(portfolio.Token) ||
                string.IsNullOrEmpty(portfolio.Title) || portfolio.CategoryIds == null)
            {
                return BadRequest(new { message = "Your portfolio data is not correct." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(portfolio.Email);
                var _token = Globals.Cryptor.Decrypt(portfolio.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.UserType != UserType.Administrator)
                {
                    return BadRequest(new { message = "This method is not allowed with your account." });
                }

                if (_user.Token == _token)
                {
                    var _title = Globals.Cryptor.Decrypt(portfolio.Title);
                    var _url = Globals.Cryptor.Decrypt(portfolio.Url);
                    var _image = Globals.Cryptor.Decrypt(portfolio.Image);

                    var _filePath = TokenHelper.ApiToken(_email);
                    if (!Directory.Exists("Portfolios"))
                        Directory.CreateDirectory("Portfolios");
                    await System.IO.File.WriteAllTextAsync("Portfolios\\" + _filePath, _image);

                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);

                    var _categories = new Category[portfolio.CategoryIds.Count];
                    for (int i = 0; i < _categories.Length; i++)
                        _categories[i] = await GetCategoryByIdAsync(portfolio.CategoryIds[i]);

                    await _context.Portfolios.AddAsync(new Portfolio
                    {
                        Title = _title,
                        Url = _url,
                        ImagePath = _filePath,
                        Categories = _categories,
                    });
                    _user.Token = _newToken;
                    _user.ExpireDate = DateTime.UtcNow.AddHours(1);
                    await _context.SaveChangesAsync();

                    return Ok(new { token = _cryptedNewToken });
                }
                else
                {
                    return BadRequest(new { message = "Your token is not registered." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.Location)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        private async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories
                .Include(c => c.Users)
                .Include(c => c.Endpoints)
                .Include(c => c.Portfolios)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        private async Task<List<Portfolio>> GetPortfoliosByQueryAsync(string? query)
        {
            var portfolios = await _context.Portfolios
                .Include(p => p.Categories)
                .ToListAsync();

            return portfolios.Where(p => ValidatePortfolio(p, query)).ToList();
        }

        private bool ValidatePortfolio(Portfolio p, string? query)
        {
            var stringBuilder = new StringBuilder();

            stringBuilder.Append(p.Title)
                         .Append(p.Url);

            if (p.Categories != null) foreach (var category in p.Categories)
            {
                stringBuilder.Append(category.Name);
            }

            return string.IsNullOrEmpty(query) || stringBuilder.ToString().IndexOf(query, StringComparison.OrdinalIgnoreCase) != -1;
        }
    }
}
