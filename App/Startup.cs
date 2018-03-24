using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

public class Startup : Datasilk.Startup {

    public override void Configured(IApplicationBuilder app, IHostingEnvironment env, IConfigurationRoot config)
    {
        base.Configured(app, env, config);

        //load extra config info
        server.SaveToCache("headless-chrome", config.GetSection("Cli:Headless-Chrome").Value);
        server.SaveToCache("nodejs", config.GetSection("Cli:Node-Js").Value);
    }
}
