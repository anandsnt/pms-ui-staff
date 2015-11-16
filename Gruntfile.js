'use strict';

module.exports = function(grunt) {
    var paths = {
            dist: 'dev',
            src: {
                admin: 'admin/',
                rover: 'rover/'
            },
            partials: {
                admin: 'admin/partials/',
                rover: 'rover/partials/'
            },
            locales: {
                adminEnglish: 'admin/adLocales/en/',
                roverEnglish: 'rover/rvLocales/en'
            }
        },
        connect = {
            options: {
                port: 9000,
                hostname: 'localhost',  
                livereload: 35729
            }
        };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: paths,
        connect: connect,
        clean: {
            cwd: 'build',
            build: {
                src: ['rover_templates.js']
            }
        },
        ngtemplates: {
            sntRover: {
                cwd: 'rover/',
                src: 'partials/**/*.html',
                dest: 'build/rover_templates.js',
                options: {
                    prefix: '/assets/'
                }
            },

            admin: {
                cwd: 'admin/',
                src: 'partials/**/*.html',
                dest: 'build/admin_templates.js',
                options: {
                    prefix: '/assets/'
                }
            },
            sntZestStation: {
                cwd: 'zest_station/',
                src: 'partials/**/*.html',
                dest: 'build/zest_station_templates.js',
                options: {
                    prefix: '/assets/'
                }               
            },
            login: {
                cwd: 'login/',
                src: 'partials/**/*.html',
                dest: 'build/login_templates.js',
                options: {
                    prefix: '/assets/'
                }
            },
            sntGuestWeb: {
                cwd: 'guestweb/',
                src: '**/partials/**/*.html',
                dest: 'build/guest_web_templates.js',
                options: {
                    prefix: '/assets/'
                }             
            }

        },
        bower: {
            install: {}
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
            },
            guestWebEnglishJson: {
                src: ['guestweb/gwLocales/en/*.json'],
                dest: 'guestweb/gwLocales/EN.json',
                options: {
                    // Added to the top of the file
                    banner: '{',
                    // Will be added at the end of the file
                    footer: '}',
                    separator: ','
                }
            }
        },
        shell: {
            startRailsServer: {
                command: 'rails s',
                options: {
                    async: true
                }
            }
        },
        jshint: {
            reporterOutput: 'lint.log',
            options: {
                strict: true,
                immed: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                //undef: true,
                unused: true,
                //quotmark: 'single',
                funcscope: true,
                maxstatements: 25,
                maxcomplexity: 6,
                maxdepth: 5,
                maxparams: 5,
                reporter: require('jshint-html-reporter'),
                reporterOutput: 'jslint-report.html',
                globals: {
                    jQuery: true
                }
            },
            ignore_warning: {
                options: {
                    '-W015': true
                }
            },
            src: ['<%= paths.src.admin %>/**/*.js', '<%= paths.src.rover %>/**/*.js']
        },
        watch: {
            scripts: {
                files: ['<%= paths.src.admin %>/{,**/}*.js', '<%= paths.src.rover %>/{,**/}*.js'],
                //tasks: ['jshint:src'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['<%= paths.partials.admin %>/{,**/}*.html', '<%= paths.partials.rover %>/{,**/}*.html'],
                tasks: ['ngtemplates'],
                options: {
                    livereload: true
                }
            },
            locales: {
                files: ['<%= paths.locales.adminEnglish %>/*.json', '<%= paths.locales.roverEnglish %>/*.json'],
                tasks: ['concat'],
                options: {
                    livereload: true
                }
            }
        },
        livereload: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('server', ['clean', 'ngtemplates', 'shell', 'watch']);
    grunt.registerTask('rebuild', ['clean', 'concat', 'ngtemplates']);
};
