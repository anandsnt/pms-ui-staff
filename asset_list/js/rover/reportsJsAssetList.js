module.exports = {
	getList : function() {
		var jsLibRoot 	= 'shared/lib/js/',
		roverRoot 		= 'rover/',
		reportReactViewRoot = roverRoot + 'react/reports/',
		diaryViewRoot = roverRoot + 'react/diary/',
		reportJsAssets 	= {
			minifiedFiles: [
				jsLibRoot + "react/react.min.js",
				jsLibRoot + "react/JSXTransformer.min.js",
				jsLibRoot + "react/react-with-addons.min.js",
				jsLibRoot + "react/react-dom.min.js",
				roverRoot + "directives/ngReact/ngReact.js"
			],
			nonMinifiedFiles: [
				diaryViewRoot + "util.js",
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