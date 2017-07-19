// Guest web template theme file
// as the old guestweb used popups triggered from controllers used the partials in
// old folders, we are forced to import some old folders
module.exports = {
    getThemeMappingList: function () {
        var landingPartials = 'guestweb/**/landing/';
        var checkinPartials = 'guestweb/**/checkin/partials/';
        var checkoutNowPartials = 'guestweb/**/checkoutnow/partials/';
        var checkoutNowlaterPartials = 'guestweb/**/checkoutlater/partials/';
        var precheckinPartials = 'guestweb/**/preCheckin/partials/';
        var sharedHtml = 'guestweb/**/shared/**/*.html';
        var zestHtml = 'guestweb/**/zest/partials/';
        var commonNonMgmTemplates = ['guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'];

        return {
            'guestweb_made': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                  'guestweb/**/common_templates/partials/checkout/**.html',
                  'guestweb/**/common_templates/partials/gwNoOption.html',
                  'guestweb/**/common_templates/partials/row_nyc/gwCheckinFinal.html',
                  checkoutNowPartials + '*.html',
                  checkinPartials + '*.html',
                  precheckinPartials + '*.html'],
            'guestweb_windsor_suites': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/row_nyc/gwCheckinFinal.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_moonrise': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                  'guestweb/**/common_templates/partials/checkout/**.html',
                  'guestweb/**/common_templates/partials/gwNoOption.html',
                  'guestweb/**/common_templates/partials/row_nyc/gwCheckinFinal.html',
                  checkoutNowPartials + '*.html',
                  checkinPartials + '*.html',
                  precheckinPartials + '*.html'],
            'guestweb_row': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/row_nyc/gwCheckinFinal.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_atura': commonNonMgmTemplates,
            'guestweb_camby': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_carillon': [landingPartials + 'Carillon/*.html',
                checkoutNowPartials + 'Carillon/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + '*.html',
                checkinPartials + 'Carillon/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Carillon/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_bellagio': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_delano': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_vdara': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_mandalay_bay': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_claridge': commonNonMgmTemplates,
            'guestweb_envoy': [landingPartials + 'Envoy/*.html',
                checkoutNowPartials + 'Envoy/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + '*.html',
                precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_eden': [landingPartials + 'Eden_resorts/*.html',
                checkoutNowPartials + 'Eden_resorts/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Eden_resorts/*.html',
                checkinPartials + 'Eden_resorts/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Eden/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_fulton': [landingPartials + 'Fulton/*.html',
                checkoutNowPartials + 'Fulton/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + '*.html',
                checkinPartials + 'Fulton/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Fulton/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_huntley': [landingPartials + 'Huntley/*.html',
                checkoutNowPartials + 'Huntley/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Huntley/*.html',
                checkinPartials + 'Huntley/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Huntley/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_mgm': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_montauk': [landingPartials + 'Montauk/*.html',
                checkoutNowPartials + 'Montauk/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Montauk/*.html',
                checkinPartials + 'Montauk/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Montauk/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_nikko': [landingPartials + 'Nikko/*.html',
                checkoutNowPartials + 'Nikko/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Nikko/*.html',
                checkinPartials + 'Nikko/*.html', checkinPartials + '*.html',
                precheckinPartials + 'NIKKO/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_palms': [landingPartials + 'Palms_spa/*.html',
                checkoutNowPartials + 'Palms_spa/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Palms_spa/*.html',
                checkinPartials + 'Palms_spa/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Palms_spa/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_sanctuary': [landingPartials + 'Sanctuary/*.html',
                checkoutNowPartials + 'Sanctuary/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Sanctuary/*.html',
                checkinPartials + 'Sanctuary/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Sanctuary/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_yotel': [landingPartials + 'Yotel/*.html',
                checkoutNowPartials + 'Yotel/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Yotel/*.html',
                checkinPartials + '*.html', precheckinPartials + '*.html',
                zestHtml + '/yotel/*html',
                sharedHtml],
            'guestweb_zoku': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/zoku/*.html',
                'guestweb/**/zest/partials/**/*.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_fontainebleau': [landingPartials + 'Fontainebleau/*.html',
                checkoutNowPartials + 'Fontainebleau/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Fontainebleau/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_great_wolf': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/greatWolf/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_knickerbocker': commonNonMgmTemplates,
            'guestweb_margaritaville': [landingPartials + 'common/*.html',
                checkoutNowPartials + 'common/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'common/*.html',
                checkinPartials + 'common/*.html', checkinPartials + '*.html',
                precheckinPartials + 'common/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb': [landingPartials + '/*.html',
                checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Montauk/*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_galleria': [landingPartials + 'Galleria/*.html',
                checkoutNowPartials + 'Galleria/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Galleria/*.html',
                checkinPartials + 'Galleria/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Galleria/*.html', precheckinPartials + '*.html',
                sharedHtml],
            'guestweb_demo': commonNonMgmTemplates,
            'guestweb_balboa': commonNonMgmTemplates,
            'guestweb_luxor': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_mgm_grand': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],

            'guestweb_signature_at_mgm': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_11Howard': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/11Howard/gwPreCheckinFinal.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_excalibur': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_terranea': commonNonMgmTemplates,

            'guestweb_naples_grande': commonNonMgmTemplates,
            'guestweb_time_hotel': commonNonMgmTemplates,
            'guestweb_porto_vista': commonNonMgmTemplates,
            'guestweb_chalet_view': commonNonMgmTemplates,
            'guestweb_crawford': commonNonMgmTemplates,
            'guestweb_dutch': commonNonMgmTemplates,
            'guestweb_beau_mont': commonNonMgmTemplates,
            'guestweb_hotel_ivrine': commonNonMgmTemplates,
            'guestweb_boston_park': commonNonMgmTemplates,
            'guestweb_beacon_hill': commonNonMgmTemplates,
            'guestweb_sorella_houston': commonNonMgmTemplates,
            'guestweb_paradise_point': commonNonMgmTemplates,
            'guestweb_knickerbocker_yacht_club': commonNonMgmTemplates,
            'guestweb_kingsley': commonNonMgmTemplates,
            'guestweb_avery': commonNonMgmTemplates,
            'guestweb_newyork': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_mirage': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_ponchartrain': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/ponchartrain/gwCheckoutfinal.html',
                'guestweb/**/common_templates/partials/ponchartrain/gwLateCheckoutfinal.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_valencia_santana_row': commonNonMgmTemplates,
            'guestweb_monte_carlo': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_sorella_kansas_city': commonNonMgmTemplates,
            'guestweb_valencia_san_antonio': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_lonestar_court_austin': commonNonMgmTemplates,
            'guestweb_Pasea': commonNonMgmTemplates,
            'guestweb_sobro': commonNonMgmTemplates,
            'guestweb_covington': commonNonMgmTemplates,
            'guestweb_consciousVondelpark': commonNonMgmTemplates,
            'guestweb_halcyon': commonNonMgmTemplates,
            'guestweb_chancellors_house': commonNonMgmTemplates,
            'guestweb_calvary_court': commonNonMgmTemplates,
            'guestweb_playa_largo': commonNonMgmTemplates,
            'guestweb_rivington': commonNonMgmTemplates,
            'guestweb_hewing': commonNonMgmTemplates,
            'guestweb_sombrero': commonNonMgmTemplates,
            'guestweb_beverly_hills': commonNonMgmTemplates,
            'guestweb_nativ': commonNonMgmTemplates,
            'guestweb_west_wing': commonNonMgmTemplates,
            'guestweb_estencia_la_jolla': commonNonMgmTemplates,
            'guestweb_el_castell': commonNonMgmTemplates,
            'guestweb_hotel_epik': commonNonMgmTemplates,
            'guestweb_fontainebleau_v2': [ 'guestweb/**/common_templates/partials/fontainebleau/checkin/**.html',
                'guestweb/**/common_templates/partials/fontainebleau/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/checkin/gwOfferAddonOptions.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],

            'guestweb_sandman_inn': commonNonMgmTemplates,
            'guestweb_nobu_miami': commonNonMgmTemplates,
            'guestweb_EdenRoc': commonNonMgmTemplates,
            'guestweb_national_harbor': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_freehand': commonNonMgmTemplates,
            'guestweb_dewberry': commonNonMgmTemplates,
            'guestweb_park_valkenburg': commonNonMgmTemplates,
            'guestweb_avenue': commonNonMgmTemplates,
            'guestweb_sohotel': commonNonMgmTemplates,
            'guestweb_hive': commonNonMgmTemplates,
            'guestweb_pod_dc': commonNonMgmTemplates,
           'guestweb_snt': commonNonMgmTemplates,
            'guestweb_snt_v2': commonNonMgmTemplates,
            'guestweb_silver_stone': commonNonMgmTemplates,
            'guestweb_koa_kea': commonNonMgmTemplates,
            'guestweb_hotel_chicago': commonNonMgmTemplates,
            'guestweb_public_ny': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/public_ny/gwLateCheckoutfinal.html',
                 'guestweb/**/common_templates/partials/public_ny/gwCheckin.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_Nobu_Ryokan_Malibu': commonNonMgmTemplates,
            'guestweb_ambrose': commonNonMgmTemplates,
            'guestweb_little_duke': commonNonMgmTemplates,
            'guestweb_basecamp_boulder': commonNonMgmTemplates,
            'guestweb_distrikt_nyc': commonNonMgmTemplates,
            'guestweb_stella_hotel': commonNonMgmTemplates,
            'guestweb_beau_rivage': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_gold_strike': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_historic_taos_inn': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/historic_taos_inn/**.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_public_ny_v2': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/public_ny_v2/**.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_mgm_grand_detroit': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_hotel_hiho': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/hotel_hiho/**.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_circle_fairfield': commonNonMgmTemplates,
            'guestweb_foundation_hotel_detroit': commonNonMgmTemplates,
            'guestweb_hotel_royal': commonNonMgmTemplates,
            'guestweb_orchard_garden_hotel': commonNonMgmTemplates,
            'guestweb_orchard_hotel': commonNonMgmTemplates,
            'guestweb_avenue_suites_georgetown': commonNonMgmTemplates,
            'guestweb_maidestone_hotel': [ 'guestweb/**/common_templates/partials/checkin/**.html',
				'guestweb/**/common_templates/partials/checkout/**.html',
				'guestweb/**/common_templates/partials/gwNoOption.html',
				checkoutNowPartials + '*.html',
				checkinPartials + '*.html',
				precheckinPartials + '*.html'],
			'guestweb_georgetown_inn': commonNonMgmTemplates,
            'guestweb_hotel_de_jonker': commonNonMgmTemplates,
            'guestweb_carillon_v2': commonNonMgmTemplates,
            'guestweb_cachet_boutique': commonNonMgmTemplates,
            'guestweb_hotel_berlaymont': commonNonMgmTemplates,
            'guestweb_el_cosmico': commonNonMgmTemplates,
            'guestweb_quintessence_resort': commonNonMgmTemplates,
            'guestweb_one_washington_circle': commonNonMgmTemplates,
            'guestweb_river_inn': commonNonMgmTemplates
        };
    }
};
