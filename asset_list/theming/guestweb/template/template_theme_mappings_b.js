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
                
        /**
            IMPORTANT: If the theme is using common non MGM templates,
            there is no need to add separately. It will load by default files in  'guestweb_common_templates'
            THE COMMENTED THEMES USING 'commonNonMgmTemplates' will be removed later  
            MOVING FORWARD WE DONT HAVE TO ADD TEMPLATE MAPPING FOR NON MGM COMMON THEMES
        **/

        return {
            // 'guestweb_consciousVondelpark': commonNonMgmTemplates,
            // 'guestweb_halcyon': commonNonMgmTemplates,
            // 'guestweb_chancellors_house': commonNonMgmTemplates,
            // 'guestweb_calvary_court': commonNonMgmTemplates,
            // 'guestweb_playa_largo': commonNonMgmTemplates,
            // 'guestweb_rivington': commonNonMgmTemplates,
            // 'guestweb_hewing': commonNonMgmTemplates,
            // 'guestweb_sombrero': commonNonMgmTemplates,
            // 'guestweb_beverly_hills': commonNonMgmTemplates,
            // 'guestweb_nativ': commonNonMgmTemplates,
            // 'guestweb_west_wing': commonNonMgmTemplates,
            // 'guestweb_estencia_la_jolla': commonNonMgmTemplates,
            // 'guestweb_el_castell': commonNonMgmTemplates,
            // 'guestweb_hotel_epik': commonNonMgmTemplates,
            'guestweb_fontainebleau_v2': [ 'guestweb/**/common_templates/partials/fontainebleau/checkin/**.html',
                'guestweb/**/common_templates/partials/fontainebleau/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/checkin/gwOfferAddonOptions.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],

            // 'guestweb_sandman_inn': commonNonMgmTemplates,
            // 'guestweb_nobu_miami': commonNonMgmTemplates,
            // 'guestweb_EdenRoc': commonNonMgmTemplates,
            'guestweb_national_harbor': [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
           //  'guestweb_freehand': commonNonMgmTemplates,
           //  'guestweb_dewberry': commonNonMgmTemplates,
           //  'guestweb_park_valkenburg': commonNonMgmTemplates,
           //  'guestweb_avenue': commonNonMgmTemplates,
           //  'guestweb_sohotel': commonNonMgmTemplates,
           //  'guestweb_hive': commonNonMgmTemplates,
           //  'guestweb_pod_dc': commonNonMgmTemplates,
           // 'guestweb_snt': commonNonMgmTemplates,
           //  'guestweb_snt_v2': commonNonMgmTemplates,
           //  'guestweb_silver_stone': commonNonMgmTemplates,
           //  'guestweb_koa_kea': commonNonMgmTemplates,
           //  'guestweb_hotel_chicago': commonNonMgmTemplates,
            'guestweb_public_ny': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                'guestweb/**/common_templates/partials/public_ny/gwLateCheckoutfinal.html',
                 'guestweb/**/common_templates/partials/public_ny/gwCheckin.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            // 'guestweb_Nobu_Ryokan_Malibu': commonNonMgmTemplates,
            // 'guestweb_ambrose': commonNonMgmTemplates,
            // 'guestweb_little_duke': commonNonMgmTemplates,
            // 'guestweb_basecamp_boulder': commonNonMgmTemplates,
            // 'guestweb_distrikt_nyc': commonNonMgmTemplates,
            // 'guestweb_stella_hotel': commonNonMgmTemplates,
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
            // 'guestweb_circle_fairfield': commonNonMgmTemplates,
            // 'guestweb_foundation_hotel_detroit': commonNonMgmTemplates,
            // 'guestweb_hotel_royal': commonNonMgmTemplates,
            // 'guestweb_orchard_garden_hotel': commonNonMgmTemplates,
            // 'guestweb_orchard_hotel': commonNonMgmTemplates,
            // 'guestweb_avenue_suites_georgetown': commonNonMgmTemplates,
            'guestweb_maidestone_hotel': [ 'guestweb/**/common_templates/partials/checkin/**.html',
                'guestweb/**/common_templates/partials/checkout/**.html',
                'guestweb/**/common_templates/partials/gwNoOption.html',
                checkoutNowPartials + '*.html',
                checkinPartials + '*.html',
                precheckinPartials + '*.html'],
            // 'guestweb_georgetown_inn': commonNonMgmTemplates,
   //          'guestweb_hotel_de_jonker': commonNonMgmTemplates,
   //          'guestweb_carillon_v2': commonNonMgmTemplates,
   //          'guestweb_cachet_boutique': commonNonMgmTemplates,
   //          'guestweb_hotel_berlaymont': commonNonMgmTemplates,
   //          'guestweb_el_cosmico': commonNonMgmTemplates,
   //          'guestweb_quintessence_resort': commonNonMgmTemplates,
   //          'guestweb_one_washington_circle': commonNonMgmTemplates,
   //          'guestweb_river_inn': commonNonMgmTemplates,
   //          'guestweb_first_hotel_breiseth': commonNonMgmTemplates,
   //          'guestweb_hotel_blackhawk': commonNonMgmTemplates,
   //          'guestweb_viceroy_chicago': commonNonMgmTemplates,
   //          'guestweb_hotel_alessandra': commonNonMgmTemplates,
   //          'guestweb_george_texas': commonNonMgmTemplates,
   //          'guestweb_eden_v2': commonNonMgmTemplates
        };
    }
};
