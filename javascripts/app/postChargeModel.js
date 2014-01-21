var PostChargeModel = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.reservation_id = getReservationId();
	this.url = "/ui/show?haml_file=modals/postChargeToGuestBill&json_input=registration_card/post_charge.json&is_hash_map=true&is_partial=true";
	this.itemCompleteList = [];
	
	this.delegateEvents = function() {
		this.origin = this.params.origin;
		if (this.origin == "bill_card") {
			$("#select-bill-number").hide();
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
	};

	this.modalInit = function() {
		this.fetchItemList();
		
	};

	this.fetchItemList = function() {
		$.ajax({
			type : "GET",
			url : '/ui/show.json?haml_file=modals/postChargeToGuestBill&json_input=registration_card/post_charge.json&is_hash_map=true&is_partial=true',
			success : function(data) {
				that.itemCompleteList = data.items;
				for(var i=0;i<that.itemCompleteList.length;i++){
					that.itemCompleteList[i].count = 0;
				}
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

		e.preventDefault();
		e.stopImmediatePropagation();

		// Count clicks
		element.data('count', 1 + (element.data('count') || 0 ));

		var $id = element.attr('data-id'),
		$item = element.attr('data-item'),
		$price = element.attr('data-price'),
		$currency_code = getCurrencySymbol(element.attr('data-cc')),
		$base = element.attr('data-base'),
		$output = $item + ' <span class="count" /><span class="base">at ' + $currency_code + $price + ' / ' + $base + '</span><span class="price">$ <span class="value">' + $price + '</span></span>';

		// Update right side panel
		if (that.myDom.find('#items-added.hidden')) {
			that.myDom.find('#no-items-added').addClass('hidden');
			that.myDom.find('#items-added.hidden').removeClass('hidden');
		}
		
		var is_item_selected = 0;
		
		$("#items-summary li" ).each(function() {
			var id = $(this).attr('data-id')
		  	if(id == $id){
		  		is_item_selected = 1;
		  	} 
		});
		
		// To get count of the clicked item
		var $count ;
		for(var i=0; i < that.itemCompleteList.length; i++){
			if($id == that.itemCompleteList[i].value){
				that.itemCompleteList[i].count ++;
				$count = that.itemCompleteList[i].count;
			}
		}

		// First click - add item to list
		if (!is_item_selected) {
			
			$('<span class="count" />').appendTo(element).text($count || 0);

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
			} else {
				that.myDom.find('#total-charge').removeAttr('class').addClass('offset-' + that.myDom.find('#items-summary li').length)
			}
		}

		// Other clicks - increase count and value
		else {
			
			element.find('.count').text($count || 0);
			$('#items-summary ul').find('li[data-id="' + $id + '"] .count').text($count || 0);

			// Update count
			if ($count > '1') {
				$('#items-summary ul').find('li[data-id="' + $id + '"] .count').text('(' + ($count || 0) + ')');
			}

			// Update price
			var $price = parseFloat($price * $count || 0).toFixed(2);
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

	};

	// To handle charge groups filter
	this.changedChargeGroup = function(e) {
		var element = $(e.target);
		var selectedGroupId = $(element).find('option:selected').attr('id');
		// To apply filter
		if (selectedGroupId == "show-fav")
			that.showFavouriteItems();
		else if (selectedGroupId == "show-all")
			that.showAllItems();
		else
			that.showFilteredItems(selectedGroupId);
	};

	// Filter : To show favourites items
	this.showFavouriteItems = function() {
		that.myDom.find("#items-listing ul").html("");
		
		var html = '';
		for (var i = 0; i < that.itemCompleteList.length; i++) {
			if (that.itemCompleteList[i].is_favourite == "true") {
				var currency_code = getCurrencySymbol(that.itemCompleteList[i].currency_code);
				var $count_html = "";
				if(that.itemCompleteList[i].count > 0) {
					$count_html = '<span class="count">'+that.itemCompleteList[i].count+'</span>';
				}
				html += '<li id="items-list"><a href="#" data-type="post-charge" data-price="' + that.itemCompleteList[i].unit_price + '" data-item="' + that.itemCompleteList[i].item_name + '" data-is-favourite="' + that.itemCompleteList[i].is_favourite + '" data-id="' + that.itemCompleteList[i].value + '" data-charge-group="' + that.itemCompleteList[i].charge_group_value + '" data-cc="' + that.itemCompleteList[i].currency_code + '" data-base="unit" class="button white">' + that.itemCompleteList[i].item_name + '<span class="price"> '+currency_code+' <span class="value">' + that.itemCompleteList[i].unit_price + '</span></span>'+$count_html+'</a></li>';
			}
		}
		that.myDom.find("#items-listing ul").html(html);
	};

	// Filter : To show complete list
	this.showAllItems = function() {
		that.myDom.find("#items-listing ul").html("");
		var html = '';
		for (var i = 0; i < that.itemCompleteList.length; i++) {
			var currency_code = getCurrencySymbol(that.itemCompleteList[i].currency_code);
			var $count_html = "";
			if(that.itemCompleteList[i].count > 0) {
				$count_html = '<span class="count">'+that.itemCompleteList[i].count+'</span>';
			}
			html += '<li id="items-list"><a href="#" data-type="post-charge" data-price="' + that.itemCompleteList[i].unit_price + '" data-item="' + that.itemCompleteList[i].item_name + '" data-is-favourite="' + that.itemCompleteList[i].is_favourite + '" data-id="' + that.itemCompleteList[i].value + '" data-charge-group="' + that.itemCompleteList[i].charge_group_value + '" data-cc="' + that.itemCompleteList[i].currency_code + '" data-base="unit" class="button white">' + that.itemCompleteList[i].item_name + '<span class="price"> '+currency_code+' <span class="value">' + that.itemCompleteList[i].unit_price + '</span></span>'+$count_html+'</a></li>';
		}
		that.myDom.find("#items-listing ul").html(html);
	};

	// Filter : To show selected charge group items
	this.showFilteredItems = function(filterId) {
		var html = '';
		for (var i = 0; i < that.itemCompleteList.length; i++) {
			if (that.itemCompleteList[i].charge_group_value == filterId) {
				var currency_code = getCurrencySymbol(that.itemCompleteList[i].currency_code);
				var $count_html = "";
				if(that.itemCompleteList[i].count > 0) {
					$count_html = '<span class="count">'+that.itemCompleteList[i].count+'</span>';
				}
				html += '<li id="items-list"><a href="#" data-type="post-charge" data-price="' + that.itemCompleteList[i].unit_price + '" data-item="' + that.itemCompleteList[i].item_name + '" data-is-favourite="' + that.itemCompleteList[i].is_favourite + '" data-id="' + that.itemCompleteList[i].value + '" data-charge-group="' + that.itemCompleteList[i].charge_group_value + '" data-cc="' + that.itemCompleteList[i].currency_code + '" data-base="unit" class="button white">' + that.itemCompleteList[i].item_name + '<span class="price"> '+currency_code+' <span class="value">' + that.itemCompleteList[i].unit_price + '</span></span>'+$count_html+'</a></li>';
			}
		}
		that.myDom.find("#items-listing ul").html(html);
	};
	
}; 