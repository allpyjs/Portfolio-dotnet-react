namespace MONATE.Web.Server.Helpers.ComfyUI
{
    using MONATE.Web.Server.Logics;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Net.Http;
    using System.Text;
    using System.Web;

    public class ApiHelper
    {
        public class OutputData
        {
            public string FileName { get; set; }
            public string Type { get; set; }
            public string Format { get; set; }
            public object? Data { get; set; }
        }

        private static readonly HttpClient client = new HttpClient();

        public static async Task<JObject?> QueuePrompt(JObject prompt, string clientId, string serverAddress)
        {
            using (var client = new HttpClient())
            {
                var data = new
                {
                    prompt = prompt,
                    client_id = clientId
                };

                string jsonData = JsonConvert.SerializeObject(data);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync($"http://{serverAddress}/prompt", content);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<JObject>(responseBody);
            }
        }

        public static async Task<string> UploadImage(string image, string name, string serverAddress, string imageType = "input", bool overwrite = false)
        {
            using (var client = new HttpClient())
            {
                using (var form = new MultipartFormDataContent())
                {
                    var fileContent = new ByteArrayContent(Convert.FromBase64String(image.Split(',')[1]));

                    var _contentType = image[(image.IndexOf(':') + 1)..image.IndexOf(';')];
                    fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(_contentType);

                    form.Add(fileContent, "image", name);

                    form.Add(new StringContent(imageType), "type");
                    form.Add(new StringContent(overwrite.ToString().ToLower()), "overwrite");

                    HttpResponseMessage response = await client.PostAsync($"http://{serverAddress}/upload/image", form);

                    response.EnsureSuccessStatusCode();

                    return await response.Content.ReadAsStringAsync();
                }
            }
        }

        public static async Task<string> InterruptPromptAsync(string serverAddress)
        {
            var url = $"http://{serverAddress}/interrupt";
            var response = await client.PostAsync(url, new StringContent(""));
            return await response.Content.ReadAsStringAsync();
        }

        public static async Task<byte[]> GetDataAsync(string filename, string subfolder, string folderType, string serverAddress)
        {
            var data = new Dictionary<string, string>
            {
                { "filename", filename },
                { "subfolder", subfolder },
                { "type", folderType }
            };

            var queryString = HttpUtility.ParseQueryString(string.Empty);
            foreach (var pair in data)
            {
                queryString[pair.Key] = pair.Value;
            }

            var url = $"http://{serverAddress}/view?{queryString.ToString()}";
            var response = await client.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsByteArrayAsync();
            }
            else
            {
                throw new Exception($"Failed to get data: {response.StatusCode}");
            }
        }

        public static async Task<dynamic?> GetHistoryAsync(string promptId, string serverAddress)
        {
            var url = $"http://{serverAddress}/history/{promptId}";
            var response = await client.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(responseContent);
        }

        public static async Task<List<OutputData>> DownloadDatas(string clientId, string serverAddress, bool allowPreview = true)
        {
            var outputDatas = new List<OutputData>();
            string promptId = "";
            lock (Globals.globalLock)
            {
                if (Globals.PromptIds.ContainsKey(clientId))
                    promptId = Globals.PromptIds[clientId];
            }
            if (promptId == null)
                return new List<OutputData>();

            var history = await GetHistoryAsync(promptId, serverAddress);

            if (history.ContainsKey(promptId))
            {
                var nodeOutputs = history[promptId]["outputs"];

                foreach (var nodeId in nodeOutputs)
                {
                    var nodeOutput = nodeId.Value;
                    var outputData = new OutputData();

                    foreach (var outputs in nodeOutput)
                    {
                        if (outputs.Name == "images" || outputs.Name == "gifs")
                        {
                            foreach (var output in outputs.Value)
                            {
                                if (allowPreview && output["type"].ToString() == "temp")
                                {
                                    var pData = await GetDataAsync(output["filename"].ToString(), output["subfolder"].ToString(), output["type"].ToString(), serverAddress);
                                    outputData.Data = pData;
                                }
                                if (output["type"].ToString() == "output")
                                {
                                    var oData = await GetDataAsync(output["filename"].ToString(), output["subfolder"].ToString(), output["type"].ToString(), serverAddress);
                                    outputData.Data = oData;
                                }

                                outputData.FileName = output["filename"].ToString();
                                outputData.Type = output["type"].ToString();
                                outputData.Format = output["format"].ToString();

                                outputDatas.Add(outputData);
                            }
                        }
                    }
                }
            }

            return outputDatas;
        }

        public static async Task<dynamic?> GetNodeInfoByClassAsync(string nodeClass, string serverAddress)
        {
            var url = $"http://{serverAddress}/object_info/{nodeClass}";
            var response = await client.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(responseContent);
        }

        public static async Task<string> ClearComfyCacheAsync(string serverAddress, bool unloadModels = false, bool freeMemory = false)
        {
            var clearData = new
            {
                unload_models = unloadModels,
                free_memory = freeMemory
            };

            var json = JsonConvert.SerializeObject(clearData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"http://{serverAddress}/free";
            var response = await client.PostAsync(url, content);
            return await response.Content.ReadAsStringAsync();
        }
    }
}