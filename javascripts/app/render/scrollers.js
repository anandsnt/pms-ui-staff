// Scroll global variables
var pageScroll = new Array(),
    viewScroll = new Array(),
    guestCardScroll = new Array(),
    conversationsScroll = new Array(),
    registrationScroll = new Array(),
    horizontalScroll = new Array();

// Page scroll
    function createPageScroll($target){
        pageScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyPageScroll(){
        for (var i = 0; i < pageScroll.length; i++) {
            pageScroll[i].destroy();
        }
        pageScroll.length = 0;
    }
    function refreshPageScroll(){
        setTimeout(function(){
            for (var i = 0; i < pageScroll.length; i++) {
                pageScroll[i].refresh();
            }
        }, 0);
    }

// View scroll
    function createViewScroll($target){
        viewScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyViewScroll(){
        for (var i = 0; i < viewScroll.length; i++) {
            viewScroll[i].destroy();
        }
        viewScroll.length = 0;
    }
    function refreshViewScroll(){
        setTimeout(function(){
            for (var i = 0; i < viewScroll.length; i++) {
                viewScroll[i].refresh();
            }
        }, 0);
    }

// Guest card scroll
    function createGuestCardScroll($target){
        guestCardScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyGuestCardScroll(){
        for (var i = 0; i < guestCardScroll.length; i++) {
            guestCardScroll[i].destroy();
        }
        guestCardScroll.length = 0;
    }
    function refreshGuestCardScroll(){
        setTimeout(function(){
            for (var i = 0; i < guestCardScroll.length; i++) {
                guestCardScroll[i].refresh();
            }
        }, 0);
    }

// Guest card conversations scroll
    function createConversationsScroll($target){
        conversationsScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyConversationsScroll(){
        for (var i = 0; i < conversationsScroll.length; i++) {
            conversationsScroll[i].destroy();
        }
        conversationsScroll.length = 0;
    }
    function refreshConversationsScroll(){
        setTimeout(function(){
            for (var i = 0; i < conversationsScroll.length; i++) {
                conversationsScroll[i].refresh();
            }
        }, 0);
    }

// Registration scroll
    function createRegistrationScroll($target){
        registrationScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyRegistrationScroll(){
        for (var i = 0; i < registrationScroll.length; i++) {
            registrationScroll[i].destroy();
        }
        registrationScroll.length = 0;
    }
    function refreshRegistrationScroll(){
        setTimeout(function(){
            for (var i = 0; i < registrationScroll.length; i++) {
                registrationScroll[i].refresh();
            }
        }, 0);
    }

// Horizontal scroll
    function createHorizontalScroll($target){
        horizontalScroll.push(new IScroll($target, { mouseWheel: true, scrollX: true, scrollY: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyHorizontalScroll(){
        for (var i = 0; i < horizontalScroll.length; i++) {
            horizontalScroll[i].destroy();
        }
        horizontalScroll.length = 0;
    }
    function refreshHorizontalScroll(){
        setTimeout(function(){
            for (var i = 0; i < horizontalScroll.length; i++) {
                horizontalScroll[i].refresh();
            }
        }, 0);
    }