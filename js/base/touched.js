//2018.10.6
(function() {
	$.event.special.touched = {
		setup: function() {
			var _this = $(this);
			var _timer;
			var _timerStart;
			var _timerSpace=800;
			_this.one("touchstart", _this_touchstart);
			function _this_touchstart(e){
				_timer=setTimeout(_this_touchlong,_timerSpace);
				_timerStart=new Date().getTime();
				_this.one("touchmove",_this_touchmove).one("touchend",_this_touchend);
			}//end func
			function _this_touchmove(e) {
				clearTimeout(_timer);
				_this.off("touchend",_this_touchend).one("touchstart", _this_touchstart);
			}//end func
			function _this_touchend(e) {
				clearTimeout(_timer);
				if(new Date().getTime()-_timerStart>=_timerSpace) _this.trigger("touchedlong");
				_this.off("touchmove",_this_touchmove).one("touchstart", _this_touchstart);
				_this.trigger("touched");
			}//end func
			function _this_touchlong(){
				_this.trigger("touchlong");
			}//edn func
		}//end setup
	};
	$.each({
		touchlong: "touched",
		touchedlong: "touched"
	}, function(e, sourceEvent) {
		$.event.special[e] = {
			setup: function() {
				$(this).on(sourceEvent, $.noop);
			}
		}
	});
})();