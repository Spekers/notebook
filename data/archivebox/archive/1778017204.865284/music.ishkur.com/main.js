var map;

function mixclouds() {
								
	$('.mixcloud').on('click',function(){
		$('#music').each(function() { this.player.pause(); })
		$('.mixcloud').css({ "z-index":"-1" });
		$('.mixcloud2').css({ "z-index":"9999" });
		$('.mixcloud3').css({ "z-index":"9999" });
		$('.mixcloud4').css({ "z-index":"9999" });
		
		var widget = Mixcloud.PlayerWidget(document.getElementById('iframe'));
		widget.ready.then(function() {
			widget.play();
		});
		
		var vid2check = document.getElementById('video2');
		if (vid2check) { document.getElementById('video2').pause(); }
		var vid3check = document.getElementById('video3');
		if (vid3check) { document.getElementById('video3').pause(); }
		var vid4check = document.getElementById('video4');
		if (vid4check) { document.getElementById('video4').pause(); }
	});
	
	$('.mixcloud2').on('click',function(){
		$('#music').each(function() { this.player.pause(); })
		$('.mixcloud2').css({ "z-index":"-1" });
		$('.mixcloud').css({ "z-index":"9999" });
		$('.mixcloud3').css({ "z-index":"9999" });
		$('.mixcloud4').css({ "z-index":"9999" });
		
		var mixcloudcheck = $('.mixcloud').html();									
		if (mixcloudcheck) {
			var widget = Mixcloud.PlayerWidget(document.getElementById('iframe'));
			widget.ready.then(function() { widget.pause(); });
		}
		
		document.getElementById('video2').play();
		var vid3check = document.getElementById('video3');
		if (vid3check) { document.getElementById('video3').pause(); }
		var vid4check = document.getElementById('video4');
		if (vid4check) { document.getElementById('video4').pause(); }
		
	});
	
	$('.mixcloud3').on('click',function(){
		$('#music').each(function() { this.player.pause(); })
		$('.mixcloud3').css({ "z-index":"-1" });
		$('.mixcloud4').css({ "z-index":"9999" });
		$('.mixcloud2').css({ "z-index":"9999" });
		$('.mixcloud').css({ "z-index":"9999" });
		
		var mixcloudcheck = $('.mixcloud').html();									
		if (mixcloudcheck) {
			var widget = Mixcloud.PlayerWidget(document.getElementById('iframe'));
			widget.ready.then(function() { widget.pause(); });
		}
		
		document.getElementById('video2').pause();
		document.getElementById('video3').play();
		var vid4check = document.getElementById('video4');
		if (vid4check) { document.getElementById('video4').pause(); }
	});
	
	$('.mixcloud4').on('click',function(){
		$('#music').each(function() { this.player.pause(); })
		$('.mixcloud4').css({ "z-index":"-1" });
		$('.mixcloud3').css({ "z-index":"9999" });
		$('.mixcloud2').css({ "z-index":"9999" });
		$('.mixcloud').css({ "z-index":"9999" });
		
		var mixcloudcheck = $('.mixcloud').html();									
		if (mixcloudcheck) {
			var widget = Mixcloud.PlayerWidget(document.getElementById('iframe'));
			widget.ready.then(function() { widget.pause(); });
		}
		
		document.getElementById('video2').pause();
		document.getElementById('video3').pause();
		document.getElementById('video4').play();
	});

	$('#nuskoolplay').on('click',function(){	
		$('#music').each(function() { this.player.pause(); })
		var nuskool = $('#nuskool')[0];
		nuskool.currentTime = 0;
		nuskool.play();
	});
	
}



sPageURL = window.location.search.substring(1);
sURLVariables = sPageURL.split('&');

if (sURLVariables[0]) { fullquery = sURLVariables[0]; arrquery = fullquery.split('='); query = arrquery[1]; };
if (sURLVariables[1]) { fullyear = sURLVariables[1]; arryear = fullyear.split('='); year = arryear[1]; };
if (sURLVariables[2]) { fullartist = sURLVariables[2]; arrartist = fullartist.split('='); artist = arrartist[1]; };
if (sURLVariables[3]) { fulltrack = sURLVariables[3]; arrtrack = fulltrack.split('='); track = arrtrack[1]; };

var querycheck = 'query';
var url = window.location.href;
if (url.indexOf('?'+querycheck+'=') != -1) {
	if (typeof year !== 'undefined') {
		yearcoord = year - 1950;
		yearcoord = 300 * yearcoord;
		yearcoord = yearcoord + 1650;
	};
	
	switch (query) {
		case "Rap": if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 8330;}; lat = 18105; autopop(query); customzoom = 6; break;
		case "GhettoTech" : if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 19205; autopop(query); customzoom = 6; break;
		case "Technobass" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12230;}; lat = 19105; autopop(query); customzoom = 6; break;
		case "MiamiBass" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11930;}; lat = 18905; autopop(query); customzoom = 6; break;
		case "DirtySouthRap" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12230;}; lat = 18805; autopop(query); customzoom = 6; break;
		case "Crunk" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15230;}; lat = 18705; autopop(query); customzoom = 6; break;
		case "Moombahton" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 19130;}; lat = 19005; autopop(query); customzoom = 6; break;
		case "Trap" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 19430;}; lat = 18605; autopop(query); customzoom = 6; break;
		case "SouthernRap" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12530;}; lat = 18505; autopop(query); customzoom = 6; break;
		case "WestcoastRap" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12830;}; lat = 18405; autopop(query); customzoom = 6; break;
		case "EastcoastRap" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12530;}; lat = 18205; autopop(query); customzoom = 6; break;
		case "Bling" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16430;}; lat = 18305; autopop(query); customzoom = 6; break;
		case "Dancehall" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11930;}; lat = 18005; autopop(query); customzoom = 6; break;
		case "ConsciousRap" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13130;}; lat = 17905; autopop(query); customzoom = 6; break;
		case "ThemedRap" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14030;}; lat = 17805; autopop(query); customzoom = 6; break;
		case "Turntablism" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11030;}; lat = 17705; autopop(query); customzoom = 6; break;
		case "Freestyle" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11330;}; lat = 17505; autopop(query); customzoom = 6; break;
		case "FloridaBreaks" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 17405; autopop(query); customzoom = 6; break;
		case "Electro" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 10730;}; lat = 17305; autopop(query); customzoom = 6; break;
		case "MinimalTechno" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14030;}; lat = 17005; autopop(query); customzoom = 6; break;
		case "DubTechno" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 16905; autopop(query); customzoom = 6; break;
		case "BanginTechno" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 16805; autopop(query); customzoom = 6; break;
		case "DetroitTechno" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 10730;}; lat = 16705; autopop(query); customzoom = 6; break;
		case "BleepTechno" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13130;}; lat = 16605; autopop(query); customzoom = 6; break;
		case "HardTechno" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 16505; autopop(query); customzoom = 6; break;
		case "Schranz" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16430;}; lat = 16405; autopop(query); customzoom = 6; break;
		case "ExperimentalTechno" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16130;}; lat = 16305; autopop(query); customzoom = 6; break;
		case "EuroTechno" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13130;}; lat = 16205; autopop(query); customzoom = 6; break;
		case "Speedcore" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16430;}; lat = 15905; autopop(query); customzoom = 6; break;
		case "Rave" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13430;}; lat = 16005; autopop(query); customzoom = 6; break;
		case "Hardcore" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13430;}; lat = 15805; autopop(query); customzoom = 6; break;
		case "UKHardcore" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17330;}; lat = 15705; autopop(query); customzoom = 6; break;
		case "Freeform" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16430;}; lat = 15605; autopop(query); customzoom = 6; break;
		case "HappyHardcore" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 15505; autopop(query); customzoom = 6; break;
		case "OldskoolRaveHardcore" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13430;}; lat = 15405; autopop(query); customzoom = 6; break;
		case "AtmosphericJungle" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 15205; autopop(query); customzoom = 6; break;
		case "Jazzstep" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14630;}; lat = 15105; autopop(query); customzoom = 6; break;
		case "LiquidFunk" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16430;}; lat = 15005; autopop(query); customzoom = 6; break;
		case "Darkside" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14030;}; lat = 14905; autopop(query); customzoom = 6; break;
		case "Microfunk" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17930;}; lat = 14805; autopop(query); customzoom = 6; break;
		case "Techstep" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 14705; autopop(query); customzoom = 6; break;
		case "Neurofunk" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15830;}; lat = 14605; autopop(query); customzoom = 6; break;
		case "Darkstep" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15530;}; lat = 14505; autopop(query); customzoom = 6; break;
		case "Drumstep" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 18830;}; lat = 14405; autopop(query); customzoom = 6; break;
		case "Pendulum" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17630;}; lat = 14305; autopop(query); customzoom = 6; break;
		case "Jumpup" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14630;}; lat = 14205; autopop(query); customzoom = 6; break;
		case "RaggaJungle" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14030;}; lat = 14105; autopop(query); customzoom = 6; break;
		case "ProgressiveBreaks" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15530;}; lat = 13905; autopop(query); customzoom = 6; break;
		case "Breaks" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12530;}; lat = 13805; autopop(query); customzoom = 6; break;
		case "ChemicalBreaks" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 13705; autopop(query); customzoom = 6; break;
		case "BigBeat" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 13605; autopop(query); customzoom = 6; break;
		case "NuSkoolBreaks" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16130;}; lat = 13505; autopop(query); customzoom = 6; break;
		case "FreelandBreaks" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16730;}; lat = 13405; autopop(query); customzoom = 6; break;
		case "HardAcid" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13730;}; lat = 13205; autopop(query); customzoom = 6; break;
		case "Acid" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12830;}; lat = 13105; autopop(query); customzoom = 6; break;
		case "AcidHouse" : if (typeof year !== 'undefined'){lon=yearcoord;}else{lon= 12230;}; lat = 13005; autopop(query); customzoom = 6; break;
		case "ChicagoHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11630;}; lat = 12805; autopop(query); customzoom = 6; break;
		case "HardHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14630;}; lat = 12705; autopop(query); customzoom = 6; break;
		case "HipHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12530;}; lat = 12605; autopop(query); customzoom = 6; break;
		case "ItaloHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12830;}; lat = 12505; autopop(query); customzoom = 6; break;
		case "DiscoHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13430;}; lat = 12405; autopop(query); customzoom = 6; break;
		case "FrenchHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 12305; autopop(query); customzoom = 6; break;
		case "Electrohouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17030;}; lat = 12205; autopop(query); customzoom = 6; break;
		case "WorldHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13430;}; lat = 12105; autopop(query); customzoom = 6; break;
		case "Eurohouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13130;}; lat = 12005; autopop(query); customzoom = 6; break;
		case "UKHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12230;}; lat = 11905; autopop(query); customzoom = 6; break;
		case "MinimalTech" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17030;}; lat = 11705; autopop(query); customzoom = 6; break;
		case "Microhouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15530;}; lat = 11605; autopop(query); customzoom = 6; break;
		case "TechHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14630;}; lat = 11505; autopop(query); customzoom = 6; break;
		case "FidgetHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16130;}; lat = 11405; autopop(query); customzoom = 6; break;
		case "Deeptech" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16130;}; lat = 11305; autopop(query); customzoom = 6; break;
		case "MinimalProg" : if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17630;}; lat = 11105; autopop(query); customzoom = 6; break;
		case "Progressive" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 11005; autopop(query); customzoom = 6; break;
		case "8thNoteProg" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 18530;}; lat = 10905; autopop(query); customzoom = 6; break;
		case "McProg" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16430;}; lat = 10805; autopop(query); customzoom = 6; break;
		case "TwinkleProg" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16130;}; lat = 10705; autopop(query); customzoom = 6; break;
		case "ProgressiveHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13430;}; lat = 10605; autopop(query); customzoom = 6; break;
		case "EuroDeepHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13130;}; lat = 10405; autopop(query); customzoom = 6; break;
		case "USDeepHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12230;}; lat = 10305; autopop(query); customzoom = 6; break;
		case "Garage" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 10130;}; lat = 10205; autopop(query); customzoom = 6; break;
		case "SpeedGarage" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14630;}; lat = 10005; autopop(query); customzoom = 6; break;
		case "Brostep" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 18830;}; lat = 9905; autopop(query); customzoom = 6; break;
		case "Dubstep" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17030;}; lat = 9805; autopop(query); customzoom = 6; break;
		case "FutureGarage" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 18230;}; lat = 9705; autopop(query); customzoom = 6; break;
		case "Grime" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16430;}; lat = 9605; autopop(query); customzoom = 6; break;
		case "2-StepGarage" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15530;}; lat = 9505; autopop(query); customzoom = 6; break;
		case "R+B" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 10130;}; lat = 9305; autopop(query); customzoom = 6; break;
		case "Reggaeton" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17030;}; lat = 9205; autopop(query); customzoom = 6; break;
		case "Soul" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12530;}; lat = 9105; autopop(query); customzoom = 6; break;
		case "NewJackSwing" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12230;}; lat = 9005; autopop(query); customzoom = 6; break;
		case "Funk" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 8030;}; lat = 8905; autopop(query); customzoom = 6; break;
		case "NuJazz" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 8705; autopop(query); customzoom = 6; break;
		case "AcidJazz" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12230;}; lat = 8605; autopop(query); customzoom = 6; break;
		case "Downtempo" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13430;}; lat = 8505; autopop(query); customzoom = 6; break;
		case "TripHop" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14630;}; lat = 8405; autopop(query); customzoom = 6; break;
		case "Dub" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 8030;}; lat = 8305; autopop(query); customzoom = 6; break;
		case "Indie" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13730;}; lat = 7805; autopop(query); customzoom = 6; break;
		case "ChillOut" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 9530;}; lat = 7705; autopop(query); customzoom = 6; break;
		case "Worldbeat" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11030;}; lat = 7605; autopop(query); customzoom = 6; break;
		case "Moog" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 6530;}; lat = 8105; autopop(query); customzoom = 6; break;
		case "Soundtrack" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 3230;}; lat = 8005; autopop(query); customzoom = 6; break;
		case "ModernClassical" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 5930;}; lat = 7905; autopop(query); customzoom = 6; break;
		case "Krautrock" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 7130;}; lat = 7005; autopop(query); customzoom = 6; break;
		case "Minimalism" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 6830;}; lat = 6905; autopop(query); customzoom = 6; break;
		case "MusiqueConcrete" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 1130;}; lat = 6805; autopop(query); customzoom = 6; break;
		case "Experimental" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 230;}; lat = 6005; autopop(query); customzoom = 6; break;
		case "NewAge" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 9230;}; lat = 7505; autopop(query); customzoom = 6; break;
		case "Ambient" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 9530;}; lat = 7305; autopop(query); customzoom = 6; break;
		case "DarkAmbient" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11030;}; lat = 7205; autopop(query); customzoom = 6; break;
		case "Drone" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11330;}; lat = 7105; autopop(query); customzoom = 6; break;
		case "AmigaTracker" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11930;}; lat = 6505; autopop(query); customzoom = 6; break;
		case "FM" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11630;}; lat = 6705; autopop(query); customzoom = 6; break;
		case "Chiptune" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 9830;}; lat = 6605; autopop(query); customzoom = 6; break;
		case "Fakebit" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12830;}; lat = 6405; autopop(query); customzoom = 6; break;
		case "Plus" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12530;}; lat = 6305; autopop(query); customzoom = 6; break;
		case "Braindance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 6205; autopop(query); customzoom = 6; break;
		case "AmbientTechno" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13430;}; lat = 6105; autopop(query); customzoom = 6; break;
		case "Glitch" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16430;}; lat = 5905; autopop(query); customzoom = 6; break;
		case "GlitchHop" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17030;}; lat = 5805; autopop(query); customzoom = 6; break;
		case "DrillnBass" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 5705; autopop(query); customzoom = 6; break;
		case "Breakcore" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17030;}; lat = 5605; autopop(query); customzoom = 6; break;
		case "Noise" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 4730;}; lat = 5405; autopop(query); customzoom = 6; break; 
		case "Collage" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 3230;}; lat = 5305; autopop(query); customzoom = 6; break;
		case "Industrial" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 5930;}; lat = 5205; autopop(query); customzoom = 6; break;
		case "Aggrotech" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15530;}; lat = 5105; autopop(query); customzoom = 6; break;
		case "IndustrialRock" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12230;}; lat = 5005; autopop(query); customzoom = 6; break;
		case "Ethereal" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11630;}; lat = 4905; autopop(query); customzoom = 6; break;
		case "Darkwave" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 10430;}; lat = 4805; autopop(query); customzoom = 6; break;
		case "NewBeat" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 12530;}; lat = 4705; autopop(query); customzoom = 6; break;
		case "Futurepop" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14630;}; lat = 4605; autopop(query); customzoom = 6; break;
		case "EBM" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 10730;}; lat = 4505; autopop(query); customzoom = 6; break;
		case "Psydub" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 4405; autopop(query); customzoom = 6; break;
		case "GoaTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13730;}; lat = 4305; autopop(query); customzoom = 6; break;
		case "PsychedelicTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 4205; autopop(query); customzoom = 6; break;
		case "Darkpsy" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15830;}; lat = 4105; autopop(query); customzoom = 6; break;
		case "FullOn" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15530;}; lat = 4005; autopop(query); customzoom = 6; break;
		case "Progpsy" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15230;}; lat = 3905; autopop(query); customzoom = 6; break;
		case "DreamTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14330;}; lat = 3705; autopop(query); customzoom = 6; break;
		case "BalearicTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13730;}; lat = 3605; autopop(query); customzoom = 6; break;
		case "NeoTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17930;}; lat = 3405; autopop(query); customzoom = 6; break;
		case "Trance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13130;}; lat = 3505; autopop(query); customzoom = 6; break;
		case "ProgressiveTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14630;}; lat = 3305; autopop(query); customzoom = 6; break;
		case "TechTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15830;}; lat = 3205; autopop(query); customzoom = 6; break;
		case "NRG" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 3005; autopop(query); customzoom = 6; break;
		case "UKHardhouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 2905; autopop(query); customzoom = 6; break;
		case "Jumpstyle" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15830;}; lat = 2805; autopop(query); customzoom = 6; break;
		case "Hardstyle" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16130;}; lat = 2705; autopop(query); customzoom = 6; break;
		case "HardTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15530;}; lat = 2605; autopop(query); customzoom = 6; break;
		case "GermanTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14030;}; lat = 2505; autopop(query); customzoom = 6; break;
		case "Eurotrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14930;}; lat = 2305; autopop(query); customzoom = 6; break;
		case "AnthemHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 13730;}; lat = 2105; autopop(query); customzoom = 6; break;
		case "DutchHouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 18830;}; lat = 2005; autopop(query); customzoom = 6; break;
		case "VocalTrance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15530;}; lat = 1805; autopop(query); customzoom = 6; break;
		case "Handsup" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 16730;}; lat = 1705; autopop(query); customzoom = 6; break;
		case "Eurodance" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 14030;}; lat = 1605; autopop(query); customzoom = 6; break;
		case "NuItalo" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15830;}; lat = 1505; autopop(query); customzoom = 6; break;
		case "AsianPop" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15230;}; lat = 1405; autopop(query); customzoom = 6; break;
		case "Eurobeat" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 11030;}; lat = 1305; autopop(query); customzoom = 6; break;
		case "ItaloDisco" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 10130;}; lat = 1205; autopop(query); customzoom = 6; break;
		case "Spacesynth" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 9530;}; lat = 1105; autopop(query); customzoom = 6; break;
		case "Synthwave" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17330;}; lat = 1005; autopop(query); customzoom = 6; break;
		case "Synthpop" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 9830;}; lat = 905; autopop(query); customzoom = 6; break;
		case "HiNRG" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 9530;}; lat = 805; autopop(query); customzoom = 6; break;
		case "Electroclash" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15530;}; lat = 605; autopop(query); customzoom = 6; break;
		case "FilthyElectrohouse" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 17030;}; lat = 505; autopop(query); customzoom = 6; break;
		case "Dancepunk" :  if (typeof year !== 'undefined'){lon=yearcoord;}else{lon = 15830;}; lat = 405;  autopop(query); customzoom = 6; break;
		default: lon = 11412; lat = 9728; customzoom = 2; // old lon = 8000; lat = 10200
	}
}  else {
	lon = 11412; lat = 9728; customzoom = 2;
}



function autopop(query) {
	
	$('#musicbox').html("<div style='width:50%;margin:0 auto;text-align: center;'><img src='loader.png' id='spinner' style='height:60px;width:60px;'></div>");
	$.ajax ({
		url: 'musiccheck.php?x=' + lon + '&y=' + lat,
		cache: false,
		success: function(data) {
			if (data == "genre") {

				$('#musicbox').load('musicbox.php?x=' + lon + '&y=' + lat + '&match=genre', function() {
					var genre = $('#showgenre').html();
					$('#content').load('content.php?g=' + encodeURIComponent(genre), function() {
							
						$('#content').attr('style', 'display:none');
						$('#content').attr('style', 'height:50%');
							
						$('#content').slideToggle("slow", function() {
							$(".readmore").css({ "display": "block" });	

							$(".contentbox").scroll(function(){
								$(".contentbox").getNiceScroll().resize();
							});
						});
						
						mixclouds();
													
						var karet = $('#content').css('display');
						if (karet == "block") {
							$("#carrot").html("&or;");
							$("#showinfo").css({
								"background": "url('icon-info2.png') no-repeat",
								"background-size": "80% 80%",
								"background-position": "center",
								"background-color": "#111111",
								"opacity": "0.8"
							});
						} 
						
					})
				});		
			}
			if (data == "year") {
			
				if (typeof track !== 'undefined') { song = '&artist=' + artist + '&track=' + track; }
				else { song = ''; }
				
				$('#musicbox').load('musicbox.php?x=' + lon + '&y=' + lat + song + '&match=year', function() {
					var genre = $('#showgenre').html();
					$('#content').load('content.php?g=' + encodeURIComponent(genre), function() {
							
						$('#content').attr('style', 'display:none');
						$('#content').attr('style', 'height:50%');
							
						$('#content').slideToggle("slow", function() {
							$(".readmore").css({ "display": "block" });	

							$(".contentbox").scroll(function(){
								$(".contentbox").getNiceScroll().resize();
							});
						});
						
						mixclouds();
													
						var karet = $('#content').css('display');
						if (karet == "block") {
							$("#carrot").html("&or;");
							$("#showinfo").css({
								"background": "url('icon-info2.png') no-repeat",
								"background-size": "80% 80%",
								"background-position": "center",
								"background-color": "#111111",
								"opacity": "0.8"
							});
						} 
						
					})
				});
			}
		}
	})
};


function init(){
	var extent = [0, 0, 32192, 32768]; // real image size is 22824w x 19456h (old width: 16384w)
	var projection = new ol.proj.Projection ({
        code: 'pixel',
		units: 'pixels',
		extent: extent
    });
	
    map = new ol.Map({
        target:'map',
        renderer:'canvas',
		moveTolerance: 10,
		layers: [ 
			new ol.layer.Tile ({
				source: new ol.source.XYZ ({
					projection: projection,
					extent: extent,
					url: 'tiles/{z}/{x}/{-y}.png',
					noWrap: true,
					wrapX: false
				})
			}),
			 genrecoordslayer, genrebuttons, genrebuttons2, nongenrebuttons1, nongenrebuttons2, scenelabels, scenelabels2, scenelabels3, scenelabels4, genrelabels, genrelabels2, nongenretext1, nongenretext2, nongenretext3, nongenretext4, nongenretext5, nongenretext6, text1, text2, text3, text4, text5, text6
		],
		
				
		//layers not used: yearlayer, decadelayer, decadelabels, decadelabels2, , scenelayer
		
		/***********controls, interactions, layers, overlays, view************/
		
		controls: ol.control.defaults ({
			attributionOptions: /* @type {olx.control.AttributionOptions} */  ({ collapsible: true })
		}).extend ([
			new ol.control.ZoomToExtent({
				tipLabel: '',
				extent: [0, 0, 22824, 19456],
				label: 'H',
			})
			  /**this puts the mouse coords in the top right corner 
			new ol.control.MousePosition ({
				coordinateFormat: ol.coordinate.createStringXY(),
				projection: 'EPSG:3857',
			}) **/
		]), 

		interactions : ol.interaction.defaults ({
			doubleClickZoom: false,
			pointer: false,
			select: false,
			altShiftDragRotate:false, 
			pinchRotate:false
		}),
		
		view: new ol.View({
			projection: projection,
			extent: [0, 0, 22824, 19456],
			//center: [8000,10200], <-- default
			center: [lon,lat],
			//zoom: 3, <-- default
			zoom: customzoom,
			maxZoom:7, // the higher this is, the more you can zoom in
			minZoom:1  // the lower this is, the more you can zoom out
    	}),
		
    });
	
	map.on("movestart", function (evnt) {
		var layerarray = map.getLayers().getArray();
		map.removeLayer(layerarray[24]);
		map.removeLayer(layerarray[25]);
		map.removeLayer(layerarray[26]);
		map.removeLayer(layerarray[27]);
		map.removeLayer(layerarray[28]);
		map.removeLayer(layerarray[29]);
		
		map.removeLayer(layerarray[24]);
		map.removeLayer(layerarray[25]);
		map.removeLayer(layerarray[26]);
		map.removeLayer(layerarray[27]);
		map.removeLayer(layerarray[28]);
		map.removeLayer(layerarray[29]);
		
		map.removeLayer(layerarray[24]);
		map.removeLayer(layerarray[25]);
		map.removeLayer(layerarray[26]);
		map.removeLayer(layerarray[27]);
		map.removeLayer(layerarray[28]);
		map.removeLayer(layerarray[29]);
	});
	
	

	map.on("moveend", function (evnt) {

		var rawcoords = map.getView().calculateExtent(map.getSize());
		
		topleftlat = parseInt(rawcoords[0]); // 0
		topleftlon = parseInt(rawcoords[3]); // 19456
		
		topleftlonbg = topleftlon;
		if ( topleftlonbg > 19756) { topleftlonbg = 19756; }
		if ( topleftlonbg < 0) { topleftlonbg = 0; }
		
		topleftlon = topleftlon - 5;
		
		toprightlat = 22824;
		toprightlon = 19456;
		
		if ( topleftlon > 19756) { topleftlon = 19756; }
		if ( topleftlon < 0) { topleftlon = 0; }
		if ( topleftlat < 0) { topleftlat = 0; }
		if ( toprightlat > 22824) { toprightlat = 22824; }
		
		decademarkers = topleftlon - 300;
		decademarkersbg = topleftlon - 320;
		yearmarkers = topleftlon - 100;
		
		
		// for the markers
		var coordinates = [
			[[0, topleftlon], [22824, topleftlon]],
			[[1500, topleftlon], [1500, decademarkers]],
			[[1800, topleftlon], [1800, yearmarkers]],
			[[2100, topleftlon], [2100, yearmarkers]],
			[[2400, topleftlon], [2400, yearmarkers]],
			[[2700, topleftlon], [2700, yearmarkers]],
			[[3000, topleftlon], [3000, yearmarkers]],
			[[3300, topleftlon], [3300, yearmarkers]],
			[[3600, topleftlon], [3600, yearmarkers]],
			[[3900, topleftlon], [3900, yearmarkers]],
			[[4200, topleftlon], [4200, yearmarkers]],
			[[4500, topleftlon], [4500, decademarkers]],
			[[4800, topleftlon], [4800, yearmarkers]],
			[[5100, topleftlon], [5100, yearmarkers]],
			[[5400, topleftlon], [5400, yearmarkers]],
			[[5700, topleftlon], [5700, yearmarkers]],
			[[6000, topleftlon], [6000, yearmarkers]],
			[[6300, topleftlon], [6300, yearmarkers]],
			[[6600, topleftlon], [6600, yearmarkers]],
			[[6900, topleftlon], [6900, yearmarkers]],
			[[7200, topleftlon], [7200, yearmarkers]],
			[[7500, topleftlon], [7500, decademarkers]],
			[[7800, topleftlon], [7800, yearmarkers]],
			[[8100, topleftlon], [8100, yearmarkers]],
			[[8400, topleftlon], [8400, yearmarkers]],
			[[8700, topleftlon], [8700, yearmarkers]],
			[[9000, topleftlon], [9000, yearmarkers]],
			[[9300, topleftlon], [9300, yearmarkers]],
			[[9600, topleftlon], [9600, yearmarkers]],
			[[9900, topleftlon], [9900, yearmarkers]],
			[[10200, topleftlon], [10200, yearmarkers]],
			[[10500, topleftlon], [10500, decademarkers]],
			[[10800, topleftlon], [10800, yearmarkers]],
			[[11100, topleftlon], [11100, yearmarkers]],
			[[11400, topleftlon], [11400, yearmarkers]],
			[[11700, topleftlon], [11700, yearmarkers]],
			[[12000, topleftlon], [12000, yearmarkers]],
			[[12300, topleftlon], [12300, yearmarkers]],
			[[12600, topleftlon], [12600, yearmarkers]],
			[[12900, topleftlon], [12900, yearmarkers]],
			[[13200, topleftlon], [13200, yearmarkers]],
			[[13500, topleftlon], [13500, decademarkers]],
			[[13800, topleftlon], [13800, yearmarkers]],
			[[14100, topleftlon], [14100, yearmarkers]],
			[[14400, topleftlon], [14400, yearmarkers]],
			[[14700, topleftlon], [14700, yearmarkers]],
			[[15000, topleftlon], [15000, yearmarkers]],
			[[15300, topleftlon], [15300, yearmarkers]],
			[[15600, topleftlon], [15600, yearmarkers]],
			[[15900, topleftlon], [15900, yearmarkers]],
			[[16200, topleftlon], [16200, yearmarkers]],			
			[[16500, topleftlon], [16500, decademarkers]],
			[[16800, topleftlon], [16800, yearmarkers]],
			[[17100, topleftlon], [17100, yearmarkers]],
			[[17400, topleftlon], [17400, yearmarkers]],
			[[17700, topleftlon], [17700, yearmarkers]],
			[[18000, topleftlon], [18000, yearmarkers]],
			[[18300, topleftlon], [18300, yearmarkers]],
			[[18600, topleftlon], [18600, yearmarkers]],
			[[18900, topleftlon], [18900, yearmarkers]],
			[[19200, topleftlon], [19200, yearmarkers]],			
			[[19500, topleftlon], [19500, decademarkers]],
			[[19800, topleftlon], [19800, yearmarkers]],
			[[20100, topleftlon], [20100, yearmarkers]],
			[[20400, topleftlon], [20400, yearmarkers]],
			[[20700, topleftlon], [20700, yearmarkers]],
			[[21000, topleftlon], [21000, yearmarkers]],
			[[21300, topleftlon], [21300, yearmarkers]],
			[[21600, topleftlon], [21600, yearmarkers]],
			[[21900, topleftlon], [21900, yearmarkers]],
			[[22200, topleftlon], [22200, yearmarkers]],	
			[[22500, topleftlon], [22500, yearmarkers]],	
		];
		
		var linestring = new ol.Feature({
			geometry: 
				new ol.geom.MultiLineString(coordinates)
		});

		var timelinelayer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [linestring]
			}),
			minResolution: 0,
			maxResolution: 40,
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(254,255,157,1.0)',
					width: 2
				}),
				fill: new ol.style.Fill ({ color: '#feff9d' })
			})
		})		
		
		
		//for the background
		var timelinebg1 = [
			[ [toprightlat, topleftlonbg], [toprightlat, decademarkersbg], [topleftlat, decademarkersbg], [topleftlat, topleftlonbg], [toprightlat, topleftlonbg] ]
		];
		
		var timelinebg2 = [
			[ [toprightlat, topleftlonbg], [toprightlat, yearmarkers], [topleftlat, yearmarkers], [topleftlat, topleftlonbg], [toprightlat, topleftlonbg] ]
		];
		
		var bgtimeline1 = new ol.Feature({
			geometry: 
				new ol.geom.Polygon(timelinebg1)
		});
		
		var bgtimeline2 = new ol.Feature({
			geometry: 
				new ol.geom.Polygon(timelinebg2)
		});

		var timelinebglayer1 = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [bgtimeline1]
			}),
			minResolution: 8,
			maxResolution: 40,
			style: new ol.style.Style({
				fill: new ol.style.Fill ({
					color: 'rgba(0,0,0,1.0)'
				})
			})
		})
		
		var timelinebglayer2 = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [bgtimeline2]
			}),
			minResolution: 0,
			maxResolution: 8,
			style: new ol.style.Style({
				fill: new ol.style.Fill ({
					color: 'rgba(0,0,0,1.0)'
				})
			})
		})
		
		// for the decade labels
		var decadelabelvars = {
			'type': 'FeatureCollection',
			'features': [
				{ "type": "Feature", "properties": { "name": "1900s"}, "geometry": { "type": "Point", "coordinates": [700, decademarkers] } },
				{ "type": "Feature", "properties": { "name": "1950s"}, "geometry": { "type": "Point", "coordinates": [3150, decademarkers] } },
				{ "type": "Feature", "properties": { "name": "1960s"}, "geometry": { "type": "Point", "coordinates": [6150, decademarkers] } },
				{ "type": "Feature", "properties": { "name": "1970s"}, "geometry": { "type": "Point", "coordinates": [9150, decademarkers] } },
				{ "type": "Feature", "properties": { "name": "1980s"}, "geometry": { "type": "Point", "coordinates": [12150, decademarkers] } },
				{ "type": "Feature", "properties": { "name": "1990s"}, "geometry": { "type": "Point", "coordinates": [15150, decademarkers] } },
				{ "type": "Feature", "properties": { "name": "2000s"}, "geometry": { "type": "Point", "coordinates": [18150, decademarkers] } },
				{ "type": "Feature", "properties": { "name": "2010s"}, "geometry": { "type": "Point", "coordinates": [21150, decademarkers] } }
			]
		};

		var decadelabellayer1 = new ol.layer.Vector ({
			source: new ol.source.Vector ({
				features: (new ol.format.GeoJSON()).readFeatures(decadelabelvars)
			}),
			minResolution: 16,
			maxResolution: 40,
			style: function(feature) {
				return new ol.style.Style ({
					image: new ol.style.Circle ({
						radius: 0,
						fill: new ol.style.Fill ({ color: '#9cffdf' }),
						stroke: new ol.style.Stroke ({ width: 0, color: '#feff9d' })
					}),
					text: new ol.style.Text ({
						font: '12px Helvetica, sans serif',
						text: feature.get('name'),
						offsetX: 0,
						offsetY: 6,
						textBaseline: 'bottom',
						textAlign: 'center',
						fill: new ol.style.Fill ({ color: '#feff9d' })
					})
				})
			}
		});	

		var decadelabellayer2 = new ol.layer.Vector ({
			source: new ol.source.Vector ({
				features: (new ol.format.GeoJSON()).readFeatures(decadelabelvars)
			}),
			minResolution: 8,
			maxResolution: 16,
			style: function(feature) {
				return new ol.style.Style ({
					image: new ol.style.Circle ({
						radius: 0,
						fill: new ol.style.Fill ({ color: '#9cffdf' }),
						stroke: new ol.style.Stroke ({ width: 0, color: '#feff9d' })
					}),
					text: new ol.style.Text ({
						font: '20px Helvetica, sans serif',
						text: feature.get('name'),
						offsetX: 0,
						offsetY: 4,
						textBaseline: 'bottom',
						textAlign: 'center',
						fill: new ol.style.Fill ({ color: '#feff9d' })
					})
				})
			}
		});	


		// for the year labels
		var yearlabelvars = {
			'type': 'FeatureCollection',
			'features': [
				{ "type": "Feature", "properties": { "name": "1950"}, "geometry": { "type": "Point", "coordinates": [1650, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1951"}, "geometry": { "type": "Point", "coordinates": [1950, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1952"}, "geometry": { "type": "Point", "coordinates": [2250, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1953"}, "geometry": { "type": "Point", "coordinates": [2550, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1954"}, "geometry": { "type": "Point", "coordinates": [2850, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1955"}, "geometry": { "type": "Point", "coordinates": [3150, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1956"}, "geometry": { "type": "Point", "coordinates": [3450, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1957"}, "geometry": { "type": "Point", "coordinates": [3750, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1958"}, "geometry": { "type": "Point", "coordinates": [4050, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1959"}, "geometry": { "type": "Point", "coordinates": [4350, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1960"}, "geometry": { "type": "Point", "coordinates": [4650, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1961"}, "geometry": { "type": "Point", "coordinates": [4950, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1962"}, "geometry": { "type": "Point", "coordinates": [5250, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1963"}, "geometry": { "type": "Point", "coordinates": [5550, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1964"}, "geometry": { "type": "Point", "coordinates": [5850, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1965"}, "geometry": { "type": "Point", "coordinates": [6150, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1966"}, "geometry": { "type": "Point", "coordinates": [6450, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1967"}, "geometry": { "type": "Point", "coordinates": [6750, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1968"}, "geometry": { "type": "Point", "coordinates": [7050, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1969"}, "geometry": { "type": "Point", "coordinates": [7350, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1970"}, "geometry": { "type": "Point", "coordinates": [7650, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1971"}, "geometry": { "type": "Point", "coordinates": [7950, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1972"}, "geometry": { "type": "Point", "coordinates": [8250, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1973"}, "geometry": { "type": "Point", "coordinates": [8550, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1974"}, "geometry": { "type": "Point", "coordinates": [8850, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1975"}, "geometry": { "type": "Point", "coordinates": [9150, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1976"}, "geometry": { "type": "Point", "coordinates": [9450, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1977"}, "geometry": { "type": "Point", "coordinates": [9750, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1978"}, "geometry": { "type": "Point", "coordinates": [10050, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1979"}, "geometry": { "type": "Point", "coordinates": [10350, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1980"}, "geometry": { "type": "Point", "coordinates": [10650, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1981"}, "geometry": { "type": "Point", "coordinates": [10950, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1982"}, "geometry": { "type": "Point", "coordinates": [11250, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1983"}, "geometry": { "type": "Point", "coordinates": [11550, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1984"}, "geometry": { "type": "Point", "coordinates": [11850, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1985"}, "geometry": { "type": "Point", "coordinates": [12150, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1986"}, "geometry": { "type": "Point", "coordinates": [12450, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1987"}, "geometry": { "type": "Point", "coordinates": [12750, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1988"}, "geometry": { "type": "Point", "coordinates": [13050, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1989"}, "geometry": { "type": "Point", "coordinates": [13350, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1990"}, "geometry": { "type": "Point", "coordinates": [13650, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1991"}, "geometry": { "type": "Point", "coordinates": [13950, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1992"}, "geometry": { "type": "Point", "coordinates": [14250, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1993"}, "geometry": { "type": "Point", "coordinates": [14550, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1994"}, "geometry": { "type": "Point", "coordinates": [14850, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1995"}, "geometry": { "type": "Point", "coordinates": [15150, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1996"}, "geometry": { "type": "Point", "coordinates": [15450, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1997"}, "geometry": { "type": "Point", "coordinates": [15750, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1998"}, "geometry": { "type": "Point", "coordinates": [16050, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "1999"}, "geometry": { "type": "Point", "coordinates": [16350, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2000"}, "geometry": { "type": "Point", "coordinates": [16650, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2001"}, "geometry": { "type": "Point", "coordinates": [16950, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2002"}, "geometry": { "type": "Point", "coordinates": [17250, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2003"}, "geometry": { "type": "Point", "coordinates": [17550, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2004"}, "geometry": { "type": "Point", "coordinates": [17850, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2005"}, "geometry": { "type": "Point", "coordinates": [18150, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2006"}, "geometry": { "type": "Point", "coordinates": [18450, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2007"}, "geometry": { "type": "Point", "coordinates": [18750, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2008"}, "geometry": { "type": "Point", "coordinates": [19050, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2009"}, "geometry": { "type": "Point", "coordinates": [19350, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2010"}, "geometry": { "type": "Point", "coordinates": [19650, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2011"}, "geometry": { "type": "Point", "coordinates": [19950, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2012"}, "geometry": { "type": "Point", "coordinates": [20250, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2013"}, "geometry": { "type": "Point", "coordinates": [20550, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2014"}, "geometry": { "type": "Point", "coordinates": [20850, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2015"}, "geometry": { "type": "Point", "coordinates": [21150, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2016"}, "geometry": { "type": "Point", "coordinates": [21450, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2017"}, "geometry": { "type": "Point", "coordinates": [21750, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2018"}, "geometry": { "type": "Point", "coordinates": [22050, topleftlon] } },
				{ "type": "Feature", "properties": { "name": "2019"}, "geometry": { "type": "Point", "coordinates": [22350, topleftlon] } }
			]
		};

		var yearlabellayer = new ol.layer.Vector ({
			source: new ol.source.Vector ({
				features: (new ol.format.GeoJSON()).readFeatures(yearlabelvars)
			}),
			minResolution: 0,
			maxResolution: 8,
			style: function(feature) {
				return new ol.style.Style ({
					image: new ol.style.Circle ({
						radius: 0,
						fill: new ol.style.Fill ({ color: '#9cffdf' }),
						stroke: new ol.style.Stroke ({ width: 0, color: '#feff9d' })
					}),
					text: new ol.style.Text ({
						font: '15px Helvetica, sans serif',
						text: feature.get('name'),
						offsetX: 0,
						offsetY: 4,
						textBaseline: 'top',
						textAlign: 'center',
						fill: new ol.style.Fill ({ color: '#feff9d' })
					})
				})
			}
		});		

		var layerarray = map.getLayers().getArray();
		map.removeLayer(layerarray[24]);
		map.removeLayer(layerarray[25]);
		map.removeLayer(layerarray[26]);
		map.removeLayer(layerarray[27]);
		map.removeLayer(layerarray[28]);
		map.removeLayer(layerarray[29]);
		
		map.removeLayer(layerarray[24]);
		map.removeLayer(layerarray[25]);
		map.removeLayer(layerarray[26]);
		map.removeLayer(layerarray[27]);
		map.removeLayer(layerarray[28]);
		map.removeLayer(layerarray[29]);
		
		map.removeLayer(layerarray[24]);
		map.removeLayer(layerarray[25]);
		map.removeLayer(layerarray[26]);
		map.removeLayer(layerarray[27]);
		map.removeLayer(layerarray[28]);
		map.removeLayer(layerarray[29]);
		
		map.addLayer(timelinebglayer1);
		map.addLayer(timelinebglayer2);
		map.addLayer(timelinelayer);
		map.addLayer(decadelabellayer1);
		map.addLayer(decadelabellayer2);
		map.addLayer(yearlabellayer);

	});
	

	
 //so the mouse looks like a pointer
	var cursorHoverStyle = "pointer";
	var target = map.getTarget();
	var jTarget = typeof target === "string" ? $("#"+target) : $(target);
	
	map.on("pointermove", function (event) {
		//filter out layers that don't need mouse behaviors
		var mouseCoordInMapPixels = [ event.originalEvent.offsetX, event.originalEvent.offsetY ];
		var newchoords = map.forEachFeatureAtPixel(mouseCoordInMapPixels, function(feature) {
			return newchoords;
        });
		
		var hit = map.forEachFeatureAtPixel(mouseCoordInMapPixels, function (feature, layer) {
			return layer === genrecoordslayer || layer === genrebuttons || layer === nongenrebuttons1; 
		});
				
		if (hit) {
			jTarget.css("cursor", cursorHoverStyle);
		} else {			
			jTarget.css("cursor", "");
		}		
	});




	genrecoordslayer.set('selectable', true);
	genrebuttons.set('selectable', true); 
	nongenrebuttons1.set('selectable', true); 

	
	//close the menu and content
	map.on('click', function(evt) { 
		//side menu
		var karet2 = $('#content').css('display');
		if (karet2 == "block") {
			$('#content').slideToggle("slow");
			$('#carrot').html("&and;");
			$('#showinfo').css ({
				"background": "url('icon-info2.png') no-repeat",
				"background-size": "80% 80%",
				"background-position": "center",
				"background-color": "none",
				"opacity": "1.0"
			});
		}
		
		var menu2 = $('#menu').css('display');
		if (menu2 == "block") {
			$('#menu').animate({ width:"toggle" });
		} 
	
	})
	
	//select interactions


	
	var highlightred = new ol.style.Style ({
		stroke: new ol.style.Stroke ({ color: '#ff0000', width: 2, }),
		fill: new ol.style.Fill ({ color: 'rgba(255,255,255,1.0)' })
	});
	
	var selectInteractionclick = new ol.interaction.Select ({
		layers: function(layer) {
			return layer.get('selectable') == true;
		},
		style: [highlightred],
		hitTolerance: 10,
		toggleCondition: ol.events.condition.never
	});
		
	map.on('click', function(events) {
		var mousecoords2 = events.pixel;
		var hit2 = map.forEachFeatureAtPixel(mousecoords2, function (feature, layer) {
			return layer === genrecoordslayer || layer === genrebuttons || layer === nongenrebuttons1; 
		});

		if (hit2) {
			selectInteractionclick.setActive(true);
			//music player
			var coord = events.coordinate;
			var xcoord = parseInt(coord[0], 10);
			var ycoord = parseInt(coord[1], 10);
			
			$('#musicbox').html("<div style='width:50%;margin:0 auto;text-align: center;'><img src='loader.png' id='spinner'></div>");
			
			$.ajax ({
				url: 'musiccheck.php?x=' + xcoord + '&y=' + ycoord,
				cache: false,
				success: function(data) {
					if (data == "genre") {
						$('#musicbox').load('musicbox.php?x=' + xcoord + '&y=' + ycoord + '&match=genre', function() {
							var genre = $('#showgenre').html();
							$('#content').load('content.php?g=' + encodeURIComponent(genre), function() {
								
								$('#content').attr('style', 'display:none');
								$('#content').attr('style', 'height:50%');
								
								$('#content').slideToggle("slow", function() {
									$(".readmore").css({ "display": "block" });	
									
								});
														
								mixclouds();
								
								var karet = $('#content').css('display');
								if (karet == "block") {
									$("#carrot").html("&or;");
									$("#showinfo").css({
										"background": "url('icon-info2.png') no-repeat",
										"background-size": "80% 80%",
										"background-position": "center",
										"background-color": "#111111",
										"opacity": "0.8"
									});
								} 
								
							})
						});
				
					}
					if (data == "year") {
						$('#musicbox').html("<div style='width:50%;margin:0 auto;text-align: center;'><img src='loader.png' id='spinner'></div>");
						$('#musicbox').load('musicbox.php?x=' + xcoord + '&y=' + ycoord + '&match=year');
					}
					if (data == "History of Music Technology") {
						$('#content').load('content.php?g=' + encodeURIComponent(data), function() {
								
							$('#content').attr('style', 'display:none');
							$('#content').attr('style', 'height:50%');

							$('#content').slideToggle("slow", function() {
								$(".readmore").css({ "display": "block" });	
							});
														
							mixclouds();
																					
							var karet = $('#content').css('display');
							if (karet == "block") {
								$("#carrot").html("&or;");
								$("#showinfo").css({
									"background": "url('icon-info2.png') no-repeat",
									"background-size": "80% 80%",
									"background-position": "center",
									"background-color": "#111111",
									"opacity": "0.8"
								});
							} 
						})
					}
				}
			})
			
		} 
		if (!hit2) {
			selectInteractionclick.setActive(false);
		} 
	});

	map.addInteraction(selectInteractionclick);	
	
};

