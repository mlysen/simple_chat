module.exports = function(grunt) {
  grunt.initConfig({

    clean: {
      src: 'build',
      options: {
        force: true
      }
    },

    copy: {
      files: {
        cwd: 'client',
        expand: true,
        src: [
          'index.html',
          'partials/**',
          'css/**'
        ],
        dest: 'build'
      }
    },

    concat: {
      dist: {
        src: ['client/js/**'],
        dest: 'build/js/app.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['clean','copy', 'concat']);
}