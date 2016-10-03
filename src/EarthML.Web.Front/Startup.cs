using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;

namespace EarthML.Web.Front
{
    public class FeatureViewLocationExpander : IViewLocationExpander
    {
        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context,
            IEnumerable<string> viewLocations)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (viewLocations == null)
            {
                throw new ArgumentNullException(nameof(viewLocations));
            }

            var controllerActionDescriptor = context.ActionContext.ActionDescriptor as ControllerActionDescriptor;
            if (controllerActionDescriptor == null)
            {
                throw new NullReferenceException("ControllerActionDescriptor cannot be null.");
            }

            string featureName = controllerActionDescriptor.Properties["area"] as string;
            foreach (var location in viewLocations)
            {
                yield return location.Replace("{3}", featureName);
            }
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
        }
    }
    public class FeatureConvention : IControllerModelConvention
    {
        public void Apply(ControllerModel controller)
        {
            controller.Properties.Add("area",
                GetFeatureName(controller.ControllerType));
        }
        private string GetFeatureName(TypeInfo controllerType)
        {
            string[] tokens = controllerType.FullName.Split('.');
            if (!tokens.Any(t => t == "Areas")) return "";
            string featureName = tokens
                .SkipWhile(t => !t.Equals("areas",
                StringComparison.CurrentCultureIgnoreCase))
                .Skip(1)
                .Take(1)
                .FirstOrDefault();
            return featureName;
        }
    }
  

    public class Startup
    {

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {


            services.AddMarkdownBlogEngine().AddArticles("Areas/Blog/Articles");

            services.AddMvc(o => o.Conventions.Add(new FeatureConvention()))
              .AddRazorOptions(options =>
              {
                  // {0} - Action Name
                  // {1} - Controller Name
                  // {2} - Area Name
                  // {3} - Feature Name
                  //options.AreaViewLocationFormats.Clear();
                  //options.AreaViewLocationFormats.Add("/Areas/{2}/{1}/{0}.cshtml");
                  //options.AreaViewLocationFormats.Add("/Areas/{2}/{0}.cshtml");
                  //options.AreaViewLocationFormats.Add("/Areas/{2}/Shared/{0}.cshtml");
                  //options.AreaViewLocationFormats.Add("/Areas/Shared/{0}.cshtml");

                  // replace normal view location entirely
                  options.ViewLocationFormats.Clear();
                  options.ViewLocationFormats.Add("/Areas/{1}/{0}.cshtml");
                  options.ViewLocationFormats.Add("/Areas/{0}.cshtml");
                  options.ViewLocationFormats.Add("/Areas/Shared/{0}.cshtml");

                  // add support for features side-by-side with /Views
                  // (do NOT clear ViewLocationFormats)
                  //options.ViewLocationFormats.Insert(0, "/Features/Shared/{0}.cshtml");
                  //options.ViewLocationFormats.Insert(0, "/Features/{3}/{0}.cshtml");
                  //options.ViewLocationFormats.Insert(0, "/Features/{3}/{1}/{0}.cshtml");
                  //
                  // (do NOT clear AreaViewLocationFormats)
                  //options.AreaViewLocationFormats.Insert(0, "/Areas/{2}/Features/Shared/{0}.cshtml");
                  //options.AreaViewLocationFormats.Insert(0, "/Areas/{2}/Features/{3}/{0}.cshtml");
                  //options.AreaViewLocationFormats.Insert(0, "/Areas/{2}/Features/{3}/{1}/{0}.cshtml");


                  options.ViewLocationExpanders.Add(new FeatureViewLocationExpander());
              });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                ServeUnknownFileTypes = true,
                OnPrepareResponse = context =>
                {
                    context.Context.Response.Headers.Add("Cache-Control", "public, max-age=3600, no-cache");

                }
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
                 
            });
        }
    }
}
