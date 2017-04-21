module.exports = {
	getList : function() {
		var controllerRoot 	= 'rover/controllers/',
			servicesRoot 	= 'rover/services/',
			sharedJs 		= 'shared/lib/js/',
			assetsForView 	= {
				minifiedFiles: [
				],
				nonMinifiedFiles: [
					controllerRoot + "roomAssignment/**/*.js",
					controllerRoot + "upgrades/**/*.js",
					servicesRoot + "roomAssignment/**/*.js",
					servicesRoot + "nightlyDiary/**/*.js"
				]
		};
		return assetsForView;
	}
};