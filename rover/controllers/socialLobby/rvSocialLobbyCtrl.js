sntRover.controller('RVSocialLobbyCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVSocilaLobbySrv',
    '$timeout',
    '$state',
    'ngDialog',
    function($scope, $rootScope, $filter, RVSocilaLobbySrv, $timeout, $state, ngDialog) {

        BaseCtrl.call(this, $scope);

        $scope.posts = [];
        $scope.postParams = {'page': 1, 'per_page':20};
        $scope.selectedPost = "";
        $scope.newPost = "";
        $scope.middle_page1 = 2, $scope.middle_page2 = 3, $scope.middle_page3 = 4;
        $scope.$emit("updateRoverLeftMenu", "sociallobby");
        var expandedPostHeight = "";
        var deleteIndex = "";

        var POST_LIST_SCROLL = 'post-list-scroll';

        var setPostScrollHeight = function() {
            var postContainer = angular.element(document.querySelector(".neighbours-post-container"))[0];
            var postScroll = angular.element(document.querySelector(".neighbours-post-scroll"))[0];
            var posts = postContainer.children;
            
            var height = 80 * posts.length + 40;
            if(expandedPostHeight !== "") {
                height = height + expandedPostHeight;                
            }
            if($scope.errorMessage != "" || typeof $scope.errorMessage != 'undefined')
                postScroll.style.height = ""+450+"px";
            else
                postScroll.style.height = ""+500+"px";
            postContainer.style.height = ""+height+"px";
            
        }

        

        var refreshPostScroll = function(scrollUp) {
            
            // $scope.$apply();
            setTimeout(function() {
                setPostScrollHeight();
                $scope.refreshScroller(POST_LIST_SCROLL);
                if (scrollUp &&  $scope.myScroll.hasOwnProperty(POST_LIST_SCROLL) ) {
                    $scope.myScroll[POST_LIST_SCROLL].scrollTo(0, 0, 100);
                };
                

            },1000);
            
        }

        $scope.$on("socialLobbyHeightUpdated", function(event, currentPostHeight) {
            expandedPostHeight = currentPostHeight;

            refreshPostScroll();
        });

        $scope.$on("SL_ERROR", function(event, error) {
            $scope.errorMessage = error;
        });

        
        var setScroller = function() {
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(POST_LIST_SCROLL, scrollerOptions);
        };

        setScroller();

        $scope.fetchPosts = function() {
            $scope.errorMessage = "";
            var options = {};
            options.params = $scope.postParams;
            options.onSuccess = function(data) {
                
                $scope.posts = data.results.posts;
                $scope.totalPostPages = data.results.total_count % $scope.postParams.per_page > 0 ? Math.floor(data.results.total_count / $scope.postParams.per_page) + 1 : Math.floor(data.results.total_count / $scope.postParams.per_page);
                $scope.$emit('hideLoader');
                refreshPostScroll(true);
            }
            $scope.callAPI(RVSocilaLobbySrv.fetchPosts, options);
        }

        $scope.fetchPosts();

        $scope.refreshPosts = function() {
            $scope.postParams.page = 1;
            $scope.middle_page1 = 2, $scope.middle_page2 = 3, $scope.middle_page3 = 4;
            $scope.newPost = "";
            $scope.fetchPosts();
        }

        $scope.addPost = function() {
            $scope.errorMessage = "";
            var options = {};
            options.params = {
                "post" :{
                "post_message": $scope.newPost,
                "body_html": "testtt"
            }};
            options.onSuccess = function() {

                $scope.refreshPosts();
            }
            $scope.callAPI(RVSocilaLobbySrv.addPost, options);
        }

        $scope.goToStayCard = function(reservation_id, confirm_no, event) {
            event.stopPropagation();
            $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                id: reservation_id,
                confirmationId: confirm_no,
                isrefresh: false
            });
        }

        $scope.getProfessionStringForUser = function(user) {
            var professionString = "";
            if(user.profession != null && user.profession != "")
                professionString = professionString + user.profession;
            if(user.works_at != "" && user.works_at != null)
                professionString = professionString != ""? professionString + ", " + user.works_at : user.works_at;

            return professionString;
        }

        $scope.deletePostClicked = function(post_id) {
            $scope.errorMessage = "";
            deleteIndex = post_id;
            ngDialog.open({
                   template: '/assets/partials/socialLobby/rvSLPostDelete.html',
                   className: 'ngdialog-theme-default single-calendar-modal',
                   scope: $scope,
                   closeByDocument: true});
        }
        $scope.closeDialog = function() {
            ngDialog.close();
        }
        $scope.delete = function() {
            $scope.errorMessage = "";
            var options = {};
            options.params = {'post_id': deleteIndex};
            options.onSuccess = function() {
                
                $scope.refreshPosts();
                ngDialog.close();
            }
            options.failureCallBack = function(error) {

                $scope.errorMessage = error;
                ngDialog.close();
            }
            $scope.callAPI(RVSocilaLobbySrv.deletePost, options);
        }

        $scope.paginatePosts = function(page) {
            $scope.errorMessage = "";
            if(page == $scope.postParams.page)
                return;
            $scope.postParams.page = page;
            $scope.fetchPosts();
            if($scope.postParams.page > $scope.middle_page3 && $scope.postParams.page < $scope.totalPostPages) {
                $scope.middle_page3++;
                $scope.middle_page2++;
                $scope.middle_page1++;
            }else if($scope.postParams.page < $scope.middle_page1 && $scope.postParams.page > 1) {
                $scope.middle_page3--;
                $scope.middle_page2--;
                $scope.middle_page1--;
            }else if($scope.postParams.page == 1) {
                $scope.middle_page3 = 4;
                $scope.middle_page2 = 3;
                $scope.middle_page1 = 2;
            }else if($scope.postParams.page == $scope.totalPostPages && $scope.totalPostPages > 5) {
                $scope.middle_page3 = $scope.totalPostPages -1;
                $scope.middle_page2 = $scope.totalPostPages -2;
                $scope.middle_page1 = $scope.totalPostPages -3;
            }
        }

        $scope.togglePostDetails = function(post) {
            $scope.errorMessage = "";
            $scope.selectedPost = $scope.selectedPost == "" ? post : post.id == $scope.selectedPost.id? "" : post;
            if($scope.selectedPost == "") {
                expandedPostHeight = "";
                refreshPostScroll();
            }
        }

        $scope.$watch(function() {
            return $scope.errorMessage;
        }, function() {
                
                refreshPostScroll();
            }
        );

    }

]);
