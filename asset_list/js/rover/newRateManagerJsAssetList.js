module.exports = {
  getList : function() {
    var roverRoot = 'rover/',
            assets = {
              minifiedFiles: [
              ],
              nonMinifiedFiles: [
                  roverRoot + 'react/rateManager/**/*.js',
                  roverRoot + 'constants/rateManager/**/*.js',
                  roverRoot + 'redux/rateManager/**/*.js',
                  roverRoot + 'constants/eventConstants/rvTwoMonthCalendarEventConstants.js',
                  roverRoot + 'constants/eventConstants/rvRateManagerEventConstants.js',
                  roverRoot + 'services/rateManager/**/*.js',
                  roverRoot + 'services/rateManager_/**/*.js',
                  roverRoot + 'controllers/rateManager_/**/*.js'
              ]
            };
    return assets;
  }
};
