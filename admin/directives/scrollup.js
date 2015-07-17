admin.directive('scrollup', function ($document) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                elm.bind("click", function () {
                    function scrollToTop(element, to, duration) {
                        if (duration < 0) {
                            return;
                        }
                        var difference = to - $(element).scrollTop();
                        var perTick = difference / duration * 10;

                        setTimeout(function () {
                            element.scrollTop = $(element).scrollTop() + perTick;
                            scrollToTop(element, to, duration - 10);
                        }, 10);
                    }

                    var scroll_up_id = $(elm).attr('scrollup');
                    var elToScroll = $('#'+scroll_up_id);

                    // then just add dependency and call it
                    if (elToScroll && elToScroll[0]){
                        scrollToTop(elToScroll[0], 0, 300);
                    }
                });
            }
        };
});