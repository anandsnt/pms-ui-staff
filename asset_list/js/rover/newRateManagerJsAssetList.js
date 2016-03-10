module.exports = {
    getList : function() {
        var roverRoot = 'rover/',
            assets = {
                minifiedFiles: [],
                nonMinifiedFiles: [
                    roverRoot + "react/todo/**/*.js",
                    roverRoot + "redux/todo/**/*.js",
                    roverRoot + "controllers/rateManager_/**/*.js"
                ]
            };
        return assets;
    }
};