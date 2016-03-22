module.exports = {
    getList : function() {
        var reactLibRoot 	= 'shared/lib/js/react/',
            roverRoot 		= 'rover/',
            reactJsAssets 	= {
                minifiedFiles: [
                    reactLibRoot + "react.min.js",
                    reactLibRoot + "JSXTransformer.min.js",
                    reactLibRoot + "react-with-addons.min.js",
                    reactLibRoot + "react-dom.min.js",
                    reactLibRoot + "react-fastclick.js",
                    
                    roverRoot + "directives/ngReact/ngReact.js"
                ],
                nonMinifiedFiles: []
            };
        return reactJsAssets;
    }
};