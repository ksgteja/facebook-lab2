var mq_client = require('../rpc/client');

function facebookRouteConfig(app) {
    
    this.app = app;
    this.routeTable = [];
    this.init();
}


facebookRouteConfig.prototype.init = function () {
    
    var self = this;
    
    this.addRoutes();
    this.processRoutes();


}


facebookRouteConfig.prototype.processRoutes = function () {
    
    var self = this;
    
    self.routeTable.forEach(function (route) {
        
        if (route.requestType == 'get') {
            
         
            self.app.get(route.requestUrl, route.callbackFunction);
        }
        else if (route.requestType == 'post') {
            
            
            self.app.post(route.requestUrl, route.callbackFunction);
        }
        
        
        else if (route.requestType == 'put'){
            
            self.app.put(route.requestUrl, route.callbackFunction);
            
        }
        
        
    
    });
}


facebookRouteConfig.prototype.addRoutes = function () {
    
    var self = this;
    
    self.routeTable.push({
        
        requestType : 'get',
        requestUrl : '/',
        callbackFunction : function (request, response) {
            
            response.render('index.ejs');
        }
    });
    
self.routeTable.push({
        
        requestType : 'get',
        requestUrl : '/homepage',
        callbackFunction : function (request, response) {
            
        	if(request.session.email)
        	{
        		response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        		response.render('homePage.ejs',{username: request.session.name});
        	}
        	else
        	{
        		
        		response.redirect('/');
        	}
        }
    });

    self.routeTable.push({
        
        requestType : 'post',
        requestUrl : '/authenticate',
        callbackFunction : function (request, response) {
        	 
        	 msg_payload = {email : request.body.credentials.email,
        			 		password : request.body.credentials.password,
        			 		handlerType : "authenticate"};
        	  
        	 if(request.body.credentials.email !='' && request.body.credentials.password !=''){
        		 
        		 mq_client.make_request('registration_queue',msg_payload, function(err,data){
        			 
        			 if(data.response != "invalid"){
         				
         				request.session.email = data.response.email;
         				request.session.userid = Number(data.response._id);
         				request.session.name = data.response.first_name;
         				console.log(request.session.email);
         				console.log(request.session.userid);
         				console.log("This is id stored in _id "+data.response._id);
         				console.log(request.session.name);
         				json_responses = {"statusCode" : 200};
         				response.send(json_responses);
         				
         			}
         			else
         			{
         				json_responses = {"statusCode" : 401};
         				response.send(json_responses);
         			} 
        			 
        			 
        		 });
        	
       }
        	 else
        		{
        			json_responses = {"statusCode" : 401};
        			res.send(json_responses);
        		}
            
        }
    });
    
    self.routeTable.push({
	     
	     requestType : 'get',
	     requestUrl : '/getGroupsById',
	     callbackFunction : function (request, response) {
	    	 
	    	 msg_payload = {id : request.session.userid, handlerType : "getGroups"};
 	  
 		 
 		 mq_client.make_request('groups_queue',msg_payload, function(err, data){
 			 
 			 response.send(data);
 			 
 		 });
	     }
	 });
    
    self.routeTable.push({
	     
	     requestType : 'post',
	     requestUrl : '/checkEmail',
	     callbackFunction : function (request, response) {
	    	 
	    	 var sql = require('./ssql.js');
	    	 
	    	 var email = request.body.email;
	    	 sql.db.checkEmail(email, function(data){
	    		 
	    		 response.send(data);
	    	 });
	     }
	 });
    
    self.routeTable.push({
	     
	     requestType : 'get',
	     requestUrl : '/getnewsFeedData',
	     callbackFunction : function (request, response) {
	    	 
	    	 msg_payload = {userId : request.session.userid, userName : request.session.name, handlerType : "getnewsFeedData"};
	   	  
	 		 mq_client.make_request('users_queue',msg_payload, function(err, data){
	 			 
	 			 response.send(data);
	 			 
	 		 });
	    	
	     }
	 });
    
    
    self.routeTable.push({
	     
	     requestType : 'post',
	     requestUrl : '/insertSchoolInfo',
	     callbackFunction : function (request, response) {
	    	 
	    	 var formData = request.body.formData;
	    	 msg_payload = {userId : request.session.userid, formData : formData, handlerType : "insertSchoolInfo"};
	  
	 		 mq_client.make_request('users_queue',msg_payload, function(err, data){
	 			 
	 			 response.send(data);
	 			 
	 		 });
	    	 
	     } 
	 });
    
    self.routeTable.push({
	     
	     requestType : 'post',
	     requestUrl : '/insertWorkInfo',
	     callbackFunction : function (request, response) {
	    	 
	    	 var formData = request.body.formData;
	    	 msg_payload = {userId : request.session.userid, formData : formData, handlerType : "insertWorkInfo"};
	    	  
	 		 
	 		 mq_client.make_request('users_queue',msg_payload, function(err, data){
	 			 
	 			 response.send(data);
	 			 
	 		 });
	    	 

	     }
	 }); 

    self.routeTable.push({
	     
	     requestType : 'get',
	     requestUrl : '/getSchoolInfo',
	     callbackFunction : function (request, response) {
	    	 
	    	 msg_payload = {userId : request.session.userid, handlerType : "getSchoolInfo"};
	    	  
	 		 
	 		 mq_client.make_request('users_queue',msg_payload, function(err, data){
	 			 
	 			 response.send(data);
	 			 
	 		 });
	    	 
	     }
	 }); 
    
    self.routeTable.push({
	     
	     requestType : 'get',
	     requestUrl : '/getWorkInfo',
	     callbackFunction : function (request, response) {
	    	 
	    	 
	    	 msg_payload = {userId : request.session.userid, handlerType : "getWorkInfo" };
        	 mq_client.make_request('users_queue',msg_payload, function(err,data){
        	 
        		 response.send(data);
        	 });
	    	 
	     }
	 }); 
    
    self.routeTable.push({
	     
	     requestType : 'get',
	     requestUrl : '/getContactInfo',
	     callbackFunction : function (request, response) {
	    	 
	    	 
	    	 msg_payload = {userId : request.session.userid, handlerType : "getContactInfo" };
        	 mq_client.make_request('users_queue',msg_payload, function(err,data){
        	 
        		 response.send(data);
        	 });
	     }
	 }); 
    
    self.routeTable.push({
	     
	     requestType : 'post',
	     requestUrl : '/updateContact',
	     callbackFunction : function (request, response) {
	    	 
	    	 var contact = request.body.contactInfo;
	    	 msg_payload = {userId : request.session.userid, contact : contact, handlerType : "updateContact" };
        	 mq_client.make_request('users_queue',msg_payload, function(err,data){
        	 
        		 response.send(data);
        	 });
	    	 
	     } 
	 }); 
    
    self.routeTable.push({
	     
	     requestType : 'get',
	     requestUrl : '/getLifeEvents',
	     callbackFunction : function (request, response) {
	    	 
	    	 msg_payload = {userId : request.session.userid, contact : contact, handlerType : "updateContact" };
        	 mq_client.make_request('users_queue',msg_payload, function(err,data){
        	 
        		 response.send(data);
        	 });
	     }
	 }); 
    
    self.routeTable.push({
	     
	     requestType : 'post',
	     requestUrl : '/updateStatus',
	     callbackFunction : function (request, response) {
	    	 
	    	 
	    	 msg_payload = {name : request.session.name, status : request.body.status, handlerType : "updateStatus" };
        	 mq_client.make_request('users_queue',msg_payload, function(err,data){
        	 
        		 response.send(data);
        	 });
	    	 
	     }
	 });
    
    self.routeTable.push({
	     
	     requestType : 'post',
	     requestUrl : '/submitLifeEvent',
	     callbackFunction : function (request, response) {
	    	 
	    	 msg_payload = {lifeEvent : request.body.lifeEvent, name : request.session.name, handlerType : "submitLifeEvent" };
        	 mq_client.make_request('users_queue',msg_payload, function(err,data){
        	 
        		 response.send(data);
        	 });
	     
	     }
	 });
    
 self.routeTable.push({ 
        
        requestType : 'post',
        requestUrl : '/signup',
        callbackFunction : function (request, response) {
        	
        	dob = request.body.dob.slice(0,10);
        	request.body.dob = dob;
        	msg_payload = {SignUpData : request.body, handlerType : "signup" };
        	 mq_client.make_request('registration_queue',msg_payload, function(err,data){
        	 
        		 response.send(data);
        	 });
        	
        	
        }
    });
 
 self.routeTable.push({
	 
     requestType : 'get',
     requestUrl : '/getGroup/:group',
     callbackFunction : function (request, response) {
     	groupName = request.params.group;
     	
     	console.log("In router server "+ groupName);
     	var sql = require('./ssql.js');
     	sql.db.getGroup(groupName,function(data){
     	
     			response.send(data);
     	

     	});
     }
 });
 
 self.routeTable.push({
	 
 requestType : 'post',
 requestUrl : '/createGroup',
 callbackFunction : function (request, response) {
 	groupName = request.body.groupName;
 	
 	
 	 msg_payload = {groupName : groupName,
		 		userId : request.session.userid,
		 		userName : request.session.name,
		 		handlerType : "createGroup"};
	 
	 mq_client.make_request('groups_queue',msg_payload, function(err,data){
 	
		 console.log("In routing "+data);
 	
 			response.send(data);

 	});
 }
 }),
  
 self.routeTable.push({
     
     requestType : 'get',
     requestUrl : '/partials/:name',
     callbackFunction : function (request, response) {
    	 var name = request.params.name;
         response.render('partials/'+name);
     }
 });
 
self.routeTable.push({
     
     requestType : 'get',
     requestUrl : '/getMembersByGroup/:name',
     callbackFunction : function (request, response) {
    	 var groupName = request.params.name;
    	 
    	 msg_payload = {groupName : groupName, handlerType : "getMembersByGroup"};
     	
     	mq_client.make_request('groups_queue',msg_payload, function(err,data){
     		
     		response.send(data);
     		
     	});
     	
         
     }
 });

self.routeTable.push({
    
    requestType : 'get',
    requestUrl : '/getFriends',
    callbackFunction : function (request, response) {
    	
    	msg_payload = {userId : request.session.userid, handlerType : "getFriends"};
    	
    	mq_client.make_request('friends_queue',msg_payload, function(err,data){
    		
    		response.send(data);
    		
    	});
        
    }
});
//changed
self.routeTable.push({
requestType : 'get',
requestUrl : '/getAddFriends',
callbackFunction : function (request, response) {
	
	msg_payload = {userId  : request.session.userid, handlerType : "getAddFriends"};
	mq_client.make_request('friends_queue',msg_payload, function(err,data){
		response.send(data);
		
	});   
	
    
} 
});

self.routeTable.push({
	requestType : 'get',
	requestUrl : '/getGroupMemberToAdd/:groupName',
	callbackFunction : function (request, response) {
		
		msg_payload = {userId : request.session.userid, groupName : request.params.groupName, handlerType : "getGroupMemberToAdd"}
		mq_client.make_request('groups_queue', msg_payload, function(err, data){
			
			console.log("routing config "+data);
			response.send(data);
			
		});
		
	}
	});
self.routeTable.push({
	requestType : 'post',
	requestUrl : '/approveRequest/:senderId/:senderName',
	callbackFunction : function (request, response) {
		var senderId = request.params.senderId;
		var senderName = request.params.senderName;
		console.log("Sender details"+ senderId);
		console.log("Sender name "+ senderName);
		
		msg_payload = {userName : request.session.name, userId : request.session.userid, senderId : senderId, senderName : senderName, handlerType : "approveRequest"}
		mq_client.make_request('friends_queue', msg_payload, function(err, data){
			
			console.log("routing config "+data);
			response.send(data);
			
		});
		
	    
	}
	});

self.routeTable.push({
	requestType : 'post',
	requestUrl : '/rejectRequest/:sender',
	callbackFunction : function (request, response) {
		var senderId = request.params.sender;
		
		msg_payload = {userId : request.session.userid, senderId : senderId, handlerType : "rejectRequest"}
		mq_client.make_request('friends_queue', msg_payload, function(err, data){
			
			console.log("routing config "+data);
			response.send(data);
			
		});
		
	    
	}
	});

self.routeTable.push({
    
    requestType : 'post',
    requestUrl : '/deleteFromGroup/:group/:id',
    callbackFunction : function (request, response) {
   	 var userId = request.params.id;
   	 var group = request.params.group;
   	 
 	msg_payload = {groupName : group, userId : userId, handlerType : "deleteFromGroup"};
    mq_client.make_request('groups_queue',msg_payload, function(err, data){
    			 
    			 response.send(data);
    			 
    		 });
    
        
    }
});

self.routeTable.push({
    
    requestType : 'post',
    requestUrl : '/sendFriendRequest/:id',
    callbackFunction : function (request, response) {
   	 
   	msg_payload = {senderId : request.session.userid, recieverId : request.params.id, handlerType : "sendFriendRequests"};
    mq_client.make_request('friends_queue',msg_payload, function(err, data){
    			 
    			 response.send(data);
    			 
    		 });
        
    }
});

self.routeTable.push({
    
    requestType : 'get',
    requestUrl : '/getFriendRequests',
    callbackFunction : function (request, response) {
    	
    	msg_payload = {userId : request.session.userid, handlerType : "getFriendRequests"};
 mq_client.make_request('friends_queue',msg_payload, function(err, data){
 			 
 			 response.send(data);
 			 
 		 });    
    }
});

self.routeTable.push({
    
    requestType : 'post',
    requestUrl : '/deleteGroup/:groupname',
    callbackFunction : function (request, response) {
   	 var groupName = request.params.groupname;
   	 
 	msg_payload = {groupName : groupName, handlerType : "deleteGroup"};
    mq_client.make_request('groups_queue',msg_payload, function(err, data){
    			 
    			 response.send(data);
    			 
    		 });
        
    }
});

self.routeTable.push({
    
    requestType : 'post',
    requestUrl : '/addMemberToGroup/:groupname/:userId',
    callbackFunction : function (request, response) {
   	 var groupName = request.params.groupname;
   	 var userId = request.params.userId;
   	 
   	msg_payload = {userId : userId, groupName : groupName, handlerType : "addMemberToGroup"};
    mq_client.make_request('groups_queue',msg_payload, function(err, data){
    			 
    			 response.send(data);
    			 
    		 });    
       }
    
});
 
 self.routeTable.push({
     
     requestType : 'get',
     requestUrl : '/logout',
     callbackFunction : function (request, response) {
    	 request.session.destroy();
         response.json({"value" : "success"});
     }
 });

    
}

module.exports = facebookRouteConfig;