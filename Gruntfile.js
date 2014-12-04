module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({

        // pkg: grunt.file.readJSON('package.json'),

        ts: 
        {
            options: 
            {
                comments: false,               // 删除注释
                target: 'es5',                 // es5,默认为es3
                module: 'commonjs',            // 居然默认是amd?
                declaration: true,             // 生成.d.ts
            },
            // a particular target
            build: 
            {
                src: ["stagl/reference.ts"],  
                // reference: 'stagl/reference.ts',  //create reference.ts
                out: './build/stagl.js', 
                // watch: 'stagl',  
            }
        },


        uglify: 
        {
            min: 
            {
              files: {'build/stagl.min.js': ['build/stagl.js']}
            }
        },

        copy:
        {
           builds: {expand: true, cwd: 'build/', src: '*', dest: 'stagl-examples/'}
        }

    });
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");


    // grunt.registerTask("min",["uglify:min"]);
    // grunt.registerTask("copy2examples",["copy:builds"]);
    grunt.registerTask("default", ["ts:build" , "uglify:min" , "copy:builds"]);
};