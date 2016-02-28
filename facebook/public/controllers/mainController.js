app = angular.module('facebook',['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {

	   $routeProvider
	   
	   .when('/test', {
	         templateUrl : 'partials/test',
	         controller : 'testController'
	         
	      })
	      
	      .when('/viewGroup/:name', {
	         templateUrl : 'partials/viewGroup',
	         controller : 'viewGroupController'
	         
	         
	      })
	      
	      .when('/about', {
	         templateUrl : 'partials/about',
	         controller : 'aboutController'
	         
	      })
	      
	       .when('/createGroup', {
	         templateUrl : 'partials/createGroup',
	         
	      })
	      
	      .when('/newsFeed', {
	         templateUrl : 'partials/newsFeed',
	         controller : 'newsFeedController'
	         
	      })
	      
	      .when('/about', {
	         templateUrl : 'partials/about',
	         controller : 'aboutController'
	      })
	      
	      .when('/friends', {
	         templateUrl : 'partials/friends',
	         controller : 'friendsController'
	      })
	      
	      .when('/', {
	    	  
	    	  templateUrl : 'partials/newsFeed',
	    	  controller : 'newsFeedController'
	    	  
	      })
	      
	      .otherwise({redirectTo: "/"});
	}]);

app.controller('mainController',['$scope','$http','$location', '$window', '$timeout', function($scope, $http, $location, $window, $timeout){
	
	
	
	    $scope.error = false;	
	    $scope.success = false;
	    $scope.buttons = true;
	    x = ["abc", "cde", "def"];
	
		if($location.absUrl().indexOf("#") != -1  ){
			
		$scope.home = $location.absUrl()+"newsFeed";
			
		$scope.newsFeed = $location.absUrl()+"newsFeed";
		
		$scope.friends = $location.absUrl()+"test";
		
		$scope.about = $location.absUrl()+"about";
		}
		else {
			
			$scope.home = $location.absUrl()+"#/"+"newsFeed";
			
			$scope.newsFeed = $location.absUrl()+"#/"+"newsFeed";
			
			$scope.friends = $location.absUrl()+"#/"+"test";
			
			$scope.about = $location.absUrl()+"#/"+"about";
			
			
		}
	console.log($location.absUrl());
	
	$http.get('/getGroupsById').success(function(response){
		
		
		console.log("response I got"+response);
		$scope.groups = response;
	
})
		
		
	$scope.logout = function(){
			
			
			$http.get('/logout').success(function(response){
				
				if(response.value == "success")
						window.location.assign("/");
			})
			
		
	};
	
	
	
	$scope.newFeed = function(){
		
		
		//$location.path('/newsFeed');
	}
	
	$scope.createGroup = function(groupName){
		
				
				$http.post('/createGroup',{groupName : groupName}).success(function(response){
					
					
					console.log(response.result);
					window.location.reload();
					
				});
		
	}
	
$scope.clearModal = function(){
		
		$scope.success = false;
		$scope.error = false;
		$scope.groupName = "";
		
	};
	
$http.get('/getFriendRequests').success(function(data){
		
		$scope.requests = data;
		
		if(data.length > 0){
			$scope.badgeDisplay = true;
			$scope.badge = data.length;
		    
		}
		else{
			$scope.requests = [{"first_name" : "No Requests to display",
			    "id" : 0}]
			$scope.buttons = false;
		}
		
	});
	
$scope.handleFriendRequest = function(requestType, senderId){
		
		if(requestType == 1 )
			$http.post('/ApproveRequest/'+senderId).success(function(data){
				
				$scope.message = "Approved Successfully."
				$timeout( function(){ window.location.reload() }, 1000);
				
			});
		else
			$http.post('/rejectRequest/'+senderId).success(function(data){
				
				$scope.message = "Request Rejected"
				$timeout( function(){ window.location.reload() }, 1000);
				
			});
		
	}
	
	
	
}]);




