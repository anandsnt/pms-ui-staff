sntRover.controller('companyCardDetailsContactCtrl', ['$scope', 'RVCompanyCardSrv', '$state', '$stateParams',
	function($scope, RVCompanyCardSrv, $state, $stateParams) {
		$scope.$parent.myScrollOptions = {
			'companyCardDetailsContactCtrl': {
				scrollbars: true,
				scrollY: true,
				snap: false,
				hideScrollbar: false
			}
		};

		$scope.$on("contactTabActive", function() {
			setTimeout(function() {
				refreshScroller();
			}, 500);
		});


		var refreshScroller = function() {
			$scope.$parent.myScroll['companyCardDetailsContactCtrl'].refresh();
		};

	}
]);
