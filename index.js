var express = require('express');
var app = express();
var spawn = require('child_process').spawn;

//to download image
var url = require('url');
var download = require('image-downloader');

//to delete image
var fs = require('fs');

app.get('/', function(req, res){
   res.send("Server is running");
});
 

app.get('/getVehicleNumber',function(req,response){

	//download image from url
	var route = url.parse(req.url, true);
	var routeData = route.query;

	const options = {
		url: routeData.url,
		dest: './storage/'  // Save with original name
	}

	//final result
	var final_result;

	download.image(options).then(({ filename, image }) => {

	  	py = spawn('python', ['./getNumber.py']),

	  	//sending image path to python script
	  	py.stdin.write(filename);
		py.stdin.end();

		py.stdout.on('data', function(data){
			console.log(data.toString());
			final_result = JSON.parse(data.toString());
			fs.unlink(filename,(err)=>{
		    	if(err){
		    		console.log(err)
		    	}
		    	
		    })
		});
		
		py.stdout.on('end', function(data){
		  console.log('Process end');
		});
		
		py.on('exit', function (code, signal) {
			if(code !=0){
			  	response.status(200).json({status:false,message:"Failed to get image"});
			  	fs.unlink(filename,(err)=>{
			    	if(err){
			    		console.log(err)
			    	}
			    	
			    })
			  	console.log('child process exited with ' + `code ${code} and signal ${signal}`);
			}
			else if(final_result){
				response.status(200).json({status:true,data:final_result});
			}
		});


	  	
	}).catch((err) => {
	    	console.log(err);
  		})

	
})

app.listen(3000,()=>{
	console.log("Server is running at 3000");
});