module.exports = {
    getList : function() {
        var jsLibRoot 	    = 'shared/lib/js/',
            roverRoot 		= 'rover/',
            reactJsAssets 	= {
                minifiedFiles: [
                    jsLibRoot + "react/react.min.js",
                    jsLibRoot + "react/JSXTransformer.min.js",
                    jsLibRoot + "react/react-with-addons.min.js",
                    roverRoot + "directives/ngReact/ngReact.js"
                ],
                nonMinifiedFiles: []
            };
        return reactJsAssets;
    }
};