using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

#if NET46
using Microsoft.Practices.Unity;
using Serilog;
using SInnovations.ServiceFabric.RegistrationMiddleware.AspNetCore.Services;
using SInnovations.ServiceFabric.Unity;
#endif

namespace EarthML.Web.Front
{
    public class Program
    {
        public static void Main(string[] args)
        {

            if (args.Contains("--serviceFabric"))
            {
#if NET46

                var log = new LoggerConfiguration()
               .MinimumLevel.Debug()
               //  .WriteTo.Trace()
               .CreateLogger();


                using (var container = new UnityContainer().AsFabricContainer())
                {
                    var loggerfac = new LoggerFactory() as ILoggerFactory;
                    loggerfac.AddSerilog();
                    container.RegisterInstance(loggerfac);
                    container.RegisterInstance(new KestrelHostingServiceOptions { ServiceEndpointName = "ServiceEndpoint", ReverseProxyPath ="/" });

                    container.WithStatelessService<KestrelHostingService<Startup>>("EarthMLFrontType");




                    Thread.Sleep(Timeout.Infinite);
                }
#endif
            }
            else
            {

                var host = new WebHostBuilder()
                    .UseKestrel()
                    .UseContentRoot(Directory.GetCurrentDirectory())
                    .UseIISIntegration()
                    .UseStartup<Startup>()
                    .Build();

                host.Run();
            }
        }
    }
}
