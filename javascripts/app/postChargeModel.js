var PostChargeModel = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	this.url = 'staff/items/'+that.reservation_id+'/get_items';
	this.itemCompleteList = [];
	this.currentList = [];
	this.currentQuery = "";
	
	this.delegateEvents = function() {
		
		// Append bill number on modal while click +ADD from bill card page.
		this.origin = this.params.origin;
		if(this.origin == views.BILLCARD){
			that.myDom.find("#select-bill-number").hide();
			that.myDom.find(".h2.message").append(this.params.bill_number);
		}

		if (viewScroll) {
			destroyViewScroll();
		}
		setTimeout(function() {
			createViewScroll('#items-listing');
			createViewScroll('#items-summary');
		}, 300);
		that.myDom.find("#items-listing").on("click", that.clickItemList);
		that.myDom.find("#items-summary").on("click", that.clickItemListSummary);
		that.myDom.find("#charge-groups").on("change", that.changedChargeGroup);
  		that.myDom.find('#query').on('keyup', that.queryEntered);
  		that.myDom.find('#clear-query').on('click', that.clearResults);
		that.myDom.find('#post').on('click', that.postCharge);
	};

	this.modalInit = function() {
		this.fetchItemList();
	};
	
 	//Clear Search Results 
  	this.clearResults = function(e){
	    //if the method is invoked from other views to clear search results, 'this', 'e' are undefined.
	  	if($(this).hasClass('visible')){  	
	  		$(this).removeClass('visible');
	    }
	    $('#query').val('');
	    that.currentList = that.itemCompleteList;
    	that.showAllItems();
  	};
  
  	//Search items
    this.queryEntered = function(e){
		that.currentQuery = $(this).val();
        // Clear button visibility toggle
    	that.showHideClearQueryButton();
    	
    	that.displaySearchItem();
    	$("#charge-groups").find('option:selected').removeAttr('selected');
    	$("#charge-groups #all-charge-groups").attr('selected','selected');
    };
    
    // To display search results
    this.displaySearchItem = function(){
    	that.myDom.find('#search-item-results').html("");
    	if(that.currentQuery == ""){
    		that.currentList = that.itemCompleteList;
    		that.showAllItems();
        	return false;
      	}
      	
    	try{
	        var items=[];
	        var is_item_found = false;
	        that.currentList = [];
	        $.each(that.itemCompleteList, function(i,value){
	            if ((escapeNull(value.item_name).toUpperCase()).indexOf(that.currentQuery.toUpperCase()) == 0 ){
	            	var $count_html = "";
	            	var html="";
	            	var currency_code = getCurrencySymbol(value.currency_code);
	            	if(value.count > 0) {
						$count_html = '<span class="count">'+value.count+'</span>';
					}
					
					html = '<li id="items-list"><a href="#" data-type="post-charge" data-price="' + value.unit_price + '" data-item="' + value.item_name + '" data-is-favourite="' + value.is_favorite + '" data-id="' + value.value + '" data-charge-group="' + value.charge_group_value + '" data-cc="' + value.currency_code + '" data-base="unit" class="button white">' + value.item_name + '<span class="price"> '+currency_code+' <span class="value">' + value.unit_price + '</span></span>'+$count_html+'</a></li>';
	            	items.push($('#search-item-results').append(html));
	            	is_item_found = true;
	            	that.currentList.push(value);
	            }
    		});
    		
    		if(is_item_found){
    			$.each(items, function(i,value){
		            	that.myDom.find('#search-item-results').append(value).highlight(that.currentQuery);
		        });
	        }
	        else{
	    		var html = "<div id='no-items-added' class='no-content'><strong class='h1'>No items found</strong></div>";
	            that.myDom.find('#search-item-results').html(html);
	        }
    	}
    	catch(e){
	    	that.myDom.find('#search-item-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span></li>');
	    }
    };
    
    // To show and hide clear button on search panel.
	this.showHideClearQueryButton = function(){
	  	if($('#query').val() !== '') {
	        $('#clear-query:not(.visible)').addClass('visible');
	    }
	    else{
	        $('#clear-query.visible').removeClass('visible');
	    }
	};
	
	// To fetch items data from API , initializing count of each item - store locally.
	this.fetchItemList = function() {
		$.ajax({
			type : "GET",
			url: 'staff/items/'+that.reservation_id+'/get_items.json',
			success : function(response) {
				that.itemCompleteList = response.data.items;
				for(var i=0;i<that.itemCompleteList.length;i++){
					that.itemCompleteList[i].count = 0;
				}
				that.currentList = that.itemCompleteList;
			}
		});
	};

	// Selected item in charges to be posted list
	this.clickItemListSummary = function(e) {
		var element = $(e.target);

		if (!element.hasClass('selected')) {
			$('#items-summary li.selected').removeClass('selected');
		}
		element.toggleClass('selected');
	};

	// Add item to charges to be posted list
	this.clickItemList = function(e) {
		
		var element = $(e.target);
		
		if(element.closest('li').prop('id') == "items-list"){
		
			e.preventDefault();
			e.stopImmediatePropagation();
	
			// Count clicks
			element.data('count', 1 + (element.data('count') || 0 ));
	
			var $id = element.attr('data-id'),
			$item = element.attr('data-item'),
			$price = element.attr('data-price'),
			$currency_code = getCurrencySymbol(element.attr('data-cc')),
			$base = element.attr('data-base'),
			$output = $item + ' <span class="count" /><span class="base">at ' + $currency_code + $price + ' / ' + $base + '</span><span class="price">'+$currency_code+'<span class="value">' + $price + '</span></span>';
	
			// Update right side panel
			if (that.myDom.find('#items-added.hidden')) {
				that.myDom.find('#no-items-added').addClass('hidden');
				that.myDom.find('#items-added.hidden').removeClass('hidden');
			}
			
			// To set flag whether the list-item already clicked or not.
			var is_item_selected = 0;
			$("#items-summary li" ).each(function() {
				var id = $(this).attr('data-id')
			  	if(id == $id){
			  		is_item_selected = 1;
			  	} 
			});
			
			// To get count of the clicked item
			var current_item_count ;
			for(var i=0; i < that.itemCompleteList.length; i++){
				if($id == that.itemCompleteList[i].value){
					that.itemCompleteList[i].count ++;
					current_item_count = that.itemCompleteList[i].count;
				}
			}
	
			// First click on a list item - add item to item summary 
			if (!is_item_selected) {
				
				$('<span class="count" />').appendTo(element).text(current_item_count || 0);
	
				// Add item to list
				var items = [];
				items.push($('<li data-id="' + $id + '" />').html($output));
				that.myDom.find('#items-summary ul').append.apply(that.myDom.find('#items-summary ul'), items);
	
				// Set scrollers & position charge total
				if (pageScroll) {
					destroyPageScroll();
				}
				createPageScroll('#items-summary');
	
				if (that.myDom.find('#items-summary li').length > '4') {
					pageScroll.scrollTo(0, -(that.myDom.find('#items-summary li').length - 4) * 45);
					that.myDom.find('#total-charge').removeAttr('class');
				}
				else {
					that.myDom.find('#total-charge').removeAttr('class').addClass('offset-' + that.myDom.find('#items-summary li').length)
				}
			}
	
			// Other clicks - increase count and value
			else {
				
				element.find('.count').text(current_item_count || 0);
				$('#items-summary ul').find('li[data-id="' + $id + '"] .count').text(current_item_count || 0);
	
				// Update count
				if (current_item_count > '1') {
					$('#items-summary ul').find('li[data-id="' + $id + '"] .count').text('(' + (current_item_count || 0) + ')');
				}
	
				// Update price
				var $price = parseFloat($price * current_item_count || 0).toFixed(2);
				$('#items-summary ul').find('li[data-id="' + $id + '"] .value').text($price);
			}
	
			// Update total charge price
			var $totalPrice = 0;
			$('#items-summary li .value').each(function() {
				$totalPrice += parseFloat(1 * ($(this).text()));
			});
			$('#total-charge .value').text($totalPrice.toFixed(2));
	
			// Set scrollers
			var $style = that.myDom.find('#items-listing .wrapper').attr('style').split('transform: translate('), $translate = $style[1].split(')')[0], $current = $translate.split(',')[1], $target = $current.split('px')[0];
	
			if (viewScroll) {
				destroyViewScroll();
			}
			createViewScroll('#items-listing');
			viewScroll.scrollTo(0, parseInt($target));
			
		}

	};

	// To handle charge groups filter
	this.changedChargeGroup = function(e) {
		var element = $(e.target);
		var selectedGroupId = $(element).find('option:selected').attr('id');
		// To apply filter
		if (selectedGroupId == "favorites")
			that.showFavouriteItems();
		else if (selectedGroupId == "all-charge-groups")
			that.showAllItems();
		else
			that.showFilteredItems(selectedGroupId);
	};

	// Filter : To show favourites items
	this.showFavouriteItems = function() {
		that.myDom.find("#items-listing ul").html("");
		var html = '';
		for (var i = 0; i < that.currentList.length; i++) {
			if (that.currentList[i].is_favorite == "true") {
				var currency_code = getCurrencySymbol(that.currentList[i].currency_code);
				var $count_html = "";
				if(that.currentList[i].count > 0) {
					$count_html = '<span class="count">'+that.currentList[i].count+'</span>';
				}
				html += '<li id="items-list"><a href="#" data-type="post-charge" data-price="' + that.currentList[i].unit_price + '" data-item="' + that.currentList[i].item_name + '" data-is-favourite="' + that.currentList[i].is_favorite + '" data-id="' + that.currentList[i].value + '" data-charge-group="' + that.currentList[i].charge_group_value + '" data-cc="' + that.currentList[i].currency_code + '" data-base="unit" class="button white">' + that.currentList[i].item_name + '<span class="price"> '+currency_code+' <span class="value">' + that.currentList[i].unit_price + '</span></span>'+$count_html+'</a></li>';
			}
		}
		that.myDom.find("#items-listing ul").html(html);
	};

	// Filter : To show complete list
	this.showAllItems = function() {
		that.myDom.find("#items-listing ul").html("");
		var html = '';
		for (var i = 0; i < that.currentList.length; i++) {
			var currency_code = getCurrencySymbol(that.currentList[i].currency_code);
			var $count_html = "";
			if(that.currentList[i].count > 0) {
				$count_html = '<span class="count">'+that.currentList[i].count+'</span>';
			}
			html += '<li id="items-list"><a href="#" data-type="post-charge" data-price="' + that.currentList[i].unit_price + '" data-item="' + that.currentList[i].item_name + '" data-is-favourite="' + that.currentList[i].is_favorite + '" data-id="' + that.currentList[i].value + '" data-charge-group="' + that.currentList[i].charge_group_value + '" data-cc="' + that.currentList[i].currency_code + '" data-base="unit" class="button white">' + that.currentList[i].item_name + '<span class="price"> '+currency_code+' <span class="value">' + that.currentList[i].unit_price + '</span></span>'+$count_html+'</a></li>';
		}
		that.myDom.find("#items-listing ul").html(html);
	};

	// Filter : To show selected charge group items
	this.showFilteredItems = function(filterId) {
		that.myDom.find("#items-listing ul").html("");
		var html = '';
		for (var i = 0; i < that.currentList.length; i++) {
			if (that.currentList[i].charge_group_value == filterId) {
				var currency_code = getCurrencySymbol(that.currentList[i].currency_code);
				var $count_html = "";
				if(that.currentList[i].count > 0) {
					$count_html = '<span class="count">'+that.currentList[i].count+'</span>';
				}
				html += '<li id="items-list"><a href="#" data-type="post-charge" data-price="' + that.currentList[i].unit_price + '" data-item="' + that.currentList[i].item_name + '" data-is-favourite="' + that.currentList[i].is_favorite + '" data-id="' + that.currentList[i].value + '" data-charge-group="' + that.currentList[i].charge_group_value + '" data-cc="' + that.currentList[i].currency_code + '" data-base="unit" class="button white">' + that.currentList[i].item_name + '<span class="price"> '+currency_code+' <span class="value">' + that.currentList[i].unit_price + '</span></span>'+$count_html+'</a></li>';
			}
		}
		that.myDom.find("#items-listing ul").html(html);
	};
	
	// Post charge.
	this.postCharge = function(){
		
		var data = {};
	    data.reservation_id = that.reservation_id;
	    var bill_number = $("#select-bill-number").find('option:selected').val();
	    
	    data.bill_no = (that.params.bill_number === undefined) ? bill_number :that.params.bill_number;
	    data.total = that.myDom.find("#total-charge .value").text();
	    data.items = [];
	    
	    that.myDom.find("#items-summary li" ).each(function() {
	    	var obj ={
	    		"value" : $(this).attr('data-id'),
	    		"amount" : $(this).find('.value').text()
	    	};
			data.items.push(obj);
		});
	    
		var url = '/staff/items/post_items_to_bill';
	    var webservice = new WebServiceInterface();
		var options = {
			   requestParameters: data,
			   successCallBack: that.fetchCompletedOfPostCharge,
			   failureCallBack: that.fetchFailedOfPostCharge,
			   loader: 'BLOCKER'
	    };
	    webservice.postJSON(url, options);
	    that.hide();
	};
	
	// success callback on post cahrges
	this.fetchCompletedOfPostCharge = function(){
		 sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
		 if(that.origin == views.BILLCARD){
		 	callBack(); //To Reload page on bill card
		 }
	};
	
	// failure callback on post cahrges
	this.fetchFailedOfPostCharge = function(errorMessage){
		 sntapp.notification.showErrorMessage(errorMessage, that.myDom);	
	};
}; 