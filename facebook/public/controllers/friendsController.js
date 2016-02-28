app = angular.module('facebook');


app.controller('friendsController', ['$scope', '$http','$timeout', function($scope,$http,$timeout){
	
	$scope.friends = "";
	autoCompleteData = [];
	
$http.get('/getAddFriends').success(function(data){
	
		
		autoCompleteData = data;
		
	});

	$http.get('/getFriends').success(function(data){
		
		$scope.friends = data;
		
		
	});
	
	
	$http.get('/getFriendRequests').success(function(data){
		
		console.log("controller -getFriendRequests "+data);
		$scope.requests = data;
	});
	
	$scope.handleFriendRequest = function(requestType, senderId, senderName){
		
		if(requestType == 1 ){
			$http.post('/ApproveRequest/'+senderId+'/'+senderName).success(function(data){
				
				$scope.message = "Approved Successfully."
				$timeout( function(){ window.location.reload() }, 3000);
				
			});
		}
		else
			$http.post('/rejectRequest/'+sender).success(function(data){
				
				$scope.message = "Request Rejected"
				$timeout( function(){ window.location.reload() }, 3000);
				
			});
		
	}
	
	$scope.addFriend = function(userId){
		
		     $scope.searchText = "";
		     $scope.display = [];
		if (confirm('Are you sure you want to add this Person?')) {
		$http.post('/sendFriendRequest/'+userId).success(function(data){
			
				window.location.reload();
			
		});
		
		}
		
	}
	
	
	$scope.changeTrigger = function(){
		
		result = [];
		text = $scope.searchText;
		console.log("length"+autoCompleteData.length);
		for ( i =0; i< autoCompleteData.length; i++){
			if(autoCompleteData[i].first_name.toLowerCase().indexOf(text) != -1){
			  result.push({name : autoCompleteData[i].first_name,
					  id : autoCompleteData[i]._id});
			}
		}
		
		
		$scope.display = result;
		
		if(text == "")
			$scope.display = [];
	} 
	
	
}]);