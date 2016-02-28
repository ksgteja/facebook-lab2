var mongo = require("./mongo");
var crypto = require("./encryption");
var mongoURL = "mongodb://localhost:27017/facebook";
exports.authenticate = function(message, callback){
	

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var users= mongo.collection('users');
		users.findOne({email : message.email}, function(err, user){

			if(user){
			//password = hashCode(user.salt, message.password);
			  saltedPassword = user.salt + message.password;
			  decryptedPassword = crypto.decrypt(user.password);	
				if(saltedPassword == decryptedPassword)
					callback(null, {response : user});
				else
					callback(err, {response : "invalid"});
			}
			
			else
			callback(err, {response : "invalid"});
		});
		
	
	});
	
	
}

hashCode = function(salt,pass) {
	
	pass = salt+pass;
	  var hash = 0, i, chr, len;
	  if (pass.length == 0) return hash;
	  for (i = 0, len = pass.length; i < len; i++) {
	    chr   = pass.charCodeAt(i);
	    hash  = ((hash << 5) - hash) + chr;
	    hash |= 0;
	  }
	  return hash;
},

generateSalt = function(){
	
	return Math.floor(Math.random()*1000);
}

getNextSequence = function(name, callback) {
	
	query = {'_id' : name};
	sort = [];
	operator = { '$inc' : {seq : 1}};
	options = { 'new' : true, upsert : true};
	
	   mongo.collection("counters").findAndModify(query, sort, operator,options, function(err, docs){
	        	  
	        	  console.log("Sequencer" + docs);
	        	  console.log(docs);
	        	  callback(docs.value.seq);
	          });
	  // console.log("Sequencer " +seqid);

	   //return seqid;
}
exports.signup = function(signUpData,callback){
	
	console.log(signUpData);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var users= mongo.collection('users');
		users.findOne({email : signUpData.email}, function(err, user){
			
			console.log("User is "+ user);
			if(!user){
				salt = generateSalt();
				password = salt + signUpData.password;
				encryptedPassword = crypto.encrypt(password);
	            //pass = hashCode(salt, signUpData.password);
	            //console.log(pass);
				//password = signupData.password.toString();
	            getNextSequence("userid",function(seqID){
				var userData = {
						
						_id : seqID,
						
						first_name : signUpData.firstName,
						
						last_name : signUpData.lastName,
						
       				 	email : signUpData.email,
       				 	
       				 	password: encryptedPassword,
       				 	
						salt : salt,
							
						dob : signUpData.dob,
						
						gender : signUpData.gender,
						friends : [],
						groups : [],
						requests : []};
				
				users.insert(userData, function(err, docs){
					
					console.log("data after insert "+ docs);
					if(err)
						throw err;
					
				      if(docs)
				    	  callback(null,{response: "success"});
				      else
				    	  callback(err,{response : "failed"});
				});
				});
	            
				
			}
			else
				{
				
				callback(null, {response : "failed"});
				
				}
			
		});
		
		
	});
	
}
	

	
