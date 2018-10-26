$(document).ready(function() {
  //-----------------------------------------定义和初始化变量----------------------------------------
  var loadBox = $("aside.loadBox");
  var articleBox = $("article");
  var windowScale = window.innerWidth / 750;
  var canvasScale = 2;
  var UserInfo = {};
  var loading = articleBox.children(".loading"); //loading页面
  var loadPer = loading.children(".loadPer"); //loading进度
  var home = articleBox.children(".home"); //首页
  var introduction = articleBox.children(".introduction"); //第二屏
  var canvasShell = articleBox.children(".draw"); //绘制页
  var share = $(".share"); //分享页面
  var lottery = $(".lottery"); //抽奖页面
  var layaBg; //laya背景全局变量
  var Scroll_E,
    zindex = 0,
    layerNum = 0,
    iCtrl,
    layaShell,
    layerNow; //场景页滚动
  var shareLetters = {};
  var $src = "http://cdn.h5-x.com/gravitation/images/draw/element";
  var $title_switch = 4;
  //----------------------------------------页面初始化----------------------------------------
  icom.init(init); //初始化
  icom.screenScrollUnable(); //如果是一屏高度项目且在ios下，阻止屏幕默认滑动行为
  icom.iphoneXBar(); //为iphoneX底下加入homebar的安全高度

  function init() {
    //  	loadBox.show();
    if (window.iAd)
        // iAd.Login.localStorage(userGetted); //用来获得微信个人信息和通过JSSDK验证
    sound_handler();
    requestAnimationFrame(function() {
      load_handler();
    });
  } //edn func

  //----------------------------------------微信用户登录验证----------------------------------------
  function userGetted(data) {
    UserInfo = data.result;
    console.log(UserInfo);
  } //end func
  //----------------------------------------加载声音及处理----------------------------------------
  function sound_handler() {
    if (os.weixin) wx.ready(sound_creat);
    else sound_creat();
  } //edn func
  function sound_creat() {
    ibgm.init({
      src: "music/bgm.mp3",
      autoplay: os.weixin || os.taobao,
      webAudio: false
    });
  } //end func
  //----------------------------------------加载页面图片----------------------------------------
  function load_handler() {
    var loader = new PxLoader();
    loader.addImage("http://cdn.h5-x.com/gravitation/images/draw/remove.png");
    loader.addImage("http://cdn.h5-x.com/gravitation/images/draw/rotate.png");
    // loader.addImage("http://cdn.h5-x.com/gravitation/images/draw/resize.png");
    loader.addImage("http://cdn.h5-x.com/gravitation/images/draw/scene/shower/2.jpg");
    loader.addImage("http://cdn.h5-x.com/gravitation/images/draw/scene/bedroom/2.jpg");
    loader.addImage("http://cdn.h5-x.com/gravitation/images/draw/scene/office/2.jpg");
    loader.addImage("http://cdn.h5-x.com/gravitation/images/share/title/1.png");
    loader.addImage("http://cdn.h5-x.com/gravitation/images/share/title/2.png");
    loader.addImage("http://cdn.h5-x.com/gravitation/images/share/title/3.png");
    loader.addImage("http://cdn.h5-x.com/gravitation/images/share/title/4.png");
    loader.addImage("http://cdn.h5-x.com/gravitation/images/share/title/5.png");
    for (const key in $dataMap) {
      if ($dataMap.hasOwnProperty(key)) {
        for (let index = 0; index < $dataMap[key].length; index++) {
          loader.addImage($src + $dataMap[key][index].path);
        }
      }
    }
    //实际加载进度
    loader.addProgressListener(function(e) {
      var per = Math.round((e.completedCount / e.totalCount) * 50);
      loadPer.html(per + "%");
    });

    loader.addCompletionListener(function() {
      load_timer(50); //模拟加载进度
      loader = null;
    });
    loader.start();
  } //end func

  //模拟加载进度
  function load_timer(per) {
    per = per || 0;
    per += imath.randomRange(1, 3);
    per = per > 100 ? 100 : per;
    loadPer.html(per + "%");
    if (per == 100) setTimeout(init_handler, 200);
    else setTimeout(load_timer, 33, per);
  } //edn func

  //----------------------------------------页面逻辑代码----------------------------------------
  function init_handler() {
    console.log("init handler");
    monitor_handler();
    LayaInit();
    //重新设置默认微信分享内容
    shareLetters.link = "http://mannings.h5-x.com/gravitation/";
    shareLetters.image = ishare.url + "images/1.jpg";
    shareLetters.title = "揭秘你的万有引力!";
    shareLetters.timeline = "没见过我的梳妆台，还敢说了解我？";
    shareLetters.friend = "没见过我的梳妆台，还敢说了解我？";
    ishare.reset(shareLetters);
    loading.hide();
    var zoom = home.children(".zoom"); //拉近效果box
    var start_box = zoom.children(".start_box"); //开始揭秘
    var mirror = home.find(".mirror"); //文案旁边小镜子
    home.fadeIn(500, function() {
      var bubble = $('.bubble')
      bubble.bubbleOn({num:6,x:bubble.width()*0.5,y:bubble.height(),roll2D:true,swing:true});
      // setTimeout(function(){
      //   zoom.children('.title_wrap').css({
      //     animation:"btnStartMove 2s ease infinite alternate",
      //     opacity:1
      //   })
      // },3000)
    });
    start_box.on("click", function() {
      imonitor.add({ label:"开始揭秘"});
      home.css(
        "transform-origin",
        getLeft(mirror[0]) + "px " + getTop(mirror[0]) + "px "
      );
      home.transition({ scale: 2, opacity:0}, 1500, 'easeInOutQuad', function() {
        home.hide();
        introduction.fadeIn(1500, function() {
          var mirror1 = introduction.find(".mirror1");
          var textWrap = mirror1.children(".text");
          var textWrap1 = mirror1.children(".text1");
          var texts = textWrap.children();
          var texts1 = textWrap1.children();
          texts.transition({ opacity: 1 }, 1500, function() {
            setTimeout(function() {
              textWrap.fadeOut(750, function() {
                textWrap1.show();
                texts1.transition({ opacity: 1 }, 1500, function() {
                  setTimeout(function() {
                    //显示diy场景
                    textWrap1.fadeOut(750,function(){
                      introduction.fadeOut(200);
                      resize_handler();
                    })
                  }, 2000);
                });
              });
            }, 2000);
          });
        });
      });
    });
  } //end func
  //分享页引力入口按钮
  share.find(".foot .button").on("touched", function() {
    imonitor.add({ label:"引力入口"});
    share.fadeOut(750, function() {
      lottery.fadeIn(750, function() {
        var mirror1 = lottery.find(".mirror1");
        mirror1.fadeIn(750, function() {
          var form = mirror1.find(".form");
          var success = mirror1.find(".success");
          form.css({
            display: "flex"
          });
          form.transition({ opacity: 1 }, 750, function() {
            form.find(".button").on("touched", function() {
              imonitor.add({ label:"提交信息"});
              var useradd_telVal = $("#phone").val()
              if(useradd_telVal == '' || !icom.checkStr(useradd_telVal, 0)){
                 icom.alert("请输入您的正确的手机号");
              } else {
                  iAd.Users.Save({ phone: useradd_telVal }, function (data) {
                      if (data.errcode != 0) { icom.alert(data.errmsg) }
                      else {
                          //提交成功
                          form.transition({ opacity: 0 }, 750, function () {
                              form.hide();
                              success.css({
                                  display: "flex"
                              });
                              success.transition({ opacity: 1 }, 750, function () {
                                    success.find('.button_receive').on('touched', function () {
                                      imonitor.add({ label:"点击领券"});
                                      // var cuurentTime = new Date().getTime();
                                      // var test = new Date('2018-10-15').getTime();
                                      // var startTime = new Date('2018-10-17').getTime();
                                      // var endTime = new Date('2018-10-28').getTime();
                                      // var startTime1 = new Date('2018-10-29').getTime();
                                      // var endTime1 = new Date('2018-11-7').getTime();
                                      // if ((cuurentTime > startTime) && (cuurentTime < endTime)) {
                                          location.href = 'http://coupon.m.jd.com/coupons/show.action?key=ff9fa0852785467f80fd703c6d33dfa9&roleId=14856934&to=mannings.jd.com'
                                      // } else if ((cuurentTime > startTime1) && (cuurentTime < endTime1)) {
                                          // location.href = 'http://coupon.m.jd.com/coupons/show.action?key=49277bf232764e4293fdccf33f61f2a4&roleId=14853165&to=mannings.jd.com'
                                      // }else if((test <  startTime)){
                                          // location.href = 'http://coupon.m.jd.com/coupons/show.action?key=49277bf232764e4293fdccf33f61f2a4&roleId=14853165&to=mannings.jd.com'
                                      // }
                                  })
                              });
                          });
                          //
                      }
                  })

              }
            });
          });
        });
        lottery.find(".mirror1_shadow").transition({ opacity: 1 }, 750);
      });
    });
  });
  //初始化laya
  function LayaInit() {
    articleBox.css({
      backgroundImage: "none"
    });
    $(".drop_down").on("touched", function() {
      $(".drop_down").fadeOut(750);
    });
    imgSize = [
      750 * windowScale * canvasScale,
      1334 * windowScale * canvasScale
    ];
    layaCanvas = Laya.init(imgSize[0], imgSize[1]);
    canvasBox = $(layaCanvas);
    canvasBox.prependTo(canvasShell.find(".draw_canvas")).hide();
    $("#layaContainer").remove();
    layaRoot = new Laya.Sprite();
    Laya.stage.addChild(layaRoot);
    layaBg = new Laya.Sprite();
    layaBg.name = "bg";
    layaBg.size(imgSize[0], imgSize[1]);
    layaRoot.addChild(layaBg);
    layaBg.on(Laya.Event.MOUSE_MOVE, this, bg_touchstart);
    layaShell = new Laya.Sprite();
    layaShell.size(canvasShell.innerWidth(), canvasShell.innerHeight());
    layaRoot.addChild(layaShell);
    bg_switch("http://cdn.h5-x.com/gravitation/images/draw/scene/shower/2.jpg");
  }
  function title_switch(index) {
    $(".placard .bottom .title")
      .css({
        width: $Title[index].width / 100 + "rem",
        height: $Title[index].height / 100 + "rem"
      })
      .attr("src", $Title[index].path);
  }
  //给小物件元素注册点击事件
  $(".element_scr").on("click", "li", function(e) {
    var Scr = $(".element_scr");
    var cont = Scr.children(".cont");
    var target = $(e.target);
    var detail = target.data("detail");
    if (!detail) {
      target = $(e.target).parent();
      detail = target.data("detail");
    }
    cont.find("li").removeClass("active");
    target.addClass("active");
    var data = {
      width: detail.width,
      height: detail.height,
      path: $src + detail.path,
      element_type: detail.element_type
    };
    switch(detail.element_type){
      case 'cheek':
        imonitor.add({ label: "meiji" + target.index() });
        break;
      case 'body':
        imonitor.add({ label: "shenti" + target.index() });
        break;
      case 'healthcare':
        imonitor.add({ label: "jiankang" + target.index() });
        break;
      case 'children':
        imonitor.add({ label: "daiwa"  + target.index()});
        break;
      case 'thing':
        imonitor.add({ label: "xiaokeai"  + target.index()});
        break;
      case 'label':
        imonitor.add({ label: "biaoqian"  + target.index()});
        break;
    }
    layer_creat(data);
  });
  //---------------------------------creat
  function layer_creat(options) {
    layerNum++;
    var defaults = {
      id: 0,
      rotation: 0,
      scaleX: options.element_type == "label" ? 1.2 : 1.1,
      scaleY: options.element_type == "label" ? 1.2 : 1.1,
    }; //默认值
    var data = $.extend(defaults, options); //合并对象
    var layer = new Laya.Sprite();
    layer.pos(imgSize[0] * 0.5, imgSize[1] * 0.5);
    layer.mouseThrough = true;
    layer.pivot(data.width * 0.5, data.height * 0.5);
    layer.width =
      data.element_type == "label" ? data.width  : data.width;
    layer.height =
      data.element_type == "label" ? data.height  : data.height;
    layer.widthOrg =
      data.element_type == "label" ? data.width : data.width;
    layer.heightOrg =
      data.element_type == "label" ? data.height : data.height;
    layer.scaleLast = 1;
    layer.rotation = data.rotation;
    layer.rotateStart = 0;
    layer.rotateLast = 0;
    layer.radioDegree = imath.toDegree(Math.atan(data.height / data.width));
    layer.zOrder = zindex++;
    layer.id = data.id;
    layaShell.addChild(layer);
    layer.name = "layer" + (layerNum - 1);
    iCtrl.on(layer,layaBg);
    layer.complex = 0;
    layer.graphics.loadImage(data.path, 0, 0, data.width, data.height);
    iCtrl.resize(layer, data.scaleX, data.scaleY);
  } //edn func
  //场景下一步
  $(".next").on("touched", function() {
    $(".staging.scene").transition({ y: "150%" }, 750, function() {
      laya_init();
      var target = $(menu_item_element[0]);
      menu_item_element.removeClass("active");
      menu_item_thing.removeClass("active");
      target.addClass("active");
      element_bg_switch(target.data("index"));
      $(".staging.element").transition({ y: 0 }, 750, function() {});
      element_bg_switch(0);
    });
  });
  //diy元素页返回上一步
  $(".callback_wrap .callback").on("touched", function() {
    layaShell.destroyChildren()
    iCtrl.hide()
    $(".staging.element").transition({ y: "150%" }, 750, function() {
      $(".staging.scene").transition({ y: 0 }, 750, function() {});
      
    });
  });
  //生成作品按钮事件
  $(".compose").on("touched", function() {
    imonitor.add({ label:"生成作品"});
    $("#diy_img").attr("src", layaCanvas.toDataURL("image/png"));
    loadBox.show();
    canvasShell.fadeOut(750, function() {
      $(".share").fadeIn(750, function() {
        // title_switch($title_switch);
        var shareContent = share.find(".screenshot");
        var canvas = document.createElement("canvas"); //创建一个canvas节点
        var scale = 3; //定义任意放大倍数 支持小数
        canvas.height = shareContent.innerHeight() * scale;
        canvas.width = shareContent.innerWidth() * scale; //定义canvas 宽度 * 缩放
        canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
        var opts = {
          useCORS: true,
          scale: scale, // 添加的scale 参数
          canvas: canvas, //自定义 canvas
          logging: false, //日志开关
          width: shareContent.innerWidth(), //dom 原始宽度
          height: shareContent.innerHeight() //dom 原始高度
        };
        html2canvas(shareContent[0], opts).then(function(canvas) {
          $("#fruit").attr("src", canvas.toDataURL("image/png"));
          loadBox.hide();
          icom.canvas_send(canvas, image_combine_complete, "laya_draw", "png");
          function image_combine_complete(url) {
            console.log(url);
          }
        });
      });
    });
  });
  //小物件tab切换
  var menu_item_element = canvasShell.find(
    ".staging.element .menu_wrap .menu_item"
  );
  var menu_item_thing = $(".thing .menu_item");
  menu_item_element.on("touched", menu_item_fun);
  menu_item_thing.on("touched", menu_item_fun);
  function menu_item_fun(e) {
    var target = $(e.target);
    menu_item_element.removeClass("active");
    menu_item_thing.removeClass("active");
    target.addClass("active");
    element_bg_switch(target.data("index"));
  }
  //小物件列表切换
  function element_bg_switch(type) {
    var Scr = $(".element_scr");
    var element_type = "cheek";
    var cont = Scr.children(".cont");
    cont.css({
      backgroundColor: "#fff"
    });
    if (type == 0) {
      //脸蛋
      element_type = "cheek";
    } else if (type == 1) {
      //身体
      element_type = "body";
    } else if (type == 2) {
      //养生
      element_type = "healthcare";
    } else if (type == 3) {
      //带娃
      element_type = "children";
    } else if (type == 4) {
      //物件
      element_type = "thing";
    } else if (type == 5) {
      //标签
      element_type = "label";
      cont.css({
        backgroundColor: "#3b3b3b"
      });
    }
    cont.empty();
    for (let index = 0; index < $dataMap[element_type].length; index++) {
      var item = $('<li class="'+ element_type + '"><div class="item"></div><div class="base"></div></li>');
      index === 0 ? item.addClass("active") : null;
      item.children(".item").css({
        backgroundImage:
          "url(" + $src + $dataMap[element_type][index].path + ")",
        width:element_type == "label" ? $dataMap[element_type][index].width / 400 + "rem" : $dataMap[element_type][index].width / 200 + "rem",
        height:element_type == "label" ? $dataMap[element_type][index].height / 400 + "rem" : $dataMap[element_type][index].height / 200 + "rem"
      });

      $dataMap[element_type][index].element_type = element_type;
      item.data("detail", $dataMap[element_type][index]);
      cont.append(item);
    }
    // cont.css({ width: 2.5 * $dataMap[element_type].length + "rem" });
    if (Scroll_E) {
      setTimeout(function() {
        Scroll_E.refresh();
      }, 0);
      Scroll_E && Scroll_E.scrollTo(0, 0);
    } else {
      Scroll_E = new IScroll(".element_scr", {
        scrollY: true,
        scrollX: false,
        click: true
      });
    }
  }
  function laya_init() {
    //初始化laya
    iCtrl = new Ctrl({
      rotate: true,
      touchMuti:false,
      onCtrl: onLayerCtrl,
      onRemove: onLayerRemove
    });
  } //edn func
  function bg_touchstart(e) {
    iCtrl && iCtrl.hide();
    layerNow = null;
  } //edn func
  function onLayerCtrl(layer) {
    layerNow = layer;
  } //edn func

  function onLayerRemove() {
    layerNow = null;
  } //end func
  //场景tab切换
  var menu_item = canvasShell.find(".staging.scene .menu_wrap .menu_item");
  var scene_scr_li = $(".scene_scr li");
  scene_scr_li.on("touched",menu_item_click)
  menu_item.on("touched", menu_item_click);
  function  menu_item_click (e) {
    var target = $(e.target);
    var index = target.data("index");
    menu_item.removeClass("active");
    menu_item.eq(index).addClass("active");
    scene_scr_li.removeClass("active");
    scene_scr_li.eq(index).addClass("active");
    if (index == 0) {
      //浴室
      shareLetters.image = ishare.url + "images/1.jpg";
      shareLetters.timeline = "没见过我的梳妆台，还敢说了解我？";
      shareLetters.friend = "没见过我的梳妆台，还敢说了解我？";
      ishare.reset(shareLetters);
      bg_switch("http://cdn.h5-x.com/gravitation/images/draw/scene/shower/2.jpg", index);
      $title_switch = 3;
      canvasShell.children('.bg').css({
        backgroundImage: "url(http://cdn.h5-x.com/gravitation/images/draw/scene/shower/2.jpg)"
      })
    } else if (index == 1) {
      //卧室
      shareLetters.image = ishare.url + "images/2.jpg";
      shareLetters.timeline = "看看我的房间，希望我们还能做朋友。";
      shareLetters.friend = "看看我的房间，希望我们还能做朋友。";
      ishare.reset(shareLetters);
      bg_switch("http://cdn.h5-x.com/gravitation/images/draw/scene/bedroom/2.jpg", index);
      $title_switch = 4;
      canvasShell.children('.bg').css({
        backgroundImage: "url(http://cdn.h5-x.com/gravitation/images/draw/scene/bedroom/2.jpg)"
      })
    } else if (index == 2) {
      //办公室
      shareLetters.image = ishare.url + "images/3.jpg";
      shareLetters.timeline = "别扯了！我的办公桌怎会只有工作呢？";
      shareLetters.friend = "别扯了！我的办公桌怎会只有工作呢？";
      ishare.reset(shareLetters);
      bg_switch("http://cdn.h5-x.com/gravitation/images/draw/scene/office/2.jpg", index);
      $title_switch = 2;
      canvasShell.children('.bg').css({
        backgroundImage: "url(http://cdn.h5-x.com/gravitation/images/draw/scene/office/2.jpg)"
      })
    }
    title_switch($title_switch);
  }
  //场景列表切换
  //laya背景切换
  function bg_switch(src, id) {
    id = id || 0;
    layaBg.graphics.clear();
    layaBg.graphics.loadImage(src, 0, 0, imgSize[0], imgSize[1]);
  } //edn func
  function resize_handler() {
    Laya.timer.frameOnce(10, this, function() {
      canvasBox.css({ transform: "matrix(0.5, 0, 0, 0.5, 0, 0)" }).show();
      canvasShell.show();
      var scene_hint_wrap = canvasShell.children('.scene_hint_wrap')
      scene_hint_wrap.on('touched',function(){
        scene_hint_wrap.fadeOut(750)
      })
    });
  } //edn func
  //----------------------------------------页面监测代码----------------------------------------
  function monitor_handler() {
    //		imonitor.add({obj:$('a.btnTest'),action:'touchstart',category:'default',label:'测试按钮'});
  } //end func
  function getTop(e) {
    var offset = e.offsetTop;
    if (e.offsetParent != null) offset += getTop(e.offsetParent);
    return offset;
  }
  function getLeft(e) {
    var offset = e.offsetLeft;
    if (e.offsetParent != null) offset += getLeft(e.offsetParent);
    return offset;
  }
}); //end ready
