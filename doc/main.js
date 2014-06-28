(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("webCustomizer");


},{"webCustomizer":22}],2:[function(require,module,exports){
module.exports = {
  obj: require("./lib/obj"),
  array: require("./lib/array"),
  file: require("./lib/file"),
  calc: require("./lib/calc"),
  str: require("./lib/str"),
  time: require("./lib/time")
};


},{"./lib/array":3,"./lib/calc":4,"./lib/file":5,"./lib/obj":6,"./lib/str":7,"./lib/time":8}],3:[function(require,module,exports){

/**
  @class core.array
  配列を操作します。
 */
var core_obj;

core_obj = require("./obj");


/**
  @method repFilter
  配列の重複する要素を一つにまとめます。
  @param {array} target 対象の配列
 */

exports.repFilter = function(array) {
  return array.filter(function(x, i, self) {
    return self.indexOf(x) === i;
  });
};


/**
  @method getPopClone
  指定した配列のポップされたクローンを取得します。
  @param {array} target 対象の配列
  @return {array} return.popClone ポップした配列のクローン
 */

exports.getPopClone = function(array) {
  var clone;
  clone = core_obj.clone(array);
  clone.shift();
  return clone;
};


},{"./obj":6}],4:[function(require,module,exports){

/**
  @class core.calc
    演算を主体としたクラスです。
 */
var core_obj;

core_obj = require("./obj");


/**
  @method hslToRGB
  HSLをRGBに変換した値を返します。
  @param {Object} argHSL 変換するHSL値
  @return {Array} 変換したRGB値
 */

exports.hslToRGB = function(argHSL) {
  var HSL, b, g, hslToRGB_calc, max, min, r;
  HSL = core_obj.clone(argHSL);
  HSL["L"] /= 100;
  HSL["S"] /= 100;
  if (HSL["L"] <= 0.5) {
    max = HSL["L"] * (1 + HSL["S"]);
  } else {
    max = HSL["L"] + HSL["S"] - HSL["L"] * HSL["S"];
  }
  min = 2 * HSL["L"] - max;
  hslToRGB_calc = function(n1, n2, hue) {
    hue = (hue + 180) % 360;
    if (hue < 60) {
      return n1 + (n2 - n1) * hue / 60;
    } else if (hue < 180) {
      return n2;
    } else if (hue < 240) {
      return n1 + (n2 - n1) * (240 - hue) / 60;
    } else {
      return n1;
    }
  };
  r = Math.floor(hslToRGB_calc(max, min, HSL["H"] + 120) * 255).toString(16);
  g = Math.floor(hslToRGB_calc(max, min, HSL["H"]) * 255).toString(16);
  b = Math.floor(hslToRGB_calc(max, min, HSL["H"] - 120) * 255).toString(16);
  if (r.length < 2) {
    r = "0" + r;
  }
  if (g.length < 2) {
    g = "0" + g;
  }
  if (b.length < 2) {
    b = "0" + b;
  }
  HSL = null;
  return "#" + r + g + b;
};


},{"./obj":6}],5:[function(require,module,exports){

/**
  @class core.file
  ファイルを操作します。
 */

/**
  @method downloadData
  データをファイルとしてダウンロードさせます。
  @param {object} content データ
  @param {string} fileName ファイル名
 */
exports.downloadData = function(content, fileName) {
  var a, blob, contentType;
  contentType = 'application/octet-stream';
  blob = new Blob([content], {
    'type': contentType
  });
  a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = fileName;
  return a.click();
};


/**
  @method registFileAPI
  file apiとidを紐付けし、load実行時に指定したメソッドを呼び出します。
  @param {string} id id名
  @param {function} callback 呼び出すメソッド(e:イベント、parent:呼び出し元インスタンス が渡される。)
  @param {object} parent このメソッドを実行したインスタンス
 */

exports.registFileAPI = (function(_this) {
  return function(id, callback, parent) {
    return $(id).bind("change", function(e) {
      var file, fr;
      file = e.target.files[0];
      fr = new FileReader();
      fr.onload = function(e) {
        return callback(e, parent);
      };
      return fr.readAsText(file);
    });
  };
})(this);


/**
  @method getJSONFile
  JSONファイルを読み込み、指定したメソッドを呼び出します。
  @param {string} id id名
  @param {function} callback 呼び出すメソッド(data:読み込んだファイルデータ が渡される。)
 */

exports.getJSONFile = (function(_this) {
  return function(fileName, callback) {
    return $.getJSON(fileName, function(data) {
      return callback(data);
    });
  };
})(this);


},{}],6:[function(require,module,exports){

/**
  @class core.obj
    オブジェクトを操作します。
 */
var core_array;

core_array = require("./array");


/**
  @method setMapVal
  オブジェクトの構造を指定して一度に値を設定します。
  @param {Object} target 初期化する連想配列
  @param {Array} keyListArray 構造を記述した配列
  @param {Object} initVal 初期化に使用する値
 */

exports.setMapVal = function(target, mapList, val) {
  var init, setChildMapVal, setInitVal;
  init = (function(_this) {
    return function(target, map) {
      var key, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = map.length; _i < _len; _i++) {
        key = map[_i];
        if (!_this.check(target[key])) {
          _results.push(target[key] = {});
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
  })(this);
  setChildMapVal = (function(_this) {
    return function(target, mapList, val) {
      var childMapList, key, _i, _len, _ref, _results;
      childMapList = core_array.getPopClone(mapList);
      _ref = mapList[0];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(_this.setMapVal(target[key], childMapList, val));
      }
      return _results;
    };
  })(this);
  setInitVal = function(hash, keyList, val) {
    var key, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = keyList.length; _i < _len; _i++) {
      key = keyList[_i];
      _results.push(hash[key] = val);
    }
    return _results;
  };
  if (mapList.length > 1) {
    init(target, mapList[0]);
    return setChildMapVal(target, mapList, val);
  } else {
    return setInitVal(target, mapList[0], val);
  }
};


/**
  @method check
  連想配列か判定する
  @param {Object} obj 判定対象のデータ
  @return {boolean} 判定結果
 */

exports.check = function(obj) {
  return obj && obj.constructor === Object;
};


/**
  @method clone
  オブジェクトのクローンを生成します。
  @param {Object} obj クローン元のデータ
  @return {Object} クローンデータ
 */

exports.clone = function(obj) {
  var f;
  f = function() {};
  f.prototype = obj;
  return new f;
};


},{"./array":3}],7:[function(require,module,exports){

/**
  @class core.str
    文字列を操作します。
 */

/**
  @method addDQ
  前後にダブルクォーテーションを付与した文字列を返します。
  @param {String} 付与する文字列
  @return {String} 付与した文字列
 */
exports.addDQ = function(str) {
  return "\"" + str + "\"";
};


/**
  @method addSQ
  前後にシングルクォーテーションを付与した文字列を返します。
  @param {String} 付与する文字列
  @return {String} 付与した文字列
 */

exports.addSQ = function(str) {
  return "\'" + str + "\'";
};


},{}],8:[function(require,module,exports){

/**
  @class core.time
    時間データを操作します。
 */
var timer;

timer = {};


/**
  @method startTimer
  タイマーを開始します。
  @param {String} id タイマーID
 */

exports.startTimer = function(id) {
  var date;
  date = new Date();
  return timer[id] = date.getTime();
};


/**
  @method endTimer
  タイマーを終了し、経過時間を取得します。
  @param {String} id タイマーID
  @return {Number} 計測時間
 */

exports.endTimer = function(id) {
  var date, time;
  date = new Date();
  time = date.getTime() - timer[id];
  delete timer[id];
  return time;
};


},{}],9:[function(require,module,exports){
module.exports = {
  test: require("./lib/test")
};


},{"./lib/test":10}],10:[function(require,module,exports){

/**
  @class debug.test
    テストを行います。
 */
var core;

core = require("core");


/**
  @method startTimer
  時間計測を開始します。
  @param {String} testID テストID
 */

exports.startTimer = function(testID) {
  return core.time.startTimer(testID);
};


/**
  @method endTimer
  時間計測を終了します。
  @param {String} testID テストID
 */

exports.endTimer = function(testID) {
  return console.log(testID + "_time:" + core.time.endTimer(testID) + "ms");
};


},{"core":2}],11:[function(require,module,exports){
exports.makeSelectBox = function(name, list) {
  var data, html_selectBoxOption, index;
  html_selectBoxOption = [];
  for (index in list) {
    data = list[index];
    html_selectBoxOption.push([
      "option", {
        value: data
      }, data
    ]);
  }
  return [
    [
      "select", {
        id: name
      }
    ], html_selectBoxOption
  ];
};

exports.makeSliderWithInput = function(areaName, uiName) {
  return {
    slider: [
      "div", {
        "class": areaName + "Range slider",
        id: uiName + "_range"
      }
    ],
    input: [
      "input", {
        "class": areaName + "RangeText",
        id: uiName + "_rangeInput",
        type: "text",
        size: "4"
      }
    ]
  };
};


},{}],12:[function(require,module,exports){
var core, formatTag, getLevel;

core = require('core');

exports.getHtml = function(htmlList, level) {
  var addHtmlLine, closedTag, getClosedTag, html, htmlLine, index;
  addHtmlLine = function(htmlLine, level) {
    return level + htmlLine + "\n";
  };
  getClosedTag = function(nowHtmlLine, level) {
    var tag, tagCheck, tagName;
    tagCheck = function(tag) {
      if (tag !== "br") {
        return true;
      }
    };
    tag = "";
    tagName = nowHtmlLine.split(">")[0].split(" ")[0].substr(1);
    if (tagCheck(tagName)) {
      tag = level + "</" + tagName + ">" + "\n";
    }
    return tag;
  };
  html = closedTag = "";
  if (!level) {
    level = 0;
  }
  for (index in htmlList) {
    htmlLine = htmlList[index];
    if (htmlLine[0] instanceof Array) {
      html = html + this.getHtml(htmlLine, level + 1);
    } else {
      htmlLine = formatTag(htmlLine[0], htmlLine[1], htmlLine[2]);
      if (closedTag !== "") {
        html = html + closedTag;
      }
      closedTag = getClosedTag(htmlLine, getLevel(level));
      html = html + addHtmlLine(htmlLine, getLevel(level));
    }
  }
  return html = html + closedTag;
};

formatTag = function(tag, attrList, value) {
  var closeOpenedTag, getAttr, getOpenedTag, getValue, str;
  getOpenedTag = function(tag) {
    return "<" + tag;
  };
  getAttr = function(attrList) {
    var attr, checkData, checkDataPrefix, key, str;
    checkDataPrefix = function(key, attr) {
      if (key.indexOf("data") !== -1) {
        key = "data" + "-" + attr[0];
        attr = attr[1];
      }
      return {
        key: key,
        attr: attr
      };
    };
    str = "";
    for (key in attrList) {
      attr = attrList[key];
      checkData = checkDataPrefix(key, attr);
      key = checkData.key;
      attr = checkData.attr;
      str = str + " " + key + "=" + core.str.addDQ(attr);
    }
    return str;
  };
  closeOpenedTag = function() {
    return ">";
  };
  getValue = function(value) {
    if (value !== void 0) {
      return value;
    } else {
      return "";
    }
  };
  str = getOpenedTag(tag);
  str = str + getAttr(attrList);
  str = str + closeOpenedTag();
  return str = str + getValue(value);
};

getLevel = function(num) {
  var index, str, _i;
  str = "";
  for (index = _i = 0; 0 <= num ? _i < num : _i > num; index = 0 <= num ? ++_i : --_i) {
    str = str + "\t";
  }
  return str;
};


},{"core":2}],13:[function(require,module,exports){
exports.html = require('./html');

exports.gui = require('./com/gui');


},{"./com/gui":11,"./html":12}],14:[function(require,module,exports){
exports.fadein = function(target, time) {
  return $(target).animate({
    opacity: "show"
  }, {
    duration: time,
    easing: 'linear'
  });
};

exports.fadeout = function(target, time) {
  return $(target).animate({
    opacity: "hide"
  }, {
    duration: time,
    easing: 'linear'
  });
};

exports.blind = function(target, time, dir) {
  return $(target).toggle("blind", {
    "direction": dir
  }, time);
};

exports.clip = function(target, time, dir) {
  return $(target).toggle("clip", {
    "direction": dir
  }, time);
};

exports.drop = function(target, time, dir) {
  return $(target).toggle("drop", {
    "direction": dir
  }, time);
};

exports.slide = function(target, time, dir, distance) {
  return $(target).toggle("slide", {
    "direction": dir,
    "distance": distance
  }, time);
};

exports.explode = function(target, time, pieces) {
  return $(target).toggle("explode", {
    "pieces": pieces
  }, time);
};

exports.fold = function(target, time, horizFirst, size) {
  return $(target).toggle("fold", {
    "horizFirst": horizFirst,
    "size": size
  }, time);
};

exports.puff = function(target, time, per) {
  return $(target).toggle("puff", {
    "percent": per
  }, time);
};

exports.scale = function(target, time, dir, origin, per, scale) {
  return $(target).toggle("scale", {
    "direction": dir,
    "origin": origin,
    "percent": per,
    "scale": scale
  }, time);
};


},{}],15:[function(require,module,exports){
$('.tooltipEle').tooltip();

$(".draggable").draggable({
  connectToSortable: false
});

$(".slider").slider({
  range: "max",
  slide: function(e, ui) {
    return $(this).next().val(ui.value);
  }
});

$(".box_accordion .trigger").click(function() {
  return $(this).next().slideToggle();
});


},{}],16:[function(require,module,exports){
var effect, effect_anim;

effect_anim = require("effect/anim");

exports.option = {
  target: "#transition",
  method: "none",
  time: 500
};

exports["in"] = function() {
  return effect("in");
};

exports.out = function(url) {
  effect("out");
  setTimeout(function() {
    return window.location.href = url;
  }, this.option.time);
  return false;
};

effect = (function(_this) {
  return function(state) {
    switch (_this.option.method) {
      case "none":
        if (state === "in") {
          return $(_this.option.target).css("display", "block");
        }
        break;
      case "fade":
        if (state === "in") {
          return effect_anim.fadein(_this.option.target, _this.option.time);
        } else {
          return effect_anim.fadeout(_this.option.target, _this.option.time);
        }
        break;
      case "ver_blind":
        return effect_anim.blind(_this.option.target, _this.option.time, "up");
      case "hor_blind":
        if (state === "in") {
          return effect_anim.blind(_this.option.target, _this.option.time, "left");
        } else {
          return effect_anim.blind(_this.option.target, _this.option.time, "right");
        }
        break;
      case "ver_clip":
        return effect_anim.clip(_this.option.target, _this.option.time, "vertical");
      case "clip":
        return effect_anim.clip(_this.option.target, _this.option.time, "horizontal");
      case "drop_up":
        return effect_anim.drop(_this.option.target, _this.option.time, "up");
      case "drop_down":
        return effect_anim.drop(_this.option.target, _this.option.time, "down");
      case "drop_left":
        return effect_anim.drop(_this.option.target, _this.option.time, "left");
      case "drop_right":
        if (state === "in") {
          return effect_anim.drop(_this.option.target, _this.option.time, "left");
        } else {
          return effect_anim.drop(_this.option.target, _this.option.time, "right");
        }
        break;
      case "ver_slide":
        if (state === "in") {
          return effect_anim.slide(_this.option.target, _this.option.time, "up", 1000);
        } else {
          return effect_anim.slide(_this.option.target, _this.option.time, "down", 1000);
        }
        break;
      case "hor_slide":
        if (state === "in") {
          return effect_anim.slide(_this.option.target, _this.option.time, "left");
        } else {
          return effect_anim.slide(_this.option.target, _this.option.time, "right");
        }
        break;
      case "fold":
        return effect_anim.fold(_this.option.target, _this.option.time, true, 700);
      case "puff_on":
        return effect_anim.puff(_this.option.target, _this.option.time, 150);
      case "puff_off":
        return effect_anim.puff(_this.option.target, _this.option.time, 50);
    }
  };
})(this);

exports.check_access = function() {
  return $.cookie('access');
};

exports.check_anker = function(a) {
  return $(a).attr('href').indexOf("#") === -1;
};

exports.preLoading = function(preImageList, callback_trans) {
  var list, loaded, persent, persentCnt, _i, _len, _results;
  $("#loading").css("display", "block");
  loaded = 0;
  persentCnt = 0;
  persent = Math.ceil(100 / preImageList.length);
  _results = [];
  for (_i = 0, _len = preImageList.length; _i < _len; _i++) {
    list = preImageList[_i];
    _results.push($('<img>').attr('src', "./src/img/" + list).load((function(_this) {
      return function() {
        var timer;
        loaded++;
        return timer = setInterval(function() {
          if (persentCnt >= 100) {
            clearTimeout(timer);
            $("#loading").fadeOut();
            $.cookie('access', 'true');
            return callback_trans();
          } else {
            if (persentCnt <= loaded * persent) {
              persentCnt += loaded * persent;
            }
            return $('#load_count').text(persentCnt + '%');
          }
        }, 10);
      };
    })(this)));
  }
  return _results;
};


},{"effect/anim":14}],17:[function(require,module,exports){
var core, ctr_css, data, getHSL, web;

core = require("core");

web = require("web");

data = require("../data");

ctr_css = require("./css");

exports.init = function() {
  var basecolorList, init_colorPicker;
  init_colorPicker = function() {
    $('#colorpicker_debug').farbtastic('#colorInput_debug');
    return $.farbtastic('#colorpicker_debug').setColor(core.calc.hslToRGB(data.HSL));
  };
  init_colorPicker();
  basecolorList = web.color.getBaseColorList(data.HSL);
  data.colorList = web.color.getColorList(basecolorList);
  return $('#colorInput_debug').bind('change', (function(_this) {
    return function(event) {
      var key_ele, _i, _len, _ref, _results;
      data.HSL = getHSL();
      basecolorList = web.color.getBaseColorList(data.HSL);
      data.colorList = web.color.getColorList(basecolorList);
      _this.setColorScheme($("#webeleName_input").val());
      _ref = webele.eleList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key_ele = _ref[_i];
        ctr_css.setCSSBorder(key_ele);
        ctr_css.setCSSShadow(key_ele);
        ctr_css.setCSSFont(key_ele);
        ctr_css.setCSSGradient(key_ele);
        _results.push(ctr_css.setCSSAnimation(key_ele));
      }
      return _results;
    };
  })(this));
};

exports.setColorScheme = function(webeleName) {
  var animationSelect, responsiveName;
  responsiveName = web.size.getInnerWidthName();
  animationSelect = $("#animationState_select").val();
  $("[data-" + data.name + "='" + webeleName + "']").css("background-color", data.colorList[data.webele[webeleName][responsiveName][animationSelect].color.BG]);
  $("[data-" + data.name + "='" + webeleName + "']").css("color", data.colorList[data.webele[webeleName][responsiveName][animationSelect].color.text]);
  $("[data-" + data.name + "='" + webeleName + "']").find("a, i").css("cssText", "color: " + data.colorList[data.webele[webeleName][responsiveName][animationSelect].color.link] + " !important;");
  return $("[data-" + data.name + "='" + webeleName + "']").find("a").hover((function(_this) {
    return function(e) {
      return $(e.currentTarget).add($("i", e.currentTarget)).css("cssText", "color: " + data.colorList[data.webele[$(e.currentTarget).parents("[data-" + data.name + "]").data(data.name)][responsiveName][animationSelect].color.hlink]);
    };
  })(this), (function(_this) {
    return function(e) {
      return $(e.currentTarget).add($("i", e.currentTarget)).css("cssText", "color: " + data.colorList[data.webele[$(e.currentTarget).parents("[data-" + data.name + "]").data(data.name)][responsiveName][animationSelect].color.link]);
    };
  })(this));
};

getHSL = function() {
  var hslSprit;
  hslSprit = $("#colorInput_debug").val().split("_")[0].split(":");
  if (hslSprit[0] === "NaN" || hslSprit[1] === "NaN" || hslSprit[2] === "NaN") {
    return;
  }
  return {
    H: Number(hslSprit[0]),
    S: Number(hslSprit[1]),
    L: Number(hslSprit[2])
  };
};


},{"../data":21,"./css":18,"core":2,"web":28}],18:[function(require,module,exports){
var animationSelect, core, ctr_colorScheme, data, getBorderCSS, getRadiusCSSName, getResponsiveMax, getUnitVal, initEvent, initSlider, responsiveName, responsiveSelect, setAllData, setBackgroundValFromUI, setBorderValFromUI, setBorderValToUI, setCSS, setCSSAnimation, setCSSBackground, setCSSBorder, setCSSFont, setCSSGradient, setCSSOpacity, setCSSPosition, setCSSShadow, setCSSSize, setCSSSpace, setCSSTransform, setData, setFontValFromUI, setFontValToUI, setPositionValFromUI, setSizeValFromUI, setSliderValFromUI, setSpaceValFromUI, setUnitValToUI, web, webeleName;

core = require("core");

web = require("web");

data = require('../data');

ctr_colorScheme = require("./colorScheme");

webeleName = "BG";

responsiveName = web.size.getInnerWidthName();

responsiveSelect = "all";

animationSelect = "start";

exports.init = function() {
  var key, _i, _len, _ref;
  initSlider();
  initEvent();
  _ref = data.eleList;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    webeleName = key;
    setCSS();
  }
  webeleName = "BG";
  setData();
  return $(window).trigger("resize");
};

setCSS = (function(_this) {
  return function() {
    ctr_colorScheme.setColorScheme(webeleName);
    setCSSBorder(webeleName);
    setCSSShadow(webeleName);
    setCSSOpacity();
    setCSSFont(webeleName);
    setCSSSpace();
    setCSSSize();
    setCSSPosition();
    setCSSTransform();
    setCSSGradient();
    setCSSBackground();
    return setCSSAnimation(webeleName);
  };
})(this);

$('*').bind('contextmenu', (function(_this) {
  return function(e) {
    if ($(e.currentTarget).data(data.name)) {
      webeleName = $(e.currentTarget).data(data.name);
    } else {
      webeleName = $(e.currentTarget).parents("[data-" + data.name + "]").data(data.name);
    }
    setData();
    return false;
  };
})(this));

getResponsiveMax = function(resName) {
  var getVal, maxResVal, nowResVal;
  getVal = function(name) {
    var val;
    val = 0;
    switch (name) {
      case "exSmall":
        val = 0;
        break;
      case "small":
        val = 1;
        break;
      case "middle":
        val = 2;
        break;
      case "large":
        val = 3;
        break;
      case "all":
        val = 4;
    }
    return val;
  };
  nowResVal = getVal(resName);
  maxResVal = getVal(data.responsiveMax);
  if (nowResVal > maxResVal) {
    return data.responsiveMax;
  }
  return resName;
};

$(window).resize((function(_this) {
  return function(e) {
    var key, nowWebele, _i, _len, _ref;
    responsiveName = getResponsiveMax(web.size.getInnerWidthName());
    nowWebele = webeleName;
    _ref = data.eleList;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      webeleName = key;
      setCSS();
    }
    return webeleName = nowWebele;
  };
})(this));

setAllData = (function(_this) {
  return function() {
    var key_res, key_state, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (animationSelect === "all") {
      _ref = data.css.animation.state;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key_state = _ref[_i];
        data.webele[webeleName][responsiveSelect][key_state] = $.extend(true, {}, data.webele[webeleName][responsiveSelect].all);
      }
    }
    if (responsiveSelect === "all") {
      _ref1 = data.css.responsive;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        key_res = _ref1[_j];
        _results.push(data.webele[webeleName][key_res] = $.extend(true, {}, data.webele[webeleName].all));
      }
      return _results;
    }
  };
})(this);

initEvent = (function(_this) {
  return function() {
    $("#animationState_select").change(function(e) {
      animationSelect = $(e.currentTarget).val();
      setData();
      return $(window).trigger("resize");
    });
    $("#responsive_select").change(function(e) {
      responsiveSelect = $(e.currentTarget).val();
      setData();
      return $(window).trigger("resize");
    });
    $("#responsiveMax_select").change(function(e) {
      data.responsiveMax = $(e.currentTarget).val();
      setData();
      return $(window).trigger("resize");
    });
    $(".colorSetter select").change(function(e) {
      var setColorValFromUI;
      setColorValFromUI = function(id, val, isSelect) {
        var key_param;
        key_param = id.split("_")[0];
        return data.webele[webeleName][responsiveSelect][animationSelect].color[key_param] = $("#" + key_param + "_" + "selectColor").val() + "_" + $("#" + key_param + "_" + "selectColorMethod").val();
      };
      setColorValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val(), true);
      setAllData();
      return $('#colorInput_debug').trigger("change");
    });
    $(".borderSetter select").change(function(e) {
      setBorderValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val());
      setAllData();
      return setCSSBorder(webeleName);
    });
    $(".borderRange").bind('slide', function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        setBorderValFromUI($(e.currentTarget).attr("id"), ui.value);
      }
      setAllData();
      return setCSSBorder(webeleName);
    });
    $('.borderRangeText').bind('change', function(e) {
      setBorderValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val());
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      return $('.borderRange').trigger("slide");
    });
    $(".shadowRange").bind('slide', function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        setSliderValFromUI($(e.currentTarget).attr("id"), ui.value, data.webele[webeleName][responsiveSelect][animationSelect].shadow);
      }
      setAllData();
      return setCSSShadow(webeleName);
    });
    $('.shadowRangeText').bind('change', function(e) {
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      setSliderValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val(), data.webele[webeleName][responsiveSelect][animationSelect].shadow);
      return $('.shadowRange').trigger("slide");
    });
    $(".transformRange").bind('slide', function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        setSliderValFromUI($(e.currentTarget).attr("id"), ui.value, data.webele[webeleName][responsiveSelect][animationSelect].transform);
      }
      setAllData();
      return setCSSTransform(webeleName);
    });
    $('.transformRangeText').bind('change', function(e) {
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      setSliderValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val(), data.webele[webeleName][responsiveSelect][animationSelect].transform);
      return $('.transformRange').trigger("slide");
    });
    $(".opacityRange").bind('slide', function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        setSliderValFromUI($(e.currentTarget).attr("id"), ui.value, data.webele[webeleName][responsiveSelect][animationSelect].opacity);
      }
      setAllData();
      return setCSSOpacity();
    });
    $('.opacityRangeText').bind('change', function(e) {
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      setSliderValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val(), data.webele[webeleName][responsiveSelect][animationSelect].opacity);
      return $('.opacityRange').trigger("slide");
    });
    $(".fontSetter select").change(function(e) {
      var id, idStr;
      if ($(e.currentTarget).attr("id").indexOf("color_font") !== -1) {
        idStr = $(e.currentTarget).attr("id").split("_");
        id = idStr[0] + "_" + idStr[1] + "_" + idStr[2];
        setFontValFromUI($(e.currentTarget).attr("id"), $("#" + id + "_selectBaseColor").val() + "_" + $("#" + id + "_selectSideColor").val());
      } else {
        setFontValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val());
      }
      setAllData();
      return setCSSFont(webeleName);
    });
    $(".fontRange").bind('slide', function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        setFontValFromUI($(e.currentTarget).attr("id"), ui.value);
      }
      setAllData();
      return setCSSFont(webeleName);
    });
    $('.fontRangeText').bind('change', function(e) {
      setFontValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val());
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      return $('.fontRange').trigger("slide");
    });
    $(".spaceSetter select").change(function(e) {
      setSpaceValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val(), true);
      setAllData();
      return setCSSSpace();
    });
    $(".spaceRange").bind('slide', function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        setSpaceValFromUI($(e.currentTarget).attr("id"), ui.value);
      }
      setAllData();
      return setCSSSpace();
    });
    $('.spaceRangeText').bind('change', function(e) {
      setSpaceValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val());
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      return $('.spaceRange').trigger("slide");
    });
    $(".sizeSetter select").change(function(e) {
      setSizeValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val(), true);
      setAllData();
      return setCSSSize();
    });
    $(".sizeRange").bind('slide', function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        setSizeValFromUI($(e.currentTarget).attr("id"), ui.value);
      }
      setAllData();
      return setCSSSize();
    });
    $('.sizeRangeText').bind('change', function(e) {
      setSizeValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val());
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      return $('.sizeRange').trigger("slide");
    });
    $(".positionSetter select").change(function(e) {
      setPositionValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val(), true);
      setAllData();
      return setCSSPosition();
    });
    $(".positionRange").bind('slide', function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        setPositionValFromUI($(e.currentTarget).attr("id"), ui.value);
      }
      setAllData();
      return setCSSPosition();
    });
    $('.positionText').bind('change', function(e) {
      setPositionValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val());
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      return $('.positionRange').trigger("slide");
    });
    $(".gradientSetter select").change(function(e) {
      var id, key_color, key_param, val;
      id = $(e.currentTarget).attr("id");
      val = $(e.currentTarget).val();
      key_param = id.split("_")[0];
      key_color = id.split("_")[2];
      if (key_color === "selectColor") {
        data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param].color = val;
      } else if (key_color === "selectColorMethod") {
        data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param].method = val;
      } else {
        data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param] = val;
      }
      setAllData();
      return setCSSGradient();
    });
    $(".gradientRange").bind('slide', function(e, ui) {
      var id, key_param;
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.values);
        id = $(e.currentTarget).attr("id");
        key_param = id.split("_")[0];
        data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param] = ui.values;
      }
      setAllData();
      return setCSSGradient();
    });
    $('.gradientRangeText').bind('change', function(e) {
      var id, key_param;
      id = $(e.currentTarget).attr("id");
      key_param = id.split("_")[0];
      data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param] = $(e.currentTarget).val().split(",");
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        values: $(e.currentTarget).val().split(",")
      });
      return $('.gradientRange').trigger("slide");
    });
    $(".backgroundSetter select").change(function(e) {
      setBackgroundValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val(), true);
      setAllData();
      return setCSSBackground();
    });
    $(".backgroundRange").bind('slide', function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        setBackgroundValFromUI($(e.currentTarget).attr("id"), ui.value);
      }
      setAllData();
      return setCSSBackground();
    });
    $('.backgroundText').bind('change', function(e) {
      setPositionValFromUI($(e.currentTarget).attr("id"), $(e.currentTarget).val());
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      return $('.backgroundRange').trigger("slide");
    });
    $(".animationSetter select").change(function(e) {
      var id, key_param;
      id = $(e.currentTarget).attr("id");
      key_param = id.split("_")[0];
      data.webele[webeleName][responsiveSelect][key_param] = $(e.currentTarget).val();
      setAllData();
      return setCSSAnimation(webeleName);
    });
    $(".animationRange").bind('slide', function(e, ui) {
      var id, key_param;
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        id = $(e.currentTarget).attr("id");
        key_param = id.split("_")[0];
        data.webele[webeleName][responsiveSelect][key_param] = ui.value;
      }
      setAllData();
      return setCSSAnimation(webeleName);
    });
    return $('.animationRangeText').bind('change', function(e) {
      var id, key_param;
      id = $(e.currentTarget).attr("id");
      key_param = id.split("_")[0];
      data.webele[webeleName][responsiveSelect][key_param] = $(e.currentTarget).val().split(",");
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      return $('.animationRange').trigger("slide");
    });
  };
})(this);

exports.setCSSBorder = (function(_this) {
  return function(key_webele) {
    return setCSSBorder(key_webele);
  };
})(this);

setCSSBorder = (function(_this) {
  return function(key_webele) {
    var key_section, _i, _len, _ref, _results;
    _ref = data.css.border.section;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_section = _ref[_i];
      if (key_section !== "all") {
        $("[data-" + data.name + "='" + key_webele + "']").css("border-" + key_section, getBorderCSS(key_webele, key_section));
        _results.push($("[data-" + data.name + "='" + key_webele + "']").css(getRadiusCSSName(key_section), data.webele[key_webele][responsiveName][animationSelect].border[key_section].radius + "px"));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
})(this);

getBorderCSS = (function(_this) {
  return function(key_ele, key_section) {
    return data.webele[key_ele][responsiveName][animationSelect].border[key_section].width + "px " + data.webele[key_ele][responsiveName][animationSelect].border[key_section].style + " " + data.colorList[data.webele[key_ele][responsiveName][animationSelect].color.border];
  };
})(this);

getRadiusCSSName = function(key_section) {
  var radiusCSSName;
  radiusCSSName = "";
  switch (key_section) {
    case "left":
      return radiusCSSName = "border-top-left-radius";
    case "top":
      return radiusCSSName = "border-top-right-radius";
    case "right":
      return radiusCSSName = "border-bottom-right-radius";
    case "bottom":
      return radiusCSSName = "border-bottom-left-radius";
  }
};

exports.setCSSShadow = (function(_this) {
  return function(key_webele) {
    return setCSSShadow(key_webele);
  };
})(this);

setCSSShadow = (function(_this) {
  return function(key_webele) {
    var cssStr;
    cssStr = data.webele[key_webele][responsiveName][animationSelect].shadow.x + "px " + data.webele[key_webele][responsiveName][animationSelect].shadow.y + "px " + data.webele[key_webele][responsiveName][animationSelect].shadow.shade + "px " + data.webele[key_webele][responsiveName][animationSelect].shadow.size + "px " + data.colorList[data.webele[key_webele][responsiveName][animationSelect].color.shadow];
    if (data.webele[key_webele][responsiveName][animationSelect].shadow.inset < 0) {
      cssStr += " inset";
    }
    return $("[data-" + data.name + "='" + key_webele + "']").css("box-shadow", cssStr);
  };
})(this);

setCSSOpacity = (function(_this) {
  return function() {
    return $("[data-" + data.name + "='" + webeleName + "']").css("opacity", data.webele[webeleName][responsiveName][animationSelect].opacity.opacity);
  };
})(this);

exports.setCSSFont = (function(_this) {
  return function(key_webele) {
    return setCSSFont(key_webele);
  };
})(this);

setCSSFont = (function(_this) {
  return function(key_webele) {
    $("[data-" + data.name + "='" + key_webele + "']").css("text-align", data.webele[key_webele][responsiveName][animationSelect].font.align);
    $("[data-" + data.name + "='" + key_webele + "']").css("font-family", data.webele[key_webele][responsiveName][animationSelect].font.family);
    $("[data-" + data.name + "='" + key_webele + "']").css("font-size", data.webele[key_webele][responsiveName][animationSelect].font.size);
    $("[data-" + data.name + "='" + key_webele + "']").css("font-weight", data.webele[key_webele][responsiveName][animationSelect].font.weight);
    return $("[data-" + data.name + "='" + key_webele + "']").css("text-shadow", data.webele[key_webele][responsiveName][animationSelect].font.shadow1.x + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow1.y + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow1.shade + "px " + data.colorList[data.webele[key_webele][responsiveName][animationSelect].font.shadow1.color] + ", " + data.webele[key_webele][responsiveName][animationSelect].font.shadow2.x + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow2.y + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow2.shade + "px " + data.colorList[data.webele[key_webele][responsiveName][animationSelect].font.shadow2.color] + ", " + data.webele[key_webele][responsiveName][animationSelect].font.shadow3.x + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow3.y + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow3.shade + "px " + data.colorList[data.webele[key_webele][responsiveName][animationSelect].font.shadow3.color] + ", " + data.webele[key_webele][responsiveName][animationSelect].font.shadow4.x + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow4.y + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow4.shade + "px " + data.colorList[data.webele[key_webele][responsiveName][animationSelect].font.shadow4.color]);
  };
})(this);

setCSSSize = (function(_this) {
  return function() {
    $("[data-" + data.name + "='" + webeleName + "']").css("width", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].size.normal.width.val, data.webele[webeleName][responsiveName][animationSelect].size.normal.width.unit));
    $("[data-" + data.name + "='" + webeleName + "']").css("min-width", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].size.min.width.val, data.webele[webeleName][responsiveName][animationSelect].size.min.width.unit));
    $("[data-" + data.name + "='" + webeleName + "']").css("max-width", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].size.max.width.val, data.webele[webeleName][responsiveName][animationSelect].size.max.width.unit));
    $("[data-" + data.name + "='" + webeleName + "']").css("height", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].size.normal.height.val, data.webele[webeleName][responsiveName][animationSelect].size.normal.height.unit));
    $("[data-" + data.name + "='" + webeleName + "']").css("min-height", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].size.min.height.val, data.webele[webeleName][responsiveName][animationSelect].size.min.height.unit));
    return $("[data-" + data.name + "='" + webeleName + "']").css("max-height", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].size.max.height.val, data.webele[webeleName][responsiveName][animationSelect].size.max.height.unit));
  };
})(this);

setCSSSpace = (function(_this) {
  return function() {
    var key_section, _i, _len, _ref, _results;
    _ref = data.css.space.section;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_section = _ref[_i];
      if (key_section !== "all") {
        $("[data-" + data.name + "='" + webeleName + "']").css("margin-" + key_section, getUnitVal(data.webele[webeleName][responsiveName][animationSelect].space[key_section].margin.val, data.webele[webeleName][responsiveName][animationSelect].space[key_section].margin.unit));
        _results.push($("[data-" + data.name + "='" + webeleName + "']").css("padding-" + key_section, getUnitVal(data.webele[webeleName][responsiveName][animationSelect].space[key_section].padding.val, data.webele[webeleName][responsiveName][animationSelect].space[key_section].padding.unit)));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
})(this);

setCSSPosition = (function(_this) {
  return function() {
    $("[data-" + data.name + "='" + webeleName + "']").css("position", data.webele[webeleName][responsiveName][animationSelect].position.position);
    $("[data-" + data.name + "='" + webeleName + "']").css("display", data.webele[webeleName][responsiveName][animationSelect].position.display);
    $("[data-" + data.name + "='" + webeleName + "']").css("float", data.webele[webeleName][responsiveName][animationSelect].position.float);
    $("[data-" + data.name + "='" + webeleName + "']").css("clear", data.webele[webeleName][responsiveName][animationSelect].position.clear);
    $("[data-" + data.name + "='" + webeleName + "']").css("z-index", data.webele[webeleName][responsiveName][animationSelect].position["z-index"]);
    $("[data-" + data.name + "='" + webeleName + "']").css("top", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].position.top.val, data.webele[webeleName][responsiveName][animationSelect].position.top.unit));
    $("[data-" + data.name + "='" + webeleName + "']").css("left", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].position.left.val, data.webele[webeleName][responsiveName][animationSelect].position.left.unit));
    $("[data-" + data.name + "='" + webeleName + "']").css("bottom", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].position.bottom.val, data.webele[webeleName][responsiveName][animationSelect].position.bottom.unit));
    $("[data-" + data.name + "='" + webeleName + "']").css("right", getUnitVal(data.webele[webeleName][responsiveName][animationSelect].position.right.val, data.webele[webeleName][responsiveName][animationSelect].position.right.unit));
    $("[data-" + data.name + "='" + webeleName + "']").css("overflow-x", data.webele[webeleName][responsiveName][animationSelect].position["overflow-x"]);
    return $("[data-" + data.name + "='" + webeleName + "']").css("overflow-y", data.webele[webeleName][responsiveName][animationSelect].position["overflow-y"]);
  };
})(this);

setCSSTransform = (function(_this) {
  return function() {
    var bender, _i, _len, _ref, _results;
    _ref = ["transform", "WebkitTransform", "-moz-transform"];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bender = _ref[_i];
      $("[data-" + data.name + "='" + webeleName + "']").css(bender, "rotate3d(1,0,0," + data.webele[webeleName][responsiveName][animationSelect].transform.rotateX + "deg)" + "rotate3d(0,1,0," + data.webele[webeleName][responsiveName][animationSelect].transform.rotateY + "deg)" + "rotate3d(0,0,1," + data.webele[webeleName][responsiveName][animationSelect].transform.rotateZ + "deg)" + "scale(" + data.webele[webeleName][responsiveName][animationSelect].transform.scale + ")" + "skew(" + data.webele[webeleName][responsiveName][animationSelect].transform.skewX + "deg, " + data.webele[webeleName][responsiveName][animationSelect].transform.skewY + "deg)" + "translate(" + data.webele[webeleName][responsiveName][animationSelect].transform.translateX + "px, " + data.webele[webeleName][responsiveName][animationSelect].transform.translateY + "px)");
      _results.push($("[data-" + data.name + "='" + webeleName + "']").css(bender + "-origin", data.webele[webeleName][responsiveName][animationSelect].transform.originX + "% " + data.webele[webeleName][responsiveName][animationSelect].transform.originY + "%"));
    }
    return _results;
  };
})(this);

exports.setCSSGradient = (function(_this) {
  return function(key_webele) {
    return setCSSGradient(key_webele);
  };
})(this);

setCSSGradient = (function(_this) {
  return function() {
    var cssData;
    cssData = data.webele[webeleName][responsiveName][animationSelect].gradient;
    if (cssData.direction === "circle") {
      return $("[data-" + data.name + "='" + webeleName + "']").css({
        "background-image": "radial-gradient(" + data.colorList[cssData.color1.color + "_" + cssData.color1.method] + " " + cssData.percent[0] + "%," + data.colorList[cssData.color2.color + "_" + cssData.color2.method] + " " + cssData.percent[1] + "%," + data.colorList[cssData.color3.color + "_" + cssData.color3.method] + " 100%"
      });
    } else {
      return $("[data-" + data.name + "='" + webeleName + "']").css({
        "background-image": "linear-gradient(to " + cssData.direction + "," + data.colorList[cssData.color1.color + "_" + cssData.color1.method] + " " + cssData.percent[0] + "%," + data.colorList[cssData.color2.color + "_" + cssData.color2.method] + " " + cssData.percent[1] + "%," + data.colorList[cssData.color3.color + "_" + cssData.color3.method] + " 100%"
      });
    }
  };
})(this);

setCSSBackground = (function(_this) {
  return function() {
    $("[data-" + data.name + "='" + webeleName + "']").css("background-repeat", data.webele[webeleName][responsiveName][animationSelect].background.repeat);
    $("[data-" + data.name + "='" + webeleName + "']").css("background-attachment", data.webele[webeleName][responsiveName][animationSelect].background.attachment);
    return $("[data-" + data.name + "='" + webeleName + "']").css("background-position", data.webele[webeleName][responsiveName][animationSelect].background.directionX + " " + getUnitVal(data.webele[webeleName][responsiveName][animationSelect].background.x.val, data.webele[webeleName][responsiveName][animationSelect].background.x.unit) + " " + data.webele[webeleName][responsiveName][animationSelect].background.directionY + " " + getUnitVal(data.webele[webeleName][responsiveName][animationSelect].background.y.val, data.webele[webeleName][responsiveName][animationSelect].background.y.unit));
  };
})(this);

exports.setCSSAnimation = (function(_this) {
  return function(key_webele) {
    return setCSSAnimation(key_webele);
  };
})(this);

setCSSAnimation = (function(_this) {
  return function(key_webele) {
    var bender, css, getBorder, key_section, str, str_time, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    getBorder = function(key_ele, key_section) {
      return data.webele[key_ele][responsiveName]["end"].border[key_section].width + "px " + data.webele[key_ele][responsiveName]["end"].border[key_section].style + " " + data.colorList[data.webele[key_ele][responsiveName]["end"].color.border];
    };
    css = document.styleSheets[document.styleSheets.length - 1];
    str_time = "[data-webele=\"" + key_webele + "\"]{" + "-webkit-transition: all " + data.webele[key_webele][responsiveName].time + "s ease-in-out;" + "-moz-transition: all " + data.webele[key_webele][responsiveName].time + "s ease-in-out;" + "-o-transition: all " + data.webele[key_webele][responsiveName].time + "s ease-in-out;" + "transition: all " + data.webele[key_webele][responsiveName].time + "s ease-in-out;" + "}";
    css.insertRule(str_time, css.cssRules.length);
    str = "background-color: " + data.colorList[data.webele[key_webele][responsiveName]["end"].color.BG] + "!important; ";
    str += "color: " + data.colorList[data.webele[key_webele][responsiveName]["end"].color.text] + "!important; ";
    _ref = data.css.border.section;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_section = _ref[_i];
      if (key_section !== "all") {
        str += "border-" + key_section + ": " + getBorder(key_webele, key_section) + "!important; ";
        str += getRadiusCSSName(key_section) + ": " + data.webele[key_webele][responsiveName]["end"].border[key_section].radius + "px" + "!important; ";
      }
    }
    str += "box-shadow: " + data.webele[key_webele][responsiveName]["end"].shadow.x + "px " + data.webele[key_webele][responsiveName]["end"].shadow.y + "px " + data.webele[key_webele][responsiveName]["end"].shadow.shade + "px " + data.webele[key_webele][responsiveName]["end"].shadow.size + "px " + data.colorList[data.webele[key_webele][responsiveName]["end"].color.shadow];
    if (data.webele[key_webele][responsiveName]["end"].shadow.inset < 0) {
      str += " inset";
    }
    str += " !important; ";
    str += "opacity: " + data.webele[key_webele][responsiveName]["end"].opacity.opacity;
    str += " !important; ";
    str += "font-size: " + data.webele[key_webele][responsiveName]["end"].font.size + "px";
    str += " !important; ";
    str += "text-shadow: " + data.webele[key_webele][responsiveName]["end"].font.shadow1.x + "px " + data.webele[key_webele][responsiveName]["end"].font.shadow1.y + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow1.shade + "px " + data.colorList[data.webele[key_webele][responsiveName][animationSelect].font.shadow1.color] + ", " + data.webele[key_webele][responsiveName]["end"].font.shadow2.x + "px " + data.webele[key_webele][responsiveName]["end"].font.shadow2.y + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow2.shade + "px " + data.colorList[data.webele[key_webele][responsiveName][animationSelect].font.shadow2.color] + ", " + data.webele[key_webele][responsiveName]["end"].font.shadow3.x + "px " + data.webele[key_webele][responsiveName]["end"].font.shadow3.y + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow3.shade + "px " + data.colorList[data.webele[key_webele][responsiveName][animationSelect].font.shadow3.color] + ", " + data.webele[key_webele][responsiveName]["end"].font.shadow4.x + "px " + data.webele[key_webele][responsiveName]["end"].font.shadow4.y + "px " + data.webele[key_webele][responsiveName][animationSelect].font.shadow4.shade + "px " + data.colorList[data.webele[key_webele][responsiveName][animationSelect].font.shadow4.color];
    str += " !important; ";
    str += "width: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].size.normal.width.val, data.webele[key_webele][responsiveName]["end"].size.normal.width.unit);
    str += " !important; ";
    str += "min-width: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].size.min.width.val, data.webele[key_webele][responsiveName]["end"].size.min.width.unit);
    str += " !important; ";
    str += "max-width: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].size.max.width.val, data.webele[key_webele][responsiveName]["end"].size.max.width.unit);
    str += " !important; ";
    str += "height: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].size.normal.height.val, data.webele[key_webele][responsiveName]["end"].size.normal.height.unit);
    str += " !important; ";
    str += "min-height: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].size.min.height.val, data.webele[key_webele][responsiveName]["end"].size.min.height.unit);
    str += " !important; ";
    str += "max-height: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].size.max.height.val, data.webele[key_webele][responsiveName]["end"].size.max.height.unit);
    str += " !important; ";
    _ref1 = data.css.space.section;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      key_section = _ref1[_j];
      if (key_section !== "all") {
        str += "margin-" + key_section + ": " + getUnitVal(data.webele[key_webele][responsiveName]["end"].space[key_section].margin.val, data.webele[key_webele][responsiveName]["end"].space[key_section].margin.unit);
        str += " !important; ";
        str += "padding-" + key_section + ": " + getUnitVal(data.webele[key_webele][responsiveName]["end"].space[key_section].padding.val, data.webele[key_webele][responsiveName]["end"].space[key_section].padding.unit);
        str += " !important; ";
      }
    }
    str += "position: " + data.webele[key_webele][responsiveName]["end"].position.position;
    str += " !important; ";
    str += "display: " + data.webele[key_webele][responsiveName]["end"].position.display;
    str += " !important; ";
    str += "float: " + data.webele[key_webele][responsiveName]["end"].position.float;
    str += " !important; ";
    str += "clear: " + data.webele[key_webele][responsiveName]["end"].position.clear;
    str += " !important; ";
    str += "z-index: " + data.webele[key_webele][responsiveName]["end"].position["z-index"];
    str += " !important; ";
    str += "top: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].position.top.val, data.webele[key_webele][responsiveName]["end"].position.top.unit);
    str += " !important; ";
    str += "left: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].position.left.val, data.webele[key_webele][responsiveName]["end"].position.left.unit);
    str += " !important; ";
    str += "bottom: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].position.bottom.val, data.webele[key_webele][responsiveName]["end"].position.bottom.unit);
    str += " !important; ";
    str += "right: " + getUnitVal(data.webele[key_webele][responsiveName]["end"].position.right.val, data.webele[key_webele][responsiveName]["end"].position.right.unit);
    str += " !important; ";
    str += "overflow-x: " + data.webele[key_webele][responsiveName]["end"].position["overflow-x"];
    str += " !important; ";
    str += "overflow-y: " + data.webele[key_webele][responsiveName]["end"].position["overflow-y"];
    str += " !important; ";
    _ref2 = ["transform", "WebkitTransform", "-moz-transform", "-webkit-transform", "-o-transform:", "-ms-transform"];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      bender = _ref2[_k];
      str += bender + ": " + "rotate3d(1,0,0," + data.webele[key_webele][responsiveName]["end"].transform.rotateX + "deg) " + "rotate3d(0,1,0," + data.webele[key_webele][responsiveName]["end"].transform.rotateY + "deg) " + "rotate3d(0,0,1," + data.webele[key_webele][responsiveName]["end"].transform.rotateZ + "deg) " + "scale(" + data.webele[key_webele][responsiveName]["end"].transform.scale + ") " + "skew(" + data.webele[key_webele][responsiveName]["end"].transform.skewX + "deg, " + data.webele[key_webele][responsiveName]["end"].transform.skewY + "deg) " + "translate(" + data.webele[key_webele][responsiveName]["end"].transform.translateX + "px, " + data.webele[key_webele][responsiveName]["end"].transform.translateY + "px)";
      str += " !important; ";
    }
    str += "background-position: " + data.webele[key_webele][responsiveName]["end"].background.directionX + " " + getUnitVal(data.webele[key_webele][responsiveName]["end"].background.x.val, data.webele[key_webele][responsiveName]["end"].background.x.unit) + " " + data.webele[key_webele][responsiveName]["end"].background.directionY + " " + getUnitVal(data.webele[key_webele][responsiveName]["end"].background.y.val, data.webele[key_webele][responsiveName]["end"].background.y.unit);
    str += " !important; ";
    if (data.webele[key_webele][responsiveName].trigger !== "none") {
      return css.insertRule("[data-webele=\"" + webeleName + "\"]:" + data.webele[key_webele][responsiveName].trigger + "{" + str + "}", css.cssRules.length);
    }
  };
})(this);

exports.generateStylus = function() {
  var getBackground, getBorder, getColor, getFont, getGradiente, getOpacity, getPosition, getShadow, getSize, getSpace, getTransform, key_anime, key_ele, key_res, str, stylus, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
  getColor = function(key_ele, key_res, key_anime) {
    var str;
    str = "";
    str += "\t\t" + "background-color: " + data.colorList[data.webele[key_ele][key_res][key_anime].color.BG] + "\n";
    str += "\t\t" + "color: " + data.colorList[data.webele[key_ele][key_res][key_anime].color.text] + "\n";
    str += "\t\t" + "a" + "\n";
    str += "\t\t\t" + "color: " + data.colorList[data.webele[key_ele][key_res][key_anime].color.link] + "!important\n";
    str += "\t\t\t" + "&:hover" + "\n";
    str += "\t\t\t\t" + "color: " + data.colorList[data.webele[key_ele][key_res][key_anime].color.hlink] + "!important\n";
    return str;
  };
  getBorder = function(key_ele, key_res, key_anime) {
    var key_section, str, _i, _len, _ref;
    str = "";
    _ref = data.css.border.section;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_section = _ref[_i];
      if (key_section !== "all") {
        str += "\t\t" + "border-" + key_section + ": " + getBorderCSS(key_ele, key_section) + "\n";
        str += "\t\t" + getRadiusCSSName(key_section) + ": " + data.webele[key_ele][key_res][key_anime].border[key_section].radius + "px" + "\n";
      }
    }
    return str;
  };
  getShadow = function(key_ele, key_res, key_anime) {
    var str;
    str = "";
    str += "\t\t" + "box-shadow: " + data.webele[key_ele][key_res][key_anime].shadow.x + "px " + data.webele[key_ele][key_res][key_anime].shadow.y + "px " + data.webele[key_ele][key_res][key_anime].shadow.shade + "px " + data.webele[key_ele][key_res][key_anime].shadow.size + "px " + data.colorList[data.webele[key_ele][key_res][key_anime].color.shadow];
    if (data.webele[key_ele][key_res][key_anime].shadow.inset < 0) {
      str += " inset";
    }
    str += "\n";
    return str;
  };
  getFont = function(key_ele, key_res, key_anime) {
    var str;
    str = "";
    str += "\t\t" + "text-align: " + data.webele[key_ele][key_res][key_anime].font.align + "\n";
    str += "\t\t" + "font-family: " + data.webele[key_ele][key_res][key_anime].font.family + "\n";
    str += "\t\t" + "font-size: " + data.webele[key_ele][key_res][key_anime].font.size + "px \n";
    str += "\t\t" + "font-weight: " + data.webele[key_ele][key_res][key_anime].font.weight + "\n";
    str += "\t\t" + "font-shadow: " + data.webele[key_ele][key_res][key_anime].font.shadow1.x + "px " + data.webele[key_ele][key_res][key_anime].font.shadow1.y + "px " + data.webele[key_ele][key_res][key_anime].font.shadow1.shade + "px " + data.colorList[data.webele[key_ele][key_res][key_anime].font.shadow1.color] + ", " + data.webele[key_ele][key_res][key_anime].font.shadow2.x + "px " + data.webele[key_ele][key_res][key_anime].font.shadow2.y + "px " + data.webele[key_ele][key_res][key_anime].font.shadow2.shade + "px " + data.colorList[data.webele[key_ele][key_res][key_anime].font.shadow2.color] + ", " + data.webele[key_ele][key_res][key_anime].font.shadow3.x + "px " + data.webele[key_ele][key_res][key_anime].font.shadow3.y + "px " + data.webele[key_ele][key_res][key_anime].font.shadow3.shade + "px " + data.colorList[data.webele[key_ele][key_res][key_anime].font.shadow3.color] + ", " + data.webele[key_ele][key_res][key_anime].font.shadow4.x + "px " + data.webele[key_ele][key_res][key_anime].font.shadow4.y + "px " + data.webele[key_ele][key_res][key_anime].font.shadow4.shade + "px " + data.colorList[data.webele[key_ele][key_res][key_anime].font.shadow4.color] + "\n";
    return str;
  };
  getSpace = function(key_ele, key_res, key_anime) {
    var key_section, str, _i, _len, _ref;
    str = "";
    _ref = data.css.space.section;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_section = _ref[_i];
      if (key_section !== "all") {
        str += "\t\t" + "margin-" + key_section + ": " + getUnitVal(data.webele[key_ele][key_res][key_anime].space[key_section].margin.val, data.webele[key_ele][key_res][key_anime].space[key_section].margin.unit) + "\n";
        str += "\t\t" + "padding-" + key_section + ": " + getUnitVal(data.webele[key_ele][key_res][key_anime].space[key_section].padding.val, data.webele[key_ele][key_res][key_anime].space[key_section].padding.unit) + "\n";
      }
    }
    return str;
  };
  getSize = function(key_ele, key_res, key_anime) {
    var str;
    str = "";
    str += "\t\t" + "width: " + getUnitVal(data.webele[key_ele][key_res][key_anime].size.normal.width.val, data.webele[key_ele][key_res][key_anime].size.normal.width.unit) + "\n";
    str += "\t\t" + "min-width: " + getUnitVal(data.webele[key_ele][key_res][key_anime].size.min.width.val, data.webele[key_ele][key_res][key_anime].size.min.width.unit) + "\n";
    str += "\t\t" + "max-width: " + getUnitVal(data.webele[key_ele][key_res][key_anime].size.max.width.val, data.webele[key_ele][key_res][key_anime].size.max.width.unit) + "\n";
    str += "\t\t" + "height: " + getUnitVal(data.webele[key_ele][key_res][key_anime].size.normal.height.val, data.webele[key_ele][key_res][key_anime].size.normal.height.unit) + "\n";
    str += "\t\t" + "min-height: " + getUnitVal(data.webele[key_ele][key_res][key_anime].size.min.height.val, data.webele[key_ele][key_res][key_anime].size.min.height.unit) + "\n";
    str += "\t\t" + "max-height: " + getUnitVal(data.webele[key_ele][key_res][key_anime].size.max.height.val, data.webele[key_ele][key_res][key_anime].size.max.height.unit) + "\n";
    return str;
  };
  getOpacity = function(key_ele, key_res, key_anime) {
    var str;
    str = "";
    str += "\t\t" + "opcaity: " + data.webele[key_ele][key_res][key_anime].opacity.opacity + "\n";
    return str;
  };
  getPosition = function(key_ele, key_res, key_anime) {
    var str;
    str = "";
    str += "\t\t" + "position: " + data.webele[key_ele][key_res][key_anime].position.position + "\n";
    str += "\t\t" + "overflow-x: " + data.webele[key_ele][key_res][key_anime].position.display + "\n";
    str += "\t\t" + "overflow-y: " + data.webele[key_ele][key_res][key_anime].position["overflow-x"] + "\n";
    str += "\t\t" + "display: " + data.webele[key_ele][key_res][key_anime].position["overflow-y"] + "\n";
    str += "\t\t" + "clear: " + data.webele[key_ele][key_res][key_anime].position.clear + "\n";
    str += "\t\t" + "float: " + data.webele[key_ele][key_res][key_anime].position.float + "\n";
    str += "\t\t" + "z-index: " + data.webele[key_ele][key_res][key_anime].position["z-index"] + "\n";
    str += "\t\t" + "top: " + getUnitVal(data.webele[key_ele][key_res][key_anime].position.top.val, data.webele[webeleName][responsiveName][animationSelect].position.top.unit) + "\n";
    str += "\t\t" + "left: " + getUnitVal(data.webele[key_ele][key_res][key_anime].position.left.val, data.webele[webeleName][responsiveName][animationSelect].position.left.unit) + "\n";
    str += "\t\t" + "bottom: " + getUnitVal(data.webele[key_ele][key_res][key_anime].position.bottom.val, data.webele[webeleName][responsiveName][animationSelect].position.bottom.unit) + "\n";
    str += "\t\t" + "right: " + getUnitVal(data.webele[key_ele][key_res][key_anime].position.right.val, data.webele[webeleName][responsiveName][animationSelect].position.right.unit) + "\n";
    return str;
  };
  getTransform = function(key_ele, key_res, key_anime) {
    var str;
    str = "";
    str += "\t\t" + "transform: " + "rotate3d(1,0,0," + data.webele[key_ele][key_res][key_anime].transform.rotateX + "deg) " + "rotate3d(0,1,0," + data.webele[key_ele][key_res][key_anime].transform.rotateY + "deg) " + "rotate3d(0,0,1," + data.webele[key_ele][key_res][key_anime].transform.rotateZ + "deg) " + "scale(" + data.webele[key_ele][key_res][key_anime].transform.scale + ") " + "skew(" + data.webele[key_ele][key_res][key_anime].transform.skewX + "deg, " + data.webele[webeleName][responsiveName][animationSelect].transform.skewY + "deg) " + "translate(" + data.webele[key_ele][key_res][key_anime].transform.translateX + "px, " + data.webele[webeleName][responsiveName][animationSelect].transform.translateY + "px)" + "\n";
    return str;
  };
  getGradiente = function(key_ele, key_res, key_anime) {
    var cssData, str;
    str = "";
    cssData = data.webele[key_ele][key_res][key_anime].gradient;
    if (cssData.direction !== "none") {
      if (cssData.direction === "circle") {
        str += "\t\t" + "background: " + "radial-gradient(" + data.colorList[cssData.color1.color + "_" + cssData.color1.method] + " " + cssData.percent[0] + "%," + data.colorList[cssData.color2.color + "_" + cssData.color2.method] + " " + cssData.percent[1] + "%," + data.colorList[cssData.color3.color + "_" + cssData.color3.method] + " 100%)\n";
      } else {
        str += "\t\t" + "background: " + "linear-gradient(to " + cssData.direction + "," + data.colorList[cssData.color1.color + "_" + cssData.color1.method] + " " + cssData.percent[0] + "%," + data.colorList[cssData.color2.color + "_" + cssData.color2.method] + " " + cssData.percent[1] + "%," + data.colorList[cssData.color3.color + "_" + cssData.color3.method] + " 100%)\n";
      }
    }
    return str;
  };
  getBackground = function(key_ele, key_res, key_anime) {
    var str;
    str = "";
    str += "\t\t" + "background-repeat: " + data.webele[key_ele][key_res][key_anime].background.repeat + "\n";
    str += "\t\t" + "background-attachment: " + data.webele[key_ele][key_res][key_anime].background.attachment + "\n";
    str += "\t\t" + "background-position: " + data.webele[key_ele][key_res][key_anime].background.directionX + " " + getUnitVal(data.webele[key_ele][key_res][key_anime].background.x.val, data.webele[key_ele][key_res][key_anime].background.x.unit) + " " + data.webele[key_ele][key_res][key_anime].background.directionY + " " + getUnitVal(data.webele[key_ele][key_res][key_anime].background.y.val, data.webele[key_ele][key_res][key_anime].background.y.unit) + "\n";
    return str;
  };
  stylus = "";
  _ref = data.eleList;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key_ele = _ref[_i];
    str = "[data-webele=\"" + key_ele + "\"]\n";
    _ref1 = data.css.responsive;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      key_res = _ref1[_j];
      if (key_res !== "all") {
        if (key_res === getResponsiveMax(key_res)) {
          key_anime = "start";
          str += "\t" + "@media (min-width: " + web.size.getWidthFromInnerWidthName_Min(key_res) + "px)\n";
          str += getColor(key_ele, key_res, key_anime);
          str += getBorder(key_ele, key_res, key_anime);
          str += getShadow(key_ele, key_res, key_anime);
          str += getFont(key_ele, key_res, key_anime);
          str += getSpace(key_ele, key_res, key_anime);
          str += getSize(key_ele, key_res, key_anime);
          str += getOpacity(key_ele, key_res, key_anime);
          str += getPosition(key_ele, key_res, key_anime);
          str += getTransform(key_ele, key_res, key_anime);
          str += getGradiente(key_ele, key_res, key_anime);
          str += getBackground(key_ele, key_res, key_anime);
          str += "\t\t" + "-webkit-transition: all " + data.webele[key_ele][key_res].time + "s ease-in-out" + "\n";
        }
      }
    }
    if (data.webele[key_ele][key_res].trigger !== "none") {
      str += "[data-webele=\"" + key_ele + "\"]:" + data.webele[key_ele][key_res].trigger + "\n";
      _ref2 = data.css.responsive;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        key_res = _ref2[_k];
        if (key_res !== "all") {
          if (key_res === getResponsiveMax(key_res)) {
            key_anime = "end";
            str += "\t" + "@media (min-width: " + web.size.getWidthFromInnerWidthName_Min(key_res) + "px)\n";
            str += getColor(key_ele, key_res, key_anime);
            str += getBorder(key_ele, key_res, key_anime);
            str += getShadow(key_ele, key_res, key_anime);
            str += getFont(key_ele, key_res, key_anime);
            str += getSpace(key_ele, key_res, key_anime);
            str += getSize(key_ele, key_res, key_anime);
            str += getOpacity(key_ele, key_res, key_anime);
            str += getPosition(key_ele, key_res, key_anime);
            str += getTransform(key_ele, key_res, key_anime);
            str += getGradiente(key_ele, key_res, key_anime);
            str += getBackground(key_ele, key_res, key_anime);
          }
        }
      }
    }
    stylus = stylus + str;
  }
  return stylus;
};

setData = function() {
  var setAnimation, setBackground, setBorder, setColor, setFont, setGradient, setPosition, setRangeAndInput, setSectionAndUnitVal, setSelect;
  setColor = function() {
    var colorName, colorNameSplit, key, _ref, _results;
    _ref = data.webele[webeleName][responsiveSelect][animationSelect].color;
    _results = [];
    for (key in _ref) {
      colorName = _ref[key];
      colorNameSplit = colorName.split("_");
      $('select[id=\"' + key + '_selectColor\"]').val(colorNameSplit[0]);
      _results.push($('select[id=\"' + key + '_selectColorMethod\"]').val(colorNameSplit[1]));
    }
    return _results;
  };
  setBorder = function() {
    var key_param, key_section, uiName, _i, _len, _ref, _results;
    _ref = data.css.border.section;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_section = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = data.css.border.param;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          key_param = _ref1[_j];
          uiName = key_section + "_" + key_param + "_border_";
          _results1.push(setBorderValToUI(uiName, key_param, data.webele[webeleName][responsiveSelect][animationSelect].border[key_section][key_param]));
        }
        return _results1;
      })());
    }
    return _results;
  };
  setRangeAndInput = function(data, cssData) {
    var key, uiName, _i, _len, _ref, _results;
    _ref = cssData.param;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      uiName = key + "_" + cssData.name;
      $("#" + uiName + "_range").slider({
        value: data[key]
      });
      _results.push($("#" + uiName + "_rangeInput").val(data[key]));
    }
    return _results;
  };
  setFont = function() {
    var key_param, key_shadow, uiName, _i, _len, _ref, _results;
    _ref = data.css.font.param;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_param = _ref[_i];
      if (key_param.indexOf("shadow") !== -1) {
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = data.css.font.shadow.param;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            key_shadow = _ref1[_j];
            uiName = key_param + "_" + key_shadow + "_font_";
            _results1.push(setFontValToUI(uiName, key_shadow, data.webele[webeleName][responsiveSelect][animationSelect].font[key_param][key_shadow]));
          }
          return _results1;
        })());
      } else {
        uiName = key_param + "_font_";
        _results.push(setFontValToUI(uiName, key_param, data.webele[webeleName][responsiveSelect][animationSelect].font[key_param]));
      }
    }
    return _results;
  };
  setSectionAndUnitVal = function(data, cssData) {
    var key_param, key_section, uiName, _i, _len, _ref, _results;
    _ref = cssData.section;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_section = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = cssData.param;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          key_param = _ref1[_j];
          uiName = key_section + "_" + key_param + "_" + cssData.name + "_";
          setUnitValToUI(uiName, data[key_section][key_param].val);
          _results1.push(setUnitValToUI(uiName, data[key_section][key_param].unit, true));
        }
        return _results1;
      })());
    }
    return _results;
  };
  setSelect = function(data, css) {
    var key_param, uiName, _i, _len, _ref, _results;
    _ref = css.param;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_param = _ref[_i];
      uiName = key_param + "_" + css.name + "_";
      _results.push($("#" + uiName + "select_" + key_param).val(data[key_param]));
    }
    return _results;
  };
  setPosition = function() {
    var key_param, uiName, _i, _len, _ref, _results;
    _ref = data.css.position.param;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_param = _ref[_i];
      if (key_param === "z-index") {
        uiName = key_param + "_" + data.css.position.name;
        $("#" + uiName + "_range").slider({
          value: data.webele[webeleName][responsiveSelect][animationSelect].position[key_param]
        });
        _results.push($("#" + uiName + "_rangeInput").val(data.webele[webeleName][responsiveSelect][animationSelect].position[key_param]));
      } else if (key_param === "top" || key_param === "left" || key_param === "bottom" || key_param === "right") {
        uiName = key_param + "_" + data.css.position.name + "_";
        setUnitValToUI(uiName, data.webele[webeleName][responsiveSelect][animationSelect].position[key_param].val);
        _results.push(setUnitValToUI(uiName, data.webele[webeleName][responsiveSelect][animationSelect].position[key_param].unit, true));
      } else {
        uiName = key_param + "_" + data.css.position.name + "_";
        _results.push($("#" + uiName + "select").val(data.webele[webeleName][responsiveSelect][animationSelect].position[key_param]));
      }
    }
    return _results;
  };
  setGradient = function() {
    var key_param, uiName, _i, _len, _ref, _results;
    _ref = data.css.gradient.param;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_param = _ref[_i];
      uiName = key_param + "_" + data.css.gradient.name + "_";
      if (key_param.indexOf("color") !== -1) {
        $('select[id=\"' + uiName + 'selectColor\"]').val(data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param].color);
        _results.push($('select[id=\"' + uiName + 'selectColorMethod\"]').val(data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param].method));
      } else if (key_param === "direction") {
        _results.push($('select[id=\"' + uiName + 'select\"]').val(data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param]));
      } else {
        $("#" + uiName + "range").slider({
          values: data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param]
        });
        _results.push($("#" + uiName + "rangeInput").val(data.webele[webeleName][responsiveSelect][animationSelect].gradient[key_param]));
      }
    }
    return _results;
  };
  setBackground = function() {
    var key_param, uiName, _i, _len, _ref, _results;
    _ref = data.css.background.param;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_param = _ref[_i];
      if (key_param === "x" || key_param === "y") {
        uiName = key_param + "_" + data.css.background.name + "_";
        setUnitValToUI(uiName, data.webele[webeleName][responsiveSelect][animationSelect].background[key_param].val);
        _results.push(setUnitValToUI(uiName, data.webele[webeleName][responsiveSelect][animationSelect].background[key_param].unit, true));
      } else {
        uiName = key_param + "_" + data.css.background.name + "_";
        _results.push($("#" + uiName + "select").val(data.webele[webeleName][responsiveSelect][animationSelect].background[key_param]));
      }
    }
    return _results;
  };
  setAnimation = function() {
    var key_param, uiName, _i, _len, _ref, _results;
    _ref = data.css.animation.param;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_param = _ref[_i];
      uiName = key_param + "_" + data.css.animation.name + "_";
      if (key_param === "trigger") {
        _results.push($('select[id=\"' + uiName + 'select\"]').val(data.webele[webeleName][responsiveSelect][key_param]));
      } else {
        $("#" + uiName + "range").slider({
          values: data.webele[webeleName][responsiveSelect][key_param]
        });
        _results.push($("#" + uiName + "rangeInput").val(data.webele[webeleName][responsiveSelect][key_param]));
      }
    }
    return _results;
  };
  $("#webeleName_input").val(webeleName);
  $("#responsiveMax_select").val(data.responsiveMax);
  setColor();
  setBorder();
  setRangeAndInput(data.webele[webeleName][responsiveSelect][animationSelect].shadow, data.css.shadow);
  setRangeAndInput(data.webele[webeleName][responsiveSelect][animationSelect].opacity, data.css.opacity);
  setRangeAndInput(data.webele[webeleName][responsiveSelect][animationSelect].transform, data.css.transform);
  setFont();
  setSectionAndUnitVal(data.webele[webeleName][responsiveSelect][animationSelect].space, data.css.space);
  setSectionAndUnitVal(data.webele[webeleName][responsiveSelect][animationSelect].size, data.css.size);
  setPosition();
  setGradient();
  setBackground();
  return setAnimation();
};

setSliderValFromUI = function(id, val, data) {
  var splitStr;
  splitStr = id.split("_");
  return data[splitStr[0]] = val;
};

setUnitValToUI = function(uiName, val, isSelect) {
  if (isSelect) {
    return $("#" + uiName + "selectUnit").val(val);
  } else {
    $("#" + uiName + "range").slider({
      value: val
    });
    return $("#" + uiName + "rangeInput").val(val);
  }
};

getUnitVal = function(val, unit) {
  if (unit === "auto") {
    return "auto";
  } else if (unit === "per") {
    return val + "%";
  } else if (unit === "none") {
    return "none";
  } else {
    return val + "px";
  }
};

setBorderValToUI = function(uiName, key_param, val) {
  if (key_param === "style") {
    return $("#" + uiName + "select").val(val);
  } else {
    $("#" + uiName + "range").slider({
      value: val
    });
    return $("#" + uiName + "rangeInput").val(val);
  }
};

setBorderValFromUI = function(id, val) {
  var key_section, key_val, setAllRange;
  setAllRange = function(key_val, val) {
    var key_section, uiName, _i, _len, _ref, _results;
    _ref = data.css.border.section;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_section = _ref[_i];
      data.webele[webeleName][responsiveSelect][animationSelect].border[key_section][key_val] = val;
      uiName = key_section + "_" + key_val + "_border_";
      _results.push(setBorderValToUI(uiName, key_val, val));
    }
    return _results;
  };
  key_section = id.split("_")[0];
  key_val = id.split("_")[1];
  if (key_section === "all") {
    return setAllRange(key_val, val);
  } else {
    return data.webele[webeleName][responsiveSelect][animationSelect].border[key_section][key_val] = val;
  }
};

setFontValToUI = function(uiName, key_param, val) {
  var colorName;
  if (key_param === "family" || key_param === "align") {
    return $("#" + uiName + "select_" + key_param).val(val);
  } else if (key_param === "color") {
    colorName = val.split("_");
    $("#" + uiName + "selectBaseColor").val(colorName[0]);
    return $("#" + uiName + "selectSiderColor").val(colorName[1]);
  } else {
    $("#" + uiName + "range").slider({
      value: val
    });
    return $("#" + uiName + "rangeInput").val(val);
  }
};

setFontValFromUI = function(id, val) {
  var key_shadow, key_val;
  key_val = id.split("_")[0];
  key_shadow = id.split("_")[1];
  if (key_val.indexOf("shadow") !== -1) {
    return data.webele[webeleName][responsiveSelect][animationSelect].font[key_val][key_shadow] = val;
  } else {
    return data.webele[webeleName][responsiveSelect][animationSelect].font[key_val] = val;
  }
};

setSpaceValFromUI = function(id, val, isSelect) {
  var key_section, key_val, setAllRange;
  setAllRange = function(key_val, val, isSelect) {
    var key_section, uiName, _i, _len, _ref, _results;
    _ref = data.css.space.section;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key_section = _ref[_i];
      uiName = key_section + "_" + key_val + "_space_";
      if (isSelect) {
        data.webele[webeleName][responsiveSelect][animationSelect].space[key_section][key_val].unit = val;
      } else {
        data.webele[webeleName][responsiveSelect][animationSelect].space[key_section][key_val].val = val;
      }
      _results.push(setUnitValToUI(uiName, val, isSelect));
    }
    return _results;
  };
  key_section = id.split("_")[0];
  key_val = id.split("_")[1];
  if (key_section === "all") {
    return setAllRange(key_val, val, isSelect);
  } else {
    if (isSelect) {
      return data.webele[webeleName][responsiveSelect][animationSelect].space[key_section][key_val].unit = val;
    } else {
      return data.webele[webeleName][responsiveSelect][animationSelect].space[key_section][key_val].val = val;
    }
  }
};

setSizeValFromUI = function(id, val, isSelect) {
  var key_section, key_val;
  key_section = id.split("_")[0];
  key_val = id.split("_")[1];
  if (isSelect) {
    return data.webele[webeleName][responsiveSelect][animationSelect].size[key_section][key_val].unit = val;
  } else {
    return data.webele[webeleName][responsiveSelect][animationSelect].size[key_section][key_val].val = val;
  }
};

setPositionValFromUI = function(id, val, isSelect) {
  var key_val;
  key_val = id.split("_")[0];
  if (key_val === "top" || key_val === "left" || key_val === "bottom" || key_val === "right") {
    if (isSelect) {
      return data.webele[webeleName][responsiveSelect][animationSelect].position[key_val].unit = val;
    } else {
      return data.webele[webeleName][responsiveSelect][animationSelect].position[key_val].val = val;
    }
  } else {
    return data.webele[webeleName][responsiveSelect][animationSelect].position[key_val] = val;
  }
};

setBackgroundValFromUI = function(id, val, isSelect) {
  var key_val;
  key_val = id.split("_")[0];
  if (key_val === "x" || key_val === "y") {
    if (isSelect) {
      return data.webele[webeleName][responsiveSelect][animationSelect].background[key_val].unit = val;
    } else {
      return data.webele[webeleName][responsiveSelect][animationSelect].background[key_val].val = val;
    }
  } else {
    return data.webele[webeleName][responsiveSelect][animationSelect].background[key_val] = val;
  }
};

initSlider = function() {
  $(".borderRange").slider({
    max: 100,
    min: 0
  });
  $("[id$='radius_border_range']").slider({
    max: 500,
    min: 0
  });
  $(".shadowRange").slider({
    max: 1000,
    min: -1000
  });
  $("[id$='shade_shadow_range']").slider({
    max: 200,
    min: 0
  });
  $("[id$='inset_shadow_range']").slider({
    max: 0,
    min: -1
  });
  $("[id$='rotateX_transform_range'], [id$='rotateY_transform_range'], [id$='rotateZ_transform_range']").slider({
    max: 180,
    min: -180
  });
  $("[id$='scale_transform_range']").slider({
    max: 10,
    min: 0,
    step: 0.01
  });
  $("[id$='originX_transform_range'], [id$='originY_transform_range']").slider({
    max: 100,
    min: 0
  });
  $("[id$='skewX_transform_range'], [id$='skewY_transform_range']").slider({
    max: 180,
    min: -180
  });
  $("[id$='translateX_transform_range'], [id$='translateY_transform_range']").slider({
    max: 2000,
    min: -2000
  });
  $(".fontRange").slider({
    max: 500,
    min: -500
  });
  $("[id$='shade_font_range']").slider({
    max: 500,
    min: 0
  });
  $("[id$='weight_font_range']").slider({
    max: 900,
    min: 100,
    step: 100
  });
  $("[id$='size_font_range']").slider({
    max: 100,
    min: 0
  });
  $(".spaceRange").slider({
    max: 1000,
    min: -1000
  });
  $(".sizeRange").slider({
    max: 2000,
    min: 0
  });
  $(".opacityRange").slider({
    max: 1,
    min: 0,
    step: 0.01
  });
  $(".positionRange").slider({
    max: 2000,
    min: -2000
  });
  $(".backgroundRange").slider({
    max: 2000,
    min: -2000
  });
  $(".gradientRange").slider({
    range: true,
    max: 100,
    min: 0
  });
  return $(".animationRange").slider({
    max: 10,
    min: 0,
    step: 0.01
  });
};


},{"../data":21,"./colorScheme":17,"core":2,"web":28}],19:[function(require,module,exports){
var core, ctr_colorScheme, ctr_css, ctr_option, data, loadFromFile;

core = require("core");

data = require("../data");

ctr_css = require("./css");

ctr_option = require("./option");

ctr_colorScheme = require('./colorScheme');

$("#page_save").click((function(_this) {
  return function(event) {
    data.setCookie();
    return alert("ページストレージに保存しました。");
  };
})(this));

$("#page_clear").click((function(_this) {
  return function(event) {
    data.clearCookie();
    return location.reload();
  };
})(this));

$("#global_save").click((function(_this) {
  return function(event) {
    data.setCookie_G();
    return alert("グローバルストレージに保存しました。");
  };
})(this));

$("#global_clear").click((function(_this) {
  return function(event) {
    data.clearCookie_G();
    return location.reload();
  };
})(this));

$("#generateCodes").click((function(_this) {
  return function(event) {
    console.log(ctr_css.generateStylus());
    console.log(ctr_option.generateCode());
    return alert("コンソールにコードを出力しました。");
  };
})(this));

$("#saveAsFile").click((function(_this) {
  return function(event) {
    return data.saveAsFile();
  };
})(this));

loadFromFile = function(e, parent) {
  var JsonObj;
  JsonObj = JSON.parse(e.target.result);
  data.data = JsonObj.data;
  data.HSL = JsonObj.HSL;
  ctr_css.init();
  return ctr_colorScheme.init();
};

core.file.registFileAPI("#loadFromFile", loadFromFile, this);


},{"../data":21,"./colorScheme":17,"./css":18,"./option":20,"core":2}],20:[function(require,module,exports){
var core, data, event_trans, initEventTrans, initSlider, initUIVal, setTransOption;

core = require("core");

event_trans = require("event/trans");

data = require("../data");

exports.init = function() {
  initUIVal();
  initSlider();
  return initEventTrans();
};

initEventTrans = function() {
  $(".transSetter select").change((function(_this) {
    return function(e) {
      data.optionData.trans.method = $(e.currentTarget).val();
      return setTransOption();
    };
  })(this));
  $(".transRange").bind('slide', (function(_this) {
    return function(e, ui) {
      if (ui !== void 0) {
        $("#" + $(e.currentTarget).attr('id') + "Input").val(ui.value);
        data.optionData.trans.time = ui.value;
      }
      return setTransOption();
    };
  })(this));
  return $('.transRangeText').bind('change', (function(_this) {
    return function(e) {
      data.optionData.trans.time = $(e.currentTarget).val();
      $("#" + $(e.currentTarget).attr("id").split("Input")[0]).slider({
        value: $(e.currentTarget).val()
      });
      return setTransOption();
    };
  })(this));
};

setTransOption = function() {
  event_trans.option.method = data.optionData.trans.method;
  return event_trans.option.time = data.optionData.trans.time;
};

initUIVal = function() {
  var initTrans;
  initTrans = function() {
    $("#method_trans_select").val(data.optionData.trans.method);
    $("#time_trans_range").slider({
      value: data.optionData.trans.time
    });
    $("#time_trans_rangeInput").val(data.optionData.trans.time);
    return setTransOption();
  };
  return initTrans();
};

initSlider = function() {
  return $(".transRange").slider({
    max: 3000,
    min: 0
  });
};

exports.generateCode = function() {
  var str;
  str = "event_trans.option.method = \"" + data.optionData.trans.method + "\"\n";
  str = str + "event_trans.option.time = " + data.optionData.trans.time + "\n";
  return str;
};


},{"../data":21,"core":2,"event/trans":16}],21:[function(require,module,exports){
var cnt, core, debug, web, _i;

debug = require("debug");

core = require("core");

web = require("web");

exports.name = "webele";

exports.eleList = web.data.getValues(this.name);

exports.HSL = {
  H: 0,
  S: 50,
  L: 50
};

exports.colorList = {};

exports.webele = {};

exports.responsiveMax = "all";

exports.css = {
  responsive: ["all", "exSmall", "small", "middle", "large"],
  animation: {
    name: "animation",
    state: ["start", "end", "all"],
    param: ["trigger", "time"],
    trigger: ["none", "hover", "active", "target", "focus"]
  },
  color: {
    name: "color",
    param: ["BG", "text", "link", "hlink", "border", "shadow", "checked"]
  },
  border: {
    name: "border",
    param: ["style", "width", "radius"],
    section: ["all", "left", "top", "right", "bottom"],
    style: ["none", "hidden", "solid", "double", "groove", "ridge", "inset", "outset", "dashed", "dotted"]
  },
  shadow: {
    name: "shadow",
    param: ["x", "y", "shade", "size", "inset"]
  },
  font: {
    name: "font",
    param: ["align", "family", "size", "weight", "shadow1", "shadow2", "shadow3", "shadow4"],
    shadow: {
      param: ["x", "y", "shade", "color"]
    },
    align: ["left", "right", "center"],
    family: ["Andale Mono", "Arial", "Arial Black", "Comic Sans MS", "Courier", "FixedSys", "Georgia", "Helvetica", "Impact", "Lucida", "ＭＳ Ｐゴシック", "ＭＳ Ｐ明朝", "ＭＳ ゴシック", "ＭＳ 明朝", "MS UI Gothic", "Small Fonts", "Symbol", "System", "Terminal", "Times New Roman", "Trebuchet MS", "Verdana", "Webdings"]
  },
  space: {
    name: "space",
    param: ["margin", "padding"],
    val: ["val", "unit"],
    section: ["all", "left", "top", "right", "bottom"],
    unit: ["auto", "per", "px"]
  },
  size: {
    name: "size",
    param: ["width", "height"],
    val: ["val", "unit"],
    section: ["normal", "max", "min"],
    unit: ["auto", "per", "px", "none"]
  },
  opacity: {
    name: "opacity",
    param: ["opacity"]
  },
  position: {
    name: "position",
    param: ["position", "display", "overflow-x", "overflow-y", "z-index", "float", "clear", "top", "left", "right", "bottom"],
    position: ["static", "absolute", "relative", "fixed"],
    display: ["inline", "block", "list-item", "run-in", "inline-block", "table", "inline-table", "table-row-group", "table-header-group", "table-footer-group", "table-row", "table-column-group", "table-column", "table-cell", "table-caption", "none", "inherit"],
    float: ["none", "left", "right"],
    clear: ["none", "left", "right", "both"],
    display: ["inline", "block", "list-item", "run-in", "inline-block", "table", "inline-table", "table-row-group", "table-header-group", "table-footer-group", "table-row", "table-column-group", "table-column", "table-cell", "table-caption", "none", "inherit"],
    overflow: ["visible", "scroll", "hidden", "auto"],
    val: ["val", "unit"],
    unit: ["auto", "px", "per"]
  },
  transform: {
    name: "transform",
    param: ["rotateX", "rotateY", "rotateZ", "originX", "originY", "scale", "skewX", "skewY", "translateX", "translateY"]
  },
  gradient: {
    name: "gradient",
    param: ["direction", "percent", "color1", "color2", "color3"],
    color: ["color", "method"],
    direction: ["none", "left", "left top", "left bottom", "right", "right top", "right bottom", "top", "bottom", "circle"]
  },
  background: {
    name: "background",
    param: ["repeat", "attachment", "directionX", "x", "directionY", "y"],
    repeat: ["repeat", "repeat-x", "repeat-y", "no-repeat"],
    attachment: ["scroll", "fixed"],
    directionX: ["left", "right"],
    directionY: ["top", "bottom"],
    val: ["val", "unit"],
    unit: ["auto", "px", "per"]
  }
};

console.log(debug);

debug.test.startTimer("color");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.color.name], this.css.color.param], "black_normal");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.color.name], ["BG"]], "white_normal");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.color.name], ["link"]], "blue_moreLight");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.color.name], ["hlink"]], "blue_moreDark");

core.obj.setMapVal(this.webele, [["BG"], this.css.responsive, this.css.animation.state, [this.css.color.name], ["BG"]], "base_normal");

core.obj.setMapVal(this.webele, [["footer", "header"], this.css.responsive, this.css.animation.state, [this.css.color.name], ["BG"]], "black_normal");

core.obj.setMapVal(this.webele, [["footer", "header"], this.css.responsive, this.css.animation.state, [this.css.color.name], ["text"]], "white_normal");

console.log(this.webele);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.border.name], this.css.border.section, this.css.border.param], 0);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.border.name], this.css.border.section, ["style"]], "solid");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.shadow.name], this.css.shadow.param], 0);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.font.name], this.css.font.param], 15);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.font.name], ["weight"]], 400);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.font.name], ["family"]], "Times New Roman");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.font.name], ["align"]], "left");

for (cnt = _i = 1; _i <= 4; cnt = ++_i) {
  core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.font.name], ["shadow" + cnt], this.css.shadow.param], 0);
  core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.font.name], ["shadow" + cnt], ["color"]], "black_normal");
}

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.space.name], this.css.space.section, this.css.space.param, this.css.space.val], 0);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.space.name], this.css.space.section, this.css.space.param, ["unit"]], "px");

core.obj.setMapVal(this.webele, [["header"], this.css.responsive, this.css.animation.state, [this.css.space.name], this.css.space.section, ["padding"], ["val"]], 20);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.size.name], this.css.size.section, this.css.size.param, this.css.size.val], 100);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.size.name], this.css.size.section, this.css.size.param, ["unit"]], "none");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.size.name], ["normal"], ["width"], ["unit"]], "per");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.size.name], ["normal"], ["height"], ["unit"]], "auto");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.opacity.name], this.css.opacity.param], 1.0);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.position.name], this.css.position.param], 1);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.position.name], ["top", "bottom", "left", "right"], this.css.position.val], 0);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.position.name], ["top", "bottom", "left", "right"], ["unit"]], "auto");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.position.name], ["position"]], "static");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.position.name], ["display"]], "block");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.position.name], ["float"]], "none");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.position.name], ["clear"]], "none");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.position.name], ["overflow-x"]], "auto");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.position.name], ["overflow-y"]], "auto");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.transform.name], this.css.transform.param], 0);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.transform.name], ["originX"]], "50");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.transform.name], ["originY"]], "50");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.transform.name], ["scale"]], "1");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.gradient.name], this.css.gradient.param, this.css.gradient.color], "base");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.gradient.name], ["direction"]], "none");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.gradient.name], ["percent"]], [33, 66]);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.gradient.name], ["color1", "color2", "color3"], ["method"]], "normal");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.background.name], this.css.background.param], 0);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.background.name], ["x", "y"], this.css.background.val], 0);

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.background.name], ["x", "y"], ["unit"]], "auto");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.background.name], ["directionX"]], "left");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.background.name], ["directionY"]], "top");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.background.name], ["repeat"]], "repeat");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, this.css.animation.state, [this.css.background.name], ["attachment"]], "scroll");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, ["trigger"]], "none");

core.obj.setMapVal(this.webele, [this.eleList, this.css.responsive, ["time"]], 1);

debug.test.endTimer("color");

exports.option = {
  trans: {
    name: "trans",
    param: ["method", "time"],
    method: ["none", "fade", "ver_blind", "hor_blind", "clip", "drop_up", "drop_down", "drop_left", "drop_right", "ver_slide", "hor_slide", "fold", "puff_on", "puff_off"]
  }
};

exports.optionData = {};

core.obj.setMapVal(this.optionData, [[this.option.trans.name], this.option.trans.param], 500);

this.optionData.trans.method = "none";

exports.getLocalStorage = function() {
  var ctr_colorScheme, ctr_css, ctr_option, locationName, setSeverJSONData, strList;
  ctr_colorScheme = require("./ctr/colorScheme");
  ctr_css = require("./ctr/css");
  ctr_option = require("./ctr/option");
  setSeverJSONData = (function(_this) {
    return function(data) {
      _this.webele = data.webele;
      _this.HSL = data.HSL;
      _this.optionData = data.optionData;
      _this.responsiveMax = data.responsiveMax;
      ctr_colorScheme.init();
      ctr_css.init();
      return ctr_option.init();
    };
  })(this);
  if (localStorage.getItem(this.getPageCookieName())) {
    this.webele = JSON.parse(localStorage.getItem(this.getPageCookieName())).webele;
    this.HSL = JSON.parse(localStorage.getItem(this.getPageCookieName())).HSL;
    this.optionData = JSON.parse(localStorage.getItem(this.getPageCookieName())).optionData;
    return this.responsiveMax = JSON.parse(localStorage.getItem(this.getPageCookieName())).responsiveMax;
  } else if (localStorage.getItem(this.name)) {
    this.webele = $.extend(this.webele, JSON.parse(localStorage.getItem(this.name)).webele);
    this.HSL = JSON.parse(localStorage.getItem(this.name)).HSL;
    this.optionData = JSON.parse(localStorage.getItem(this.name)).optionData;
    return this.responsiveMax = JSON.parse(localStorage.getItem(this.name)).responsiveMax;
  } else {
    strList = location.href.split("/");
    locationName = strList[strList.length - 1].split(".")[0];
    return core.file.getJSONFile("./src/webCustomizer/" + locationName + "webele.json", setSeverJSONData);
  }
};

exports.getPageCookieName = function() {
  var strList;
  strList = location.href.split("/");
  return strList[strList.length - 1].split(".")[0] + this.name;
};

exports.setCookie_G = function() {
  return localStorage.setItem(this.name, JSON.stringify({
    webele: this.webele,
    HSL: this.HSL,
    optionData: this.optionData,
    responsiveMax: this.responsiveMax
  }));
};

exports.clearCookie_G = function() {
  return localStorage.removeItem(this.name);
};

exports.setCookie = function() {
  return localStorage.setItem(this.getPageCookieName(), JSON.stringify({
    webele: this.webele,
    HSL: this.HSL,
    optionData: this.optionData,
    responsiveMax: this.responsiveMax
  }));
};

exports.clearCookie = function() {
  return localStorage.removeItem(this.getPageCookieName());
};

exports.saveAsFile = function() {
  return core.file.downloadData(JSON.stringify({
    webele: this.webele,
    HSL: this.HSL,
    optionData: this.optionData,
    responsiveMax: this.responsiveMax
  }), this.getPageCookieName() + ".json");
};


},{"./ctr/colorScheme":17,"./ctr/css":18,"./ctr/option":20,"core":2,"debug":9,"web":28}],22:[function(require,module,exports){
var colorSchemeChanger, cssController, data, optionChanger;

data = require("./data");

data.getLocalStorage();

require('./view/css');

require('./view/colorScheme');

require('./view/option');

require('./view/data');

require('./ctr/data');

cssController = require('./ctr/css');

colorSchemeChanger = require('./ctr/colorScheme');

optionChanger = require('./ctr/option');

require("event/com");

colorSchemeChanger.init();

cssController.init();

optionChanger.init();


},{"./ctr/colorScheme":17,"./ctr/css":18,"./ctr/data":19,"./ctr/option":20,"./data":21,"./view/colorScheme":23,"./view/css":25,"./view/data":26,"./view/option":27,"event/com":15}],23:[function(require,module,exports){
var common_view, domCreater, html;

domCreater = require('domCreater');

common_view = require('./common');

html = common_view.makeHeader("colorScheme", "tint", "colorScheme", [
  [
    "div", {
      "class": "headerArea"
    }
  ], [
    "div", {
      "class": "contentsArea"
    }
  ], [
    [
      "div", {
        id: "colorpicker_debug"
      }
    ], [
      "input", {
        id: "colorInput_debug",
        type: "text",
        value: "0:0:0_#000000"
      }
    ]
  ]
]);

$("#webCustomizerArea").append(domCreater.html.getHtml(html));


},{"./common":24,"domCreater":13}],24:[function(require,module,exports){
var domCreater;

domCreater = require('domCreater');

exports.makeHeader = function(id, iconName, description, htmlList) {
  var html;
  html = [
    [
      "div", {
        id: id + "Changer",
        "class": "webCustomizer box_accordion draggable"
      }
    ], [
      [
        "div", {
          "class": "trigger fixed"
        }
      ], [
        [
          "i", {
            "class": "tooltipEle fa fa-2x fa-" + iconName,
            data: ["toggle", 'tooltip'],
            data2: ["placement", "right"],
            title: description
          }
        ]
      ], [
        "div", {
          "class": "contents"
        }
      ], [htmlList]
    ]
  ];
  return html;
};

exports.makeSliderWithInput = function(setterName, id, lavel) {
  var slider;
  slider = domCreater.gui.makeSliderWithInput(setterName, id);
  return [["tr"], [["td", {}, lavel], ["td"], [slider.slider], ["td"], [slider.input]]];
};

exports.makeSliderWithInputAndSelect = function(setterName, id, selectId, list, lavel) {
  var slider;
  slider = domCreater.gui.makeSliderWithInput(setterName, id);
  return [["tr"], [["td", {}, lavel], ["td"], [slider.slider], ["td"], [slider.input], ["td"], domCreater.gui.makeSelectBox(selectId, list)]];
};

exports.makeSelectBox = function(id, list, lavel) {
  return [["tr"], [["td", {}, lavel], ["td"], domCreater.gui.makeSelectBox(id, list)]];
};

exports.makeColorSelectBox = function(id, nameList, lavel) {
  ["tr"];
  return [["td", {}, lavel], ["td"], domCreater.gui.makeSelectBox(id + "BaseColor", nameList.base), domCreater.gui.makeSelectBox(id + "SideColor", nameList.side)];
};

exports.makeSectionText = function(lavel) {
  return [
    ["tr"], [
      [
        "td", {
          "class": "sectionText"
        }, lavel
      ]
    ]
  ];
};

exports.makeSetterHeader = function(name, array) {
  return [
    [
      "div", {
        "class": "setter " + name + "Setter"
      }, name
    ], [["table"], array]
  ];
};


},{"domCreater":13}],25:[function(require,module,exports){
var common_view, data, domCreater, html, makeSetterArea, web;

data = require('../data');

web = require('web');

domCreater = require('domCreater');

common_view = require('./common');

makeSetterArea = function() {
  var html, makeAnimationSetter, makeBackgroundSetter, makeBorderSetter, makeColorSetter, makeFontSetter, makeGradientSetter, makePositionSetter, makeSelectParamSetter, makeSizeSetter, makeSliderParamSetter, makeSpaceSetter;
  makeColorSetter = function() {
    var html, key, nameList, _i, _len, _ref;
    html = [];
    nameList = web.color.getColorName();
    _ref = data.css.color.param;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      html.push(["tr"], [["td", {}, key], ["td"], domCreater.gui.makeSelectBox(key + "_" + "selectColor", nameList.base), ["td"], domCreater.gui.makeSelectBox(key + "_" + "selectColorMethod", nameList.side)]);
    }
    return html;
  };
  makeBorderSetter = function() {
    var html, htmlSectionArea, makeSectionSetter, section, _i, _len, _ref;
    makeSectionSetter = function(section) {
      var html, key, _i, _len, _ref;
      html = [];
      _ref = data.css.border.param;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key === "style") {
          html.push.apply(html, common_view.makeSelectBox(section + "_" + key + "_border_select", data.css.border.style, key));
        } else {
          html.push.apply(html, common_view.makeSliderWithInput("border", section + "_" + key + "_border", key));
        }
      }
      return html;
    };
    html = [];
    htmlSectionArea = [];
    _ref = data.css.border.section;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      section = _ref[_i];
      if (section !== "all") {
        htmlSectionArea.push([
          "td", {
            "class": "sectionText"
          }, section
        ], makeSectionSetter(section));
      }
    }
    html.push(["table"], [
      [
        "td", {
          "class": "sectionText"
        }, "all"
      ], makeSectionSetter("all")
    ], [
      "div", {
        "class": "trigger"
      }
    ], [
      [
        "div", {
          "class": "triggerText"
        }, ">>more"
      ]
    ], [
      "div", {
        "class": "contents"
      }
    ], [["table"], htmlSectionArea]);
    return html;
  };
  makeSliderParamSetter = function(name, param) {
    var html, key, _i, _len;
    html = [];
    for (_i = 0, _len = param.length; _i < _len; _i++) {
      key = param[_i];
      html.push.apply(html, common_view.makeSliderWithInput(name, key + "_" + name, key));
    }
    return html;
  };
  makeFontSetter = function() {
    var html, makeFontParamSetter, makeShadowSetter;
    makeShadowSetter = function() {
      var html, key, nameList, shadow_key, _i, _j, _len, _len1, _ref, _ref1;
      html = [];
      nameList = web.color.getColorName();
      _ref = data.css.font.param;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key.indexOf("shadow") !== -1) {
          html.push.apply(html, common_view.makeSectionText(key));
          _ref1 = data.css.font.shadow.param;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            shadow_key = _ref1[_j];
            if (shadow_key === "color") {
              html.push.apply(html, common_view.makeColorSelectBox(key + "_" + shadow_key + "_font_select", nameList, shadow_key));
            } else {
              html.push.apply(html, common_view.makeSliderWithInput("font", key + "_" + shadow_key + "_font", shadow_key));
            }
          }
        }
      }
      return html;
    };
    makeFontParamSetter = function() {
      var html, key, _i, _len, _ref;
      html = [];
      _ref = data.css.font.param;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key === "family" || key === "align") {
          html.push.apply(html, common_view.makeSelectBox(key + "_font_select_" + key, data.css.font[key], key));
        } else if (key.indexOf("shadow") === -1) {
          html.push.apply(html, common_view.makeSliderWithInput("font", key + "_font", key));
        }
      }
      return html;
    };
    html = [];
    html.push(["table"], makeFontParamSetter(), [
      "div", {
        "class": "trigger"
      }
    ], [
      [
        "div", {
          "class": "triggerText"
        }, ">>more"
      ]
    ], [
      "div", {
        "class": "contents"
      }
    ], [["table"], makeShadowSetter()]);
    return html;
  };
  makeSpaceSetter = function() {
    var html, htmlSectionArea, makeSectionSetter, section, _i, _len, _ref;
    makeSectionSetter = function(section) {
      var html, key, _i, _len, _ref;
      html = [];
      _ref = data.css.space.param;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        html.push.apply(html, common_view.makeSliderWithInputAndSelect("space", section + "_" + key + "_space", section + "_" + key + "_space_selectUnit", data.css.space.unit, key));
      }
      return html;
    };
    html = [];
    htmlSectionArea = [];
    _ref = data.css.space.section;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      section = _ref[_i];
      if (section !== "all") {
        htmlSectionArea.push([
          "td", {
            "class": "sectionText"
          }, section
        ], makeSectionSetter(section));
      }
    }
    html.push(["table"], [
      [
        "td", {
          "class": "sectionText"
        }, "all"
      ], makeSectionSetter("all")
    ], [
      "div", {
        "class": "trigger"
      }
    ], [
      [
        "div", {
          "class": "triggerText"
        }, ">>more"
      ]
    ], [
      "div", {
        "class": "contents"
      }
    ], [["table"], htmlSectionArea]);
    return html;
  };
  makeSizeSetter = function() {
    var html, htmlSectionArea, makeSectionSetter, section, _i, _len, _ref;
    makeSectionSetter = function(section) {
      var html, key, _i, _len, _ref;
      html = [];
      _ref = data.css.size.param;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        html.push.apply(html, common_view.makeSliderWithInputAndSelect("size", section + "_" + key + "_size", section + "_" + key + "_size_selectUnit", data.css.size.unit, key));
      }
      return html;
    };
    html = [];
    htmlSectionArea = [];
    _ref = data.css.size.section;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      section = _ref[_i];
      if (section !== "normal") {
        htmlSectionArea.push([
          "td", {
            "class": "sectionText"
          }, section
        ], makeSectionSetter(section));
      }
    }
    html.push(["table"], [makeSectionSetter("normal")], [
      "div", {
        "class": "trigger"
      }
    ], [
      [
        "div", {
          "class": "triggerText"
        }, ">>more"
      ]
    ], [
      "div", {
        "class": "contents"
      }
    ], [["table"], htmlSectionArea]);
    return html;
  };
  makeSelectParamSetter = function(name, css) {
    var html, key, _i, _len, _ref;
    html = [];
    _ref = css.param;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      html.push.apply(html, common_view.makeSelectBox(key + "_" + css.name + "_select_" + key, css[key], key));
    }
    return html;
  };
  makePositionSetter = function() {
    var html, makeSetter;
    makeSetter = function() {
      var html, key, _i, _len, _ref;
      html = [];
      _ref = data.css.position.param;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key === "z-index") {
          html.push.apply(html, common_view.makeSliderWithInput("position", key + "_position", key));
        } else if (key === "top" || key === "left" || key === "bottom" || key === "right") {
          html.push.apply(html, common_view.makeSliderWithInputAndSelect("position", key + "_position", key + "_position_selectUnit", data.css.position.unit, key));
        } else if (key === "overflow-x" || key === "overflow-y") {
          html.push.apply(html, common_view.makeSelectBox(key + "_position_select", data.css.position.overflow, key));
        } else {
          html.push.apply(html, common_view.makeSelectBox(key + "_position_select", data.css.position[key], key));
        }
      }
      return html;
    };
    html = [];
    html.push(["table"], makeSetter());
    return html;
  };
  makeBackgroundSetter = function() {
    var html, makeSetter;
    makeSetter = function() {
      var html, key, _i, _len, _ref;
      html = [];
      _ref = data.css.background.param;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key === "x" || key === "y") {
          html.push.apply(html, common_view.makeSliderWithInputAndSelect("background", key + "_background", key + "_background_selectUnit", data.css.background.unit, key));
        } else {
          html.push.apply(html, common_view.makeSelectBox(key + "_background_select", data.css.background[key], key));
        }
      }
      return html;
    };
    html = [];
    html.push(["table"], makeSetter());
    return html;
  };
  makeGradientSetter = function() {
    var html, key, nameList, _i, _len, _ref;
    html = [];
    nameList = web.color.getColorName();
    _ref = data.css.gradient.param;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (key.indexOf("color") !== -1) {
        html.push(["tr"], [["td", {}, key], ["td"], domCreater.gui.makeSelectBox(key + "_" + data.css.gradient.name + "_selectColor", nameList.base), domCreater.gui.makeSelectBox(key + "_" + data.css.gradient.name + "_selectColorMethod", nameList.side)]);
      } else if (key === "direction") {
        html.push.apply(html, common_view.makeSelectBox(key + "_" + data.css.gradient.name + "_select", data.css.gradient[key], key));
      } else {
        html.push.apply(html, common_view.makeSliderWithInput(data.css.gradient.name, key + "_" + data.css.gradient.name, key));
      }
    }
    return html;
  };
  makeAnimationSetter = function() {
    var html, key, _i, _len, _ref;
    html = [];
    _ref = data.css.animation.param;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (key === "trigger") {
        html.push.apply(html, common_view.makeSelectBox(key + "_" + data.css.animation.name + "_select", data.css.animation[key], key));
      } else {
        html.push.apply(html, common_view.makeSliderWithInput(data.css.animation.name, key + "_" + data.css.animation.name, key));
      }
    }
    return html;
  };
  html = [];
  html.push.apply(html, common_view.makeSetterHeader(data.css.animation.name, makeAnimationSetter()));
  html.push.apply(html, common_view.makeSetterHeader(data.css.position.name, makePositionSetter()));
  html.push.apply(html, common_view.makeSetterHeader(data.css.size.name, makeSizeSetter()));
  html.push.apply(html, common_view.makeSetterHeader(data.css.space.name, makeSpaceSetter()));
  html.push.apply(html, common_view.makeSetterHeader(data.css.color.name, makeColorSetter()));
  html.push.apply(html, common_view.makeSetterHeader(data.css.gradient.name, makeGradientSetter()));
  html.push.apply(html, common_view.makeSetterHeader(data.css.background.name, makeBackgroundSetter()));
  html.push.apply(html, common_view.makeSetterHeader(data.css.font.name, makeFontSetter()));
  html.push.apply(html, common_view.makeSetterHeader(data.css.border.name, makeBorderSetter()));
  html.push.apply(html, common_view.makeSetterHeader(data.css.shadow.name, makeSliderParamSetter("shadow", data.css.shadow.param)));
  html.push.apply(html, common_view.makeSetterHeader(data.css.transform.name, makeSliderParamSetter("transform", data.css.transform.param)));
  html.push.apply(html, common_view.makeSetterHeader(data.css.opacity.name, makeSliderParamSetter("opacity", data.css.opacity.param)));
  return html;
};

html = common_view.makeHeader("css", "edit", "css", [
  [
    "div", {
      "class": "headerArea"
    }
  ], [
    [
      "div", {
        "class": "inline"
      }, "element"
    ], [
      "input", {
        "class": "webeleName",
        id: "webeleName_input",
        type: "text",
        size: "10",
        value: "none"
      }
    ], [
      "div", {
        "class": "inline"
      }, "state"
    ], domCreater.gui.makeSelectBox("animationState_select", data.css.animation.state), ["br"], [
      "div", {
        "class": "inline"
      }, "responsive"
    ], domCreater.gui.makeSelectBox("responsive_select", data.css.responsive), [
      "div", {
        "class": "inline"
      }, "max"
    ], domCreater.gui.makeSelectBox("responsiveMax_select", data.css.responsive)
  ], [
    "div", {
      "class": "contentsArea"
    }
  ], makeSetterArea()
]);

$("#webCustomizerArea").append(domCreater.html.getHtml(html));


},{"../data":21,"./common":24,"domCreater":13,"web":28}],26:[function(require,module,exports){
var common_view, data, domCreater, html;

data = require('../data');

domCreater = require('domCreater');

common_view = require('./common');

html = common_view.makeHeader("data", "save", "data", [
  [
    "div", {
      "class": "headerArea"
    }
  ], [
    "div", {
      "class": "contentsArea"
    }
  ], [
    [
      "button", {
        id: "global_save",
        type: "button",
        href: "data:test.txt"
      }, "GlobalSave"
    ], ["br"], [
      "button", {
        id: "global_clear",
        type: "button"
      }, "GlobalClear"
    ], ["br"], [
      "button", {
        id: "page_save",
        type: "button"
      }, "PageSave"
    ], ["br"], [
      "button", {
        id: "page_clear",
        type: "button"
      }, "PageClear"
    ], ["br"], [
      "button", {
        id: "saveAsFile",
        type: "button"
      }, "SaveAsFile"
    ], ["br"], ["div", {}, "LoadFromFile"], [
      [
        "input", {
          id: "loadFromFile",
          type: "file"
        }
      ]
    ], [
      "button", {
        id: "generateCodes",
        type: "button"
      }, "GenerateCodes"
    ]
  ]
]);

$("#webCustomizerArea").append(domCreater.html.getHtml(html));


},{"../data":21,"./common":24,"domCreater":13}],27:[function(require,module,exports){
var common_view, data, domCreater, html, makeSetterArea;

data = require('../data');

domCreater = require('domCreater');

common_view = require('./common');

makeSetterArea = function() {
  var html, makeTransSetter;
  makeTransSetter = function() {
    var html, key, _i, _len, _ref;
    html = [];
    _ref = data.option.trans.param;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (key === "method") {
        html.push.apply(html, common_view.makeSelectBox(key + "_trans_select", data.option.trans.method, key));
      } else {
        html.push.apply(html, common_view.makeSliderWithInput("trans", key + "_trans", key));
      }
    }
    return html;
  };
  html;
  html = [];
  html.push.apply(html, common_view.makeSetterHeader("trans", makeTransSetter()));
  return html;
};

html = common_view.makeHeader("option", "gear", "option", [
  [
    "div", {
      "class": "headerArea"
    }
  ], [
    "div", {
      "class": "contentsArea"
    }
  ], makeSetterArea()
]);

$("#webCustomizerArea").append(domCreater.html.getHtml(html));


},{"../data":21,"./common":24,"domCreater":13}],28:[function(require,module,exports){
module.exports = {
  data: require("./lib/data"),
  color: require("./lib/color"),
  size: require("./lib/size")
};


},{"./lib/color":29,"./lib/data":30,"./lib/size":31}],29:[function(require,module,exports){

/**
  @class web.color
    web上で使用する色情報を扱います。
 */
var core;

core = require("core");


/**
  @method getBaseColorList
  指定したHSLからベースカラー一覧を取得します
  @param {object} HSL HSLデータ
  @return {object} ベースカラー一覧
 */

exports.getBaseColorList = function(HSL) {
  var monoHSL, reverseMonoHSL;
  monoHSL = core.obj.clone(HSL);
  monoHSL["S"] = 0;
  reverseMonoHSL = core.obj.clone(HSL);
  reverseMonoHSL["S"] = 0;
  reverseMonoHSL["L"] = 100 - HSL["L"];
  return {
    base: core.calc.hslToRGB(HSL),
    reverse: $.xcolor.complementary(core.calc.hslToRGB(HSL)),
    sepia: $.xcolor.sepia(core.calc.hslToRGB(HSL)),
    black: "#000",
    white: "#fff",
    blue: "#11c",
    mono: core.calc.hslToRGB(monoHSL),
    reverseMono: core.calc.hslToRGB(reverseMonoHSL)
  };
};


/**
  @method getXColorList
  指定したベースカラーリストから派生したカラーリストを取得します。
  @param {object} baseColorList ベースカラーリスト
  @return {object} 派生後のカラーリスト
 */

exports.getColorList = function(baseColorList) {
  var addColorList, baseColor, colorList, name, triadColorList;
  addColorList = function(list, name, xColor) {
    list[name + "_normal"] = xColor;
    list[name + "_dim"] = $.xcolor.subtractive("#eeeeee", xColor);
    list[name + "_dark"] = $.xcolor.darken(xColor);
    list[name + "_moreDark"] = $.xcolor.darken($.xcolor.darken(xColor));
    list[name + "_light"] = $.xcolor.lighten(xColor);
    list[name + "_moreLight"] = $.xcolor.lighten($.xcolor.lighten(xColor));
    return list[name + "_webSafe"] = $.xcolor.webround(xColor);
  };
  colorList = {};
  for (name in baseColorList) {
    baseColor = baseColorList[name];
    triadColorList = $.xcolor.triad(baseColor);
    addColorList(colorList, name, triadColorList[0]);
    if (name === "base" || name === "reverse") {
      addColorList(colorList, name + "Second", triadColorList[1]);
      addColorList(colorList, name + "Third", triadColorList[2]);
    }
  }
  return colorList;
};


/**
  @method getXColorList
  getColorListで取得できる色の名前一覧を取得します。
  @return {object} 名前一覧
 */

exports.getColorName = function() {
  var colorList, colorNameList, data, key;
  colorNameList = {
    base: [],
    side: []
  };
  colorList = this.getColorList(this.getBaseColorList({
    H: "0",
    S: "0",
    L: "0"
  }));
  for (key in colorList) {
    data = colorList[key];
    colorNameList.base.push(key.split("_")[0]);
    colorNameList.side.push(key.split("_")[1]);
  }
  colorNameList.base = core.array.repFilter(colorNameList.base);
  colorNameList.side = core.array.repFilter(colorNameList.side);
  return colorNameList;
};


},{"core":2}],30:[function(require,module,exports){

/**
  @class web.data
    data属性値を操作します。
 */
var core, getValues;

core = require("core");


/**
  @method getValues
  指定したデータ属性の値を配列として重複なく習得します。
  @param {string} dataName データ属性名
  @return {array} データ属性の値一覧
 */

getValues = function(dataName) {
  var array;
  array = $("*").map(function() {
    return $(this).data(dataName);
  }).get();
  return core.array.repFilter(array);
};

module.exports = {
  getValues: getValues
};


},{"core":2}],31:[function(require,module,exports){

/**
  @class web.size
    ブラウザ周りのサイズを操作します。
 */

/**
  @method getInnerWidthName
  現在のinnnerWidthに対応したサイズ名を取得します。
  @return {String} サイズ名
 */
exports.getInnerWidthName = function() {
  var width, widthName;
  widthName = "";
  width = $(window).innerWidth();
  switch (false) {
    case !(width > 1280):
      widthName = "large";
      break;
    case !(width > 768):
      widthName = "middle";
      break;
    case !(width > 480):
      widthName = "small";
      break;
    default:
      widthName = "exSmall";
  }
  return widthName;
};


/**
  @method getWidthFromInnerWidthName_Max
  サイズ名に応じたinnerWidthの最大値取得します。
  @param {String} name サイズ名
  @return {Number} innerWidth最大値
 */

exports.getWidthFromInnerWidthName_Max = function(name) {
  var width;
  width = 0;
  switch (name) {
    case "large":
      width = 1920;
      break;
    case "middle":
      width = 1280;
      break;
    case "small":
      width = 768;
      break;
    case "exSmall":
      width = 480;
  }
  return width;
};


/**
  @method getWidthFromInnerWidthName_Min
  サイズ名に応じたinnerWidthを最小値を取得します。
  @param {String} name サイズ名
  @return {Number} innerWidth最小値
 */

exports.getWidthFromInnerWidthName_Min = function(name) {
  var width;
  width = 0;
  switch (name) {
    case "large":
      width = 1281;
      break;
    case "middle":
      width = 769;
      break;
    case "small":
      width = 481;
      break;
    case "exSmall":
      width = 0;
  }
  return width;
};


},{}]},{},[1])