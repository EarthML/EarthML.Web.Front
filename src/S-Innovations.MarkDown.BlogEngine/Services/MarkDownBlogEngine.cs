using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Markdig;
using Markdig.Renderers;
using Markdig.Renderers.Html;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using SInnovations.MarkDown.BlogEngine.Core;
using SInnovations.MarkDown.BlogEngine.Git;
using SInnovations.MarkDown.BlogEngine.Internal;
using SInnovations.MarkDown.BlogEngine.Models;

namespace SInnovations.MarkDown.BlogEngine.Services
{

    public static class SimpleYaml
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

        private static bool StartsWithList(string line)
        {
            return line.Length > 0 && line[0] == '-';
        }

        public static Dictionary<string, object> ReadYamlHeader(Stream data)
        {
            var stack = new Stack<Dictionary<string, object>>();
            var obj = new Dictionary<string, object>();
            var indent = "";
            var lastheader = "";

            using (var strReader = new StreamReader(data))
            {
                do
                {
                    var line = strReader.ReadLine();

                    if (line.Equals("---"))
                    {


                        if (stack.Count == 0)
                            stack.Push(obj);
                        else
                        {



                            while (stack.Count > 0)
                                obj = stack.Pop();


                            return obj;
                        }
                    }
                    else
                    {


                        var seq = new string(line.TakeWhile(ch => !Char.IsLetter(ch)).ToArray());

                        if (!seq.Equals(indent))
                        {
                            if (seq.Length > indent.Length)
                            {
                                obj = new Dictionary<string, object>();
                                stack.Peek()[lastheader] = obj;
                                stack.Push(obj);
                            }
                            else
                            {
                                obj = stack.Pop();
                            }

                            indent = seq;
                        }


                        line = line.Trim('\t', ' ');

                        if (StartsWithHeader(line))
                        {
                            lastheader = line.Split(':')[0];
                            var val = string.Join(":", line.Split(':').Skip(1)).Trim();
                            if (!string.IsNullOrEmpty(val))
                            {
                                obj.Add(lastheader, val);
                            }
                        }

                        if (StartsWithList(line))
                        {
                            obj.Add(obj.Count.ToString(), line.Trim('-', ' '));
                        }

                    }


                } while (strReader.Peek() != -1);





            }

            return obj;
        }
    }
    public class MarkDownBlogEngine : IBlogEngine
    {
        protected readonly IMarkdownBlogEngineBuilder options;
        protected Dictionary<string, ArticleModel> articles = new Dictionary<string, ArticleModel>();

        public MarkDownBlogEngine(IMarkdownBlogEngineBuilder options)
        {
            this.options = options;

            foreach (var file in Directory.GetFiles(options.ArticleFolder, "*.md", SearchOption.AllDirectories))
            {

                using (var filemd = File.OpenRead(file))
                {
                    var meta = SimpleYaml.ReadYamlHeader(filemd);


                    var md = File.ReadAllText(file);
                    var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
                    var markdownDocument = Markdown.Parse(md.Substring(md.IndexOf("---", md.IndexOf("---") + 3) + 3).Trim('\n'), pipeline);

                    using (var txtWriter = new StringWriter())
                    {
                        var renderer = new HtmlRenderer(txtWriter);

                        if (markdownDocument.First() is HeadingBlock)
                        {
                            var header = markdownDocument.First() as HeadingBlock;
                            if (header.Level == 1)
                            {
                                markdownDocument.Remove(header);
                            }

                        }

                        pipeline.Setup(renderer);
                        renderer.Render(markdownDocument);


                        var mdParsed = markdownDocument.OfType<Markdig.Syntax.HeadingBlock>()
                            .Select(h => new { literal = h.Inline.FirstChild as LiteralInline, attributes = h.GetAttributes() })
                            .Select(k => new TableOfContentEntry { Title = k.literal.Content.Text.Substring(k.literal.Content.Start, k.literal.Content.Length), Id = k.attributes.Id })
                            .ToArray();


                        var historyFile = (Path.ChangeExtension(file, ".history"));
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
                            MarkdownHtml = txtWriter.ToString(),
                            Metadata = meta.ToObject<ArticleMetadata>(),
                            History = history.ToList(),
                            TableOfContent = mdParsed
                        };

                        articles.Add(model.Metadata.Alias.Trim('/'), model);

                    }

                }
            }
        }

        public Task<ArticleModel> GetArticleAsync(string key)
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




            return Task.FromResult(articles[key]);

        }
    }
}
