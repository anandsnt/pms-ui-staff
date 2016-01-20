//ZestStation CSS theme mapping file
module.exports = {
	getThemeMappingList : function () {
		var themeCSSRoot = 'zest_station/css/';
		return {
			'zoku' 			: [ themeCSSRoot + 'zoku.css.less'],
			'fontainbleau' 	: [ themeCSSRoot + 'fontainebleau.css.less']
		}
	}
}