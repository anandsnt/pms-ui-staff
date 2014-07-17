

var sntRover = angular.module('sntRover',['ui.router', 'ui.utils','pickadate', 'ng-iscroll', 'highcharts-ng', 'ngAnimate','ngDialog', 'ngSanitize', 'pascalprecht.translate','advanced-pickadate','ui.date','ui.calendar', 'dashboardModule', 'companyCardModule', 'stayCardModule', 'reservationModule', 'housekeepingModule']);

sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	//BaseCtrl.call(this, $scope);
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	

	/**
	*	For certain state transitions
	*	the transition animation must be reversed
	*
	*	This is achived by adding class 'return-back'
	*	to the imediate parent of 'ui-view'
	*/
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		// spiting state names so as to add them to 'revList', if needed
		console.log(fromState.name + ' ===> ' + toState.name);

		// check this template to see how this class is applied:
		// app/assets/rover/partials/staycard/rvStaycard.html

		if ( $rootScope.shallRevDir(fromState.name, toState.name) ) {
			$rootScope.returnBack = true;
		} else {
			$rootScope.returnBack = false;
		}

		// saving the prevState name and params
		// for quick 'goBack' method
		$rootScope.prevStateName  = fromState.name;
		$rootScope.prevStateParam = fromParams;
	});

	/**
	*	revList is an array that holds
	*	state name sets that when transitioning
	*	the transition animation should be reversed 
	*	
	*	@private
	*/
	var revList = [{
		fromState: 'rover.housekeeping.roomDetails',
		toState  : 'rover.housekeeping.roomStatus'
	}, {
		fromState: 'rover.staycard.reservationcard.reservationdetails',
		toState  : 'rover.search'
	}, {
		fromState: 'rover.staycard.billcard',
		toState  : 'rover.staycard.reservationcard.reservationdetails'
	}, {
		fromState: 'rover.staycard.nights',
		toState  : 'rover.staycard.reservationcard.reservationdetails'
	}, {
		fromState: 'rover.companycarddetails',
		toState  : 'rover.companycardsearch'
	}];

	/**
	*	
	*	
	*	@param {String} fromState - name of the from state
	*	@param {Sting} toState - name of the to state
	*/
	$rootScope.addToRevList = function(fromState, toState) {
		var notAdded = true;
		for (var i = 0; i < revList.length; i++) {
			if ( revList[i].fromState === fromState && revList[i].toState === toState ) {
				notAdded = false;
				break;
			};
		};

		notAdded && hasAddedrevList.push({ 'fromState': fromState, 'toState'  : toState });
	};

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
		for (var i = 0; i < revList.length; i++) {
			if ( revList[i].fromState === fromState && revList[i].toState === toState ) {
				return true;
				break;
			};
		};

		return false;
	};


	/**
	*	A very simple methods to
	*	go back to the previous state
	*/
	$rootScope.goBack = function() {
		!!$rootScope.prevStateName && $state.go( $rootScope.prevStateName, $rootScope.prevStateParam );
	};
}]);

