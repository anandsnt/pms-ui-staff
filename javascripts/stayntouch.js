/* Styled checkbox & radio ***/
function styleCheckboxRadio() {
	if($('.checkbox input').length) {
		$('.checkbox').removeClass('c-on');
		$('.checkbox input:checked').closest('label').addClass('c-on');
	};

	if($('.radio input').length) {
		$('.radio').removeClass('r-on').addClass('inactive');
		$('.radio input:checked').closest('label').removeClass('inactive').addClass('r-on');
	};
};

/* On-off checkbox switcher **/
function onOffSwitch() {
	if($('.switcher input').length) {
		$('.switcher.chk-on').removeClass('chk-on');
		$('.switcher input:checked').closest('label').addClass('chk-on');
	};
};

/* Styled input[type="file"] ***/
function styleInputFile() {
	if($('input.file, input[type="file"]').length) {
		var $wrapper = '<div class="file-upload" />', $fauxLabel = '<span class="input r5">No file chosen</span>', $fauxReplaceLabel = '<span class="input r5">Replace</span>', $fauxButton = '<a href="#" class="button r5">Choose file</a>';

		$('input.file, input[type="file"]').each(function() {
			var $parent = $(this).parent();

			if($parent.hasClass('has-file')) {
				var $label = $fauxReplaceLabel;
			} else {
				var $label = $fauxLabel;
			}

			$(this).wrap($wrapper).after($label + $fauxButton).change(function() {
				$(this).parent('.file-upload').children('.input').text($(this).val());
			});
		});
	};
};

/* Styled select ***/
function styleSelect() {
	if($('select.select').length) {
		$('select.select').each(function() {
			var $title = $('option:selected').text();
			if($('option:selected', this).val() != '')
				$title = $('option:selected', this).text();

			$(this).wrap('<div class="selectify ' + $(this).attr('class') + '" />').css({
				'z-index' : 10,
				'opacity' : 0,
				'-khtml-appearance' : 'none'
			}).after('<span class="select r5">' + $title + '</span><span class="arrow" />').change(function() {
				val = $('option:selected', this).text();
				$(this).next().text(val).addClass('selected');

				if($(this)[0].selectedIndex === 0) {
					$(this).next('.selected').removeClass('selected');
				}
			});
			// Remove extra classes we don't need here
			$('.selectify').removeClass('select r5');

			if($(this)[0].selectedIndex != 0) {
				$(this).next().addClass('selected');
			}
		});
	};

	if($('select.timepicker').length) {
		$('select.timepicker').each(function() {
			var $title = $('option:selected').text();
			if($('option:selected', this).val() != '')
				$title = $('option:selected', this).text();

			$(this).wrap('<div class="numberify ' + $(this).attr('class') + '" />').css({
				'z-index' : 10,
				'opacity' : 0,
				'-khtml-appearance' : 'none'
			}).after('<span class="select r5">' + $title + '</span><span class="double-arrow" />').change(function() {
				val = $('option:selected', this).text();
				$(this).next().text(val).addClass('selected');

				if($(this)[0].selectedIndex === 0) {
					$(this).next('.selected').removeClass('selected');
				}
			});
			// Remove extra classes we don't need here
			$('.numberify').removeClass('timepicker r5');

			if($(this)[0].selectedIndex != 0) {
				$(this).next().addClass('selected');
			}
		});
	};
};

/* Equalize heights ***/
function checkHeight() {
	$('.content-form label:not(.switcher)').each(function() {
		var $maxHeight = $(this).outerHeight();
		if($maxHeight > 35)
			$(this).addClass('tworow');
	});

	$('.listing-item .singleton').each(function() {
		var $maxHeight = $(this).outerHeight();
		if($maxHeight > 35)
			$(this).addClass('tworow');
	});

	$('.listing-item:not(.singleton), .listing-item:not(.tworow)').each(function() {
		$(this).children('.data').find('p').removeAttr('style').attr({
			'style' : 'height:' + $(this).height() + 'px;'
		});
		$(this).children('.delete').attr({
			'style' : 'height:' + $(this).height() + 'px;'
		});
	});
}

// $(window).load(checkHeight);
// $(window).resize(checkHeight);

/* Simple sorting ***/
jQuery.fn.sortElements = (function() {
	var sort = [].sort;
	return function(comparator, getSortable) {
		getSortable = getSortable ||
		function() {
			return this;
		};

		var placements = this.map(function() {
			var sortElement = getSortable.call(this), parentNode = sortElement.parentNode, nextSibling = parentNode.insertBefore(document.createTextNode(''), sortElement.nextSibling);
			return function() {
				if(parentNode === this) {
					throw new Error("You can't sort elements if any one is a descendant of another.");
				}
				parentNode.insertBefore(this, nextSibling);
				parentNode.removeChild(nextSibling);
			};
		});
		return sort.call(this, comparator).each(function(i) {
			placements[i].call(getSortable.call(this));
		});
	};
})();

function onOffSwitchAjax(arr) {
	jQuery.ajax({
		type : 'put',
		url : $('#' + arr).attr('action') + '/onOffActiveSwitch',
		data : $('#' + arr).serialize(),
		dataType : 'json',
		success : function(data) {
		},
		failure : function(data) {
		}
	})
};

function addPermission(role, permissions) {
	jQuery.ajax({
		type : 'POST',
		url : '/roles_permissions/add_permission',
		data : 'role_id=' + role + '&permissions='+permissions,
		dataType : 'json',
		success : function() {
		},
		failure : function(data) {
			//alert("failure")
		}
	})
};

function removePermission(role, permissions) {
	jQuery.ajax({
		type : 'POST',
		url : '/roles_permissions/remove_permission',
		data : 'role_id=' + role + '&permissions=' + permissions,
		dataType : 'json',
		success : function() {
		},
		failure : function(data) {
			//alert("failure")
		}
	})
};

function resendActivation(user_email) {
	jQuery.ajax({
		type : "POST",
		url : "/resend_activation",
		data : "email=" + user_email,
		cache : false,
		success : function(result) {
			document.write(result)
		}
	});
}

/* DOM is ready */
jQuery(function($) {

	// Light page load animation
	$('#wrapper').css('opacity', '0').delay(200).animate({
		opacity : 1
	}, 400);

	// Fancy form elements - on load
	//onOffSwitch();
	// styleCheckboxRadio();
	// styleInputFile();
	// styleSelect();

	// Fancy form elements - on click
	$('.checkbox input, .radio input').click(function() {
		styleCheckboxRadio();
	});
	// Toggle active/inactive
	$('.switcher input').click(function(e) {
		e.stopPropagation();
		if($(this).closest('form').prev('a').find('.status').length) {
			$(this).closest('form').prev('a').find('.status').fadeToggle(function() {
				if($(this).hasClass('active'))
					$(this).removeClass('active').text('Inactive').show();
				else
					$(this).addClass('active').text('Active').show();
				onOffSwitch();
			});
		} else {
			onOffSwitch();
		}
	});
	// Check if page-nav items breaks in 2 lines
	$('#page-nav li').each(function() {
		var $maxHeight = $(this).height();
		if($maxHeight > 60)
			$(this).addClass('tworow');
	});
	// Check if form has some values ready
	$('.form input').each(function() {
		var $attr = $(this).attr('value');
		if( typeof $attr !== 'undefined' && $attr !== false && $attr != '')
			$(this).addClass('has-content');
	});
	$('.form textarea').each(function() {
		var $attr = $(this).val();
		if( typeof $attr !== 'undefined' && $attr !== false && $attr != '')
			$(this).addClass('has-content');
	});
	// Show password toggle
	$('.has-password').each(function() {
		if($(this).children('.toggle-password').text() == 'Hide')
			$(this).children('input.is-password').attr({
				'type' : 'text'
			});

		$(this).children('.toggle-password').click(function() {
			$(this).text($(this).text() == 'Show' ? 'Hide' : 'Show').attr('class', $(this).attr('class') == 'toggle-password stars' ? 'toggle-password text' : 'toggle-password stars').prev('input.is-password').attr('type', $(this).prev('input.is-password').attr('type') == 'text' ? 'password' : 'text');
		});
	});
	// Placeholder support for IE
	if($('html').hasClass('ie')) {
		$('[placeholder]').focus(function() {
			var input = $(this);
			if(input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $(this);
			if(input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur().parents('form').submit(function() {
			$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if(input.val() == input.attr('placeholder')) {
					input.val('');
				}
			})
		});
	}

	// Item before active one
	$('#main-nav li.active, #page-nav li.active').prev().addClass('before');

	// Table has only one anchor
	$('.guests.data-table tr').click(function(e) {
		if($(this).attr('data-href')) {
			location.href = $(this).attr('data-href');
			e.stopPropagation();
		}
	});
	// Listing item can be edited inline
	$('.listing-item.inline-edit a:not(.action)').click(function(e) {
		var $activeItem = $(this).parent().parent().index();
		$('.listing-item.inline-edit').eq($activeItem).toggleClass('active').siblings().removeClass('active');
		$('.listing-item.inline-edit').eq($activeItem).find('input[type="text"]:first').focus();
		e.preventDefault();
	});
	// Adding new item with inline form
	$('#title .inline-add').click(function(e) {
		$('.listing-item.add-new').toggleClass('active').siblings().removeClass('active');
		$('.listing-item.add-new').find('input[type="text"]:first').focus();
		e.preventDefault();
	});
	// Closing inline editable listing items
	$('.listing-item.inline-edit .form span.close').click(function(e) {
		var $activeItem = $(this).closest('.listing-item').index();
		$('.listing-item.inline-edit').eq($activeItem).removeClass('active');
		e.preventDefault();
	});
	// Sortable extensions list
	$('#extensions-sorting .is-room').addClass('inactive').click(function() {
		$(this).removeClass('inactive').toggleClass('sorted');
		$('#extensions-list .listing-item:not(.singleton)').toggleClass('sorted');

		$('#extensions-list .listing-item.sorted:not(.singleton)').sortElements(function(a, b) {
			var aText = $.text([a]), bText = $.text([b]);
			return aText.toLowerCase() > bText.toLowerCase() ? 1 : -1;
		});
		$('#extensions-list .listing-item:not(.sorted):not(.singleton)').sortElements(function(a, b) {
			var aText = $.text([a]), bText = $.text([b]);
			return bText.toLowerCase() > aText.toLowerCase() ? 1 : -1;
		});
	});
	// Show preview
	$('.preview-toggle').click(function(e) {

		// Update this text and show box when hidden
		if($(this).text() == 'Preview') {
			$(this).text('Update preview');
			$('#preview').addClass('active').hide().delay(500).fadeIn();
			$('#no-preview').remove();
		}

		// Update preview
		switch(this.id) {
			case "promotion-about":
				var $title = $('#promotion-title').val();

				$('#preview.active #preview-area').fadeOut(function() {
					$('#preview-area #preview-title').text($title);
					$('#preview-area').show();
				});
				break;
			case "promotion-lobby":
				var $person = $('#user_id option[value!=0]:selected').text(), $position = $('#user_id option[value!=0]:selected').attr('data-position'), $hotel = $('#user_id option[value!=0]:selected').attr('data-hotel'), $text = $('#promotion-description').val();

				$('#preview.active #preview-area').fadeOut(function() {
					$('#preview-area #preview-title').html($person + '<span>' + $position + ', ' + $hotel + '</span>');
					$('#preview-area #preview-description').text($text);
					$('#preview-area').show();
				});
				break;
			case "group-event":
				var $title = $('#event-name').val(), $location = $('#event-location').val(), $start = $('#event-start').val().split(/ +/), $end = $('#event-end').val().split(/ +/);

				$('#preview.active #preview-area').fadeOut(function() {
					$('#preview-area #preview-title').text($title);
					$('#preview-area #preview-location').text($location);
					$('#preview-area #preview-time').text($start[1] + $start[2] + ' - ' + $end[1] + $end[2]);
					$('#preview-area').show();
				});
				break;
			default:
				return false;
				break;
		}

		e.preventDefault();
	});
	// Toggle element visibility
	$('.toggled-list').hide();

	$('.list-toggle').click(function(e) {
		var $showListing = $(this).attr('href').replace('?show=', '');

		$('.toggled-list:not(#' + $showListing + ')').hide();
		$('#' + $showListing).fadeToggle();

		if($(this).hasClass('close')) {
			$('.form > .content-form').removeClass('faded');
			$('.form > .content-form > .divider').css("display", "block");
		} else {
			$('.form > .content-form:not(.faded)').toggleClass('faded');
			$('.form > .content-form > .divider').css("display", "none");
		}
		e.preventDefault();
	});
	/* Plugins ***/

	// Tooltip
	// $('#main-nav a').tooltipster();
	// $('.tooltip').tooltipster({
	// position : 'bottom',
	// theme : '.tooltipster-dark'
	// });

	// Colorbox
	// $('.zoom').colorbox({
	// opacity : '0.75'
	// });

	// Date & time pickers
	var myDate = new Date();
	myDate.setFullYear(myDate.getFullYear() + 1);

	// $('.datetimepicker').datetimepicker({
	// timeFormat : 'hh:mm tt',
	// hourGrid : 6,
	// minuteGrid : 10,
	// stepHour : 1,
	// stepMinute : 10,
	// minDate : $.datepicker.formatDate('yy-mm-dd', new Date()),
	// maxDate : $.datepicker.formatDate('yy-mm-dd', myDate),
	// dateFormat : 'yy-mm-dd'
	// });
	//
	// $('.datepicker').datepicker({
	// minDate : $.datepicker.formatDate('yy-mm-dd', new Date()),
	// dateFormat : 'yy-mm-dd',
	// maxDate : $.datepicker.formatDate('yy-mm-dd', myDate)
	// });
	//
	// $('.date_range_filter').datepicker({
	// /*minDate: $.datepicker.formatDate('mm/dd/yy', new Date()),*/
	// // dateFormat: 'yy-mm-dd',
	// maxDate : $.datepicker.formatDate('mm/dd/yy', myDate)
	// });

	// $(".minute_spinner").spinner({
	// "start" : 0,
	// "min" : 0,
	// "max" : 23
	// });

	// Submitable datatables
	$('.submit-data').submit(function() {
		var $sData = $('.data-table input').serialize();
		alert("These will be added/deleted: " + $sData);
		return false;
	});
	// $oTable = $('.data-table:not(.guests)').dataTable({
	// "bAutoWidth" : false,
	// "sPaginationType" : "full_numbers"
	// });
	//
	// // Guests datatable with date filtering
	// $('.data-table.guests').dataTable({
	// "bAutoWidth" : false,
	// "sPaginationType" : "full_numbers"
	//
	// }).columnFilter({
	// sPlaceHolder : "foot:after",
	// aoColumns : [null, null, null, null, {
	// type : "date-range",
	// sRangeFormat : "{from} {to}"
	// }, {
	// type : "date-range",
	// sRangeFormat : "{from} {to}"
	// }]
	// });

	// Move those filters to title area
	$('<div id="additional" class="form"><div id="filter-arrival" class="date-filter" /><div id="filter-departure" class="date-filter" /></div>').appendTo('#title');

	$('.data-table.guests tfoot .filter_date_range:first').detach().appendTo('#filter-arrival');
	$('.data-table.guests tfoot .filter_date_range:last').detach().appendTo('#filter-departure');
	$('.data-table.guests tfoot').remove();

	$('#additional input').addClass('r5');
	$('#filter-arrival input:first').attr('placeholder', "Arrival from");
	$('#filter-arrival input:last').attr('placeholder', "Arrival to");
	$('#filter-departure input:first').attr('placeholder', "Departure from");
	$('#filter-departure input:last').attr('placeholder', "Departure to");

	// Permissions UI - Mover links
	$('<div id="move-selected"><div id="movers"><span id="to-available" class="mover" /><span id="to-assigned" class="mover" /></div></div>').insertAfter($('#permissions-list #roles'));

	// Permissions UI - tabs
	$('#permissions-list').tabs({

		show : {
			effect : "fadeIn",
			duration : 250
		},
		activate : function(event, ui) {
			var $active = $(this).tabs('option', 'active'), $visible = $('.ui-tabs-nav > li a').eq($active).attr('href')
			$hidden = $(this).children('div.ui-tabs-panel:not(' + $visible + ')');

			$hidden.each(function() {
				var $selected = $(this).find('.sortable > li.selected');
				$selected.removeClass('selected');
				$('.mover').removeClass('active');
			});
			// Helper class to quick fix IE8 width issue
			$(this).children('div' + $visible + '.ui-tabs-panel').toggleClass('showing');
		}
	});

	// Permissions UI - select and move, for each panel separately
	$('.ui-tabs-panel > .cols3 > .sortable li').click(function() {
		$(this).toggleClass('selected');

		var $selected = $(this).closest('.sortable').children('.selected').length, $toAvailable = $(this).closest('.cols3').hasClass('assigned'), $toAssigned = $(this).closest('.cols3').hasClass('available');
		if($selected > 0) {

			if($toAvailable)
				$('#to-available').addClass('active');
			else if($toAssigned)
				$('#to-assigned').addClass('active');
		} else {
			if($toAvailable)
				$('#to-available').removeClass('active');
			else if($toAssigned)
				$('#to-assigned').removeClass('active');
		}
	});
	// Permissions UI - sortable & selectable
	$('.sortable').sortable({
		connectWith : '.sortable',
		cursor : "move",
		revert : true,
		receive : function(event, ui) {
			ui.item.removeClass('selected');
			var $selectedAvailable = $('.available .sortable li.selected').length, 
				$selectedAssigned = $('.assigned .sortable li.selected').length, 
				$toAvailable = $(this).closest('.cols3').hasClass('assigned'), 
				$toAssigned = $(this).closest('.cols3').hasClass('available'), 
				role_id = $('.ui-state-active a').attr('href').split('_'), 
				permission_id = ui.item.attr('id').split('_');
			
			if( $selectedAssigned = 0)
				$('#to-available.mover').removeClass('active');
			if( $selectedAvailable = 0)
				$('#to-assigned.mover').removeClass('active');
			if($toAvailable) {
				addPermission(role_id[1], permission_id[1]);
			} else if($toAssigned) {
				removePermission(role_id[1], permission_id[1]);
			}

		}
	}).disableSelection().find('li').mousedown(function() {
		$(this).addClass('dragging');
	}).mouseup(function() {
		$(this).removeClass('dragging');
	}).prepend('<div class="handle" />');

	// Permissions UI - moving multiple permissions
	$('.mover').click(function() {
		if($(this).hasClass('active')) {
			var role_id = $('.ui-state-active a').attr('href').split('_')
			var permission_id = new Array();
			var permission_id = new Array();
			var i = 0, j = 0;
			switch(this.id) {
				case "to-available":
					var $target = $('.ui-tabs-panel:visible > .available > .sortable');
					$('.assigned .sortable li.selected').hide(250, function() {
						$(this).detach().removeClass('selected').appendTo($target).show(250);
					});

					$('.assigned').find('.selected').each(function() {
						var arr = $(this).attr('id').split('_');
						permission_id[i++] = arr[1];
					})
					removePermission(role_id[1], permission_id);
					break;
				case "to-assigned":
					var $target = $('.ui-tabs-panel:visible > .assigned > .sortable');
					$('.available .sortable li.selected').hide(250, function() {
						$(this).detach().removeClass('selected').appendTo($target).show(250);
					});
					$('.available').find('.selected').each(function() {
						var arr = $(this).attr('id').split('_');
						permission_id[i++] = arr[1];
					})
					addPermission(role_id[1], permission_id);
					break;
				default:
					return false;
					break;
			}
			$(this).removeClass('active');
		}
	});
	// Open fake selectbox
	$('.selectbox').click(function() {
		$(this).toggleClass('open');

		// Fade content when selectbox is open
		if($('.selectbox.open').length) {
			$('.listing').addClass('faded');
		} else {
			$('.listing').removeClass('faded');
		}
	});
	// $('#group_members').dataTable({
	// 'bFilter' : false,
	// 'bPaginate' : false,
	// "oLanguage" : {
	// "sEmptyTable" : "No members added to this group yet!"
	// },
	// });
	//
	// $('#group_agenda').dataTable({
	// 'bFilter' : false,
	// 'bPaginate' : false,
	// "oLanguage" : {
	// "sEmptyTable" : "No agenda created for this group yet!"
	// },
	// });

	// Add click event binding to `Import users` link
	$("#import-users").on("click", function(event) {
		event.preventDefault();
		// don't trigger default

		// get the value inside the text field
		var code = $("#group-code").val();
		var group_id = $("#group-id").val();
		var url = "/groups/" + group_id + "/import?group_code=" + code
		//Do non-ajax form submission
		$('<form action="' + url + '" method="POST"></form>').submit();
	});
	// Add click event binding to `Add member` link
	$("#add-member").on("click", function(event) {
		event.preventDefault();
		// don't trigger default

		// get the value of checkbox which is checked
		var user_id = [];
		$(':checkbox:checked').each(function(i) {
			user_id[i] = $(this).val();
		});
		// get the group Id value
		var group_id = $("#group-id").val();
		var url = "/groups/" + group_id + "/members?user_id=" + user_id
		//Do non-ajax form submission
		$('<form action="' + url + '" method="POST"></form>').submit();
	});
	if($('#member-name').length != 0)
		$('#member-name').autocomplete({
			// This shows the min length of charcters that must be typed before the autocomplete looks for a match.
			minLength : 2,
			// This is the source of the auocomplete suggestions. In this case a list of names from the people controller, in JSON format.
			source : '/users/autocomplete_user_last_name',
			// This updates the textfield when you move the updown the suggestions list, with your keyboard. In our case it will reflect the same value that you see in the suggestions which is the person.given_name.
			focus : function(event, ui) {
				$('#member-name').val(ui.item.value);
				return false;
			},
			// Once a value in the drop down list is selected, do the following:
			select : function(event, ui) {
				// place the person.given_name value into the textfield called 'select_origin'...
				$('#member-name').val(ui.item.value);
				// and place the person.id into the hidden textfield called 'member_user_id'.
				$('#member-id').val(ui.item.id);
				return false;
			}
		})
		// The below code is straight from the jQuery example. It formats what data is displayed in the dropdown box, and can be customized.
		.data("ui-autocomplete")._renderItem = function(ul, item) {
			return $("<li></li>").data("ui-autocomplete-item", item)
			// For now which just want to show the person.given_name in the list.
			.append("<a>" + item.value + "</a>").appendTo(ul);
		};
	// For jquery Editor
	// $('#email-template').jqte();

});
