//ZestStation CSS theme mapping file
module.exports = {
	getThemeMappingList: function() {
		var themeCSSRoot = 'zest_station/css/';
		return {
			'avenue': [themeCSSRoot + 'avenue.less'],
			'conscious': [themeCSSRoot + 'conscious.less'],
			'zoku': [themeCSSRoot + 'zoku.less'],
			'fontainebleau': [themeCSSRoot + 'fontainebleau.less'],
			'yotel': [themeCSSRoot + 'yotel.less'],
			'snt': [themeCSSRoot + 'snt.less']

		}
	}
}