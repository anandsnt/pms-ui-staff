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

		if (!$(this).children('li').length && $placeholder != null){
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

	// Light page load animation
		$('#content').css('opacity','0').delay(200).animate({opacity:1},400);
	
	// Change hotel
		$(document).on('click', '#change-hotel h1', function(e){
			$('#change-hotel').toggleClass('open');
		});

	// Quick menu
		var sortableIn = 0;
		var dropOut = 0;
		var limit = 8;

		$('.icon-admin-menu:not(.dropped):not(.admin-menu-group):not(.disabled)').draggable({
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
			}
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
			beforeStop: function(event, ui){
				var bookMarkId = $(ui.item.context).attr("data-id")
					bookMarkWidth = parseInt(ui.item.outerWidth()),
					$items = $(this).children('.ui-draggable').length-1; // -1 because at this point item that's dropped out is still considered part of navigation

				if (!ui.item.hasClass('in-quick-menu'))
				{
					$(ui.item).css('width', bookMarkWidth + 10).addClass('in-quick-menu');
				}

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
					$('.icon-admin-menu:contains("' + $item + '")').draggable('option', 'disabled', false).removeClass('moved');

					// When the last empty clone is left
					if ($(this).children().length == 1) {
						$(this).removeClass('has-items');
					}

					// If space is available, enable addition of new items (-1 because at this point item that's dropped out is still considered part of navigation)
					if(($items-1) < limit)
					{
						$('.icon-admin-menu:not(.dropped):not(.draggable-disabled):not(.in-quick-menu)').draggable({
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
					}
				}
				// Adding to quick navigation is disabled after limit is met
				else {
					if($items == limit)
					{
						$('.icon-admin-menu:not(.dropped):not(.draggable-disabled):not(.in-quick-menu)').draggable({
							revert: true,
							connectToSortable: null,
							helper: null
						});
					}
				}
			}
		});

	// Dashboard tabs
		$('.tabs').tabs({
			beforeActivate: function( event, ui ) {
				var $prevTab = ui.oldPanel.attr('id'),
					$nextTab = ui.newPanel.attr('id');

				$('#' + $prevTab).fadeOut(300);
		        $('#' + $nextTab).fadeIn(300);
			}
		  
		});	
		
		$('#tabs-menu').jScrollPane({
   			autoReinitialise    : true,
         	animateScroll       : true,
         	mouseWheelSpeed     : 50
     	});
		
		
		
		// Roles & permissions Drag & Drop UI
		$(document).ajaxComplete(function() {
			refreshSortable();
			$('.sortable')
				.sortable({ 
					/*disabled: true,*/
					connectWith: '.sortable',
					cursor: 'move',
					revert: true,
					cancel: '.ui-state-disabled',
					placeholder: 'ui-state-highlight',
					receive: function(event, ui){
						
						if ($('.sortable').children('.selected').length < 2) {
							$('.movers .icons').removeClass('active');
						}

						refreshSortable();				
					},
					stop: function(event, ui){
						ui.item.removeClass('selected').find('.icon-handle').removeClass('dragging');
					}
				})
				.disableSelection()
		    	.find('li')
		    		.prepend('<span class="icons icon-handle" />')
		    		.mousedown(function(){ $(this).find('.icon-handle').addClass('dragging'); })
		    		.mouseup(function(){ $(this).find('.icon-handle').removeClass('dragging'); });
		});   		
      		
   	 	// Select multiple items
   	 	$(document).on('click', '.sortable li', function(){
			$(this).toggleClass('selected');

			var $selected = $(this).closest('.sortable').children('.selected').length,
				$holder = $(this).closest('.sortable').attr('data-type');

			if ($selected > 0)
			{
				if ($holder == 'source') $('.to-source').addClass('active');
				else if ($holder == 'target') $('.to-target').addClass('active');
			}
			else 
			{
				if ($holder == 'source') $('.to-source').removeClass('active');
				else if ($holder == 'target') $('.to-target').removeClass('active');
			}
		});
		// Move multiple items
		$(document).on('click', '.movers .icons', function(e){
			e.stopImmediatePropagation();

			var $type = $(this).attr('data-type');

			if($(this).hasClass('active'))
			{
				switch($type){
					case "source":
						$('.sortable:visible[data-type="source"] li.selected').animate({opacity: 0}, 300, function(){
            				$(this).detach().removeClass('selected').appendTo('.sortable:visible[data-type="target"]').animate({opacity: 1}, 300);
            				refreshSortable();
        				});
					break; 
		            case "target":
		            	$('.sortable:visible[data-type="target"] li.selected').animate({opacity: 0}, 300, function(){
            				$(this).detach().removeClass('selected').appendTo('.sortable:visible[data-type="source"]').animate({opacity: 1}, 300);
            				refreshSortable();
        				});
		            break;
		            default:
		            	return false;
		            break;
				}
				$(this).removeClass('active');			
			}
		});
		
};
