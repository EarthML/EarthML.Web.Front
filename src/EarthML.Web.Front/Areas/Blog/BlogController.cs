using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace EarthML.Web.Front.Areas.Blog
{

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
        public string Markdown { get; set; }
        public ArticleMetadata Metadata { get; set; }

        public string History { get; set; }
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
            var first = md.IndexOf("---") +3;
            var second = md.IndexOf("---", first);
            var meta = md.Substring(first, second - first).Trim('\n').Split('\n').Select(kv=>kv.Split(':')).ToDictionary(k=>k.First().Trim(),v=>(object)string.Join(":", v.Skip(1)).Trim());
            md = md.Substring(second+3).Trim('\n');


            var model = new ArticleModel {
                Markdown = md,
                Metadata = meta.ToObject<ArticleMetadata>(),
                History = System.IO.File.Exists(Path.ChangeExtension(filePath,".history")) ?
                    System.IO.File.ReadAllText(Path.ChangeExtension(filePath, ".history")) :
                    string.Empty
            };

            return View(viewName:$"{model.Metadata.Layout}", model:model);
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
