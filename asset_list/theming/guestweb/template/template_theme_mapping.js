//Guest web template theme file
// as the old guestweb used popups triggered from controllers used the partials in
// old folders, we are forced to import some old folders
module.exports = {
	getThemeMappingList : function () {
		var sharedPartials  		 = 'guestweb/**/partials/',
			sharedCommonPartials 	 = 'guestweb/**/partials/**.html',
			landingPartials  		 = 'guestweb/**/landing/',
			checkinPartials      	 = 'guestweb/**/checkin/partials/',
			checkoutNowPartials      = 'guestweb/**/checkoutnow/partials/',
			checkoutNowlaterPartials = 'guestweb/**/checkoutlater/partials/',
			precheckinPartials  	 = 'guestweb/**/preCheckin/partials/',
			sharedHtml  			 = 'guestweb/**/shared/**/*.html',
			zestHtml				 = 'guestweb/**/zest/partials/';
		return {
			'guestweb_row' 			:[landingPartials + 'Row_nyc/*.html',
										  checkoutNowPartials+'Row_nyc/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'*.html',checkoutNowlaterPartials+'Row_nyc/*.html',
										  checkinPartials+'Row_nyc/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Row_nyc/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_atura' 	    :[landingPartials + 'common-black/*.html',
										  checkoutNowPartials+'common-black/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'*.html',
										  checkinPartials+'common-black/*.html',checkinPartials+"*.html",
										  precheckinPartials+'common-black/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_camby' 		:[ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'
										],
			'guestweb_carillon' 	:[landingPartials + 'Carillon/*.html',
										  checkoutNowPartials+'Carillon/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'*.html',
										  checkinPartials+'Carillon/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Carillon/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_bellagio' 	:[ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_delano' 		:[ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_vdara' 		:[ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_mandalay_bay'	:[ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_claridge'		:[ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_envoy' 	 	:[landingPartials + 'Envoy/*.html',
										  checkoutNowPartials+'Envoy/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'*.html',
										  precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_eden' 		:[landingPartials + 'Eden_resorts/*.html',
										  checkoutNowPartials+'Eden_resorts/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Eden_resorts/*.html',
										  checkinPartials+'Eden_resorts/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Eden/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_fulton' 		:[landingPartials + 'Fulton/*.html',
										  checkoutNowPartials+'Fulton/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'*.html',
										  checkinPartials+'Fulton/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Fulton/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_huntley' 		:[landingPartials + 'Huntley/*.html',
										  checkoutNowPartials+'Huntley/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Huntley/*.html',
										  checkinPartials+'Huntley/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Huntley/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_mgm' 			:[ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_montauk' 		:[landingPartials + 'Montauk/*.html',
										  checkoutNowPartials+'Montauk/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Montauk/*.html',
										  checkinPartials+'Montauk/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Montauk/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_nikko' 		:[landingPartials + 'Nikko/*.html',
										  checkoutNowPartials+'Nikko/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Nikko/*.html',
										  checkinPartials+'Nikko/*.html',checkinPartials+"*.html",
										  precheckinPartials+'NIKKO/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_palms' 		:[landingPartials + 'Palms_spa/*.html',
										  checkoutNowPartials+'Palms_spa/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Palms_spa/*.html',
										  checkinPartials+'Palms_spa/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Palms_spa/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_sanctuary' 	:[landingPartials + 'Sanctuary/*.html',
										  checkoutNowPartials+'Sanctuary/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Sanctuary/*.html',
										  checkinPartials+'Sanctuary/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Sanctuary/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_yotel' 		:[landingPartials + 'Yotel/*.html',
										  checkoutNowPartials+'Yotel/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Yotel/*.html',
										  checkinPartials+"*.html",precheckinPartials+'*.html',
										  zestHtml+"/yotel/*html",
										  sharedHtml],
			'guestweb_zoku' 		: [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										'guestweb/**/common_templates/partials/zoku/*.html',
										'guestweb/**/zest/partials/**/*.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_fontainebleau':[landingPartials + 'Fontainebleau/*.html',
										  checkoutNowPartials+'Fontainebleau/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Fontainebleau/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_great_wolf' 	:[ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_knickerbocker':[landingPartials + 'Knickerbocker/*.html',
										  checkoutNowPartials+'Knickerbocker/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Knickerbocker/*.html',
										  checkinPartials+'Knickerbocker/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Knickerbocker/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_margaritaville':[landingPartials + 'common/*.html',
										  checkoutNowPartials+'common/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'common/*.html',
										  checkinPartials+'common/*.html',checkinPartials+"*.html",
										  precheckinPartials+'common/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb' 				:[landingPartials + '/*.html',
										  checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Montauk/*.html',
										  checkinPartials+"*.html",
										  precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_galleria' 	:[landingPartials + 'Galleria/*.html',
										  checkoutNowPartials+'Galleria/*.html',checkoutNowPartials+'*.html',
										  checkoutNowlaterPartials+'Galleria/*.html',
										  checkinPartials+'Galleria/*.html',checkinPartials+"*.html",
										  precheckinPartials+'Galleria/*.html', precheckinPartials+'*.html',
										  sharedHtml],
			'guestweb_demo' 		:[ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_balboa'		:[ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_luxor'		: [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_mgm_grand'		: [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],

			'guestweb_signature_at_mgm'	: [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_11Howard'		: [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										'guestweb/**/common_templates/partials/11Howard/gwPreCheckinFinal.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_excalibur'		: [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_terranea'		: [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],

			'guestweb_naples_grande'		:[ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_time_hotel'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_porto_vista'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_chalet_view'		:[ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_crawford'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_dutch'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_beau_mont'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_hotel_ivrine'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_boston_park'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_beacon_hill'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_sorella_houston'	: [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_paradise_point'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_knickerbocker_yacht_club'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_kingsley'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_avery'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_newyork'		 : [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
            'guestweb_mirage'		: [ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_ponchartrain'	: [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										'guestweb/**/common_templates/partials/ponchartrain/gwCheckoutfinal.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
                                        precheckinPartials+'*.html'],
			'guestweb_valencia_santana_row'	: [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_monte_carlo' 	:[ 'guestweb/**/common_templates/partials/MGM/**/*.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_sorella_kansas_city' : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_valencia_san_antonio'	: [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_lonestar_court_austin' : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_Pasea'	 		:[ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_sobro'		 :[ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
			'guestweb_covington'		 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html'],
		'guestweb_consciousVondelpark'	 : [ 'guestweb/**/common_templates/partials/checkin/**.html',
										'guestweb/**/common_templates/partials/checkout/**.html',
										'guestweb/**/common_templates/partials/gwNoOption.html',
										checkoutNowPartials+'*.html',
										checkinPartials+"*.html",
										precheckinPartials+'*.html']
										

		}
	}
}
