var PostChargeModel = function(callBack){
  	BaseModal.call(this);
  	var that = this;
  	this.reservation_id = getReservationId();
  	this.url = "/ui/show?haml_file=modals/postChargeToGuestBill&json_input=registration_card/post_charge.json&is_hash_map=true&is_partial=true";
  	this.delegateEvents = function(){
  		this.origin = this.params.origin;
  		if(this.origin == "bill_card"){
  			$("#select-bill-number").hide();
  			that.myDom.find(".h2.message").append(this.params.bill_number);
  			}

  		if (viewScroll) { destroyViewScroll(); }
    		setTimeout(function(){
	    	createViewScroll('#items-listing');
	    	createViewScroll('#items-summary');
	    	}, 300);
  		that.myDom.find(".button[data-type='post-charge']").on("click",that.clickItemList);
  		that.myDom.find("#items-summary ").on("click",that.clickItemListSummary);
	};
	
	this.modalInit = function(){
    };
    // Selected item in charges to be posted list
    this.clickItemListSummary = function(e){
	  var element = $(e.target);

	    if(!element.hasClass('selected'))
	    {
	        $('#items-summary li.selected').removeClass('selected');
	    }
	    element.toggleClass('selected');
    };

    // Add item to charges to be posted list
    this.clickItemList = function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        // Count clicks
        $(this).data('count', 1 + ($(this).data('count') || 0 ) );

        var $id = $(this).attr('data-id'),
            $item = $(this).attr('data-item'),
            $price = $(this).attr('data-price'),
            $currency_code = getCurrencySymbol($(this).attr('data-cc')),
            $base = $(this).attr('data-base'),
            $output = $item +' <span class="count" /><span class="base">at ' + $currency_code+ $price + ' / ' + $base + '</span><span class="price">$ <span class="value">' + $price + '</span></span>';

        // Update right side panel
        if (that.myDom.find('#items-added.hidden'))
        {
            that.myDom.find('#no-items-added').addClass('hidden');
            that.myDom.find('#items-added.hidden').removeClass('hidden');
        }

        // First click - add item to list
        if (!$(this).find('.count').length) { 
            $('<span class="count" />').appendTo($(this)).text($(this).data('count') || 0); 

            // Add item to list
            var items=[];
            items.push($('<li data-id="' + $id + '" />').html($output));
            that.myDom.find('#items-summary ul').append.apply(that.myDom.find('#items-summary ul'),items);

            // Set scrollers & position charge total
            if (pageScroll) { destroyPageScroll(); }
            createPageScroll('#items-summary');

            if (that.myDom.find('#items-summary li').length > '4') { 
                pageScroll.scrollTo(0, -(that.myDom.find('#items-summary li').length-4) * 45); 
                that.myDom.find('#total-charge').removeAttr('class');
            }
            else
            {
                that.myDom.find('#total-charge').removeAttr('class').addClass('offset-' + that.myDom.find('#items-summary li').length)
            }
        }

        // Other clicks - increase count and value
        else {
            $(this).find('.count').text($(this).data('count') || 0);
            $('#items-summary ul').find('li[data-id="' + $id + '"] .count').text($(this).data('count') || 0);

            // Update count
            if ($(this).data('count') > '1')
            {
                $('#items-summary ul').find('li[data-id="' + $id + '"] .count').text('(' + ($(this).data('count') || 0) + ')');
            }

            // Update price
            var $price = parseFloat($price * $(this).data('count') || 0).toFixed(2);
            $('#items-summary ul').find('li[data-id="' + $id + '"] .value').text($price);
        }

        // Update total charge price
        var $totalPrice = 0;
        $('#items-summary li .value').each(function(){
            $totalPrice += parseFloat(1*($(this).text()));
        });
        $('#total-charge .value').text($totalPrice.toFixed(2));

        // Set scrollers
        var $style = that.myDom.find('#items-listing .wrapper').attr('style').split('transform: translate('),
            $translate = $style[1].split(')')[0],
            $current = $translate.split(',')[1],
            $target = $current.split('px')[0];

        if (viewScroll) { destroyViewScroll(); }
        createViewScroll('#items-listing');
        viewScroll.scrollTo(0, parseInt($target));
    
    };
    
    // Update charge groups filtering
function updateGroups($selectedGroup, $query){

    // Reset charge groups selection
    var $placeholder = $('#charge-groups option[value=""]');

    if($query.length != 0){
        $placeholder.prop('selected', true);
        
        if ($placeholder.hasClass('placeholder'))
            $('#charge-groups').addClass('placeholder');
    }
    else
    {
        $placeholder.prop('selected', false);
        $('#charge-groups').removeClass('placeholder').find('option[value="' + $selectedGroup + '"]').prop('selected', true);
    }
}

$(function($){ 

    // Charge groups
    var $selectedGroup = $('#charge-groups option:selected').val();
    $(document).on('change', '#charge-groups', function(e){
        $selectedGroup = $(this).find('option:selected').val();

        // TODO - SEARCH FUNCTION GOES HERE (IF GROUP IS CHANGED WHILE SEARCHING)
    });

    // Search items
    $(document).on('keyup', '#query', function(){
        var $query = $(this).val();
        
        // Update charge groups selection
        if ($selectedGroup == 'favorites')
        {
            updateGroups($selectedGroup, $query); 
        }

        // TODO - SEARCH FUNCTION GOES HERE
    });

    // Clear search query
    $(document).on('click', '#clear-query.visible', function(e){
        e.preventDefault();

        // Update charge groups selection
        if ($selectedGroup == 'favorites')
        {
            updateGroups($selectedGroup, '');
        }

        // TODO - RESET SEARCH FUNCTION GOES HERE (RESET VIEW TO LATEST LIST OR FAVORITES LIST)
    });


    


    // Numpad 
    $(document).on('click', '#numpad-options .numpad-toggle', function(e){
        $('#numpad-options .numpad-toggle.selected').removeClass('selected');
        $(this).addClass('selected');
    });
});
    
};