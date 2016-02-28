var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

exports.getContactInfo = function(userId, callback){
	
	//mobile,address,shows,music,sports
	console.log("I am here");
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		users.findOne({_id : Number(userId)}, { address : true, mobile : true , dob : true, gender : true, email : true, shows : true, music : true, sports: true }, function(err, result){
			
			console.log("Error "+err);
			if(result){
					callback(null,result);
			}
			else
				callback(null,{});			
		});
	});

};

exports.updateContact = function(userId, contact, callback){
	
	//mobile,address,shows,music,sports
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		users.update({_id : Number(userId)}, { $set : {address : contact.address, mobile : contact.mobile, shows : contact.shows, music : contact.music, sports: contact.sports }}, function(err, result){

			if(result){
					callback(null,result);
			}
			else
				callback(null,{});			
		});
	});

};

exports.getWorkInfo = function(userId, callback){
	
	//mobile,address,shows,music,sports
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		users.findOne({_id : Number(userId)}, { works : true, _id : false }, function(err, result){
			
			console.log("Result "+result);
			if(result){
					callback(null,result);
			}
			else
				callback(null,{});			
		});
	});

};

exports.insertWorkInfo = function(userId, workInfo, callback){
	
	//company, position, city, year, userId
	console.log("In Insert Work Info");
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		users.update({_id : Number(userId)}, {$push : {works : {company : workInfo.name, position : workInfo.position, city: workInfo.city, year : workInfo.yearSelected}}}, function(err, result){
			
			console.log("Error "+err);
			if(result){
					callback(null,result);
			}
			else
				callback(null,{});			
		});
	});

};

exports.getSchoolInfo = function(userId, callback){
	
	//company, position, city, year, userId
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		users.findOne({_id : Number(userId)}, {schools : true, _id : false}, function(err, result){
			//console.log("Error "+err);
			if(result.schools){
				console.log(result);
				console.log("Inside result block");
					callback(null,result.schools);
			}
			else
				callback(null,{});			
		});
	});

};

exports.insertSchoolInfo = function(userId, SchoolData, callback){
	
	//company, position, city, year, userId
	//formData.name+"', "+formData.yearSelected+", '"+formData.concentration+"', '"+formData.typeOfDegree
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		if(SchoolData.concentration &&SchoolData.typeOfDegree){
			insertValues = {college_name : SchoolData.name, college_year : SchoolData.yearSelected, concentration : SchoolData.concentration, attended : SchoolData.typeOfDegree}
		}
		else{
			//"insert into about_school (school_name, school_year, userId) values ('"+form.name+"', "+form.yearSelected+", "+userId+")";
			insertValues = {school_name : SchoolData.name, school_year : SchoolData.yearSelected};
		}
		users.update({_id : Number(userId)}, {$push : {schools : insertValues}}, function(err, result){			
			console.log("Error "+err);
			if(result){
					callback(null,result);
			}
			else
				callback(null,{});			
		});
		
	});

};

exports.submitLifeEvent = function(name, lifeEvent, callback){
	
	//type, message
	//formData.name+"', "+formData.yearSelected+", '"+formData.concentration+"', '"+formData.typeOfDegree
	mongo.connect(mongoURL, function(){
		var newsfeed= mongo.collection('newsfeed');
		newsfeed.insert({userName : name, lifeEventType : lifeEvent.type, lifeMessage : lifeEvent.message, activity_type : "lifeEvent" }, function(err, result){			
			console.log("Error "+err);
			if(result){
					callback(null,result);
			}
			else
				callback(null,{});			
		});
		
	});

};

exports.updateStatus = function(name, status, callback){
	
	//type, message
	//formData.name+"', "+formData.yearSelected+", '"+formData.concentration+"', '"+formData.typeOfDegree
	mongo.connect(mongoURL, function(){
		var newsfeed= mongo.collection('newsfeed');
		newsfeed.insert({userName : name,status : status, activity_type : "status" }, function(err, result){			
			console.log("Error "+err);
			if(result){
					callback(null,result);
			}
			else
				callback(null,{});			
		});
		
	});

};

exports.getNewsFeedData = function(userId, userName, callback){
	
	mongo.connect(mongoURL, function(){
		var newsfeed= mongo.collection('newsfeed');
		var users = mongo.collection('users');
		users.findOne({_id : userId},{friends: true, _id : false}, function(err, result){
		newsfeed.find({userName : name, status : status, activity_type : "status" }, function(err, result){			
			console.log("Error "+err);
			if(result){
					callback(null,result);
			}
			else
				callback(null,{});			
		});
		});
		
	});

};