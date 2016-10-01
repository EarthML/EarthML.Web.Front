

const player = document.querySelector("#bg-player") as HTMLIFrameElement;
const video = document.querySelector("#bg-player") as HTMLVideoElement;
const videoBG = document.querySelector("#video-background-img") as HTMLDivElement;


import * as NProgress from "nprogress"; 
import Headroom = require("headroom");
//import Modernizr = require("modernizr"); 
import "modernizr";
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

function scrollTo(offsetTop: number, scrollDuration, element = document.body) {
              
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
    scrollTo((document.querySelector("#maincontent") as HTMLElement).offsetTop - navHeight, 600);
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
            //   document.querySelector(".video-foreground").classList.add("loading");
            setTimeout(function () {
                
                player.style.zIndex = "1";
                document.querySelector(".video-foreground").classList.remove("loading");

                playing = true;
            }, 0);
        }
        var loadedPercentage = this.buffered.end(0) / this.duration;
        console.log(loadedPercentage);
        if (window.scrollY === 0) {
            NProgress.set(0.8 + (0.2 * loadedPercentage));
        } else {
            NProgress.done();
        }
      
    } else if (event.target === video && event.type === "ended") {
        player.style.zIndex = "-1";
        videoBG.style.display = "block";
        document.querySelector(".logo-content").classList.remove("loading");

        NProgress.done();
        if (window.scrollY === 0) {
            scrollTo((document.querySelector("#maincontent") as HTMLElement).offsetTop - navHeight, 600);
        }
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
const headerHeight = document.querySelector("main > header").clientHeight; //document.querySelector(".video-background").clientHeight;
console.log(headerHeight);
console.log(headerHeight - window.innerHeight + navHeight);
var myElement = document.querySelector("nav");

// construct an instance of Headroom, passing the element
let headroom = new Headroom(myElement,
    {
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

//Modernizr.on('videoautoplay', function (result) {
//    console.log(result);
//    if (result) {
//        // supported
//    } else {
//        NProgress.done();
//        player.style.zIndex = "-1";
//        videoBG.style.display = "block";
//        document.querySelector(".logo-content").classList.remove("loading");
//    }
//});


// initialise
headroom1.init();

video.addEventListener("playing", listener, false);
video.addEventListener("progress", listener, false);
video.addEventListener("ended", listener, false);
//player.src = "https://player.vimeo.com/video/178813739?autoplay=true&background=1&loop=0&api=1";

