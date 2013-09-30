// Touch listeners
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('drag', function (e) { return true }, false);
document.addEventListener('drop', function (e) { return true }, false);

// Scroll global variables
var pageScroll,
    viewScroll,
    guestCardScroll,
    registrationScroll;

// Page scroll
    function createPageScroll($target){
        pageScroll = new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' });
    }
    function destroyPageScroll(){
        pageScroll.destroy();
        pageScroll = null;
    }
    function refreshPageScroll(){
        setTimeout(function(){
            pageScroll.refresh(); 
        }, 0);
    }

// View scroll
    function createViewScroll($target){
        viewScroll = new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' });
    }
    function destroyViewScroll(){
        viewScroll.destroy();
        viewScroll = null;
    }
    function refreshViewScroll(){
        setTimeout(function(){
            viewScroll.refresh(); 
        }, 0);
    }

// Stay card scroll
    function createGuestCardScroll($target){
        guestCardScroll = new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' });
    }
    function destroyGuestCardScroll(){
        guestCardScroll.destroy();
        guestCardScroll = null;
    }
    function refreshGuestCardScroll(){
        setTimeout(function(){
            guestCardScroll.refresh(); 
        }, 0);
    }

// Registration scrollers
    function createRegistrationScroll($target){
        registrationScroll = new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' });
    }
    function destroyRegistrationScroll(){
        registrationScroll.destroy();
        registrationScroll = null;
    }
    function refreshRegistrationScroll(){
        setTimeout(function(){
            registrationScroll.refresh(); 
        }, 0);
    }