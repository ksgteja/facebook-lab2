//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var friends = require('./services/friends');
var groups = require('./services/groups');
var user = require('./services/user');
var registration = require('./services/registration');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on registration_queue");

	cnn.queue('registration_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			if(message.handlerType == "authenticate"){
				registration.authenticate(message, function(err,res){
				console.log("m.replyTo in login_queue "+m.replyTo);
				console.log("CorrelationID login "+ m.correlationId);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
			}
			else if(message.handlerType == "signup"){
				
				registration.signup(message.SignUpData, function(err,res){
					
					console.log("m.replyTo in signup_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on friends_queue");

	cnn.queue('friends_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.handlerType == "getAddFriends"){
				friends.getAddFriends(message.userId, function(err,res){

					//return index sent
					console.log(res);
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "getFriends"){
				
				friends.getFriends(message.userId, function(err,res){

					console.log(res);
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}
			else if(message.handlerType == "getFriendRequests"){
				
				friends.getFriendRequests(message.userId, function(err,res){

					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					console.log("Response- getFriendRequests "+res);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}
			else if(message.handlerType == "approveRequest"){
				
				friends.approveRequest(message.userId, message.userName, message.senderId,message.senderName, function(err,res){

					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					console.log("response at server "+res );
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}
			
			else if(message.handlerType == "rejectRequest"){
				
				friends.rejectRequest(message.userId,message.senderId, function(err,res){

					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					console.log("response at server "+res );
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}
			
				else if(message.handlerType == "sendFriendRequests"){
				
				friends.sendFriendRequest(message.senderId,message.recieverId, function(err,res){

					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					console.log("response at server "+res );
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on groups_queue");

	cnn.queue('groups_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			if(message.handlerType == "getGroups"){
			groups.getGroups(message.id, function(err,res){

				//return index sent
				//console.log(res);
				console.log("m.replyTo in login_queue "+m.replyTo);
				console.log("CorrelationID login "+ m.correlationId);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
			}
			else if(message.handlerType == "createGroup"){
				groups.createGroup(message, function(err,res){

					console.log("Response value :"+res);
					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "getGroupMemberToAdd"){
				groups.getGroupMemberToAdd(message.groupName, message.userId, function(err,res){

					console.log("Response value :"+res);
					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "getMembersByGroup"){
				groups.getMembersByGroup(message.groupName, function(err,res){

					console.log("Response value :"+res);
					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "deleteFromGroup"){
				groups.deleteFromGroup(message.groupName, message.userId, function(err,res){

					console.log("Response value :"+res);
					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "addMemberToGroup"){
				groups.addMemberToGroup(message.groupName, message.userId, function(err,res){

					console.log("Response value :"+res);
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "deleteGroup"){
				groups.deleteGroup(message.groupName, function(err,res){

					console.log("Response value :"+res);
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
		});
		
	});
});

cnn.on('ready', function(){
	console.log("listening on users_queue");

	cnn.queue('users_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			if(message.handlerType == "getContactInfo"){
			user.getContactInfo(message.userId, function(err,res){

				//return index sent
				console.log("m.replyTo in login_queue "+m.replyTo);
				console.log("CorrelationID login "+ m.correlationId);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
			}
			else if(message.handlerType == "updateContact"){
				user.updateContact(message.userId, message.contact, function(err,res){

					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "getWorkInfo"){
				user.getWorkInfo(message.userId, function(err,res){

					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "insertWorkInfo"){
				user.insertWorkInfo(message.userId, message.formData, function(err,res){

					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "getSchoolInfo"){
				user.getSchoolInfo(message.userId, function(err,res){

					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "insertSchoolInfo"){
				user.insertSchoolInfo(message.userId, message.formData, function(err,res){

					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "submitLifeEvent"){
				user.submitLifeEvent(message.name, message.lifeEvent, function(err,res){

					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "updateStatus"){
				user.updateStatus(message.name, message.status, function(err,res){

					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
			else if(message.handlerType == "getnewsFeedData"){
				user.getnewsFeedData(message.userId, message.userName, function(err,res){
					//return index sent
					console.log("m.replyTo in login_queue "+m.replyTo);
					console.log("CorrelationID login "+ m.correlationId);
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				}
		});
	});
});