sntRover.controller('RVReservationAddonsCtrl', ['$scope', 'addonData', '$state', 'ngDialog', 'RVReservationAddonsSrv',
    function($scope, addonData, $state, ngDialog, RVReservationAddonsSrv){
    $scope.addons = [
                      {
                        "id":1,
                        "category": "Mini-Bar",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Non fugiat aliqua sint et proident magna ipsum culpa amet eu. Do in mollit ex officia qui velit labore consequat aliquip consectetur enim officia laboris. Incididunt tempor aute laborum eiusmod consequat. Lorem occaecat aliquip ea est id esse cupidatat duis irure pariatur in duis laborum. Commodo ea esse esse ipsum esse consectetur aliquip laboris laboris mollit.\r\n",
                        "price": "20.73",
                        "quantity": 3
                      },
                      {
                        "id":2,
                        "category": "Parking",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Amet deserunt aliquip amet exercitation voluptate fugiat enim fugiat. Eiusmod duis et ipsum minim. In aute aute amet id dolor dolore officia nostrud in qui laborum in. Elit proident aute culpa pariatur amet fugiat. Tempor magna cillum qui dolore do mollit duis minim non occaecat. Proident adipisicing adipisicing cillum dolor ipsum excepteur deserunt ipsum enim consequat sunt.\r\n",
                        "price": "52.70",
                        "quantity": 3
                      },
                      {
                        "id":3,
                        "category": "Parking",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Et voluptate laborum nisi excepteur consectetur et ullamco minim occaecat nulla dolore in ex. Commodo id ullamco velit culpa deserunt Lorem duis fugiat id. Labore fugiat adipisicing reprehenderit dolor id proident adipisicing labore est sit exercitation. Magna laboris sint nostrud sint dolore. Do commodo pariatur qui laboris pariatur est aute id. Anim deserunt laboris commodo excepteur exercitation aute fugiat eu voluptate consectetur proident ipsum minim quis.\r\n",
                        "price": "54.97",
                        "quantity": 3
                      },
                      {
                        "id":4,
                        "category": "Food & Beverage",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Labore dolore eu consectetur minim commodo sint dolore. Cillum pariatur dolor incididunt Lorem deserunt qui deserunt. Non ipsum velit est culpa culpa occaecat laboris dolore ullamco incididunt consectetur.\r\n",
                        "price": "25.29",
                        "quantity": 3
                      },
                      {
                        "id":5,
                        "category": "Bedding",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Ut cupidatat incididunt duis consequat nulla nostrud est do et. Occaecat non aliqua Lorem nisi fugiat minim. Reprehenderit amet magna anim velit dolore non pariatur ad qui adipisicing sint amet aliquip.\r\n",
                        "price": "82.58",
                        "quantity": 3
                      },
                      {
                        "id":6,
                        "category": "Parking",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Consectetur magna id ex fugiat sit laboris. Consequat in ipsum do in esse elit est nisi cillum cillum irure excepteur. Ut esse excepteur duis irure laborum. Deserunt ex sint quis et. Velit dolor consequat elit ut duis eu veniam. Anim ipsum ipsum occaecat magna consequat anim occaecat voluptate commodo cupidatat eu. In enim nulla sint culpa veniam sint est elit esse cupidatat adipisicing aliquip anim et.\r\n",
                        "price": "10.09",
                        "quantity": 3
                      },
                      {
                        "id":7,
                        "category": "Best Sellers",
                        "category_short_desc": "Food & Drink",
                        "title": "Champagne & Chocolates",
                        "desc": "In exercitation tempor magna nostrud laborum aliqua id sunt reprehenderit cillum. Consectetur labore eu irure occaecat aliquip consequat. Ipsum est sunt non ipsum anim nostrud esse consectetur cupidatat excepteur magna.\r\n",
                        "price": "51.59",
                        "quantity": 3
                      },
                      {
                        "id":8,
                        "category": "Food & Beverage",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Minim aliquip do do laborum ad ad incididunt sit adipisicing velit. Aliquip culpa cupidatat fugiat sit ea consectetur irure proident officia pariatur excepteur magna. Do enim ex qui adipisicing consectetur. Do enim ullamco velit adipisicing tempor officia adipisicing est nostrud mollit ea et. Nostrud ad quis ut nisi proident fugiat duis nostrud nulla laboris esse dolor adipisicing deserunt. Consequat nostrud officia amet adipisicing mollit nulla sit.\r\n",
                        "price": "51.79",
                        "quantity": 3
                      },
                      {
                        "id":9,
                        "category": "Parking",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Nisi elit ad labore mollit aute sint dolor irure fugiat Lorem officia do. Est laboris commodo ex elit magna dolor ullamco pariatur. Sit Lorem consequat dolor proident dolore et officia exercitation. Et culpa ex sunt incididunt cillum culpa id proident irure culpa in laboris.\r\n",
                        "price": "13.98",
                        "quantity": 3
                      },
                      {
                        "id":10,
                        "category": "Mini-Bar",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Ut aliqua proident deserunt consectetur est laborum magna dolore sit nisi nisi. Tempor velit quis nostrud Lorem anim ex ullamco quis magna aliqua. Id adipisicing magna magna cillum incididunt commodo excepteur consectetur laborum proident aliqua deserunt.\r\n",
                        "price": "96.01",
                        "quantity": 3
                      },
                      {
                        "id":11,
                        "category": "Attractions",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Nostrud incididunt enim consequat elit amet adipisicing. Elit proident Lorem amet velit irure anim veniam in adipisicing labore pariatur. Commodo ullamco dolore aliqua mollit exercitation. Aute voluptate voluptate voluptate qui amet esse sit officia ea reprehenderit. Quis adipisicing ex sint labore consequat fugiat dolore cupidatat reprehenderit. Deserunt eu aliquip elit cupidatat mollit ut exercitation sunt mollit ad. Dolore consectetur voluptate adipisicing ea in exercitation occaecat reprehenderit deserunt.\r\n",
                        "price": "21.34",
                        "quantity": 3
                      },
                      {
                        "id":12,
                        "category": "Food & Food & Beverage",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Amet ex id reprehenderit do culpa cillum in aute irure. Ad pariatur deserunt consequat nostrud nulla sunt ullamco minim cillum aliqua. Amet qui quis eu ipsum elit duis. Consequat in excepteur cupidatat eiusmod. Nisi excepteur magna dolor ipsum esse deserunt eiusmod esse duis cupidatat excepteur dolor. Occaecat dolore occaecat anim reprehenderit sint est sint reprehenderit sint dolore cillum incididunt deserunt qui.\r\n",
                        "price": "65.98",
                        "quantity": 3
                      },
                      {
                        "id":13,
                        "category": "Golf",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Incididunt sit sunt laborum est incididunt enim anim ea et velit est nulla eu. Aliquip reprehenderit consequat laborum reprehenderit nisi officia incididunt consequat excepteur. Est officia duis velit deserunt cupidatat excepteur nostrud pariatur. Pariatur sit Lorem mollit magna ipsum. Magna consequat reprehenderit culpa amet velit tempor nulla irure laborum do cupidatat in.\r\n",
                        "price": "42.50",
                        "quantity": 3
                      },
                      {
                        "id":14,
                        "category": "Mini-Bar",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Amet pariatur dolor ad sunt velit consectetur Lorem laborum. Id aliqua consequat minim aliqua laboris pariatur officia nulla laboris proident fugiat ex est officia. In sint deserunt nisi in culpa culpa amet deserunt cillum est labore officia laborum.\r\n",
                        "price": "72.62",
                        "quantity": 3
                      },
                      {
                        "id":14,
                        "category": "Bedding",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Enim minim quis quis elit id incididunt dolor velit ullamco incididunt. Sint amet ipsum ex ut ea culpa reprehenderit. Sunt laborum proident reprehenderit ex sit est amet magna. Duis tempor officia ea Lorem cillum cillum proident sit voluptate pariatur.\r\n",
                        "price": "57.40",
                        "quantity": 3
                      },
                      {
                        "id":15,
                        "category": "Best Sellers",
                        "category_short_desc": "Spa",
                        "title": "Champagne & Chocolates",
                        "desc": "Dolor sit enim anim qui commodo mollit. Sint eiusmod cillum proident aliquip laborum nostrud. Cillum non consequat irure ipsum. Ullamco cupidatat nostrud ullamco incididunt id ad officia sint commodo officia id consequat nostrud eiusmod. Qui ad eu minim officia. Id culpa qui est consectetur magna sunt velit ut aliquip eiusmod reprehenderit.\r\n",
                        "price": "30.28",
                        "quantity": 3
                      },
                      {
                        "id":16,
                        "category": "Attractions",
                        "category_short_desc": "",
                        "title": "Champagne & Chocolates",
                        "desc": "Elit aliquip incididunt esse commodo quis officia sint et magna aliqua mollit tempor ullamco aliquip. Occaecat aute pariatur elit excepteur non labore Lorem id. Ex eu officia exercitation elit id et dolor nisi consectetur id eu tempor. Ut nulla ipsum non nostrud elit laboris cillum exercitation cillum.\r\n",
                        "price": "49.39",
                        "quantity": 3
                      }
                    ]

    $scope.activeRoom = $scope.reservationData.rooms[0];

    $scope.categoryCls = function(category){
        var cls = '';
        if ( $scope.activeAddonCategory ===  category) { cls = 'ui-state-active'; }
        return cls;
    }

    $scope.showEnhancementsPopup = function(){
        console.log('reacehd');
        var selectedAddons = $scope.activeRoom.addons;
        if( selectedAddons.length > 0 ){
            ngDialog.open({
                 template: '/assets/partials/reservation/selectedAddonsListPopup.html',
                 className: 'ngdialog-theme-default',
                 closeByDocument: true,
                 scope: $scope
            });
        } 
    }

    $scope.closePopup = function(){
        ngDialog.close();
    }

    $scope.goToSummaryAndConfirm = function(){
        $state.go('rover.reservation.mainCard.summaryAndConfirm');
    }

    $scope.selectAddonCategory = function(category, event){
        event.stopPropagation();
        $scope.activeAddonCategory = category;
    }

    $scope.selectAddon = function(addon, addonQty){
        var item = {};
        item.id = addon.id;
        item.title = addon.title;
        item.quantity = addonQty;
        $scope.activeRoom.addons.push(item);
        $scope.showEnhancementsPopup();
    }

    $scope.removeSelectedAddons = function(index){
        $scope.activeRoom.addons.splice(index, 1);
        if( $scope.activeRoom.addons.length === 0 ){
            $scope.closePopup();
        }
    }

    $scope.fetchAddons = function(chargeGroupId){
        var successCallBackFetchAddons = function(data){
            angular.forEach(data.results, function(item){
                var addonItem = {};
                addonItem.id = item.id;
                addonItem.isBestSeller = item.bestseller;
                addonItem.category = item.charge_code.name;
                addonItem.title = item.name;
                addonItem.description = item.description;
                addonItem.price = item.amount;
                $scope.addons.push(addonItem);
            });

        }
        var is_bestseller = chargeGroupId == '' ? true : false;
        var paramDict = {
                            'charge_group_id': chargeGroupId,
                            'is_bestseller': is_bestseller,
                            'from_date': $scope.reservationData.arrivalDate,
                            'to_date': $scope.reservationData.departureDate,
                            'is_not_rate_only': false
                        };
        $scope.invokeApi(RVReservationAddonsSrv.fetchAddons, paramDict, successCallBackFetchAddons);
    }

    $scope.addonCategories = addonData.addonCategories;
    $scope.bestSellerEnabled = addonData.bestSellerEnabled;
    $scope.activeAddonCategory = 'Best Sellers';
    // TODO :: uncomment below line once API is implemented
    // first time fetch for best seller addons
    // for fetching best sellers - call method without params ie. no charge group id
    // Best Sellers in not a real charge code item - just hard coded item to fetch best sell addons
    // $scope.fetchAddons();

}]);