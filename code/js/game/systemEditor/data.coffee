core = require("core")
web = require("web")
data = require("../lib/data")
layerObj = require("../lib/layerObj")
socketIO = require('socket.io-client')

###
  util
###
getHaederID = (id) ->
  id.split("_")[0]

setObjID = (param) =>
  $("#objID_input").val(param.id)
  $("#objID_input").trigger("change")

setID = (headerID, guiObj) ->
  set = (argKey, argParam) ->
    for key, param of argParam
      id = argKey + "_" + key
      if !param.name
        set(id, param)
      else
        if param.name == "unitSlider" or param.name == "color"
          for subKey, subParam of param
            subParam.id =  id + "_" + subKey
        else
          param.id = headerID + "_" + id
  for key, param of guiObj
    set(key, param)

initDefine = (define) ->
  core.obj.allCall(define.gui, {key:"init", arg:[]})
  core.obj.allDelete(define.gui, "init")
  setID(define.name, define.gui)
  core.obj.setMapVal(define.temp, [], define.gui)

###
  通信
###
io = socketIO.connect('http://localhost:1234');
io.on('connect', (msg) ->
  console.log("connect");
)

io.on('systemEditor_load_end', (loadData) =>
  for key, param of loadData.layerObj
    data.layer["debug"].obj[key] = new layerObj.layerObj(param)
    data.layer["debug"].obj[key].initEvent(setObjID)
  @gui_objData = loadData.gui_objData
  ctr = require("./ctr")
  ctr.update()
)

###
  データメソッド
###
save = (param) =>
  makeSaveData = () =>
  headerID = param.id.split("_")[0]
  saveData = {}
  switch headerID
    when "layer"
      saveData = 
        {
          layerObj        : data.layer["debug"].obj
          gui_objData     : @gui_objData
        }
    when "obj"
      saveData = 
        {
          layerObj        : data.layer["debug"].obj
          gui_objData     : @gui_objData
        }
  io.emit 'systemEditor_save', JSON.stringify(makeSaveData())

load = (param) =>
  io.emit 'systemEditor_load'

create = (param) =>
  headerID = getHaederID(param.id)
  id = $("#" + headerID + "_file_id-input").val()
  switch headerID
    when @layer.name
      data.layer[id] = new Layer({name:id})
  core.obj.setMapVal(@[headerID].data, [[id]], @[headerID].gui)
  $("#" + headerID + "ID_input").val(id)
  $("#" + headerID + "ID_input").trigger("change")

deleteData = (param) =>
  id = $("#objID_input").val()
  data.layer["debug"].obj[id].clear()
  delete data.layer["debug"].obj[id]
  delete @gui_objData[id]

###
  define
###
exports.layer = 
  name: "layer"
  data: {}
  temp: {}
  selected: "none"
  gui:
    file:
      init:() ->
        @id =
          new web.gui.input
            event: false
        @save =
          new web.gui.button
            text: "save"
            callback: save
        @load =
          new web.gui.button
            text: "load"
            callback: load
        @create =
          new web.gui.button
            text: "create"
            callback: create
        @delete =
          new web.gui.button
            text: "delete"
            callback: deleteData     

exports.obj =
  name: "obj"
  data: {}
  temp: {}
  selected: "none"
  gui:
    base:
      init:() ->
        @save =
          new web.gui.button
            text: "save"
            callback: save
        @load =
          new web.gui.button
            text: "load"
            callback: load
        @create =
          new web.gui.button
            text: "create"
            callback: create
        @delete =
          new web.gui.button
            text: "delete"
            callback: deleteData
    color:
      init:() ->
        @colorPicker =
          new web.gui.colorPicker {}
    rectangle:
      init:() ->
        @width = 
          new web.gui.slider
            param:
              max: 1920
        @height =
          new web.gui.slider
            param:
              max: 1080
    image:
      init:() ->
        @fileName =
          new web.gui.selectBox
            option: ["", "bg1.png", "bg2.png"]
    text:
      init:() ->
        @text =
          new web.gui.input

initDefine(@layer)
initDefine(@obj)

console.log @layer
console.log @obj