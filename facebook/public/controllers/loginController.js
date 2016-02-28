app = angular.module('facebook',[]);


app.controller('loginController', ['$scope', '$http', function($scope,$http){
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.login = function(credentials){
		
		$http.post('/authenticate',{credentials : credentials}).success(function (data){
			
			if (data.statusCode == 401) {
				$scope.loginError = true;
				$scope.loginMessage = "Invalid credentials";
			}
			else
				
				window.location.assign("/homepage");
			
		}).error(function(error) {
			$scope.loginError = true;
			$scope.loginMessage = "Unexpected Error occured, Try again";
		});
		
	}

$scope.signupForm = function(signupData){
				
				$http.post('/signup',signupData).success(function(data){
					
					if(data.response == "success"){
					
					$scope.signUpSuccess = true;
					$scope.success = "Signed Up Successfully";
					
					window.location.reload();
					
					}
					else
					{
						$scope.signUpError = true;
						$scope.signupMessage = "Email already Exists";
						
					}
					
						});
	};
}]);

