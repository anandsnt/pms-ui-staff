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

// Flag Variables
var dropOut =0; // Is dropped into container
var sortableIn = 0; 
var swapIn =0; // Is an internal Swap
var isFirstTime = true;

var limit  = 8;
function p(m){/*qlog(m+"  drop:"+dropOut+"   sort:"+sortableIn+"   swap:"+swapIn)*/}

function enableMenuDragging(){
	$('.icon-admin-menu:not(.dropped):not(.admin-menu-group):not(.disabled):not(.in-quick-menu):not(.moved)').draggable({		
			revert: 'invalid',
			connectToSortable: '#quick-menu',
	    	helper: 'clone',
			
	    	start: function(event, ui)		{
	    		dropOut =0;
	    		sortableIn = 0;
	    		swapIn =0;
	    		p("Start");
	    		$('#quick-menu').addClass('dragging');
	    	},
	    	stop: function(event, ui){
	    		p("Stop");
	    		$('#quick-menu').removeClass('dragging');
	    		resetDragStates();
	    	},
	    	
	});
}

function disableMenuDragging(){
	$('.icon-admin-menu:not(.dropped):not(.admin-menu-group):not(.disabled):not(.in-quick-menu)').draggable({		
			revert: true,
			connectToSortable: null,
	    	helper: 'clone',
	});
}

//connectToSortable: '#quick-menu',
function enableQuickMenuDragging(){
	$('.icon-admin-menu.in-quick-menu').draggable({		
			revert: 'valid',
			connectToSortable: '#quick-menu',
	    	helper: 'clone',
	    	zIndex : 2000,
	    	
	    	start: function(event, ui)	{
	    		p("Q Start");
	    		dropOut =0;
	    		sortableIn = 0;
	    		swapIn =0;
	    		$('#quick-menu').addClass('dragging');
	    	},
	    	stop: function(event, ui){
	    		p("Q Stop");
	    		$('#quick-menu').removeClass('dragging');
	    		resetDragStates();
	    	},
	    	
	});
}

function deleteBookMark(data_id){
	var bookmark = $("#bookmark_" + data_id); //quick-menu item
	
	var menuItem = $("#components_" + data_id); //menu item
	bookmark.hide();

	menuItem.removeClass('moved').draggable(); //initialising if not (in case of rendered bookmarks)
	menuItem.draggable('enable'); 
	qlog('completed');
	//TODO : Call webservice
}

function addToBookMark(data_id){

	var bookmark = $("#bookmark_" + data_id); //quick-menu item
	
	qlog(bookmark);
	//bookmark.addClass('in-quick-menu');
	var menuItem = $("#components_" + data_id); //menu item

	menuItem.addClass('moved').draggable( "disable" );
	
	qlog('bookmark added for id'+data_id);

	//TODO : Call webservice

}

function resetDragStates(){
	$("#quick-menu a:hidden").remove(); 
	var count = $("#quick-menu a:visible").length;
	//When removing, the item getting removed is still counted. reducing that
	if ((dropOut == 0) && (swapIn == 0) && isFirstTime == false) count--;  
	qlog("count: " + count);
	enableQuickMenuDragging();
	if(count > 0){
		$("#quick-menu").addClass('has-items');
	}
	else{
		$("#quick-menu").removeClass('has-items');
	}
	if (count >= limit){
		disableMenuDragging();
	} else {
		enableMenuDragging();
	}

}


var setUpAdmin = function(viewDom, delegate) {


	this.delegate = delegate;
	var that = this;
	enableQuickMenuDragging();
	enableMenuDragging();
	resetDragStates();

	isFirstTime = false;	
	$("#quick-menu").droppable({

		drop: function(event, ui)	{
			p("Drop");

			if(ui.draggable.hasClass('in-quick-menu') == true){
				qlog('the swap case');
				swapIn =1;	
				ui.draggable.remove();
			} else {
				dropOut =1;
				
			}
		},

	});

	$("#quick-menu").sortable({

		receive: function(){
			sortableIn = 1;
		},
		over: function(event,ui){
			p('in over');
			sortableIn = 1;

		},
		out:function(event,ui){
			p("Out");
			sortableIn = 0;
			if(swapIn ==1) return; // No action for Swap;
			if(dropOut == 0) {
				var data_id = ui.item.attr("data-id");
				qlog("Out : deleting "+ data_id);
				that.delegate.bookMarkRemoved(data_id);
				deleteBookMark(data_id);
				//resetDragStates();
			}

		},
		beforeStop: function(event,ui){
			p('before stop');
			if(swapIn ==1) return; // No action for Swap;
			var in_quick_menu = ui.item.hasClass('in-quick-menu');
			//TODO: Handle swap
			if(in_quick_menu == true){
				p('BS in-q me');
				var data_id = ui.item.attr("data-id");
				qlog("BS : deleting "+ data_id);
				that.delegate.bookMarkRemoved(data_id);
				deleteBookMark(data_id);	
			} else{
				p('BS NOT in-q me');
				var item = ui.item;
				var data_id = item.attr("data-id");
				item.attr("id", "bookmark_" + data_id); //Let us set Id for cloned item
				
				// initially it isn't calculating ui.item's outerwidth correctly.
               	// adding has-items will help us to calculate that correctly
               	$("#quick-menu").addClass('has-items');				

				var bookMarkWidth = parseInt(ui.item.outerWidth());
				that.delegate.bookMarkAdded(data_id);
				addToBookMark(data_id);
				$(ui.item).css('width', bookMarkWidth + 10).addClass('in-quick-menu'); //TODO: bookmarkwidth

			}
		},

		stop : function(event, ui){
			p("sortable stop");
			//We are hiding some elements initially. Remove them here.
			

		}
	

	});





	// Change hotel
	$(document).on('click', '#change-hotel h1', function(e){
		$('#change-hotel').toggleClass('open');
	});

	$('#content').css('opacity','0').delay(200).animate({opacity:1},400);
// Keep app in fullscreen mode
   	var isTablet = navigator.userAgent.match(/Android|iPad/i) != null;
   	
   	if (isTablet) {
		$('a:not(.nav-toggle):not(.edit-data-inline):not(.add-data-inline):not(.admin-left-nav)').click(function(e){
			e.preventDefault();
			location.href = $(this).attr("href");
		});
	}	
	// Dashboard tabs
		$('.tabs').tabs({
			beforeActivate: function( event, ui ) {
				var $prevTab = ui.oldPanel.attr('id'),
					$nextTab = ui.newPanel.attr('id');

				$('#' + $prevTab).fadeOut(300);
		        $('#' + $nextTab).fadeIn(300);
			}
		  
		});	
		
/*	$('#tabs-menu').jScrollPane({
   			autoReinitialise    : true,
         	animateScroll       : true,
         	mouseWheelSpeed     : 50
     	});*/

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
//function to select/unselect emails => zest checkin and checkout
function setupSelection(){
	// Select all checkboxes 
        $(document).on('click','#select-all', function(e) {
            $('#guests').find(':checkbox').prop('checked', this.checked);
        });

        // Single checkbox click
        $(document).on('click', 'input[type="checkbox"].guest' , function(e) {
            var $rows = $('#guests > tbody > tr').length,
                $selectedRows = $("input.guest:checked").length; 

            // If some are unselected, deselect top checkbox
            if($selectedRows < $rows) {
                $('#select-all').prop('checked', false);
            } else if($selectedRows == $rows) {
                $('#select-all').prop('checked', true);
            }
        });

        // Toggle button state on any checbox click
        $(document).on('click', 'input[type="checkbox"]' , function(e) {           
            var $selectedRows = $("input.guest:checked").length,
                $disabledButton = ($selectedRows > 0) ? '' : 'disabled',
                $buttonClass = ($selectedRows > 0) ? 'blue' :'grey';

            if ($disabledButton){ 
                $('#send-email.button').attr({
                    'disabled'  : 'disabled',
                    'class'     : 'button ' + $buttonClass
                });
            } else {
                $('#send-email.button').removeAttr('disabled').attr('class', 'button ' + $buttonClass);
            }

        });
}
