//Guest web template theme file
module.exports = {
	getThemeMappingList : function () {
		var sharedPartials  		= 'guestweb/**/partials/',
			sharedCommonPartials 	= 'guestweb/**/partials/**.html',
			landingPartials  		= 'guestweb/**/landing/',
			sharedHtml  			= 'guestweb/**/shared/**/*.html';
		return {
			'row_nyc' 	:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'atura' 	:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'bellagio' 	:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'camby' 	:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'carillon' 	:[ sharedPartials + 'Carillon/*.html', landingPartials + 'Carillon/*.html', sharedHtml, sharedCommonPartials],
			'delano' 	:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'eden' 	 	:[ sharedPartials + 'Eden_resorts/*.html', landingPartials + 'Eden_resorts/*.html', sharedHtml, sharedCommonPartials],
			'envoy' 	:[ sharedPartials + 'Envoy/*.html', landingPartials + 'Envoy/*.html', sharedHtml, sharedCommonPartials],
			'fulton' 	:[ sharedPartials + 'Fulton/*.html', landingPartials + 'Fulton/*.html', sharedHtml, sharedCommonPartials],
			'galleria' 	:[ sharedPartials + 'Galleria/*.html', landingPartials + 'Galleria/*.html', sharedHtml, sharedCommonPartials],
			'huntley' 	:[ sharedPartials + 'Huntley/*.html', landingPartials + 'Huntley/*.html', sharedHtml, sharedCommonPartials],
			'mgm' 		:[ sharedPartials + 'MGM/*.html', landingPartials + 'MGM/*.html', sharedHtml, sharedCommonPartials],
			'montauk' 	:[ sharedPartials + 'Montauk/*.html', landingPartials + 'Montauk/*.html', sharedHtml, sharedCommonPartials],
			'nikko' 	:[ sharedPartials + 'Nikko/*.html', landingPartials + 'Nikko/*.html', sharedHtml, sharedCommonPartials],
			'palms' 	:[ sharedPartials + 'Palms_spa/*.html', landingPartials + 'Palms_spa/*.html', sharedHtml, sharedCommonPartials],
			'sanctuary' :[ sharedPartials + 'Sanctuary/*.html', landingPartials + 'Sanctuary/*.html', sharedHtml, sharedCommonPartials],
			'vdara' 	:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'yotel' 	:[ sharedPartials + 'Yotel/*.html', landingPartials + 'Yotel/*.html', sharedHtml, sharedCommonPartials],
			'zoku' 		:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'fontainebleau' 	:[ sharedPartials + 'Fontainebleau/*.html', landingPartials + 'Fontainebleau/*.html', sharedHtml, sharedCommonPartials],
			'great_wolf' 		:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'knickerbocker' 	:[ sharedPartials + 'Knickerbocker/*.html', landingPartials + 'Knickerbocker/*.html', sharedHtml, sharedCommonPartials],
			'mandalay_bay' 		:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'margaritaville' 	:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
		}
	}
}