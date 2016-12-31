using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace EarthML.Web.Front.Areas.Products
{

    public class ProductsController : Controller
    {
        public IActionResult Index()
        {
           
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
