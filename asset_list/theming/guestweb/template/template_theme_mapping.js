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
			'guestweb_camby' 	:[ 'guestweb/**/common_hotel_templates/**.html'],
			'guestweb_carillon' 	:[ 'guestweb/**/carillon/**.html', sharedHtml],
			'guestweb_bellagio' 	:[ 'guestweb/**/mgm_chain/**.html','guestweb/**/mgm_chain/Bellagio/**.html'],
			'guestweb_delano' 	:['guestweb/**/mgm_chain/**.html','guestweb/**/mgm_chain/Delano/**.html'],
			'guestweb_vdara' 	:[ 'guestweb/**/mgm_chain/**.html','guestweb/**/mgm_chain/Vdara/**.html'],
			'guestweb_mandalay_bay':[ 'guestweb/**/mgm_chain/**.html','guestweb/**/mgm_chain/MandalayBay/**.html'],
			'guestweb_eden' 	 	:[ 'guestweb/**/eden/**.html', sharedHtml],
			'guestweb_envoy' 	:[ 'guestweb/**/envoy/**.html', sharedHtml],
			'guestweb_fulton' 	:[ 'guestweb/**/fulton/**.html', sharedHtml],
			'guestweb_galleria' 	:[ sharedPartials + 'Galleria/*.html', landingPartials + 'Galleria/*.html', sharedHtml, sharedCommonPartials],
			'guestweb_huntley' 	:[ 'guestweb/**/huntley/**.html', sharedHtml],
			'guestweb_mgm' 		:[ 'guestweb/**/mgm_aria/**.html', sharedHtml],
			'guestweb_montauk' 	:[ 'guestweb/**/montauk/**.html', sharedHtml],
			'guestweb_nikko' 	:[ 'guestweb/**/nikko/**.html', sharedHtml],
			'guestweb_palms' 	:[ 'guestweb/**/palms/**.html', sharedHtml],
			'guestweb_sanctuary' :[ 'guestweb/**/sanctuary/**.html', sharedHtml],
			'guestweb_yotel' 	:[ 'guestweb/**/yotel/**.html', sharedHtml],
			'guestweb_zoku' 		:[ 'guestweb/**/yotel/**.html', sharedHtml],
			'guestweb_fontainebleau' 	:[ 'guestweb/**/fontainebleau/**.html', sharedHtml],
			'guestweb_great_wolf' 		:[ 'guestweb/**/common_hotel_templates/**.html'],
			'guestweb_knickerbocker' 	:[ 'guestweb/**/knickerbocker/**.html', sharedHtml],
			'guestweb_margaritaville' 	:[ 'guestweb/**/margaritaville/**.html', sharedHtml],
			'guestweb' 	:[ 'guestweb/**/carlyle/**.html', sharedHtml],
			'guestweb_galleria' 	:[ 'guestweb/**/galleria/**.html', sharedHtml]
		}
	}
}