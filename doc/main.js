(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("webCustomizer");



},{"webCustomizer":23}],2:[function(require,module,exports){
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


/**
  @method getFileList
  指定したディレクトリのファイル名リストを取得します。
  @param {string} dir ディレクトリ名
  @param {function} ファイル名リスト
 */



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
  @param {Array} mapList 構造を記述したマップ配列
  @param {Object} values 設定する値のセット
 */

exports.setMapVal = function(target, mapList, values) {
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
    return function(target, mapList, values) {
      var childMapList, key, _i, _len, _ref, _results;
      childMapList = core_array.getPopClone(mapList);
      _ref = mapList[0];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(_this.setMapVal(target[key], childMapList, values));
      }
      return _results;
    };
  })(this);
  setInitVal = (function(_this) {
    return function(target, values) {
      var key, val, _results;
      _results = [];
      for (key in values) {
        val = values[key];
        if (_this.check(val)) {
          target[key] = {};
          _results.push(setInitVal(target[key], val));
        } else {
          _results.push(target[key] = val);
        }
      }
      return _results;
    };
  })(this);
  if (mapList.length > 0) {
    init(target, mapList[0]);
    return setChildMapVal(target, mapList, values);
  } else {
    return setInitVal(target, values);
  }
};


/**
  @method check
  Objectか判定します。
  @param {Object} obj 判定対象のデータ
  @return {boolean} 判定結果
 */

exports.check = function(obj) {
  return obj && typeof obj === "object" && !Array.isArray(obj);
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


/**
  @method deepClone
  オブジェクトのディープクローンを生成します。
  @param {Object} obj クローン元のデータ
  @return {Object} クローンデータ
 */

exports.deepClone = function(obj) {
  var object;
  return object = $.extend(true, {}, obj);
};


/**
  @method selectArray
  オブジェクトの配列で指定した要素を選択して返します。
  @param {Object} obj オブジェクト
  @param {array} array 配列
  @return {Object} 配列で選択したオブジェクト
 */

exports.selectArray = function(obj, array) {
  var key, objTemp, _i, _len;
  objTemp = obj;
  for (_i = 0, _len = array.length; _i < _len; _i++) {
    key = array[_i];
    objTemp = objTemp[key];
  }
  return objTemp;
};


/**
  @method parallelLoop
  オブジェクトを配列の指定された数までの要素で検索し、検出されたオブジェクト全要素に大して残りの配列要素で検索をかける
  @param {Object} obj オブジェクト
  @param {Array} key_array キー配列
  @param {Number} parallelNum 検索の継ぎ目となる番号
  @param {Function} objList 検索された要素
 */

exports.parallelLoop = (function(_this) {
  return function(obj, key_array, parallelNum) {
    var index_head, index_tail, key, objList, param, tempId, tempId2;
    objList = {};
    tempId = "";
    index_head = 0;
    while (index_head < parallelNum) {
      tempId += key_array[index_head] + "-";
      obj = obj[key_array[index_head]];
      index_head++;
    }
    for (key in obj) {
      param = obj[key];
      index_tail = index_head + 1;
      tempId2 = "";
      while (index_tail < key_array.length) {
        param = param[key_array[index_tail]];
        tempId2 += "-" + key_array[index_tail];
        index_tail++;
      }
      objList[tempId + key + tempId2] = param;
    }
    return objList;
  };
})(this);


/**
  @method marge
  オブジェクトを対象のオブジェクトに上書きでマージする
  @param {Object} target 対象のオブジェクト
  @param {Object} obj 上書きするオブジェクト
  @return {Object} マージしたオブジェクト
 */

exports.marge = function(target, obj) {
  var key, param, _results;
  _results = [];
  for (key in obj) {
    param = obj[key];
    if (target[key] === void 0) {
      target[key] = {};
    }
    if (this.check(param)) {
      _results.push(this.marge(target[key], param));
    } else {
      _results.push(target[key] = param);
    }
  }
  return _results;
};


/**
  @method keySeekAlg
  オブジェクト内の指定したkeyを持つオブジェクトに対して、callbackを実行します。
  @param {Object} obj 対象のオブジェクト
  @param {String} targetKey key
  @param {Object} callback callback(対象のオブジェクト)
 */

exports.keySeekAlg = function(obj, targetKey, callback) {
  var key, param, _results;
  _results = [];
  for (key in obj) {
    param = obj[key];
    if (this.check(param)) {
      _results.push(this.keySeekAlg(param, targetKey, callback));
    } else {
      if (key === targetKey) {
        _results.push(callback(obj));
      } else {
        _results.push(void 0);
      }
    }
  }
  return _results;
};


/**
  @method allCall
  オブジェクトに存在する指定したkeyのメソッドをすべて呼び出します。
  @param {Object} obj 対象のオブジェクト
  @callback {Object} callback key:メソッドkey, arg:可変長引数
 */

exports.allCall = function(obj, callback) {
  var call;
  call = function(target) {
    return target[callback.key].apply(target, callback.arg);
  };
  return this.keySeekAlg(obj, callback.key, call);
};


/**
  @method allDelete
  オブジェクトに存在する指定したkeyデータをすべて削除します。
  @param {Object} obj 対象のオブジェクト
  @param {String} key 削除データのkey
 */

exports.allDelete = function(obj, key) {
  var call;
  call = function(target) {
    return delete target[key];
  };
  return this.keySeekAlg(obj, key, call);
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


/**
  @method getIndent
  指定した数のインデントを取得します。
  @param {Number} num インデント数
  @return {String} インデント
 */

exports.getIndent = function(num) {
  var index, str, _i;
  str = "";
  for (index = _i = 0; 0 <= num ? _i < num : _i > num; index = 0 <= num ? ++_i : --_i) {
    str += "\t";
  }
  return str;
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
  core: require('./lib/core'),
  prop: require('./lib/prop').prop
};



},{"./lib/core":10,"./lib/prop":11}],10:[function(require,module,exports){

/**
  @class css.core
  基本となるメソッドを扱います。
 */
var core, cssRulesNumber, styleSheet;

core = require('core');

styleSheet = document.styleSheets[document.styleSheets.length - 2];

cssRulesNumber = styleSheet.cssRules.length;


/**
  @method getVender
  vender名一覧を取得します。
  @return {Array} vender一覧
 */

exports.getVendor = function() {
  return ["", "-webkit-", "-moz-", "-o-", "-ms-"];
};


/**
  @method make
  css構造データからcssを生成します。
  @param {Object} cssData css構造データ
  @return 生成したcss
 */

exports.make = function(cssData, selectorParentList, level) {
  var css, key, param_css, setMedia, setSelector, setTag;
  if (selectorParentList == null) {
    selectorParentList = [];
  }
  if (level == null) {
    level = 0;
  }
  setTag = (function(_this) {
    return function(tag) {
      var getName, key, name, nameList, param, str, _i, _len;
      getName = function(name) {
        var nameList, vender, _i, _len, _ref;
        nameList = [];
        switch (name) {
          case "transform":
          case "transform-origin":
          case "transition":
            _ref = _this.getVendor();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              vender = _ref[_i];
              nameList.push(vender + name);
            }
            break;
          default:
            nameList.push(name);
        }
        return nameList;
      };
      str = "";
      for (key in tag) {
        param = tag[key];
        nameList = getName(key);
        for (_i = 0, _len = nameList.length; _i < _len; _i++) {
          name = nameList[_i];
          str += core.str.getIndent(level + 1) + name + ": " + param + ";\n";
        }
      }
      return str;
    };
  })(this);
  setSelector = function(selector, selectorParentList) {
    var getParentNameList, getVal, index, index_parent, name, parentName, str, _ref, _ref1;
    getParentNameList = function(selectorParentList) {
      var parentName, selectorParent, str, strList, _i, _j, _len, _len1, _ref;
      strList = [];
      for (_i = 0, _len = selectorParentList.length; _i < _len; _i++) {
        selectorParent = selectorParentList[_i];
        str = "";
        _ref = selectorParent.name;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          parentName = _ref[_j];
          str += parentName;
          if (selectorParent.event) {
            str += ":" + selectorParent.event;
          }
          str += " ";
          strList.push(str);
        }
      }
      return strList;
    };
    getVal = function(name, selector) {
      var str;
      str = "";
      str += name;
      if (selector.event) {
        str += ":" + selector.event;
      }
      return str;
    };
    str = core.str.getIndent(level);
    _ref = selector.name;
    for (index in _ref) {
      name = _ref[index];
      if (index > 0) {
        str += ", ";
      }
      if (selectorParentList.length > 0) {
        _ref1 = getParentNameList(selectorParentList);
        for (index_parent in _ref1) {
          parentName = _ref1[index_parent];
          if (index_parent > 0) {
            str += ", ";
          }
          str += getVal(parentName + name, selector);
        }
      } else {
        str += getVal(name, selector);
      }
    }
    str += " {\n";
    return str;
  };
  setMedia = function(media) {
    var str;
    str = core.str.getIndent(level);
    switch (media.type) {
      case "min-width":
        str += "@media screen and (min-width:" + media.val + "px){ \n";
    }
    return str;
  };
  css = "";
  for (key in cssData) {
    param_css = cssData[key];
    if (param_css.media) {
      css += setMedia(param_css.media);
      if (param_css.child) {
        css += this.make(param_css.child, selectorParentList, level + 1);
      }
      css += core.str.getIndent(level) + "}\n";
    } else {
      css += setSelector(param_css.selector, selectorParentList);
      css += setTag(param_css.tag);
      css += core.str.getIndent(level) + "}\n";
      if (param_css.child) {
        selectorParentList.push(param_css.selector);
        css += this.make(param_css.child, selectorParentList, level);
        selectorParentList.pop();
      }
    }
  }
  return css;
};

exports.setRule = function(cssStr, num) {
  var styleNum;
  if (num) {
    styleNum = cssRulesNumber + num - 1;
  } else {
    styleNum = styleSheet.cssRules.length;
  }
  return styleSheet.insertRule(cssStr, styleNum);
};

exports.deleteRule = function(num) {
  var styleNum;
  if (num) {
    styleNum = cssRulesNumber + num - 2;
  } else {
    styleNum = styleSheet.cssRules.length - 1;
  }
  return styleSheet.deleteRule(styleNum);
};

exports.deleteAllRule = function() {
  var len, _results;
  len = styleSheet.cssRules.length;
  _results = [];
  while (len > cssRulesNumber) {
    styleSheet.deleteRule(styleSheet.cssRules.length - 1);
    _results.push(len = styleSheet.cssRules.length);
  }
  return _results;
};



},{"core":2}],11:[function(require,module,exports){
var core, css_core, prop;

core = require('core');

css_core = require("./core");


/**
  @class css.prop
  プロパティを制御します。
 */

prop = (function() {
  function prop(param) {
    if (param.id) {
      this.id = param.id;
    }
    if (param.selector) {
      this.selector = param.selector;
    }
    if (param.media) {
      this.media = {
        name: param.media.name,
        val: param.media.val
      };
    }
    this.animation = {
      init: function(param) {
        this.trigger = "";
        return this.time = 0;
      }
    };
    this.background = {
      init: function(param) {
        this.color = "";
        this.image = "";
        this.gradation = "";
        this.size = "";
        this.repeat = "";
        this.attachment = "";
        return this.position = "";
      }
    };
    this.border = {
      init: function(param) {
        var section, _i, _len, _ref, _results;
        _ref = ["left", "top", "right", "bottom"];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          section = _ref[_i];
          _results.push(this[section] = "");
        }
        return _results;
      }
    };
    this.radius = {
      init: function(param) {
        return this.radius = "";
      }
    };
    this.font = {
      init: function(param) {
        this.family = "";
        this.size = "";
        this.lineHeight = "";
        this.weight = "";
        this.color = "";
        this.align = "";
        this.decoration = "";
        return this.shadow = "";
      }
    };
    this.opacity = {
      init: function(param) {
        return this.opacity = "";
      }
    };
    this.position = {
      init: function(param) {
        this.position = "";
        this.display = "";
        this.overflow = {
          x: "",
          y: ""
        };
        this.zIndex = "";
        this.float = "";
        this.whiteSpace = "";
        this.clear = "";
        this.top = "";
        this.left = "";
        this.bottom = "";
        return this.right = "";
      }
    };
    this.boxShadow = {
      init: function(param) {
        return this.boxShadow = "";
      }
    };
    this.size = {
      init: function(param) {
        var type, _i, _len, _ref, _results;
        _ref = ["normal", "min", "max"];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          type = _ref[_i];
          _results.push(this[type] = {
            width: "",
            height: ""
          });
        }
        return _results;
      }
    };
    this.space = {
      init: function(param) {
        var section, _i, _len, _ref, _results;
        _ref = ["left", "top", "right", "bottom"];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          section = _ref[_i];
          _results.push(this[section] = {
            margin: "",
            padding: ""
          });
        }
        return _results;
      }
    };
    this.transform = {
      init: function(param) {
        this.transform = "";
        return this.origin = "";
      }
    };
  }

  prop.prototype.make = function() {
    var cssData, section, tagData, _i, _j, _len, _len1, _ref, _ref1;
    cssData = {
      1: {
        media: {
          type: "min-width",
          val: this.media.val
        },
        child: {
          1: {
            selector: {
              name: this.selector,
              event: this.animation.trigger ? this.animation.trigger : void 0
            },
            tag: {},
            child: {}
          }
        }
      }
    };
    tagData = cssData["1"].child["1"].tag;
    if (this.animation.time) {
      tagData.transition = "all " + this.animation.time + "s linear";
    }
    if (this.background.color) {
      tagData["background-color"] = this.background.color;
    }
    if (this.background.image && this.background.gradation) {
      tagData["background-image"] = "url(\"" + this.background.image + "\"), " + this.background.gradation;
    } else if (this.background.image) {
      tagData["background-image"] = "url(\"" + this.background.image + "\")";
    } else if (this.background.gradation) {
      tagData["background-image"] = this.background.gradation;
    }
    if (this.background.size) {
      tagData["background-size"] = this.background.size;
    }
    if (this.background.repeat) {
      tagData["background-repeat"] = this.background.repeat;
    }
    if (this.background.attachment) {
      tagData["background-attachment"] = this.background.attachment;
    }
    if (this.background.position) {
      tagData["background-position"] = this.background.position;
    }
    _ref = ["left", "top", "right", "bottom"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      section = _ref[_i];
      if (this.border[section]) {
        tagData["border-" + section] = this.border[section];
      }
    }
    if (this.radius.radius) {
      tagData["border-radius"] = this.radius.radius;
    }
    if (this.font.family) {
      tagData["font-family"] = this.font.family;
    }
    if (this.font.size) {
      tagData["font-size"] = this.font.size;
    }
    if (this.font.lineHeight) {
      tagData["line-height"] = this.font.lineHeight;
    }
    if (this.font.weight) {
      tagData["font-weight"] = this.font.weight;
    }
    if (this.font.color) {
      tagData["color"] = this.font.color;
    }
    if (this.font.align) {
      tagData["text-align"] = this.font.align;
    }
    if (this.font.decoration) {
      tagData["text-decoration"] = this.font.decoration;
    }
    if (this.font.shadow) {
      tagData["text-shadow"] = this.font.shadow;
    }
    if (this.opacity.opacity) {
      tagData["opacity"] = this.opacity.opacity;
    }
    if (this.position.position) {
      tagData["position"] = this.position.position;
    }
    if (this.position.display) {
      tagData["display"] = this.position.display;
    }
    if (this.position.overflow.x) {
      tagData["overflow-x"] = this.position.overflow.x;
    }
    if (this.position.overflow.y) {
      tagData["overflow-y"] = this.position.overflow.y;
    }
    if (this.position.zIndex) {
      tagData["z-index"] = this.position.zIndex;
    }
    if (this.position.float) {
      tagData["float"] = this.position.float;
    }
    if (this.position.clear) {
      tagData["clear"] = this.position.clear;
    }
    if (this.position.whiteSpace) {
      tagData["white-space"] = this.position.whiteSpace;
    }
    if (this.position.top) {
      tagData["top"] = this.position.top;
    }
    if (this.position.left) {
      tagData["left"] = this.position.left;
    }
    if (this.position.bottom) {
      tagData["bottom"] = this.position.bottom;
    }
    if (this.position.right) {
      tagData["right"] = this.position.right;
    }
    if (this.boxShadow.boxShadow) {
      tagData["box-shadow"] = this.boxShadow.boxShadow;
    }
    if (this.size.normal.width) {
      tagData["width"] = this.size.normal.width;
    }
    if (this.size.normal.height) {
      tagData["height"] = this.size.normal.height;
    }
    if (this.size.max.width) {
      tagData["max-width"] = this.size.max.width;
    }
    if (this.size.max.height) {
      tagData["max-height"] = this.size.max.height;
    }
    if (this.size.min.width) {
      tagData["min-width"] = this.size.min.width;
    }
    if (this.size.min.height) {
      tagData["min-height"] = this.size.min.height;
    }
    _ref1 = ["left", "top", "right", "bottom"];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      section = _ref1[_j];
      if (this.space[section].margin) {
        tagData["margin-" + section] = this.space[section].margin;
      }
      if (this.space[section].padding) {
        tagData["padding-" + section] = this.space[section].padding;
      }
    }
    if (this.transform.transform) {
      tagData["transform"] = this.transform.transform;
    }
    if (this.transform.origin) {
      tagData["transform-origin"] = this.transform.origin;
    }
    if (Object.keys(tagData).length !== 0) {
      return css_core.make(cssData);
    } else {
      return "";
    }
  };

  return prop;

})();

module.exports = {
  prop: prop
};



},{"./core":10,"core":2}],12:[function(require,module,exports){
module.exports = {
  test: require("./lib/test"),
  data: require("./lib/data")
};



},{"./lib/data":13,"./lib/test":14}],13:[function(require,module,exports){
exports.imageList = ["none.png", "bg1.png", "bg2.png", "contents.png", "button.png", "char_A.jpg", "char_B.jpg", "gallery.jpg", "h_char.jpg", "h_dl.jpg", "h_garallery.jpg", "h_story.jpg", "main.jpg", "room.jpg", "story.jpg"];



},{}],14:[function(require,module,exports){

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



},{"core":2}],15:[function(require,module,exports){
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



},{}],16:[function(require,module,exports){
exports.init = function() {
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
  return $(".box_accordion .trigger").click(function() {
    return $(this).next().slideToggle();
  });
};



},{}],17:[function(require,module,exports){
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



},{"effect/anim":15}],18:[function(require,module,exports){
module.exports = {
  core: require('./lib/core'),
  dom: require('./lib/dom')
};



},{"./lib/core":19,"./lib/dom":20}],19:[function(require,module,exports){

/**
  @class html.core
  基本となるメソッドを扱います。
 */
var core;

core = require('core');


/**
  @method make
  dom配列データをhtmlに変換します。
  @param {Array} dom 変換するdomデータ
  @param {Number} [level=0] インデントレベル
  @return {String} htmlコード
 */

exports.make = function(dom, level) {
  var addHtmlLine, closedTag, formatTag, getClosedTag, html, htmlLine, _i, _len;
  if (level == null) {
    level = 0;
  }
  addHtmlLine = function(htmlLine, level) {
    return level + htmlLine + "\n";
  };
  getClosedTag = function(htmlLine, level) {
    var tag, tagName;
    tagName = htmlLine.split(">")[0].split(" ")[0].substr(1);
    tag = "";
    if (tagName !== "br") {
      tag = level + "</" + tagName + ">" + "\n";
    }
    return tag;
  };
  formatTag = function(tag, attrList, val) {
    var closeOpenedTag, getAttr, getOpenedTag, getValue, str;
    getOpenedTag = function(tag) {
      return "<" + tag;
    };
    getAttr = function(attrList) {
      var attr, key, str;
      str = "";
      for (key in attrList) {
        attr = attrList[key];
        if (key === "checked" && attr === "false") {
          continue;
        }
        str += " " + key + "=" + core.str.addDQ(attr);
      }
      return str;
    };
    closeOpenedTag = function() {
      return ">";
    };
    getValue = function(val) {
      if (val !== void 0) {
        return val;
      } else {
        return "";
      }
    };
    str = getOpenedTag(tag);
    str += getAttr(attrList);
    str += closeOpenedTag();
    return str += getValue(val);
  };
  html = closedTag = "";
  for (_i = 0, _len = dom.length; _i < _len; _i++) {
    htmlLine = dom[_i];
    if (htmlLine[0] instanceof Array) {
      html += this.make(htmlLine, level + 1);
    } else {
      htmlLine = formatTag(htmlLine[0], htmlLine[1], htmlLine[2]);
      if (closedTag !== "") {
        html += closedTag;
      }
      closedTag = getClosedTag(htmlLine, core.str.getIndent(level));
      html += addHtmlLine(htmlLine, core.str.getIndent(level));
    }
  }
  return html += closedTag;
};



},{"core":2}],20:[function(require,module,exports){

/**
  @class html.dom
  dom配列を生成します。
 */

/**
  @method selectBox
  selectBoxを生成します。
  @param {String} id id
  @param {Array} optionList option配列
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */
exports.selectBox = function(id, optionList, className) {
  var html_selectBoxOption, option, _i, _len;
  if (className == null) {
    className = "";
  }
  html_selectBoxOption = [];
  for (_i = 0, _len = optionList.length; _i < _len; _i++) {
    option = optionList[_i];
    html_selectBoxOption.push([
      "option", {
        value: option
      }, option
    ]);
  }
  return [
    [
      "select", {
        id: id,
        "class": className + " select"
      }
    ], html_selectBoxOption
  ];
};


/**
  @method slider
  sliderを生成します。
  @param {String} id id
  @param {String} [className=""] クラス名
  @param {Number} [size=4] inputサイズ
  @return {Array} dom配列
 */

exports.slider = function(id, className, size) {
  if (className == null) {
    className = "";
  }
  if (size == null) {
    size = 4;
  }
  return {
    slider: [
      "div", {
        id: id,
        "class": className + " slider"
      }
    ],
    input: this.input(id + "_input", 4, "", className + " sliderInput")
  };
};


/**
  @method icon
  iconを生成します。
  @param {String} id id
  @param {String} iconName icon名
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */

exports.icon = function(id, iconName, className) {
  if (className == null) {
    className = "";
  }
  return [
    "i", {
      id: id,
      "class": className + " fa fa-" + iconName
    }
  ];
};


/**
  @method input
  inputを生成します。
  @param {String} id id
  @param {Number} [size=5] inputサイズ
  @param {String} val inputの値
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */

exports.input = function(id, size, val, className) {
  if (size == null) {
    size = "5";
  }
  if (val == null) {
    val = "";
  }
  if (className == null) {
    className = "";
  }
  return [
    "input", {
      id: id,
      "class": className,
      type: "text",
      size: size,
      value: val
    }
  ];
};


/**
  @method checkbox
  checkboxを生成します。
  @param {String} id id
  @param {String} checked checked
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */

exports.checkbox = function(id, checked, className) {
  if (className == null) {
    className = "";
  }
  return [
    "input", {
      id: id,
      "class": className,
      type: "checkbox",
      checked: checked
    }
  ];
};


/**
  @method button
  buttonを生成します。
  @param {String} id id
  @param {String} text ボタンテキスト
  @param {String} [className=""] クラス名
  @return {Array} dom配列
 */

exports.button = function(id, text, className) {
  if (className == null) {
    className = "";
  }
  return [
    "button", {
      id: id,
      type: "button",
      "class": className
    }, text
  ];
};



},{}],21:[function(require,module,exports){
var allCSS, animationSelect, core, css, data, debug, event_trans, loadFromFile, responsiveName, responsiveSelect, setCSS, setData, setGuiData, setTransOption, web, webeleSelect;

debug = require("debug");

core = require("core");

web = require("web");

data = require('./data');

css = require("css");

event_trans = require("event/trans");

webeleSelect = "BG";

responsiveName = web.size.chooseResponsiveMax(web.size.getResponsiveName(), data.responsiveMax);

responsiveSelect = "small";

animationSelect = "start";

allCSS = "";

exports.init = function() {
  var init_colorPicker;
  init_colorPicker = function() {
    $('#colorpicker_webCustomizer').farbtastic('#colorInput_webCustomizer');
    $.farbtastic('#colorpicker_webCustomizer').setColor(core.calc.hslToRGB(data.HSL));
    return data.colorList = web.color.getColorList(data.HSL);
  };
  init_colorPicker();
  setTransOption();
  $("#responsiveMax_select").val(data.responsiveMax);
  return $(window).trigger("resize");
};

setTransOption = function(id, val) {
  event_trans.option.method = data.gui_option.trans.method.val;
  event_trans.option.time = data.gui_option.trans.time.val;
  data.gui_option.trans.method.setGuiVal();
  return data.gui_option.trans.time.setGuiVal();
};

setGuiData = function(id, val) {
  var animeData, idList, index, key, key_anime, key_res, param, resData, webeleData, _i, _j, _k, _len, _len1, _len2, _ref;
  resData = [responsiveSelect];
  animeData = [animationSelect];
  if ($("#resAll_checked:checked").val()) {
    resData = data.responsiveList;
  }
  if ($("#animAll_checked:checked").val()) {
    animeData = data.animationState;
  }
  idList = id.split("_");
  for (_i = 0, _len = resData.length; _i < _len; _i++) {
    key_res = resData[_i];
    for (_j = 0, _len1 = animeData.length; _j < _len1; _j++) {
      key_anime = animeData[_j];
      webeleData = data.webele[key_res][webeleSelect][key_anime];
      if (idList.indexOf("all") === -1) {
        for (_k = 0, _len2 = idList.length; _k < _len2; _k++) {
          key = idList[_k];
          webeleData = webeleData[key];
        }
        webeleData.val = val;
      } else {
        _ref = core.obj.parallelLoop(webeleData, idList, idList.indexOf("all"));
        for (index in _ref) {
          param = _ref[index];
          param.val = val;
          param.setGuiVal();
        }
      }
    }
  }
  return setCSS();
};

core.obj.allCall(data.gui_css, {
  key: "initEvent",
  arg: [
    {
      method: setGuiData,
      arg: []
    }
  ]
});

core.obj.allCall(data.gui_option, {
  key: "initEvent",
  arg: [
    {
      method: setTransOption,
      arg: []
    }
  ]
});

$('*').bind('contextmenu', (function(_this) {
  return function(e) {
    if ($(e.currentTarget).data(data.name)) {
      webeleSelect = $(e.currentTarget).data(data.name);
    } else {
      webeleSelect = $(e.currentTarget).parents("[data-" + data.name + "]").data(data.name);
    }
    setData();
    return false;
  };
})(this));

$(window).resize((function(_this) {
  return function(e) {
    responsiveSelect = web.size.chooseResponsiveMax(web.size.getResponsiveName(), data.responsiveMax);
    $("#responsive_input").val(responsiveSelect);
    setData();
    return setCSS();
  };
})(this));

$("#webeleName_input").change((function(_this) {
  return function(e) {
    webeleSelect = $(e.currentTarget).val();
    return setData();
  };
})(this));

$("#animationState_select").change((function(_this) {
  return function(e) {
    animationSelect = $(e.currentTarget).val();
    return setData();
  };
})(this));

$("#responsiveMax_select").change((function(_this) {
  return function(e) {
    data.responsiveMax = $(e.currentTarget).val();
    return $(window).trigger("resize");
  };
})(this));

$('#colorInput_webCustomizer').bind('change', (function(_this) {
  return function(event) {
    var getHSL;
    getHSL = function() {
      var hslSprit;
      hslSprit = $("#colorInput_webCustomizer").val().split("_")[0].split(":");
      if (hslSprit[0] === "NaN" || hslSprit[1] === "NaN" || hslSprit[2] === "NaN") {
        return;
      }
      return {
        H: Number(hslSprit[0]),
        S: Number(hslSprit[1]),
        L: Number(hslSprit[2])
      };
    };
    data.HSL = getHSL();
    data.colorList = web.color.getColorList(data.HSL);
    return setCSS();
  };
})(this));

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
    console.log(allCSS);
    return alert("コンソールにコードを出力しました。");
  };
})(this));

$("#saveAsFile").click((function(_this) {
  return function(event) {
    return data.saveAsFile();
  };
})(this));

$("#loadFromFile").click((function(_this) {
  return function(event) {
    return $("#loader").click();
  };
})(this));

loadFromFile = (function(_this) {
  return function(e, parent) {
    var JsonObj;
    JsonObj = JSON.parse(e.target.result);
    data.webele = JsonObj.webele;
    data.HSL = JsonObj.HSL;
    data.optionData = JsonObj.optionData;
    data.responsiveMax = JsonObj.responsiveMax;
    return _this.init();
  };
})(this);

core.file.registFileAPI("#loader", loadFromFile, this);

setData = function() {
  $("#webeleName_input").val(webeleSelect);
  core.obj.allCall(data.webele[responsiveSelect][webeleSelect][animationSelect], {
    key: "setGuiVal",
    arg: []
  });
  return core.obj.allCall(data.optionData, {
    key: "setGuiVal",
    arg: []
  });
};

setCSS = function() {
  var anime, cssData, getColor, getUnitVal, getVal, getValPX, key_res, section, setCSSStr, webele, webeleData, _i, _len, _ref, _results;
  getVal = function(valData) {
    if (valData) {
      return valData;
    } else {
      return "";
    }
  };
  getValPX = function(valData) {
    if (valData) {
      return valData + "px";
    } else {
      return "";
    }
  };
  getColor = function(colorData) {
    if (colorData.colorName.val && colorData.tone.val) {
      return data.colorList[colorData.colorName.val][colorData.tone.val];
    } else {
      return "";
    }
  };
  getUnitVal = function(unitData) {
    if (unitData.unit.val) {
      if (unitData.unit.val !== "%" && unitData.unit.val !== "px") {
        return unitData.unit.val;
      } else {
        if (unitData.num.val) {
          return unitData.num.val + unitData.unit.val;
        }
      }
    }
    return "";
  };
  setCSSStr = function(cssData) {
    var cssStr;
    cssStr = cssData.make();
    if (cssStr !== "") {
      css.core.setRule(cssStr);
    }
    return allCSS += cssStr;
  };
  css.core.deleteAllRule();
  allCSS = "";
  _ref = data.responsiveList;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key_res = _ref[_i];
    _results.push((function() {
      var _j, _len1, _ref1, _results1;
      _ref1 = data.webeleList;
      _results1 = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        webele = _ref1[_j];
        if (web.size.chooseResponsiveMax(key_res, data.responsiveMax) !== key_res) {
          continue;
        }
        _results1.push((function() {
          var _k, _l, _len2, _len3, _len4, _len5, _m, _n, _ref2, _ref3, _ref4, _ref5, _results2;
          _ref2 = data.animationState;
          _results2 = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            anime = _ref2[_k];
            cssData = data.css[key_res][webele][anime].main;
            webeleData = data.webele[key_res][webele][anime];
            if (anime === "end" && !webeleData.animation.trigger.val) {
              continue;
            }
            if (anime === "start") {
              cssData.animation.time = getVal(webeleData.animation.time.val);
            }
            if (anime !== "start") {
              cssData.animation.trigger = getVal(webeleData.animation.trigger.val);
            }
            cssData.background.color = getColor(webeleData.background.color);
            if (getVal(webeleData.background.image.val)) {
              cssData.background.image = "../../src/img/imageList/" + getVal(webeleData.background.image.val);
            } else {
              cssData.background.image = "";
            }
            cssData.background.repeat = getVal(webeleData.background.repeat.val);
            cssData.background.attachment = getVal(webeleData.background.attachment.val);
            if (webeleData.background.grdDirection.val) {
              if (webeleData.background.grdDirection.val === "circle") {
                cssData.background.gradation = "radial-gradient(";
              } else {
                cssData.background.gradation = "linear-gradient(to ";
              }
              cssData.background.gradation += webeleData.background.grdDirection.val + ", " + getColor(webeleData.background.grdColor[1]) + " " + webeleData.background.grdPercent.val[0] + "%, " + getColor(webeleData.background.grdColor[2]) + " " + webeleData.background.grdPercent.val[1] + "%, " + getColor(webeleData.background.grdColor[3]) + " 100%)";
            } else {
              cssData.background.gradation = "";
            }
            switch (webeleData.background.size.x.unit.val) {
              case "contain":
              case "cover":
                cssData.background.size = webeleData.background.size.x.unit.val;
                break;
              default:
                if (webeleData.background.size.x.num.val) {
                  cssData.background.size = getUnitVal(webeleData.background.size.x) + " " + getUnitVal(webeleData.background.size.y);
                } else {
                  cssData.background.size = "";
                }
            }
            if (webeleData.background.direction.x.val) {
              cssData.background.position = webeleData.background.direction.x.val + " " + getUnitVal(webeleData.background.coord.x) + " " + webeleData.background.direction.y.val + " " + getUnitVal(webeleData.background.coord.y);
            } else {
              cssData.background.position = "";
            }
            _ref3 = ["left", "top", "right", "bottom"];
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              section = _ref3[_l];
              if (webeleData.border[section].style.val) {
                cssData.border[section] = webeleData.border[section].style.val + " " + webeleData.border[section].width.val + "px " + getColor(webeleData.border[section].color);
              } else {
                cssData.border[section] = "";
              }
            }
            if (webeleData.borderRadius.topLeft.val !== 0 || webeleData.borderRadius.topRight.val !== 0 || webeleData.borderRadius.bottomLeft.val !== 0 || webeleData.borderRadius.bottomRight.val !== 0) {
              cssData.radius.radius = webeleData.borderRadius.topLeft.val + "px " + webeleData.borderRadius.topRight.val + "px " + webeleData.borderRadius.bottomLeft.val + "px " + webeleData.borderRadius.bottomRight.val + "px";
            } else {
              cssData.radius.radius = "";
            }
            cssData.font.family = getVal(webeleData.font.family.val);
            cssData.font.size = getValPX(webeleData.font.size.val);
            cssData.font.lineHeight = getUnitVal(webeleData.font.lineHeight);
            cssData.font.weight = getVal(webeleData.font.weight.val);
            cssData.font.align = getVal(webeleData.font.align.val);
            cssData.font.color = getColor(webeleData.font.fontColor);
            cssData.font.decoration = getVal(webeleData.font.decoration.val);
            if (webeleData.font.shadow1.x.val !== 0 || webeleData.font.shadow1.y.val !== 0 || webeleData.font.shadow1.shade.val !== 0) {
              cssData.font.shadow = webeleData.font.shadow1.x.val + "px " + webeleData.font.shadow1.y.val + "px " + webeleData.font.shadow1.shade.val + "px " + getColor(webeleData.font.shadow1.color) + ", " + webeleData.font.shadow2.x.val + "px " + webeleData.font.shadow2.y.val + "px " + webeleData.font.shadow2.shade.val + "px " + getColor(webeleData.font.shadow2.color) + ", " + webeleData.font.shadow3.x.val + "px " + webeleData.font.shadow3.y.val + "px " + webeleData.font.shadow3.shade.val + "px " + getColor(webeleData.font.shadow3.color) + ", " + webeleData.font.shadow4.x.val + "px " + webeleData.font.shadow4.y.val + "px " + webeleData.font.shadow4.shade.val + "px " + getColor(webeleData.font.shadow4.color);
            }
            cssData.opacity.opacity = getVal(webeleData.opacity.opacity.val);
            cssData.position.position = getVal(webeleData.position.position.val);
            cssData.position.display = getVal(webeleData.position.display.val);
            cssData.position.zIndex = getVal(webeleData.position.zIndex.val);
            cssData.position.float = getVal(webeleData.position.float.val);
            cssData.position.clear = getVal(webeleData.position.clear.val);
            cssData.position.whiteSpace = getVal(webeleData.position.whiteSpace.val);
            cssData.position.overflow.x = getVal(webeleData.position.overflow.x.val);
            cssData.position.overflow.y = getVal(webeleData.position.overflow.y.val);
            cssData.position.top = getUnitVal(webeleData.position.top);
            cssData.position.left = getUnitVal(webeleData.position.left);
            cssData.position.bottom = getUnitVal(webeleData.position.bottom);
            cssData.position.right = getUnitVal(webeleData.position.right);
            if (webeleData.boxShadow.x.val !== 0 || webeleData.boxShadow.y.val !== 0 || webeleData.boxShadow.shade.val !== 0 || webeleData.boxShadow.size.val !== 0) {
              cssData.boxShadow.boxShadow = webeleData.boxShadow.x.val + "px " + webeleData.boxShadow.y.val + "px " + webeleData.boxShadow.shade.val + "px " + webeleData.boxShadow.size.val + "px " + getColor(webeleData.boxShadow.color) + " " + webeleData.boxShadow.inset.val;
            } else {
              cssData.boxShadow.boxShadow = "";
            }
            _ref4 = ["normal", "min", "max"];
            for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
              section = _ref4[_m];
              cssData.size[section].width = getUnitVal(webeleData.size[section].width);
              cssData.size[section].height = getUnitVal(webeleData.size[section].height);
            }
            _ref5 = ["left", "top", "right", "bottom"];
            for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
              section = _ref5[_n];
              cssData.space[section].margin = getUnitVal(webeleData.space[section].margin);
              cssData.space[section].padding = getUnitVal(webeleData.space[section].padding);
            }
            if (webeleData.transform.rotate.x.val || webeleData.transform.rotate.y.val || webeleData.transform.rotate.z.val || webeleData.transform.scale.val !== 1 || webeleData.transform.skew.x.val || webeleData.transform.skew.y.val || webeleData.transform.translate.x.val || webeleData.transform.translate.y.val) {
              cssData.transform.transform = "rotate3d(1,0,0," + webeleData.transform.rotate.x.val + "deg) " + "rotate3d(0,1,0," + webeleData.transform.rotate.y.val + "deg) " + "rotate3d(0,0,1," + webeleData.transform.rotate.z.val + "deg) " + "scale(" + webeleData.transform.scale.val + ") " + "skew(" + webeleData.transform.skew.x.val + "deg, " + webeleData.transform.skew.y.val + "deg) " + "translate(" + webeleData.transform.translate.x.val + "px, " + webeleData.transform.translate.y.val + "px)";
            } else {
              cssData.transform.transform = "";
            }
            if (webeleData.transform.origin.x.val || webeleData.transform.origin.y.val) {
              cssData.transform.origin = webeleData.transform.origin.x.val + "% " + webeleData.transform.origin.y.val + "%";
            } else {
              cssData.transform.origin = "";
            }
            setCSSStr(cssData);
            if (getColor(webeleData.font.linkColor.normal)) {
              cssData = data.css[key_res][webele][anime].link;
              cssData.animation.time = getVal(webeleData.animation.time.val);
              cssData.animation.trigger = "";
              cssData.font.color = getColor(webeleData.font.linkColor.normal);
              setCSSStr(cssData);
              cssData.animation.time = "";
              cssData.animation.trigger = "hover";
              cssData.font.color = getColor(webeleData.font.linkColor.hover);
              _results2.push(setCSSStr(cssData));
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        })());
      }
      return _results1;
    })());
  }
  return _results;
};



},{"./data":22,"core":2,"css":9,"debug":12,"event/trans":17,"web":25}],22:[function(require,module,exports){
var anime, colorNameList, core, css, debug, ele, getColorGuiData, getJsonData, getPageCookieName, getUnitSliderGuiData, map, propData, res, setID, setLocalData, web, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

debug = require("debug");

core = require("core");

web = require("web");

css = require("css");

exports.name = "webele";

exports.webeleList = web.data.getValues(this.name);

exports.HSL = {
  H: 0,
  S: 50,
  L: 50
};

exports.colorList = web.color.getColorList(this.HSL);

colorNameList = web.color.getColorName();

colorNameList.color.unshift("");

colorNameList.tone.unshift("");

debug.data.imageList.unshift("");

exports.responsiveMax = "small";

exports.responsiveList = ["exSmall", "small", "middle", "large"];

exports.animationState = ["start", "end"];

getColorGuiData = function() {
  return {
    name: "color",
    colorName: new web.gui.selectBox({
      option: colorNameList.color
    }),
    tone: new web.gui.selectBox({
      val: "normal",
      option: colorNameList.tone
    })
  };
};

getUnitSliderGuiData = function(sliderData, unitData) {
  return {
    name: "unitSlider",
    num: new web.gui.slider(sliderData),
    unit: new web.gui.selectBox(unitData)
  };
};

setID = function(guiObj) {
  var key, param, set, _results;
  set = function(argKey, argParam) {
    var id, key, param, subKey, subParam, _results;
    _results = [];
    for (key in argParam) {
      param = argParam[key];
      id = argKey + "_" + key;
      if (!param.name) {
        _results.push(set(id, param));
      } else {
        if (param.name === "unitSlider" || param.name === "color") {
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (subKey in param) {
              subParam = param[subKey];
              _results1.push(subParam.id = id + "_" + subKey);
            }
            return _results1;
          })());
        } else {
          _results.push(param.id = id);
        }
      }
    }
    return _results;
  };
  _results = [];
  for (key in guiObj) {
    param = guiObj[key];
    _results.push(set(key, param));
  }
  return _results;
};

exports.webele = {};

exports.gui_css = {
  animation: {
    init: function() {
      this.trigger = new web.gui.selectBox({
        option: ["", "hover", "active", "target", "focus", "checkd"]
      });
      return this.time = new web.gui.slider({
        param: {
          step: 0.01
        }
      });
    }
  },
  background: {
    init: function() {
      var section, _i, _j, _k, _len, _len1, _ref, _ref1;
      this.color = getColorGuiData();
      this.image = new web.gui.selectBox({
        option: debug.data.imageList
      });
      this.repeat = new web.gui.selectBox({
        option: ["", "repeat", "repeat-x", "repeat-y", "no-repeat"]
      });
      this.attachment = new web.gui.selectBox({
        option: ["", "scroll", "fixed"]
      });
      this.grdDirection = new web.gui.selectBox({
        option: ["", "left", "left top", "left bottom", "right", "right top", "right bottom", "top", "bottom", "circle"]
      });
      this.grdPercent = new web.gui.slider({
        val: [0, 0],
        option: ["", "left", "left top", "left bottom", "right", "right top", "right bottom", "top", "bottom", "circle"],
        param: {
          range: true
        }
      });
      this.grdColor = {};
      for (section = _i = 1; _i <= 3; section = ++_i) {
        this.grdColor[section] = getColorGuiData();
      }
      this.size = {};
      _ref = ["x", "y"];
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        section = _ref[_j];
        this.size[section] = getUnitSliderGuiData({
          param: {
            max: 2000,
            min: -2000
          }
        }, {
          val: "auto",
          option: ["auto", "contain", "cover", "px", "%"]
        });
      }
      this.coord = {};
      _ref1 = ["x", "y"];
      for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
        section = _ref1[_k];
        this.coord[section] = getUnitSliderGuiData({
          param: {
            max: 2000,
            min: -2000
          }
        }, {
          val: "auto",
          option: ["auto", "px", "%"]
        });
      }
      return this.direction = {
        x: new web.gui.selectBox({
          option: ["", "left", "right"]
        }),
        y: new web.gui.selectBox({
          option: ["", "top", "bottom"]
        })
      };
    }
  },
  border: {
    init: function() {
      var section, _i, _len, _ref, _results;
      _ref = ["all", "left", "top", "right", "bottom"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = {
          width: new web.gui.slider({
            param: {
              max: 1000
            }
          }),
          style: new web.gui.selectBox({
            option: ["", "none", "hidden", "solid", "double", "groove", "ridge", "inset", "outset", "dashed", "dotted"]
          }),
          color: getColorGuiData()
        });
      }
      return _results;
    }
  },
  borderRadius: {
    init: function() {
      var section, _i, _len, _ref, _results;
      _ref = ["all", "topLeft", "topRight", "bottomLeft", "bottomRight"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = new web.gui.slider({
          param: {
            max: 500
          }
        }));
      }
      return _results;
    }
  },
  font: {
    init: function() {
      var section, _i, _len, _ref, _results;
      this.family = new web.gui.selectBox({
        option: ["", "Andale Mono", "Arial", "Arial Black", "Comic Sans MS", "Courier", "FixedSys", "Georgia", "Helvetica", "Impact", "Lucida", "ＭＳ Ｐゴシック", "ＭＳ Ｐ明朝", "ＭＳ ゴシック", "ＭＳ 明朝", "MS UI Gothic", "Small Fonts", "Symbol", "System", "Terminal", "Times New Roman", "Trebuchet MS", "Verdana", "Webdings"]
      });
      this.size = new web.gui.slider({
        param: {
          max: 300
        }
      });
      this.lineHeight = getUnitSliderGuiData({
        param: {
          max: 1000
        }
      }, {
        val: "",
        option: ["", "normal", "%", "px"]
      });
      this.weight = new web.gui.slider({
        param: {
          max: 900,
          min: 100,
          step: 100
        }
      });
      this.align = new web.gui.selectBox({
        option: ["", "left", "right", "center"]
      });
      this.decoration = new web.gui.selectBox({
        option: ["", "none", "underline", "overline", "line-through", "blink"]
      });
      this.fontColor = getColorGuiData();
      this.linkColor = {
        normal: getColorGuiData(),
        hover: getColorGuiData()
      };
      _ref = ["shadow1", "shadow2", "shadow3", "shadow4"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = {
          x: new web.gui.slider({
            param: {
              max: 1000,
              min: -1000
            }
          }),
          y: new web.gui.slider({
            param: {
              max: 1000,
              min: -1000
            }
          }),
          shade: new web.gui.slider({
            param: {
              max: 500
            }
          }),
          color: getColorGuiData()
        });
      }
      return _results;
    }
  },
  opacity: {
    init: function() {
      return this.opacity = new web.gui.slider({
        param: {
          max: 1,
          step: 0.01
        }
      });
    }
  },
  position: {
    init: function() {
      var section, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.position = new web.gui.selectBox({
        option: ["", "static", "absolute", "relative", "fixed"]
      });
      this.display = new web.gui.selectBox({
        option: ["", "inline", "block", "list-item", "run-in", "inline-block", "table", "inline-table", "table-row-group", "table-header-group", "table-footer-group", "table-row", "table-column-group", "table-column", "table-cell", "table-caption", "none", "inherit"]
      });
      this.zIndex = new web.gui.slider({
        param: {
          max: 1000,
          min: -1000
        }
      });
      this.float = new web.gui.selectBox({
        option: ["", "left", "right"]
      });
      this.clear = new web.gui.selectBox({
        option: ["", "left", "right", "both"]
      });
      this.whiteSpace = new web.gui.selectBox({
        option: ["", "normal", "nowrap", "pre"]
      });
      _ref = ["top", "left", "bottom", "right"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        this[section] = getUnitSliderGuiData({
          param: {
            max: 2000,
            min: -2000
          }
        }, {
          val: "",
          option: ["", "auto", "px", "%"]
        });
      }
      this.overflow = {};
      _ref1 = ["x", "y"];
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        section = _ref1[_j];
        _results.push(this.overflow[section] = new web.gui.selectBox({
          option: ["", "visible", "scroll", "hidden", "auto"]
        }));
      }
      return _results;
    }
  },
  boxShadow: {
    init: function() {
      var section, _i, _len, _ref;
      _ref = ["x", "y"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        this[section] = new web.gui.slider({
          param: {
            max: 1000,
            min: -1000
          }
        });
      }
      this.shade = new web.gui.slider({
        param: {
          max: 500
        }
      });
      this.size = new web.gui.slider({
        param: {
          max: 1000,
          min: -1000
        }
      });
      this.color = getColorGuiData();
      return this.inset = new web.gui.selectBox({
        option: ["", "inset"]
      });
    }
  },
  size: {
    init: function() {
      var section, _i, _len, _ref, _results;
      _ref = ["normal", "max", "min"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = {
          width: getUnitSliderGuiData({
            param: {
              max: 2000
            }
          }, {
            val: "",
            option: ["", "auto", "%", "px", "none"]
          }),
          height: getUnitSliderGuiData({
            param: {
              max: 2000
            }
          }, {
            val: "",
            option: ["", "auto", "%", "px", "none"]
          })
        });
      }
      return _results;
    }
  },
  space: {
    init: function() {
      var section, _i, _len, _ref, _results;
      _ref = ["all", "left", "top", "right", "bottom"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(this[section] = {
          margin: getUnitSliderGuiData({
            param: {
              max: 1000,
              min: -1000
            }
          }, {
            val: "",
            option: ["", "auto", "%", "px"]
          }),
          padding: getUnitSliderGuiData({
            param: {
              max: 1000,
              min: -1000
            }
          }, {
            val: "",
            option: ["", "auto", "%", "px"]
          })
        });
      }
      return _results;
    }
  },
  transform: {
    init: function() {
      var section, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _results;
      this.scale = new web.gui.slider({
        val: 1,
        param: {
          max: 10,
          step: 0.01
        }
      });
      this.rotate = {};
      _ref = ["x", "y", "z"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        this.rotate[section] = new web.gui.slider({
          param: {
            max: 180,
            min: -180
          }
        });
      }
      this.skew = {};
      _ref1 = ["x", "y"];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        section = _ref1[_j];
        this.skew[section] = new web.gui.slider({
          param: {
            max: 180,
            min: -180
          }
        });
      }
      this.translate = {};
      _ref2 = ["x", "y"];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        section = _ref2[_k];
        this.translate[section] = new web.gui.slider({
          param: {
            max: 2000,
            min: -2000
          }
        });
      }
      this.origin = {};
      _ref3 = ["x", "y"];
      _results = [];
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        section = _ref3[_l];
        _results.push(this.origin[section] = new web.gui.slider({}));
      }
      return _results;
    }
  }
};

core.obj.allCall(this.gui_css, {
  key: "init",
  arg: []
});

core.obj.allDelete(this.gui_css, "init");

setID(this.gui_css);

map = [this.responsiveList, this.webeleList, this.animationState];

core.obj.setMapVal(this.webele, map, this.gui_css);

exports.css = {};

_ref = this.responsiveList;
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  res = _ref[_i];
  this.css[res] = {};
  _ref1 = this.webeleList;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    ele = _ref1[_j];
    this.css[res][ele] = {};
    _ref2 = this.animationState;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      anime = _ref2[_k];
      this.css[res][ele][anime] = {};
      propData = {
        id: res + "_" + ele + "_" + anime,
        selector: ["[data-webele=\"" + ele + "\"]"],
        media: {
          name: "min-width",
          val: web.size.getResponsiveMinWidth(res)
        }
      };
      this.css[res][ele][anime].main = new css.prop(propData);
      propData.selector = [propData.selector[0] + " a"];
      this.css[res][ele][anime].link = new css.prop(propData);
    }
  }
}

core.obj.allCall(this.css, {
  key: "init",
  arg: []
});

core.obj.allDelete(this.css, "init");

exports.optionData = {};

exports.gui_option = {
  trans: {
    init: function() {
      this.time = new web.gui.slider({
        param: {
          max: 10000,
          step: 100
        }
      });
      return this.method = new web.gui.selectBox({
        val: "none",
        option: ["none", "fade", "ver_blind", "hor_blind", "clip", "drop_up", "drop_down", "drop_left", "drop_right", "ver_slide", "hor_slide", "fold", "puff_on", "puff_off"]
      });
    }
  }
};

core.obj.allCall(this.gui_option, {
  key: "init",
  arg: []
});

core.obj.allDelete(this.gui_option, "init");

setID(this.gui_option);

core.obj.setMapVal(this.optionData, [], this.gui_option);

getPageCookieName = function() {
  var strList;
  strList = location.href.split("/");
  return strList[strList.length - 1].split(".")[0] + this.name;
};

getJsonData = (function(_this) {
  return function() {
    return {
      webele: _this.webele,
      gui_css: _this.gui_css,
      gui_option: _this.gui_option,
      HSL: _this.HSL,
      optionData: _this.optionData,
      responsiveMax: _this.responsiveMax
    };
  };
})(this);

setLocalData = (function(_this) {
  return function() {
    var jsonLoadEvent, setJSONData;
    setJSONData = function(data) {
      core.obj.marge(_this.gui_css, data.gui_css);
      core.obj.marge(_this.gui_option, data.gui_option);
      core.obj.marge(_this.webele, data.webele);
      core.obj.setMapVal(_this.gui_css, [["position"], ["left", "right", "bottom", "top"]], {
        name: "unitSlider"
      });
      core.obj.setMapVal(_this.gui_css, [["background"], ["image"]], {
        option: debug.data.imageList
      });
      _this.HSL = data.HSL;
      _this.optionData = data.optionData;
      return _this.responsiveMax = data.responsiveMax;
    };
    jsonLoadEvent = function(data) {
      var ctr;
      setJSONData(data);
      ctr = require("./ctr");
      return ctr.init();
    };
    if (localStorage.getItem(getPageCookieName())) {
      return setJSONData(JSON.parse(localStorage.getItem(getPageCookieName())));
    } else if (localStorage.getItem(_this.name)) {
      return setJSONData(JSON.parse(localStorage.getItem(_this.name)));
    } else {
      return core.file.getJSONFile("./src/webCustomizer/" + getPageCookieName() + ".json", jsonLoadEvent);
    }
  };
})(this);

exports.setCookie_G = function() {
  return localStorage.setItem(this.name, JSON.stringify(getJsonData()));
};

exports.clearCookie_G = function() {
  return localStorage.removeItem(this.name);
};

exports.setCookie = function() {
  return localStorage.setItem(getPageCookieName(), JSON.stringify(getJsonData()));
};

exports.clearCookie = function() {
  return localStorage.removeItem(getPageCookieName());
};

exports.saveAsFile = function() {
  return core.file.downloadData(JSON.stringify(getJsonData()), getPageCookieName() + ".json");
};

setLocalData();



},{"./ctr":21,"core":2,"css":9,"debug":12,"web":25}],23:[function(require,module,exports){
var ctr_css;

require("./data");

require('./view');

require("event/com");

ctr_css = require('./ctr');

ctr_css.init();



},{"./ctr":21,"./data":22,"./view":24,"event/com":16}],24:[function(require,module,exports){
var data, getChanger, getHeader, html, makeGui, web;

data = require('./data');

html = require('html');

web = require('web');

getHeader = function(id, iconName, domList) {
  var dom;
  dom = [
    [
      "div", {
        id: id,
        "class": "webCustomizer box_accordion draggable"
      }
    ], [
      [
        "div", {
          "class": "trigger fixed"
        }
      ], [html.dom.icon(id + "Icon", iconName, "fa-2x")], [
        "div", {
          "class": "contents"
        }
      ], domList
    ]
  ];
  return dom;
};

makeGui = function(guiObj) {
  var dom, key, makeContents, param;
  makeContents = function(dataParam) {
    var dom, dom_gui, getGuiDom, key, param, subKey, subParam;
    dom = [];
    for (key in dataParam) {
      param = dataParam[key];
      if (!param.name) {
        dom.push.apply(dom, [
          [
            "td", {
              "class": "sub",
              colspan: "3"
            }, key
          ], makeContents(param)
        ]);
      } else {
        getGuiDom = function(param, attr) {
          var slider, tempDom;
          if (attr == null) {
            attr = {};
          }
          tempDom = [];
          switch (param.name) {
            case "slider":
              slider = param.makeDom();
              tempDom = [[slider.slider, ["span"], slider.input]];
              break;
            case "selectBox":
              tempDom = [param.makeDom()];
          }
          return tempDom;
        };
        dom_gui = [["td"]];
        if (param.name === "unitSlider" || param.name === "color") {
          for (subKey in param) {
            subParam = param[subKey];
            dom_gui.push.apply(dom_gui, getGuiDom(subParam));
          }
        } else {
          dom_gui.push.apply(dom_gui, getGuiDom(param));
        }
        dom.push.apply(dom, [["tr"], [["td", {}, key]], dom_gui]);
      }
    }
    return dom;
  };
  dom = [];
  for (key in guiObj) {
    param = guiObj[key];
    dom.push.apply(dom, [
      [
        "div", {
          id: key + "Setter",
          "class": "setterArea box_accordion"
        }
      ], [
        [
          "div", {
            "class": "trigger"
          }, key
        ], [
          "div", {
            "class": "contents"
          }
        ], [["table"], makeContents(param)]
      ]
    ]);
  }
  return dom;
};

getChanger = function() {
  var dom, getCSS, getColorScheme, getData, getOption;
  getCSS = function() {
    return getHeader("cssChanger", "edit", [
      [
        "div", {
          "class": "headerArea"
        }
      ], [
        [
          "div", {
            "class": "headerFunction"
          }
        ], [["span", {}, "element"], html.dom.input("webeleName_input", 10, "none", "webeleName"), ["span", {}, "anime"], html.dom.selectBox("animationState_select", data.animationState), ["span", {}, "all"], html.dom.checkbox("animAll_checked", "false")], [
          "div", {
            "class": "headerFunction"
          }
        ], [["span", {}, "responsive"], html.dom.input("responsive_input", 7, "exSmall"), ["span", {}, "all"], html.dom.checkbox("resAll_checked", "true"), ["span", {}, "max"], html.dom.selectBox("responsiveMax_select", data.responsiveList)]
      ], [
        "div", {
          "class": "contentsArea css"
        }
      ], makeGui(data.gui_css)
    ]);
  };
  getColorScheme = function() {
    return getHeader("colorSchemeChanger", "tint", [
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
            id: "colorpicker_webCustomizer"
          }
        ], [
          "input", {
            id: "colorInput_webCustomizer",
            type: "text",
            value: "0:0:0_#000000"
          }
        ]
      ]
    ]);
  };
  getOption = function() {
    return getHeader("optionChanger", "gear", [
      [
        "div", {
          "class": "headerArea"
        }
      ], [
        "div", {
          "class": "contentsArea option"
        }
      ], makeGui(data.gui_option)
    ]);
  };
  getData = function() {
    return getHeader("dataChanger", "save", [
      [
        "div", {
          "class": "headerArea"
        }
      ], [
        "div", {
          "class": "contentsArea"
        }
      ], [
        ["div", {}, "GlobalChash"], [
          [
            "button", {
              id: "global_save",
              type: "button",
              href: "data:test.txt"
            }, "Save"
          ], [
            "button", {
              id: "global_clear",
              type: "button"
            }, "Clear"
          ]
        ], ["div", {}, "PageChash"], [
          [
            "button", {
              id: "page_save",
              type: "button"
            }, "Save"
          ], [
            "button", {
              id: "page_clear",
              type: "button"
            }, "Clear"
          ]
        ], ["div", {}, "File"], [
          [
            "input", {
              id: "loader",
              "class": "displayNone",
              type: "file"
            }
          ], [
            "button", {
              id: "saveAsFile",
              type: "button"
            }, "Save"
          ], [
            "button", {
              id: "loadFromFile",
              type: "button"
            }, "Load"
          ]
        ], ["div", {}, "Code"], [
          [
            "button", {
              id: "generateCodes",
              type: "button"
            }, "GenerateCodes"
          ]
        ]
      ]
    ]);
  };
  dom = [];
  dom.push.apply(dom, getCSS());
  dom.push.apply(dom, getColorScheme());
  dom.push.apply(dom, getOption());
  dom.push.apply(dom, getData());
  return dom;
};

$("#webCustomizerArea").append(html.core.make(getChanger()));



},{"./data":22,"html":18,"web":25}],25:[function(require,module,exports){
module.exports = {
  data: require("./lib/data"),
  color: require("./lib/color"),
  size: require("./lib/size"),
  gui: require("./lib/gui"),
  core: require("./lib/core")
};



},{"./lib/color":26,"./lib/core":27,"./lib/data":28,"./lib/gui":29,"./lib/size":30}],26:[function(require,module,exports){

/**
  @class web.color
    web上で使用する色情報を扱います。
 */
var core;

core = require("core");


/**
  @method getColorList
  指定したHSLからカラーリストを取得します
  @param {object} HSL HSLデータ
  @return {object} カラーリスト
 */

exports.getColorList = function(HSL) {
  var addColorList, baseColor, baseColorList　, monoHSL, name, reverseMonoHSL, toneColorList, triadColorList;
  monoHSL = core.obj.clone(HSL);
  monoHSL["S"] = 0;
  reverseMonoHSL = core.obj.clone(HSL);
  reverseMonoHSL["S"] = 0;
  reverseMonoHSL["L"] = 100 - HSL["L"];
  baseColorList　 = {
    base: core.calc.hslToRGB(HSL),
    reverse: $.xcolor.complementary(core.calc.hslToRGB(HSL)),
    sepia: $.xcolor.sepia(core.calc.hslToRGB(HSL)),
    black: "#000",
    white: "#fff",
    blue: "#11c",
    mono: core.calc.hslToRGB(monoHSL),
    reverseMono: core.calc.hslToRGB(reverseMonoHSL)
  };
  addColorList = function(list, name, xColor) {
    list[name] = {};
    list[name]["normal"] = xColor;
    list[name]["dim"] = $.xcolor.subtractive("#eeeeee", xColor);
    list[name]["dark"] = $.xcolor.darken(xColor);
    list[name]["moreDark"] = $.xcolor.darken($.xcolor.darken(xColor));
    list[name]["light"] = $.xcolor.lighten(xColor);
    list[name]["moreLight"] = $.xcolor.lighten($.xcolor.lighten(xColor));
    return list[name]["webSafe"] = $.xcolor.webround(xColor);
  };
  toneColorList = {};
  for (name in baseColorList) {
    baseColor = baseColorList[name];
    triadColorList = $.xcolor.triad(baseColor);
    addColorList(toneColorList, name, triadColorList[0]);
    if (name === "base" || name === "reverse") {
      addColorList(toneColorList, name + "Second", triadColorList[1]);
      addColorList(toneColorList, name + "Third", triadColorList[2]);
    }
  }
  return toneColorList;
};


/**
  @method getColorName
  getColorListで取得できる色の名前一覧を取得します。
  @return {object} 名前一覧
 */

exports.getColorName = function() {
  var colorList, colorNameList, data, key, _ref;
  colorNameList = {
    color: [],
    tone: []
  };
  colorList = this.getColorList({
    H: "0",
    S: "0",
    L: "0"
  });
  for (key in colorList) {
    data = colorList[key];
    colorNameList.color.push(key);
  }
  _ref = colorList.base;
  for (key in _ref) {
    data = _ref[key];
    colorNameList.tone.push(key);
  }
  colorNameList.color = core.array.repFilter(colorNameList.color);
  colorNameList.tone = core.array.repFilter(colorNameList.tone);
  return colorNameList;
};



},{"core":2}],27:[function(require,module,exports){

/**
  @class web.core
    web操作の基本となるメソッドを管理します。
 */
var core;

core = require("core");


/**
  @method getDataValList
  指定したデータ属性の値を配列として重複なく習得します。
  @param {string} dataName データ属性名
  @return {array} データ属性の値一覧
 */

exports.getDataValList = function(dataName) {
  var array;
  array = $("*").map(function() {
    return $(this).data(dataName);
  }).get();
  return core.array.repFilter(array);
};


/**
  @method getIdList
  セレクタで指定した要素のIDを配列として重複なく習得します。
  @param {string} selector セレクタ
  @return {array} IDリスト
 */

exports.getEleIDList = function(selector) {
  var array;
  array = $(selector).map(function() {
    return $(this).attr("id");
  }).get();
  return core.array.repFilter(array);
};



},{"core":2}],28:[function(require,module,exports){

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



},{"core":2}],29:[function(require,module,exports){
var button, color, colorPicker, core, gui, html, input, selectBox, slider,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

core = require("core");

html = require('html');

color = require("./color");


/**
  @class web.gui
    guiをコントロールします。
 */

gui = (function() {
  function gui() {
    this.id = "";
  }

  return gui;

})();


/**
  @class web.gui.slider
    スライダーをコントロールします。
 */

slider = (function(_super) {
  __extends(slider, _super);

  function slider(arg) {
    slider.__super__.constructor.call(this);
    this.val = 0;
    this.name = "slider";
    this.param = {
      max: 100,
      min: 0,
      step: 1,
      range: false
    };
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  slider.prototype.makeDom = function() {
    return html.dom.slider(this.id + "-slider");
  };

  slider.prototype.initEvent = function(callback) {
    $("#" + this.id + "-slider").slider({
      max: this.param.max,
      min: this.param.min,
      step: this.param.step
    }, !this.param.range ? {
      value: this.val
    } : void 0, this.param.range ? {
      values: this.val
    } : void 0, this.param.range ? {
      range: this.param.range
    } : void 0);
    $("#" + this.id + "-slider").bind('slide', (function(_this) {
      return function(e, ui) {
        _this.val = ui.value;
        if (ui.values) {
          _this.val = ui.values;
        }
        _this.setGuiVal();
        callback.arg.unshift(_this.val);
        callback.arg.unshift(_this.id);
        if (callback) {
          return callback.method.apply(callback, callback.arg);
        }
      };
    })(this));
    return $("#" + this.id + "-slider_input").bind('change', (function(_this) {
      return function(e) {
        _this.val = $(e.currentTarget).val();
        _this.setGuiVal();
        callback.arg.unshift(_this.val);
        callback.arg.unshift(_this.id);
        if (callback) {
          return callback.method.apply(callback, callback.arg);
        }
      };
    })(this));
  };

  slider.prototype.setGuiVal = function() {
    if (this.param.range) {
      if (!Array.isArray(this.val)) {
        this.val = this.val.split(",");
      }
      $("#" + this.id + "-slider").slider({
        values: this.val
      });
    } else {
      $("#" + this.id + "-slider").slider({
        value: this.val
      });
    }
    return $("#" + this.id + "-slider_input").val(this.val);
  };

  return slider;

})(gui);


/**
  @class web.gui.selectBox
    セレクトボックスをコントロールします。
 */

selectBox = (function(_super) {
  __extends(selectBox, _super);

  function selectBox(arg) {
    selectBox.__super__.constructor.call(this);
    this.val = "";
    this.name = "selectBox";
    this.option = [];
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  selectBox.prototype.makeDom = function() {
    return html.dom.selectBox(this.id + "-selectBox", this.option);
  };

  selectBox.prototype.initEvent = function(callback) {
    return $("#" + this.id + "-selectBox").change((function(_this) {
      return function(e) {
        _this.val = $(e.currentTarget).val();
        _this.setGuiVal();
        callback.arg.unshift(_this.val);
        callback.arg.unshift(_this.id);
        if (callback) {
          return callback.method.apply(callback, callback.arg);
        }
      };
    })(this));
  };

  selectBox.prototype.setGuiVal = function() {
    return $("#" + this.id + "-selectBox").val(this.val);
  };

  return selectBox;

})(gui);


/**
  @class web.gui.colorPicker
    colorPickerをコントロールします。
 */

colorPicker = (function(_super) {
  __extends(colorPicker, _super);

  function colorPicker(arg) {
    this.initEvent = __bind(this.initEvent, this);
    colorPicker.__super__.constructor.call(this);
    this.val = {
      H: 0,
      S: 50,
      L: 50
    };
    this.name = "colorPicker";
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  colorPicker.prototype.initEvent = function(callback) {
    $('#' + this.id).farbtastic('#' + this.id + "_input");
    $.farbtastic('#' + this.id).setColor(core.calc.hslToRGB(this.val));
    return $("#" + this.id + "_input").bind('change', (function(_this) {
      return function(e) {
        var getHSL;
        getHSL = function() {
          var hslSprit;
          hslSprit = $(e.currentTarget).val().split("_")[0].split(":");
          if (hslSprit[0] === "NaN" || hslSprit[1] === "NaN" || hslSprit[2] === "NaN") {
            return;
          }
          return {
            H: Number(hslSprit[0]),
            S: Number(hslSprit[1]),
            L: Number(hslSprit[2])
          };
        };
        _this.val = getHSL();
        callback.arg.unshift(_this.val);
        callback.arg.unshift(_this.id);
        if (callback) {
          return callback.method.apply(callback, callback.arg);
        }
      };
    })(this));
  };

  colorPicker.prototype.setGuiVal = function() {
    return $.farbtastic('#' + this.id).setColor(core.calc.hslToRGB(this.val));
  };

  return colorPicker;

})(gui);


/**
  @class web.gui.input
    inputをコントロールします。
 */

input = (function(_super) {
  __extends(input, _super);

  function input(arg) {
    input.__super__.constructor.call(this);
    this.val = "";
    this.name = "input";
    this.colorList = {};
    this.event = true;
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  input.prototype.makeDom = function() {
    return html.dom.input(this.id + "-input", "10");
  };

  input.prototype.initEvent = function(callback) {
    if (this.event) {
      return $("#" + this.id + "-input").bind('change', (function(_this) {
        return function(e) {
          _this.val = $(e.currentTarget).val();
          callback.arg.unshift(_this.val);
          callback.arg.unshift(_this.id);
          if (callback) {
            return callback.method.apply(callback, callback.arg);
          }
        };
      })(this));
    }
  };

  return input;

})(gui);


/**
  @class web.gui.button
    inputをコントロールします。
 */

button = (function(_super) {
  __extends(button, _super);

  function button(arg) {
    button.__super__.constructor.call(this);
    this.val = "";
    this.text = "";
    this.name = "button";
    this.callback = "";
    if (arg) {
      core.obj.marge(this, arg);
    }
  }

  button.prototype.makeDom = function() {
    return html.dom.button(this.id + "-button", this.text);
  };

  button.prototype.initEvent = function() {
    return $("#" + this.id + "-button").click((function(_this) {
      return function(event) {
        return _this.callback(_this);
      };
    })(this));
  };

  return button;

})(gui);

module.exports = {
  gui: gui,
  slider: slider,
  selectBox: selectBox,
  colorPicker: colorPicker,
  input: input,
  button: button
};



},{"./color":26,"core":2,"html":18}],30:[function(require,module,exports){

/**
  @class web.size
    ブラウザ周りのサイズを操作します。
 */

/**
  @method getResponsiveName
  現在のinnnerWidthに対応したレスポンシブ名を取得します。
  @return {String} サイズ名
 */
exports.getResponsiveName = function() {
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
  @method getResponsiveMaxWidth
  指定したレスポンシブ名の最大width値取得します。
  @param {String} name レスポンシブ名
  @return {Number} innerWidth最大値
 */

exports.getResponsiveMaxWidth = function(name) {
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
  @method getResponsiveMinWidth
  指定したレスポンシブ名の最小width値取得します。
  @param {String} name レスポンシブ名
  @return {Number} innerWidth最小値
 */

exports.getResponsiveMinWidth = function(name) {
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


/**
  @method chooseResponsiveMax
  レスポンシブ名と最大値名を比較し、最大値以下の最小値である値を取得します。
  @param {String} resNameレスポンシブ名
  @param {String} resMax 最大値名
  @return {Number} 選択された最大値以下の最小レスポンシブ名
 */

exports.chooseResponsiveMax = function(resName, resMax) {
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
  maxResVal = getVal(resMax);
  if (nowResVal > maxResVal) {
    return resMax;
  }
  return resName;
};



},{}]},{},[1])