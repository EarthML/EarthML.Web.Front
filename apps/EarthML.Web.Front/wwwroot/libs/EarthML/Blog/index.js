define(["require", "exports", "../index", "headroom"], function (require, exports, index_1, Headroom) {
    "use strict";
    var header = document.querySelector(".article-open-item");
    var content = document.querySelector(".article-content");
    var toc = document.querySelector("#article-toc");
    window["toc"] = toc;
    var offset = 0;
    var tocoffset = 0;
    function calcOffsets() {
        offset = 0;
        tocoffset = 0;
        var offsetEl = header;
        while (offsetEl && offsetEl !== index_1.scroller) {
            console.log([offsetEl, offset, offsetEl.offsetTop]);
            offset += offsetEl.offsetTop;
            offsetEl = offsetEl.offsetParent;
        }
        offsetEl = toc;
        while (offsetEl && offsetEl !== index_1.scroller) {
            console.log([offsetEl, offset, offsetEl.offsetTop]);
            tocoffset += offsetEl.offsetTop;
            offsetEl = offsetEl.offsetParent;
        }
        console.log([offset, tocoffset]);
        offset = tocoffset - 70;
    }
    calcOffsets();
    var tocHeadroom = new Headroom(header, {
        scroller: index_1.scroller,
        // vertical offset in px before element is first unpinned
        offset: offset,
        // scroll tolerance in px before state changes
        //tolerance: 0,
        // or you can specify tolerance individually for up/down scroll
        tolerance: {},
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
            toc.style.top = null; // "0";//offset + "px";
        },
        // callback when below offset, `this` is headroom object
        onNotTop: function () {
            //   toc.style.position = "fixed";
            toc.style.top = (tocoffset - offset) + "px";
        },
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
            var navItems = [].slice.call(nav.querySelectorAll('.nav__item')), itemsTotal = navItems.length, setCurrent = function (item) {
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
            var ignoreScroll = false;
            navItems.forEach(function (item) {
                item.addEventListener('click', function (e) { e.preventDefault(); setCurrent(item); ignoreScroll = true; setTimeout(function () { return ignoreScroll = false; }, 1000); window.location.hash = item.getAttribute('href'); });
            });
            var headers = navItems.map(function (e) { return ({ target: document.querySelector(e.getAttribute("href")), source: e }); }).reverse();
            var scrollStopTimer = null;
            function onScrollWrapper() {
                if (!scrollStopTimer) {
                    scrollStopTimer = setTimeout(onScroll, 50);
                }
            }
            function onScroll() {
                scrollStopTimer = 0;
                if (ignoreScroll)
                    return;
                for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
                    var el = headers_1[_i];
                }
                if (index_1.distanceFromView(headers[1].target) < toc.clientHeight) {
                    if (!toc.classList.contains("end")) {
                        toc.classList.add("end");
                        toc.style.top = (content.clientHeight - toc.clientHeight) + "px";
                    }
                }
                else {
                    if (toc.classList.contains("end")) {
                        toc.classList.remove("end");
                        toc.style.top = (tocoffset - offset) + "px";
                    }
                }
                for (var _a = 0, headers_2 = headers; _a < headers_2.length; _a++) {
                    var el = headers_2[_a];
                    if (index_1.distanceFromView(el.target) < (tocoffset - offset)) {
                        setCurrent(el.source);
                        if (toc.classList.contains("begin")) {
                            toc.classList.remove("begin");
                        }
                        return;
                    }
                }
                if (!toc.classList.contains("begin")) {
                    toc.classList.add("begin");
                }
                setCurrent(headers[headers.length - 1].source);
            }
            index_1.scroller.addEventListener('scroll', onScrollWrapper);
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
        this.page.url = "@deeplink"; // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = "@Model.Metadata.Alias.Trim('/',' ')"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    (function () {
        var d = document, s = d.createElement('script');
        s.src = '//earthml.disqus.com/embed.js';
        s.setAttribute('data-timestamp', new Date().getTime().toString());
        (d.head || d.body).appendChild(s);
    })();
});
