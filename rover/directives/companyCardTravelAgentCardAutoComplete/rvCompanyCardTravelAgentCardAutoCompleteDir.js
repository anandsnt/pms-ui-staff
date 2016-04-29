// company card travel agent card auto complete feature
(function() {

  var rvFilterOptionsSrv,
  highlightFilter_ = null,
  autocompleteEl;

  var linkFn = ($scope, autocompleteEl) => {
    BaseCtrl.call(this, $scope);

    var ulElement = null;

    var renderItem = (ul, item) => {
      var htmlForItem = '';
      
      //CICO-26513
      ulElement = ul;
      ulElement.off('touchmove').on('touchmove', function(e) {
        e.stopPropagation();
      });

      ul.addClass('find-cards');
      var $content = highlightFilter_(item.account_name, $scope.ngModel),
         htmlForItem = $('<a></a>').html($content),
         defIcon = '',
         $image = '';

      switch (item.account_type) {
        case 'COMPANY':
          defIcon = 'icon-company';
          break;

        case 'TRAVELAGENT':
          defIcon = 'icon-travel-agent';
          break;
        default:
          break;
      };

      if (item.company_logo) {
        $image = '<img src="' + item.company_logo + '">';
      } else {
        $image = '<span class="icons ' + defIcon + '"></span>';
      }

      if (item.account_type) {
        $($image).prependTo(htmlForItem);
      }
      return $('<li></li>').append(htmlForItem).appendTo(ul);
    };

    /**
     * success callback of card search API
     * @type {Object}
     */
    var successCallBackOfCardSearch = (data, successCallBackParameters) => {
      successCallBackParameters.callBackToAutoComplete(data.accounts);
    };

    /**
     * to call card search api
     */
    var callCardSearchAPI = (callBackToAutoComplete) => {
      var params = {
        'query': $scope.ngModel.trim()
      };

      var options = {
        params: params,
        successCallBack: successCallBackOfCardSearch,
        successCallBackParameters: {
          callBackToAutoComplete: callBackToAutoComplete
        }
      };
      $scope.callAPI(rvFilterOptionsSrv.fetchCompanyCard, options);
    };

    var closeAutoCompleteResults = () => {
      $(autocompleteEl).autocomplete('close');
    };

    // jquery autocomplete Souce handler
    // get two arguments - request object and response callback function
    var autoCompleteSourceHandler = (request, callBackToAutoComplete) => {
      if (request.term.length === 0) {
        closeAutoCompleteResults();
        runDigestCycle();
      } else {
        callCardSearchAPI(callBackToAutoComplete);
      }
    };

    /**
     * to run angular digest loop,
     * will check if it is not running
     * return - None
     */
    var runDigestCycle = () => {
      if (!$scope.$$phase) {
        $scope.$digest();
      }
    };

    /**
     * default auto complete select handler
     * @param  {[type]} event [description]
     * @param  {[type]} ui    [description]
     */
    var autoCompleteSelectHandler = (event, ui) => {
      runDigestCycle();
      return false;
    };

    /**
     * we've to unbind something while removing the node from dom
     */
    $scope.$on('$destroy', function(){
        $(autocompleteEl).autocomplete( "destroy" );
        
        //unbinding the touch move
        if(ulElement instanceof HTMLElement) {
          ulElement.off('touchmove')
        }
    });

    /**
     * Initialization stuffs
     * @return {undefiend}
     */
    (() => {
    	var defaultPosition = {
    		of : (autocompleteEl),
        my : 'left top',
        at : 'right top',
        collision : 'fit',
        within : 'body'
      };

      $scope.autocompleteOptions = {
    		source : autoCompleteSourceHandler,
    		delay  : 600,
    		minLength: 2,
        select : $scope.selectHandler ? $scope.selectHandler : autoCompleteSelectHandler,
        position : $scope.position ? Object.assign(defaultPosition, $scope.position) : defaultPosition,
        appendTo: $scope.appendTo ? $scope.appendTo : 'body'
			};

      $(autocompleteEl).autocomplete($scope.autocompleteOptions).data('ui-autocomplete')._renderItem = renderItem;

    })();  
  };

  angular.module('sntRover').directive('rvCcTaAutoComplete', ['RMFilterOptionsSrv', 'highlightFilter', 
  	function(RMFilterOptionsSrv, highlightFilter) {

    rvFilterOptionsSrv = RMFilterOptionsSrv,
    highlightFilter_ = highlightFilter;

    return {
      restrict : 'A',
      scope : {
        ngModel : '=ngModel',
        selectHandler: '=selectHandler',
        position: '@position',
        appendTo: '@appendTo'
      },
      link : linkFn
    };

  }]);
}());
