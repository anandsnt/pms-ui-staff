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

var setUpAdmin = function(viewDom, delegate) {
// $(function($){ 
	this.delegate = delegate;
	that = this;
	
	// Tablet or iPhone?
    var isTablet = navigator.userAgent.match(/Android|iPad/i) != null;
   
   	if (isTablet) {
		// Prevent jump to mobile Safari
		$('a:not(.nav-toggle)').click(function(e){
			e.preventDefault();

			location.href = $(this).attr("href");		
		});
	}

	// Light page load animation
		$('.content').css('opacity','0').delay(200).animate({opacity:1},400);

	// Disabled links
		$(document).on('click', 'a[data-href="disabled"]', function(e){
			e.preventDefault();
		});

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
	        	var bookMarkId = $(ui.item.context).attr("data-id");
	        	that.delegate.bookMarkAdded(bookMarkId);
	        	
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
				$(ui.item).addClass('in-quick-menu');

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

	// Append form before data grid (new item) 
		$(document).on('click', '.add-data-inline', function(e){
			e.preventDefault();

			var $target = $(this).attr('href'),
				$item = $(this).attr('data-item'),
				$formHolder = '<div id="add-new" class="edit-data"><div class="data-holder" /></div>';

			// Remove on second click
			if ($('#add-new').length)
			{
				$('#add-new').fadeOut(300);
				setTimeout(function() {
					$('#add-new').remove();
				}, 300);
			}

			// Other edit form is already loaded, we need to remove it first
			else if ($('.edit-data').length && $('.edit-data').attr('id') != 'add-new')
			{
				// Remove previous
				$('.edit-data').fadeOut(300).remove();
				$('tr.hide-content').removeClass('hide-content');

				// Load new
				$($formHolder).insertAfter('.content-title').hide();
				loadInlineForm($target, $item);
			}

			// Load data if not second click
			else 
			{
				// Load new
				$($formHolder).insertAfter('.content-title').hide();
				loadInlineForm($target, $item);
			}		
		});

	// Append form to data grid (edit item) 
		$(document).on('click', '.edit-data-inline', function(e){
			e.preventDefault();

			var $target = $(this).attr('href'),
				$colspan = $(this).attr('data-colspan'),
				$item = $(this).attr('data-item'),
				$formHolder = '<tr id="edit-' + $item + '" class="edit-data"><td colspan="' + $colspan + '"><div class="data-holder" /></td></tr>';

			// Remove on second click
			if ($('#edit-' + $item).length)
			{
				$('#edit-' + $item).fadeOut(300);
				setTimeout(function() {
					$('#edit-' + $item).remove();
				}, 300);

				$('tr.hide-content').removeClass('hide-content');
			}

			// Other edit form is already loaded, we need to remove it first
			else if ($('.edit-data').length && $('.edit-data').attr('id') != 'edit-' + $item)
			{
				// Remove previous
				$('.edit-data').fadeOut(300).remove();
				$('tr.hide-content').removeClass('hide-content');

				// Load new
				$($formHolder).insertAfter($(this).closest('tr')).hide();
				loadInlineForm($target, $item);
				$(this).closest('tr').addClass('hide-content');
			}

			// Load data if not second click
			else 
			{
				// Load new
				$($formHolder).insertAfter($(this).closest('tr')).hide();
				loadInlineForm($target, $item);
				$(this).closest('tr').addClass('hide-content');
			}		
		});

	// Change edit data type
		$(document).on('click', '.change-data', function(e){
			var $target = $(this).attr('data-type');

			if ($target != 'textbox'){

				// Hide previous and show new fields 
				$('.data-type:visible').addClass('hidden');
				$('#entry-' + $target).removeClass('hidden');

				// Empty data from previous fields except those that are in DB already
				$('.data-type:visible input:not(.predefined)').val('');

				// Delete all dynamically added fileds which are now emtpy
				$('.data-type:visible input.delete-option').parent('.entry').remove();
			}
			// If textbox, just hide visible data type option
			else {
				// Hide previous
				$('.data-type:visible').addClass('hidden');

				// Empty data from previous fields except those that are in DB already
				$('.data-type:visible input:not(.predefined)').val('');

				// Delete all dynamically added fileds which are now emtpy
				$('.data-type:visible input.delete-option').parent('.entry').remove();
			}
		});

	// Add new text option 
		var $textOptionStart = 53;
		$(document).on('keyup', '.add-new-option', function(e){
			var $type = $(this).attr('data-type');

			$textOptionStart++;

			$(this)
				.clone() 											// Clone element
				.val('') 											// Clear value
				.attr('id', $type + '-option' + $textOptionStart) 	// Increment ID value
				.insertAfter($(this).parent('.entry'))				// Insert after this one
				.wrap('<div class="entry" />');						// Wrap to div

			// Set new class
		    $(this).removeClass('add-new-option').addClass('delete-option');    
		});

	// Add new checkbox option, step 1 - create text field
		var $checkboxOptionStart = 48;
		$(document).on('click', '.add-new-checkbox', function(e){
			var $type = $(this).attr('data-type'),
				$deleteIcon = '<span class="icons icon-delete" />';

			$checkboxOptionStart++;

			// Clone add new option
			$(this).clone().insertAfter($(this));

			// Add text field
			$(this).removeClass('add-new-checkbox').text('');

			$('<input type="text" value="" />')
				.attr('name', $type)
		     	.attr('id', $type + '-option' + $checkboxOptionStart)
		     	.attr('class', 'checkbox-value')
		     	.appendTo($(this));
		});

	// Add new checkbox option, step 2 - convert text field to checkbox field if value entered
		$(document).on('focusout', '.checkbox-value', function(e){
			var $value = $(this).val();

			// If value is entered
			if ($value)
			{
				// First change input type
				$(this)
					.attr('type', 'checkbox')
					.attr('checked', 'checked')
					.removeAttr('class');

				// Now update with new value
				var $icons = '<span class="icons icon-delete" /><span class="icon-form icon-checkbox checked" />',
					$input = $(this).parent().html(),
					$text = $(this).val();

				$(this).parent()
					.addClass('checkbox checked')
					.removeAttr('data-type')
					.html($icons + $input + $text);
			}
			// No value
			else
			{
				$(this).parent().remove();
			}
		});

	// Delete new option when text is deleted
		$(document).on('keyup', '.delete-option', function(e){
			if ($(this).val() == '')
			{
				$(this).parent('.entry').remove();
			}	
		});

	// Delete checkbox
	    $(document).on('click', '.checkbox .icon-delete', function(e){
	        e.stopImmediatePropagation();
	        $(this).parent('.checkbox').remove();
	    });

	// DataTables
		if ($('.datatable').length)
		{
			var $ajaxSource = $('.datatable').attr('data-source'),
				$dataTableSource = $ajaxSource !== null ? $ajaxSource : null,
				$activateColumn = $('.datatable').attr('data-activate'),
				oTable = $('.datatable').dataTable({
					'bProcessing'		: true,
					'sAjaxSource'		: $dataTableSource,
					'sAjaxDataProp'		: 'data',
					'bAutoWidth'		: false,
					'sPaginationType'	: 'full_numbers',
					'aoColumnDefs': [
						{ 'sClass': 'activate', 'aTargets': [ parseInt($activateColumn) ] },
						{  bSortable: false, aTargets: [ parseInt($activateColumn) ] }
					]
				});

			// Filter by chain or brand 
			$('.content-title .filter').each( function(i){
				$('select', this).change( function(){
					oTable.fnFilter( $(this).val(), i );
				});
			});

			// Move info and pagination into tfoot
			$('.dataTables_info').detach().appendTo('.datatable-info');
			$('.dataTables_paginate').detach().appendTo('.datatable-paginate');
		}
// });
};