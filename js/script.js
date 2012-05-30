/* Author:

*/
$(function(){

var keypresses = 0;
var timerRunning = null;
var mstext =$('#milliseconds');
var elapsed='0.000';
var targetText = 'The quick brown fox jumps over the lazy dog';
log(targetText.length);
var store = window.localStorage;

// fire on each kepress
$('#text').on('keyup',check);

function check() {
	keypresses += 1;
	$('#keypresses').text(keypresses);
	if(!timerRunning) {
		startTimer();
	} else {
		checkText();
		checkProgress();
	}
}

function checkText() {
	var text= $('#text').val();
	//check text is equal to target string and keypresses is more than minimum fior that string! No cheating!
	if( text == targetText && keypresses >= targetText.length ) { 
		stopTimer();
		alert("finished! Time was " + mstext.text() + ' Seconds');
		$('#text').attr('disabled','disabled');
		$('#message').text('')
		log(store['fastest_time']);
		if (keypresses==44) {
			alert('PERFECT! no typing mistakes innit');
		}
		
		//If no local storage var exists, create it
		if(!store['fastest_time']) {
			store['fastest_time'] = mstext.text();
			log(store['fastest_time']);
		}
		//if local var exists and the value of the localstorage is more than the time just set, it's a new record
		if(store['fastest_time'] && (parseInt(store['fastest_time'])>parseInt(mstext.text()))) {
			alert('new record!! old record = '+store['fastest_time']);
			//update local storage value
			store['fastest_time'] = mstext.text();
			//update fastest time div
			$('#fastest').text(store['fastest_time']+' seconds');
		}
	} else if (text=='the quick brown fox jumps over the lazy dog') {
		$('#message').text('Oops! You forgot the capital letter at the start!')
	
	}
	// If they've cheated by copy pasting...
	if( text == targetText && keypresses < targetText.length ) {
		$('#message').text("Ha ha no cheating you crafty ol' dog you can't just paste it in! Detelet that and try again...")
	}
}


setTimeout (function(){$('#text').focus();},1500);
$('#reset').on('click',stopTimer,reset);
$('#clear').on('click',clearRecord);
if(store['fastest_time']) {
	$('#fastest').text(store['fastest_time']+' seconds');
}
$('#targetPhrase').text(targetText);


function clearRecord(){
	store.clear();
	$('#fastest').text('not yet set');
	return false;

}

function reset() { //reset everything
	stopTimer(); 
	keypresses = 0;
	$('#keypresses').text(keypresses);
	elapsed='0.000'
	mstext.text(elapsed); 
	$('#keypresses').text('0');	
	$('#text').val('').focus().removeAttr('disabled');
	$('#progress').css('width','');
	return false;
}

function stopTimer() {
	clearInterval(timerRunning);
	timerRunning = null;
	return false;
}

function startTimer() { // timer compares current time to start time to get elapsed time every 1ms
	var start = new Date().getTime(),  
	elapsed = '0.000';  
	timerRunning = setInterval(function()  
	{  
		var time = new Date().getTime() - start;  
		elapsed =time/1000;  
		if(Math.round(elapsed) == elapsed) { elapsed += '.000'; }  
	   mstext.text(elapsed);  
	}, 1); 

}

function checkProgress() { //check how correct the typed input is and show progress bar
	var progress=0;
	var current = $('#text').val();
	var targetSplit = targetText.split('');
	var currentSplit = current.split('');
	
	//loop through target and typed array and compare each letter to check if correct
	for (var i = 0; i < currentSplit.length; i++) {
		
		if (currentSplit[i]==targetSplit[i]) {
			//increase progress value for each letter that is correct
			progress += (1/targetSplit.length)*100;
		} else {
			// if letters don't match stop looping
			break;
		}
	}
	//update progress bar
	$('#progress').css('width',Math.ceil(progress)+'%');
}


});