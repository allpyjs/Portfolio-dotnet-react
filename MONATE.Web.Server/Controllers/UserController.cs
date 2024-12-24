namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data.Packets.MailInfo;
    using MONATE.Web.Server.Helpers;
    using MONATE.Web.Server.Logics;
    using MONATE.Web.Server.Data.Models;
    using MONATE.Web.Server.Data.Packets.UserInfo;
    using System.Text;

    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MonateDbContext _context;

        public UserController(MonateDbContext context)
        {
            _context = context;
        }
        
        [HttpPost(Name = "Post /User")]
        public async Task<IActionResult> Post([FromBody] EmailData email)
        {
            if (email == null || string.IsNullOrEmpty(email.Email))
            {
                return BadRequest(new { message = "Invalid email data." });
            }

            try
            {
                var emailAddr = Globals.Cryptor.Decrypt(email.Email);

                var user = await GetUserByEmailAsync(emailAddr);
                if (user != null)
                    return BadRequest(new { message = "Your email is already used for signup." });

                if (VerifyEmailHelper.SendVerificationCode(emailAddr))
                    return Ok();
                else
                    return BadRequest(new { message = "Faild sending verify code to your email."});
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("ValidateToken", Name = "Post /User/ValidateToken")]
        public async Task<IActionResult> ValidateToken([FromBody] GeneralTokenData token)
        {
            if (token == null || string.IsNullOrEmpty(token.Email) || string.IsNullOrEmpty(token.Token))
            {
                return BadRequest(new { message = "Invalid token data." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(token.Email);
                var _token = Globals.Cryptor.Decrypt(token.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This token is not valid." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Token == _token)
                {
                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);

                    _user.Token = _newToken;
                    _user.ExpireDate = DateTime.UtcNow.AddHours(1);
                    await _context.SaveChangesAsync();

                    if (_user.Location == null)
                        return Ok(new { state = "location", token = _cryptedNewToken });
                    var _firstName = Globals.Cryptor.Encrypt(_user.Location.FirstName);
                    var _lastName = Globals.Cryptor.Encrypt(_user.Location.LastName);
                    var _state = Globals.Cryptor.Encrypt(_user.Location.State);
                    var _region = Globals.Cryptor.Encrypt(_user.Location.Country);
                    if (_user.Profile == null)
                        return Ok(new { state = "profile", firstName = _firstName, lastName = _lastName, stateAddr = _state, region = _region, token = _cryptedNewToken });
                    var _title = Globals.Cryptor.Encrypt(_user.Profile.Title);
                    var _fileData = await System.IO.File.ReadAllTextAsync("Avatars\\" + _user.Profile.AvatarPath);
                    var _avatar = Globals.Cryptor.Encrypt(_fileData);
                    if (_user.Permition == Permition.Pending)
                        return Ok(new { state = "pending", firstName = _firstName, lastName = _lastName, stateAddr = _state, region = _region, title = _title, avatar = _avatar, token = _cryptedNewToken });
                    if (_user.Permition == Permition.Suspended)
                        return Ok(new { state = "suspended", firstName = _firstName, lastName = _lastName, stateAddr = _state, region = _region, title = _title, avatar = _avatar, token = _cryptedNewToken });
                    return Ok(new { state = "success", firstName = _firstName, lastName = _lastName, stateAddr = _state, region = _region, title = _title, avatar = _avatar, token = _cryptedNewToken });
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

        [HttpPost("Login", Name = "Post /User/Login")]
        public async Task<IActionResult> Login([FromBody] LoginData loginData)
        {
            if (loginData == null || string.IsNullOrEmpty(loginData.Email) || string.IsNullOrEmpty(loginData.Password))
            {
                return BadRequest(new { message = "Invalid login data." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(loginData.Email);
                var _password = Globals.Cryptor.Decrypt(loginData.Password);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This email is not registered." });

                if (_password == _user.Password)
                {
                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);
                    _user.Token = _newToken;
                    _user.ExpireDate = DateTime.UtcNow.AddHours(1);
                    await _context.SaveChangesAsync();

                    if (_user.Location == null)
                        return Ok(new { state = "location", token = _cryptedNewToken });
                    var _firstName = Globals.Cryptor.Encrypt(_user.Location.FirstName);
                    var _lastName = Globals.Cryptor.Encrypt(_user.Location.LastName);
                    var _state = Globals.Cryptor.Encrypt(_user.Location.State);
                    var _region = Globals.Cryptor.Encrypt(_user.Location.Country);
                    if (_user.Profile == null)
                        return Ok(new { state = "profile", firstName = _firstName, lastName = _lastName, stateAddr = _state, region = _region, token = _cryptedNewToken });
                    var _title = Globals.Cryptor.Encrypt(_user.Profile.Title);
                    var _fileData = await System.IO.File.ReadAllTextAsync("Avatars\\" + _user.Profile.AvatarPath);
                    var _avatar = Globals.Cryptor.Encrypt(_fileData);
                    if (_user.Permition == Permition.Pending)
                        return Ok(new { state = "pending", firstName = _firstName, lastName = _lastName, stateAddr = _state, region = _region, title = _title, avatar = _avatar, token = _cryptedNewToken });
                    if (_user.Permition == Permition.Suspended)
                        return Ok(new { state = "suspended", firstName = _firstName, lastName = _lastName, stateAddr = _state, region = _region, title = _title, avatar = _avatar, token = _cryptedNewToken });
                    return Ok(new { state = "success", firstName = _firstName, lastName = _lastName, stateAddr = _state, region = _region, title = _title, avatar = _avatar, token = _cryptedNewToken });
                }
                else
                    return BadRequest(new { message = "Password is not correct." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("VerifyCode", Name = "Post /User/VerifyCode")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyData data)
        {
            if (data == null || string.IsNullOrEmpty(data.Email) || string.IsNullOrEmpty(data.Code))
            {
                return BadRequest(new { message = "Invalid verification data." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(data.Email);
                var _password = Globals.Cryptor.Decrypt(data.Password);
                var _code = Globals.Cryptor.Decrypt(data.Code);

                if (VerifyEmailHelper.VerifyEmail(_email, _code))
                {
                    var _token = TokenHelper.GeneralToken;
                    var _cryptedToken = Globals.Cryptor.Encrypt(_token);

                    var _user = await GetUserByEmailAsync(_email);
                    if (_user == null)
                    {
                        _context.Users.Add(new User
                        {
                            Email = _email,
                            Password = _password,
                            Token = _token,
                            ExpireDate = DateTime.UtcNow.AddHours(1),
                            Permition = Permition.Pending,
                            UserType = UserType.Client,
                        });
                    }
                    else
                    {
                        return BadRequest(new { message = "Your email is already registered." });
                    }
                    await _context.SaveChangesAsync();

                    return Ok(new { token = _cryptedToken });
                }
                else
                    return BadRequest(new { message = "Verify code is not correct." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("SaveLocation", Name = "Post /User/SaveLocation")]
        public async Task<IActionResult> SaveLocation([FromBody] LocationData location)
        {
            if (location == null || string.IsNullOrEmpty(location.Email) || string.IsNullOrEmpty(location.Token))
            {
                return BadRequest(new { message = "Invalid token infomation." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(location.Email);
                var _token = Globals.Cryptor.Decrypt(location.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Token == _token)
                {
                    var _firstName = Globals.Cryptor.Decrypt(location.FirstName);
                    var _lastName = Globals.Cryptor.Decrypt(location.LastName);
                    var _address1 = Globals.Cryptor.Decrypt(location.Address1);
                    var _address2 = Globals.Cryptor.Decrypt(location.Address2);
                    var _city = Globals.Cryptor.Decrypt(location.City);
                    var _state = Globals.Cryptor.Decrypt(location.State);
                    var _zipCode = Globals.Cryptor.Decrypt(location.ZipCode);
                    var _country = Globals.Cryptor.Decrypt(location.Country);

                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);

                    if (_user.Location == null)
                    {
                        _context.Locations.Add(new UserLocation
                        {
                            FirstName = _firstName,
                            LastName = _lastName,
                            AddressLine1 = _address1,
                            AddressLine2 = _address2,
                            City = _city,
                            State = _state,
                            ZipCode = int.Parse(_zipCode),
                            Country = _country,
                            User = _user,
                        });
                    }
                    else
                    {
                        var _location = _user.Location;
                        _location.FirstName = _firstName;
                        _location.LastName = _lastName;
                        _location.City = _city;
                        _location.State = _state;
                        _location.ZipCode = int.Parse(_zipCode);
                        _location.Country = _country;
                    }
                    _user.Token = _newToken;
                    _user.ExpireDate = DateTime.UtcNow.AddHours(1);
                    await _context.SaveChangesAsync();

                    if (_user.Profile == null)
                        return Ok(new { state = "profile", token = _cryptedNewToken });
                    var _title = Globals.Cryptor.Encrypt(_user.Profile.Title);
                    var _fileData = await System.IO.File.ReadAllTextAsync("Avatars\\" + _user.Profile.AvatarPath);
                    var _avatar = Globals.Cryptor.Encrypt(_fileData);
                    if (_user.Permition == Permition.Pending)
                        return Ok(new { state = "pending", title = _title, avatar = _avatar, token = _cryptedNewToken });
                    if (_user.Permition == Permition.Suspended)
                        return Ok(new { state = "suspended", title = _title, avatar = _avatar, token = _cryptedNewToken });
                    return Ok(new { state = "success", title = _title, avatar = _avatar, token = _cryptedNewToken });
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

        [HttpPost("GetUsers", Name = "Post /User/GetUsers")]
        public async Task<IActionResult> GetUsers(PageData page)
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
                    var _userList = await GetPermittedUsersAsync(_query);
                    for (int idx = _page * 12; idx < _userList.Count; idx++)
                    {
                        _ids += _userList[idx].Id.ToString() + " ";
                    }
                    if (!string.IsNullOrEmpty(_ids))
                        _ids = _ids.Substring(0, _ids.Length - 1);

                    var _userIds = Globals.Cryptor.Encrypt(_ids);
                    var _maxPage = Globals.Cryptor.Encrypt(((_userList.Count - 1) / 12 + 1).ToString());
                    return Ok(new { userIds = _userIds, maxPage = _maxPage });
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

        [HttpPost("GetUser", Name = "Post /User/GetUser")]
        public async Task<IActionResult> GetUser(UserData user)
        {
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Token))
            {
                return BadRequest(new { message = "Invalid token information" });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(user.Email);
                var _token = Globals.Cryptor.Decrypt(user.Token);

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

                    var _idStr = Globals.Cryptor.Decrypt(user.Id);
                    var _id = int.Parse(_idStr);

                    var _u = await GetUserByIdAsync(_id);
                    if (_u == null)
                        return BadRequest(new { message = "Can't find user with this id." });

                    var _userType = Globals.Cryptor.Encrypt(((int)_u.UserType).ToString());

                    var _firstName = Globals.Cryptor.Encrypt(_u.Location.FirstName);
                    var _lastName = Globals.Cryptor.Encrypt(_u.Location.LastName);
                    var _state = Globals.Cryptor.Encrypt(_u.Location.State);
                    var _region = Globals.Cryptor.Encrypt(_u.Location.Country);

                    var _title = Globals.Cryptor.Encrypt(_u.Profile.Title);
                    var _description = Globals.Cryptor.Encrypt(_u.Profile.Description ?? "");
                    var _githubUrl = Globals.Cryptor.Encrypt(_u.Profile.GithubUrl ?? "");
                    var _phoneNumber = Globals.Cryptor.Encrypt(_u.Profile.PhoneNumber ?? "");
                    var _avatarData = await System.IO.File.ReadAllTextAsync("Avatars\\" + _u.Profile.AvatarPath);
                    var _avatar = Globals.Cryptor.Encrypt(_avatarData);

                    return Ok(new { userType = _userType, firstName = _firstName, lastName = _lastName,
                        state = _state, region = _region, title = _title, description = _description, 
                        githubUrl = _githubUrl, phoneNumber = _phoneNumber, avatar = _avatar });
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

        [HttpPost("GetUserType", Name = "Post /User/GetUserType")]
        public async Task<IActionResult> GetUserType(GeneralTokenData token)
        {
            if (token == null || string.IsNullOrEmpty(token.Email) || string.IsNullOrEmpty(token.Token))
            {
                return BadRequest(new { message = "Invalid token information" });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(token.Email);
                var _token = Globals.Cryptor.Decrypt(token.Token);

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
                    if (_user.UserType == UserType.Administrator)
                        return Ok(new { userType = Globals.Cryptor.Encrypt("administrator") });
                    if (_user.UserType == UserType.Client)
                        return Ok(new { userType = Globals.Cryptor.Encrypt("client") });
                    return Ok(new { userType = Globals.Cryptor.Encrypt("team") });
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

        [HttpPost("SaveProfile", Name = "Post /User/SaveProfile")]
        public async Task<IActionResult> SaveProfile(ProfileData profile)
        {
            if (profile == null || string.IsNullOrEmpty(profile.Email) || string.IsNullOrEmpty(profile.Token))
            {
                return BadRequest(new { message = "Invalid token infomation." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(profile.Email);
                var _token = Globals.Cryptor.Decrypt(profile.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Token == _token)
                {
                    var _avatar = Globals.Cryptor.Decrypt(profile.Avatar);
                    var _title = Globals.Cryptor.Decrypt(profile.Title);
                    var _description = Globals.Cryptor.Decrypt(profile.Description);

                    var _filePath = TokenHelper.ApiToken(_email);
                    if (!Directory.Exists("Avatars"))
                        Directory.CreateDirectory("Avatars");
                    await System.IO.File.WriteAllTextAsync("Avatars\\" + _filePath, _avatar);

                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);

                    if (_user.Profile == null)
                    {
                        _context.Profiles.Add(new UserProfile
                        {
                            AvatarPath = _filePath,
                            Title = _title,
                            Description = _description,
                            User = _user,
                        });
                    }
                    else
                    {
                        var _profile = _user.Profile;

                        if (System.IO.File.Exists("Avatars\\" + _profile.AvatarPath))
                            System.IO.File.Delete("Avatars\\" + _profile.AvatarPath);

                        _profile.AvatarPath = _filePath;
                        _profile.Title = _title;
                        _profile.Description = _description;
                    }
                    _user.Token = _newToken;
                    _user.ExpireDate = DateTime.UtcNow.AddHours(1);
                    await _context.SaveChangesAsync();

                    if (_user.Permition == Permition.Pending)
                        return Ok(new { state = "pending", token = _cryptedNewToken });
                    if (_user.Permition == Permition.Suspended)
                        return Ok(new { state = "suspended", token = _cryptedNewToken });
                    return Ok(new { state = "success", token = _cryptedNewToken });
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

        private async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.Location)
                .Where(u => u.Profile != null && u.Location != null && u.Permition == Permition.Approved)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        private async Task<List<User>> GetPermittedUsersAsync(string? query)
        {
            var users = await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.Location)
                .Include(u => u.Categories)
                .Where(u => u.Permition == Permition.Approved)
                .ToListAsync();

            return users.Where(u => ValidateUser(u, query)).ToList();
        }

        private bool ValidateUser(User u, string? query)
        {
            if (u.Profile == null || u.Location == null)
            {
                return false;
            }

            var stringBuilder = new StringBuilder();

            stringBuilder.Append(u.Location.FirstName + " " + u.Location.LastName)
                         .Append(u.Profile.Title);

            if (u.UserType == UserType.Administrator)
            {
                stringBuilder.Append("Administrator");
            }
            else if (u.UserType == UserType.TeamMember)
            {
                stringBuilder.Append("MONATE");
            }

            if (u.Categories != null) foreach (var category in u.Categories)
            {
                stringBuilder.Append(category.Name);
            }

            return string.IsNullOrEmpty(query) || stringBuilder.ToString().IndexOf(query, StringComparison.OrdinalIgnoreCase) != -1;
        }
    }
}
