//Guest web template theme file
module.exports = {
	getThemeMappingList : function () {
		var sharedPartials  		= 'guestweb/**/partials/',
			sharedCommonPartials 	= 'guestweb/**/partials/**.html',
			landingPartials  		= 'guestweb/**/landing/',
			sharedHtml  			= 'guestweb/**/shared/**/*.html';
		return {
			'guestweb_row' 	:['guestweb/**/row/**.html', sharedHtml],
			'guestweb_atura' 	:['guestweb/**/atura/**.html', sharedHtml],
			'guestweb_camby' 	:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_carillon' 	:[ sharedPartials + 'Carillon/*.html', landingPartials + 'Carillon/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_bellagio' 	:[ 'guestweb/**/mgm_chain/**.html','guestweb/**/mgm_chain/Bellagio/**.html'],
			'guestweb_delano' 	:['guestweb/**/mgm_chain/**.html','guestweb/**/mgm_chain/Delano/**.html'],
			'guestweb_vdara' 	:[ 'guestweb/**/mgm_chain/**.html','guestweb/**/mgm_chain/Vdara/**.html'],
			'guestweb_mandalay_bay':[ 'guestweb/**/mgm_chain/**.html','guestweb/**/mgm_chain/MandalayBay/**.html'],
			'guestweb_eden' 	 	:[ sharedPartials + 'Eden_resorts/*.html', landingPartials + 'Eden_resorts/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_envoy' 	:[ sharedPartials + 'Envoy/*.html', landingPartials + 'Envoy/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_fulton' 	:[ sharedPartials + 'Fulton/*.html', landingPartials + 'Fulton/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_galleria' 	:[ sharedPartials + 'Galleria/*.html', landingPartials + 'Galleria/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_huntley' 	:[ sharedPartials + 'Huntley/*.html', landingPartials + 'Huntley/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_mgm' 		:[ sharedPartials + 'MGM/*.html', landingPartials + 'MGM/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_montauk' 	:[ sharedPartials + 'Montauk/*.html', landingPartials + 'Montauk/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_nikko' 	:[ sharedPartials + 'Nikko/*.html', landingPartials + 'Nikko/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_palms' 	:[ sharedPartials + 'Palms_spa/*.html', landingPartials + 'Palms_spa/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_sanctuary' :[ sharedPartials + 'Sanctuary/*.html', landingPartials + 'Sanctuary/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_yotel' 	:[ sharedPartials + 'Yotel/*.html', landingPartials + 'Yotel/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_zoku' 		:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_fontainebleau' 	:[ sharedPartials + 'Fontainebleau/*.html', landingPartials + 'Fontainebleau/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_great_wolf' 		:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_knickerbocker' 	:[ sharedPartials + 'Knickerbocker/*.html', landingPartials + 'Knickerbocker/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_margaritaville' 	:[ sharedPartials + 'Row_nyc/*.html', landingPartials + 'Row_nyc/*.html', sharedHtml, sharedCommonPartials]
		}
	}
}