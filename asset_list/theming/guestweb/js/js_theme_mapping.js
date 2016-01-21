//Guest web JS theme file
module.exports = {
	getThemeMappingList : function () {
		var themeJsRoot = 'guestweb/scripts/';
		return {
			'guestweb_row' 	: [ themeJsRoot + 'app_router_row_nyc.js'],
			'guestweb_atura' 	: [ themeJsRoot + 'app_router_atura.js'],
			'guestweb_bellagio' 	: [ themeJsRoot + 'app_router_mgm_chain.js' , themeJsRoot + 'app_router_bellagio.js'],
			'guestweb_delano' 	: [ themeJsRoot + 'app_router_mgm_chain.js' , themeJsRoot + 'app_router_delano.js'],
			'guestweb_vdara' 	: [ themeJsRoot + 'app_router_mgm_chain.js' , themeJsRoot + 'app_router_vdara.js'],
			'guestweb_mandalay_bay' 		: [ themeJsRoot + 'app_router_mgm_chain.js' , themeJsRoot + 'app_router_mandalay_bay.js'],
			'guestweb_camby' 	: [ themeJsRoot + 'app_router_common.js'],
			'guestweb_carillon' 	: [ themeJsRoot + 'app_router_carillon.js'],
			'guestweb_eden' 	 	: [ themeJsRoot + 'app_router_eden_resorts.js'],
			'guestweb_envoy' 	: [ themeJsRoot + 'app_router_envoy.js'],
			'guestweb_fulton' 	: [ themeJsRoot + 'app_router_fulton.js'],
			'guestweb_galleria' 	: [ themeJsRoot + 'app_router_galleria.js'],
			'guestweb_huntley' 	: [ themeJsRoot + 'app_router_huntley.js'],
			'guestweb_mgm' 		: [ themeJsRoot + 'app_router_mgm.js'],
			'guestweb_montauk' 	: [ themeJsRoot + 'app_router_montauk.js'],
			'guestweb_nikko' 	: [ themeJsRoot + 'app_router_niko.js'],
			'guestweb_palms' 	: [ themeJsRoot + 'app_router_palm_spa.js'],
			'guestweb_sanctuary' : [ themeJsRoot + 'guestweb_router_santuary.js'],		
			'guestweb_yotel' 	: [ themeJsRoot + 'app_router_yotel.js'],
			'guestweb_zoku' 		: [ themeJsRoot + 'app_router_zoku.js'],
			'guestweb_fontainebleau' 	: [ themeJsRoot + 'app_router_fontainebleau.js'],
			'guestweb_great_wolf' 		: [ themeJsRoot + 'app_router_common.js'],
			'guestweb_knickerbocker' 	: [ themeJsRoot + 'app_router_knickerbocker.js'],		
			'guestweb_margaritaville' 	: [ themeJsRoot + 'app_router_margaritaville.js'],
			'guestweb' 	: [ themeJsRoot + 'app_router.js'],
			'guestweb_galleria' 	: [ themeJsRoot + 'app_router_galleria.js']

		}
	}
}