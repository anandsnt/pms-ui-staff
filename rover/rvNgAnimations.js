

var rvNgAnimations = angular.module('rvNgAnimations', ['ngAnimate']);

rvNgAnimations.animation('.main-view', function() {
	return {
		enter: function(el, done) {
			el.css({transform: 'translateX(200px)'});

			$(el).animate({transform: 'translateX(0px)'}, done);

			return function(isCancelled) {
				if (isCancelled) {
					console.log( 'enter animation cancelled' );
				};
			};
		},

		leave: function(el, done) {
			$(el).animate({transform: 'translateX(-200px)'}, done);

			return function(isCancelled) {
				if (isCancelled) {
					console.log( 'leave animation cancelled' );
				};
			};
		},

		move: function(el, done) {
			console.log( 'move called' );
			
			return function(isCancelled) {
				if (isCancelled) {
					console.log( 'move cancelled' );
				};
			};
		};
	}
});