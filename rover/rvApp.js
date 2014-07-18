

var sntRover = angular.module('sntRover',['ui.router', 'ui.utils','pickadate', 'ng-iscroll', 'highcharts-ng', 'ngAnimate','ngDialog', 'ngSanitize', 'pascalprecht.translate','advanced-pickadate','ui.date','ui.calendar', 'dashboardModule', 'companyCardModule', 'stayCardModule', 'reservationModule', 'housekeepingModule']);

sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	//BaseCtrl.call(this, $scope);
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;


	// a simple flag to set the 
	// slide animation in reverse mode
	var $_mustRevAnim = false;


	// keep track of the previous state and its params
	// saving the prevState name and params
	var $_prevStateName = null,
		$_prevStateParam = null; 


	/**
	*	revAnimList is an array that holds
	*	state name sets that when transitioning
	*	the transition animation should be reversed 
	*	
	*	@private
	*/
	var $_revAnimList = [{
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
	*	A method on the $rootScope to determine if the
	*	slide animation during stateChange should run in reverse or forward
	*
	*	@private
	*	@param {string} fromState - name of the fromState
	*	@param {string} toState - name of the toState
	*
	*	@return {boolean} - to indicate reverse or not
	*/
	var $_shouldRevDir = function(fromState, toState) {
		for (var i = 0, j = $_revAnimList.length; i < j; i++) {
			if ( $_revAnimList[i].fromState === fromState && $_revAnimList[i].toState === toState ) {
				return true;
				break;
			};
		};

		return false;
	};


	/**
	*	A very simple methods to go back to the previous state
	*	By default it will use the just previous state - '$_prevStateName', '$_prevStateParam'
	*	But can be passed state name and param to jump to any state
	*
	*	@param {string} onFlyStateName - on the fly state name sent in from callee
	*	@param {Object} onFlyStateParam - on the fly state param sent in from callee
	*	@param {Boolean} onFlyReverse - on the fly animation direction sent in from callee
	*/
	$rootScope.loadPrevState = function(onFlyStateName, onFlyStateParam, onFlyReverse) {
		var name = onFlyStateName || $_prevStateName,
			param = onFlyStateParam || $_prevStateParam;

		if ( !!onFlyStateName || !!$_prevStateName ) {
			$_mustRevAnim = onFlyReverse ? onFlyReverse : true;
			$state.go( name, param );
		};
	};


	/**
	*	For certain state transitions
	*	the transition animation must be reversed
	*
	*	This is achived by adding class 'return-back'
	*	to the imediate parent of 'ui-view'
	*/
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		// spiting state names so as to add them to '$_revAnimList', if needed
		console.log(fromState.name + ' ===> ' + toState.name);

		// this must be reset with every state change
		// invidual controllers can then set with 
		// its own desired name (not necessarily the actual name)
		$rootScope.customPrevState = {};

		// check this template to see how this class is applied:
		// app/assets/rover/partials/staycard/rvStaycard.html

		// choose slide animation direction
		if ( $_mustRevAnim || $_shouldRevDir(fromState.name, toState.name) ) {
			$_mustRevAnim = false;
			$rootScope.returnBack = true;
		} else {
			$rootScope.returnBack = false;
		}

		// saving the prevState name and params
		// for quick 'loadPrevState' method
		$_prevStateName  = fromState.name;
		$_prevStateParam = fromParams;
	});
}]);

