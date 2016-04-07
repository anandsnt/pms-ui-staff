/**
 * Created by shahulhameed on 3/10/16.
 */
sntRover.directive('rvIncludeTemplate', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: function(ele, attrs) {
            return attrs.rvIncludeTemplate;
        }
    };
});