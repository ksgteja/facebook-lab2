var mongo = require("./mongo");
var mongoURL = "mongodb://127.0.0.1:27017/facebook";

exports.getAddFriends = function(userId, callback){
	
	mongo.connect(mongoURL, function(db){
		var users= mongo.collection(db, 'users');
		users.findOne({_id : userId}, function(err, result){
			if(result){
				console.log("I have entered result block");
		//	console.log("Fetch user " +result.toString());
			filterArray = [];
			for( request in  result.requests){
				filterArray.push(result.requests[request].id);
			}
			if(result.friends.length >0)
				   filterArray = result.friends.concat(filterArray);
			   filterArray.push(userId);  
			   console.log("Resultant array" +filterArray);
			   user = [userId];
				query = { _id : { $nin : filterArray }, 'requests.id' : {$nin : user}}
				users.find(query, {_id : true, first_name : true}).toArray(function(err, docs){
					console.log("getAddFriends -service "+docs);
					//mongo.closeConnection(db);
					callback(null,docs);
					
				});
			
			}
			else
				callback(null,{});
		});		
	});
};

exports.getFriends = function(userId, callback){
		
		mongo.connect(mongoURL, function(){
			var users= mongo.collection('users');
			users.findOne({_id : userId}, {friends : true}, function(err, result){
				if(result.friends.length > 0){			
					query = { _id : { $in : result.friends }}
					projection = {_id : true, first_name : true};
					users.find(query, projection).toArray(function(err, docs){
						callback(null,docs);
						
					});
				}
				else
					callback(null,{});
			});
		});
};

exports.getFriendRequests = function(userId, callback){
	
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		users.findOne({_id : userId}, {requests : true}, function(err, result){
			console.log(result.requests.length);
			
			if(result.requests.length > 0){	
				resultArray = [];
				for(request in result.requests){
					if(result.requests[request].status == "pending")
					resultArray.push(result.requests[request].id);
				}
				query = { _id : { $in : resultArray }}
				projection = {_id : true, first_name : true};
				users.find(query, projection).toArray(function(err, docs){
					callback(null,docs);
					
				});
			}
			
			else{
				console.log("Reached callback");
				callback(null, {});
				
			}
		});
	});
};

exports.approveRequest = function(userId, userName, senderId, senderName, callback){
	
	console.log("Reached Approve Request");
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		users.update({_id : userId},{$push : {friends :  Number(senderId)}}, function(err, result){
			users.update({_id : Number(senderId)},{$push : {friends :  userId}}, function(err, result){
				users.update({_id : userId,'requests.id' : Number(senderId)}, {$set : {'requests.$.status' : "approved"}}, function(err, result){
					var newsfeed= mongo.collection('newsfeed');
					newsfeed.insert({username : userName, activity_type : "friends", friendName : senderName}, function(err, result){
						callback(null,{response : "success"});
					});
				
					
				})
				
			});
		});
	});
};

exports.rejectRequest = function(userId, senderId, callback){
	
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		users.update({_id : userId},{$pull : {requests : {id : Number(senderId)}}}, function(err, result){
	
					callback(null,{response : "success"});
				
		});
	});
};

exports.sendFriendRequest = function(senderId, recieverId, callback){
	
	console.log("I am here");
	console.log("Sender ID" + Number(senderId));
	console.log("Reciever ID "+ Number(recieverId));
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		users.update({_id : Number(recieverId)},{$push : {requests : {id : Number(senderId), status : "pending"}}}, function(err, result){
			console.log(err);
	
					callback(null,{response : "success"});
				
		});
	});
};