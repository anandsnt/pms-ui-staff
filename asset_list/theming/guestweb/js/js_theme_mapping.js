//Guest web JS theme file
module.exports = {
	getThemeMappingList : function () {
		var themeJsRoot = 'guestweb/scripts/';
		var zestRootJS    = 'guestweb/zest/**/*.js'
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
			'guestweb_mgm' 		: [ themeJsRoot + 'app_router_mgm_chain.js' , themeJsRoot + 'app_router_aria.js'],
			'guestweb_montauk' 	: [ themeJsRoot + 'app_router_montauk.js'],
			'guestweb_nikko' 	: [ themeJsRoot + 'app_router_niko.js'],
			'guestweb_palms' 	: [ themeJsRoot + 'app_router_palm_spa.js'],
			'guestweb_sanctuary' : [ themeJsRoot + 'guestweb_router_santuary.js'],
			'guestweb_yotel' 	: [ themeJsRoot + 'app_router_yotel.js',zestRootJS],
			'guestweb_zoku' 		: [ themeJsRoot + 'app_router_zoku.js',zestRootJS],
			'guestweb_fontainebleau' 	: [ themeJsRoot + 'app_router_fontainebleau.js'],
			'guestweb_great_wolf' 		: [ themeJsRoot + 'app_router_great_wolf.js'],
			'guestweb_knickerbocker' 	: [ themeJsRoot + 'app_router_common.js'],
			'guestweb_margaritaville' 	: [ themeJsRoot + 'app_router_margaritaville.js'],
			'guestweb' 	: [ themeJsRoot + 'app_router_carlyle.js'],
			'guestweb_galleria' 	: [ themeJsRoot + 'app_router_galleria.js'],
			'guestweb_claridge' :[ themeJsRoot + 'app_router_common.js'],
			'guestweb_demo' 		: [ themeJsRoot + 'app_router_common.js'],
			'guestweb_balboa':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_excalibur':[themeJsRoot + 'app_router_excalibur.js'],
			'guestweb_luxor':[themeJsRoot + 'app_router_luxor.js'],
			'guestweb_mgm_grand':[ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_mgm_grand.js'],
			'guestweb_signature_at_mgm':[ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_signature_at_mgm.js'],
			'guestweb_11Howard':[ themeJsRoot + 'app_router_11howard.js'],
			'guestweb_naples_grande':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_terranea':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_time_hotel':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_porto_vista':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_chalet_view':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_crawford':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_dutch':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_beau_mont':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_hotel_ivrine':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_boston_park':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_beacon_hill':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_paradise_point':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_knickerbocker_yacht_club':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_kingsley':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_avery':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_newyork':[themeJsRoot + 'app_router_newyork.js'],
			'guestweb_mirage': [themeJsRoot + 'app_router_mirage.js'],
			'guestweb_valencia_san_antonio':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_lonestar_court_austin':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_ponchartrain':[themeJsRoot + 'app_router_ponchartrain.js'],
			'guestweb_valencia_santana_row':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_sorella_houston':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_monte_carlo': [ themeJsRoot + 'app_router_mgm_chain.js',themeJsRoot + 'app_router_monte_carlo.js'],
			'guestweb_sorella_kansas_city':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_Pasea':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_sobro':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_covington':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_consciousVondelpark':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_halcyon':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_chancellors_house':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_calvary_court':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_playa_largo':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_rivington':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_hewing':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_sombrero':[ themeJsRoot + 'app_router_common.js'],
			'guestweb_beverly_hills':[ themeJsRoot + 'app_router_common.js']
		}
	}
}
