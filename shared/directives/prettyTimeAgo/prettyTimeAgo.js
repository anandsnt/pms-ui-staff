angular.module('prettyTimeAgoModule', [])
	.factory('timeAgo', function() {
		return {
			convert: function(seconds) {
				var seconds = seconds || 0,
					minutes = Math.floor( seconds / 60 ),
					hours   = Math.floor( minutes / 60 );

				if ( hours > 12 ) {
					return '> 12h';
				} else if ( hours > 0 ) {
					return hours + 'h';
				} else if ( minutes > 0 ) {
					return minutes + 'm';
				} else {
					return '1m';
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
				v = timeAgo.convert(1235);
				console.log(v, element);
				element.innerHTML( v );
				return;

				if ( ! scope.prettyTimeSpan ) {
					return;
				}

				element.innerHTML( timeAgo.convert(scope.prettyTimeSpan) );
			}
		}
	}])