module.exports = function(gulp, $, options) {
    gulp.task('inject_gtm_script_rover', function() {
        return gulp.src(options['ROVER_HTML_FILE']).
            pipe($.inject(gulp.src([options['ROVER_HTML_FILE']], {read: false}),
                {
                    starttag: '<!-- inject:gtm:head -->',
                    transform: function() {
                        return options.environment.gtmSnippet[0];
                    }
                })).
            pipe($.inject(gulp.src([options['ROVER_HTML_FILE']], {read: false}),
                {
                    starttag: '<!-- inject:gtm:body -->',
                    transform: function() {
                        return options.environment.gtmSnippet[1];
                    }
                })).
            pipe(gulp.dest(options['ROVER_TEMPLATE_ROOT'], {overwrite: true}));
    });
};
