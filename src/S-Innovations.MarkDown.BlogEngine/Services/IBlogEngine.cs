using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SInnovations.MarkDown.BlogEngine.Models;

namespace SInnovations.MarkDown.BlogEngine.Services
{
    public interface IBlogEngine
    {
        Task<ArticleModel> GetArticleAsync(string key);
        Task<List<ArticleModel>> GetArticlesAsync();
    }
}
