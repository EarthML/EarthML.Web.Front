﻿
import { scroller, scrollTo, isScrolledIntoView, distanceFromView, scrollToElement, scrollToTop } from "../index";



import Headroom = require("headroom");


 
const header = document.querySelector(".article-open-item") as HTMLElement;
const toc = document.querySelector("#article-toc") as HTMLElement;

window["toc"] = toc;
let offset = 0;
let tocoffset = 0;

function calcOffsets() {
    offset = 0;
    tocoffset = 0;

    let offsetEl = header;
    while (offsetEl && offsetEl !== scroller) {
        console.log([offsetEl, offset, offsetEl.offsetTop]);
        offset += offsetEl.offsetTop;
        offsetEl = offsetEl.offsetParent as HTMLElement;
    }

    offsetEl = toc;
    while (offsetEl && offsetEl !== scroller) {
        console.log([offsetEl, offset, offsetEl.offsetTop]);
        tocoffset += offsetEl.offsetTop;
        offsetEl = offsetEl.offsetParent as HTMLElement;
    }

}
calcOffsets();
 
let tocHeadroom = new Headroom(header,
    {
        scroller: scroller,
        // vertical offset in px before element is first unpinned
        offset: offset,
        // scroll tolerance in px before state changes
        //tolerance: 0,
        // or you can specify tolerance individually for up/down scroll
        tolerance: {
            //up: Infinity,
            //down: 0
        },
        // css classes to apply
        classes: {
            // when element is initialised
            initial: "headroom-toc",
            // when scrolling up
            pinned: "headroom-toc--pinned",
            // when scrolling down
            unpinned: "headroom-toc--unpinned",
            // when above offset
            top: "headroom-toc--top",
            // when below offset
            notTop: "headroom-toc--not-top",
            // when at bottom of scoll area
            //   bottom: "headroom--bottom",
            // when not at bottom of scroll area
            //    notBottom: "headroom--not-bottom"
        },
        // element to listen to scroll events on, defaults to `window`
        // scroller: someElement,
        // callback when pinned, `this` is headroom object
        onPin: function () { },
        // callback when unpinned, `this` is headroom object
        onUnPin: function () { },
        // callback when above offset, `this` is headroom object
        onTop: function () {
         //   toc.style.position = null;// "fixed";
            toc.style.top = null;// "0";//offset + "px";
        },
        // callback when below offset, `this` is headroom object
        onNotTop: function () {
         //   toc.style.position = "fixed";
            toc.style.top = (tocoffset - offset) + "px";
        },
        // callback when at bottom of page, `this` is headroom object
        // onBottom: function () { },
        // callback when moving away from bottom of page, `this` is headroom object
        //  onNotBottom: function () { }
    });

tocHeadroom.init();


window.addEventListener("orientationchange", function () {
    calcOffsets();
    tocHeadroom.offset = offset;
}, false);
window.addEventListener("resize", function () {
    calcOffsets();
    tocHeadroom.offset = offset;

}, false);




function init() {
    [].slice.call(document.querySelectorAll('.toc .nav')).forEach(function (nav) {
        var navItems: HTMLElement[] = [].slice.call(nav.querySelectorAll('.nav__item')),
            itemsTotal = navItems.length,
            setCurrent = function (item) {
                // return if already current
                if (item.classList.contains('nav__item--current')) {
                    return false;
                }
                // remove current
                var currentItem = nav.querySelector('.nav__item--current');
                currentItem.classList.remove('nav__item--current');

                // set current
                item.classList.add('nav__item--current');
            };

        let ignoreScroll = false;
        navItems.forEach(function (item) {
            item.addEventListener('click', function (e) { e.preventDefault(); setCurrent(item); ignoreScroll = true; setTimeout(() => ignoreScroll = false,1000);  window.location.hash = item.getAttribute('href') });
        });


        let headers = navItems.map(e => ({ target: document.querySelector(e.getAttribute("href")), source: e })).reverse();

        let scrollStopTimer = null;
        function onScrollWrapper() {

            if (!scrollStopTimer) {
                scrollStopTimer = setTimeout(onScroll, 50);
            }
        }
        function onScroll() {
            scrollStopTimer = 0;
            if (ignoreScroll) return;

            for (let el of headers) {

             //   if (isScrolledIntoView(el.target)) {
             //       setCurrent(el.source);
              //      return;
             //   }
            }
            for (let el of headers) {
                if (distanceFromView(el.target) < (tocoffset - offset)) {
                    setCurrent(el.source);
                    return;
                }
            }
            setCurrent(headers[headers.length-1].source);
        }

        scroller.addEventListener('scroll', onScrollWrapper);



    });


   

    //[].slice.call(document.querySelectorAll('.link-copy')).forEach(function (link) {
    //    link.setAttribute('data-clipboard-text', location.protocol + '//' + location.host + location.pathname + '#' + link.parentNode.id);
    //    new Clipboard(link);
    //    link.addEventListener('click', function () {
    //        link.classList.add('link-copy--animate');
    //        setTimeout(function () {
    //            link.classList.remove('link-copy--animate');
    //        }, 300);
    //    });
    //});
}

init();



/**
 *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
 *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables */

var disqus_config = function () {
    this.page.url = "@deeplink";  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = "@Model.Metadata.Alias.Trim('/',' ')"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};

(function () { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = '//earthml.disqus.com/embed.js';
    s.setAttribute('data-timestamp', new Date().getTime().toString());
    (d.head || d.body).appendChild(s);
})();