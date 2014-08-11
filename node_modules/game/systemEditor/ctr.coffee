core = require("core")
data  = require('./data')
web = require("web")
gameData = require("../lib/data")
objSelect     = "none"

###
  util
###
getHaederID = (id) ->
  id.split("_")[0]

###
  main
###
exports.update = () ->
  for key, param of gameData.layer["debug"].obj
    objSelect = key
    setData()

setData = (target) ->
  core.obj.marge(target.temp, target.data[target.selected])
  core.obj.allCall(target.temp, {key:"setGuiVal", arg:[]})
  console.log project.layers

setObjData = (id, val) ->
  headerID = getHaederID(id)
  target = data[headerID]
  targetData = target.data[target.selected]
  idList = id.split("_")
  idList.shift()
  console.log target
  console.log idList
  console.log targetData
  if idList.indexOf("all") == -1
    for key in idList
      targetData = targetData[key]
    if core.obj.check(val) 
      targetData.val = core.obj.deepClone(val)
    else
      targetData.val = val
  else
    for index, param of core.obj.parallelLoop(targetData, idList, idList.indexOf("all"))
      param.val = val
      param.setGuiVal()
  updateView(headerID)

updateView = (headerID) ->
  ###
    util
  ###
  getVal = (valData) ->
    if valData then return valData else return 0

  ###
    main
  ###
  switch headerID
    when data.layer.name
      console.log "layer"
    when data.obj.name
      objData = gameData.layer[data.layer.selected].obj[data.obj.selected]
      colorList = web.color.getColorList(data.gui_obj.color.colorPicker.val)

      if data.gui_obj.rectangle.width.val
        objData.width = data.gui_obj.rectangle.width.val
      if data.gui_obj.rectangle.height.val then objData.height = data.gui_obj.rectangle.height.val
      objData.color = colorList.base.normal

      objData.clear()
      objData.setColor()
      #layer.setImage(objData.image.fileName.val)
      #layer.setText(objData.text.text.val)

#==============================================================================
# event
#==============================================================================
core.obj.allCall(data.layer.temp, {key:"initEvent", arg:[{method:setObjData, arg:[]}]})
core.obj.allCall(data.obj.temp, {key:"initEvent", arg:[{method:setObjData, arg:[]}]})

$("#objID_input, #layerID_input").bind 'change', (e) =>
  headerID = e.currentTarget.id.split("_")[0]
  console.log headerID
  switch headerID
    when data.layer.name + "ID"
      data.layer.selected = e.currentTarget.value
      setData(data.layer)
    when data.obj.name + "ID"
      data.obj.selected = e.currentTarget.value
      setData(data.obj)