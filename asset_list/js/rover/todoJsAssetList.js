module.exports = {
    getList : function() {
        var roverRoot = 'rover/',
            assets = {
                minifiedFiles: [],
                nonMinifiedFiles: [
                    roverRoot + "redux/todo/**/*.js",
                    roverRoot + "react/todo/**/*.js",
                    roverRoot + "controllers/Todo/**/*.js",

                    // Eliminate all spec files
                    '!**/*.spec.js'
                ]
            };
        return assets;
    }
};
