$(function(){
	var n = [];
	var d = []
	var socket = io();
	socket.on("response",function(data){
		$("#diagram").html(data);
	});
	$("#go").click(function(){
		let num = $("#num").val();
		let den = $("#den").val();
		n = num;
		d = den;
		if (num && den){
			let data = {
				n:JSON.parse(num),
				d:JSON.parse(den)
			};
			socket.emit("calculate",data); 
		}else{
			alert("Numerator or denominator can't be empty");
		}
	});
});
