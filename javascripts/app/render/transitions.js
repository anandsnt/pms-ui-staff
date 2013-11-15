// Touch listeners
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

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

    // FastClick
    FastClick.attach(document.body);

    // Prevent screen scroll when iPad virtual keyboard appears
    $(document).on('focus', 'input', function() {
        window.scrollTo(0, 0);
    });

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
                    $('#page-main-first').empty().html(data);

                    // Set active link in the menu
                    $('#main-menu .active').removeClass('active');
                    $('#main-menu a[data-page="' + $pageToShow[1] + '"]').addClass('active');

                    // Back buttons in this case need to load data
                    $('.back-button[data-transition]').each(function(e){
                        var $transition = $(this).attr('data-transition');
                        $(this).attr({'data-transition': $transition + ' reload-content'});
                    });

                },
                error: function(){
                    console.log('Error loading screen');
                }
            });       

            // Remove the hash 
            history.pushState("", document.title, window.location.pathname);    
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
        var $loader = '<div id="loading" />',
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
            var $previous = $('.nested-view.view-current').attr('id'),
                $next = $('.nested-view:not(.view-current)').attr('id');
        }


        // Do nothing for active links
        if ($(this).hasClass('active')) 
        {
            return false;
        }

        // Drawer item is already loaded, just switch to it
        else if ($(this).attr('data-href') == 'history' && !$(this).hasClass('active') && $reloadInDrawer == false)
        {
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
                    error: function(){
                        $('#loading').remove();
                        console.log('Error loading screen');
                    }
                }).done(function(){  
                    var viewInstance = sntapp.getViewInstance($('#'+$next));
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
                        alert("here");
                        console.log($transitionPage);
                        console.log($activeMenuItem);
                        console.log($previous);
                        console.log($next);
                        console.log($transitionType);
                        console.log($reloadOnBack);
                        
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
            console.log('Screen does not exist');
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