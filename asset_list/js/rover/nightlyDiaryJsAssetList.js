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
                roverRoot + 'react/nightlyDiary/**/**/*.js',
                //please dont change the order
                // diaryViewRoot + "util.js",
                // diaryViewRoot + "diary-unassgined-room-panel.js",
                // diaryViewRoot + "diary-toggle.js",
                // diaryViewRoot + "diary-grid-row-inactive-rooms.js",
                // diaryViewRoot + "diary-toggle-panel.js",
                // diaryViewRoot + "diary-grid-row-item-drag.js",
                // diaryViewRoot + "diary-grid-row-item.js",
                // diaryViewRoot + "diary-grid-row.js",
                // diaryViewRoot + "diary-room.js",
                // diaryViewRoot + "diary-rooms.js",
                // diaryViewRoot + "diary-room-panel.js",
                // diaryViewRoot + "diary-grid.js",
                // diaryViewRoot + "diary-timeline-resize-grip.js",
                // diaryViewRoot + "diary-timeline-resize.js",
                // diaryViewRoot + "diary-timeline-occupancy.js",
                // diaryViewRoot + "diary-timeline.js",
                // diaryViewRoot + "diary-timeline-panel.js",
                // diaryViewRoot + "diary-grid-panel.js",
                // diaryViewRoot + "diary-content.js"
            ]
        };

        return nightlyDiaryJsAssets;
    }
};