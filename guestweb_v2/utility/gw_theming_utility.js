//blank check
function isBlank(pString) {
	if (!pString || pString.length == 0) {
		return true;
	}
	return !/[^\s]+/.test(pString);
}
// inject styles to head tag
function addStyleString(str) {
	var node = document.createElement('style');
	node.innerHTML = str;
	document.head.appendChild(node);
}

var styleString = "";
//concat style strings
function appendStyleString(str) {
	styleString = styleString + str;
};

var applyStyle = function(target, style, type) {
	if (!isBlank(style)) {
		if (type === "font-size") {
			appendStyleString(target + style + 'px !important}');
		} else if (type === "media-query") {
			appendStyleString('@media (max-width: 480px) {' + target + style + 'px !important}}');
		} else {
			appendStyleString(target + style + ' !important}');
		}

	} else {
		return;
	};
};

// icons of each color has to be in corresponding folders
var applyIconStyles = function(color) {
	if (color !== null) {
		var styleString = ""
		styleString = styleString + ".calendar-back {background-image: url('/assets/guestweb_v2/images/" + color + "/back_icon.png')}";
		styleString = styleString + ".calendar-done{background-image: url('/assets/guestweb_v2/images/" + color + "/done_icon.png')}";
		styleString = styleString + ".circle-bg { background: url('/assets/guestweb_v2/images/" + color + "/circle_bg.png')  no-repeat scroll center top transparent;}";
		styleString = styleString + ".back-to-checkout{background: url('/assets/guestweb_v2/images/" + color + "/left_arrow.png')no-repeat scroll center top transparent}";
		styleString = styleString + ".checkout-icon{background-image: url('/assets/guestweb_v2/images/" + color + "/checkout_icon.png')}";
		styleString = styleString + ".late-checkout-icon{ background-image: url('/assets/guestweb_v2/images/" + color + "/checkout_later.png')}";
		styleString = styleString + ".accept-charge-icon{background-image: url('/assets/guestweb_v2/images/" + color + "/creditcard_icon.png')}";
		styleString = styleString + ".upgrade-icon{background-image: url('/assets/guestweb_v2/images/" + color + "/upgrade_icon.png')}";
		addStyleString(styleString);
	} else {
		return;
	}

}
	/*
	 * This is to override the existing demo theme styling with the CMS contents if
	 * set in the admin
	 */
var overrideStylesWithCMSdata = function(styles) {
	//set the background color
	applyStyle('body { background:', styles.main_bg.background);
	// set nav bar background color
	applyStyle('.header-bar { background:', styles.header_bg.background);
	// set template button bg color
	applyStyle('.btn,.btn:hover { background:', styles.button.background);
	// set light button bg color
	applyStyle('.light-button,.light-button:hover { background:', styles.light_button.background);
	// set dark button bg color
	applyStyle('.dark-button,.dark-button:hover { background:', styles.dark_button.background);
	// set checkouttime1 bg color
	applyStyle('.checkouttime1,.checkouttime1:hover { background:', styles.checkout_time_1.background);
	// set checkouttime2 bg color
	applyStyle('.checkouttime2,.checkouttime2:hover { background:', styles.checkout_time_2.background);
	// set checkouttime3 bg color
	applyStyle('.checkouttime3,.checkouttime3:hover { background:', styles.checkout_time_3.background);
	// set calender bg color
	applyStyle('.date-picker-header ,.pickadate-cell .pickadate-active{ background:', styles.calender_header_background);
	// set calender main bg color
	applyStyle('.date-picker-wrap { background:', styles.calender_main_background);
	//set calender cell bg
	applyStyle('.pickadate-cell .pickadate-disabled, .pickadate-cell .pickadate-enabled, .pickadate-cell .pickadate-outofrange-disabled { background:', styles.calender_cell_background);
	// set template button text color
	applyStyle('.btn,.btn:hover  { color:', styles.button_text.color);
	//set template font family
	applyStyle('body { font-family:', styles.template_font);
	// set  main text color
	applyStyle('.template-text,.main-text { color:', styles.title_text.color);
	// set sub main text color
	applyStyle('.sub-main-text { color:', styles.sub_title_text.color);
	// set template footer text color
	applyStyle('.footer-text,.footer-text:hover  { color:', styles.footer_text.color);
	// set template label text color
	applyStyle('.sub-text,.sub-text:hover  { color:', styles.label_text.color);
	// set title font size for large devices
	applyStyle('.main-text { font-size:', styles.title_text.ld_font_size, "font-size");
	// set sub title font size for large devices
	applyStyle('.sub-main-text { font-size:', styles.sub_title_text.ld_font_size, "font-size");
	// set button font size for large devices
	applyStyle('.btn { font-size:', styles.button_text.ld_font_size, "font-size");
	// set footer font size for large devices
	applyStyle('.footer-text { font-size:', styles.footer_text.ld_font_size, "font-size");
	// set label font size for large devices
	applyStyle('.sub-text { font-size:', styles.label_text.ld_font_size, "font-size");
	// set button font size for small devices
	applyStyle('.btn { font-size:', styles.button_text.sd_font_size, "media-query");
	// set sub title font size for small devices
	applyStyle('.sub-main-text { font-size:', styles.sub_title_text.sd_font_size, "media-query");
	// set title font size for small devices
	applyStyle('.main-text { font-size:', styles.title_text.sd_font_size, "media-query");
	// set footer font size for small devices
	applyStyle('.footer-text { font-size:', styles.footer_text.sd_font_size, "media-query");
	// set label font size for small devices
	applyStyle('.sub-text{ font-size:', styles.label_text.sd_font_size, "media-query");
	//apply icon styles
	if (styles.icon_color !== "White") {
		applyIconStyles(styles.icon_color)
	}
	if (styleString.length > 0) {
		addStyleString(styleString);
	} else {
		return;
	};
};