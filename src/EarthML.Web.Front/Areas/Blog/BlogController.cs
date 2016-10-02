using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using EarthML.Web.Front.Areas.Blog;
using Markdig;
using Microsoft.AspNetCore.Mvc;

namespace EarthML.Web.Front.Areas.Blog
{

    public class GitCommit
    {
        public GitCommit()
        {
            Headers = new Dictionary<string, string>();
            Files = new List<GitFileStatus>();
            Message = "";
        }

        public Dictionary<string, string> Headers { get; set; }
        public string Sha { get; set; }
        public string Message { get; set; }
        public List<GitFileStatus> Files { get; set; }
    }
    public class GitFileStatus
    {
        public string Status { get; set; }
        public string File { get; set; }
    }

    public static class GitHelper
    {

        private static bool StartsWithHeader(string line)
        {
            if (line.Length > 0 && char.IsLetter(line[0]))
            {
                var seq = line.SkipWhile(ch => Char.IsLetter(ch) && ch != ':');
                return seq.FirstOrDefault() == ':';
            }
            return false;
        }

        public static IEnumerable<GitCommit> ParseGit(Stream data)
        {
            GitCommit commit = null;

            bool processingMessage = false;
            using (var strReader = new StreamReader(data))
            {
                do
                {
                    var line = strReader.ReadLine();

                    if (line.StartsWith("commit "))
                    {
                        if (commit != null)
                            yield return commit;

                        commit = new GitCommit();
                        commit.Sha = line.Split(' ')[1];
                    }

                    if (StartsWithHeader(line))
                    {
                        var header = line.Split(':')[0];
                        var val = string.Join(":", line.Split(':').Skip(1)).Trim();

                        // headers
                        commit.Headers.Add(header, val);
                    }

                    if (string.IsNullOrEmpty(line))
                    {
                        // commit message divider
                        processingMessage = !processingMessage;
                    }else if (processingMessage) { 
                        // commit message.
                        commit.Message += line.Trim(' ');
                    }

                    if (line.Length > 1 && Char.IsLetter(line[0]) && line[1] == '\t')
                    {
                        var status = line.Split('\t')[0];
                        var file = line.Split('\t')[1];
                        commit.Files.Add(new GitFileStatus() { Status = status, File = file });
                    }
                }
                while (strReader.Peek() != -1);
            }
            if (commit != null)
                yield return commit;

        }
    }


    public static class ObjectExtensions
    {
        public static T ToObject<T>(this IDictionary<string, object> source)
            where T : class, new()
        {
            T someObject = new T();
            Type someObjectType = someObject.GetType();

            foreach (KeyValuePair<string, object> item in source)
            {
                someObjectType.GetProperty(item.Key, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance)?.SetValue(someObject, item.Value, null);
            }

            return someObject;
        }

        public static IDictionary<string, object> AsDictionary(this object source, BindingFlags bindingAttr = BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance)
        {
            return source.GetType().GetProperties(bindingAttr).ToDictionary
            (
                propInfo => propInfo.Name,
                propInfo => propInfo.GetValue(source, null)
            );

        }
    }
    public class ArticleMetadata
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public string Layout { get; set; }
        public string Date { get; set; }
    }
    public class ArticleModel
    {
        public string MarkdownHtml { get; set; }
        public ArticleMetadata Metadata { get; set; }

        public List<GitCommit> History { get; set; }
    }
    public class BlogController : Controller
    {
        [Route("[controller]")]
        public IActionResult Index()
        {

            return View();
        }


        [Route("[controller]/{*article}")]
        public IActionResult ReadArticle(string article)
        {
            //TODO, make a service registration of a BlogManager that loads all metadata and do url reverse lookup
            //---
            //layout: ReadArticle
            //title: Introducing EarthML
            //subtitle: The EarthML vision
            //description: Learn about the EarthML vision
            //date: 2016-10-02 2:48 AM
            //alias: /2016/10/02/introducing-earthml/
            //author:
            //    name: Poul K. Sørensen
            //    mail: poul@earthml.com
            //    url: https://twitter.com/pksorensen
            //    avatar: https://s.gravatar.com/avatar/9003d0ada00ae43a199d7a5fa1be7714?s=80
            //design:
            //    bg_color: "#0D3483"
            //    image: https://cdn.auth0.com/blog/authenticate-linkedin-aspnetcore/logo.png
            //tags:
            //- EarthML
            //---
            var filePath = "Areas/Blog/Articles/Introduction.md";

            var md = System.IO.File.ReadAllText(filePath);
            var first = md.IndexOf("---") + 3;
            var second = md.IndexOf("---", first);
            var meta = md.Substring(first, second - first).Trim('\n').Split('\n').Select(kv => kv.Split(':')).ToDictionary(k => k.First().Trim(), v => (object)string.Join(":", v.Skip(1)).Trim());
            md = md.Substring(second + 3).Trim('\n');
            var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
            var result = Markdown.ToHtml(md, pipeline);

            var historyFile = (Path.ChangeExtension(filePath, ".history"));
            var history = Enumerable.Empty<GitCommit>();
            if (System.IO.File.Exists(historyFile))
            {
                using (var stream = System.IO.File.OpenRead(historyFile))
                {
                    history = GitHelper.ParseGit(stream).ToList();
                }
            }

            var model = new ArticleModel
            {
                MarkdownHtml = result,
                Metadata = meta.ToObject<ArticleMetadata>(),
                History = history.ToList()
            };

            return View(viewName: $"{model.Metadata.Layout}", model: model);
        }

        public IActionResult Error()
        {
            return View();
        }
    }


}