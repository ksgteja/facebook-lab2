

app = angular.module('facebook');

app.controller('aboutController', ['$scope', '$http', function($scope, $http){
	
	$scope.numbers = [];
	
$http.get('/getWorkInfo').success(function(data){
		
	console.log("get Work Info "+data.works);
	
	$scope.currentwork = {};
		if(data.works.length > 0){
			$scope.currentWork = true;
			$scope.currentwork = {company : data.works[0].company,
								position: data.works[0].position,
								workYear: data.works[0].year}
		}
		
		$scope.works = data.works;
		
	}); 


$http.get('/getContactInfo').success(function(data){
	
	//data.dob = data.dob.toString().slice(0,10);
	$scope.contacts = data;
	
});
/*
$http.get('/getLifeEvents').success(function(data){
	
	
	$scope.lifeevents = data;
	
});*/ 
	
	$http.get('/getSchoolInfo').success(function(data){
		
		collegeData = [];
		schoolData = [];
		$scope.currentStudy ={};
		if(data.length > 0) {
			
			$scope.currentEdu = true;
			if(data[0].attended == "College")
			$scope.currentStudy = {name: data[0].college_name,
									attended : data[0].college_year}
		
			else if(data[0].attended == "gradudate")
				
				$scope.currentStudy = {name: data[0].college_name,
					attended : data[0].college_year,
					concentration : data[0].concentration}
		
			
			else
				
				$scope.currentStudy = { name : data[0].school_name,
						year : data[0].school_year
				}
		}
			
		
		for(row = 0; row < data.length; row++){
			if(data[row].attended == "College" || data[row].attended == "gradudate" ){
				
				collegeData.push({ college_name : data[row].college_name,
								  concentration : data[row].concentration,
								  college_year : data[row].college_year,
								  attended : data[row].attended});
			}
			else
				{
				schoolData.push({ school_name : data[row].school_name,
									school_year : data[row].school_year,
									})
				}						
		}
				$scope.colleges = collegeData;
				$scope.schools = schoolData;
				
	}); 
	for( year = 1990; year<=2015; year++)
		$scope.numbers.push(year);
	
	
	$scope.hideAll = function(){
		$scope.over = false;
		$scope.work = false;
		$scope.contact = false;
		$scope.life = false;
	
	}
	
	$scope.navigate = function(id){
		
		$scope.hideAll();
		if(id == 1)
			$scope.over = true;
		else if(id == 2)
			$scope.work = true;
		else if(id == 3)
			$scope.contact = true;
		else if(id == 4 )
			$scope.life = true;
		
	}
	
	$scope.add = function(activity){
		
		if( activity == 'college'){
			
			$scope.title = "Add a College";
			$scope.name = "School";
			$scope.yearName = "Year Completed";
			$scope.concentration = true;
			$scope.attendFor = true;
			$scope.position = false;
			$scope.city = false;
			
	
		}
		
		else if ( activity == 'work' ){
			
			$scope.title = "Add a Work";
			$scope.name = "Company";
			$scope.yearName = "Year Joined";
			$scope.position = true;
			$scope.city = true;
			$scope.attendFor = false;
			$scope.concentration = false;
		}
		
		else if ( activity == 'highSchool' ){
			$scope.title = "Add a school";
			$scope.yearName ="Year Completed";
			$scope.position = false;
			$scope.city = false;
			$scope.attendFor = false;
			$scope.concentration = false;
			
		}
		
		$scope.activity = activity;
		
	}
	
	$scope.create = function(){
		
		console.log($scope.yearSelected);
		console.log($scope.typeOfDegree);
	}
	
	$scope.contactUpdate = function(contact){
		
		
		$http.post('/updateContact',{contactInfo : contact}).success(function(response){
			
			console.log("This is response I received" + response);
			window.location.reload();
			
		});
		
	}
	
	$scope.updateEducation = function(form, activity){
		
		
		if(activity == 'college'){
			
			$http.post('/insertSchoolInfo',{formData : form}).success(function(data){
				
				
			})
			console.log(form.name);
			console.log(form.position);
			console.log(form.city);
			console.log(form.yearSelected);
			console.log(form.concentration);
			console.log(form.typeOfDegree);
		
		
	}
		else if(activity == 'work'){
			
			$http.post('/insertWorkInfo',{formData : form}).success(function(data){
				
				window.location.reload();
			})
			
		}
		else if ( activity == 'highSchool'){
			
			$http.post('/insertSchoolInfo',{formData : form}).success(function(data){
				window.location.reload();
				
			})
	
		}
	}
	
	$scope.submitLifeEvent = function(lifeEvent){
		
		
		$http.post('/submitLifeEvent', {lifeEvent : lifeEvent}).success(function(data){
			
			window.location.reload();
		})
	}
	
	
}]);