// Scroll global variables
var verticalScroll = new Array(),
    horizontalScroll = new Array();

function getScrollObjectForDiv(obj){

    for ( i in verticalScroll){
        if ($(verticalScroll[i].wrapper).find(obj).length >0)
            return verticalScroll[i];
    }
    return null;
}

// Vertical scroll
    function createVerticalScroll($target, $startingPosition){
        setTimeout(function(){
            // Destroy it first if it already exists in the array
            destroyVerticalScroll($target);

            // Create new vertical scroll
            var scrollObj = new IScroll($target, { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' });
            verticalScroll.push(scrollObj);         

            // Move it to defined position, if one exists
            if ($startingPosition && typeof $startingPosition !== 'undefined') {
                for (var i = 0; i < verticalScroll.length; i++) {
                    var $activeScroller = String(verticalScroll[i].wrapper.id),
                        $currentScroller = $target.split('#')[1];

                    if($activeScroller == $currentScroller) {
                        verticalScroll[i].scrollTo(0, $startingPosition, 10);
                        break;
                    }
                }
            }
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
                        }
                        break;
                    }
                }
            }  
            // Refresh all available
            else {
                for (var i = 0; i < verticalScroll.length; i++) {

                    verticalScroll[i].refresh();
                    if ($startingPosition && typeof $startingPosition !== 'undefined') {
                        verticalScroll[i].scrollTo(0, $startingPosition, 10);
                    }
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
                            break;
                        }
                }
            }
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
                        }
                        break;
                    }
                }
            }  
            // Refresh all available
            else {
                for (var i = 0; i < horizontalScroll.length; i++) {
                    horizontalScroll[i].refresh();
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
                break;
            }
        }      
    }