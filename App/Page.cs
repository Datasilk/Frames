namespace Frames
{

    public class Page : Datasilk.Page
    {
        public bool usePlatform = false;
        public string theme = "default";

        public Page(global::Core DatasilkCore) : base(DatasilkCore)
        {
            title = "Frames";
            description = "Browse through a gallery of web pages";
        }


        public override string Render(string[] path, string body = "", object metadata = null)
        {
            if (scripts.IndexOf("S.svg.load") < 0)
            {
                scripts += "<script language=\"javascript\">S.svg.load('/images/icons.svg');</script>";
            }
            return base.Render(path, body, metadata);
        }

        public void LoadHeader(ref Scaffold scaffold)
        {
            if (S.User.userId > 0)
            {
                var child = scaffold.Child("header");
                child.Data["user"] = "1";
                child.Data["username"] = S.User.name;
            }
            else
            {
                scaffold.Child("header").Data["no-user"] = "1";
            }
        }
    }
}