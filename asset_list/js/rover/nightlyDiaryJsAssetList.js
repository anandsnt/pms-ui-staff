module.exports = {
    getList : function() {
        var jsLibRoot   = 'shared/lib/js/',
        roverRoot       = 'rover/',
       // diaryViewRoot   = roverRoot + 'react/diary/',

        nightlyDiaryJsAssets   = {
            minifiedFiles: [],
            nonMinifiedFiles: [
                roverRoot + "services/nightlyDiary/*.js",
                roverRoot + "services/reservation/rvReservationBaseSearchSrv.js",
                roverRoot + "services/reservation/rvReservationSummarySrv.js",
                roverRoot + "controllers/nightlyDiary/**/*.js",
                roverRoot + 'redux/nightlyDiary/**/*.js',
                roverRoot + 'react/nightlyDiary/components/**/*.js',
                roverRoot + 'react/nightlyDiary/containers/**/*.js',
                roverRoot + 'react/nightlyDiary/**/**/*.js',

                // Eliminate all spec files
                '!**/*.spec.js'
            ]
        };

        return nightlyDiaryJsAssets;
    }
};
