//ZestStation CSS theme mapping file
module.exports = {
	getThemeMappingList: function() {
		var themeCSSRoot = 'zest_station/css/';
		return {
			'avenue': [themeCSSRoot + 'avenue.less'],
			'sohotel': [themeCSSRoot + 'sohotel.less'],
			'conscious': [themeCSSRoot + 'conscious.less'],
			'zoku': [themeCSSRoot + 'zoku.less'],
			'fontainebleau': [themeCSSRoot + 'fontainebleau.less'],
			'yotel': [themeCSSRoot + 'yotel.less'],
			'epik': [themeCSSRoot + 'epik.less'],
			'public': [themeCSSRoot + 'public.less'],
			'snt': [themeCSSRoot + 'snt.less']

		}
	}
}