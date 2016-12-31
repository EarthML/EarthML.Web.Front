using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace EarthML.Web.Front.Areas.Home
{
    public class UserInputViewModel
    {
        public int Choice { get; set; }
        public string From { get; set; }
        public string To { get; set; }
    }
    public class CallCenterController : Controller
    {
        [Route("[controller]")]
        [Route("[controller]/Welcome")]
        public IActionResult Welcome(string From =null, string To = null)
        {
            return View();
        }

        public IActionResult HandleUserInput(string digits, string From = null, string To = null)
        {
            int choice;
           return View(new UserInputViewModel{ Choice = int.TryParse(digits, out choice)? choice : -1, From = From, To=To });
           
        }

    }
}
