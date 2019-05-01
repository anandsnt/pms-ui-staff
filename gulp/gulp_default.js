module.exports = function(gulp, $, options) {

            var del = require('del'),
                _ = require('lodash'),
                    DEST_ROOT_PATH = '../../public/assets/',
                    runSequence = require('run-sequence'); //will be running from app/assets, so..

    const path = require('path');
    const eslint = require('gulp-eslint');

    options.environment = require('./../environments/environment');

            gulp.task('clean', function () {
                return del([DEST_ROOT_PATH], {force: true });
            });

            gulp.task('copy-all-dev', [
                'copy-rover-files', 
                'copy-login-files', 
                'copy-station-login-files',
                'copy-zest-files', 
                'copy-zeststation-files'
            ]);

            var compilationTasks = [
                    'rover-asset-prod-precompile',  
                    'admin-asset-prod-precompile',
                    'zest-asset-prod-precompile',
                    'login-asset-prod-precompile',
                    'station-login-asset-prod-precompile',
                    'payment-asset-prod-precompile',
                    'guestweb-v2-asset-prod-precompile'
                ],

        tasksAfterCompilation = [
                    'rover-inject-assets-to-templates',
                    'admin-inject-assets-to-templates',
                    'login-inject-assets-to-templates', 
                    'station-login-inject-assets-to-templates', 
                    'zest-inject-assets-to-templates',
                    'guestweb-v2-inject-assets-to-templates',
                    'copy-cordova-assets'
                ],

        copyBaseHtmlToPublicAssets = [
                    'copy-login-base-html',
                    'copy-station-login-base-html',
                    'copy-admin-base-html',
                    'copy-zest-base-html',
                    'copy-rover-base-html',
                    'copy-guestweb-v2-base-html',
                    'compress-images-loselessly'
                ],

        developmentTasks = [
                    'build-rover-dev', 
                    'build-login-dev', 
                    'build-station-login-dev', 
                    'build-admin-dev', 
                    'build-zest-dev', 
                    'build-guestweb-dev',
                    'build-guestweb-v2-dev',
                    'build-payment-dev',
                    'copy-cordova-assets'
                ],

        watchTasks = [
                    'watch-rover-files', 
                    'watch-login-files',
                    'watch-station-login-files', 
                    'watch-admin-files', 
                    'watch-zest-files', 
                    'watch-guestweb-files',
                    'watch-guestweb-v2-files',
                    'watch-payment-files'
                ];

    var processArgs = function() {
        var argv = require('yargs').argv;

        if (argv['prod'] || argv['production']) {
            process.env.BUILD_ENV = 'prod';
        } else if (argv['env']) {
            process.env.BUILD_ENV = argv['env'];
        }

        // Inject gtm tags only if option is provided
        if (argv['gtm']) {
            // in case of asset-precompile
            compilationTasks.push('inject_gtm_script_rover');
            // in case of building in dev environment w/o concatenation
            developmentTasks.push('inject_gtm_script_rover');
        }

        // if you dont want to work with guest web (zest web),
        // you can pass --no-gw arg with gulp s. eg:- gulp s --no-gw
        if ('gw' in argv && !argv.gw) {

            developmentTasks.splice(
                developmentTasks.indexOf('build-guestweb-dev'), 1);
            developmentTasks.splice(
                developmentTasks.indexOf('build-guestweb-v2-dev'), 1);

            copyBaseHtmlToPublicAssets.splice(
                copyBaseHtmlToPublicAssets.indexOf('copy-guestweb-base-html'),
                1);
            copyBaseHtmlToPublicAssets.splice(
                copyBaseHtmlToPublicAssets.indexOf(
                    'copy-guestweb-v2-base-html'), 1);

            watchTasks.splice(watchTasks.indexOf('watch-guestweb-files'), 1);
            watchTasks.splice(watchTasks.indexOf('watch-guestweb-v2-files'), 1);
        }

        // if you dont want to work with zest station,
        // you can pass --no-zs arg with gulp s. eg:- gulp s --no-zs
        if ('zs' in argv && !argv.zs) {

            developmentTasks.splice(developmentTasks.indexOf('build-zest-dev'),
                1);

            copyBaseHtmlToPublicAssets.splice(
                copyBaseHtmlToPublicAssets.indexOf('copy-zest-base-html'), 1);

            watchTasks.splice(watchTasks.indexOf('watch-zest-files'), 1);
        }
    };

    $.onChangeJSinDev = function(file) {
        const destination = file.replace(/\/app\//ig, '/public/');

        console.log('\x1b[33m%s\x1b[0m', 'change detected on file... ' + file);

        gulp.src(file).
            pipe($.babel()).
            on('error', options.silentErrorShowing).
            pipe($.jsvalidate()).
            on('error', options.silentErrorShowing).
            pipe(eslint({
                configFile: './.eslintrc.json'
            })).
            pipe(eslint.result(function(result) {
                console.log('\x1b[1;35m', `\u2757 ${result.warningCount} WARNINGS`, '\x1b[0m',
                    '\x1b[1;31m', `\u26D4 ${result.errorCount} ERRORS`, '\x1b[0m');
            })).
            pipe(gulp.dest(path.dirname(destination), {
                overwrite: true
            }));

        console.log('\x1b[32m', '.. copied to ...' + destination);
        console.log('\x1b[0m');
    };

    /**
     * overrides default variables with specific values for the environment
     * @returns {undefined}
     */
    function setEnvironment() {
        if (process.env.BUILD_ENV) {
            try {
                _.merge(options.environment,
                    require('./../environments/environment.' +
                        process.env.BUILD_ENV.toLowerCase()));
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    // development
    gulp.task('build', developmentTasks, function(callback){
        return runSequence(copyBaseHtmlToPublicAssets, callback)
    });

    gulp.task('gw-asset-precompile', function(callback) {
        return runSequence('guestweb-asset-prod-precompile', 'guestweb-inject-assets-to-templates', 'copy-guestweb-base-html', callback);
    });

    gulp.task('asset-precompile', ['gw-asset-precompile'], function(callback) {
        processArgs();
        setEnvironment();
        return runSequence(compilationTasks, tasksAfterCompilation, copyBaseHtmlToPublicAssets, callback);
    });

    gulp.task('watch', watchTasks);

    gulp.task('default', function(callback) {
        processArgs();
        return runSequence(['build', 'watch'], callback);
    });

    // starting sever & perform the default tasks
    gulp.task('s', function(callback){
        processArgs();
        return runSequence(['start-server', 'build', 'watch'], callback);
    });

    // start server with only zestweb assets
    gulp.task('only-gw', function(callback) {
        return runSequence(['start-server', 'build-guestweb-dev', 'copy-guestweb-base-html', 'watch-guestweb-files'], callback);
    });

    // start server with only zeststation assets
    gulp.task('only-zs', function(callback) {
        return runSequence(['build-zest-dev', 'copy-zest-base-html', 'watch-zest-files'], callback);
    });
}
