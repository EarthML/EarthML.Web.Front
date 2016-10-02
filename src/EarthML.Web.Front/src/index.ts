

const player = document.querySelector("#bg-player") as HTMLIFrameElement;
const video = document.querySelector("#bg-player") as HTMLVideoElement;
const videoBG = document.querySelector("#video-background-img") as HTMLDivElement;
const scroller = document.querySelector(".scroller");
import * as NProgress from "nprogress"; 
import Headroom = require("headroom");
import Modernizr = require("modernizr"); 


import "class_list_ployfill";
import { MLPushMenu } from "./MLPushMenu/index";

//import "modernizr";
//import "css!./content/style.less";

const navHeight = 65;


function scrollToTop(scrollDuration) {
    var cosParameter = window.scrollY / 2,
        scrollCount = 0,
        oldTimestamp = performance.now();
    function step(newTimestamp) {
        scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) window.scrollTo(0, 0);
        if (window.scrollY === 0) return;
        window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}

function scrollTo(offsetTop: number, scrollDuration, element: Element = document.body) {
              
    var cosParameter = (offsetTop - element.scrollTop) / 2,
        scrollCount = 0,
        oldTimestamp = performance.now();
    function step(newTimestamp) {
        scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
        if (scrollCount >= Math.PI) element.scrollTop = offsetTop;
        if (element.scrollTop === offsetTop) return;

        element.scrollTop += offsetTop - element.scrollTop
            - Math.round(cosParameter + cosParameter * Math.cos(scrollCount));
  
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
       
    }

    window.requestAnimationFrame(step);           
}

document.querySelector("#scrollMainContent").addEventListener("click", (e) => {
   
    scrollTo(Math.min((document.querySelector("#maincontent") as HTMLElement).clientHeight,(document.querySelector("#maincontent") as HTMLElement).offsetTop - navHeight)-1, 600, scroller);
},true);

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
    console.log(event);

    if (event.target === video && event.type === "playing") {
        NProgress.set(0.8);
       
        setTimeout(() => {
            if (!playing) {
                NProgress.done();
                player.style.zIndex = "-1";
                videoBG.style.display = "block";
                document.querySelector(".logo-content").classList.remove("loading");
            }
        }, 500);

    } else if (event.target === video && event.type === "progress") {
        

        if (!playing) {
            NProgress.configure({
                trickle: false
            });
            player.style.zIndex = "1";
            document.querySelector(".video-foreground").classList.remove("loading");
            playing = true;
        }

        var loadedPercentage = this.buffered.end(0) / this.duration;

        if (scroller.scrollTop === 0) {
            NProgress.set(0.8 + (0.2 * loadedPercentage));
        } else {
            NProgress.done();
        }
      
    } else if (event.target === video && event.type === "ended") {
        player.style.zIndex = "-1";
        videoBG.style.display = "block";
        document.querySelector(".logo-content").classList.remove("loading");

        NProgress.done();
       
        //if (scroller.scrollTop === 0) {
        //    scrollTo(Math.min((document.querySelector("#maincontent") as HTMLElement).clientHeight, (document.querySelector("#maincontent") as HTMLElement).offsetTop - navHeight), 600, scroller);
        //}
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
            setTimeout(() => {
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
};

 

addEventListener("message", listener, false)
let headerHeight = document.querySelector("main header").clientHeight; //document.querySelector(".video-background").clientHeight;
 
var myElement = document.querySelector("header nav");

// construct an instance of Headroom, passing the element
let headroom = new Headroom(myElement,
    {
        scroller: scroller,
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
        onTop: function () { },
        // callback when below offset, `this` is headroom object
        onNotTop: function () { },
        // callback when at bottom of page, `this` is headroom object
       // onBottom: function () { },
        // callback when moving away from bottom of page, `this` is headroom object
      //  onNotBottom: function () { }
    });
// initialise
headroom.init();




let headroom1 = new Headroom(myElement,
    {
        scroller: scroller,
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
        onTop: function () { },
        // callback when below offset, `this` is headroom object
        onNotTop: function () { },
        // callback when at bottom of page, `this` is headroom object
        // onBottom: function () { },
        // callback when moving away from bottom of page, `this` is headroom object
        //  onNotBottom: function () { }
    });


window.addEventListener("orientationchange", function () {
    headerHeight = document.querySelector("main header").clientHeight;

    headroom.offset = (headerHeight - navHeight);
    headroom1.offset = (headerHeight - window.innerHeight);

    scroller.scrollTop = 0;
}, false);
window.addEventListener("resize", function () {
    headerHeight = document.querySelector("main header").clientHeight;

    headroom.offset = (headerHeight - navHeight);
    headroom1.offset = (headerHeight - window.innerHeight);
}, false);

Modernizr.on('videoautoplay', function (result) {
    
    if (result && video.getAttribute("data-src")) {
        video.src = video.getAttribute("data-src");// "EarthMlIntro3-SD.mp4";
        
    } else {
        NProgress.done();
        player.style.zIndex = "-1";
        videoBG.style.display = "block";
        document.querySelector(".logo-content").classList.remove("loading");
    }
});

let last = "";
let sections = document.querySelectorAll("main section");
document.body.classList.add(last = sections.item(0).getAttribute("data-class"));
let offset = (window.innerHeight - navHeight) / 2 + navHeight;
function isScrolledIntoView(el) {
    var elementTop = el.getBoundingClientRect().top;
    var elementBottom = el.getBoundingClientRect().bottom;
    console.log([elementTop, window.innerHeight, elementBottom, offset, elementTop < window.innerHeight, elementBottom >= offset, elementTop < window.innerHeight && elementBottom >= offset]);
    var isVisible = elementTop < window.innerHeight && elementBottom >= offset
    return isVisible;
}

let scrollStopTimer = null;
function onScrollWrapper() {

    clearTimeout(scrollStopTimer);
    scrollStopTimer=  setTimeout(onScroll,50);
}
function onScroll() {
    console.log('scrolling');

    for (let i = 0; i < sections.length; i++) {
        let el = sections.item(i);
        if (isScrolledIntoView(el)) {
            console.log(el);

            if (last !== el.getAttribute("data-class")) {
                if (last) {
                    document.body.classList.remove(last);
                }
                document.body.classList.add(last = el.getAttribute("data-class"));
               
            }
            break;
        }
    }
}

scroller.addEventListener('scroll', onScrollWrapper);

// initialise
headroom1.init();

video.addEventListener("playing", listener, false);
video.addEventListener("progress", listener, false);
video.addEventListener("ended", listener, false);
//player.src = "https://player.vimeo.com/video/178813739?autoplay=true&background=1&loop=0&api=1";

var menu = new MLPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'));