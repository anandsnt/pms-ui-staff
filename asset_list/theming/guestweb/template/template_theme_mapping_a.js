// Guest web template theme file
// as the old guestweb used popups triggered from controllers used the partials in
// old folders, we are forced to import some old folders

// This list was cleaned up wrt CICO-56896; Please refer the ticket to view the removed list

module.exports = {
    getThemeMappingList: function () {
        var landingPartials = 'guestweb/**/landing/';
        var checkinPartials = 'guestweb/**/checkin/partials/';
        var checkoutNowPartials = 'guestweb/**/checkoutnow/partials/';
        var checkoutNowlaterPartials = 'guestweb/**/checkoutlater/partials/';
        var precheckinPartials = 'guestweb/**/preCheckin/partials/';
        var sharedHtml = 'guestweb/**/shared/**/*.html';
        var zestHtml = 'guestweb/**/zest/partials/';
        var commonNonMgmTemplates = ['guestweb/**/common_templates/partials/checkin/**/*.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'];
        /**
            IMPORTANT: If the theme is using common non MGM templates,
            there is no need to add separately. It will load by default files in  'guestweb_common_templates'
            THE COMMENTED THEMES USING 'commonNonMgmTemplates' will be removed later  
            MOVING FORWARD WE DONT HAVE TO ADD TEMPLATE MAPPING FOR NON MGM COMMON THEMES
        **/
        return {
            //'guestweb_hollywood_roosevelt': commonNonMgmTemplates,
            //'guestweb_made':  commonNonMgmTemplates,
            'guestweb_common_templates': commonNonMgmTemplates,
            // 'guestweb_made':  commonNonMgmTemplates,
            'guestweb_windsor_suites': [ 'guestweb/**/common_templates/partials/checkin/**.html',
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
            // 'guestweb_atura': commonNonMgmTemplates,
            'guestweb_camby': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
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
            // 'guestweb_claridge': commonNonMgmTemplates,
            'guestweb_eden': [landingPartials + 'Eden_resorts/*.html',
                checkoutNowPartials + 'Eden_resorts/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Eden_resorts/*.html',
                checkinPartials + 'Eden_resorts/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Eden/*.html', precheckinPartials + '*.html',
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
            'guestweb_aria_sky_suites': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_mgm_springfield': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_palms': [landingPartials + 'Palms_spa/*.html',
                checkoutNowPartials + 'Palms_spa/*.html', checkoutNowPartials + '*.html',
                checkoutNowlaterPartials + 'Palms_spa/*.html',
                checkinPartials + 'Palms_spa/*.html', checkinPartials + '*.html',
                precheckinPartials + 'Palms_spa/*.html', precheckinPartials + '*.html',
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
            // 'guestweb_knickerbocker': commonNonMgmTemplates,
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
            // 'guestweb_demo': commonNonMgmTemplates,
            // 'guestweb_balboa': commonNonMgmTemplates,
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
            // 'guestweb_terranea': commonNonMgmTemplates,

            // 'guestweb_naples_grande': commonNonMgmTemplates,
            // 'guestweb_time_hotel': commonNonMgmTemplates,
            // 'guestweb_porto_vista': commonNonMgmTemplates,
            // 'guestweb_chalet_view': commonNonMgmTemplates,
            // 'guestweb_crawford': commonNonMgmTemplates,
            // 'guestweb_dutch': commonNonMgmTemplates,
            // 'guestweb_beau_mont': commonNonMgmTemplates,
            // 'guestweb_hotel_ivrine': commonNonMgmTemplates,
            // 'guestweb_boston_park': commonNonMgmTemplates,
            // 'guestweb_beacon_hill': commonNonMgmTemplates,
            // 'guestweb_sorella_houston': commonNonMgmTemplates,
            // 'guestweb_paradise_point': commonNonMgmTemplates,
            // 'guestweb_knickerbocker_yacht_club': commonNonMgmTemplates,
            // 'guestweb_kingsley': commonNonMgmTemplates,
            // 'guestweb_avery': commonNonMgmTemplates,
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
            // 'guestweb_valencia_santana_row': commonNonMgmTemplates,
            'guestweb_monte_carlo': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            // 'guestweb_sorella_kansas_city': commonNonMgmTemplates,
            'guestweb_valencia_san_antonio': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            'guestweb_park_mgm': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            // 'guestweb_lonestar_court_austin': commonNonMgmTemplates,
            // 'guestweb_Pasea': commonNonMgmTemplates,
            // 'guestweb_sobro': commonNonMgmTemplates,
            // 'guestweb_covington': commonNonMgmTemplates,
            'guestweb_ihg': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/IHG/**.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
        };
    }
};
