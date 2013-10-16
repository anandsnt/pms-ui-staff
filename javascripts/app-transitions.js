// Chaining with intervals
var chainedAnimation = function(){
    var This = this;
    this._timeoutHandler = null;    
    this.chain = new Array();
    this.currentStep = 0;
    this.isRunning = false;
    this.nextStep = function(){
        This.currentStep = This.currentStep +1;
        if (This.currentStep == This.chain.length)
        {
            This.stop();
        }else
        {
            This.processCurrentStep();
        }
    },
    this.processCurrentStep = function(){
        This._timeoutHandler = window.setTimeout(function(){
            This.chain[This.currentStep].func();
            This.nextStep();
        },This.chain[This.currentStep].time);
    },
    this.start =function(){
        if (This.chain.length == 0)
        {
            return;
        }
        if (This.isRunning == true)
        {
            return;
        }
        This.isRunning = true;
        This.currentStep = 0;
        This.processCurrentStep();
    },
    this.stop = function(){
        This.isRunning = false;
        window.clearTimeout(This._timeoutHandler)
    },
    this.add = function(_function,_timeout){
        This.chain[This.chain.length] = {func : _function, time : _timeout};
    }
};

// Change main or inner page
function changePage($type, $menuActiveItem, $prevPage, $nextPage, $transition, $emptyPrev){
    var $newScreen = new chainedAnimation(),
        $delay = 150;
    
    // Start transitioning when new page is ready
    $('#loading').fadeOut(function(){
        
        // Close navigation panel if open
        if ($('.container.menu-open').length) {
            $newScreen.add(function(){ 
                $('.container').addClass('menu-closing'); 
                $('.nav-toggle.active').removeClass('active'); 
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

            // If it's main page, add additional classes
            if ($type.indexOf('main-page') >= 0) 
            {
                var $additionalClass = $type.split('main-page ');
                $('#' + $nextPage).addClass($additionalClass[1]);
            }
            
            // If it's inner page, add additional classes + clear main active page
            if ($type.indexOf('inner-page') >= 0) 
            { 
                $('.main-page.page-current').removeClass('page-current').addClass('prev-page-current'); 

                var $additionalClass = $type.split('inner-page ');
                $('#' + $nextPage).addClass($additionalClass[1]);
            }
        }, $delay);

        // Empty old page
        if ($emptyPrev == true) {
            $newScreen.add(function(){ 
                $('#' + $prevPage).empty();
            }, $delay);
        }

        $newScreen.start();

        // Set active class in the menu
        $('#main-menu a.active').removeClass('active');
        $('#main-menu a[data-page="' + $menuActiveItem + '"]').addClass('active');
    }).remove();
    
    // Reset the container class (to reset all inner toggle views)
    setTimeout(function() {
        $('.container').attr({'class': 'container'});
    }, 300);
}

// Change inner page view 
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

    // Menu display toggle
    $(document).on('click', '.nav-toggle', function(e) {
        e.preventDefault();

        var $toggleNavigation = new chainedAnimation(),
            $delay = 150,
            $menuOpen = 'menu-open',
            $menuClosing = 'menu-closing';

        switch($(this).attr('class')){
            // Open navigation
            case 'nav-toggle':
                $(this).addClass('active');
                $toggleNavigation.add(function(){ $('.container').addClass($menuOpen); });
                break;

            // Close navigation
            case 'nav-toggle active':
                $(this).removeClass('active');
                $toggleNavigation.add(function(){ $('.container').addClass($menuClosing); } );
                $toggleNavigation.add(function(){ $('.container').removeClass($menuOpen).removeClass($menuClosing); }, $delay);
                break;
        }
        
        $toggleNavigation.start();
    });

/*  Main screens        *******************************************************/
    
    // First main scren after login - preloaded from server
    $('#app-page').ready(function(){

        var $showMaster = new chainedAnimation(),
            $delay = 300;
  
        $showMaster.add(function(){ $('.container').removeClass('loading'); }, $delay);
        $showMaster.add(function(){ $('#main-menu').show(); }, $delay);
        $showMaster.start();
    });

    // All other screens - loaded dynamicilly
    $(document).on('click','a[data-transition]:not(.active)',function(e) {
        e.preventDefault();

        // Common variables
        var $loader = '<div id="loading" />',
            $href = $(this).attr('href'),
            $transitionPage = $(this).attr('data-transition'),
            $reload = $transitionPage.indexOf('reload-content') >= 0 ? true : false,
            $activeMenuItem = $(this).attr('data-page'),
            $transitionType = $(this).hasClass('back-button') ? 'move-from-left' : 'move-from-right',
            $backPage = $(this).closest('.page-current').attr('id'),
            $backView = $(this).closest('.view-current').attr('id');    
            //TODO: move to app-search.js
            $search_status = $(this).attr('search-status'),
            $trigger_search = $(this).attr('trigger-search');

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
            var $previous = $('.nested-view.view-current').attr('id'),
                $next = $('.nested-view:not(.view-current)').attr('id');
        }
        // Load reservations
        if ($transitionPage.indexOf('reservation-list') >= 0)
        {

            displayReservationDetails($href);
        }
        // Load next page/view or reload previous view before going back
        else if(!$(this).hasClass('back-button') || ($(this).hasClass('back-button') && $reload == true))
        {
            $($loader).prependTo('body').show(function(){
                $.ajax({
                    type:       'GET',
                    url:        $href,
                    dataType:   'html',
                    timeout:    5000,
                    success: function(data){
                        $('#' + $next).html(data);
                        //TODO: move to app-search.js
                        if($trigger_search=='TRUE'){
                            $url = '/search.json?status='+$search_status;
                            load_search_data($url,'');
                        }
                    },
                    error: function(){
                        $('#loading').remove();
                        modalInit('modals/alerts/not-there-yet/');
                    }
                }).done(function(){  
                    if ($transitionPage.indexOf('main-page') >= 0 || $transitionPage.indexOf('inner-page') >= 0)
                    {
                        changePage($transitionPage, $activeMenuItem, $previous, $next, $transitionType, $reload);
                    }
                    else if ($transitionPage.indexOf('nested-view') >= 0)
                    {
                       changeView($transitionPage, $activeMenuItem, $previous, $next, $transitionType, $reload); 
                    }
                });
            });
        }

        // Back buttons no reload
        else if ($(this).hasClass('back-button') && $reload == false)
        {
            if ($transitionPage.indexOf('main-page') >= 0 || $transitionPage.indexOf('inner-page') >= 0)
            {
                goBackToPage($activeMenuItem, $backPage, $transitionType);
            }
            else if ($transitionPage.indexOf('nested-view') >= 0)
            {
                goBackToView($activeMenuItem, $backView, $transitionType);
            }
        }

        
        else 
        {
            modalInit('modals/alerts/not-there-yet/');
        }
    });

/*  Sign In / Sign Out        *************************************************/

    // Sign in page loaded
    $('#login-page').on('ready', function(){
        setTimeout(function() {
            $('.container').removeClass('loading');
        }, 300);
    });

    // Signing in
    $(document).one('submit', '#login-form', function(e){
        e.preventDefault();

        var $signingIn = new chainedAnimation(),
            $delay = 300;
  
        $signingIn.add(function(){  $('.container').addClass('signing-in'); }, $delay);
        $signingIn.add(function(){ $('#login-form').submit(); }, $delay);
        $signingIn.start();
    });

    // Signing out
    $(document).on('click', '.icon-sign-out', function(e) {
        e.preventDefault();

        $('.nav-toggle').removeClass('active'); 
        $('.container').removeClass('menu-open');

        var $signingOut = new chainedAnimation(),
            $delay = 300;
  
        $signingOut.add(function(){ $('.container').addClass('signing-out'); }, $delay);
        $signingOut.add(function(){ window.location = $('.icon-sign-out').attr('href'); }, $delay);
        $signingOut.start();
    });
});