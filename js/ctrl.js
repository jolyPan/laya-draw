function Ctrl(options){
	var ctrl={};
	var defaults = {touchMuti:true,onCtrl:function(){},onRemove:function(){}};
	var opts=$.extend(defaults, options);
	var canvasBox=$('#layaCanvas');
	var windowScale=window.innerWidth/750;
	var canvasScale=2;
	var boundBox=$('#layerBound');
	var btnRemove=$('#layerRemove');
	var btnResize=$('#layerResize');
	var btnRotate=$('#layerRotate');
	var btnTransform=$('#layerTransform');
	var touchLast=[],touchStart=[];
	var disStart=0;
	var layerLast;
	var posLast1=[],posLast2=[],disLast,disSt,rotateLast;
	ctrl.on=function(layer){
		layer.on(Laya.Event.MOUSE_DOWN, this, layer_touchstart);
		layer.on(Laya.Event.MOUSE_MOVE, this, layer_touchmove);
    layer.on(Laya.Event.MOUSE_UP, this, layer_touchend);
		if(btnTransform.length>0){
			if(btnResize.length>0) btnResize.remove();
			if(btnRotate.length>0) btnRotate.remove();
		}//end if
		control_on(layer);
	}//edn func
	
	ctrl.resize=layer_resize;
	ctrl.show=control_show;
	ctrl.hide=control_hide;
	
	//--------------------------------------layer event-------------------
	function layer_touchstart(e){
//		console.log(e.nativeEvent);
//		console.log(e.nativeEvent.type);
		var layer=e.target;
		if(layer._transform){
			if(e.nativeEvent.type=="mousedown"){
				if(layerLast!=layer){
					if(layerLast) layerLast.zOrder=0;
				}//edn if
				layer.zOrder=1;
				layerLast=layer;
				control_on(layer);
				posLast1=[e.nativeEvent.clientX*canvasScale,e.nativeEvent.clientY*canvasScale];
			}//edn if
			else if(e.nativeEvent.type=="touchstart"){
				if(e.touches.length==1){
					if(layerLast!=layer){
						if(layerLast) layerLast.zOrder=0;
					}//edn if
					layer.zOrder=1;
					layerLast=layer;
					control_on(layer);
					posLast1=[e.touches[0].clientX*canvasScale,e.touches[0].clientY*canvasScale];
				}//edn if
				else if(e.touches.length==2 && opts.touchMuti){
					posLast1=[e.touches[0].clientX*canvasScale,e.touches[0].clientY*canvasScale];
					posLast2=[e.touches[1].clientX*canvasScale,e.touches[1].clientY*canvasScale];
					rotateLast=imath.getDeg(posLast1,posLast2);
					disLast=imath.getDis(posLast1,posLast2);
				}//end if
			}//edn else
		}//end if
	}//end func
	
	function layer_touchmove(e){
//		console.log(e.nativeEvent);
//		console.log(e.nativeEvent.type);
		var layer=layerLast;
		if(layer._transform){
			if(e.nativeEvent.type=="mousemove"){
				var pos1=[e.nativeEvent.clientX*canvasScale,e.nativeEvent.clientY*canvasScale];
				var offsetX=pos1[0]-posLast1[0];
				var offsetY=pos1[1]-posLast1[1];
				layer.pos(layer.x+offsetX,layer.y+offsetY);
			}//edn if
			else if(e.nativeEvent.type=="touchmove"){
				var pos1=[e.touches[0].clientX*canvasScale,e.touches[0].clientY*canvasScale];
				var offsetX=pos1[0]-posLast1[0];
				var offsetY=pos1[1]-posLast1[1];
				layer.pos(layer.x+offsetX,layer.y+offsetY);
				if(e.touches.length==2 && opts.touchMuti){
					var pos2=[e.touches[1].clientX*canvasScale,e.touches[1].clientY*canvasScale];
					var dis=imath.getDis(pos1,pos2)/canvasScale*0.25;
					if(Math.abs(dis-disLast)>0.5){
						var scaleOffset=0.025*(dis-disLast)/Math.abs(dis-disLast);
						var scale=layer.scaleX+scaleOffset;
						layer_resize(layer,scale,scale);
					}//end if
					var rotate=imath.getDeg(pos1,pos2);
					var rotateoffset=rotate-rotateLast;
					layer.rotation+=rotateoffset;
					posLast2[0]=pos2[0];
					posLast2[1]=pos2[1];
					rotateLast=rotate;
					disLast=dis;
				}//end if
			}//edn if
			posLast1[0]=pos1[0];
			posLast1[1]=pos1[1];
			control_show(layer);
		}//edn if
	}//end func
	
	function layer_touchend(e){
	}//edn func
	
	//------------------------------------layer ctrl
	function control_on(layer){
		if(boundBox.length>0) boundBox.show();
		if(btnRemove.length>0) btnRemove.off().one('touchend',{layer:layer},btnRemove_click);
		if(btnTransform.length>0) btnTransform.off().one('touchstart',{layer:layer},btnTransform_touchstart);
		else{
			if(btnResize.length>0) btnResize.off().one('touchstart',{layer:layer},btnResize_touchstart);
			if(btnRotate.length>0) btnRotate.off().one('touchstart',{layer:layer},btnRotate_touchstart);
		}//end else
		control_show(layer);
		opts.onCtrl(layer);
	}//edn func
	
	function control_hide(){
   		if(boundBox.length>0) boundBox.hide();
   		if(btnRemove.length>0) btnRemove.hide().off();
   		if(btnTransform.length>0) btnTransform.hide().off();
		else{
			if(btnResize.length>0) btnResize.hide().off();
   			if(btnRotate.length>0) btnRotate.hide().off();
		}//end else
   	}//edn func
   	
   	function control_show(layer){
    var posRemove = offset_math(layer,(layer.radioDegree - 90) * 2 - layer.radioDegree + layer.rotation);
		var posResize=offset_math(layer,-layer.radioDegree);
		var posRotate=offset_math(layer, layer.radioDegree + layer.rotation);
		var posTransform=offset_math(layer, layer.radioDegree + layer.rotation);
		var x=(layer.x-layer.width*0.5) / canvasScale+canvasBox.offset().left;
		var y=(layer.y-layer.height*0.5) / canvasScale+canvasBox.offset().top;
		var width=layer.width / canvasScale;
		var height=layer.height / canvasScale;
		if(boundBox.length>0) boundBox.show().css({x:x,y:y,width:width,height:height,rotate:layer.rotation});
		if(btnRemove.length>0) btnRemove.show().css({x:posRemove[0],y:posRemove[1],rotate:layer.rotation});
		if(btnResize.length>0) btnResize.show().css({x:posResize[0],y:posResize[1]});
		if(btnRotate.length>0) btnRotate.show().css({x:posRotate[0],y:posRotate[1],rotate:layer.rotation});
		if(btnTransform.length>0) btnTransform.show().css({x:posTransform[0],y:posTransform[1]});
   	}//end func
   	
     function offset_math(layer, deg) {
      var rX = (layer.width * 0.5) / canvasScale /Math.cos(imath.toRadian(layer.radioDegree));//获得layer的x半径
      var rY = (layer.height * 0.5) /canvasScale /Math.sin(imath.toRadian(layer.radioDegree));//获得layer的y半径
      var oftX = rX * Math.cos(imath.toRadian(deg));//获得相对于中心点的deg角度的x位置
      var oftY = rY * Math.sin(imath.toRadian(deg));//获得对于中心点的deg角度的y位置
      var x = layer.x / canvasScale + oftX + canvasBox.offset().left;
      var y = layer.y / canvasScale + oftY + canvasBox.offset().top;
      return [x, y];
    } //end func
	//--------------remove
	function btnRemove_click(e){
		var layer=e.data.layer;
		if(layer && layer._transform){
			layer.offAll();
			layer.destroy();
			layer=null;
		}//edn if
		control_hide();
		opts.onRemove();
	}//end func
	
	//--------------rotate
	function btnRotate_touchstart(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		btnRotateTouchstart(e);
		$(this).on('touchmove',{layer:e.data.layer},btnRotate_touchmove).one('touchend',{layer:e.data.layer},btnRotate_touchend);
	}//end func
	
	function btnRotateTouchstart(e){
		var layer=e.data.layer;
		var pos=[e.originalEvent.touches[0].clientX-canvasBox.offset().left,e.originalEvent.touches[0].clientY-canvasBox.offset().top];
		touchStart=[layer.x/canvasScale,layer.y/canvasScale];
		layer.rotateLast=layer.rotation;
		layer.rotateStart=imath.getDeg(touchStart,pos);
	}//edn func
	
	function btnRotate_touchmove(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		btnRotateTouchmove(e);
	}//end func
	
	function btnRotateTouchmove(e,layer){
		var layer=e.data.layer;
		var pos=[e.originalEvent.touches[0].clientX-canvasBox.offset().left,e.originalEvent.touches[0].clientY-canvasBox.offset().top];
		var rotate=imath.getDeg(touchStart,pos);
		layer.rotation=layer.rotateLast+imath.getDeg(touchStart,pos)-layer.rotateStart;
		control_show(layer);
	}//end func
	
	function btnRotate_touchend(e){
		btnRotateTouchend(e);
		$(this).off('touchmove').one('touchstart',{layer:e.data.layer},btnRotate_touchstart);
	}//end func
	
	function btnRotateTouchend(e){
		var layer=e.data.layer;
		layer.rotateStart=layer.rotation;
	}//end func
	
	//--------------resize
	function btnResize_touchstart(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		btnResizeTouchstart(e);
		$(this).on('touchmove',{layer:e.data.layer},btnResize_touchmove).one('touchend',{layer:e.data.layer},btnResize_touchend);
	}//end func
	
	function btnResizeTouchstart(e){
		var layer=e.data.layer;
		layer.scaleLast=layer.scaleX;
		disStart=dis_get(e);
	}//end func
	
	function btnResize_touchmove(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		btnResizeTouchmove(e);
	}//end func
	
	function btnResizeTouchmove(e){
		var layer=e.data.layer;
		var dis=dis_get(e);
		var disOffset=dis-disStart;
		var scale=layer.scaleLast*(1+disOffset/disStart);
		layer_resize(layer,scale,scale);
	}//end func
	
	function btnResize_touchend(e){
		$(this).off('touchmove').one('touchstart',{layer:e.data.layer},btnResize_touchstart);
	}//end func
	
	function layer_resize(layer,scaleX,scaleY,sizeMin){
		sizeMin=sizeMin||40;
		sizeMin=sizeMin*windowScale;
		scaleX=scaleX>2.5?2.5:scaleX;
		scaleY=scaleY>2.5?2.5:scaleY;
		var width=layer.widthOrg*scaleX; 
		var height=layer.heightOrg*scaleY;
		if( width>=sizeMin && height>=sizeMin){
			layer.width=width;
			layer.height=height;
			layer.scale(scaleX,scaleY);
			control_show(layer);
		}//edn if
	}//edn func
	
	function dis_get(e){
		var layer=e.data.layer;
		var pos=[e.originalEvent.touches[0].clientX-canvasBox.offset().left,e.originalEvent.touches[0].clientY-canvasBox.offset().top];
		var center=[layer.x/canvasScale,layer.y/canvasScale];
		var dis=imath.getDis(pos,center);
		if(pos[0]<center[0] || pos[1]>center[1]) dis=-dis;
		return dis;
	}//edn func
	
	//--------------transform
	function btnTransform_touchstart(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		btnRotateTouchstart(e);
		btnResizeTouchstart(e);
		$(this).on('touchmove',{layer:e.data.layer},btnTransform_touchmove).one('touchend',{layer:e.data.layer},btnTransform_touchend);
	}//end func
	
	function btnTransform_touchmove(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		btnRotateTouchmove(e);
		btnResizeTouchmove(e);
	}//end func
	
	function btnTransform_touchend(e){
		btnRotateTouchend(e);
		$(this).off('touchmove').one('touchstart',{layer:e.data.layer},btnTransform_touchstart);
	}//end func
	
	return ctrl;
};