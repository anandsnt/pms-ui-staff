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
                'copy-workers'
            ]);

            var compilationTasks = [
                    'rover-asset-prod-precompile',
                    'login-asset-prod-precompile',
                    'station-login-asset-prod-precompile',
                    'payment-asset-prod-precompile',
                    'copy-workers'
                ],

        tasksAfterCompilation = [
                    'rover-inject-assets-to-templates',
                    'login-inject-assets-to-templates', 
                    'station-login-inject-assets-to-templates',
                    'copy-cordova-assets'
                ],

        copyBaseHtmlToPublicAssets = [
                    'copy-login-base-html',
                    'copy-station-login-base-html',
                    'copy-rover-base-html',
                    'compress-images-loselessly'
                ],

        developmentTasks = [
                    'build-rover-dev', 
                    'build-login-dev',
                    'build-station-login-dev',
                    'build-payment-dev',
                    'copy-cordova-assets'
                ],

        watchTasks = [
                    'watch-rover-files', 
                    'watch-login-files',
                    'watch-station-login-files',
                    'watch-payment-files',
                    'watch-workers'
                ];

    var processArgs = function() {
        var argv = require('yargs').argv;

        if (argv['prod'] || argv['production']) {
            process.env.BUILD_ENV = 'prod';
        } else if (argv['env']) {
            process.env.BUILD_ENV = argv['env'];
        }

        // Inject gtm tags only if option is provided
        if (argv['gtm'] && (argv['env'] === 'prod' || argv['env'] === 'prod-eu' || argv['env'] === 'dev')) {
            // in case of asset-precompile
            compilationTasks.push('inject_gtm_script_rover');
            // in case of building in dev environment w/o concatenation
            developmentTasks.push('inject_gtm_script_rover');
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
        const destination = file.replace(/\/pms-ui-staff\//ig, '/pms-ui-staff/dist/');

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

    gulp.task('asset-precompile', function(callback) {
        processArgs();
        setEnvironment();
        return runSequence(compilationTasks, tasksAfterCompilation, copyBaseHtmlToPublicAssets, callback);
    });

    gulp.task('watch', watchTasks);

    gulp.task('default', function(callback) {
        processArgs();
        return runSequence(['build', 'watch'], callback);
    });
}
