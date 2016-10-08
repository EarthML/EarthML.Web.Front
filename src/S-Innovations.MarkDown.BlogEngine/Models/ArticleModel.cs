using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SInnovations.MarkDown.BlogEngine.Models
{
   
    public class ArticleTodoes
    {
        public bool Checked { get; set; }
        public string Label { get; set; }

    }
    public class ArticleModel
    {
        public string MarkdownHtml { get; set; }
        public ArticleMetadata Metadata { get; set; }

        public List<GitCommit> History { get; set; }
        public TableOfContentEntry[] TableOfContent { get; set; }
        public ArticleTodoes[] Todos { get; set; }
    }
}
