// Load inline form
function loadInlineForm($target, $item){
	$.ajax({
        type:       'GET',
        url:        $target,
        dataType:   'html',
        //timeout:    5000,
        success: function(data){
            $('.data-holder').html(data);
        },
        error: function(){
            alert("Error!");
        }
    }).done(function(){  
        $('.edit-data').fadeIn(300);
    });
}

// Refresh sortable block after item move or drop
function refreshSortable(){
	$('.boxes:visible').each(function(){
		var $placeholder = $(this).attr('data-placeholder');

		if (!$(this).children('li').length){
			$(this).addClass('empty').append('<span class="placeholder ui-state-disabled">' + $placeholder + '</span>');
		} else {
			$(this).removeClass('empty').find('.placeholder').remove();
		}
	});

	setTimeout(function() {
		$('.boxes:visible').removeAttr('style').maximize('height');
	}, 300);
}

function setDatepicker($minDate, $maxDate, $yearRangeStart, $yearRangeStop){
	$('.datepicker').datepicker({
        showOn      : 'button',
        dateFormat  : 'mm-dd-y',
        changeMonth : true,
        changeYear  : true,
        minDate		: $minDate,
        maxDate		: $maxDate,
        yearRange   : $yearRangeStart + ':' + $yearRangeStop,
        monthNamesShort: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        beforeShow: function(input, inst){
            $('<div id="ui-datepicker-overlay" />').insertAfter('#ui-datepicker-div');
        },
        onClose: function(dateText, inst){ 
            $('#ui-datepicker-overlay').remove();
        }
    });
}

var setUpAdmin = function(viewDom, delegate) {
// $(function($){ 
	this.delegate = delegate;
	var that = this;
	
	// Tablet or iPhone?
    var isTablet = navigator.userAgent.match(/Android|iPad/i) != null;
   
   	if (isTablet) {
		// Prevent jump to mobile Safari
		$('a:not(.nav-toggle)').click(function(e){
			e.preventDefault();

			location.href = $(this).attr("href");		
		});
	}

	

	// Change hotel
		$(document).on('click', '#change-hotel h1', function(e){
			$('#change-hotel').toggleClass('open');
		});

	// Quick menu
		var sortableIn = 0;
		var dropOut = 0;

		$('.icon-admin-menu:not(.dropped):not(.admin-menu-group)').draggable({
			revert: 'invalid',
			connectToSortable: '#quick-menu',
	        helper: 'clone',
	        start: function( event, ui ) {
	        	$('#quick-menu').addClass('dragging');
	        },
	        stop: function( event, ui ) {
	        	$('#quick-menu').removeClass('dragging');	        		
	        }
		});

		$('#quick-menu').droppable({
			drop: function( event, ui ) {
				dropOut = 1;
				$(this).removeClass('dragging').addClass('has-items');
			},
			activeClass: 'active'
		}).sortable({
			receive: function (event, ui) {
				sortableIn = 1;
	        	$(ui.item).addClass('moved').draggable('option', 'disabled', true);	        	
	    	},
	        over: function(event, ui){
				sortableIn = 1;
			},
			out: function(event, ui){						
				sortableIn = 0;
				if(dropOut == 0){					
					var bookMarkId = $(ui.item.context).attr("data-id");
	        		that.delegate.bookMarkRemoved(bookMarkId);	        				
	        		$("#bookmark_"+bookMarkId).hide();
	        		$("#components_"+bookMarkId).removeClass('moved');
				}
				
			},
			stop: function(event, ui){
				
			},
			
			beforeStop: function(event, ui){
				var bookMarkId = $(ui.item.context).attr("data-id")
					bookMarkWidth = parseInt(ui.item.outerWidth());

				$(ui.item).css('width', bookMarkWidth).addClass('in-quick-menu');

				// TODO - pass bookMarkWidth as well so that in _quick_menu.html.haml 
				// you can add "style" => "width:" + menu_components['width']
	        	that.delegate.bookMarkAdded(bookMarkId);

				// Remove from quick navigation
				if (sortableIn == 0){
					var $item = $(ui.item).text();
					var bookMarkId = $(ui.item.context).attr("data-id");
	        		that.delegate.bookMarkRemoved(bookMarkId);
					$(ui.item).remove();
					$("#components_"+bookMarkId).removeClass('moved');
					$('.icon-admin-menu:contains("' + $item + '")').draggable('option', 'disabled', false).find('.icon-admin-menu').removeClass('moved');


					// When the last empty clone is left
					if ($(this).children().length == 1) {
						$(this).removeClass('has-items');
					}
				}
			}
		});

	// Dashboard tabs
		$('.tabs').tabs({
			beforeActivate: function( event, ui ) {
				var $prevTab = ui.oldPanel.attr('id'),
					$nextTab = ui.newPanel.attr('id')

				$('#' + $prevTab).fadeOut(300);
		        $('#' + $nextTab).fadeIn(300);
			}
		});

	
};