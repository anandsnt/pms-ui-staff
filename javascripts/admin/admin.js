// Set sortable placeholder
function refreshSortable(){
	$('.sortable:visible').each(function(){
		var $placeholder = $(this).attr('data-placeholder');

		if (!$(this).children('li').length && $placeholder != null && !$(this).children('.placeholder').length){
			$(this).addClass('empty').append('<span class="placeholder ui-state-disabled">' + $placeholder + '</span>');
		}
	});
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
	var limit = 8;
	var sortableIn = 0;
	var dropOut = 0;

	var enableMenuIconDragging = function() {
		$('.icon-admin-menu:not(.dropped):not(.admin-menu-group):not(.disabled)').draggable({
			revert: 'invalid',
			connectToSortable: '#quick-menu',
	    	helper: 'clone',
	    	start: function( event, ui ) {
	    		dropOut = 0; //Initialise - if it is a drop, will be set to 1 in drop function
	    		$('#quick-menu').addClass('dragging');
	    	},

	    	stop: function( event, ui ) {
	    		$('#quick-menu').removeClass('dragging');	        		
	    	}
		});
	};

	//Disable Dragging. Note: Quick menu items are not disabled with this.
	var disableMenuIconDragging = function() {
		$('.icon-admin-menu:not(.dropped):not(.draggable-disabled):not(.in-quick-menu)').draggable({
			revert: true,
			connectToSortable: null,
			helper: null
		});
	};



	// Light page load animation
	$('#content').css('opacity','0').delay(200).animate({opacity:1},400);

	// Keep app in fullscreen mode
   	var isTablet = navigator.userAgent.match(/Android|iPad/i) != null;
   	if (isTablet) {
		$('a:not(.nav-toggle):not(.edit-data-inline):not(.add-data-inline)').click(function(e){
			e.preventDefault();
		});
	}
	
	// Change hotel
	$(document).on('click', '#change-hotel h1', function(e){
		$('#change-hotel').toggleClass('open');
	});
	
	//Enable Dragging feature.
	enableMenuIconDragging();
	var $items = $('#quick-menu').children('.ui-draggable:visible').length;
	if($items >= limit) {
		disableMenuIconDragging();
	}


	//Make Quick Menu a droppable.
	$('#quick-menu').droppable({
		drop: function( event, ui ) {
			dropOut = 1;
			$(this).removeClass('dragging').addClass('has-items');
		}
	});

	// Handle Quick Menu Sortable events.
	$('#quick-menu').sortable({
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
        		$("#components_"+bookMarkId).removeClass('moved').draggable('option', 'disabled', false);
        		//after removing we need to enable dragging
        		enableMenuIconDragging();
			}
		},

		beforeStop: function(event, ui){
			var bookMarkId = $(ui.item.context).attr("data-id");
			var bookMarkWidth = parseInt(ui.item.outerWidth());
			var $items = $(this).children('.ui-draggable:visible').length -1; // To avoid place holder 

			if (!ui.item.hasClass('in-quick-menu'))
			{
				$(ui.item).css('width', bookMarkWidth + 10).addClass('in-quick-menu');
			}

			// TODO - pass bookMarkWidth as well so that in _quick_menu.html.haml 
			// you can add "style" => "width:" + menu_components['width']

			if(sortableIn ==1){
        		that.delegate.bookMarkAdded(bookMarkId);
				if($items >= limit)
				{
					//Disable dragging - QuickMenu is full
					disableMenuIconDragging();
        		}
    		}
			// Remove from quick navigation
			else {

				var $item = $(ui.item).text();
				var bookMarkId = $(ui.item.context).attr("data-id");
        		that.delegate.bookMarkRemoved(bookMarkId);
        		//we need to convert it to it's old state
				$("#bookmark_"+bookMarkId).hide();
    			$("#components_"+bookMarkId).removeClass('moved').draggable('option', 'disabled', false);	        		

       
				$(ui.item).remove();


				// When the last empty clone is left
				if ($items == 1) {
					$(this).removeClass('has-items');
				}

				// If space is available, enable addition of new items (-1 because at this point item that's dropped out is still considered part of navigation)
				if(($items-1) < limit)
				{
					enableMenuIconDragging();
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
					connectWith: '.sortable',
					cursor: 'move',
					revert: true,
					cancel: '.ui-state-disabled',
					helper: 'clone',
               		appendTo: 'body',
					placeholder: 'ui-state-highlight',
					receive: function(event, ui){
						
						if ($('.sortable').children('.selected').length < 2) {
							$('.movers .icons').removeClass('active');
						}

						refreshSortable();	
						$(this).removeClass('empty').children('.placeholder').remove();			
					},
					over: function(event, ui){
						$(this).children('.placeholder.ui-state-disabled').addClass('over');
					},
					out: function(event, ui){
						$(this).children('.placeholder.ui-state-disabled').removeClass('over');
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
            				$('.sortable:visible[data-type="target"]').removeClass('empty').children('.placeholder').remove();
        				});
					break; 
		            case "target":
		            	$('.sortable:visible[data-type="target"] li.selected').animate({opacity: 0}, 300, function(){
            				$(this).detach().removeClass('selected').appendTo('.sortable:visible[data-type="source"]').animate({opacity: 1}, 300);
            				refreshSortable();
            				$('.sortable:visible[data-type="source"]').removeClass('empty').children('.placeholder').remove();	
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