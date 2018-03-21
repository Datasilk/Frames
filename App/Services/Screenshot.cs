using System.IO;
using System.Text.RegularExpressions;
using System.Diagnostics;

namespace Frames.Services
{
    public class Screenshot: Datasilk.Service
    {
        public Screenshot(Core DatasilkCore) : base(DatasilkCore)
        {
        }

        private bool _raisedError = false;
        private string _errmsg = "";
        private string _output = "";

        public string FullPage(string url)
        {
            _raisedError = false;
            _errmsg = "";
            _output = "";
            var dir = S.Server.MapPath("Content/screenshots");
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            if (url.Contains("://"))
            {
                var filename = url.Split("://", 2)[1].Replace(".", "").Replace("/", "_") + ".jpg";

                var process = new Process()
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "node",
                        Arguments = S.Server.MapPath("chrome.js") + " --url=\"" + url + "\" --full --format=\"jpg\" --filename=\"" + filename + "\"",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        WorkingDirectory = dir
                    }
                };

                process.OutputDataReceived += OutputDataHandler;
                process.ErrorDataReceived += FullPageErrorDataHandler;
                process.Start();
                process.BeginOutputReadLine();
                process.BeginErrorReadLine();
                //string result = process.StandardOutput.ReadToEnd();
                process.WaitForExit();

                if(_raisedError == true)
                {
                    return Error();
                }
                return _output + "\n\n" + _errmsg;
            }
            return Error();
        }

        private void FullPageErrorDataHandler(object sender, DataReceivedEventArgs args)
        {
            _errmsg += args.Data + "\n";
        }

        private void OutputDataHandler(object sender, DataReceivedEventArgs args)
        {
            _output += args.Data + "\n";
        }
    }
}
