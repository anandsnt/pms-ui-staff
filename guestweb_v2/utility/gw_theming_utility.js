function isBlank(pString) {
	if (!pString || pString.length == 0) {
		return true;
	}
	return !/[^\s]+/.test(pString);
}

function addStyleString(str) {
	var node = document.createElement('style');
	node.innerHTML = str;
	document.head.appendChild(node);
}

var styleString = "";

function appendStyleString(str) {
	styleString = styleString + str;
};

/*
 * This is to override the existing demo theme styling with the CMS contents if
 * set in the admin
 */
var overrideStylesWithCMSdata = function(styles) {
	//set the background color
	if (!isBlank(styles.main_bg.background)) {
		appendStyleString('body { background:' + styles.main_bg.background + ' !important}');
	}
	// set nav bar background color
	if (!isBlank(styles.header_bg.background)) {
		appendStyleString('.header-bar { background:' + styles.header_bg.background + ' !important}');
	}
	// set sub main text color
	if (!isBlank(styles.sub_title_text.color)) {
		appendStyleString('.sub-main-text { color:' + styles.sub_title_text.color + ' !important}');
	}
	// set  main text color
	if (!isBlank(styles.title_text.color)) {
		appendStyleString('.template-text,.main-text { color:' + styles.title_text.color + '!important}');
	}
	// set template button bg color
	if (!isBlank(styles.button.background)) {
		appendStyleString('.btn,.btn:hover { background:' + styles.button.background + '!important}');
	}
	// set template button text color
	if (!isBlank(styles.button_text.color)) {
		appendStyleString('.btn,.btn:hover  { color:' + styles.button_text.color + '!important}');
	}
	// set light button bg color
	if (!isBlank(styles.light_button.background)) {
		appendStyleString('.light-button,.light-button:hover { background:' + styles.light_button.background + '!important}');
	}
	// set dark button bg color
	if (!isBlank(styles.dark_button.background)) {
		appendStyleString('.dark-button,.dark-button:hover { background:' + styles.dark_button.background + '!important}');
	}
	// set checkouttime1 bg color
	if (!isBlank(styles.checkout_time_1.background)) {
		appendStyleString('.checkouttime1,.checkouttime1:hover { background:' + styles.checkout_time_1.background + '!important}');
	}
	// set checkouttime2 bg color
	if (!isBlank(styles.checkout_time_2.background)) {
		appendStyleString('.checkouttime2,.checkouttime2:hover { background:' + styles.checkout_time_2.background + '!important}');
	}
	// set checkouttime3 bg color
	if (!isBlank(styles.checkout_time_3.background)) {
		appendStyleString('.checkouttime3,.checkouttime3:hover { background:' + styles.checkout_time_3.background + '!important}');
	}
	// set calender bg color
	if (!isBlank(styles.calender_header_background)) {
		appendStyleString('.date-picker-header ,.pickadate-cell .pickadate-active{ background:' + styles.calender_header_background + '!important}');
	}
	// set calender main bg color
	if (!isBlank(styles.calender_main_background)) {
		appendStyleString('.date-picker-wrap { background:' + styles.calender_main_background + '!important}');
	}
	//set calender cell bg
	if (!isBlank(styles.calender_cell_background)) {
		appendStyleString('.pickadate-cell .pickadate-disabled, .pickadate-cell .pickadate-enabled, .pickadate-cell .pickadate-outofrange-disabled { background:' + styles.calender_cell_background + '!important}');
	}
	//set template font family
	if (!isBlank(styles.template_font)) {
		appendStyleString('body { font-family:'+styles.template_font+'!important}');
	}
	// set title font size for large devices
	if (!isBlank(styles.title_text.ld_font_size)) {
		appendStyleString('.main-text { font-size:'+styles.title_text.ld_font_size+'px !important}');
	}
	// set sub title font size for large devices
	if (!isBlank(styles.sub_title_text.ld_font_size)) {
		appendStyleString('.sub-main-text { font-size:'+styles.sub_title_text.ld_font_size+'px !important}');
	}
	// set button font size for large devices
	if (!isBlank(styles.button_text.ld_font_size)) {
		appendStyleString('.btn { font-size:'+styles.button_text.ld_font_size+'px !important}');
	}
	// set title font size for small devices
	if (!isBlank(styles.title_text.sd_font_size)) {
		appendStyleString('@media (max-width: 480px) {.main-text { font-size:'+styles.title_text.sd_font_size+'px !important}}');
	}
	// set sub title font size for small devices
	if (!isBlank(styles.sub_title_text.sd_font_size)) {
		appendStyleString('@media (max-width: 480px) {.sub-main-text { font-size:'+styles.sub_title_text.sd_font_size+'px !important}}');
	}
	// set button font size for small devices
	if (!isBlank(styles.button_text.sd_font_size)) {
		appendStyleString('@media (max-width: 480px) {.btn { font-size:'+styles.button_text.sd_font_size+'px !important}}');
	}

	if (styleString.length > 0) {
		addStyleString(styleString);
	} else {
		return;
	};
};