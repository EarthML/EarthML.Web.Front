using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SInnovations.MarkDown.BlogEngine.Core
{
    public interface IMarkdownBlogEngineBuilder
    {
        string ArticleFolder { get;}

        IMarkdownBlogEngineBuilder AddArticles(string folder);
    }

    public class MarkdownblogEngineBuilder : IMarkdownBlogEngineBuilder
    {
        public string ArticleFolder { get; set; }

        public IMarkdownBlogEngineBuilder AddArticles(string folder)
        {
            ArticleFolder = folder;
            return this;
        }
       
    }

    
}
