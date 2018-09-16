using System.IO;
using System.Diagnostics;
using System.Threading;
using System.Security.Cryptography;

namespace Frames.Services
{
    public class Screenshot: Service
    {
        public Screenshot(Core DatasilkCore) : base(DatasilkCore)
        {
        }

        private int _raisedError = 0;
        //private string _errmsg = "";
        //private string _output = "";

        public string FullPage(string url)
        {
            _raisedError = 0;
            //_errmsg = "";
            //_output = "";
            var dir = S.Server.MapPath("Content/screenshots/");
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            if (url.Contains("://"))
            {
                var md5 = MD5.Create();

                //create md5 hash from unique URL (after removing protocol from URL)
                var id = url.Split("://", 2)[1].Replace(".", "").Replace("/", "_");
                var hash = S.Util.Str.CreateMD5(id);
                var filepart = hash.Substring(1, 12);
                var ext = ".jpg";
                var filename =  filepart + ext;

                var i = 0;
                while (i++ <= 2) //try generating screenshot 2 times maximum or fail trying
                {
                    var process = new Process()
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = (string)S.Server.Cache["nodejs"], //get nodejs cli command name from config file
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
                    process.WaitForExit();

                    //check if file exists
                    if (File.Exists(dir + filename))
                    {
                        //resize image
                        var images = new Utility.Images(S);
                        var image = images.Load(dir + filename);
                        var outputfolder = S.Server.MapPath("/wwwroot/content/screenshots/");
                        if (!Directory.Exists(outputfolder))
                        {
                            Directory.CreateDirectory(outputfolder);
                        }
                        images.GenerateThumbnails(image, outputfolder);
                        break;
                    }

                    //check for raised errors
                    if (_raisedError > 0)
                    {
                        switch (_raisedError)
                        {
                            case 1:
                                //return Error("Cannot connect to headless Chrome browser server");
                                //try to restart headless Chrome browser server
                                StartHeadlessChromeServer();
                                break;
                        }
                    }
                    if (i == 2) { return Error(); }
                    Thread.Sleep(1000);
                }
                return filename + "|" + id;
            }
            return Error();
        }

        public void StartHeadlessChromeServer()
        {
            var process = new Process()
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = (string)S.Server.Cache["headless-chrome"], //get chrome cli command name from config file
                    Arguments = "--headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    WorkingDirectory = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\"
                }
            };
            process.Start();
        }


        private void FullPageErrorDataHandler(object sender, DataReceivedEventArgs args)
        {
            if(args.Data == null) { return; }
            if(args.Data.Contains("Cannot connect")) { _raisedError = 1; }
            //_errmsg += args.Data + "\n";
        }
        
        private void OutputDataHandler(object sender, DataReceivedEventArgs args)
        {
            //_output += args.Data + "\n";
        }
    }
}
