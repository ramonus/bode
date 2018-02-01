var socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};
var {spawn} = require("child_process");
var rimraf = require("rimraf");

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
		let py = spawn("python3",['generate_bode.py']);
		data.id = socket.id;
		let dataString = '';
		py.stdout.on("data",function(data){
			dataString += data.toString();
		});
		py.stdout.on("end",function(){
			if (dataString.endsWith(".png")){
				let result = '<img id="plot"src="'+socket.id+'/'+dataString+'"/>';
				console.log("Sending result:",result);
				socket.emit("response",result);
			}else{
				console.log("Data: ::"+dataString+"::");
			}
		});
		console.log("Sending:",JSON.stringify(data));
		py.stdin.write(JSON.stringify(data));
		py.stdin.end();
	});
});

module.exports = socketApi;
