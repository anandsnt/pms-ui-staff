sntRover.controller('RestrictionWeekdaysCtrl', ['$scope', 'ngDialog',
	function ($scope, ngDialog) {		





		$scope.$parent.myScrollOptions = {
			'restictionWeekDaysScroll' : {            
				scrollbars : true,
				interactiveScrollbars : true,
				click : true,
				useTransform: true,
				zoom: false,
				onBeforeScrollStart: function (e) {
					var target = e.target;
					while (target.nodeType != 1) target = target.parentNode;

					if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
						e.preventDefault();
				}        
			}

		};

		$scope.init = function(){
			console.log("init week days controller");
		};

		$scope.init();

		}
	]);