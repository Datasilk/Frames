namespace Frames.Pages
{
    public class Frames : Page
    {
        public Frames(Core DatasilkCore) : base(DatasilkCore)
        {
        }

        public override string Render(string[] path, string body = "", object metadata = null)
        {
            var scaffold = new Scaffold("/Pages/Frames/frames.html", S.Server.Scaffold);
            return base.Render(path, scaffold.Render(), metadata);
        }
    }
}
