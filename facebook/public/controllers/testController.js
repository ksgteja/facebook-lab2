app = angular.module('facebook');

app.controller('testController', ['$scope', '$http', function($scope,$http){
	
	$http.get('/getTest').success(function(data){
		
		$scope.names = data;
		
		console.log(data);
	});

}]);