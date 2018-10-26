//2016.12.22
(function($) {	
	$.fn.extend({
		bubbleOn: function(options) {	
			var $this=$(this);
			var $end=false;
			var defaults = {x:-1,y:-1,num:10,speed:2500,delay:2000,ratio:5,type:1,style:'style',roll2D:true,roll3D:true,skew:false,swing:1,swingMax:50};
			var opts = $.extend(defaults,options);
			
			init();
			
			function init(){
				$this.on('off',this_off);
				if(opts.roll3D) $this[0].style.perspective='5rem';
				box_creat();
			}//end func	
			
			function this_off(e){
				$this.off('off');
				$end=true;
			}//end func
			
			function box_creat() {
				for(var i=0; i<opts.num; i++){
					var box=$('<span><i></i></span>').appendTo($this);
					setTimeout(box_set,imath.randomRange(0,opts.delay),box);
				}//end for
			}//end func
			
			function box_set(box){
				box_new(box);
				var data={dir:imath.randomPlus()};
				var child=box.children().data(data);
				child_handler(child);
			}//edn func
			
			function box_new(box){
				if(opts.type>1) box.removeClass().hide().addClass(opts.style+imath.randomRange(1,opts.type));
				else box.show();
				var ratio=imath.randomRange(1,opts.ratio);//杩滆繎姣斾緥鍙傛暟,10 LEVEL
				if(opts.ratio>1) var scale=0.1+ratio*0.18;
				else var scale=1;
				var x_tar=imath.randomRange(0,$this.width());
				if(opts.x!=-1) var x=opts.x;
				else var x=imath.randomRange(0,$this.width());
				if(opts.y!=-1) var y=opts.y;
				else var y=$this.height();
				var y_tar=-box.height()*(1+scale);
				var deg=imath.getDeg([opts.x,opts.y],[x_tar,$this.height()]);
				var css={x:x,y:y,scale:scale};
				box.css(css).show().transition({x:x_tar,y:y_tar},imath.randomRange(opts.speed*0.7,opts.speed*2),'linear',function(){
					if(!$end){
						box.hide();
						setTimeout(box_new,imath.randomRange(0,opts.delay),box);
					}//edn if
					else box.remove();
				});
			}//end func
			
			function child_handler(child){
				var data=child.data();
				var tar={};
				if(opts.roll2D) tar.rotate='+='+imath.randomRange(-45,45)
				if(opts.swing) tar.x=data.dir*imath.randomRange(0,opts.swingMax);
				if(opts.roll3D){
					tar.rotateX=imath.randomRange(-20,20);
					tar.rotateY=imath.randomRange(-20,20);
				}//edn if
				if(opts.skew){
					tar.skewX=imath.randomRange(-15,15);
					tar.skewY=imath.randomRange(-15,15);
				}//edn if
				child.transition(tar,imath.randomRange(750,1500),'linear',function(){
					if(!$end){
						data.dir=-data.dir;
						child_handler(child);
					}//edn if
				});
			}//end func
			
		},//end fn
		bubbleOff: function() {
			$(this).triggerHandler('off');
		}//end fn
	});//end extend	
})(jQuery);//闂寘