module.exports = function (grunt) {
  'use strict';

  var pkg = grunt.file.readJSON('package.json');
  var files = [];
  var src = [];
  var pastPath = "docs/lib";
  pkg.files.forEach(element => {


    files.push((element + "").replace("node_modules", pastPath ));
    src.push((element + "").replace("node_modules/", ""));

  });
  console.log(files);


  grunt.initConfig({
    injector: {
      options: {},
      local_dependencies: {
        files: {
          'docs/index.html':files,
        }
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'node_modules',
        src: src,
        dest: pastPath,
      },
    },
  })


  grunt.loadNpmTasks('grunt-asset-injector');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy',
    'injector'
  ]);


}