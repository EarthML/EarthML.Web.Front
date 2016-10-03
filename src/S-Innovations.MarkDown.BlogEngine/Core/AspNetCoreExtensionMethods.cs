using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using SInnovations.MarkDown.BlogEngine.Core;
using SInnovations.MarkDown.BlogEngine.Services;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class MarkdownBlogEngineServiceCollectionExtensions
    {
        public static IMarkdownBlogEngineBuilder AddMarkdownBlogEngine(this IServiceCollection services)
        {
            var options = new MarkdownblogEngineBuilder();
            services.AddSingleton<IMarkdownBlogEngineBuilder>(options);
            services.AddSingleton<IBlogEngine, MarkDownBlogEngine>();

            return options;
        }
    }
}
