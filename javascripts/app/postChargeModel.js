var PostChargeModel = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	this.url = 'staff/items/'+that.reservation_id+'/get_items';
	this.itemCompleteList = [];
	this.currentList = [];
	this.currentQuery = "";
	this.action = "QTY";
	this.isMinus = true;
	this.number = "";
	this.temp_action = "QTY";
	this.temp_number = "";
	this.is_undo = false;
	
	this.delegateEvents = function() {
		
		// Append bill number on modal while click +ADD from bill card page.
		this.origin = this.params.origin;
				
		if(this.origin == views.BILLCARD){
			that.myDom.find("#select-bill-number").hide();
			that.myDom.find(".h2.message").append(this.params.bill_number);
		}

		// Set scrollers
		createVerticalScroll('#items-listing');
		createVerticalScroll('#items-summary');
	
		// Events
		that.myDom.find("#items-listing").on("click", that.clickItemList);
		that.myDom.find("#items-summary").on("click", that.clickItemListSummary);
		that.myDom.find("#charge-groups").on("change", that.changedChargeGroup);
  		that.myDom.find('#query').on('keyup paste', that.queryEntered);
  		that.myDom.find('#clear-query').on('click', that.clearResults);
		that.myDom.find('#post').on('click', that.postCharge);
		that.myDom.find('#numpad').on('click', that.clickedNumberPad);
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

		        // Refresh scroll to top
		        refreshVerticalScroll('#items-listing', 0);
	        }
	        else{
	    		var html = "<div id='no-items-added' class='no-content'><div class='info'><strong class='h1'>No items found</strong></div></div>";
	            that.myDom.find('#search-item-results').html(html);
	        }
    	}
    	catch(e){
    			var html = "<div id='no-items-added' class='no-content'><div class='info'><strong class='h1'>No items found</strong></div></div>";
	            that.myDom.find('#search-item-results').html(html);
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
	
	// success function call of .ajax in fetchItemList
	this.fetchCompletedOfFetchItemList = function(response){
		that.itemCompleteList = response.data.items;
		for(var i = 0; i < that.itemCompleteList.length; i++){
			that.itemCompleteList[i].count = 0;
			that.itemCompleteList[i].unit_price = parseFloat(that.itemCompleteList[i].unit_price).toFixed(2)
		}
		that.currentList = that.itemCompleteList;
	};


	// To fetch items data from API , initializing count of each item - store locally.
	this.fetchItemList = function() {
		var webservice = new WebServiceInterface();	    	
	    var url = '/staff/items/'+that.reservation_id+'/get_items.json'; 
	    var options = {
	    	loader: 'BLOCKER',
			successCallBack: that.fetchCompletedOfFetchItemList
		};
	    webservice.getJSON(url, options);		
	};

	// Selected item in charges to be posted list
	this.clickItemListSummary = function(e) {
		var element = $(e.target).closest('li');

		if (!element.hasClass('selected')) {
			that.myDom.find('#items-summary li.selected').removeClass('selected');
		}
		element.toggleClass('selected');
		
		that.number = "";
		that.is_undo = false;
	};

	// Add item to charges to be posted list
	this.clickItemList = function(e) {
		
		var element = $(e.target).closest('a');
		
		if(element.hasClass('button white')){
		
			e.preventDefault();
			e.stopImmediatePropagation();
	
			var $id = element.attr('data-id'),
			$item = element.attr('data-item'),
			$price = parseFloat(element.attr('data-price')).toFixed(2),
			$data_cc = element.attr('data-cc'),
			$currency_code = getCurrencySymbol(element.attr('data-cc')),
			$base = element.attr('data-base');
			
			// To get count of the clicked item
			var current_item_count = parseInt(that.getItemCount($id));
			var is_item_present_in_item_summary = false;
			
			that.myDom.find("#items-summary li" ).each(function() {
				if($id == $(this).attr('data-id')){
					is_item_present_in_item_summary = true;
					$price = $(this).find('.base').attr("data-unit-price");
				} 
			});
			
			var $output = $item + ' <span class="count" data-count="1"/><span class="base" data-unit-price="'+$price+'" data-cc="'+$data_cc+'">at ' + $currency_code + $price + ' / ' + $base + '</span><span class="price">'+$currency_code+' <span class="value">' + $price + '</span></span>';
	
			// Update right side panel
			if(that.myDom.find('#items-added.hidden')) {
				that.myDom.find('#no-items-added').addClass('hidden');
				that.myDom.find('#items-added.hidden').removeClass('hidden');
			}
		
			// First click on a list item - add item to item summary 
			if (!is_item_present_in_item_summary) {
				
				$('<span class="count" />').appendTo(element);
				var totalChargeHTML = "Total <span class='price'>"+$currency_code+" <span class='value'>0</span></span>";
				that.myDom.find('#total-charge').html(totalChargeHTML);
				// Add item to list
				var items = [];
				items.push($('<li data-id="' + $id + '" />').html($output));
				that.myDom.find('#items-summary ul').append.apply(that.myDom.find('#items-summary ul'), items);
	
				if(that.myDom.find('#items-summary li').length > '4') {
					// Refresh scroll to bottom
		        	refreshVerticalScroll('#items-summary', -(that.myDom.find('#items-summary li').length - 4) * 50);
					that.myDom.find('#total-charge').removeAttr('class');
				}
				else {
					that.myDom.find('#total-charge').removeAttr('class').addClass('offset-' + that.myDom.find('#items-summary li').length);
				}
				that.updateItemCount($id,current_item_count+1);
			}
	
			// Other clicks - increase count and value
			else{
				// Update item count
				that.updateItemCount($id,current_item_count+1);
				// Update item price
				that.updateItemPrice($id,current_item_count+1,$price);
			}
			// Update Total price
			that.updateTotalPrice();
	
			// Refresh scroll
			var $style = that.myDom.find('#items-listing .wrapper').attr('style').split('transform: translate('), 
				$translate = $style[1].split(')')[0], 
				$current = $translate.split(',')[1], 
				$target = $current.split('px')[0];

			refreshVerticalScroll('#items-listing', parseInt($target));
		}
	};
	//To get count of item - paasing item Id.
	this.getItemCount = function(itemId){
		for(var i=0; i < that.itemCompleteList.length; i++){
			if(itemId == that.itemCompleteList[i].value){
				var item_count = that.itemCompleteList[i].count;
				return item_count;
			}
		}
	};
	//To get count of item - paasing item Id.
	this.getItemUnitPrice = function(itemId){
		for(var i=0; i < that.itemCompleteList.length; i++){
			if(itemId == that.itemCompleteList[i].value){
				var temp_unit_price = that.itemCompleteList[i].temp_unit_price;
				return temp_unit_price;
			}
		}
	};
	//To update "item count" in items-listing and items-summary and Update Item List Array.
	this.updateItemCount = function(id,value){
		// Update Item List Array with item count
		for(var i=0; i < that.itemCompleteList.length; i++){
			if(id == that.itemCompleteList[i].value){
				that.itemCompleteList[i].count = value;
				that.itemCompleteList[i].temp_unit_price = that.itemCompleteList[i].unit_price;
				var current_item_count = parseInt(that.itemCompleteList[i].count);
			}
		}
		
		if(current_item_count == 0) {
			that.myDom.find('#items-summary ul').find('li[data-id="' + id + '"] .count').text("");
			that.myDom.find('#items-listing ul').find('a[data-id="' + id + '"] .count').remove();
		}
		else if(current_item_count == 1) {
			var element = that.myDom.find('#items-listing ul').find('a[data-id="' + id + '"]');
			$('<span class="count" />').appendTo(element);
			that.myDom.find('#items-listing ul').find('a[data-id="' + id + '"] .count').text(current_item_count);
			that.myDom.find('#items-summary ul').find('li[data-id="' + id + '"] .count').text("");
			that.myDom.find('#items-summary ul').find('li[data-id="' + id + '"] .count').attr('data-count',(current_item_count || 0));
		}
		else{
			var element = that.myDom.find('#items-listing ul').find('a[data-id="' + id + '"]');
			$('<span class="count" />').appendTo(element);
			// Update count in items-listing
			that.myDom.find('#items-listing ul').find('a[data-id="' + id + '"] .count').text(current_item_count || 0);
			// Update count in items-summary
			that.myDom.find('#items-summary ul').find('li[data-id="' + id + '"] .count').text('(' + (current_item_count || 0) + ')');
			that.myDom.find('#items-summary ul').find('li[data-id="' + id + '"] .count').attr('data-count',(current_item_count || 0));
		}
	};
	
	//To update "item amount" in items-summary
	this.updateItemPrice = function(id,item_count,unit_price){
		var price = parseFloat(unit_price * item_count || 0).toFixed(2);
		that.myDom.find('#items-summary ul').find('li[data-id="' + id + '"] .value').text(price);
	};
	
	//To update "item amount" in items-summary
	this.updateUnitPrice = function(id,unit_price,data_cc){
		
		// Update Item List Array with item unit price
		for(var i=0; i < that.itemCompleteList.length; i++){
			if(id == that.itemCompleteList[i].value){
				that.itemCompleteList[i].temp_unit_price = unit_price;
			}
		}
		
		var unitPriceHtml = "at "+getCurrencySymbol(data_cc)+""+unit_price+" / unit";
		that.myDom.find('#items-summary ul').find('li[data-id="' + id + '"] .base').text(unitPriceHtml);
		that.myDom.find('#items-summary ul').find('li[data-id="' + id + '"] .base').attr("data-unit-price",unit_price);
	};
	
 	// To update "total price amount" in items-summary.
	this.updateTotalPrice = function(){
		// Update total charge price
		var totalPrice = 0;
		that.myDom.find('#items-summary li .value').each(function() {
			totalPrice += parseFloat(1 * ($(this).text()));
		});
		that.myDom.find('#total-charge .value').text(totalPrice.toFixed(2));
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

		// Refresh scroll
		refreshVerticalScroll('#items-listing');
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
		
		// Refresh scroll
		refreshVerticalScroll('#items-listing');
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
		
		// Refresh scroll
		refreshVerticalScroll('#items-listing');
	};
	
	// Post charge.
	this.postCharge = function(){
		
		var data = {};
	    data.reservation_id = that.reservation_id;
	    var bill_number = $("#select-bill-number").find('option:selected').val();
	    
		// Fetch the total balance unless originating from the bill card
		data.fetch_total_balance = that.origin != views.BILLCARD;
				
	    data.bill_no = (that.params.bill_number === undefined) ? bill_number :that.params.bill_number;
	    data.total = that.myDom.find("#total-charge .value").text();
	    data.items = [];
	    
	    that.myDom.find("#items-summary li" ).each(function() {
	    	var obj ={
	    		"value" : $(this).attr('data-id'),
	    		"amount" : $(this).find('.value').text(),
	    		"quantity" : $(this).find('.count').attr('data-count')
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
	    
	};
	
	// success callback on post cahrges
	this.fetchCompletedOfPostCharge = function(response){
		 sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
		 that.hide();
		 if(that.origin == views.BILLCARD){
		 	callBack(); //To Reload page on bill card 
		 }
		 // To update stay card balance amount
		 var currentConfirmNumber = response.data.confirmation_number;
		 var html = getCurrencySymbol(response.data.currency_code) +" "+ response.data.total_balance_amount;
		 $("#reservation-"+currentConfirmNumber+" .balance .h1").html("");
		 $("#reservation-"+currentConfirmNumber+" .balance .h1").html(html);
		 if(response.data.total_balance_amount > 0) $("#reservation-"+currentConfirmNumber+" .balance .h1").removeClass('green').addClass('red');
		 
	};
	
	// failure callback on post cahrges
	this.fetchFailedOfPostCharge = function(errorMessage){
		 sntapp.notification.showErrorMessage(errorMessage, that.myDom);	
	};
	
	// Number pad clicks
	this.clickedNumberPad = function(e){
		
		var element = $(e.target).closest('button');
		var is_active_item_present = false;
		
		// Searching for item-summary for active item.
		that.myDom.find("#items-summary li" ).each(function() {
			if($(this).hasClass('selected')){
			  	is_active_item_present = true;
			  	that.active_item_count = $(this).find('.count').attr('data-count');
			  	that.active_item_id = $(this).attr('data-id');
			  	that.active_item_unit_price = $(this).find('.base').attr('data-unit-price');
			  	that.active_item_data_cc = $(this).find('.base').attr('data-cc');
			  	that.element_active_item = $(this);
			}
		});
	
		if(is_active_item_present && element.hasClass('button')){
			
			var buttonValue = element.val();
			
			switch(buttonValue){
				case "0":
					that.numberClicked("0");
				  break;
				case "1":
					that.numberClicked("1");
				  break;
				case "2":
					that.numberClicked("2");
				  break;
				case "3":
					that.numberClicked("3");
				  break;
				case "4":
					that.numberClicked("4");
				  break;
				case "5":
					that.numberClicked("5");
				  break;
				case "6":
					that.numberClicked("6");
				  break;
				case "7":
					that.numberClicked("7");
				  break;
				case "8":
					that.numberClicked("8");
				  break;
				case "9":
					that.numberClicked("9");
				  break;
				case ".":
					if(that.action == "PRICE" && that.number.indexOf('.') === -1){
						that.number += ".";
					}
				  break;
				case "QTY":
					  that.myDom.find("#price").removeClass('selected');
					  element.addClass('selected');
					  that.action = "QTY";
					  that.number = "";
				  break;  
				case "PR":
					  that.myDom.find("#quantity").removeClass('selected');
					  element.addClass('selected');
					  that.action = "PRICE";
					  that.number = "";
				  break;
				case "undo":
					if(that.is_undo) that.undoButtonClick();
				  break;
				case "delete":
					  that.updateItemCount(that.active_item_id,0);
					  that.element_active_item.remove();
					  that.updateTotalPrice();
					  that.number = "";
					  
					  var item_summary_item_length = that.myDom.find("#items-summary ul li").length;
					  
					  if(item_summary_item_length == "0"){
					  		that.myDom.find("#no-items-added").removeClass('hidden');
					  		that.myDom.find("#items-added").addClass('hidden');
					  }
					  // Move scroller up
					  else {
					  	refreshVerticalScroll('#items-summary', -(that.myDom.find('#items-summary li').length - 1) * 50);
					  }

					  // Update text
					  if(that.myDom.find('#items-summary li').length <= '4') {
					  	that.myDom.find('#total-charge').removeAttr('class').addClass('offset-' + that.myDom.find('#items-summary li').length);
					  }
				  break;
				case "+/-":
					if(that.isMinus){
						that.updateItemPrice(that.active_item_id,-1*that.active_item_count,that.active_item_unit_price);
						that.isMinus = false;
					}
					else{
						that.updateItemPrice(that.active_item_id,1*that.active_item_count,that.active_item_unit_price);
						that.isMinus = true;
					}
					that.updateTotalPrice();
				  break;  
			}
		}
	};
	
	// On clicking Numbers
	that.numberClicked = function(number){
		
		that.is_undo = true;
		that.number += number;
		
		if(that.action == "QTY"){
			
			that.temp_number = that.getItemCount(that.active_item_id);
			
			that.updateItemCount(that.active_item_id,that.number);
			that.updateItemPrice(that.active_item_id,that.number,that.active_item_unit_price);
			that.updateTotalPrice();
			that.temp_action = "QTY";
		}
		else if(that.action == "PRICE"){
			
			that.temp_number = that.getItemUnitPrice(that.active_item_id);
			
			that.active_item_unit_price = that.number;
			that.updateUnitPrice(that.active_item_id,that.active_item_unit_price,that.active_item_data_cc);
			that.updateItemPrice(that.active_item_id,that.active_item_count,that.active_item_unit_price);
			that.updateTotalPrice();
			that.temp_action = "PRICE";
		}
	};
	
	// On undo click
	that.undoButtonClick = function(){
		
		that.number = that.temp_number;
		that.is_undo = false;
		
		if(that.temp_action == "QTY"){
			that.updateItemCount(that.active_item_id,that.temp_number);
			that.updateItemPrice(that.active_item_id,that.temp_number,that.active_item_unit_price);
			that.updateTotalPrice();
		}
		else if(that.temp_action == "PRICE"){
			that.active_item_unit_price = that.temp_number;
			that.updateUnitPrice(that.active_item_id,that.active_item_unit_price,that.active_item_data_cc);
			that.updateItemPrice(that.active_item_id,that.active_item_count,that.active_item_unit_price);
			that.updateTotalPrice();
		}
	};
};