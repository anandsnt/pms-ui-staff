module.exports = {
    getList : function() {
        var roverRoot = 'rover/',
            assets = {
                minifiedFiles: [],
                nonMinifiedFiles: [
                    roverRoot + "react/todo/**/*.js",
                    roverRoot + "redux/todo/**/*.js",
                    roverRoot + "constants/rateManager/**/*.js",
                    roverRoot + "services/rateManager/**/*.js",
                    roverRoot + "controllers/rateManager_/**/*.js"
                ]
            };
        return assets;
    }
};