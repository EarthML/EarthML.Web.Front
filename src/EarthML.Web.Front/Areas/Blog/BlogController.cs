﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using EarthML.Web.Front.Areas.Blog;
using Markdig;
using Markdig.Renderers;
using Markdig.Renderers.Html;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using Microsoft.AspNetCore.Mvc;
using SInnovations.MarkDown.BlogEngine.Services;

namespace EarthML.Web.Front.Areas.Blog
{












    public class BlogController : Controller
    {
        [Route("[controller]")]
        public IActionResult Index()
        {

            return View();
        }


        [Route("[controller]/{*article}")]
        public async Task<IActionResult> ReadArticle(string article, [FromServices] IBlogEngine blogs)
        {

            var model = await blogs.GetArticleAsync(article.Trim('/'));

            return View(viewName: $"{model.Metadata.Layout}", model: model);

        }

        public IActionResult Error()
        {
            return View();
        }
    }


}