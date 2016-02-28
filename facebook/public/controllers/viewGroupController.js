app = angular.module('facebook');


app.controller('viewGroupController', ['$scope', '$http', '$location', '$routeParams', function($scope,$http, $location, $routeParams){
	
	$scope.groupName = $routeParams.name;
	name = $routeParams.name;
	$scope.show = true;
	
	
	data = [];
	$http.get('/getMembersByGroup/'+name).success(function(data){
		
		$scope.members = data;
		
	});
	
	$http.get('/getGroupMemberToAdd/'+name).success(function(friends){
		
		data = friends;
	}); 
	
	$scope.deleteMember = function(userId){
		
		$http.post("/deleteFromGroup/"+name+"/"+userId).success(function(response){
			
			
			window.location.reload();
			
		});
		
		
	}
	
	
	$scope.changeTrigger = function(){
		
		result = [];
		text = $scope.text;
		for ( i =0; i<data.length; i++){
			
			if(data[i].first_name.toLowerCase().indexOf(text) != -1){
			  result.push({name : data[i].first_name,
					  id : data[i]._id});
			}
		}
		
		$scope.display = result;
		
		if($scope.text == "")
			$scope.display = [];
	}
	
	$scope.addMemberToGroup = function(userId){
		
		if (confirm('Are you sure you want to add this member to group?')){
			
			$http.post('/addMemberToGroup/'+name+'/'+userId).success(function(response){
				
				window.location.reload();
				
			})
			
		}
	}
	
	$scope.deleteGroup = function(groupName){
		
		if (confirm('Are you sure you want to delete this group?')) {
		     $http.post('/deleteGroup/'+groupName).success(function(response){
		    	 
		    	 $location.path('/');
		    	 window.location.reload();
		    	 
		    	 
		    	 
		     })
		}
	} 

}]);