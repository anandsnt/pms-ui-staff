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
        var deleteIndex = "";

        var POST_LIST_SCROLL = 'post-list-scroll',
            COMMENT_LIST_SCROLL = 'comment-list-scroll';

        $scope.refreshPostScroll = function(scrollUp) {
            $scope.refreshScroller(POST_LIST_SCROLL);
            if ( $scope.myScroll.hasOwnProperty(POST_LIST_SCROLL) ) {
                $scope.myScroll[POST_LIST_SCROLL].scrollTo(0, 0, 100);
            };
        }

        $scope.refreshCommentScroll = function() {
            $scope.refreshScroller(COMMENT_LIST_SCROLL);
            if ( $scope.myScroll.hasOwnProperty(COMMENT_LIST_SCROLL) ) {
                $scope.myScroll[COMMENT_LIST_SCROLL].scrollTo(0, 0, 100);
            };
            $scope.refreshFilterScroll();
        };

        var setScroller = function() {
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(POST_LIST_SCROLL, scrollerOptions);
            // $scope.setScroller(COMMENT_LIST_SCROLL, scrollerOptions);
        };

        setScroller();

        $scope.fetchPosts = function(){
            var options = {};
            options.params = $scope.postParams;
            options.onSuccess = function(data){
                
                $scope.posts = data.results.posts;
                $scope.totalPostPages = data.results.total_count % $scope.postParams.per_page > 0 ? Math.floor(data.results.total_count / $scope.postParams.per_page) + 1 : Math.floor(data.results.total_count / $scope.postParams.per_page);
                $scope.$emit('hideLoader');
                $scope.refreshPostScroll();
            }
            $scope.callAPI(RVSocilaLobbySrv.fetchPosts, options);
        }

        $scope.fetchPosts();

        $scope.refreshPosts = function(){
            $scope.postParams.page = 1;
            $scope.middle_page1 = 2, $scope.middle_page2 = 3, $scope.middle_page3 = 4;
            $scope.newPost = "";
            $scope.fetchPosts();
        }

        $scope.addPost = function(){
            var options = {};
            options.params = {
                "post" :{
                "post_message": $scope.newPost,
                "body_html": "testtt"
            }};
            options.onSuccess = function(data){

                $scope.refreshPosts();
            }
            $scope.callAPI(RVSocilaLobbySrv.addPost, options);
        }

        $scope.goToStayCard = function(reservation_id, event){
            event.preventDefault();
            $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                id: reservation_id,
                isrefresh: false
            });
        }

        $scope.deletePostClicked = function(post_id){
            deleteIndex = post_id;
            ngDialog.open({
                   template: '/assets/partials/socialLobby/rvSLPostDelete.html',
                   className: 'ngdialog-theme-default single-calendar-modal',
                   scope: $scope,
                   closeByDocument: true});
        }
        $scope.closeDialog = function(){
            ngDialog.close();
        }
        $scope.deletePost = function(){
            var options = {};
            options.params = {'post_id': deleteIndex};
            options.onSuccess = function(data){
                
                $scope.refreshPosts();
                ngDialog.close();
            }
            $scope.callAPI(RVSocilaLobbySrv.deletePost, options);
        }

        $scope.paginatePosts = function(page){
            if(page == $scope.postParams.page)
                return;
            $scope.postParams.page = page;
            $scope.fetchPosts();
            if($scope.postParams.page > $scope.middle_page3 && $scope.postParams.page < $scope.totalPostPages){
                $scope.middle_page3++;
                $scope.middle_page2++;
                $scope.middle_page1++;
            }else if($scope.postParams.page < $scope.middle_page1 && $scope.postParams.page > 1){
                $scope.middle_page3--;
                $scope.middle_page2--;
                $scope.middle_page1--;
            }else if($scope.postParams.page == 1){
                $scope.middle_page3 = 4;
                $scope.middle_page2 = 3;
                $scope.middle_page1 = 2;
            }else if($scope.postParams.page == $scope.totalPostPages && $scope.totalPostPages > 5){
                $scope.middle_page3 = $scope.totalPostPages -1;
                $scope.middle_page2 = $scope.totalPostPages -2;
                $scope.middle_page1 = $scope.totalPostPages -3;
            }
        }

        $scope.togglePostDetails = function(post){
            $scope.selectedPost = $scope.selectedPost == "" ? post : post.id == $scope.selectedPost.id? "" : post;
        }

    }

]);
