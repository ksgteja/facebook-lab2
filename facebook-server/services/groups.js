var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";


exports.getGroups = function(userId, callback){
	
	mongo.connect(mongoURL, function(){
		var users= mongo.collection('users');
		var groups= mongo.collection('groups');
		users.findOne({_id : userId}, { groups : true , _id : false }, function(err, result){
			
			//console.log(result.groups);
			if(result){
				groups.find({_id : {$in : result.groups}}, {_id : false}).toArray(function(err, docs){
					
					callback(null,docs);
					
				});
			}
			else
				callback(null,{});
			
		});
		
		
	})
		
}
exports.createGroup = function(message, callback){
	
	mongo.connect(mongoURL, function(){
		var groups= mongo.collection("groups");
		var newsfeed = mongo.collection("newsfeed");
		 getNextSequence("groups",function(seqID){
		doc = {'_id' : seqID, 'group_name' : message.groupName};
		sort = [];
		operator = { '$push' : {groups : 1}};
		options = { 'new' : true, upsert : true};
		   groups.insert(doc, function(err, docs){
			   var users = mongo.collection('users');
			   	
			   		users.update({_id : message.userId}, {'$push' : {'groups' : seqID}}, function(err,doc){
			   			newsfeed.insert({userName : message.userName, groupName : message.groupName, activity_type : "create_group"}, function(err,doc){
			   				
			   				callback(null, {result : "success"});
			   			});		
			   				
			
			   		});
		 
		          });
		 });
	});
}

exports.getGroupMemberToAdd = function(groupName, userId, callback){
	
	mongo.connect(mongoURL, function(){
		
		var groups= mongo.collection('groups');
		var users= mongo.collection('users');

				groups.findOne({group_name : {$eq : groupName}},{_id : true}, function(err, docs){
					
				users.find({groups : {$ne : docs._id}, friends : {$eq : Number(userId)}}, {_id : true, first_name :true}).toArray(function(err, docs){
					
				    if(docs)
					
					callback(null,docs);
				    else
				    	callback(null,{});
					
				});
			
		});
});
}

exports.getMembersByGroup = function(groupName, callback){
	
	mongo.connect(mongoURL, function(){
		
		var groups= mongo.collection('groups');
		var users= mongo.collection('users');

				groups.findOne({group_name : {$eq : groupName}},{_id : true}, function(err, docs){
					console.log("group_id "+ docs._id);
				users.find({groups : {$eq : docs._id}}, {_id : true, first_name :true}).toArray(function(err, docs){
					
				    if(docs)
					
					callback(null,docs);
				    else
				    	callback(null,{});
					
				});
			
		});
});
}

exports.deleteFromGroup = function(groupName, userId, callback){
	
	mongo.connect(mongoURL, function(){
		
		var groups= mongo.collection('groups');
		var users= mongo.collection('users');

				groups.findOne({group_name : {$eq : groupName}},{_id : true}, function(err, docs){
					console.log("group_id "+ docs._id);
				users.update({_id : Number(userId)},{$pull : {groups : docs._id}}, function(err, docs){
					
				    if(docs)
					
					callback(null,docs);
				    else
				    	callback(null,{});
					
				});
			
		});
});
}

exports.addMemberToGroup = function(groupName, userId, callback){
	
	mongo.connect(mongoURL, function(){
		
		var groups= mongo.collection('groups');
		var users= mongo.collection('users');

				groups.findOne({group_name : {$eq : groupName}},{_id : true}, function(err, docs){
					console.log("group_id "+ docs._id);
				users.update({_id : Number(userId)},{$push : {groups : docs._id}}, function(err, docs){
					
				    if(docs)
					
					callback(null,docs);
				    else
				    	callback(null,{});
					
				});
			
		});
});
}

exports.deleteGroup = function(groupName, callback){
	
	mongo.connect(mongoURL, function(){
		
		var groups= mongo.collection('groups');
		var users= mongo.collection('users');

				groups.findOne({group_name : {$eq : groupName}},{_id : true}, function(err, docs){
					console.log("group_id "+ docs._id);
					users.update({},{$pull : {groups : docs._id}}, {multi :true}, function(err, docs){
					groups.remove({group_name : {$eq : groupName}}, function(err, docs){
					
				    if(docs)
					
					callback(null,docs);
				    else
				    	callback(null,{});
					});
					
				});
			
		});
});
}
getNextSequence = function(name, callback) {
	
	query = {'_id' : name};
	sort = [];
	operator = { '$inc' : {seq : 1}};
	options = { 'new' : true, upsert : true};
	
	   mongo.collection("counters").findAndModify(query, sort, operator,options, function(err, docs){
	        	  
	        	  callback(docs.value.seq);
	          });
}