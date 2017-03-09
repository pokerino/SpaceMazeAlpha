$(document).ready(function(){
	$('#start').click(function(){
		$('#ship').addClass('movingShip');
		window.setTimeout(function() { 
			window.location.href='play.html?name=Test+spelare&diff=3';
		},2000)
	})
})