module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Paths
  var PathConfig = {
    sassDir:        'scss/',
    cssDir:         'css/',
    jsDir:          'js/',
    imgDir:         'images/',
    imgSourceDir:   'sourceimages/',
    tempDir:        'temp/',
    distDir:        'production/'
  };

  // tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: PathConfig, 

    //clean files
    clean: {
      options: { force: true },
      all: {
        src: ["<%= config.cssDir %>", "<%= config.imgDir %>"]
      },
      css: {
        src: ["<%= config.cssDir %>**/*.map", "style.css.map"]
      }
    },

    // autoprefixer
    autoprefixer: {
      options: {
        browsers: ['last 4 version', 'ie 8', 'ie 9']
      },

      multiple_files: {
        options: {
            map: true
        },
        expand: true,
        flatten: true,
        src: ['<%= config.cssDir %>*.css', './style.css'],
      },

      dist: {
        src: ['<%= config.cssDir %>*.css', './style.css']
      },
    },

    //sass
    sass: {
      dev: {
        options: {
          sourceMap: true,
          style: 'expanded'
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.sassDir %>',
            src: ['**/*.scss', '!style.scss'],
            dest: '<%= config.cssDir %>',
            ext: '.css'
          },
          {src: '<%= config.sassDir %>style.scss', dest: './style.css'},
        ]
      },
      dist: {
        options: {
          sourceMap: false,
          style: 'expanded'
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.sassDir %>',
            src: ['**/*.scss', '!style.scss'],
            dest: '<%= config.cssDir %>',
            ext: '.css'
          },
          {src: '<%= config.sassDir %>style.scss', dest: './style.css'},
        ]
      },
      min: {
        options: {
          sourceMap: false,
          style: 'compressed'
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.sassDir %>',
            src: ['**/*.scss', '!style.scss'],
            dest: '<%= config.cssDir %>',
            ext: '.min.css'
          },
          {src: '<%= config.sassDir %>style.scss', dest: './style.min.css'},
        ]
      }
    },

    //watcher project
    watch: {
      options: {
        debounceDelay: 1,
        // livereload: true,
      },
      images: {
        files: ['<%= config.imgSourceDir %>**/*.*'],
        tasks: ['newer:pngmin:all', 'newer:imagemin:jpg'],
        options: {
            spawn: false
        }
      },
      css: {
        files: ['<%= config.sassDir %>**/*.scss'],
        tasks: ['sass:dev'/*, 'newer:autoprefixer:dist'*//*, 'notify:watch'*/],
        options: {
            spawn: false,
        }
      }
    },

    //Keep multiple browsers & devices in sync when building websites.
    browserSync: {
      dev: {
        bsFiles: {
          src : ['**/*.html','<%= config.cssDir %>**/*.css', '*.css']
        },
        options: {
          server: {
            baseDir: "./",
            index: "index.html",
            directory: true
          },
          watchTask: true
        }
      }
    },

    notify: {
      options: {
        enabled: true,
        max_js_hint_notifications: 5,
        title: "Project Alex"
      },
      watch: {
        options: {
          title: 'Task Complete',  // optional
          message: 'SASS finished running', //required
        }
      },
    }, 

    //copy files
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: './',
            src: [
              '**',

              '!scss/**',
              '!**/**/.svn/**',
              '!css/**',
            ],
            dest: '<%= config.distDir %>'
          } 
        ]
      },
    },


    //minify images
    imagemin: {
      jpg: {
        options: {
          progressive: true,
          optimizationLevel: 7
        },
        files: [{
          expand: true,
          cwd: '<%= config.imgSourceDir %>',
          src: ['**/*.jpg'],
          dest: '<%= config.imgDir %>',
          ext: '.jpg'
        }]
      },

      dist: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.imgSourceDir %>',
            src: ['**/*.{png,jpg,gif}'],
            dest: '<%= config.imgDir %>',
          }
        ],
      },
    },

    // lossy image optimizing (compress png images with pngquant)
    pngmin: {
      all: {
        options: {
          ext: '.png',
          force: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.imgSourceDir %>',
            src: ['**/*.png'],
            dest: '<%= config.imgDir %>',
            ext: '.png'
          }
        ]
      },
    },

    csscomb: {
      dist: {
        expand: true,
        files: {
          './style.css' : './style.css'
        },
      }
    },

    cmq: {
      options: {
        log: false
      },
      your_target: {
        files: {
          './style.css' : './style.css'
        },
      }
    }

  });

// run task
//dev 
  //watch
  grunt.registerTask('w', ['watch']);
  //browser sync
  grunt.registerTask('bs', ['browserSync']);

  //watch + browser sync
  grunt.registerTask('dev', ['browserSync', 'watch']);
  grunt.registerTask('default', ['dev']);

//finally 
  //css beautiful
  grunt.registerTask('cssbeauty', ['sass:dist', 'cmq', 'autoprefixer:dist', 'csscomb:dist']);
  //img minify
  grunt.registerTask('imgmin', ['pngmin:all', 'imagemin:jpg']);

  //final build
  grunt.registerTask('dist', ['clean:css', 'cssbeauty', 'newer:pngmin:all', 'newer:imagemin:jpg'/*, 'copy:dist','imgmin', 'cssbeauty'*/ ]);

};



