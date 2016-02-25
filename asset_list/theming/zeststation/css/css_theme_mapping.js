//ZestStation CSS theme mapping file
module.exports = {
	getThemeMappingList : function () {
		var themeCSSRoot = 'zest_station/css/';
		return {
			'zoku' 			: [ themeCSSRoot + 'zoku.less'],
			'fontainebleau' : [ themeCSSRoot + 'fontainebleau.less'],
			'snt' : [ themeCSSRoot + 'snt.less']
		}
	}
}