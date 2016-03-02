admin.controller('adZestWebPreviewCtrl', ['$scope', 'isSmallDevice',
	function($scope, isSmallDevice) {
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
			setTimeout(function() {
				document.getElementById('zest-web-main-container').appendChild(node);
			}, 100);


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

				var styleString = ""
				styleString = styleString + ".zest-web-checkout-icon{background-image: url('/assets/cssimg/" + color + "/checkout_icon.png')}"
				addStyleString(styleString);
			}
			/*
			 * This is to override the existing demo theme styling with the CMS contents if
			 * set in the admin
			 */
		var overrideStylesWithCMSdata = function(styles) {
			//set the background color
			applyStyle('.zest-web-main-container { background:', styles.main_bg.background);
			// set nav bar background color
			applyStyle('.zest-web-header-bar { background:', styles.header_bg.background);
			// set template button bg color
			applyStyle('.zest-web-btn { background:', styles.button.background);
			// set template button text color
			applyStyle('.zest-web-btn  { color:', styles.button_text.color);
			//set template font family
			applyStyle('.zest-web-main-container { font-family:', styles.template_font);
			// set  main text color
			applyStyle('.zest-web-template-text,.zest-web-main-text { color:', styles.title_text.color);
			// set sub main text color
			applyStyle('.zest-web-sub-main-text { color:', styles.sub_title_text.color);
			// set template footer text color
			applyStyle('.zest-web-footer-text  { color:', styles.footer_text.color);
			// set template label text color
			applyStyle('.zest-web-sub-text { color:', styles.label_text.color);

			if (isSmallDevice) {
				// set button font size for small devices
				applyStyle('.zest-web-btn { font-size:', styles.button_text.sd_font_size, "font-size");
				// set sub title font size for small devices
				applyStyle('.zest-web-sub-main-text { font-size:', styles.sub_title_text.sd_font_size, "font-size");
				// set title font size for small devices
				applyStyle('.zest-web-main-text { font-size:', styles.title_text.sd_font_size, "font-size");
				// set footer font size for small devices
				applyStyle('.zest-web-footer-text { font-size:', styles.footer_text.sd_font_size, "font-size");
				// set label font size for small devices
				applyStyle('.zest-web-sub-text{ font-size:', styles.label_text.sd_font_size, "font-size");
			} else {
				// set title font size for large devices
				applyStyle('.zest-web-main-text { font-size:', styles.title_text.ld_font_size, "font-size");
				// set sub title font size for large devices
				applyStyle('.zest-web-sub-main-text { font-size:', styles.sub_title_text.ld_font_size, "font-size");
				// set button font size for large devices
				applyStyle('.zest-web-btn { font-size:', styles.button_text.ld_font_size, "font-size");
				// set footer font size for large devices
				applyStyle('.zest-web-footer-text { font-size:', styles.footer_text.ld_font_size, "font-size");
				// set label font size for large devices
				applyStyle('.szest-web-ub-text { font-size:', styles.label_text.ld_font_size, "font-size");
			};

			//apply icon styles
			if (styles.icon_color !== "White" && styles.icon_color !== null) {
				applyIconStyles(styles.icon_color)
			}
			if (styleString.length > 0) {
				addStyleString(styleString);
			} else {
				return;
			};
		};
		BaseCtrl.call(this, $scope);
		if($scope.globalSettings.is_cms_on){
			overrideStylesWithCMSdata($scope.globalSettings);
		}
		else{
			return;
		};
		

	}
]);