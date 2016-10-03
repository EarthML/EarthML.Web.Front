using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SInnovations.MarkDown.BlogEngine.Models
{
    public class ArticleModel
    {
        public string MarkdownHtml { get; set; }
        public ArticleMetadata Metadata { get; set; }

        public List<GitCommit> History { get; set; }
        public TableOfContentEntry[] TableOfContent { get; set; }

    }
}
