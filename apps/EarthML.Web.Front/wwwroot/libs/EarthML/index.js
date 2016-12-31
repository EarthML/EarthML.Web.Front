var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "nprogress", "headroom", "modernizr", "kolayout", "./MLPushMenu/index"], function (require, exports, NProgress, Headroom, Modernizr, kolayout_1, index_1) {
    "use strict";
    var player = document.querySelector("#bg-player");
    var video = document.querySelector("#bg-player");
    var videoBG = document.querySelector("#video-background-img");
    exports.scroller = document.querySelector(".scroller");
    //import "modernizr";
    //import "css!./content/style.less";
    var navHeight = 65;
    var MainLayout = (function (_super) {
        __extends(MainLayout, _super);
        function MainLayout() {
            _super.call(this, { name: "cool" });
        }
        return MainLayout;
    }(kolayout_1.KoLayout));
    exports.MainLayout = MainLayout;
    function scrollToTop(scrollDuration) {
        var cosParameter = window.scrollY / 2, scrollCount = 0, oldTimestamp = performance.now();
        function step(newTimestamp) {
            scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
            if (scrollCount >= Math.PI)
                window.scrollTo(0, 0);
            if (window.scrollY === 0)
                return;
            window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
            oldTimestamp = newTimestamp;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    exports.scrollToTop = scrollToTop;
    function scrollTo(offsetTop, scrollDuration, element) {
        if (element === void 0) { element = document.body; }
        var cosParameter = (offsetTop - element.scrollTop) / 2, scrollCount = 0, oldTimestamp = performance.now();
        function step(newTimestamp) {
            scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
            if (scrollCount >= Math.PI)
                element.scrollTop = offsetTop;
            if (element.scrollTop === offsetTop)
                return;
            element.scrollTop += offsetTop - element.scrollTop
                - Math.round(cosParameter + cosParameter * Math.cos(scrollCount));
            oldTimestamp = newTimestamp;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    exports.scrollTo = scrollTo;
    function scrollToElement(node, scrollDuration, element) {
        if (element === void 0) { element = document.body; }
        var offset = -70;
        var offsetEl = node;
        while (offsetEl && offsetEl !== exports.scroller) {
            console.log(["sc", offsetEl, offset, offsetEl.offsetTop]);
            offset += offsetEl.offsetTop;
            offsetEl = offsetEl.offsetParent;
        }
        scrollTo(offset, scrollDuration, element);
    }
    exports.scrollToElement = scrollToElement;
    function post(action, value) {
        // Helper function for sending a message to the player
        var data = {
            method: action,
            value: undefined
        };
        if (value) {
            data.value = value;
        }
        var message = JSON.stringify(data);
        player.contentWindow.postMessage(data, '*');
    }
    var playing = false;
    function listener(event) {
        if (event.target === video && event.type === "playing") {
            NProgress.set(0.8);
            setTimeout(function () {
                if (!playing) {
                    NProgress.done();
                    player.style.zIndex = "-1";
                    videoBG.style.display = "block";
                    document.querySelector(".logo-content").classList.remove("loading");
                }
            }, 500);
        }
        else if (event.target === video && event.type === "progress") {
            if (!playing) {
                NProgress.configure({
                    trickle: false
                });
                player.style.zIndex = "1";
                document.querySelector(".video-foreground").classList.remove("loading");
                playing = true;
            }
            var loadedPercentage = this.buffered.end(0) / this.duration;
            if (exports.scroller.scrollTop === 0) {
                NProgress.set(0.8 + (0.2 * loadedPercentage));
            }
            else {
                NProgress.done();
            }
        }
        else if (event.target === video && event.type === "ended") {
            player.style.zIndex = "-1";
            videoBG.style.display = "block";
            document.querySelector(".logo-content").classList.remove("loading");
            NProgress.done();
        }
        // Handle messages from the vimeo player only
        if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
            return false;
        }
        var data = JSON.parse(event.data);
        //  console.log(data);
        switch (data.event) {
            case 'ready':
                NProgress.set(0.8);
                post('addEventListener', 'playProgress');
                setTimeout(function () {
                    if (!playing) {
                        NProgress.done();
                        player.style.zIndex = "-1";
                        videoBG.style.display = "block";
                        document.querySelector(".logo-content").classList.remove("loading");
                    }
                }, 500);
                break;
            case 'playProgress':
                if (!playing) {
                    //   document.querySelector(".video-foreground").classList.add("loading");
                    setTimeout(function () {
                        NProgress.done();
                        player.style.zIndex = "1";
                        document.querySelector(".video-foreground").classList.remove("loading");
                        playing = true;
                    }, 0);
                }
                //   console.log(data.data.percent);
                if (data.data.percent === 1) {
                    player.style.zIndex = "-1";
                    videoBG.style.display = "block";
                    document.querySelector(".logo-content").classList.remove("loading");
                }
                break;
        }
    }
    ;
    addEventListener("message", listener, false);
    var headerHeight = document.querySelector("main header").clientHeight; //document.querySelector(".video-background").clientHeight;
    var myElement = document.querySelector("header nav");
    // construct an instance of Headroom, passing the element
    var headroom = new Headroom(myElement, {
        scroller: exports.scroller,
        // vertical offset in px before element is first unpinned
        offset: (headerHeight - navHeight),
        // scroll tolerance in px before state changes
        //tolerance: 0,
        // or you can specify tolerance individually for up/down scroll
        tolerance: {
            up: Infinity,
            down: 0
        },
        // css classes to apply
        classes: {
            // when element is initialised
            initial: "headroom",
            // when scrolling up
            pinned: "headroom--pinned",
            // when scrolling down
            unpinned: "headroom--unpinned",
            // when above offset
            top: "headroom--top",
            // when below offset
            notTop: "headroom--not-top",
        },
        // element to listen to scroll events on, defaults to `window`
        // scroller: someElement,
        // callback when pinned, `this` is headroom object
        onPin: function () { },
        // callback when unpinned, `this` is headroom object
        onUnPin: function () { },
        // callback when above offset, `this` is headroom object
        onTop: function () { },
        // callback when below offset, `this` is headroom object
        onNotTop: function () { },
    });
    // initialise
    headroom.init();
    var headroom1 = new Headroom(myElement, {
        scroller: exports.scroller,
        // vertical offset in px before element is first unpinned
        offset: (headerHeight - window.innerHeight),
        // scroll tolerance in px before state changes
        //tolerance: 0,
        // or you can specify tolerance individually for up/down scroll
        tolerance: {
            up: Infinity,
            down: 0
        },
        // css classes to apply
        classes: {
            // when element is initialised
            initial: "headroom1",
            // when scrolling up
            pinned: "headroom1--pinned",
            // when scrolling down
            unpinned: "headroom1--unpinned",
            // when above offset
            top: "headroom1--top",
            // when below offset
            notTop: "headroom1--not-top",
        },
        // element to listen to scroll events on, defaults to `window`
        // scroller: someElement,
        // callback when pinned, `this` is headroom object
        onPin: function () { },
        // callback when unpinned, `this` is headroom object
        onUnPin: function () { },
        // callback when above offset, `this` is headroom object
        onTop: function () { },
        // callback when below offset, `this` is headroom object
        onNotTop: function () { },
    });
    window.addEventListener("orientationchange", function () {
        headerHeight = document.querySelector("main header").clientHeight;
        headroom.offset = (headerHeight - navHeight);
        headroom1.offset = (headerHeight - window.innerHeight);
        exports.scroller.scrollTop = 0;
    }, false);
    window.addEventListener("resize", function () {
        headerHeight = document.querySelector("main header").clientHeight;
        headroom.offset = (headerHeight - navHeight);
        headroom1.offset = (headerHeight - window.innerHeight);
    }, false);
    Modernizr.on('videoautoplay', function (result) {
        if (result && video.getAttribute("data-src")) {
            video.src = video.getAttribute("data-src"); // "EarthMlIntro3-SD.mp4";
        }
        else {
            NProgress.done();
            player.style.zIndex = "-1";
            videoBG.style.display = "block";
            document.querySelector(".logo-content").classList.remove("loading");
        }
    });
    var last = [];
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section"));
    if (sections.length) {
        document.body.classList.add.apply(document.body.classList, last = sections[0].getAttribute("data-class").split(' ').filter(function (f) { return f; }));
        document.querySelector("#scrollMainContent").addEventListener("click", function (e) {
            var scrollValue = document.querySelector("#maincontent").offsetTop - navHeight;
            if (document.querySelector("#maincontent").clientHeight + 1 <= scrollValue) {
                scrollValue = document.querySelector("#maincontent").clientHeight;
            }
            scrollTo(scrollValue, 600, exports.scroller);
        }, true);
        document.querySelector("#scrollMainContent").parentElement.style.display = "block";
    }
    else {
    }
    var offset = (window.innerHeight - navHeight) / 2 + navHeight;
    function isScrolledIntoView(el) {
        var elementTop = el.getBoundingClientRect().top;
        var elementBottom = el.getBoundingClientRect().bottom;
        console.log([elementTop, window.innerHeight, elementBottom, offset, elementTop < window.innerHeight, elementBottom >= offset, elementTop < window.innerHeight && elementBottom >= offset]);
        var isVisible = elementTop < window.innerHeight && elementBottom >= offset;
        return isVisible;
    }
    exports.isScrolledIntoView = isScrolledIntoView;
    function distanceFromView(el) {
        var elementTop = el.getBoundingClientRect().top;
        var elementBottom = el.getBoundingClientRect().bottom;
        return elementTop;
    }
    exports.distanceFromView = distanceFromView;
    var scrollStopTimer = null;
    function onScrollWrapper() {
        clearTimeout(scrollStopTimer);
        scrollStopTimer = setTimeout(onScroll, 50);
    }
    function onScroll() {
        console.log('scrolling');
        for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
            var el = sections_1[_i];
            if (isScrolledIntoView(el)) {
                console.log(el);
                if (last.join('') !== el.getAttribute("data-class").split(' ').filter(function (f) { return f; }).join('')) {
                    if (last.length) {
                        document.body.classList.remove.apply(document.body.classList, last);
                    }
                    document.body.classList.add.apply(document.body.classList, (last = el.getAttribute("data-class").split(' ').filter(function (f) { return f; })));
                }
                return;
            }
        }
    }
    exports.scroller.addEventListener('scroll', onScrollWrapper);
    // initialise
    headroom1.init();
    video.addEventListener("playing", listener, false);
    video.addEventListener("progress", listener, false);
    video.addEventListener("ended", listener, false);
    //player.src = "https://player.vimeo.com/video/178813739?autoplay=true&background=1&loop=0&api=1";
    var menu = new index_1.MLPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'));
    window.onbeforeunload = function (e) {
        window.sessionStorage.setItem("__scroll", JSON.stringify({ value: exports.scroller.scrollTop.toString(), href: window.location.href }));
    };
    (function (document, history, location) {
        var HISTORY_SUPPORT = !!(history && history.pushState);
        var anchorScrolls = {
            ANCHOR_REGEX: /^#[^ ]+$/,
            OFFSET_HEIGHT_PX: 50,
            /**
             * Establish events, and fix initial scroll position if a hash is provided.
             */
            init: function () {
                this.scrollToCurrent();
                window.addEventListener('hashchange', this.scrollToCurrent.bind(this));
                document.body.addEventListener('click', this.delegateAnchors.bind(this));
            },
            /**
             * Return the offset amount to deduct from the normal scroll position.
             * Modify as appropriate to allow for dynamic calculations
             */
            getFixedOffset: function () {
                return this.OFFSET_HEIGHT_PX;
            },
            /**
             * If the provided href is an anchor which resolves to an element on the
             * page, scroll to it.
             * @param  {String} href
             * @return {Boolean} - Was the href an anchor.
             */
            scrollIfAnchor: function (href, pushToHistory) {
                var match, rect, anchorOffset;
                if (!this.ANCHOR_REGEX.test(href)) {
                    return false;
                }
                match = document.getElementById(href.slice(1));
                if (match) {
                    console.log(match);
                    scrollToElement(match, 1, exports.scroller);
                    // Add the state to history as-per normal anchor links
                    if (HISTORY_SUPPORT && pushToHistory) {
                        history.pushState({}, document.title, location.pathname + href);
                    }
                }
                return !!match;
            },
            /**
             * Attempt to scroll to the current location's hash.
             */
            scrollToCurrent: function () {
                if (!this.scrollIfAnchor(window.location.hash)) {
                    var a = JSON.parse(window.sessionStorage.getItem("__scroll") || "{}");
                    if (a.value && a.href === window.location.href) {
                        exports.scroller.scrollTop = a.value;
                        window.sessionStorage.setItem("__scroll", "{}");
                    }
                }
            },
            /**
             * If the click event's target was an anchor, fix the scroll position.
             */
            delegateAnchors: function (e) {
                console.log(e);
                var elem = e.target;
                if (elem.nodeName === 'A' &&
                    this.scrollIfAnchor(elem.getAttribute('href'), true)) {
                    e.preventDefault();
                }
            }
        };
        anchorScrolls.init();
        //window.addEventListener(
        //    'DOMContentLoaded', anchorScrolls.init.bind(anchorScrolls)
        //);
    })(window.document, window.history, window.location);
});
