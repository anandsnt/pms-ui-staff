// Scroll global variables
var pageScroll = new Array(),
    viewScroll = new Array(),
    guestCardScroll = new Array(),
    conversationsScroll = new Array(),
    registrationScroll = new Array(),
    verticalScroll = new Array(),
    horizontalScroll = new Array();

// Page scroll
    function createPageScroll($target){
        //pageScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyPageScroll(){
        /*for (var i = 0; i < pageScroll.length; i++) {
            pageScroll[i].destroy();
        }
        pageScroll.length = 0;*/
    }
    function refreshPageScroll(){
        /*setTimeout(function(){
            for (var i = 0; i < pageScroll.length; i++) {
                pageScroll[i].refresh();
            }
        }, 0);*/
    }

// View scroll
    function createViewScroll($target){
        //viewScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyViewScroll(){
        /*for (var i = 0; i < viewScroll.length; i++) {
            viewScroll[i].destroy();
        }
        viewScroll.length = 0;*/
    }
    function refreshViewScroll(){
       /* setTimeout(function(){
            for (var i = 0; i < viewScroll.length; i++) {
                viewScroll[i].refresh();
            }
        }, 0);*/
    }

// Guest card scroll
    function createGuestCardScroll($target){
        //guestCardScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyGuestCardScroll(){
        /*for (var i = 0; i < guestCardScroll.length; i++) {
            guestCardScroll[i].destroy();
        }
        guestCardScroll.length = 0;*/
    }
    function refreshGuestCardScroll(){
        /*setTimeout(function(){
            for (var i = 0; i < guestCardScroll.length; i++) {
                guestCardScroll[i].refresh();
            }
        }, 0);*/
    }

// Guest card conversations scroll
    function createConversationsScroll($target){
        //conversationsScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyConversationsScroll(){
        /*for (var i = 0; i < conversationsScroll.length; i++) {
            conversationsScroll[i].destroy();
        }
        conversationsScroll.length = 0;*/
    }
    function refreshConversationsScroll(){
        /*setTimeout(function(){
            for (var i = 0; i < conversationsScroll.length; i++) {
                conversationsScroll[i].refresh();
            }
        }, 0);*/
    }

// Registration scroll
    function createRegistrationScroll($target){
        //registrationScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
    }
    function destroyRegistrationScroll(){
        /*for (var i = 0; i < registrationScroll.length; i++) {
            registrationScroll[i].destroy();
        }
        registrationScroll.length = 0;*/
    }
    function refreshRegistrationScroll(){
        /*setTimeout(function(){
            for (var i = 0; i < registrationScroll.length; i++) {
                registrationScroll[i].refresh();
            }
        }, 0);*/
    }

// Vertical scroll
    function createVerticalScroll($target, $startingPosition){
        setTimeout(function(){
            // Destroy it first if it already exists in the array
            destroyVerticalScroll($target);

            // Create new vertical scroll
            verticalScroll.push(new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' }));
            
            // Move it to defined position, if one exists
            if ($startingPosition && typeof $startingPosition !== 'undefined') {
                for (var i = 0; i < verticalScroll.length; i++) {
                    var $activeScroller = String(verticalScroll[i].wrapper.id),
                        $currentScroller = $target.split('#')[1];

                        if($activeScroller == $currentScroller) {
                            verticalScroll[i].scrollTo(0, $startingPosition, 10);

                            console.log($currentScroller + " starts at " + $startingPosition);
                        }
                }
            }

            // Info
            console.dir(verticalScroll);
        }, 300);
    }

    function destroyVerticalScroll($target){
        // Go trough all scrollers and remove previous version of the one we want to add
        for (var i = 0; i < verticalScroll.length; i++) {
            var $activeScroller = String(verticalScroll[i].wrapper.id),
                $currentScroller = $target.split('#')[1];
            
            if($activeScroller == $currentScroller) {
                verticalScroll[i].destroy();
                verticalScroll.splice(i, 1);

                console.log($currentScroller + " removed");
                break;
            }
        }
    }

    function refreshVerticalScroll($target, $startingPosition) {
        setTimeout(function(){
            // If defined, refresh only target
            if ($target && typeof $target !== 'undefined') {
                for (var i = 0; i < verticalScroll.length; i++) {
                    var $activeScroller = String(verticalScroll[i].wrapper.id),
                        $currentScroller = $target.split('#')[1];

                    if($activeScroller == $currentScroller) {
                        verticalScroll[i].refresh();

                        if ($startingPosition && typeof $startingPosition !== 'undefined') {
                            verticalScroll[i].scrollTo(0, $startingPosition, 10);

                            console.log($currentScroller + " moved to " + $startingPosition);
                        }

                        console.log($currentScroller + " refreshed!");
                        break;
                    }
                }
            }  
            // Refresh all available
            else {
                for (var i = 0; i < verticalScroll.length; i++) {
                    verticalScroll[i].refresh();
                    console.log("Refreshed all vertical scrollers");
                }
            }
        }, 300);
    }

    function disableVerticalScroll($target) {
        for (var i = 0; i < verticalScroll.length; i++) {
            var $activeScroller = String(verticalScroll[i].wrapper.id),
                $currentScroller = $target.split('#')[1];

            if($activeScroller == $currentScroller) {
                verticalScroll[i].disable();

                console.log($currentScroller + " disabled");
                break;
            }
        }      
    }

    function enableVerticalScroll($target) {
        for (var i = 0; i < verticalScroll.length; i++) {
            var $activeScroller = String(verticalScroll[i].wrapper.id),
                $currentScroller = $target.split('#')[1];

            if($activeScroller == $currentScroller) {
                verticalScroll[i].enable();

                console.log($currentScroller + " enabled");
                break;
            }
        }      
    }

// Horizontal scroll
    function createHorizontalScroll($target, $startingPosition){
        setTimeout(function(){
            // Destroy it first if it already exists in the array
            destroyHorizontalScroll($target);

            // Create new vertical scroll
            horizontalScroll.push(new IScroll($target, { mouseWheel: true, scrollX: true, scrollY: false, scrollbars: true, scrollbars: 'custom' }));
            
            // Move it to defined position, if one exists
            if ($startingPosition && typeof $startingPosition !== 'undefined') {
                for (var i = 0; i < horizontalScroll.length; i++) {
                    var $activeScroller = String(horizontalScroll[i].wrapper.id),
                        $currentScroller = $target.split('#')[1];

                        if($activeScroller == $currentScroller) {
                            horizontalScroll[i].scrollTo(0, $startingPosition, 10);

                            console.log($currentScroller + " starts at " + $startingPosition);
                        }
                }
            }

            // Info
            console.dir(horizontalScroll);
        }, 300);
    }

    function destroyHorizontalScroll($target){
        // Go trough all scrollers and remove previous version of the one we want to add
        for (var i = 0; i < horizontalScroll.length; i++) {
            var $activeScroller = String(horizontalScroll[i].wrapper.id),
                $currentScroller = $target.split('#')[1];
            if($activeScroller == $currentScroller) {
                horizontalScroll[i].destroy();
                horizontalScroll.splice(i, 1);

                console.log($currentScroller + " removed");
                break;
            }
        }
    }

    function refreshHorizontalScroll($target, $startingPosition){
        setTimeout(function(){
            // If defined, refresh only target
            if ($target && typeof $target !== 'undefined') {
                for (var i = 0; i < horizontalScroll.length; i++) {
                    var $activeScroller = String(horizontalScroll[i].wrapper.id),
                        $currentScroller = $target.split('#')[1];

                    if($activeScroller == $currentScroller) {
                        horizontalScroll[i].refresh();

                        if ($startingPosition && typeof $startingPosition !== 'undefined') {
                            horizontalScroll[i].scrollTo(0, $startingPosition, 10);
                            console.log($currentScroller + " moved to " + $startingPosition);
                        }

                        console.log($currentScroller + " refreshed!");
                        break;
                    }
                }
            }  
            // Refresh all available
            else {
                for (var i = 0; i < horizontalScroll.length; i++) {
                    horizontalScroll[i].refresh();
                    console.log("Refreshed all horizontal scrollers");
                }
            }
        }, 300);
    }

    function disableHorizontalScroll($target) {
        for (var i = 0; i < horizontalScroll.length; i++) {
            var $activeScroller = String(horizontalScroll[i].wrapper.id),
                $currentScroller = $target.split('#')[1];

            if($activeScroller == $currentScroller) {
                horizontalScroll[i].disable();

                console.log($currentScroller + " disabled");
                break;
            }
        }      
    }

    function enableHorizontalScroll($target) {
        for (var i = 0; i < horizontalScroll.length; i++) {
            var $activeScroller = String(horizontalScroll[i].wrapper.id),
                $currentScroller = $target.split('#')[1];

            if($activeScroller == $currentScroller) {
                horizontalScroll[i].enable();

                console.log($currentScroller + " enabled");
                break;
            }
        }      
    }