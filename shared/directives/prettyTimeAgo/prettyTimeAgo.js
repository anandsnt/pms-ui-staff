angular.module('prettyTimeAgoModule', [])
	.factory('timeAgo', function() {
		return {
			convert: function(seconds) {
				var sec, min, hrs;

				sec = parseInt(seconds);

				if ( isNaN(sec) ) {
					return '';
				} else {
					min = Math.floor( sec / 60 );
					hrs = Math.floor( min / 60 );

					if ( hours > 12 ) {
						return '>12h';
					} else if ( hours > 0 ) {
						return hours + 'h';
					} else if ( minutes > 0 ) {
						return minutes + 'm';
					} else {
						return '1m';
					}
				}
			}
		}
	})
	.directive('prettyTimeAgo', ['timeAgo', function(timeAgo) {
		return {
			restrict: 'A',
			replace: false,
			scope: {
				prettyTimeSpan: '='
			},
			link: function(scope, element) {
				if ( scope.prettyTimeSpan !== null || scope.prettyTimeSpan !== undefined ) {
					element.html( timeAgo.convert(scope.prettyTimeSpan) );
				}
			}
		}
	}])