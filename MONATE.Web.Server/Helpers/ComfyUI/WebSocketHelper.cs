namespace MONATE.Web.Server.Helpers.ComfyUI
{
    using MONATE.Web.Server.Logics;
    using Newtonsoft.Json.Linq;
    using System.Net.WebSockets;
    using System.Text;

    public class WebSocketHelper
    {
        public static async Task HandleWebSocketAsync(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result;

            try
            {
                while (webSocket.State == WebSocketState.Open)
                {
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        string responseMessage = "None";
                        lock (Globals.globalLock)
                        {
                            if (Globals.RunningWorkflowStatus.ContainsKey(message))
                            {
                                responseMessage = Globals.RunningWorkflowStatus[message].ToString();
                            }
                        }
                        var responseBuffer = Encoding.UTF8.GetBytes(responseMessage);
                        await webSocket.SendAsync(new ArraySegment<byte>(responseBuffer), WebSocketMessageType.Text, true, CancellationToken.None);
                        Thread.Sleep(500);
                    }
                    else if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing connection", CancellationToken.None);
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }

        public static void TrackProgress(WebSocketSharp.WebSocket ws, JObject prompt, string promptId, string clientId)
        {
            var nodeIds = new List<string>(prompt.Properties().Select(p => p.Name));
            var finishedNodes = new HashSet<string>();

            ws.OnMessage += (sender, e) =>
            {
                try
                {
                    var message = e.Data;
                    if (!string.IsNullOrEmpty(message))
                    {
                        var jsonMessage = JObject.Parse(message);

                        if (jsonMessage.ContainsKey("type"))
                        {
                            var messageType = jsonMessage["type"].ToString();
                            if (messageType == "progress")
                            {
                                var data = jsonMessage["data"].ToObject<JObject>();
                                var currentStep = data["value"].Value<int>();
                                var maxStep = data["max"].Value<int>();
                            }
                            else if (messageType == "execution_cached")
                            {
                                var data = jsonMessage["data"].ToObject<JObject>();
                                var nodes = data["nodes"].ToObject<List<string>>();

                                foreach (var itm in nodes)
                                {
                                    if (!finishedNodes.Contains(itm))
                                    {
                                        finishedNodes.Add(itm);
                                    }
                                }
                            }
                            else if (messageType == "executing")
                            {
                                var data = jsonMessage["data"].ToObject<JObject>();
                                var node = data["node"].ToString();

                                if (!finishedNodes.Contains(node))
                                {
                                    finishedNodes.Add(node);
                                }

                                if (string.IsNullOrEmpty(node?.ToString()) && data["prompt_id"].ToString() == promptId)
                                {
                                    ws.Close();
                                    lock (Globals.globalLock)
                                    {
                                        if (Globals.RunningWorkflowStatus.ContainsKey(clientId))
                                            Globals.RunningWorkflowStatus[clientId] = WorkingStatus.Downloading;
                                    }
                                }
                            }
                            else if (messageType == "status")
                            {
                                var data = jsonMessage["data"].ToObject<JObject>();
                                var status = data["status"].ToObject<JObject>();
                                var exec_info = status["exec_info"].ToObject<JObject>();
                                var queue_remaining = (int)exec_info["queue_remaining"];

                                var sid = (string)data["sid"];

                                if (queue_remaining == 0 && sid == clientId)
                                {
                                    ws.Close();
                                    lock (Globals.globalLock)
                                    {
                                        if (Globals.RunningWorkflowStatus.ContainsKey(clientId))
                                            Globals.RunningWorkflowStatus[clientId] = WorkingStatus.Downloading;
                                    }
                                }
                            }
                        }
                    }
                }
                catch (Exception error)
                {
                    ws.Close();
                    lock (Globals.globalLock)
                    {
                        if (Globals.RunningWorkflowStatus.ContainsKey(clientId))
                            Globals.RunningWorkflowStatus[clientId] = WorkingStatus.Error;
                    }
                }
            };

            ws.OnClose += (sender, e) =>
            {
                Console.WriteLine("WebSocket connection closed.");
            };

            ws.OnError += (sender, e) =>
            {
                Console.WriteLine($"WebSocket error: {e.Message}");
            };

            ws.Connect();
        }
    }
}