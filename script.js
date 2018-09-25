// establish vars
var canvas, ctx, source, context, analyser, fbc_array, rads,
	center_x, center_y, radius, radius_old, deltarad, shockwave,
	bars, bar_x, bar_y, bar_x_term, bar_y_term, bar_width,
	bar_height, react_x, react_y, intensity, rot, inputURL,
	JSONPThing, JSONResponse, soundCloudTrackName, audio, pause,
	artist, title, img_url, isSeeking;

var client_id = "8df0d68fcc1920c92fc389b89e7ce20f";
var songList = ["https://soundcloud.com/lostyears/lost-years-nuclear-short", "https://soundcloud.com/alexomfg/omfg-meant-for-you", "https://soundcloud.com/joshua-dando/hyper-potions-littleroot-town", "https://soundcloud.com/alexomfg/omfg-peanut-butter", "https://soundcloud.com/djvanic/west-coast-vanic-remix", "https://soundcloud.com/djvanic/kflay-fml-vanic-remix", "https://soundcloud.com/frantixofficial/the-m80s", "https://soundcloud.com/drunkgirlmusic/dont-stop-the-party-feat-deanna"];
var songLoop = 0;
var stuck = false;

// give vars an initial real value to validate
bars = 200;
react_x = 0;
react_y = 0;
radius = 0;
deltarad = 0;
shockwave = 0;
rot = 0;
intensity = 0;
pause = 1;
isSeeking = 0;

function initPage() {
	canvas = document.getElementById("visualizer_render");
	ctx = canvas.getContext("2d");

	//resize_canvas();
	
	document.getElementById("artwork").style.opacity = 0;
	
	audio = new Audio();
	audio.crossOrigin = "anonymous";
	audio.controls = true;
	audio.loop = false;
	audio.autoplay = true;
	
	context = new AudioContext();
	analyser = context.createAnalyser();
	// route audio playback
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);
	
	fbc_array = new Uint8Array(analyser.frequencyBinCount);
	
	frameLooper();
}

function resize_canvas() {
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
}

(function() {
    var mouseTimer = null, cursorVisible = true;

    function disappearCursor() {
        mouseTimer = null;
        document.body.style.cursor = "none";
		document.getElementById("hideHead").style.opacity = 0;
		document.getElementById("hideBody").style.opacity = 0;
        cursorVisible = false;
    }

    document.onmousemove = function() {
        if (mouseTimer) {
            window.clearTimeout(mouseTimer);
        }
        if (!cursorVisible) {
            document.body.style.cursor = "default";
			document.getElementById("hideHead").style.opacity = 100;
			document.getElementById("hideBody").style.opacity = 100;
            cursorVisible = true;
        }
        mouseTimer = window.setTimeout(disappearCursor, 3000);
    };
})();

function getJSON(url, callback) {
	JSONPThing = document.createElement("script");
	JSONPThing.type = "text/javascript";
	JSONPThing.src = url + "&callback=" + callback.name;
	document.body.appendChild(JSONPThing);
}

function userJSONCallback(data) {
	document.body.removeChild(JSONPThing); // required
	JSONPThing = null;
	
	var user_id = data.id;
	artist = data.username;
	
	var tracks = "https://api.soundcloud.com/users/" + user_id + "/tracks.json?client_id=" + client_id + "&limit=200";

	getJSON(tracks, tracksJSONCallback); // continues in tracksJSONCallback
}

function tracksJSONCallback(data) {
	document.body.removeChild(JSONPThing); // required
	JSONPThing = null;
	
	// go through each object (track) in array (data)
	for(var i = 0; i < data.length; i++) {
		var track = data[i];
		// check each track with the name (input URL)
		if(track.permalink == soundCloudTrackName) {
			inputURL = track.stream_url + "?client_id=" + client_id;
			title = track.title;
			img_url = track.artwork_url;
			
			initMp3Player();
			break;
		}
	}
}

function handleButton()
{
	var inputURL = document.getElementById("input_URL").value;
	try{
		if(inputURL.search("soundcloud.com") != -1 && inputURL.search("api.soundcloud.com") == -1) { // is it a regular old soundcloud link
			var splitBySlash = inputURL.replace(/http:\/\/|https:\/\//gi, "").split("/"); // get rid of "http://" / "https://" in front of url and then split by slashes
			if(splitBySlash.length == 3) { // make sure there's an actual song included at the end
				var soundCloudUserURL = "http://" + splitBySlash[0] + "/" + splitBySlash[1];
				soundCloudTrackName = splitBySlash[2];
				var apiResovleURL = "https://api.soundcloud.com/resolve.json?url=" + soundCloudUserURL + "&client_id=" + client_id;
				getJSON(apiResovleURL, userJSONCallback); // continues in userJSONCallback
			}
			else if (splitBySlash.legnth == 2) { // there's a user but no song
				// do whatever here
			}
			else {
				// do whatever here
			}
		}
	}
	catch(err){
		audio.currentTime = 0;
		audio.duration = 0;
	}
}

function togglepause() {
	if(pause) {
			pause = 0;
			audio.play();
		} else {
			pause = 1;
			audio.pause();
		}
}

function autoSelect() {
	document.getElementById("input_URL").select();
	
}
			
function initMp3Player() {
	// for(var i =  0; i < songList.length; i++){
		// inputURL = songList[i];
		// audio.src = inputURL;
		// pause = 0;
		// audio.play();
	
		// document.getElementById("artistname").innerHTML = artist;
		// document.getElementById("songname").innerHTML = title;
		// document.getElementById("pagetitle").innerHTML = title;
		// document.getElementById("artwork").src = img_url;
	
		// document.getElementById("artwork").style.opacity = 100;
		// document.getElementById("artwork").style.border = "5px solid #f174eb";
		// document.getElementById("artwork").style.padding= "1px";
		// while(false){
			// document.querySelector("#music").addEventListener("ended", initMp3Player, false);
			// return true;
		// }
	// }

	// for (var i = 0; i < 6; i++){
		// var temp = false;
		// audio.src = songList[i];
	
		// pause = 0;
		// audio.play();
	
		// document.getElementById("artistname").innerHTML = artist;
		// document.getElementById("songname").innerHTML = title;
		// document.getElementById("pagetitle").innerHTML = title;
		// document.getElementById("artwork").src = img_url;
	
		// document.getElementById("artwork").style.opacity = 100;
		// document.getElementById("artwork").style.border = "5px solid #f174eb";
		// document.getElementById("artwork").style.padding= "1px";
		
		// while(temp == false){
			// if (audio.ended == false){
				
			// }
			// if (audio.ended == true){
				// temp = true;
			// }
		// }
	// }
	if (audio.currentTime == audio.duration){
		audio.src = inputURL;
		pause = 0;
		audio.play();
	
		document.getElementById("artistname").innerHTML = artist;
		document.getElementById("songname").innerHTML = title;
		document.getElementById("pagetitle").innerHTML = title;
		document.getElementById("artwork").src = img_url;
		
		document.getElementById("artwork").style.opacity = 100;
		document.getElementById("artwork").style.border = "5px solid #9afb3b";
		document.getElementById("artwork").style.padding= "1px";
		stuck = true;
	}
	else{
		audio.src = inputURL;
	
		pause = 0;
		audio.play();
	
		document.getElementById("artistname").innerHTML = artist;
		document.getElementById("songname").innerHTML = title;
		document.getElementById("pagetitle").innerHTML = title;
		document.getElementById("artwork").src = img_url;
		
		document.getElementById("artwork").style.opacity = 100;
		document.getElementById("artwork").style.border = "5px solid #9afb3b";
		document.getElementById("artwork").style.padding= "1px";
		stuck = true;
	}
	

}
			
function frameLooper() {
	resize_canvas(); // for some reason i have to resize the canvas every update or else the framerate decreases over time
				
	//Below is the background color: top/bottom
	var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
	grd.addColorStop(0, "rgba(47, 48, 48, 1)");
	grd.addColorStop(1, "rgba(0, 0, 0, 1)");

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//background flashing
	ctx.fillStyle = "rgba(255, 255, 255, " + (intensity * 0.0000125 - 0.4) + ")";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
		
	rot = rot + intensity * 0.0000001;
		
	react_x = 0;
	react_y = 0;
				
	intensity = 0;
				
	analyser.getByteFrequencyData(fbc_array);
	
	for (var i = 0; i < bars; i++) {
		rads = Math.PI * 2 / bars;
						
		bar_x = center_x;
		bar_y = center_y;
				
		bar_height = Math.min(99999, Math.max((fbc_array[i] * 2.5 - 200), 0));
		bar_width = bar_height * 0.02;
						
		//bar colors
		bar_x_term = center_x + Math.cos(rads * i + rot) * (radius + bar_height);
		bar_y_term = center_y + Math.sin(rads * i + rot) * (radius + bar_height);
						
		ctx.save();
					
		var lineColor = "rgb(" + (fbc_array[i]).toString() + ", " + 255 + ", " + 59 + ")";
		//below is line color same as stream color with no variation
		// var lineColor = "rgb(" + 30 + ", " + 163 + ", " + 6 + ")";
						
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = bar_width;
		ctx.beginPath();
		ctx.moveTo(bar_x, bar_y);
		ctx.lineTo(bar_x_term, bar_y_term);
		ctx.stroke();
					
		react_x += Math.cos(rads * i + rot) * (radius + bar_height);
		react_y += Math.sin(rads * i + rot) * (radius + bar_height);
					
		intensity += bar_height;
	}
				
	center_x = canvas.width / 2 - (react_x * 0.007);
	center_y = canvas.height / 2 - (react_y * 0.007);
				
	radius_old = radius;
	radius =  25 + (intensity * 0.002);
	deltarad = radius - radius_old;
				
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.beginPath();
	ctx.arc(center_x, center_y, radius + 2, 0, Math.PI * 2, false);
	ctx.fill();
	
	// shockwave effect			
	shockwave += 60;
				
	ctx.lineWidth = 15;
	ctx.strokeStyle = "rgb(0, 255, 0)";
	ctx.beginPath();
	ctx.arc(center_x, center_y, shockwave + radius, 0, Math.PI * 2, false);
	ctx.stroke();
				
				
	if (deltarad > 15) {
		shockwave = 0;
		
		ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		rot = rot + 0.4;
	}
	
	if (!isSeeking) {
		document.getElementById("audioTime").value = (100 / audio.duration) * audio.currentTime;
	}
	
	document.getElementById("time").innerHTML = Math.floor(audio.currentTime / 60) + ":" + (Math.floor(audio.currentTime % 60) < 10 ? "0" : "") + Math.floor(audio.currentTime % 60);

	if (audio.currentTime == audio.duration && stuck != false){
		stuck = false;
		songLoop++;
		document.getElementById("input_URL").value = songList[songLoop];
		handleButton();
	}
	
	
	
	window.requestAnimationFrame(frameLooper);
}