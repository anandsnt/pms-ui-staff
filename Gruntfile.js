
module.exports = function(grunt) {
    var paths = {
        dist: 'dev',
        src: {
            admin: 'admin/',
            rover: 'rover/'
        }
    };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: paths,
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
        },
        
		admin :{
	            cwd : 'admin/',
	            src : 'partials/**/*.html',
	            dest : 'build/admin_templates.js',
	            options :{
	                prefix : '/assets/',
	            }
	     }
    },
    bower: {
		  install: {
		  }
	},
	concat: {		
	   roverEnglishJson: {
            src: ['rover/rvLocales/en/*.json'],
            dest: 'rover/rvLocales/EN.json',
            options: {
                // Added to the top of the file
                banner: '{',
                // Will be added at the end of the file
                footer: '}',
                separator: ','
            }
       },
       adminEnglishJson: {
            src: ['admin/adLocales/en/*.json'],
            dest: 'admin/adLocales/EN.json',
            options: {
                // Added to the top of the file
                banner: '{',
                // Will be added at the end of the file
                footer: '}',
                separator: ','
            }
       },
        roverGermanJson: {
            src: ['rover/rvLocales/de/*.json'],
            dest: 'rover/rvLocales/DE.json',
            options: {
                // Added to the top of the file
                banner: '{',
                // Will be added at the end of the file
                footer: '}',
                separator: ','
            }
       },
       adminGermanJson: {
            src: ['admin/adLocales/de/*.json'],
            dest: 'admin/adLocales/DE.json',
            options: {
                // Added to the top of the file
                banner: '{',
                // Will be added at the end of the file
                footer: '}',
                separator: ','
            }
        }
    },
    watch: {
    files: ['<%= paths.src.admin %>/{,**/}*.js',
            '<%= paths.src.rover %>/{,**/}*.js']
    },
    tasks: ['jshint'],
    options: {
        livereload: true
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-concat');

};
