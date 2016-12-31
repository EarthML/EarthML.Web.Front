﻿
using System;
using System.IO;
using System.Linq;
using System.Threading;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

#if NET46
using System.Fabric;
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
               .CreateLogger();

                using (var container = FabricRuntime.Create()
                    .AsFabricContainer()
                    .ConfigureLogging(new LoggerFactory().AddSerilog()))
                {

                    container.WithKestrelHosting<Startup>("EarthMLFrontType",
                        new KestrelHostingServiceOptions
                        {
                            ServiceEndpointName = "ServiceEndpoint",
                            ReverseProxyLocation = "/",
                            GatewayOptions = new GatewayOptions
                            {
                                 ServerName = "www.earthml.com www.earthml.xyz earthml.xyz earthml.com"
                            }
                        });

                    Thread.Sleep(Timeout.Infinite);
                }

#else
                Console.WriteLine("Sorry, service fabric do not support dotnet core yet");
#endif
            } else {

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
