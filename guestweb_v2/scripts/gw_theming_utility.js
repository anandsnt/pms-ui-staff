function isBlank(pString){
    if (!pString || pString.length == 0) {
        return true;
    }
    return !/[^\s]+/.test(pString);
}

function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}

/*
* This is to override the existing demo theme styling with the CMS contents if
* set in the admin
*/
var overrideStylesWithCMSdata = function (styles){
	//set the background color
	if(!isBlank(styles.body_background)){
		addStyleString('body { background:'+ styles.body_background+' !important}');
	}
	// set nav bar background color
	if(!isBlank(styles.header_background)){
		addStyleString('.header-bar { background:'+ styles.header_background+' !important}');
	}
	// set sub main text color
	if(!isBlank(styles.template_sub_text_color)){
		addStyleString('.sub-main-text { color:'+ styles.template_sub_text_color+' !important}');
	}
	// set  main text color
	if(!isBlank(styles.template_text_color)){
		addStyleString('.template-text,.main-text { color:'+ styles.template_text_color+'!important}');
	}
	// set template button bg color
	if(!isBlank(styles.template_button_bg)){
		addStyleString('.btn,.btn:hover { background:'+ styles.template_button_bg+'!important}');
	}
	// set template button text color
	if(!isBlank(styles.template_button_color)){
		addStyleString('.btn,.btn:hover  { color:'+ styles.template_button_color+'!important}');
	}
	// set light button bg color
	if(!isBlank(styles.light_button_bg)){
		addStyleString('.light-button,.light-button:hover { background:'+ styles.light_button_bg+'!important}');
	}
	// set dark button bg color
	if(!isBlank(styles.dark_button_bg)){
		addStyleString('.dark-button,.dark-button:hover { background:'+ styles.dark_button_bg+'!important}');
	}
};
