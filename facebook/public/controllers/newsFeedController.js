app = angular.module('facebook');

app.controller('newsFeedController', ['$scope', '$http', function($scope, $http){
	
	feeds = [];
	
	/*$http.get('/getNewsFeedData').success(function(data){
		feed = {};
		for(id = 0; id < data.length; id++){
			
			if(data[id].activity_type == "create_group"){
				
				   feed = 	{ heading : data[id].userName+" created group "+data[id].groupName,
						      groups : true
					        }
				   feeds.push(feed);
				}
			
			if(data[id].activity_type == "add_group"){
				
				   feed = 	{ heading : data[id].userName+" is added to "+data[id].groupName,
						  	  groups : true
					        }
				   feeds.push(feed);
				}
			
			if(data[id].activity_type == "friends"){
				
				   feed = 	{ heading : " "+data[id].userName+" and "+data[id].friendName+" are friends",
						   	  friend : true
						  	  
					        }
				   feeds.push(feed);
				}
			
			if(data[id].activity_type == "status"){
				
			   feed = 	{ heading : data[id].userName+" updated Status",
					  	  content : data[id].status,
					  	  status : true
				        }
			   feeds.push(feed);
			}
			
			
		}
		
		
		
		$scope.feeds = feeds;

		
	}); */
	
	$scope.postStatus = function(){
		
		if($scope.statusText != ""){
			
			$http.post('/updateStatus',{status : $scope.statusText}).success(function(response){
				
				window.location.reload();
				
			});
			
		}
		
	}
	
}]);