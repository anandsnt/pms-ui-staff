

var sntRover = angular.module('sntRover',['ui.router', 'ui.utils','pickadate', 'ng-iscroll', 'highcharts-ng', 'ngAnimate','ngDialog', 'ngSanitize', 'pascalprecht.translate','advanced-pickadate','ui.date','ui.calendar', 'dashboardModule', 'companyCardModule', 'stayCardModule', 'reservationModule', 'housekeepingModule']);

sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	//BaseCtrl.call(this, $scope);
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	

	/**
	*	A method on the $rootScope to determine if the
	*	slide animation during stateChange should run in reverse or forward
	*
	*	@param {string} fromState - name of the fromState
	*	@param {string} toState - name of the toState
	*
	*	@return {boolean} - to indicate reverse or not
	*/
	$rootScope.shallRevDir = function(fromState, toState) {
		if (fromState === 'rover.housekeeping.roomDetails' && toState === 'rover.housekeeping.roomStatus') {
			return true;
		};

		if (fromState === 'rover.staycard.reservationcard.reservationdetails' && toState === 'rover.search') {
			return true;
		};

		if (fromState === 'rover.staycard.billcard' && toState === 'rover.staycard.reservationcard.reservationdetails') {
			return true;
		};

		if (fromState === 'rover.staycard.nights' && toState === 'rover.staycard.reservationcard.reservationdetails') {
			return true;
		};

		if (fromState === 'rover.companycarddetails' && toState === 'rover.companycardsearch') {
			return true;
		};

		return false;
	};


	/**
	*	this is make sure we add an
	*	additional class 'return-back' as a
	*	parent to ui-view, so as to apply a
	*	reverse slide animation
	*/
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		// to study the current changing states, remove on release
		console.log(fromState.name + ' ===> ' + toState.name);

		// check this template for the applied class:
		// app/assets/rover/partials/staycard/rvStaycard.html

		if ( $rootScope.shallRevDir(fromState.name, toState.name) ) {
			$rootScope.returnBack = true;
		} else {
			$rootScope.returnBack = false;
		}

		$rootScope.prevStateName  = fromState.name;
		$rootScope.prevStateParam = fromParams;
	});

	/**
	*	A very simple methods to
	*	go back to the previous state
	*/
	$rootScope.goBack = function() {
		!!$rootScope.prevStateName && $state.go( $rootScope.prevStateName, $rootScope.prevStateParam );
	};
}]);

