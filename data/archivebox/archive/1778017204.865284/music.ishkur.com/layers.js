
var genrebuttons = new ol.layer.Vector ({
	name: 'genres',
	source: new ol.source.Vector ({
		url: 'coords.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 16,
	style: new ol.style.Style ({
		fill: new ol.style.Fill ({
			color: '#9cffdf'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 1.0)',
			width: 2
		})
	})
});

var genrebuttons2 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'coords.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 16,
	maxResolution: 40,
	style: new ol.style.Style ({
		fill: new ol.style.Fill ({
			color: '#9cffdf'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 0.0)',
			width: 0
		})
	})
});





var text1 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'genrebiglabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 2,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '45px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 40,
				offsetY: 22,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 8, color: '#000000' })
			})
		})
	}
});

var text2 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'genrebiglabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 2,
	maxResolution: 4,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '25px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 20,
				offsetY: 11,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 4, color: '#000000' })
			})
		})
	}
});

var text3 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'genrebiglabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 4,
	maxResolution: 8,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '15px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 9,
				offsetY: 5,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});

var text4 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'genrebiglabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 8,
	maxResolution: 16,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '9px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 5,
				offsetY: 1,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});


var text5 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'genrebiglabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 16,
	maxResolution: 32,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '8px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 2,
				offsetY: 1,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});

var text6 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'genrebiglabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 32,
	maxResolution: 64,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '4px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 1,
				offsetY: 1,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});

var nongenrebuttons1 = new ol.layer.Vector ({
	name: 'nongenres',
	source: new ol.source.Vector ({
		url: 'nongenres.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 16,
	style: new ol.style.Style ({
		fill: new ol.style.Fill ({
			color: '#42fd09'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 1.0)',
			width: 2
		})
	})
});

var nongenrebuttons2 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'nongenres.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 16,
	maxResolution: 40,
	style: new ol.style.Style ({
		fill: new ol.style.Fill ({
			color: '#42fd09'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 0.0)',
			width: 0
		})
	})
});


var nongenretext1 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'nongenres.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 2,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '45px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 40,
				offsetY: 22,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 8, color: '#000000' })
			})
		})
	}
});

var nongenretext2 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'nongenres.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 2,
	maxResolution: 4,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '25px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 20,
				offsetY: 11,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 4, color: '#000000' })
			})
		})
	}
});

var nongenretext3 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'nongenres.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 4,
	maxResolution: 7,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '15px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 9,
				offsetY: 5,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});

var nongenretext4 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'nongenres.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 7,
	maxResolution: 12,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '9px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 5,
				offsetY: 1,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});


var nongenretext5 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'nongenres.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 12,
	maxResolution: 20,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '8px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 2,
				offsetY: 1,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});

var nongenretext6 = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'nongenres.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 20,
	maxResolution: 40,
	style: function(feature) {
		return new ol.style.Style ({
			text: new ol.style.Text ({
				font: '4px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 1,
				offsetY: 1,
				textBaseline: 'top',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});



var yearlayer = new ol.layer.Vector ({
	id: 'verticalbar',
	source: new ol.source.Vector ({
		url: 'years.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 8,
	style: new ol.style.Style ({
		fill: new ol.style.Fill ({
			color: 'rgba(255, 255, 255, 0.0)'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 0.0)',
			width: 0
		})
	})
});

var decadelayer = new ol.layer.Vector ({
	id: 'decadebar',
	source: new ol.source.Vector ({
		url: 'decades.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 40,
	style: new ol.style.Style ({
		fill: new ol.style.Fill ({
			color: 'rgba(255, 255, 255, 0.0)'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(255, 255, 255, 0.1)',
			width: 1
		})
	})
});


/**scene overlays, colorful edition
var scenelayer = new ol.layer.Vector ({
	id: 'horizontalbar',
	source: new ol.source.Vector ({
		url: 'scenes.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 16,
	maxResolution: 40,
	style: function(feature) {
		var name = feature.get('name');
		var opacity = 0.05;
		
		if (name == "Bass" || name == "Eurotrash" || name == "Urban") { var scenecolor = [134, 154, 60, opacity]; }
		if (name == "Hip Hop") { var scenecolor = [6, 160, 190, opacity]; }
		if (name == "Electro") { var scenecolor = [249, 198, 184, opacity]; }
		if (name == "Techno") { var scenecolor = [54, 78, 190, opacity]; }
		if (name == "Hardcore" || name == "Eurodisco") { var scenecolor = [134, 78, 189, opacity]; }
		if (name == "Drum n Bass" || name == "Industrial/Goth") { var scenecolor = [134, 187, 62, opacity]; }
		if (name == "Breakbeat" || name == "Trance" || name == "Progressive" || name == "Chill Out") { var scenecolor = [139, 78, 62, opacity]; }
		if (name == "Acid") { var scenecolor = [75, 79, 123, opacity]; }
		if (name == "House") { var scenecolor = [24, 141, 62, opacity]; }
		if (name == "Tech House") { var scenecolor = [6, 114, 190, opacity]; }
		if (name == "Garage/Deep House") { var scenecolor = [134, 199, 62, opacity]; }
		if (name == "UK Garage") { var scenecolor = [75, 78, 190, opacity]; }
		if (name == "Downtempo" || name == "Ambient") { var scenecolor = [96, 206, 62, opacity]; }
		if (name == "Pioneers") { var scenecolor = [101, 83, 147, opacity]; }
		if (name == "Chiptune") { var scenecolor = [117, 206, 62, opacity]; }
		if (name == "Intelligent Dance Music" || name == "Hard Dance") { var scenecolor = [44, 182, 190, opacity]; }
		if (name == "Psy Trance") { var scenecolor = [6, 93, 190, opacity]; }
		if (name == "Eurotrance") { var scenecolor = [96, 206, 62, opacity]; }
		if (name == "Europop") { var scenecolor = [30, 78, 190, opacity]; }
		
		return new ol.style.Style ({
			fill: new ol.style.Fill ({
				color: scenecolor
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(0, 0, 0, 0.0)',
				width: 0
			})
		})
	}	
});


/*scene overlaps, lazy white opacity version
var scenelayer = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'scenes.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 12,
	maxResolution: 40,
	style: new ol.style.Style ({
		fill: new ol.style.Fill ({
			color: 'rgba(255, 255, 255, 0.1)'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(255, 255, 255, 0.1)',
			width: 0
		})
	})
});
*/

var scenelabels = new ol.layer.Vector ({
	id: 'label1',
	source: new ol.source.Vector ({
		url: 'scenelabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 32,
	maxResolution: 256,
	style: function(feature) {
		return new ol.style.Style ({
			image: new ol.style.Circle ({
				radius: 0,
				fill: new ol.style.Fill ({ color: '#9cffdf' }),
				stroke: new ol.style.Stroke ({ width: 0, color: '#000000' })
			}),
			text: new ol.style.Text ({
				font: '8px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: -5,
				offsetY: 0,
				textBaseline: 'middle',
				textAlign: 'right',
				fill: new ol.style.Fill ({ color: '#feff9d' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});


var scenelabels2 = new ol.layer.Vector ({
	id: 'label2',
	source: new ol.source.Vector ({
		url: 'scenelabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 16,
	maxResolution: 32,
	style: function(feature) {
		return new ol.style.Style ({
			image: new ol.style.Circle ({
				radius: 0,
				fill: new ol.style.Fill ({ color: '#9cffdf' }),
				stroke: new ol.style.Stroke ({ width: 0, color: '#000000' })
			}),
			text: new ol.style.Text ({
				font: '14px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: -5,
				offsetY: 0,
				textBaseline: 'middle',
				textAlign: 'right',
				fill: new ol.style.Fill ({ color: '#feff9d' }),
				stroke: new ol.style.Stroke ({ width: 2, color: '#000000' })
			})
		})
	}
});

var scenelabels3 = new ol.layer.Vector ({
	id: 'label3',
	source: new ol.source.Vector ({
		url: 'scenelabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 8,
	maxResolution: 16,
	style: function(feature) {
		return new ol.style.Style ({
			image: new ol.style.Circle ({
				radius: 0,
				fill: new ol.style.Fill ({ color: '#9cffdf' }),
				stroke: new ol.style.Stroke ({ width: 0, color: '#000000' })
			}),
			text: new ol.style.Text ({
				font: '20px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: -5,
				offsetY: 0,
				textBaseline: 'middle',
				textAlign: 'right',
				fill: new ol.style.Fill ({ color: '#feff9d' }),
				stroke: new ol.style.Stroke ({ width: 2, color: '#000000' })
			})
		})
	}
});

var scenelabels4 = new ol.layer.Vector ({
	id: 'label4',
	source: new ol.source.Vector ({
		url: 'scenelabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 8,
	style: function(feature) {
		return new ol.style.Style ({
			image: new ol.style.Circle ({
				radius: 0,
				fill: new ol.style.Fill ({ color: '#9cffdf' }),
				stroke: new ol.style.Stroke ({ width: 0, color: '#000000' })
			}),
			text: new ol.style.Text ({
				font: '40px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: -5,
				offsetY: 0,
				textBaseline: 'middle',
				textAlign: 'right',
				fill: new ol.style.Fill ({ color: '#feff9d' }),
				stroke: new ol.style.Stroke ({ width: 2, color: '#000000' })
			})
		})
	}
});



var decadelabels = new ol.layer.Vector ({
	id: 'decadelabel1',
	source: new ol.source.Vector ({
		url: 'decadelabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 15,
	maxResolution: 40,
	style: function(feature) {
		return new ol.style.Style ({
			image: new ol.style.Circle ({
				radius: 0,
				fill: new ol.style.Fill ({ color: '#9cffdf' }),
				stroke: new ol.style.Stroke ({ width: 0, color: '#000000' })
			}),
			text: new ol.style.Text ({
				font: '11px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: -5,
				offsetY: 0,
				textBaseline: 'bottom',
				textAlign: 'center',
				fill: new ol.style.Fill ({ color: '#feff9d' }),
				stroke: new ol.style.Stroke ({ width: 1, color: '#000000' })
			})
		})
	}
});

var decadelabels2 = new ol.layer.Vector ({
	id: 'decadelabel2',
	source: new ol.source.Vector ({
		url: 'decadelabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 14,
	style: function(feature) {
		return new ol.style.Style ({
			image: new ol.style.Circle ({
				radius: 0,
				fill: new ol.style.Fill ({ color: '#9cffdf' }),
				stroke: new ol.style.Stroke ({ width: 0, color: '#000000' })
			}),
			text: new ol.style.Text ({
				font: '20px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: -5,
				offsetY: 0,
				textBaseline: 'bottom',
				textAlign: 'center',
				fill: new ol.style.Fill ({ color: '#feff9d' }),
				stroke: new ol.style.Stroke ({ width: 2, color: '#000000' })
			})
		})
	}
});

var genrelabels = new ol.layer.Vector ({
	id: 'genrelabel1',
	source: new ol.source.Vector ({
		url: 'genrelabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 4,
	maxResolution: 8,
	style: function(feature) {
		return new ol.style.Style ({
			image: new ol.style.Circle ({
				radius: 0,
				fill: new ol.style.Fill ({ color: '#9cffdf' }),
				stroke: new ol.style.Stroke ({ width: 0, color: '#000000' })
			}),
			text: new ol.style.Text ({
				font: '10px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 0,
				offsetY: 15,
				textBaseline: 'bottom',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 2, color: '#000000' })
			})
		})
	}
});

var genrelabels2 = new ol.layer.Vector ({
	id: 'genrelabel2',
	source: new ol.source.Vector ({
		url: 'genrelabels.json',
        format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 4,
	style: function(feature) {
		return new ol.style.Style ({
			image: new ol.style.Circle ({
				radius: 0,
				fill: new ol.style.Fill ({ color: '#9cffdf' }),
				stroke: new ol.style.Stroke ({ width: 0, color: '#000000' })
			}),
			text: new ol.style.Text ({
				font: '15px Helvetica, sans serif',
				text: feature.get('name'),
				offsetX: 0,
				offsetY: 30,
				textBaseline: 'bottom',
				textAlign: 'left',
				fill: new ol.style.Fill ({ color: '#ffffff' }),
				stroke: new ol.style.Stroke ({ width: 2, color: '#000000' })
			})
		})
	}
});

//yearly overlays, colorful edition
var genrecoordslayer = new ol.layer.Vector ({
	id: 'selectgenres',
	name: 'yearbuttons',
	source: new ol.source.Vector ({
		url: 'gcpoly.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 12,
	style: function(feature) {
		var name = feature.get('name');
		
		if (name == "Ghetto Tech" || name == "Technobass" || name == "Moombahton" || name == "Miami Bass" || name == "Dirty South Rap" || name == "Crunk" || name == "Trap" || name == "Funk" || name == "R&B" || name == "Soul" || name == "New Jack Swing" || name == "Reggaeton" || name == "Electroclash" || name == "Filthy Electrohouse" || name == "Dancepunk") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [236, 251, 178, 1.0]; }
			else if (value > 6) { genrecolor = [206, 223, 143, 1.0]; }
			else if (value > 3) { genrecolor = [176, 195, 106, 1.0]; }
			else { genrecolor = [134, 154, 60, 1.0]; }
		}
		
		if (name == "Rap" || name == "Dancehall" || name == "Turntablism" || name == "Eastcoast Rap" || name == "Westcoast Rap" || name == "Southern Rap" || name == "Conscious Rap" || name == "Bling" || name == "Themed Rap")
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [157, 239, 255, 1.0]; }
			else if (value > 6) { genrecolor = [100, 216, 239, 1.0]; }
			else if (value > 3) { genrecolor = [55, 191, 217, 1.0]; }
			else if (value > 3) { genrecolor = [55, 191, 217, 1.0]; }
			else { genrecolor = [6, 160, 190, 1.0]; }
		}
		
		if (name == "Freestyle" || name == "Electro" || name == "Florida Breaks" || name == "Breaks" || name == "Big Beat" || name == "Nu Skool Breaks" || name == "Freeland Breaks" || name == "Progressive Breaks" || name == "Chemical Breaks" || name == "Minimal Prog" || name == "Progressive" || name == "Progressive House" || name == "Twinkle Prog" || name == "McProg" || name == "8th Note Prog" || name == "Indie" || name == "Chill Out" || name == "Worldbeat" || name == "New Age" || name == "Dream Trance" || name == "Balearic Trance" || name == "Trance" || name == "Progressive Trance" || name == "Tech Trance" || name == "Neo Trance" )
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [249, 198, 184, 1.0]; }
			else if (value > 6) { genrecolor = [214, 164, 149, 1.0]; }
			else if (value > 3) { genrecolor = [175, 121, 105, 1.0]; }
			else { genrecolor = [139, 78, 62, 1.0]; }
		}
		
		if (name == "Minimal Techno" || name == "Dub Techno" || name == "Bangin Techno" || name == "Detroit Techno" || name == "Bleep Techno" || name == "Hard Techno" || name == "Euro Techno" || name == "Schranz" || name == "Experimental Techno")
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [186, 197, 252, 1.0]; }
			else if (value > 6) { genrecolor = [143, 160, 238, 1.0]; }
			else if (value > 3) { genrecolor = [94, 116, 217, 1.0]; }
			else { genrecolor = [54, 78, 190, 1.0]; }
		}

		if (name == "Rave" || name == "Hardcore" || name == "Speedcore" || name == "UK Hardcore" || name == "Freeform" || name == "Happy Hardcore" || name == "Oldskool Rave Hardcore" || name == "Italo Disco" || name == "Spacesynth" || name == "Synthwave" || name == "Synthpop" || name == "Hi NRG") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [223, 193, 252, 1.0]; }
			else if (value > 6) { genrecolor = [193, 154, 231, 1.0]; }
			else if (value > 3) { genrecolor = [166, 119, 213, 1.0]; }
			else { genrecolor = [134, 78, 189, 1.0]; }
		}
		
		if (name == "Atmospheric Jungle" || name == "Jazzstep" || name == "Liquid Funk" || name == "Darkside" || name == "Techstep" || name == "Darkstep" || name == "Neurofunk" || name == "Microfunk" || name == "Drumstep" || name == "Pendulum" || name == "Jumpup" || name == "Ragga Jungle" || name == "Noise" || name == "Collage" || name == "Industrial" || name == "Aggrotech" || name == "Industrial Rock" || name == "Ethereal" || name == "Darkwave" || name == "New Beat" || name == "EBM" || name == "Futurepop" ) 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [219, 255, 171, 1.0]; }
			else if (value > 6) { genrecolor = [194, 235, 138, 1.0]; }
			else if (value > 3) { genrecolor = [165, 214, 99, 1.0]; }
			else { genrecolor = [134, 187, 62, 1.0]; }
		}
		
		if (name == "Acid" || name == "Hard Acid" || name == "Acid House") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [185, 189, 237, 1.0]; }
			else if (value > 6) { genrecolor = [147, 152, 199, 1.0]; }
			else if (value > 3) { genrecolor = [112, 116, 161, 1.0]; }
			else { genrecolor = [75, 79, 123, 1.0]; }
			
		}
		
		if (name == "Hard House" || name == "Chicago House" || name == "Hip House" || name == "Italo House" || name == "Disco House" || name == "French House" || name == "Electrohouse" || name == "World House" || name == "Eurohouse" || name == "UK House") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [132, 255, 172, 1.0]; }
			else if (value > 6) { genrecolor = [87, 213, 128, 1.0]; }
			else if (value > 3) { genrecolor = [52, 175, 92, 1.0]; }
			else { genrecolor = [24, 141, 62, 1.0]; }
			
		}
		
		if (name == "Tech House" || name == "Microhouse" || name == "Minimal Tech" || name == "Fidget House" || name == "Deeptech") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [121, 200, 255, 1.0]; }
			else if (value > 6) { genrecolor = [80, 170, 234, 1.0]; }
			else if (value > 3) { genrecolor = [40, 142, 213, 1.0]; }
			else { genrecolor = [6, 114, 190, 1.0]; }
		}
		
		if (name == "Euro Deep House" || name == "US Deep House" || name == "Garage") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [220, 255, 181, 1.0]; }
			else if (value > 6) { genrecolor = [190, 241, 134, 1.0]; }
			else if (value > 3) { genrecolor = [164, 224, 98, 1.0]; }
			else { genrecolor = [134, 199, 62, 1.0]; }
		}
		
		if (name == "Speed Garage" || name == "Brostep" || name == "Dubstep" || name == "Grime" || name == "Future Garage" || name == "2-Step Garage") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [182, 184, 252, 1.0]; }
			else if (value > 6) { genrecolor = [149, 151, 237, 1.0]; }
			else if (value > 3) { genrecolor = [114, 117, 220, 1.0]; }
			else { genrecolor = [75, 78, 190, 1.0]; }
		}
		
		if (name == "Dub" || name == "Acid Jazz" || name == "Downtempo" || name == "Nu Jazz" || name == "Trip Hop" || name == "Eurotrance" || name == "Anthem House" || name == "Dutch House" || name == "Ambient" || name == "Dark Ambient" || name == "Drone") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [195, 255, 177, 1.0]; }
			else if (value > 6) { genrecolor = [155, 241, 129, 1.0]; }
			else if (value > 3) { genrecolor = [124, 227, 93, 1.0]; }
			else { genrecolor = [96, 206, 62, 1.0]; }
		}
		
		if (name == "Moog" || name == "Soundtrack" || name == "Modern Classical" || name == "Krautrock" || name == "Minimalism" || name == "Musique Concrete" ) 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [209, 191, 255, 1.0]; }
			else if (value > 6) { genrecolor = [178, 158, 227, 1.0]; }
			else if (value > 3) { genrecolor = [143, 125, 188, 1.0]; }
			else { genrecolor = [101, 83, 147, 1.0]; }
		}
		
		if (name == "Experimental" ) {
			var xpoly = feature.getGeometry().getCoordinates();
			var parse = JSON.stringify(xpoly);
			var arr = parse.split(",");
			var stringarr = JSON.stringify(arr[0]);
			var trimarr = stringarr.replace("\"[[[", "");
			var trimarr2 = trimarr.replace("\"", "");
			var num = parseInt(trimarr2);
			
			if (num > 11600) {
				var value = feature.get('value');
				if (value > 10) { genrecolor = [160, 250, 255, 1.0]; }
				else if (value > 6) { genrecolor = [111, 226, 233, 1.0]; }
				else if (value > 3) { genrecolor = [72, 204, 212, 1.0]; }
				else { genrecolor = [44, 182, 190, 1.0]; }
			} else {
				var value = feature.get('value');
				if (value > 10) { genrecolor = [209, 191, 255, 1.0]; }
				else if (value > 6) { genrecolor = [178, 158, 227, 1.0]; }
				else if (value > 3) { genrecolor = [143, 125, 188, 1.0]; }
				else { genrecolor = [101, 83, 147, 1.0]; }
			}
		}
		
		if (name == "Amiga/Tracker" || name == "Chiptune" || name == "FM" || name == "Fakebit" || name == "Plus") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [212, 255, 185, 1.0]; }
			else if (value > 6) { genrecolor = [177, 240, 137, 1.0]; }
			else if (value > 3) { genrecolor = [150, 230, 100, 1.0]; }
			else { genrecolor = [117, 206, 62, 1.0]; }
		}
		
		if (name == "Braindance" || name == "Ambient Techno" || name == "Glitch" || name == "Glitch Hop" || name == "Drill n Bass" || name == "Breakcore" || name == "NRG" || name == "UK Hardhouse" || name == "Jumpstyle" || name == "Hardstyle" || name == "Hard Trance" || name == "German Trance") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [160, 250, 255, 1.0]; }
			else if (value > 6) { genrecolor = [111, 226, 233, 1.0]; }
			else if (value > 3) { genrecolor = [72, 204, 212, 1.0]; }
			else { genrecolor = [44, 182, 190, 1.0]; }
		}
		
		if (name == "Psydub" || name == "Goa Trance" || name == "Psychedelic Trance" || name == "Darkpsy" || name == "Progpsy" || name == "Full On") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [132, 190, 255, 1.0]; }
			else if (value > 6) { genrecolor = [82, 152, 231, 1.0]; }
			else if (value > 3) { genrecolor = [40, 120, 210, 1.0]; }
			else { genrecolor = [6, 93, 190, 1.0]; }
		}

		if (name == "Vocal Trance" || name == "Handsup" || name == "Eurodance" || name == "Nu Italo" || name == "Asian Pop" || name == "Eurobeat") 
		{
			var value = feature.get('value');
			if (value > 10) { genrecolor = [146, 179, 255, 1.0]; }
			else if (value > 6) { genrecolor = [99, 140, 235, 1.0]; }
			else if (value > 3) { genrecolor = [63, 107, 211, 1.0]; }
			else { genrecolor = [30, 78, 190, 1.0]; }
		}
		
		
		return new ol.style.Style ({
			fill: new ol.style.Fill ({
				color: genrecolor
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(0, 0, 0, 0.8)',
				width: 1
			})
		})
	}
});


/* yearly overlays, lazy white opacity version
var genrecoordslayer = new ol.layer.Vector ({
	source: new ol.source.Vector ({
		url: 'gcpoly.json',
		format: new ol.format.GeoJSON()
	}),
	minResolution: 0,
	maxResolution: 40,
	style: function(feature) {
		var num = feature.get('value')/20+0.3;
		var newnum = num.toFixed(1);
		if (newnum > 0.8) {
			newnum = 0.8;
		}
		genrecolor = [255, 255, 255, newnum]; 
		
		return new ol.style.Style ({
			fill: new ol.style.Fill ({
				color: genrecolor
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(0, 0, 0, 0.8)',
				width: 1
			})
		})
	}	
});
*/

