module.exports = {
	getList : function() {
		var jsLibRoot 	= 'shared/lib/js/',
		roverRoot 		= 'rover/',
		reportReactViewRoot = roverRoot + 'react/reports/',
		reportJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + "date.js",
				jsLibRoot + "react/react.min.js",
				jsLibRoot + "react/JSXTransformer.min.js",
				jsLibRoot + "react/react-with-addons.min.js",
				roverRoot + "directives/ngReact/ngReact.js"
			],
			nonMinifiedFiles: [
				jsLibRoot + "Utils.js",
				roverRoot + "services/reports/**/*.js",
				roverRoot + "factories/reports/**/*.js",
				roverRoot + "constants/reports/**/*.js",
				roverRoot + "controllers/reports/**/*.js",
				reportReactViewRoot + "**/*.js"
			]
		};
		return reportJsAssets;
	}
};