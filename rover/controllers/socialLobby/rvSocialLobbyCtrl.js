sntRover.controller('RVSocialLobbyCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVSocilaLobbySrv',
    '$timeout',
    function($scope, $rootScope, $filter, RVSocilaLobbySrv, $timeout) {

        BaseCtrl.call(this, $scope);

        $scope.posts = [];
        $scope.postParams = {'page': 1, 'per_page':25};
        
        $scope.newPost = "";

        var POST_LIST_SCROLL = 'post-list-scroll',
            COMMENT_LIST_SCROLL = 'comment-list-scroll';

        $scope.refreshPostScroll = function(scrollUp) {
            $scope.refreshScroller(POST_LIST_SCROLL);
            if ( !!scrollUp && $scope.myScroll.hasOwnProperty(POST_LIST_SCROLL) ) {
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
            $scope.fetchPosts();
        }

        $scope.addPost = function(){
            var options = {};
            options.params = {
                "post" :{
                "author_name": "shaun alex",
                "post_message": $scope.newPost,
                "body_html": "testtt"
            }};
            options.onSuccess = function(data){
                $scope.refreshPosts();
            }
            $scope.callAPI(RVSocilaLobbySrv.addPost, options);
        }

        $scope.goToStayCard = function(reservation_id){

        }

        $scope.deletePost = function(post_id){
            var options = {};
            options.params = {'post_id': post_id};
            options.onSuccess = function(data){
                
                $scope.refreshPosts();
            }
            $scope.callAPI(RVSocilaLobbySrv.deletePost, options);
        }

        $scope.paginatePosts = function(page){
            $scope.postParams.page = page;
            $scope.fetchPosts();
        }

    }

]);
