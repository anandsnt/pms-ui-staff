module.exports = {
    getList : function() {
        var roverRoot = 'rover/',
            assets = {
                minifiedFiles: [
                    'shared/lib/js/redux/*.js'
                ],
                nonMinifiedFiles: [
                    roverRoot + "react/todo/**/*.js",
                    roverRoot + "controllers/Todo/**/*.js"
                ]
            };
        return assets;
    }
};