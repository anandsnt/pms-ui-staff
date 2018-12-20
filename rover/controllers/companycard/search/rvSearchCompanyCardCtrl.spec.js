describe("searchCompanyCardController", function() {
    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('companyTaCardsSearchResultSampleData.json'),
        searchResult = fixtures['companyTaCardsSearchResultSampleData.json'],
        $controller,
        $rootScope,
        $scope;

    describe("Checks the card selection", function() {
        beforeEach(function() {
            module("sntRover");
    
            inject(function(_$controller_, _$rootScope_) {
                $controller = _$controller_;
                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();
    
            });

            $controller("searchCompanyCardController", {
                $scope: $scope
            });
        });

        it("checks whether the card selected is added to the list of cards showns for merge", function() {
            $scope.results = searchResult;
            $scope.results[0].selected = true;
            $scope.onCardSelection($scope.results[0]);

            expect($scope.viewState.selectedCardsForMerge.length).toBe(1);
        });

        it("first card selected should be the primary card", function() {
            $scope.results = searchResult;
            $scope.results[0].selected = true;
            $scope.onCardSelection($scope.results[0]);

            expect($scope.viewState.selectedCardsForMerge[0].isPrimary).toBe(true);
        });

        it("First card selected only be marked as primary", function() {
            $scope.results = searchResult;            
            $scope.results[0].selected = true;
            $scope.results[0].isPrimary = true;
            $scope.viewState.selectedCardsForMerge.push($scope.results[0]);
            $scope.results[1].selected = true;
            $scope.onCardSelection($scope.results[1]);

            expect($scope.viewState.selectedCardsForMerge[1].isPrimary).toBe(undefined);
        });
    });

    describe("Checks the primary card selection", function() {
        beforeEach(function() {
            module("sntRover");
    
            inject(function(_$controller_, _$rootScope_) {
                $controller = _$controller_;
                $rootScope = _$rootScope_;
                $scope = $rootScope.$new();
    
            });

            $controller("searchCompanyCardController", {
                $scope: $scope
            });
        });

        it("checks whether the new card is set as primary while changing the selection", function() {
            $scope.results = searchResult;
            $scope.results[0].selected = true;
            $scope.results[0].isPrimary = true;

            $scope.results[1].selected = true;
            $scope.results[2].selected = true;

            $scope.viewState.selectedCardsForMerge.push($scope.results[0]);
            $scope.viewState.selectedCardsForMerge.push($scope.results[1]);
            $scope.viewState.selectedCardsForMerge.push($scope.results[2]);
            
            $scope.onPrimaryGuestSelectionChange($scope.results[1].id);

            expect($scope.viewState.selectedCardsForMerge[0].isPrimary).toBe(false);
            expect($scope.viewState.selectedCardsForMerge[1].isPrimary).toBe(true);
        });

        it("deleting the primary should select the first item as primary", function() {
            $scope.results = searchResult;
            $scope.results[0].selected = true;
            $scope.results[0].isPrimary = true;

            $scope.results[1].selected = true;
            $scope.results[2].selected = true;

            $scope.viewState.selectedCardsForMerge.push($scope.results[0]);
            $scope.viewState.selectedCardsForMerge.push($scope.results[1]);
            $scope.viewState.selectedCardsForMerge.push($scope.results[2]);

            $scope.removeSelectedCard($scope.results[0]);

            expect($scope.viewState.selectedCardsForMerge[0].isPrimary).toBe(true);
        });
        
    });
});