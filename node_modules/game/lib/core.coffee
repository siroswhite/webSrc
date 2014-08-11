###*
  @class game.core
  基本となるメソッドを扱います。
###
core = require('core')
data = require("./data")
config = require("./config").config

debug = true
#==============================================================================
# method
#==============================================================================
###*
  @method start
  ゲームを開始します。
  @param {String} divName ゲーム描画先のdiv名
###
exports.start = (divName) ->
  #パラメータ初期化
  # data.layer["bg"] = new Layer({name: "bg"})
  # data.layer["bg"] = new layer({id:"bg"})
  # data.layer["bg"] = new layer.layer({id:"bg"})
  # data.layer["bg"].setColor("#333")
  # data.layer["map1"] = new layer.layer({id:"map1"})
  # data.layer["map1"].setColor("#c00")
  # data.layer["bg"].show()

  # #デバックモード起動
  if debug
    data.layer["debug"] = new Layer({name: "debug"})
    # data.layer["debug"] = new layer.layer({id:"debug"})
    # data.layer["debug"].show()
    editor = require("../systemEditor")
  
  #開始画面表示
  #@title()

###*
  @method title
  タイトル画面を表示します。
###
exports.title = () ->
  titleInputCtr = (input) ->
    console.log input
  #@inputCtr("title", titleInputCtr)
  #背景画面表示
  #コントロール受付
  #require("webCustomizer")

###*
  @method inputCtr
  入力情報を制御します。
  @param {String} process 現在のゲームプロセス
  @param {String} callback 入力されたキー情報を渡す関数
###
exports.inputCtr = (process, callback) ->
  $(window).keydown (e) =>
    callback e.keyCode
    return false