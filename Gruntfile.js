
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean :{
        cwd : 'build',
        build :{
            src: ['rover_templates.js']
        },
    },
    ngtemplates: {
        sntRover :{
            cwd : 'rover/',
            src : 'partials/**/*.html',
            dest : 'build/rover_templates.js',

            options :{
                prefix : '/assets/',
            }
    
        }
    },
  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');


};
