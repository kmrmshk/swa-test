(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"FinggerGacha_atlas_", frames: [[0,813,57,37],[856,643,125,126],[254,745,126,126],[856,771,125,126],[449,899,256,256],[947,0,50,116],[430,0,425,447],[0,574,428,169],[0,899,447,355],[0,745,252,66],[707,899,239,256],[0,0,428,572],[430,449,424,448],[449,1157,248,158],[856,449,102,192],[699,1157,179,178],[857,0,88,115]]}
];


// symbols:
	//-------------------------------------------------------
	//Gacha_Extension 1/3
	//lib.itemを0-9まで最大10枚分の別画像を用意する
	//-------------------------------------------------------
	var itemSize = 256;
	(lib.item_0 = function () { this.initialize(img.item_0); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);
	(lib.item_1 = function () { this.initialize(img.item_1); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);
	(lib.item_2 = function () { this.initialize(img.item_2); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);
	(lib.item_3 = function () { this.initialize(img.item_3); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);
	(lib.item_4 = function () { this.initialize(img.item_4); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);
	(lib.item_5 = function () { this.initialize(img.item_5); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);
	(lib.item_6 = function () { this.initialize(img.item_6); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);
	(lib.item_7 = function () { this.initialize(img.item_7); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);
	(lib.item_8 = function () { this.initialize(img.item_8); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);
	(lib.item_9 = function () { this.initialize(img.item_9); }).prototype = p = new cjs.Bitmap();
	p.nominalBounds = new cjs.Rectangle(0, 0, itemSize, itemSize);


(lib.button_bg = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.gacha_green = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.gacha_purple = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.gacha_yellow = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.item_dummy = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.lever = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.machine_body_back = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.machine_body_cap = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.machine_body_down = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.machine_body_down_dish = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.machine_body_down_door_cut = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.machine_body_upper = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.machine_glass = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.pannel_body = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.pannel_fingger = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.pannel_gacha = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.shadow = function() {
	this.initialize(ss["FinggerGacha_atlas_"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.shadow_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.shadow();
	this.instance.parent = this;
	this.instance.setTransform(-44,-57.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-44,-57.5,88,115);


(lib.pannel_gacha_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.pannel_gacha();
	this.instance.parent = this;
	this.instance.setTransform(-89.5,-89);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-89.5,-89,179,178);


(lib.pannel_fingger_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.pannel_fingger();
	this.instance.parent = this;
	this.instance.setTransform(-51,-96);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51,-96,102,192);


(lib.pannel_body_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.pannel_body();
	this.instance.parent = this;
	this.instance.setTransform(-124,-79);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-124,-79,248,158);


(lib.ok_text = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhmAwQgRgSAAgcQAAgeARgSQARgSAcAAQAbAAAQARQAPASAAAcQAAAfgPARQgRASgcAAQgbAAgQgRgAhWghQgLANAAAUQAAAVALANQAKANARAAQASAAALgNQAKgMAAgVQAAgWgKgMQgKgNgSAAQgRAAgLANgABcA/Igrg6IgDgEIgBAAIAAA+IgVAAIAAh9IAVAAIAAA7IABAAIADgEIAqg3IAZAAIgyA8IA2BBg");
	this.shape.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.ok_text, new cjs.Rectangle(-11.9,-6.5,23.9,13), null);


(lib.machine_glass_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.machine_glass();
	this.instance.parent = this;
	this.instance.setTransform(-212,-224);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-212,-224,424,448);


(lib.machine_body_upper_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.machine_body_upper();
	this.instance.parent = this;
	this.instance.setTransform(-214,-286);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-214,-286,428,572);


(lib.machine_body_down_door_cut_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.machine_body_down_door_cut();
	this.instance.parent = this;
	this.instance.setTransform(-119.5,-128);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.machine_body_down_door_cut_1, new cjs.Rectangle(-119.5,-128,239,256), null);


(lib.machine_body_down_dish_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.machine_body_down_dish();
	this.instance.parent = this;
	this.instance.setTransform(-126,-33);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.machine_body_down_dish_1, new cjs.Rectangle(-126,-33,252,66), null);


(lib.machine_body_down_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.machine_body_down();
	this.instance.parent = this;
	this.instance.setTransform(-223.5,-177.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-223.5,-177.5,447,355);


(lib.machine_body_cap_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.machine_body_cap();
	this.instance.parent = this;
	this.instance.setTransform(-214,-84.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.machine_body_cap_1, new cjs.Rectangle(-214,-84.5,428,169), null);


(lib.machine_body_back_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.machine_body_back();
	this.instance.parent = this;
	this.instance.setTransform(-212.5,-223.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.machine_body_back_1, new cjs.Rectangle(-212.5,-223.5,425,447), null);


(lib.laver = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.lever();
	this.instance.parent = this;
	this.instance.setTransform(-25,-58);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.laver, new cjs.Rectangle(-25,-58,50,116), null);


(lib.item_tip = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// textBox
	this.textBox = new cjs.Text("item 説明", "18px 'MS PGothic'", "#666666");
	this.textBox.name = "textBox";
	this.textBox.lineHeight = 20;
	this.textBox.lineWidth = 171;
	this.textBox.parent = this;
	this.textBox.setTransform(-161.15,-22.5,1.9425,1.9425);

	this.timeline.addTween(cjs.Tween.get(this.textBox).wait(1));

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().rr(-192.05,-61.05,384.1,122.1,20);
	this.shape.setTransform(0,0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.item_tip, new cjs.Rectangle(-192,-61,384.1,122.1), null);


(lib.item_selected = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#66FFFF").s().p("AqvOEQjUAAAAjUIAA1fQAAjUDUAAIVfAAQDUAAAADUIAAVfQAADUjUAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.item_selected, new cjs.Rectangle(-90,-90,180,180), null);


(lib.gacha_yellow_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.gacha_yellow();
	this.instance.parent = this;
	this.instance.setTransform(-62.5,-63);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.gacha_yellow_1, new cjs.Rectangle(-62.5,-63,125,126), null);


(lib.gacha_text = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AYaEgIgGAAIgBgHIAAoAQAAgEABgBIAGgBIHkAAQAEAAABABIABAFIAAIAQAAAEgBACIgFABIgzAAQgFAAgCgBIgBgGIAAgdIlwAAIAAAdIgBAHIgEAAgAZTDDIFwAAIAAl1IlwAAgA5HDjQBygpAwhSQAqhIAJiXIBDAOQgLBbgPA2QgPA3gZApQgfAzgsAiQgnAdg9AZgAzIDgQCAgyBEhbQA/hTAWh/IiVAAQgtBghIBGIgzgkQBshpAgiOIBFALIgSAyIC5AAIAPAWQggDDhZBpQhFBSh+AzgEgnoADgQCBgyBEhbQA/hTAWh/IiWAAQgtBghIBGIgygkQBrhpAgiOIBGALIgSAyIC4AAIAQAWQggDDhaBpQhFBSh9AzgEAiYADXQBogLAwgoQAdgYAEgjQgZAdgtAAQgyAAgbgcQgYgZAAgsQAAgxAigcQAdgWAsAAQAZAAAaALIgBhBQhwACh4AIIAAg1QBygGB0gCIgBhLIBBAAIgCBKICNgBIAAA3QgwgDheAAIAABIIAAAzQAOAgAAAsQAABWg8AuQgxAmhkAUgEAjqgADQgNANAAAZQAAAZAPAOQANAMAXgBQAZAAAOgPQAMgOAAgVQAAg0g1AAQgWAAgOAOgA/yDZQBHgOAmgWQAqgYASgsQASgqAAhJIAAjeIBDAAIAADjQAACEg9A+QgzAxhuAYgALnADIheATIgMg2IBegSIgThbIA8gLIATBbIC4gjIAgAfQgWBgg9BcIg0geQAaghAUgoQARggAEgYIiJAcIA5EJIg8ANgADRDcQBZgjAggyQAcgsABhSIi3AAIAAg2IC3AAIAAhdQg0AJhQAHIgag1QCygMCDgtIAhA2QgzAPhCAOIAABoICXAAIAAA2IiXAAQgCBrgtA9QgoA2hUAkgAqnBDQAAhDAlg4QAfgwA4ghIAdgLIgBgEIghAJIjjAZIgFg7QCpgNDggNIACA7Qg/ABgmAVQh5BBAAB6QAAB4C0AQIgPBAQjhgUAAiygASFDtQgagUAAgtQAAgrAggfQAggiBQgmQgCgbgIgLQgIgHgPgBQgcABgmAeQgbAYgoAvIgsgnQBQhRAphTIgvABIg7gCIAAg0IBDABIBAAAQANgiALgsIA+AKQgLAhgNAhQBVgDBGgIIACA1QhoAHhPADQgVAogZAdIgPANIACACIAPgKQAZgRAbAAQAeAAAUATQARARAHAeIB3gzIAYA2QhQAcg9AaIAAB0Ig4AAIAAhaQg2AegSASQgQASgBASQAAAZAYAJQAXALA8gBQBEAABXgIIAEA4QhRAFhVAAQhfAAgigbgAk7DZQBRg4AghOQAag+AFhnIiAAAIAAg4ICBAAIAAhkIBEAAIgBBkICvAAQAADQgMBlQgGA1gaAQQgOAKgYAEQgZADg2AAIgVhCQAbADASAAQAbAAAMgDQALgBAEgIQAFgJADgVQAJhQAAiaIhvAAQgICIgqBRQglBGhPA5gAdGCGQgFAAgBgCQgBgBAAgDIAAgPIhpAAIAAAPQAAAEgBABIgGABIgvAAQgFAAgBgCQgBgBABgDIAAjfQgBgEABgCIAGgBIDUAAQAGAAAAACQABABAAAEIAADfQAAAEgBABQgBABgFAAgAbWA7IBpAAIAAhqIhpAAgEggSABKIAAknIBCAAIAAEngA6JhZIA2gTQAdA9AVBMIg4AVQgUhSgcg5gAnxhAIAogMQAXApAVA6IgpAOQgSg4gZgtgA4WhyIA4gRQAYA2ASBQIg4ATQgThWgXgygAmphTIAogMQAZAtASAyIgpAOQgSg4gYgpgAgOkKIAmgJQAXAlAVA5IgoAMQgRg3gZgqgAA8kUIAngLQAZAqASAxIgoAMQgRg0gZgog");
	this.shape.setTransform(-0.2,5.15);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.gacha_text, new cjs.Rectangle(-377,-37.6,754.1,83.80000000000001), null);


(lib.gacha_purple_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.gacha_purple();
	this.instance.parent = this;
	this.instance.setTransform(-63,-63);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-63,-63,126,126);


(lib.gacha_green_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.gacha_green();
	this.instance.parent = this;
	this.instance.setTransform(-62.5,-63);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-62.5,-63,125,126);


(lib.emptybtn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#66FFFF").s().p("As4Q4Qj/AAAAj/IAA5xQAAj/D/AAIZxAAQD/AAAAD/IAAZxQAAD/j/AAg");
	this.shape._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(3).to({_off:false},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-108,-108,216,216);


(lib.btn_bg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.button_bg();
	this.instance.parent = this;
	this.instance.setTransform(-28.5,-18.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.btn_bg, new cjs.Rectangle(-28.5,-18.5,57,37), null);


(lib.bg_ground = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#1B222F").s().p("Egn/AoAMAAAhP/MBP/AAAMAAABP/g");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-256,-256,512,512);


(lib.pannel_set = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_1 = function() {
		this.pannel_ball.rotation += 1;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(1).call(this.frame_1).wait(1));

	// pannel_fingger
	this.instance = new lib.pannel_fingger_1("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(5,33.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2));

	// Layer_2
	this.instance_1 = new lib.shadow_1("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(-5.5,-8.4);
	this.instance_1.alpha = 0.1992;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(2));

	// pannel_gacha
	this.pannel_ball = new lib.pannel_gacha_1();
	this.pannel_ball.name = "pannel_ball";
	this.pannel_ball.parent = this;
	this.pannel_ball.setTransform(-11,-40.5);

	this.timeline.addTween(cjs.Tween.get(this.pannel_ball).wait(2));

	// pannel_body
	this.instance_2 = new lib.pannel_body_1("synched",0);
	this.instance_2.parent = this;
	this.instance_2.setTransform(0,49.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-124,-129.5,248,259);


(lib.item = function(index,mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{start:1});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		var selected_mark = this.item_selected;
		var items_tip = this.parent.parent.parent.parent.items_tip;
		var myTransform;
		if(items_tip.length == 1){
			myTransform = this.parent.parent.gacha_ball_single;
		}else{
			myTransform = eval("this.parent.parent.gacha_ball" + index);
		}
		var item_tip = this.parent.parent.item_tip;
		var item_tip_txt;
		
		if(this.parent.parent.parent.parent.name == null){
			if(items_tip.length == 1){
				item_tip_txt = items_tip[0];
			}else{
				item_tip_txt = items_tip[index];
			}
		}
		this.MouseOver = function (event) {
			var transx = 200;
			var transy = -70;
			if (index != 0 && index % 3 == 0) {
				transx = -200;
			}
			item_tip.textBox.text = item_tip_txt;
			selected_mark.alpha = 0.5;
			item_tip.alpha = 1;
			item_tip.x = myTransform.x + transx;
			item_tip.y = myTransform.y + transy;
		}
		
		this.MouseOut = function (event) {
			selected_mark.alpha = 0;
			item_tip.alpha = 0;
		}
		// console.log("a" + this.emptyBtn.x);
		this.emptyBtn.addEventListener("mouseover", this.MouseOver);
		this.emptyBtn.addEventListener("mouseout", this.MouseOut);
	}
	this.frame_2 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

	// Layer_2
	this.emptyBtn = new lib.emptybtn();
	this.emptyBtn.name = "emptyBtn";
	this.emptyBtn.parent = this;
	new cjs.ButtonHelper(this.emptyBtn, 0, 1, 2, false, new lib.emptybtn(), 3);

	this.timeline.addTween(cjs.Tween.get(this.emptyBtn).wait(3));

	// item_selected
	this.item_selected = new lib.item_selected();
	this.item_selected.name = "item_selected";
	this.item_selected.parent = this;
	this.item_selected.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.item_selected).wait(3));

	// mask_idn (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AquOEQjVAAAAjVIAA1dQAAjVDVAAIVdAAQDVAAAADVIAAVdQAADVjVAAg");
	mask.setTransform(0.0161,-0.0195);

	// item_image_256
	switch (index) {
		case 0:
			this.instance = new lib.item_0();
			break;
		case 1:
			this.instance = new lib.item_1();
			break;
		case 2:
			this.instance = new lib.item_2();
			break;
		case 3:
			this.instance = new lib.item_3();
			break;
		case 4:
			this.instance = new lib.item_4();
			break;
		case 5:
			this.instance = new lib.item_5();
			break;
		case 6:
			this.instance = new lib.item_6();
			break;
		case 7:
			this.instance = new lib.item_7();
			break;
		case 8:
			this.instance = new lib.item_8();
			break;
		case 9:
			this.instance = new lib.item_9();
			break;
		default:
			this.instance = new lib.item_0();
			break;
	}
	this.instance.parent = this;
	this.instance.setTransform(-90,-90,0.7031,0.7031);

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(3));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-108,-108,216,216);


(lib.gacha_ball_rotation = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{yellow:0,green:1,purple:2});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}
	this.frame_2 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1));

	// gacha_purple
	this.instance = new lib.gacha_purple_1("synched",0);
	this.instance.parent = this;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2).to({_off:false},0).wait(1));

	// gacha_green
	this.instance_1 = new lib.gacha_green_1("synched",0);
	this.instance_1.parent = this;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({_off:false},0).to({_off:true},1).wait(1));

	// gacha_yellow
	this.instance_2 = new lib.gacha_yellow_1();
	this.instance_2.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({_off:true},1).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-63,-63,126,126);


(lib.gacha_ball = function(index,mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{ready:0,alpha0:1,OpenGacha:2});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_1 = function() {
		this.stop();
	}
	this.frame_2 = function() {
		this.item.gotoAndPlay("play");
	}
	this.frame_5 = function() {
		//this.parent.rotation = 0;
		this.parent.SetRotation(this);
	}
	this.frame_17 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(3).call(this.frame_5).wait(12).call(this.frame_17).wait(1));

	// item
	this.item = new lib.item(index);
	this.item.name = "item";
	this.item.parent = this;
	this.item.setTransform(0,0,1.2,1.2);
	this.item.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.item).wait(5).to({alpha:1},0).to({scaleX:1,scaleY:1},12,cjs.Ease.get(1)).wait(1));

	// gacha_purple
	this.ballSet = new lib.gacha_ball_rotation();
	this.ballSet.name = "ballSet";
	this.ballSet.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.ballSet).wait(1).to({alpha:0},0).wait(1).to({alpha:1},0).to({scaleX:0.8,scaleY:0.8},2).to({_off:true},1).wait(13));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-126.1,-126.1,252.3,252.3);


(lib.btn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.MouseClick = function(event){
			window.dispatchEvent(new CustomEvent("confirm"));
		}
	}
	this.frame_19 = function() {
		this.addEventListener("click", this.MouseClick);
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(19).call(this.frame_19).wait(1));

	// Layer_2
	this.instance = new lib.ok_text();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.8539,0.8539);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(10).to({alpha:1},0).to({scaleX:1.1583,scaleY:1.1583},2).to({scaleX:1,scaleY:1},7).wait(1));

	// Layer_1
	this.instance_1 = new lib.btn_bg();
	this.instance_1.parent = this;
	this.instance_1.setTransform(0,0,0.8088,0.8088);
	this.instance_1.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(10).to({alpha:1},0).to({scaleX:1.0498,scaleY:1.0498},2).to({scaleX:1,scaleY:1},7,cjs.Ease.get(1)).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-29.9,-19.4,59.8,38.8);


(lib.machine_gacha_display = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"ready":0,"start":1});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_18 = function() {
		this.gotoAndStop(0);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(18).call(this.frame_18).wait(1));

	// display_ball9
	this.display_ball9 = new lib.gacha_ball();
	this.display_ball9.name = "display_ball9";
	this.display_ball9.parent = this;
	this.display_ball9.setTransform(6.1,-65,0.9993,0.9993,-168.182);

	this.timeline.addTween(cjs.Tween.get(this.display_ball9).to({regY:0.1,rotation:-155.773,x:6.15,y:-79.25},8,cjs.Ease.get(-1)).to({regY:0,rotation:-168.182,x:6.1,y:-65},9,cjs.Ease.get(-1)).wait(2));

	// display_ball8
	this.display_ball8 = new lib.gacha_ball();
	this.display_ball8.name = "display_ball8";
	this.display_ball8.parent = this;
	this.display_ball8.setTransform(-128.4,79.05,0.9984,0.9984,-46.9094);

	this.timeline.addTween(cjs.Tween.get(this.display_ball8).to({regX:-0.2,regY:-0.1,rotation:-62.6572,x:-128.6,y:85.3},6,cjs.Ease.get(-1)).to({regX:0,regY:0,rotation:-46.9094,x:-128.4,y:79.05},8,cjs.Ease.get(-1)).wait(5));

	// display_ball7
	this.display_ball7 = new lib.gacha_ball();
	this.display_ball7.name = "display_ball7";
	this.display_ball7.parent = this;
	this.display_ball7.setTransform(138.05,95.05,0.9991,0.9991,-17.0758);

	this.timeline.addTween(cjs.Tween.get(this.display_ball7).to({regY:0.1,rotation:1.8949,y:86.65},9,cjs.Ease.get(-1)).to({regY:0,rotation:-17.0758,y:95.05},8,cjs.Ease.get(-1)).wait(2));

	// display_ball6
	this.display_ball6 = new lib.gacha_ball();
	this.display_ball6.name = "display_ball6";
	this.display_ball6.parent = this;
	this.display_ball6.setTransform(-138.05,-11.1,0.9984,0.9984,51.4221);

	this.timeline.addTween(cjs.Tween.get(this.display_ball6).to({scaleX:0.9983,scaleY:0.9983,rotation:35.6347,x:-138.1,y:1.55},8,cjs.Ease.get(-1)).to({scaleX:0.9984,scaleY:0.9984,rotation:51.4221,x:-138.05,y:-11.1},9,cjs.Ease.get(-1)).wait(2));

	// display_ball5
	this.display_ball5 = new lib.gacha_ball();
	this.display_ball5.name = "display_ball5";
	this.display_ball5.parent = this;
	this.display_ball5.setTransform(138.6,10.5,0.9984,0.9984,50.1631);

	this.timeline.addTween(cjs.Tween.get(this.display_ball5).to({rotation:22.4231,y:-10.9},7,cjs.Ease.get(-1)).to({rotation:50.1631,y:10.5},8,cjs.Ease.get(-1)).wait(4));

	// display_ball4
	this.display_ball4 = new lib.gacha_ball();
	this.display_ball4.name = "display_ball4";
	this.display_ball4.parent = this;
	this.display_ball4.setTransform(95.05,-79.1,0.9984,0.9984,-50.4192,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.display_ball4).to({regY:0,rotation:-22.4221,x:95,y:-61.65},5,cjs.Ease.get(-1)).to({regY:0.1,rotation:-50.4192,x:95.05,y:-79.1},11,cjs.Ease.get(-0.02)).wait(3));

	// display_ball3
	this.display_ball3 = new lib.gacha_ball();
	this.display_ball3.name = "display_ball3";
	this.display_ball3.parent = this;
	this.display_ball3.setTransform(40.6,14.9,0.9987,0.9987,-115.2942,0,0,-0.1,0.2);

	this.timeline.addTween(cjs.Tween.get(this.display_ball3).to({regX:-0.2,rotation:-147.0767,x:40.55,y:36.25},9,cjs.Ease.get(-1)).to({regX:-0.1,rotation:-115.2942,x:40.6,y:14.9},9,cjs.Ease.get(-1)).wait(1));

	// display_ball2
	this.display_ball2 = new lib.gacha_ball();
	this.display_ball2.name = "display_ball2";
	this.display_ball2.parent = this;
	this.display_ball2.setTransform(-53.9,-11.05);

	this.timeline.addTween(cjs.Tween.get(this.display_ball2).to({rotation:-44.2241,y:-4.3},6,cjs.Ease.get(-1)).to({rotation:0,y:-11.05},10,cjs.Ease.get(-1)).wait(3));

	// display_ball1
	this.display_ball1 = new lib.gacha_ball();
	this.display_ball1.name = "display_ball1";
	this.display_ball1.parent = this;
	this.display_ball1.setTransform(-84.9,-95.05,0.999,0.999,-70.9775);

	this.timeline.addTween(cjs.Tween.get(this.display_ball1).to({regX:0.1,regY:-0.2,rotation:-60.9731,x:-84.95,y:-112.55},9,cjs.Ease.get(-1)).to({regX:0,regY:0,rotation:-70.9775,x:-84.9,y:-95.05},9,cjs.Ease.get(-1)).wait(1));

	// display_ball0
	this.display_ball0 = new lib.gacha_ball();
	this.display_ball0.name = "display_ball0";
	this.display_ball0.parent = this;
	this.display_ball0.setTransform(-28.2,83.6,0.9986,0.9986,31.1028,0,0,-0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.display_ball0).to({scaleX:0.9985,scaleY:0.9985,rotation:5.6065,x:-27,y:75.75},7,cjs.Ease.get(-1)).to({scaleX:0.9986,scaleY:0.9986,rotation:31.1028,x:-28.2,y:83.6},8,cjs.Ease.get(-1)).wait(4));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-310.1,-278.3,620.7,530.3);


(lib.machine = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"ready":0,"start":1});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		
		this.SetRotation = function(object){
			object.rotation = 0;
		}
	}
	this.frame_42 = function() {
		if(this.parent.parent.items_tip.length == 1){
			this.gacha_ball_single.gotoAndPlay("OpenGacha");
			
		}else{
			for(var i =0;i < this.parent.parent.items_tip.length;i++){
				this.parent.parent.gacha_ball[i].gotoAndPlay("OpenGacha");
			}
		}
	}
	this.frame_43 = function() {
		this.stop();
	}
	this.frame_44 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(42).call(this.frame_42).wait(1).call(this.frame_43).wait(1).call(this.frame_44).wait(7));

	// btn_ok
	this.okbtn = new lib.btn();
	this.okbtn.name = "okbtn";
	this.okbtn.parent = this;
	this.okbtn.setTransform(5.3,1744.85,2.5,2.4999);
	this.okbtn._off = true;

	this.btn = new lib.btn();
	this.btn.name = "btn";
	this.btn.parent = this;
	this.btn.setTransform(5.3,1744.9,2.9998,2.9999);
	this.btn._off = true;

	this.timeline.addTween(cjs.Tween.get(this.okbtn).wait(43).to({_off:false},0).to({_off:true,scaleX:2.9998,scaleY:2.9999,y:1744.9},2).wait(6));
	this.timeline.addTween(cjs.Tween.get(this.btn).wait(43).to({_off:false},2).to({scaleX:2.89,scaleY:2.89,x:5.35,y:1744.85},5).wait(1));

	// item_description
	this.item_tip = new lib.item_tip();
	this.item_tip.name = "item_tip";
	this.item_tip.parent = this;
	this.item_tip.setTransform(0,-0.05);
	this.item_tip.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.item_tip).to({_off:true},48).wait(3));

	// lever_png
	this.instance = new lib.laver();
	this.instance.parent = this;
	this.instance.setTransform(13,85);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({rotation:180},9,cjs.Ease.get(1)).to({_off:true},38).wait(3));

	// machine_body_down_door_cut
	this.instance_1 = new lib.machine_body_down_door_cut_1();
	this.instance_1.parent = this;
	this.instance_1.setTransform(8.55,113.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:true},48).wait(3));

	// gacha_ball_single
	this.gacha_ball_single = new lib.gacha_ball(0);
	this.gacha_ball_single.name = "gacha_ball_single";
	this.gacha_ball_single.parent = this;
	this.gacha_ball_single.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball_single).wait(11).to({regX:0.1,regY:0.1,scaleX:0.9999,scaleY:0.9999,rotation:-148.7644,x:0.15,y:1234.65},27,cjs.Ease.get(1)).to({_off:true},10).wait(3));

	// gacha_ball9
	this.gacha_ball9 = new lib.gacha_ball(9);
	this.gacha_ball9.name = "gacha_ball9";
	this.gacha_ball9.parent = this;
	this.gacha_ball9.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball9).wait(12).to({x:0,y:90.15},0).to({scaleX:0.9999,scaleY:0.9999,rotation:159.2955,guide:{path:[0.1,90.3,-2.7,723.4,154.5,1315.3,157.5,1326.9,160.7,1338.4,187.2,1436.3,218.1,1533]}},27,cjs.Ease.get(1)).to({_off:true},9).wait(3));

	// gacha_ball8
	this.gacha_ball8 = new lib.gacha_ball(8);
	this.gacha_ball8.name = "gacha_ball8";
	this.gacha_ball8.parent = this;
	this.gacha_ball8.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball8).wait(12).to({regX:0.1,regY:0.1,scaleX:0.9998,scaleY:0.9998,x:-0.1,y:1533},27,cjs.Ease.get(1)).to({_off:true},9).wait(3));

	// gacha_ball7
	this.gacha_ball7 = new lib.gacha_ball(7);
	this.gacha_ball7.name = "gacha_ball7";
	this.gacha_ball7.parent = this;
	this.gacha_ball7.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball7).wait(12).to({x:0,y:90.2},0).to({scaleX:0.9999,scaleY:0.9999,rotation:-110.7057,guide:{path:[0,90.2,40.8,620.8,-58.3,973.2,-157.2,1325.8,-169.7,1379.9,-182.2,1434.1,-217,1532.9]}},27,cjs.Ease.get(1)).to({_off:true},9).wait(3));

	// gacha_ball6
	this.gacha_ball6 = new lib.gacha_ball(6);
	this.gacha_ball6.name = "gacha_ball6";
	this.gacha_ball6.parent = this;
	this.gacha_ball6.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball6).wait(11).to({x:0,y:90.15},0).to({regX:0.1,regY:0.1,scaleX:0.9999,scaleY:0.9999,rotation:129.2949,guide:{path:[0.1,90.3,172.2,1030.6,196.3,1136.6,220.4,1242.5,218.9,1272.7,217.3,1302.7,218.3,1305.7]}},27,cjs.Ease.get(1)).to({_off:true},10).wait(3));

	// gacha_ball5
	this.gacha_ball5 = new lib.gacha_ball(5);
	this.gacha_ball5.name = "gacha_ball5";
	this.gacha_ball5.parent = this;
	this.gacha_ball5.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball5).wait(11).to({regX:0.1,regY:0.1,scaleX:0.9999,scaleY:0.9999,rotation:-148.7644,x:0.15,y:1305.65},27,cjs.Ease.get(1)).to({_off:true},10).wait(3));

	// gacha_ball4
	this.gacha_ball4 = new lib.gacha_ball(4);
	this.gacha_ball4.name = "gacha_ball4";
	this.gacha_ball4.parent = this;
	this.gacha_ball4.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball4).wait(11).to({x:0,y:90.15},0).to({regX:0.1,regY:0.1,scaleX:0.9999,scaleY:0.9999,rotation:-65.7059,guide:{path:[0,90.3,106.7,608.7,-47.5,874.6,-201.6,1140.5,-208.7,1221.7,-215.8,1302.8,-216.9,1305.9]}},27,cjs.Ease.get(1)).to({_off:true},10).wait(3));

	// gacha_ball3
	this.gacha_ball3 = new lib.gacha_ball(3);
	this.gacha_ball3.name = "gacha_ball3";
	this.gacha_ball3.parent = this;
	this.gacha_ball3.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball3).wait(9).to({x:0,y:90.15},0).to({regX:0.1,regY:0.1,scaleX:0.9999,scaleY:0.9999,rotation:69.2943,guide:{path:[0.1,90.2,47.4,863.2,218.2,1061.9]}},28,cjs.Ease.get(1)).to({_off:true},11).wait(3));

	// gacha_ball2
	this.gacha_ball2 = new lib.gacha_ball(2);
	this.gacha_ball2.name = "gacha_ball2";
	this.gacha_ball2.parent = this;
	this.gacha_ball2.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball2).wait(9).to({scaleX:0.9999,scaleY:0.9999,rotation:159.2955,x:0.1,y:1061.95},28,cjs.Ease.get(1)).to({_off:true},11).wait(3));

	// gacha_ball1
	this.gacha_ball1 = new lib.gacha_ball(1);
	this.gacha_ball1.name = "gacha_ball1";
	this.gacha_ball1.parent = this;
	this.gacha_ball1.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball1).wait(9).to({x:0,y:90.15},0).to({scaleX:0.9998,scaleY:0.9998,rotation:-118.6686,guide:{path:[0,90.3,-83,963.4,-217.1,1062]}},28,cjs.Ease.get(1)).to({_off:true},11).wait(3));

	// gacha_ball0
	this.gacha_ball0 = new lib.gacha_ball(0);
	this.gacha_ball0.name = "gacha_ball0";
	this.gacha_ball0.parent = this;
	this.gacha_ball0.setTransform(7.85,88.95);

	this.timeline.addTween(cjs.Tween.get(this.gacha_ball0).wait(9).to({regX:0.1,regY:0.1,scaleX:0.9999,scaleY:0.9999,rotation:9.2941,x:0.1,y:838.8},28,cjs.Ease.get(1)).to({_off:true},11).wait(3));

	// machine_body_down_dish
	this.instance_2 = new lib.machine_body_down_dish_1();
	this.instance_2.parent = this;
	this.instance_2.setTransform(8.55,307.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({_off:true},48).wait(3));

	// machine_body_down
	this.instance_3 = new lib.machine_body_down_1("synched",0);
	this.instance_3.parent = this;
	this.instance_3.setTransform(0,163);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({_off:true},48).wait(3));

	// pannel_set
	this.pannel = new lib.pannel_set();
	this.pannel.name = "pannel";
	this.pannel.parent = this;
	this.pannel.setTransform(3,-393.6);

	this.timeline.addTween(cjs.Tween.get(this.pannel).to({_off:true},48).wait(3));

	// machine_body_cap
	this.instance_4 = new lib.machine_body_cap_1();
	this.instance_4.parent = this;
	this.instance_4.setTransform(2,-335.55);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({_off:true},48).wait(3));

	// machine_glass
	this.instance_5 = new lib.machine_glass_1("synched",0);
	this.instance_5.parent = this;
	this.instance_5.setTransform(2.5,-83);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).to({_off:true},48).wait(3));

	// machine_gacha_display
	this.gacha_display = new lib.machine_gacha_display();
	this.gacha_display.name = "gacha_display";
	this.gacha_display.parent = this;
	this.gacha_display.setTransform(3.95,-45.5);

	this.timeline.addTween(cjs.Tween.get(this.gacha_display).to({_off:true},48).wait(3));

	// machine_body_back
	this.instance_6 = new lib.machine_body_back_1();
	this.instance_6.parent = this;
	this.instance_6.setTransform(3.5,-71.55);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({_off:true},48).wait(3));

	// machine_body_upper
	this.instance_7 = new lib.machine_body_upper_1("synched",0);
	this.instance_7.parent = this;
	this.instance_7.setTransform(2,-134.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({_off:true},48).wait(3));

	// ground
	this.instance_8 = new lib.bg_ground("synched",0);
	this.instance_8.parent = this;
	this.instance_8.setTransform(0,1209.6,2.8777,3.8633);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).to({_off:true},48).wait(3));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-736.7,-523.1,1473.4,2721.7);


(lib.camera = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"ready":0,CameraWork:1});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}
	this.frame_39 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(39).call(this.frame_39).wait(1));

	// text
	this.gacha_text = new lib.gacha_text();
	this.gacha_text.name = "gacha_text";
	this.gacha_text.parent = this;
	this.gacha_text.setTransform(0,430.3);

	this.timeline.addTween(cjs.Tween.get(this.gacha_text).wait(1).to({scaleX:0.9629,scaleY:0.9629},0).to({regY:0.1,scaleX:1.05,scaleY:1.05,alpha:0},6,cjs.Ease.get(1)).to({_off:true},1).wait(32));

	// machine
	this.machine = new lib.machine();
	this.machine.name = "machine";
	this.machine.parent = this;
	this.machine.setTransform(-0.05,0);

	this.timeline.addTween(cjs.Tween.get(this.machine).wait(15).to({y:-1295.2},24,cjs.Ease.get(1)).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-736.8,-1818.2,1473.5,4016.8);


// stage content:
(lib.FinggerGacha = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		var gacha_camera = this.camera;
		var gacha_machine = this.camera.machine;
		var gacha_display = this.camera.machine.gacha_display;
		var gachaInfo = {
			tips:[0,1,2,0,1,2,0,1,2,0]
			}
		this.items_tip=[];
		this.gacha_ball = [
		this.camera.machine.gacha_ball0
		,this.camera.machine.gacha_ball1
		,this.camera.machine.gacha_ball2
		,this.camera.machine.gacha_ball3
		,this.camera.machine.gacha_ball4
		,this.camera.machine.gacha_ball5
		,this.camera.machine.gacha_ball6
		,this.camera.machine.gacha_ball7
		,this.camera.machine.gacha_ball8
		,this.camera.machine.gacha_ball9
		];
		
		var gacha_ball = this.gacha_ball;
		
		var display_ball = [
		this.camera.machine.gacha_display.display_ball0
		,this.camera.machine.gacha_display.display_ball1
		,this.camera.machine.gacha_display.display_ball2
		,this.camera.machine.gacha_display.display_ball3
		,this.camera.machine.gacha_display.display_ball4
		,this.camera.machine.gacha_display.display_ball5
		,this.camera.machine.gacha_display.display_ball6
		,this.camera.machine.gacha_display.display_ball7
		,this.camera.machine.gacha_display.display_ball8
		,this.camera.machine.gacha_display.display_ball9
		];
		
		var gachaData;
		
		this.SetDisplay = function(){
			for(var i =0;i < display_ball.length;i++){
				var randomColor = Math.round(Math.random()*4);
				display_ball[i].ballSet.rotation = Math.random()*360;
				display_ball[i].ballSet.gotoAndStop(randomColor);
			}
		}
		
		this.StartGacha = function(gachaData){
			gachaInfo = gachaData;
			gacha_machine.gotoAndPlay("start");
			gacha_camera.gotoAndPlay("CameraWork");
			gacha_display.gotoAndPlay(1);
			
			//一旦全部隠す
			this.camera.machine.gacha_ball_single.gotoAndStop(1);
			for(var i =0 ; i<10;i++){
				gacha_ball[i].gotoAndStop(1);
			}
			
			if(gachaData.tips.length == 1){
				this.camera.machine.gacha_ball_single.gotoAndStop(0);
				this.camera.machine.gacha_ball_single.ballSet.rotation = Math.random()*360;
				this.camera.machine.gacha_ball_single.ballSet.gotoAndStop(Math.round(Math.random()*3));
			}else{
				for(var i =0 ; i<gachaData.tips.length;i++){
						gacha_ball[i].gotoAndStop(0);
						gacha_ball[i].ballSet.rotation = Math.random()*360;
						gacha_ball[i].ballSet.gotoAndStop(Math.round(Math.random()*3));
					}
			}
			
			this.items_tip = gachaData.tips;
		}
		
		this.Reset = function(){
			this.gotoAndPlay(0);
			this.camera.gotoAndStop("ready");
			this.camera.machine.gotoAndStop("ready");
		}
	}
	this.frame_1 = function() {
		this.SetDisplay();
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1));

	// camera
	this.camera = new lib.camera();
	this.camera.name = "camera";
	this.camera.parent = this;
	this.camera.setTransform(318.3,405.65,0.5,0.5,0,0,0,0.2,0.2);

	this.timeline.addTween(cjs.Tween.get(this.camera).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(269.9,504,416.6,1000.8);
// library properties:
lib.properties = {
	id: '1F84C6F134A1934282BA3FC0162A47B5',
	width: 640,
	height: 720,
	fps: 30,
	color: "#333F53",
	opacity: 1.00,
	preloads: []
};

// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['1F84C6F134A1934282BA3FC0162A47B5'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;