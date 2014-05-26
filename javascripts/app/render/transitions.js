// Load main page
function changePage($type, $menuActiveItem, $prevPage, $nextPage, $transition, $emptyPrev){

    var $newScreen = new chainedAnimation(),
        $delay = 150;
    
    // Start transitioning when new page is ready
    $('#loading').fadeOut(function(){
        
        // Close navigation panel if open
        if ($('.container.menu-open').length) {
            $newScreen.add(function(){ 
                $('.container').addClass('menu-closing'); 
                $('.nav-toggle.active').each(function(e){
                    $(this).removeClass('active'); 
                });
            });

            $newScreen.add(function(){ $('.container').removeClass('menu-open menu-closing'); }, $delay);
        }

        // Bring in new page
        $newScreen.add(function(){  
            $('#' + $nextPage).addClass('page-current ' + $transition);
            $('.inner-page').removeClass('page-locked').removeClass('page-current');
            $('.main-page').removeClass('prev-page-current');
            $('#' + $prevPage).addClass('set-back');
        }, $delay);

        // Reset transition class & old page
        $newScreen.add(function(){ 
            $('#' + $nextPage).removeClass($transition); 
            $('#' + $prevPage).removeClass('page-current set-back ' + $transition);

            // Add additional classes
            var $additionalClass = $type.split('main-page ');
            $('#' + $nextPage).addClass($additionalClass[1]);
        }, $delay);

        // Empty old page
        if ($emptyPrev == true) {
            $newScreen.add(function(){ 
                $('#' + $prevPage).empty();
            }, $delay);
        }

        $newScreen.start();

        // Clear history mark
        $('#main-menu a[data-href="history"]').removeAttr('data-href');

        // Set active class in the menu
        $('#main-menu a.active').removeClass('active');
        $('#main-menu a[data-page="' + $menuActiveItem + '"]').addClass('active'); 
    }).remove();
    
    // Reset the container class (to reset all inner toggle views)
    setTimeout(function() {
        $('.container').attr({'class': 'container'});
    }, 600);
}

// Switch main page
function switchPage($type, $menuActiveItem, $prevPage, $nextPage, $transition){    
    var $switchScreen = new chainedAnimation(),
        $delay = 300;
    
    // Close navigation panel if open
    if ($('.container.menu-open').length) {
        $switchScreen.add(function(){ 
            $('.container').addClass('menu-closing'); 
            $('.nav-toggle.active').each(function(e){
                $(this).removeClass('active'); 
            });
        });

        $switchScreen.add(function(){ $('.container').removeClass('menu-open menu-closing'); }, $delay);
    }

    // Bring in new page
    $switchScreen.add(function(){  
        $('.inner-page').addClass('set-back');
        $('#' + $nextPage).addClass('page-current ' + $transition);
        $('#' + $prevPage).addClass('set-back');

        // lets also call the pageShow method of the view
        // reinitialize any methods for the view
        var view = $('#' + $nextPage).find('div:first').data('view');
        sntapp.getViewInst(view).pageshow();
    }, $delay);

    // Reset transition class & clear old screen
    $switchScreen.add(function(){ 
        $('#' + $nextPage).removeClass($transition); 
        $('#' + $prevPage).removeClass('page-current set-back ' + $transition);

        $('.inner-page').removeClass('page-locked').removeClass('set-back').removeClass('page-current').empty();
        $('.main-page').removeClass('prev-page-current');
    }, $delay);

    // Empty old page after switch
    $switchScreen.add(function(){ 
        $('#' + $prevPage).empty();
    }, $delay);

    $switchScreen.start();

    // Clear history mark
    $('#main-menu a[data-href="history"]').removeAttr('data-href');

    // Set active class in the menu
    $('#main-menu a.active').removeClass('active');
    $('#main-menu a[data-page="' + $menuActiveItem + '"]').addClass('active');

    // Reset the container class (to reset all inner toggle views)
    setTimeout(function() {
        $('.container').attr({'class': 'container'});
    }, 600);
}

// Load inner page
function changeInnerPage($type, $menuActiveItem, $prevPage, $nextPage, $transition, $emptyPrev){

    var $newScreen = new chainedAnimation(),
        $delay = 150;

    // Start transitioning when new page is ready
    $('#loading').fadeOut(function(){
        
        // Close navigation panel if open
        if ($('.container.menu-open').length) {
            $newScreen.add(function(){ 
                $('.container').addClass('menu-closing'); 
                $('.nav-toggle.active').each(function(e){
                    $(this).removeClass('active'); 
                });
            });

            $newScreen.add(function(){ $('.container').removeClass('menu-open menu-closing'); }, $delay);
        }

        // Bring in new page
        $newScreen.add(function(){  
            $('#' + $nextPage).addClass('page-current ' + $transition);
            $('#' + $prevPage).addClass('set-back');
        }, $delay);

        // Reset transition class & old page
        $newScreen.add(function(){ 
            $('#' + $nextPage).removeClass($transition); 
            $('#' + $prevPage).removeClass('page-current set-back ' + $transition);

            // Add additional classes + clear main active page
            $('.main-page.page-current').removeClass('page-current').addClass('prev-page-current'); 
            var $additionalClass = $type.split('inner-page ');
            $('#' + $nextPage).addClass($additionalClass[1]);
        }, $delay);

        // Empty old page
        if ($emptyPrev == true) {
            $newScreen.add(function(){ 
                $('#' + $prevPage).empty();
            }, $delay);
        }

        $newScreen.start();

        // Mark active item to be loaded from history
        $('#main-menu a.active').attr({'data-href':'history'});

        // Set active class in the menu
        $('#main-menu a.active').removeClass('active');
        $('#main-menu a[data-page="' + $menuActiveItem + '"]').addClass('active');
    }).remove();
    
    // Reset the container class (to reset all inner toggle views)
    setTimeout(function() {
        $('.container').attr({'class': 'container'});
    }, 600);
}

// Load inner page view 
function changeView($type, $menuActiveItem, $prevView, $nextView, $transition, $emptyPrev){

    var $newView = new chainedAnimation(),
        $delay = 150;

    // Lock the current parent view
    $('#' + $nextView).closest('.page-current').addClass('page-locked');
    
    // Start transitioning when new page is ready
    $('#loading').fadeOut(function(){
        // Bring in new view
        $newView.add(function(){  
            $('#' + $nextView).addClass('view-current ' + $transition);
            $('#' + $prevView).addClass('set-back');
        }, $delay);

        // Reset transition class & old page
        $newView.add(function(){ 
            $('#' + $nextView).removeClass($transition); 
            $('#' + $prevView).removeClass('view-current set-back ' + $transition);
        }, $delay);

        // Empty old page
        if ($emptyPrev == true) {
            $newView.add(function(){ 
                $('#' + $prevView).empty();
            }, $delay);
        }

        $newView.start();
    }).remove();

    // Reset the container class (to reset all inner toggle views)
    setTimeout(function() {
        $('.container').attr({'class': 'container'});
    }, 300);
}

// Go back to main page
function goBackToPage($menuActiveItem, $prevPage, $transition){
    var $oldScreen = new chainedAnimation(),
        $delay = 150;

    // Bring in previous page
    $oldScreen.add(function(){  
        $('.prev-page-current').addClass('page-current ' + $transition);
        $('#' + $prevPage).addClass('set-back');
    }, $delay);

    // Remove transition class
    $oldScreen.add(function(){ 
        $('.prev-page-current').removeClass('prev-page-current ' + $transition); 
        $('.page-locked').removeClass('page-locked ' + $transition); 
        $('#' + $prevPage).removeClass('set-back page-current').empty();
    }, $delay);

    $oldScreen.start();

    // Set active class in the menu
    $('#main-menu a.active').removeClass('active');
    $('#main-menu a[data-page="' + $menuActiveItem + '"]').addClass('active');

    // Reset the container class (to reset all inner toggle views)
    setTimeout(function() {
        $('.container').attr({'class': 'container'});
    }, 300);
}

// Go back to previous view on the inner page
function goBackToView($menuActiveItem, $prevView, $transition){
    var $oldView = new chainedAnimation(),
        $delay = 150;

    // Bring in previous page
    $oldView.add(function(){  
        $('.page-locked .nested-view:not(.view-current)').addClass('view-current ' + $transition);
        $('#' + $prevView).addClass('set-back');
    }, $delay);

    // Remove transition class
    $oldView.add(function(){ 
        $('.view-current').removeClass($transition);
        $('.page-locked').removeClass('page-locked ' + $transition);
        $('#' + $prevView).removeClass('set-back view-current').empty();
    }, $delay);

    $oldView.start();

    // Set active class in the menu
    $('#main-menu a.active').removeClass('active');
    $('#main-menu a[data-page="' + $menuActiveItem + '"]').addClass('active');
}

$(function($){

/*  Main screens        *******************************************************/
    
    // First main scren - check is it preloaded or hash from admin app exists
    $('#app-page').ready(function(){

        // If hash exists, try to load targeted screen
        if(window.location.hash) {
            var $pageToShow = window.location.hash.split('#');

            $.ajax({
                type:       'GET',
                url:        $pageToShow[1] + '/',
                dataType:   'html',
                //timeout:    5000,
                success: function(data){
                    $('#page-main-first').html(data);

                    // Set active link in the menu
                    $('#main-menu .active').removeClass('active');
                    $('#main-menu a[data-page="' + $pageToShow[1] + '"]').addClass('active');

                    //Adding a hook, to connect the rendering code to functional view component. 
                    var viewInstance = sntapp.getViewInstance($('#page-main-first'));
                    if(typeof viewInstance !== "undefined"){
                            viewInstance.initialize();
                            viewInstance.pageshow();
                    }

                    // Back buttons in this case need to load data
                    $('.back-button[data-transition]').each(function(e){
                        var $transition = $(this).attr('data-transition');
                        $(this).attr({'data-transition': $transition + ' reload-content'});
                    });
                },
                error: function(jqxhr, status, error){
                    //checking whether a user is logged in
                    if (jqxhr.status == "401") { sntapp.logout(); return;}
                    if (jqxhr.status=="503" || jqxhr.status=="500") {
                        location.href = XHR_STATUS.INTERNAL_SERVER_ERROR;
                        return;
                    }

                    if(jqxhr.status=="422"){
                        location.href = XHR_STATUS.REJECTED;
                        return;
                    }

                    if(jqxhr.status=="404"){
                        location.href = XHR_STATUS.SERVER_DOWN;
                        return;
                    }
                }
            });    

            // Remove the hash 
            history.pushState("", document.title, window.location.pathname);    
        }
        // Load the dashboard when no hash
        else {
            var $pageToShow = '/staff/dashboard/dashboard/';
            if($('body').attr('id') == 'app-page'){
                $.ajax({
                    type:       'GET',
                    url:        $pageToShow,
                    dataType:   'html',
                    //timeout:    5000,
                    success: function(data){
                        $('#page-main-first').html(data);
                        var dashboard = new Dashboard($('#dashboard'));
                        dashboard.initialize();
                        dashboard.pageshow();
                    },
                    error: function(jqxhr, status, error){
                        //checking whether a user is logged in
                        if (jqxhr.status == "401") { sntapp.logout(); return;}
                        if (jqxhr.status=="503" || jqxhr.status=="500") {
                            location.href = XHR_STATUS.INTERNAL_SERVER_ERROR;
                            return;
                        }

                        if(jqxhr.status=="422"){
                            location.href = XHR_STATUS.REJECTED;
                            return;
                        }

                        if(jqxhr.status=="404"){
                            location.href = XHR_STATUS.SERVER_DOWN;
                            return;
                        }
                    }
                });
            }
            
        }

        // Carry on with the animation
        var $showMaster = new chainedAnimation(),
            $delay = 300;
  
        $showMaster.add(function(){ $('.container').removeClass('loading'); }, $delay);
        $showMaster.add(function(){ $('#main-menu').show(); }, $delay);
        $showMaster.start();
    });

    // All other screens - loaded dynamicilly
    $(document).on('click','a[data-transition]:not(.no-auto-bind)',function(e) {
        e.preventDefault();

        // Common variables
        var $loader = '<div id="loading"><div id="loading-spinner" /></div>',
            $href = $(this).attr('href'),
            $transitionPage = $(this).attr('data-transition'),
            $activeMenuItem = $(this).attr('data-page'),
            $reloadOnBack = $transitionPage.indexOf('reload-content') >= 0 ? true : false,
            $reloadInDrawer = $('#' + $activeMenuItem).length > 0 ? false : true,
            $transitionType = $(this).hasClass('back-button') ? 'move-from-left' : 'move-from-right',
            $backPage = $(this).closest('.page-current').attr('id'),
            $backView = $(this).closest('.view-current').attr('id');

        // Different page transitions
        if ($transitionPage.indexOf('main-page') >= 0)
        {
            var $previous = $('.main-page.page-current').attr('id'),
                $next = $('.main-page:not(.page-current)').attr('id');
        }
        else if ($transitionPage.indexOf('inner-page') >= 0)
        {
            var $previous = $('.inner-page.page-current').attr('id'),
                $next = $('.inner-page:not(.page-current)').attr('id');
        }
        else if ($transitionPage.indexOf('nested-view') >= 0)
        {
            var $previous = $('.page-current').find('.nested-view.view-current').attr('id'),
                $next = $('.page-current').find('.nested-view:not(.view-current)').attr('id');
        }


        // Do nothing for active links
        if ($(this).hasClass('active')) 
        {
            return false;
        }

        // Drawer item is already loaded, just switch to it
        else if ($(this).attr('data-href') == 'history' && !$(this).hasClass('active') && $reloadInDrawer == false)
        {

            // ONLY FOR CARD SWIPE
            // dirty hack to find if user is switching back to 
            // search page and trigger its card swipe method
            var toBeCurrent = $(this).data('page');
            if('search' === toBeCurrent){
                sntapp.viewDict['Search'].initCardSwipe();
            };

            var $next = $('#' + $activeMenuItem).closest('.main-page').attr('id');
            switchPage($transitionPage, $activeMenuItem, $previous, $next, 'move-from-left');
            
        }

        // Load next page/view or reload previous view before going back
        else if(!$(this).hasClass('active') && (!$(this).hasClass('back-button') || ($(this).hasClass('back-button') && $reloadOnBack == true)))
        {
            $($loader).prependTo('body').show(function(){
                $.ajax({
                    type:       'GET',
                    url:        $href,
                    dataType:   'html',
                    //timeout:    5000,
                    success: function(data){
                        $('#' + $next).html(data);
                    },
                    error: function(jqxhr, status, error){
                        if (jqxhr.status=="401") { sntapp.logout(); return;}
                        if (jqxhr.status=="503" || jqxhr.status=="500") {
                            location.href = XHR_STATUS.INTERNAL_SERVER_ERROR;
                            return;
                        }

                        if(jqxhr.status=="422"){
                            location.href = XHR_STATUS.REJECTED;
                            return;
                        }

                        if(jqxhr.status=="404"){
                            location.href = XHR_STATUS.SERVER_DOWN;
                            return;
                        }
                        $('#loading').remove();
                    }
                }).done(function(data){
                	if(data[0] == "{"){
                		var result = JSON.parse(data);
                		if (result.status == 'failure') {
                			$('#loading').fadeOut(function(){
                				sntapp.notification.showErrorMessage("Error: "+result.errors , $("#search"));
                			});
                			return false;
                		} 
                	}
                    var viewInstance = null;
                    var instName = $('#'+$next).find('div:first').data('view');

                    if ( sntapp.getViewInst(instName) ) {
                        viewInstance = sntapp.getViewInst(instName);
                    } else {
                        viewInstance = sntapp.getViewInstance($('#'+$next));
                        sntapp.setViewInst(instName, viewInstance);
                    };

                    if(typeof viewInstance !== "undefined"){
                        viewInstance.initialize();
                    }

                    if ($transitionPage.indexOf('main-page') >= 0)
                    {
                        changePage($transitionPage, $activeMenuItem, $previous, $next, $transitionType, $reloadOnBack);
                    }
                    else if ($transitionPage.indexOf('inner-page') >= 0)
                    {
                       changeInnerPage($transitionPage, $activeMenuItem, $previous, $next, $transitionType, $reloadOnBack); 
                    }
                    else if ($transitionPage.indexOf('nested-view') >= 0)
                    {

                       changeView($transitionPage, $activeMenuItem, $previous, $next, $transitionType, $reloadOnBack); 
                    }

                    if(typeof viewInstance !== "undefined"){
                        viewInstance.pageshow();
                    }                   
                });
            });
        }

        // Back buttons no reload
        else if ($(this).hasClass('back-button') && $reloadOnBack == false)
        {
            if ($transitionPage.indexOf('main-page') >= 0 || $transitionPage.indexOf('inner-page') >= 0)
            {
                goBackToPage($activeMenuItem, $backPage, $transitionType);
            }
            else if ($transitionPage.indexOf('nested-view') >= 0)
            {
               goBackToView($activeMenuItem, $backView, $transitionType);
            }

            //TODO: We are using a new view instance here. 
            //It has to be replaced by a singletone instance of the view
            var newViewInstance = sntapp.getViewInstance($('#'+$backPage));
            if(typeof newViewInstance !== "undefined"){
                newViewInstance.pageshow();
            }

        }
        else 
        {
        }
    });

/*  Sign In / Sign Out        *************************************************/
    
    // Close drawer when clicked on content
    $(document).on('click','.page, .nested-view',function(e) {
        var $sameScreen = new chainedAnimation(),
            $delay = 150;

        if ($('.container.menu-open').length) {
            $sameScreen.add(function(){ 
                $('.container').addClass('menu-closing'); 
                $('.nav-toggle.active').each(function(e){
                    $(this).removeClass('active'); 
                });
            });
            $sameScreen.add(function(){ $('.container').removeClass('menu-open menu-closing'); }, $delay);
            $sameScreen.start();
        }
    });

    // Sign in page loaded
    $('#login-page').on('ready', function(){
        setTimeout(function() {
            $('.container').removeClass('loading');
        }, 300);
    });

    // Signing in
    $(document).one('submit', '#login-form', function(e){
        e.preventDefault();
        localStorage.email = $("#email").val();
        var $signingIn = new chainedAnimation(),
            $delay = 300;
  
        $signingIn.add(function(){  $('.container').addClass('signing-in'); }, $delay);
        $signingIn.add(function(){ $('#login-form').submit(); }, $delay);
        $signingIn.start();
    });

    // Signing out
    $(document).on('click', 'a[data-rel="external"]', function(e) {
        e.preventDefault();

        $('.nav-toggle').removeClass('active'); 
        $('.container').removeClass('menu-open');

        var $target = $(this).attr('href'),
            $signingOut = new chainedAnimation(),
            $delay = 300;
  
        $signingOut.add(function(){ $('.container').addClass('signing-out'); }, $delay);
        $signingOut.add(function(){ window.location = $target; }, $delay);
        $signingOut.start();
    });
});