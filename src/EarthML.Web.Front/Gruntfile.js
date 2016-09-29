﻿/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
var fs = require('fs');

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-front-end-modules');
    grunt.loadNpmTasks('grunt-npmcopy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask("build", ["run:tool","lessDependencis","less"]);


    grunt.registerTask("buildModernizer", function (l, b) {
        console.log("A");
        var modernizr = require("modernizr");
        var done = this.async();
        modernizr.build({}, function (result) {
            console.log(result); // the build
           
          
            if (!fs.existsSync("wwwroot/libs/modernizr")) {
                fs.mkdirSync("wwwroot/libs/modernizr");
            }

            fs.writeFile("wwwroot/libs/modernizr/modernizr.js", result, function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
                done();
            });
        });
    });

    grunt.registerTask("lessDependencis", "myLessDependencies", function (l, b) {
        var jsFiles = grunt.file.expand(["wwwroot/libs/EarthML/*.js"], { cwd: "wwwroot/libs/EarthML" });
        var tester = /define\(\[.*"(css\!.*\.(less|min\.css))".*\],.*/g;
        var replacer = /(define\(\[.*"css\!.*)(\.less)(".*\],[\s\S]*)/g;
        var lessFiles = {};
        jsFiles.forEach(function (f) {

            console.log(f);
            var content = grunt.file.read(f);
            var bla = tester.exec(content);
            if (bla) {
                console.log(bla[1]);
                var path = f.substr("wwwroot/libs/EarthML/".length);
                var src = "src/" + path.substr(0, path.lastIndexOf("/") + 1);
                var relPath = bla[1].substr("css!".length);
                if (relPath[0] == "." && relPath[1] === "/")
                    relPath = relPath.substr(2);

                if (relPath.split('.').pop() === "css") {
                    relPath = relPath.substr(0, relPath.lastIndexOf(".", relPath.length - 5)) + ".less";
                } else {
                    grunt.file.write(f, content.replace(replacer, "$1.min.css$3"));
                }
                console.log(src + relPath);
                if (fs.existsSync(src + relPath)) {
                    lessFiles[f.substr(0, f.lastIndexOf("/") + 1) + relPath.substr(0, relPath.lastIndexOf(".")) + ".min.css"] = src + relPath;
                }


            }


        });
 
        if (Object.keys(lessFiles).length) {
            console.log(lessFiles);
            var lessTaskName = "less.tmplib";
            grunt.config.set(lessTaskName, {
                options: {
                    compress: true,
                    paths: ["wwwroot/libs"]
                },
                plugins: [
                        new (require('less-plugin-autoprefix'))({ browsers: ["last 2 versions"] }),
                        new (require('less-plugin-clean-css'))({ advanced: true })
                ],
                files: lessFiles
            });
            console.log(lessFiles);
            var tasks = [lessTaskName].filter(function (f) { return f }).map(function (t) { return t.replace(".", ":"); });

            grunt.task.run(tasks);
        }
    });

    grunt.initConfig({
        less: {
            default: {
                options: {
                    compress: true,
                    paths: ["wwwroot"]
                },
                plugins: [
                    new (require('less-plugin-autoprefix'))({ browsers: ["last 2 versions"] }),
                    new (require('less-plugin-clean-css'))({ advanced: true })
                ],

                files:
                    {
                        "wwwroot/libs/EarthML/content/style.min.css": "src/content/style.less"                     
                    }
            },
        },
        run: {
            tool: {
                exec: 'npm run tsc',
           //     args:["run", "tsc"]
            }
        },
        copy:{
            fonts:{
                files: [
                    // makes all src relative to cwd
                      { expand: true, cwd: 'src/', src: ['**/fonts/**/*.eot', '**/fonts/**/*.svg', '**/fonts/**/*.ttf', '**/fonts/**/*.woff', '**/fonts/**/*.woff2'], dest: 'wwwroot/libs/EarthML' },
                ]
            }
        },
        npmcopy: {
            // Anything can be copied 
            libs: {
                options: {
                    destPrefix: 'wwwroot/libs'
                },
                files: {
                    // Keys are destinations (prefixed with `options.destPrefix`) 
                    // Values are sources (prefixed with `options.srcPrefix`); One source per destination 
                    // e.g. 'node_modules/chai/lib/chai.js' will be copied to 'test/js/libs/chai.js' 
                    'nprogress/': 'nprogress/nprogress.*',
                    "requirejs/": [ "requirejs/require.js","requirejs-text/text.js", "require-css/css.js"], 
                    "headroom/": "headroom.js/dist/headroom.js",
                }
            }
        }

    });
};