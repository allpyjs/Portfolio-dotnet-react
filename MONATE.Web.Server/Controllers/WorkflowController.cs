namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data.Models;
    using MONATE.Web.Server.Data.Packets.WorkflowInfo;
    using MONATE.Web.Server.Helpers;
    using MONATE.Web.Server.Helpers.ComfyUI;
    using MONATE.Web.Server.Logics;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Org.BouncyCastle.Bcpg.Attr;
    using System.IO;
    using System.Threading;
    using WebSocketSharp;

    [ApiController]
    [Route("[controller]")]
    public class WorkflowController : ControllerBase
    {
        private readonly MonateDbContext _context;

        public WorkflowController(MonateDbContext context)
        {
            _context = context;
        }

        [HttpPost("QueuePrompt", Name = "Post /Workflow/QueuePrompt")]
        public async Task<IActionResult> QueuePrompt([FromBody] PromptData prompt)
        {
            if (string.IsNullOrEmpty(prompt.Email) || string.IsNullOrEmpty(prompt.Token))
            {
                return BadRequest(new { message = "Your prompt data is not correct." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(prompt.Email);
                var _token = Globals.Cryptor.Decrypt(prompt.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Permition != Permition.Approved)
                {
                    return BadRequest(new { message = "This method is not allowed with your account." });
                }

                if (_user.Token == _token)
                {
                    var _workflowData = Globals.Cryptor.Decrypt(prompt.WorkflowData);
                    var _workflowObject = JObject.Parse(_workflowData);

                    var _serverUrl = Globals.Cryptor.Decrypt(prompt.ServerUrl);
                    var _clientId = Globals.Cryptor.Decrypt(prompt.ClientId);

                    foreach (WorkflowInputData inputValue in prompt.InputValues)
                    {
                        SetValue(_workflowObject, (string)inputValue.Path, inputValue.Type, inputValue.Value);
                    }

                    lock (Globals.globalLock)
                    {
                        Globals.RunningWorkflowStatus[_clientId] = WorkingStatus.None;
                    }

                    Thread thread = new Thread(new ThreadStart(async () =>
                    {
                        var ws = new WebSocket("ws://" + _serverUrl + "/ws?clientId=" + _clientId);
                        try
                        {
                            lock (Globals.globalLock)
                            {
                                if (Globals.RunningWorkflowStatus.ContainsKey(_clientId))
                                    Globals.RunningWorkflowStatus[_clientId] = WorkingStatus.Uploading;
                            }
                            foreach (WorkflowInputData inputValue in prompt.InputValues)
                            {
                                if (inputValue.Type == "IMAGE")
                                    await ApiHelper.UploadImage(inputValue.Image, (string)inputValue.Value, _serverUrl);
                                if (inputValue.Type == "VIDEO")
                                    await ApiHelper.UploadImage(inputValue.Video, (string)inputValue.Value, _serverUrl);
                            }
                            var promtIdData = await ApiHelper.QueuePrompt(_workflowObject, _clientId, _serverUrl);
                            lock (Globals.globalLock)
                            {
                                if (Globals.RunningWorkflowStatus.ContainsKey(_clientId))
                                    Globals.RunningWorkflowStatus[_clientId] = WorkingStatus.Prompting;
                            }
                            string promptId = (string)promtIdData["prompt_id"];
                            lock (Globals.globalLock)
                            {
                                if (Globals.RunningWorkflowStatus.ContainsKey(_clientId))
                                    Globals.RunningWorkflowStatus[_clientId] = WorkingStatus.Working;
                                Globals.PromptIds[_clientId] = promptId;
                            }
                            WebSocketHelper.TrackProgress(ws, _workflowObject, promptId, _clientId);
                        }
                        catch (Exception error)
                        {
                            Console.WriteLine(error.Message);
                            ws.Close();
                            if (Globals.RunningWorkflowStatus.ContainsKey(_clientId))
                                Globals.RunningWorkflowStatus[_clientId] = WorkingStatus.Error;
                        }
                    }));
                    thread.Start();

                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);
                    _user.Token = _newToken;
                    _user.ExpireDate = DateTime.UtcNow.AddHours(1);
                    await _context.SaveChangesAsync();

                    return Ok(new { Token = _cryptedNewToken });
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

        [HttpPost("DownloadDatas", Name = "Post /Workflow/DownloadDatas")]
        public async Task<IActionResult> DownloadDatas([FromBody] ClientIdData clientId)
        {
            if (string.IsNullOrEmpty(clientId.Email) || string.IsNullOrEmpty(clientId.Token))
            {
                return BadRequest(new { message = "Your workflow data is not correct." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(clientId.Email);
                var _token = Globals.Cryptor.Decrypt(clientId.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Permition != Permition.Approved)
                {
                    return BadRequest(new { message = "This method is not allowed with your account." });
                }

                if (_user.Token == _token)
                {
                    var _outputImages = new List<string>();
                    var _clientId = Globals.Cryptor.Decrypt(clientId.ClientId);
                    var _serverAddress = Globals.Cryptor.Decrypt(clientId.ServerAddress);
                    var _datas = await ApiHelper.DownloadDatas(_clientId, _serverAddress);

                    lock (Globals.globalLock)
                    {
                        if (Globals.RunningWorkflowStatus.ContainsKey(_clientId))
                            Globals.RunningWorkflowStatus.Remove(_clientId);
                        if (Globals.PromptIds.ContainsKey(_clientId))
                            Globals.PromptIds.Remove(_clientId);
                    }

                    return Ok(new { Datas = _datas });
                }
                else
                {
                    return BadRequest(new { message = "Your token is not registered." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("GetWorkflow", Name = "Post /Workflow/GetWorkflow")]
        public async Task<IActionResult> GetWorkflow([FromBody] WorkflowIdData workflowId)
        {
            if (string.IsNullOrEmpty(workflowId.Email) || string.IsNullOrEmpty(workflowId.Token))
            {
                return BadRequest(new { message = "Your workflow data is not correct." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(workflowId.Email);
                var _token = Globals.Cryptor.Decrypt(workflowId.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Permition != Permition.Approved)
                {
                    return BadRequest(new { message = "This method is not allowed with your account." });
                }

                if (_user.Token == _token)
                {
                    var _id = int.Parse(Globals.Cryptor.Decrypt(workflowId.Id));
                    var _workflow = await GetWorkflowByIdAsync(_id);
                    var _u = await GetUserByEndpointId(_workflow.Endpoint.Id);

                    if (_u.Email != _email && (_workflow.Permition != Permition.Approved))
                        return BadRequest(new { message = "You are not owner of this workflow." });

                    var _version = Globals.Cryptor.Encrypt(_workflow.Version);
                    var _price = Globals.Cryptor.Encrypt(_workflow.Price.ToString());
                    var _gpuUsage = Globals.Cryptor.Encrypt(_workflow.GPURequirement.ToString());
                    var _description = Globals.Cryptor.Encrypt((_workflow.Description ?? ""));
                    var _imagePath = _workflow.ImagePath;
                    var _workflowPath = _workflow.WorkflowPath;

                    var _endpointName = Globals.Cryptor.Encrypt(_workflow.Endpoint.Name);
                    var _endpointPath = _workflow.Endpoint.ImagePath;

                    var _image = Globals.Cryptor.Encrypt(System.IO.File.ReadAllText("Workflows\\" + _imagePath));
                    var _workflowData = Globals.Cryptor.Encrypt(System.IO.File.ReadAllText("Workflows\\" + _workflowPath));
                    var _endpointImage = Globals.Cryptor.Encrypt(System.IO.File.ReadAllText("Endpoints\\" + _endpointPath));

                    var _inputValues = new List<object>();
                    var inputValues = _workflow.Inputs.ToList();
                    foreach(var inputValue in inputValues)
                    {
                        var _valueType = await GetValueTypeByIdAsync(inputValue.TypeId);
                        _inputValues.Add(new
                        {
                            Path = inputValue.Path,
                            Name = inputValue.DefaultValue,
                            Type = _valueType.Type.ToString(),
                        });
                    }

                    return Ok(new {
                        Version = _version,
                        Price = _price,
                        GPUUsage = _gpuUsage,
                        Description = _description,
                        EndpointName = _endpointName,
                        Image = _image,
                        WorkflowData = _workflowData,
                        EndpointImage = _endpointImage,
                        InputValues = _inputValues,
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

        [HttpPost("UploadWorkflow", Name = "Post /Workflow/UploadWorkflow")]
        public async Task<IActionResult> UploadWorkflow([FromBody] WorkflowData workflow)
        {
            if (string.IsNullOrEmpty(workflow.Email) || string.IsNullOrEmpty(workflow.Token))
            {
                return BadRequest(new { message = "Your workflow data is not correct." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(workflow.Email);
                var _token = Globals.Cryptor.Decrypt(workflow.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Permition != Permition.Approved)
                {
                    return BadRequest(new { message = "This method is not allowed with your account." });
                }

                if (_user.Token == _token)
                {
                    var _endpointId = int.Parse(Globals.Cryptor.Decrypt(workflow.EndpointId));
                    var _imageData = Globals.Cryptor.Decrypt(workflow.Image);
                    var _workflowData = Globals.Cryptor.Decrypt(workflow.Workflow);
                    var _version = Globals.Cryptor.Decrypt(workflow.Version);
                    var _price = double.Parse(Globals.Cryptor.Decrypt(workflow.Price));
                    var _gpuUsage = double.Parse(Globals.Cryptor.Decrypt(workflow.GPUUsage));
                    var _description = Globals.Cryptor.Decrypt(workflow.Description);
                    var _inputValuePaths = workflow.InputValuePaths;
                    var _inputValueTypeIds = workflow.InputValueTypeIds;
                    var _inputValueNames = workflow.InputValueNames;

                    var _endpoint = await GetEndpointByIdAsync(_endpointId);

                    var _filePath1 = TokenHelper.ApiToken(_email);
                    var _filePath2 = TokenHelper.ApiToken(_email);
                    if (!Directory.Exists("Workflows"))
                        Directory.CreateDirectory("Workflows");
                    await System.IO.File.WriteAllTextAsync("Workflows\\" + _filePath1, _imageData);
                    await System.IO.File.WriteAllTextAsync("Workflows\\" + _filePath2, _workflowData);

                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);

                    var _workflow = new Workflow
                    {
                        Endpoint = _endpoint,
                        Version = _version,
                        Price = _price,
                        Description = _description,
                        GPURequirement = _gpuUsage,
                        ImagePath = _filePath1,
                        WorkflowPath = _filePath2,
                        Permition = Permition.Pending,
                    };

                    await _context.Workflows.AddAsync(_workflow);
                    await _context.SaveChangesAsync();

                    for (int i = 0; i < _inputValueTypeIds.Length; i++)
                    {
                        var inputValue = new InputValue
                        {
                            Type = await GetValueTypeByIdAsync(_inputValueTypeIds[i]),
                            Workflow = _workflow,
                            Path = _inputValuePaths[i],
                            DefaultValue = _inputValueNames[i],
                        };

                        await _context.InputValues.AddAsync(inputValue);
                    }

                    _user.Token = _newToken;
                    _user.ExpireDate = DateTime.UtcNow.AddHours(1);
                    await _context.SaveChangesAsync();

                    return Ok(new { Token = _cryptedNewToken });
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
        static bool SetValue(JObject jsonObject, string path, string type, string value)
        {
            var pathParts = path.Split(". ", StringSplitOptions.RemoveEmptyEntries);

            string id = pathParts[0];

            var currentObject = jsonObject[id] as JObject;

            var valuePaths = pathParts[1].Split("/inputs/");
            string valuePath = valuePaths[1];

            var inputs = currentObject["inputs"] as JObject;

            if (inputs != null && inputs.ContainsKey(valuePath))
            {
                if (type == "INT")
                    inputs[valuePath] = int.Parse(value);
                else if (type == "FLOAT")
                    inputs[valuePath] = float.Parse(value);
                else 
                    inputs[valuePath] = value;
            }
            else
            {
                return false;
            }
            return true;
        }

        private async Task<User?> GetUserByEndpointId(int id)
        {
            var endpoint = await _context.Endpoints
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id);

            return endpoint?.User;
        }

        private async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        private async Task<ValueType?> GetValueTypeByIdAsync(int id)
        {
            return await _context.ValueTypes
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        private async Task<Workflow?> GetWorkflowByIdAsync(int id)
        {
            return await _context.Workflows
                .Include(w => w.Endpoint)
                .Include(w => w.Inputs)
                .Include(w => w.Outputs)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        private async Task<Endpoint?> GetEndpointByIdAsync(int id)
        {
            return await _context.Endpoints
                .FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}