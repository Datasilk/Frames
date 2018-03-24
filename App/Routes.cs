using Datasilk;

public class Routes : Datasilk.Routes
{
    public Routes(Core DatasilkCore) : base(DatasilkCore) { }

    public override Page FromPageRoutes(string name)
    {
        switch (name)
        {
            case "": case "home": return new Frames.Pages.Frames(S);
        }
        return base.FromPageRoutes(name);
    }

    public override Service FromServiceRoutes(string name)
    {
        switch (name)
        {
            case "Frames.Services.Screenshot": return new Frames.Services.Screenshot(S);
        }
        return base.FromServiceRoutes(name);
    }
}
