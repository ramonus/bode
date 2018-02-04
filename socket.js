var socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};
var {spawn} = require("child_process");
var rimraf = require("rimraf");
var async = require("async");

socketApi.io = io;

io.on("connect",function(socket){
	console.log("New client connected "+socket.id);
	socket.on("disconnect",function(){
		console.log("User",socket.id,"disconnected.");
		rimraf("plots/"+socket.id,function(){
			console.log("Plots deleted");
		});
	});
	socket.on("calculate",function(data){
		console.log("Recived:",data);
		console.log("Starting calculation...")
		data.id = socket.id;
		async.parallel({
			bode: function(callback){
			let py = spawn("python3",['generate_bode.py']);
			let dataString = '';
			py.stdout.on("data",function(data){
				dataString += data.toString();
			});
			py.stdout.on("end",function(){
				if (dataString.endsWith(".png")){
					callback(null,dataString);
				}else{
					callback(dataString);
				}
			});
			py.stdin.write(JSON.stringify(data));
			py.stdin.end();
		},
			nyquist: function(callback){
			let py2 = spawn("python3",['generate_nyquist.py']);
			let dataString = '';
			py2.stdout.on("data",function(data){
				dataString += data.toString();
			});
			py2.stdout.on("end",function(){
				if(dataString.endsWith(".png")){
					callback(null,dataString);
				}else{
					callback("Some error ocurred creating the nyquist plot");
				}
			});
			py2.stdin.write(JSON.stringify(data));
			py2.stdin.end();
		}},function(err,res){
			console.log("Results recived");
			console.log("Err:",err,"\nRes:",res);
			if(err){
				socket.emit("Error");
			}else{
				let result = '<img id="plot"src="'+socket.id+'/'+res.bode+'"/><br><img id="plot"src="'+socket.id+'/'+res.nyquist+'"/>';
				socket.emit("response",result);
			}
		});
	});
});
module.exports = socketApi;
