//Hämtad från http://www.sitepoint.com/url-parameters-jquery/
$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

var $alert = $('#player');
var $player = $('#playerShip');
var $goal = $('#goal');
var $core = $('#playerCore');
var $wall = $('.wall');
var diff = $.urlParam('diff');
var name = $.urlParam('name');
var sec = 0;
var ship = 1;
var nmrOfShips = 2;
var record = 9999;
var health = (600-(100*diff));
var levels = 7;
var dmgMltp = 0;
var shipLost = 0;
var lvlCmpl = 0;
var moveX = 0;
var moveY = 0;
var tmp = 1;
var sound = false;
var lvlNmr = Math.floor((Math.random()*levels)+1);

//Funktionen krånglar i Safari, fungerar något bättre med AIF-filer.
var warning = document.createElement('audio');
warning.setAttribute('src', 'alarm.mp3');
$.get();
warning.addEventListener('load', function() {
	warning.play();
}, true);
var beep = document.createElement('audio');
beep.setAttribute('src', 'beep.mp3');
$.get();
beep.addEventListener('load', function() {
	beep.play();
}, true);
$('head').append('<link rel="stylesheet" type="text/css" href="Maze00'+lvlNmr+'.css"  />');
$('#avatar').attr('src',ship+'/right.png');
$('body').css('background-image','url('+ship+'/bkgr.png)');
function gettime ( val ) { return val > 9 ? val : "0" + val; }
var tid=setInterval( function(){
	$("#playerName").html(name);
    $("#time").html('TIME: '+gettime(parseInt(sec/60,10))+' min '+gettime(++sec%60)+' sec');
}, 1000);
var rollingThunder=setInterval( function(){

	//Effektiviserar koden något, går snabbare att köra.
	if(sound==false)
	{
    	warning.pause();
		beep.pause();
	}
	sound=false;
	$("#health").html('SHIELDS: '+health);
	$("#shipLost").html('SHIPS LOST: '+shipLost);
	$("#lvlCmpl").html('LEVELS COMPLETED: '+lvlCmpl);
	$("#speed").html('SPEED: '+dmgMltp+' au/h');
	$('#shield').css('opacity',0)
	if(record<9000){
		$("#record").html('RECORD TIME: '+Math.floor(record/60)+' min ' + (record%60)+' sec');		
	}
	$('#avatar').css('transform','rotate(0deg)');
	if(moveX*moveX>moveY*moveY)
	{
		dmgMltp = Math.sqrt(moveX*moveX);
	}
	else
	{
		dmgMltp = Math.sqrt(moveY*moveY);
	}
	if(health < 1)
	{
		alert('SHIP DESTROYED!! PLEASE TRY AGAIN');
		shipLost++;
		$('#avatar').attr('src',ship+'/right.png');
		health = (600-(100*diff));
		moveX = 0;
		moveY = 0;
		$alert.css({left: '-20px'});
		$alert.css({top: '-20px'});	
	}
	if((collision($goal, $core))==true)
	{
		if(sec<record)
		{
			record=sec;			
		}
		alert('VICTORY! NEXT LEVEL!');
		moveX = 0;
		moveY = 0;
		$alert.css({left: '-20px'});
		$alert.css({top: '-20px'});
		lvlCmpl++;
		lvlNmr++;
		if(lvlNmr>levels){lvlNmr=1;}
		$('head').append('<link rel="stylesheet" type="text/css" href="Maze00'+lvlNmr+'.css"  />');
		sec=0;
	}
	$wall.each(function()
	{	if((collision($(this), $core))==true)
		{
			warning.play();
			sound=true;
			$('#shield').css('opacity',health/(650-(diff*90)))
			beep.pause();
			health = health -10*dmgMltp;
			return false;
		}
		if((collision($(this), $player))==true)
		{
			warning.play();
			sound=true;
			$('#shield').css('opacity',health/(650-(diff*90)))
			beep.pause();
			health = health -1*dmgMltp;
			//Kraftigt effektivisering av koden.
			return false;
		}
		if((collision($(this), $alert))==true)
		{
			beep.play();
			sound=true;
			return false;
		}
	});
	$alert.css({left: '+='+moveX});
	$alert.css({top: '+='+moveY});
	if(moveY<0)
	{
		if(moveY<-4){moveY=-4};
		$('#avatar').attr('src',ship+'/top.png');
		if($alert.offset().top < -10)
		{
			$alert.css('top', -20);
		}			
	}
	if(moveY>0)
	{
		if(moveY>4){moveY=4};
		$('#avatar').attr('src',ship+'/down.png');
		if($alert.offset().top > 540)
		{
			$alert.css('top', 530);
		}			
	}
	if(moveX <0)
	{
		if(moveX<-4){moveX=-4};
		$('#avatar').attr('src',ship+'/left.png');
		if(moveY<0)
		{
			tmp=(+1-0.25*(moveY-moveX));
			$('#avatar').css('transform','rotate('+(45*tmp)+'deg)');
		}
		if(moveY>0)
		{
			tmp=(-1-0.25*(moveX+moveY));
			$('#avatar').css('transform','rotate('+(45*tmp)+'deg)');			
		}
		if($alert.offset().left > 740)
		{
			$alert.css('left', 730);
		}	
		if($alert.offset().left < -10)
		{
			$alert.css('left', -20);
		}
	}
	if(moveX>0)
	{
		if(moveX>4){moveX=4};
		$('#avatar').attr('src',ship+'/right.png');
		if(moveY<0)
		{
			tmp=(-1+0.25*(moveX+moveY));
			$('#avatar').css('transform','rotate('+(45*tmp)+'deg)');
		}
		if(moveY>0)
		{
			tmp=(+1-0.25*(moveX-moveY));
			$('#avatar').css('transform','rotate('+(45*tmp)+'deg)');			
		}
		if($alert.offset().left > 740)
		{
			$alert.css('left', 730);
		}			
	}
}, (70-(diff*10)));

$(document).keyup,$(document).keydown(function(e) {
    switch (e.which) {
		case 33:
			ship++;
			if(ship>nmrOfShips){ship=1};
			$('#avatar').attr('src',ship+'/right.png');
			$('body').css('background-image','url('+ship+'/bkgr.png)');
			if(ship==1)
			{
				$('#status').css('color','lawngreen');
			}
			if(ship==2)
			{
				$('#status').css('color','red');
			}
			break;
		case 34:
			ship--;
			if(ship<1){ship=nmrOfShips};
			$('#avatar').attr('src',ship+'/right.png');
			$('body').css('background-image','url('+ship+'/bkgr.png)');
			if(ship==1)
			{
				$('#status').css('color','lawngreen');
			}
			if(ship==2)
			{
				$('#status').css('color','red');
			}
			break;
		case 37:
			moveX--;
			break;
		case 38:
			moveY--;
			break;
		case 39:
			moveX++;
			break;
		case 40:
			moveY++;
			break;
    }
})

function collision($div1, $div2) {
	var x1 = $div1.offset().left;
	var y1 = $div1.offset().top;
	var b1 = y1 + ($div1.outerHeight(true));
	var r1 = x1 + ($div1.outerWidth(true));
	var x2 = $div2.offset().left;
	var y2 = $div2.offset().top;
	var b2 = y2 + ($div2.outerHeight(true));
	var r2 = x2 + ($div2.outerWidth(true));

	if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
	return true;
};
	