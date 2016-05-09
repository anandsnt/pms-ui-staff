module.exports = {
  getList : function() {
    var roverRoot = 'rover/',
            assets = {
              minifiedFiles: [
              ],
              nonMinifiedFiles: [
                  roverRoot + 'react/rateManager/components/**/*.js',
                  roverRoot + 'react/rateManager/containers/**/*.js',
                  roverRoot + 'react/rateManager/utils/**/*.js',
                  roverRoot + 'constants/rateManager/**/*.js',
                  roverRoot + 'redux/rateManager/**/*.js',
                  roverRoot + 'constants/eventConstants/rvTwoMonthCalendarEventConstants.js',
                  roverRoot + 'constants/eventConstants/rvRateManagerEventConstants.js',
                  roverRoot + 'services/rateManager/**/*.js',
                  roverRoot + 'services/rateManager_/**/*.js',
                  roverRoot + 'controllers/rateManager_/**/*.js',
                  roverRoot + "react/diary/util.js"
              ]
            };
    return assets;
  }
};
