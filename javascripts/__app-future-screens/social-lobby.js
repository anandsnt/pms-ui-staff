$(function($){ 
	
    // Filters
    $(document).on('click', '#filters a', function(e){
        e.preventDefault();
    });

    // Mark as read
    $(document).on('change', '.checkbox input', function(e){

        // Remove checkbox and class
        $(this).parent('.checkbox').animate({opacity: 0}, 300, function(){
            $(this).remove();  
        });

        $(this).closest('.unread').animate({opacity: 0}, 300, function(){
            $(this).removeClass('unread');

             // Check if conversations still has unread posts
            var $unread = $(this).closest('.has-unread').find('.unread').length;
            if ($unread == 0)
            {
                $(this).closest('.has-conversation').removeClass('has-unread');
            }

        }).animate({opacity: 1}, 300);

    });

	// TODO - fire this when item is added, not just on click
    // Add to cart feedback
    $(document).on('click', '#social-lobby form button.soft-red-text, #social-lobby form button.soft-red', function(e){
        e.stopImmediatePropagation();

        modalInit('modals/alerts/posted/', 750);
    });
});