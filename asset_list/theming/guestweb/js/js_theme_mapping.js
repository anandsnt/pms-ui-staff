// Guest web JS theme file
module.exports = {
    getThemeMappingList: function () {
        var themeJsRoot = 'guestweb/scripts/';
        var zestRootJS = 'guestweb/zest/**/*.js';
        
        /**
            IMPORTANT: If the theme is using common non MGM templates,
            there is no need to add separately. It will load by default files in 'guestweb_common_js_files'
            THE COMMENTED THEMES USING '[ themeJsRoot + 'app_router_common.js']' will be removed later
            MOVING FORWARD WE DONT HAVE TO ADD JS MAPPING FOR NON MGM COMMON THEMES  
        **/  
        return {
            //'guestweb_amrath_apart_hotel': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_hollywood_roosevelt': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_made': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_windsor_suites': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_moonrise': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_common_js_files': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_row': [ themeJsRoot + 'app_router_row_nyc.js'],
            // 'guestweb_atura': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_bellagio': [ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_bellagio.js'], // ---------------------- MGM CHAIN #- 1
            'guestweb_delano': [ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_delano.js'], // -------------------------- MGM CHAIN #- 2
            'guestweb_vdara': [ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_vdara.js'], // ---------------------------- MGM CHAIN #- 3
            'guestweb_mandalay_bay': [ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_mandalay_bay.js'],
            // 'guestweb_camby': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_carillon': [ themeJsRoot + 'app_router_carillon.js'],
            'guestweb_eden': [ themeJsRoot + 'app_router_eden_resorts.js'],
            'guestweb_envoy': [ themeJsRoot + 'app_router_envoy.js'],
            'guestweb_fulton': [ themeJsRoot + 'app_router_fulton.js'],
            'guestweb_galleria': [ themeJsRoot + 'app_router_galleria.js'],
            'guestweb_huntley': [ themeJsRoot + 'app_router_huntley.js'],
            'guestweb_mgm': [ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_aria.js'], // ------------------------------- MGM CHAIN #- 4
            'guestweb_aria_sky_suites': [ themeJsRoot + 'app_router_aria_sky_suites.js'], // ------------------------------- MGM CHAIN #- 13
            'guestweb_mgm_springfield': [ themeJsRoot + 'app_router_mgm_springfield.js'], // ------------------------------- MGM CHAIN #- 13
            'guestweb_montauk': [ themeJsRoot + 'app_router_montauk.js'],
            'guestweb_nikko': [ themeJsRoot + 'app_router_niko.js'],
            'guestweb_palms': [ themeJsRoot + 'app_router_palm_spa.js'],
            'guestweb_sanctuary': [ themeJsRoot + 'guestweb_router_santuary.js'],
            'guestweb_yotel': [ themeJsRoot + 'app_router_yotel.js', zestRootJS],
            'guestweb_zoku': [ themeJsRoot + 'app_router_zoku.js', zestRootJS],
            'guestweb_fontainebleau': [ themeJsRoot + 'app_router_fontainebleau.js'],
            'guestweb_great_wolf': [ themeJsRoot + 'app_router_great_wolf.js'],
            // 'guestweb_knickerbocker': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_margaritaville': [ themeJsRoot + 'app_router_margaritaville.js'],
            'guestweb': [ themeJsRoot + 'app_router_carlyle.js'],
            // 'guestweb_claridge': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_demo': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_balboa': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_excalibur': [themeJsRoot + 'app_router_excalibur.js'], // -------------------------------------------------------------- MGM CHAIN #- 5
            'guestweb_luxor': [themeJsRoot + 'app_router_luxor.js'],
            'guestweb_mgm_grand': [ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_mgm_grand.js'],
            'guestweb_signature_at_mgm': [ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_signature_at_mgm.js'], // ------ MGM CHAIN #- 6
            'guestweb_11Howard': [ themeJsRoot + 'app_router_11howard.js'],
            'guestweb_naples_grande': [ themeJsRoot + 'app_router_naples_grande.js'],
            // 'guestweb_terranea': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_time_hotel': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_porto_vista': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_chalet_view': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_crawford': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_dutch': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_beau_mont': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_hotel_ivrine': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_boston_park': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_beacon_hill': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_paradise_point': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_knickerbocker_yacht_club': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_kingsley': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_avery': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_newyork': [themeJsRoot + 'app_router_newyork.js'], // ------------------------------------------------------------------ MGM CHAIN #- 7
            'guestweb_mirage': [themeJsRoot + 'app_router_mirage.js'], // -------------------------------------------------------------------- MGM CHAIN #- 8
            // 'guestweb_valencia_san_antonio': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_lonestar_court_austin': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_ponchartrain': [themeJsRoot + 'app_router_ponchartrain.js'],
            // 'guestweb_valencia_santana_row': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_sorella_houston': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_monte_carlo': [ themeJsRoot + 'app_router_mgm_chain.js', themeJsRoot + 'app_router_monte_carlo.js'], // ---------------- MGM CHAIN #- 9
            // 'guestweb_sorella_kansas_city': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_Pasea': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_sobro': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_covington': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_consciousVondelpark': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_halcyon': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_chancellors_house': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_calvary_court': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_playa_largo': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_rivington': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_hewing': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_sombrero': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_beverly_hills': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_nativ': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_west_wing': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_estencia_la_jolla': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_el_castell': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_hotel_epik': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_avenue': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_fontainebleau_v2': [ themeJsRoot + 'app_router_fontainebleau_v2.js'],
            // 'guestweb_sandman_inn': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_nobu_miami': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_EdenRoc': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_national_harbor': [themeJsRoot + 'app_router_mgm_chain.js',
                themeJsRoot + 'app_router_national_harbor.js'], // MGM
            'guestweb_freehand': [ themeJsRoot + 'app_router_freehand.js'],
            // 'guestweb_dewberry': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_park_valkenburg': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_sohotel': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_hive': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_pod_dc': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_snt': [ themeJsRoot + 'app_router_new_common.js'],
            'guestweb_snt_v2': [ themeJsRoot + 'app_router_new_common.js'],
            // 'guestweb_silver_stone': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_koa_kea': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_hotel_chicago': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_public_ny': [ themeJsRoot + 'app_router_public_ny.js'],
            // 'guestweb_Nobu_Ryokan_Malibu': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_ambrose': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_little_duke': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_basecamp_boulder': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_distrikt_nyc': [ themeJsRoot + 'app_router_common.js'],
            // 'guestweb_stella_hotel': [ themeJsRoot + 'app_router_common.js'],
            'guestweb_beau_rivage': [ themeJsRoot + 'app_router_beau_rivage.js'], // --------------------------------------------------------- MGM CHAIN #- 10
            'guestweb_park_mgm': [ themeJsRoot + 'app_router_park_mgm.js'],
	        'guestweb_gold_strike': [ themeJsRoot + 'app_router_gold_strike.js'], // --------------------------------------------------------- MGM CHAIN #- 11
            'guestweb_historic_taos_inn': [ themeJsRoot + 'app_router_historic_taos_inn.js'],
            'guestweb_public_ny_v2': [ themeJsRoot + 'app_router_public_ny_v2.js'],
            'guestweb_mgm_grand_detroit': [ themeJsRoot + 'app_router_mgm_grand_detroit.js'], // ---------------------------------------------- MGM CHAIN #- 12
            'guestweb_arc_the_hotel': [ themeJsRoot + 'app_router_common.js'],
		    'guestweb_hotel_hiho': [ themeJsRoot + 'app_router_hotel_hiho.js'],
            'guestweb_ihg': [ themeJsRoot + 'app_router_ihg.js'],
            'guestweb_liason_dc': [ themeJsRoot + 'app_router_liason.js']
  //           'guestweb_circle_fairfield': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_foundation_hotel_detroit': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_hotel_royal': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_orchard_garden_hotel': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_orchard_hotel': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_avenue_suites_georgetown': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_georgetown_inn': [ themeJsRoot + 'app_router_common.js'],
		// 'guestweb_maidestone_hotel': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_hotel_de_jonker': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_carillon_v2': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_cachet_boutique': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_hotel_berlaymont': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_el_cosmico': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_quintessence_resort': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_river_inn': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_one_washington_circle': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_first_hotel_breiseth': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_hotel_blackhawk': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_viceroy_chicago': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_hotel_alessandra': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_george_texas': [ themeJsRoot + 'app_router_common.js'],
  //           'guestweb_eden_v2': [ themeJsRoot + 'app_router_common.js']
        };
    }
};
