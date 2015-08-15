'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    
    clean: {
        build: {
          src: ['build']
        },
        tmp: {
          src: ['.tmp']
        }
    },

    copy: {
      build: {        
        src: [
          '**/*',
          '!**/test/**',
          '!**/css/**',
          '!**/node_modules/**', 
          '!**/build/**',
          '!**/vendor/**',
          '!**/js/**',
          '!**/*.ftppass',
          '!**/package.json', 
          '!**/Gruntfile.js',
          '!**/backUp-script.js',
          '!**/humans.txt',
          '!**/index.html',
          '!**/robots.txt'
        ],
        dest: 'build',
        expand: true,
        cwd: ''
      }
    },

    concat: {
      cssFiles: {
        src: ['css/*.css', 'vendor/bootstrap-3.1.1-dist/css/bootstrap.min.css'],
        dest: '.tmp/css/style.css'
      },
      jsFiles: {
        src: ['vendor/jquery-2.1.1/jquery-2.1.1.min.js', 'vendor/bootstrap-3.1.1-dist/js/bootstrap.min.js', 'vendor/mustache.js', 'js/parse-1.5.0.min.js', 'js/plugins.js', 'js/TodoService.js', 'js/TodoCollectionModel.js', 'js/TodoController.js', 'js/script.js' ],
        dest: '.tmp/js/script.js'
      }
    },

    csslint: {
      build: {
        src: ['css/style.css']
      }
    },

    jshint: {
      options: {
        curly: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      js: {
        src: 'js/script.js'
      }
    },
    
    cssmin: {
      build: {
        files: [{
          cwd: '',
          src: ['.tmp/css/style.css'],
          dest: 'build/css/style.min.css'
        }]
      }
    },

    'jsmin-sourcemap': {
      build: {
        src: ['.tmp/js/script.js'],
        dest: 'build/js/script.min.js'
      }
    },

    processhtml: {
      options: {
        process: true
      },
      'build/index.html': ['index.html']
    },

    htmlhint: {
      build: {
        src: ['build/index.html']
      }
    },
    
    watch: {
      index:{
        files: ['index.html'],
        tasks: ['htmlhint'],
        options: {
          livereload: 35729
        }
      },
      css: {
        files: ['css/style.css'],
        tasks: ['csslint'],
        options:{
          livereload: 35729
        }
      },
      js: {
        files:['js/script.js', 'test/test.js'],
        tasks: ['jshint:js'],
        options:{
          livereload: 35729
        }
      }
    },

    protractor: { 
      options: { 
        // Location of your protractor config file 
        configFile: "test/protractor-conf.js", 
      }, 
      e2e: { 
        options: { 
          keepAlive: false 
        } 
      } 
    },
    connect:{
      server:{
        options:{
          port: 3000,
          livereload: 35729
        }
      },
    },

    ftpush: {
      build: {
        auth: {
          host: 'host',
          port: 21
        },
        src: 'dist',
        dest: 'todos/',
        simple: true,
        useList: false
      }
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-htmlhint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-jsmin-sourcemap');
  grunt.loadNpmTasks('grunt-ftpush');
  

  grunt.registerTask('prepare', ['clean', 'copy', 'csslint', 'jshint', 'concat', 'cssmin', 'jsmin-sourcemap', 'processhtml', 'htmlhint', 'clean:tmp']);

  grunt.registerTask('test', ['connect','protractor:e2e']);

  grunt.registerTask('lint', ['csslint','htmlhint','jshint']);

  grunt.registerTask('default', ['connect','watch', 'jshint']);

  grunt.registerTask('build', ['jshint' , 'clean', 'copy', 'processhtml']);

  
  grunt.registerTask('deploy', ['prepare','ftpush:build']);
  

};
