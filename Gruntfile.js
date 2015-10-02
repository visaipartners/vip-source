/**
 * Created by Estevao on 08-07-2015.
 */
module.exports = function (grunt) {

  var siteSrc = 'src',
      dest = 'public';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      html: {
        files: [
          {src: siteSrc + '/index.html', dest: dest + '/index.html'},
          {src: siteSrc + '/CNAME', dest: dest + '/CNAME'}
        ]
      }
      ,assets: {
        files: [
          {
            expand: true,
            cwd: siteSrc + '/media/',
            src: ['**'],
            dest: dest + '/media/'
          }
          ,{
            expand: true,
            cwd: siteSrc + '/data/',
            src: ['**'],
            dest: dest + '/data/'
          }
          ,{
            expand: true,
            cwd: 'bower_components/font-awesome/fonts/',
            src: ['**'],
            dest: dest + '/fonts/'
          }
        ]
      }
    }

    ,useminPrepare: {
      options: {
        dest: dest
      },
      html: siteSrc + '/index.html'
    }

    ,usemin: {
      html: [dest + '/index.html']
    }

    ,clean: {
      tmp: ['.tmp/'],
      public: ['public/**/*', '!public/.git']
    }

    ,ngtemplates: {
      vip: {
        cwd: siteSrc,
        src: 'views/**.html',
        dest: '.tmp/js/views.js',
        options: {
          usemin: dest + '/js/app.js',
          htmlmin: '<%= htmlmin.dist.options %>'
        }
      }
    }

    ,htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true, // Only if you don't use comment directives!
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: [
            {src: dest + '/index.html', dest: dest + '/index.html'}
        ]
      }
    }

    ,'yaml-validate': {
      options: {
        glob: 'src/translation/*.yml'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('buildTranslations', function () {
    var trans = {},
        json = '';

    grunt.file.expand({ filter: 'isFile'}, ['src/translation/*.yml']).forEach(
      function(path) {
        var lang = path.match(/src\/translation\/(.*)\.yml/)[1];
        try {
          trans[lang] = grunt.file.readYAML(path);
        } catch (e) {
          console.log(e);
        }
      }
    );
    json = 'window.translations = ' + JSON.stringify(trans);
    grunt.file.write(dest + '/js/translations.js', json);
  });

  grunt.registerTask('test', ['yaml-validate']);

  grunt.registerTask('build', [
    'clean:public',
    'copy:html',
    'useminPrepare',
    'copy:assets',
    //'copy:php',
    'ngtemplates',
    'concat',
    'uglify',
    'cssmin',
    'usemin',
    'buildTranslations',
    'htmlmin',
    'clean:tmp'
  ]);

  // Default task(s).
  grunt.registerTask('default', ['build']);

};