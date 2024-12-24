namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data.Models;
    using MONATE.Web.Server.Data.Packets.UserInfo;
    using MONATE.Web.Server.Data.Packets.EndpointInfo;
    using MONATE.Web.Server.Logics;
    using System.Text;
    using MONATE.Web.Server.Data.Packets.PortfolioInfo;
    using MONATE.Web.Server.Helpers;
    using MONATE.Web.Server.Data.Packets.CategoryInfo;

    [ApiController]
    [Route("[controller]")]
    public class EndpointController : ControllerBase
    {
        private readonly MonateDbContext _context;

        public EndpointController(MonateDbContext context)
        {
            _context = context;
        }

        [HttpPost("GetEndpoint", Name = "Post /Endpoint/GetEndpoint")]
        public async Task<IActionResult> GetEndpoint(EndpointData endpoint)
        {
            if (endpoint == null || string.IsNullOrEmpty(endpoint.Email) || string.IsNullOrEmpty(endpoint.Token))
            {
                return BadRequest(new { message = "Invalid token information" });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(endpoint.Email);
                var _token = Globals.Cryptor.Decrypt(endpoint.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Token == _token)
                {
                    if (_user.Permition == Permition.Pending)
                        return BadRequest(new { message = "Your account is pending now. Please contact with support team." });
                    if (_user.Permition == Permition.Suspended)
                        return BadRequest(new { message = "Your account is suspended now. Please contact with support team." });

                    var _idStr = Globals.Cryptor.Decrypt(endpoint.Id);
                    var _id = int.Parse(_idStr);

                    var _endpoint = await GetEndpointByIdAsync(_id);
                    var _u = await GetUserByEmailAsync(_endpoint.User.Email);
                    if (_endpoint == null)
                        return BadRequest(new { message = "Can't find endpoint with this id." });

                    var _title = Globals.Cryptor.Encrypt(_endpoint.Name);
                    var _userName = Globals.Cryptor.Encrypt(_u.Location.FirstName + " " + _u.Location.LastName);
                    var _userEmail = Globals.Cryptor.Encrypt(_endpoint.User.Email);
                    var _description = Globals.Cryptor.Encrypt(_endpoint.Description ?? "");
                    var _userAvatarPath = _endpoint.User.Profile.AvatarPath;
                    var _userAvatarData = await System.IO.File.ReadAllTextAsync("Avatars\\" + _userAvatarPath);
                    var _imagePath = _endpoint.ImagePath;
                    var _imageData = await System.IO.File.ReadAllTextAsync("Endpoints\\" + _imagePath);
                    var _userType = "client";
                    if (_endpoint.User.UserType == UserType.Administrator)
                        _userType = "administrator";
                    else if (_endpoint.User.UserType == UserType.TeamMember)
                        _userType = "team";
                    var _categories = new List<CategoryData>();
                    if (_endpoint.Categories != null)
                    {
                        var categories = _endpoint.Categories.ToList();
                        for (int i = 0; i < categories.Count; i++)
                        {
                            _categories.Add(new CategoryData
                            {
                                Id = categories[i].Id,
                                Name = categories[i].Name,
                            });
                        }
                    }
                    var _workflows = new List<WorkflowData>();
                    if (_endpoint.Workflows != null)
                    {
                        var workflows = _endpoint.Workflows.ToArray();
                        for (int j = 0; j < workflows.Length; j++)
                            _workflows.Add(new WorkflowData
                            {
                                Id = workflows[j].Id,
                                Version = workflows[j].Version,
                                Price = workflows[j].Price,
                                Image = System.IO.File.ReadAllText("Workflows\\" + workflows[j].ImagePath),
                                Permition = (int)workflows[j].Permition,
                            });
                    }

                    return Ok(new
                    {
                        title = _title,
                        userName = _userName,
                        userEmail = _userEmail,
                        userAvatar = Globals.Cryptor.Encrypt(_userAvatarData),
                        userType = Globals.Cryptor.Encrypt(_userType),
                        description = _description,
                        imageData = Globals.Cryptor.Encrypt(_imageData),
                        categories = _categories,
                        workflows = _workflows,
                        permition = (int)_endpoint.Permition,
                    });
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

        [HttpPost("GetEndpoints", Name = "Post /Endpoint/GetEndpoints")]
        public async Task<IActionResult> GetEndpoints(PageData page)
        {
            if (page == null || string.IsNullOrEmpty(page.Email) || string.IsNullOrEmpty(page.Token))
            {
                return BadRequest(new { message = "Invalid token information" });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(page.Email);
                var _token = Globals.Cryptor.Decrypt(page.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Token == _token)
                {
                    if (_user.Permition == Permition.Pending)
                        return BadRequest(new { message = "Your account is pending now. Please contact with support team." });
                    if (_user.Permition == Permition.Suspended)
                        return BadRequest(new { message = "Your account is suspended now. Please contact with support team." });

                    var _pageString = Globals.Cryptor.Decrypt(page.Page);
                    var _page = int.Parse(_pageString);
                    var _query = Globals.Cryptor.Decrypt(page.Query);

                    var _ids = "";
                    var _endpointList = await GetPermittedEndpointsAsync(_query);
                    for (int idx = _page * 12; idx < _endpointList.Count; idx++)
                    {
                        _ids += _endpointList[idx].Id.ToString() + " ";
                    }
                    if (!string.IsNullOrEmpty(_ids))
                        _ids = _ids.Substring(0, _ids.Length - 1);

                    var _endpointIds = Globals.Cryptor.Encrypt(_ids);
                    var _maxPage = Globals.Cryptor.Encrypt(((_endpointList.Count - 1) / 12 + 1).ToString());
                    return Ok(new { endpointIds = _endpointIds, maxPage = _maxPage });
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

        [HttpPost("GetEndpointsByUser", Name = "Post /Endpoint/GetEndpointsByUser")]
        public async Task<IActionResult> GetEndpointsByUser(PageData page)
        {
            if (page == null || string.IsNullOrEmpty(page.Email) || string.IsNullOrEmpty(page.Token))
            {
                return BadRequest(new { message = "Invalid token information" });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(page.Email);
                var _token = Globals.Cryptor.Decrypt(page.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Token == _token)
                {
                    if (_user.Permition == Permition.Pending)
                        return BadRequest(new { message = "Your account is pending now. Please contact with support team." });
                    if (_user.Permition == Permition.Suspended)
                        return BadRequest(new { message = "Your account is suspended now. Please contact with support team." });

                    var _pageString = Globals.Cryptor.Decrypt(page.Page);
                    var _page = int.Parse(_pageString);
                    var _query = Globals.Cryptor.Decrypt(page.Query);

                    var _ids = "";
                    var _endpointList = await GetPermittedEndpointsByUserAsync(_user, _query);
                    for (int idx = _page * 12; idx < _endpointList.Count; idx++)
                    {
                        _ids += _endpointList[idx].Id.ToString() + " ";
                    }
                    if (!string.IsNullOrEmpty(_ids))
                        _ids = _ids.Substring(0, _ids.Length - 1);

                    var _endpointIds = Globals.Cryptor.Encrypt(_ids);
                    var _maxPage = Globals.Cryptor.Encrypt(((_endpointList.Count - 1) / 12 + 1).ToString());
                    return Ok(new { endpointIds = _endpointIds, maxPage = _maxPage });
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

        [HttpPost("UploadEndpoint", Name = "Post /Endpoint/UploadEndpoint")]
        public async Task<IActionResult> UploadEndpoint([FromBody] NewEndpointData endpoint)
        {
            if (string.IsNullOrEmpty(endpoint.Email) || string.IsNullOrEmpty(endpoint.Token) ||
                string.IsNullOrEmpty(endpoint.Title) || endpoint.CategoryIds == null)
            {
                return BadRequest(new { message = "Your portfolio data is not correct." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(endpoint.Email);
                var _token = Globals.Cryptor.Decrypt(endpoint.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Token == _token)
                {
                    var _title = Globals.Cryptor.Decrypt(endpoint.Title);
                    var _description = Globals.Cryptor.Decrypt(endpoint.Description);
                    var _image = Globals.Cryptor.Decrypt(endpoint.Image);

                    var _filePath = TokenHelper.ApiToken(_email);
                    if (!Directory.Exists("Endpoints"))
                        Directory.CreateDirectory("Endpoints");
                    await System.IO.File.WriteAllTextAsync("Endpoints\\" + _filePath, _image);

                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);

                    var _categories = new Category[endpoint.CategoryIds.Count];
                    for (int i = 0; i < _categories.Length; i++)
                        _categories[i] = await GetCategoryByIdAsync(endpoint.CategoryIds[i]);

                    await _context.Endpoints.AddAsync(new Endpoint
                    {
                        Name = _title,
                        Description = _description,
                        ImagePath = _filePath,
                        Categories = _categories,
                        User = _user
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

        private async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories
                .Include(c => c.Users)
                .Include(c => c.Endpoints)
                .Include(c => c.Portfolios)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        private async Task<Endpoint?> GetEndpointByIdAsync(int id)
        {
            return await _context.Endpoints
                .Include(e => e.Categories)
                .Include(e => e.Workflows)
                .Include(e => e.Categories)
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        private async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.Location)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        private async Task<List<Endpoint>> GetPermittedEndpointsAsync(string? query)
        {
            var endpoints = await _context.Endpoints
                .Include(e => e.Categories)
                .Include(e => e.Workflows)
                .Include(e => e.Categories)
                .Include(e => e.User)
                .Where(e => e.Permition == Permition.Approved)
                .ToListAsync();

            return endpoints.Where(e => ValidateEndpoint(e, query)).ToList();
        }

        private async Task<List<Endpoint>> GetPermittedEndpointsByUserAsync(User u, string? query)
        {
            var endpoints = await _context.Endpoints
                .Include(e => e.Categories)
                .Include(e => e.Workflows)
                .Include(e => e.Categories)
                .Include(e => e.User)
                .Where(e => e.Permition == Permition.Approved)
                .Where(e => e.User == u)
                .ToListAsync();

            return endpoints.Where(e => ValidateEndpoint(e, query)).ToList();
        }

        private bool ValidateEndpoint(Endpoint e, string? query)
        {
            var _user = _context.Users
                .Include(u => u.Profile)
                .Include(u => u.Location)
                .FirstOrDefault(u => u.Email == e.User.Email);

            if (_user == null || _user.Location == null || _user.Profile == null)
                return false;

            var stringBuilder = new StringBuilder();

            stringBuilder.Append(e.User.Location.FirstName + " " + e.User.Location.LastName)
                         .Append(e.User.Email)
                         .Append(e.Name)
                         .Append(e.Description);

            if (e.User.UserType == UserType.Administrator)
            {
                stringBuilder.Append("Administrator");
            }
            else if (e.User.UserType == UserType.TeamMember)
            {
                stringBuilder.Append("MONATE");
            }

            if (e.Categories != null) foreach (var category in e.Categories)
                {
                    stringBuilder.Append(category.Name);
                }

            return string.IsNullOrEmpty(query) || stringBuilder.ToString().IndexOf(query, StringComparison.OrdinalIgnoreCase) != -1;
        }
    }
}
