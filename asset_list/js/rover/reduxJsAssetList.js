module.exports = {
    getList : function() {
        var reduxJsAssets 	= {
                minifiedFiles: [
                    'shared/lib/js/redux/redux.min.js',
                    'shared/lib/js/redux/react-redux.min.js',
                    'shared/lib/js/redux/redux-logger.min.js',
                    'shared/lib/js/redux/redux-thunk.min.js'
                ],
                nonMinifiedFiles: []
            };
        return reduxJsAssets;
    }
};