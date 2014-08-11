debug = require("debug")
core = require("core")
web = require("web")
css = require("css")

exports.name = "webele"
exports.webeleList = web.data.getValues(@name)

exports.HSL = {H:0, S:50, L:50}
exports.colorList = web.color.getColorList(@HSL)
colorNameList = web.color.getColorName()
colorNameList.color.unshift("")
colorNameList.tone.unshift("")
debug.data.imageList.unshift("")

exports.responsiveMax = "small"
exports.responsiveList = ["exSmall", "small", "middle" , "large"]
exports.animationState = ["start", "end"]

getColorGuiData = () ->
  {
    name: "color"
    colorName:
      new web.gui.selectBox
        option: colorNameList.color
    tone:
      new web.gui.selectBox
        val: "normal"
        option: colorNameList.tone
  }

getUnitSliderGuiData = (sliderData, unitData) ->
  {
    name: "unitSlider"
    num:
      new web.gui.slider sliderData
    unit:
      new web.gui.selectBox unitData
  }

setID = (guiObj) ->
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
          param.id = id
  for key, param of guiObj
    set(key, param)

exports.webele = {}
exports.gui_css =
  animation:
    init:() ->
      @trigger = 
        new web.gui.selectBox
          option: ["", "hover", "active", "target", "focus", "checkd"]
      @time =
        new web.gui.slider
          param:
            step: 0.01
  background:
    init:() ->
      @color = getColorGuiData()
      @image =
        new web.gui.selectBox
          option: debug.data.imageList
      @repeat =
        new web.gui.selectBox
          option: ["", "repeat", "repeat-x", "repeat-y", "no-repeat"]
      @attachment =
        new web.gui.selectBox
          option: ["", "scroll", "fixed"]
      @grdDirection =
          new web.gui.selectBox
            option: ["", "left", "left top", "left bottom", "right", "right top", "right bottom", "top", "bottom", "circle"]
      @grdPercent =
          new web.gui.slider
            val: [0, 0]
            option: ["", "left", "left top", "left bottom", "right", "right top", "right bottom", "top", "bottom", "circle"]
            param:
              range: true
      @grdColor = {}
      for section in [1..3]
        @grdColor[section] = getColorGuiData()

      @size = {}
      for section in ["x", "y"]
        @size[section] = 
          getUnitSliderGuiData(
              {
                param:
                  max: 2000
                  min: -2000
              },
              {
                val: "auto"
                option: ["auto", "contain", "cover", "px", "%"]
              }
            )
      @coord = {}
      for section in ["x", "y"]
        @coord[section] =
          getUnitSliderGuiData(
            {
              param:
                max: 2000
                min: -2000
            },
            {
              val: "auto"
              option: ["auto", "px", "%"]
            }
          )
      @direction =
        x: new web.gui.selectBox
          option: ["", "left", "right"]
        y:
          new web.gui.selectBox
            option: ["", "top", "bottom"]
  border: 
    init: ()->
      for section in ["all", "left", "top", "right", "bottom"]
        @[section] = 
          width: 
            new web.gui.slider
              param:
                max: 1000
          style:
            new web.gui.selectBox
              option: ["", "none", "hidden", "solid", "double", "groove", "ridge", "inset", "outset", "dashed", "dotted"]
          color:
            getColorGuiData()
  borderRadius:
    init:() ->
      for section in ["all", "topLeft", "topRight", "bottomLeft", "bottomRight"]
        @[section] = 
          new web.gui.slider
            param:
              max: 500
  font:
    init:() ->
      @family =
        new web.gui.selectBox
          option: ["", "Andale Mono", "Arial", "Arial Black", "Comic Sans MS", "Courier", "FixedSys",
                   "Georgia", "Helvetica", "Impact", "Lucida", "ＭＳ Ｐゴシック", "ＭＳ Ｐ明朝", "ＭＳ ゴシック", "ＭＳ 明朝",
                   "MS UI Gothic", "Small Fonts", "Symbol", "System", "Terminal", "Times New Roman", "Trebuchet MS", "Verdana",
                   "Webdings"]
      @size =
        new web.gui.slider
          param:
            max:300
      @lineHeight =
        getUnitSliderGuiData(
          {
            param:
              max: 1000          
          },
          {
            val: ""
            option: ["", "normal", "%", "px"]          
          }
        ) 
      @weight =
        new web.gui.slider
          param:
            max: 900
            min: 100
            step: 100
      @align =
        new web.gui.selectBox
          option: ["", "left", "right", "center"]
      @decoration = 
        new web.gui.selectBox
          option: ["", "none", "underline", "overline", "line-through", "blink"]
      @fontColor =
        getColorGuiData()
      @linkColor = 
        normal:getColorGuiData()
        hover:getColorGuiData()
      for section in ["shadow1", "shadow2", "shadow3", "shadow4"]
        @[section] =
          x:
            new web.gui.slider
              param:
                max: 1000
                min: -1000
          y:
            new web.gui.slider
              param:
                max: 1000
                min: -1000
          shade:
            new web.gui.slider
              param:
                max: 500
          color:
            getColorGuiData()
  opacity:
    init: ()->
      @opacity =
        new web.gui.slider
          param:
            max: 1
            step: 0.01
  position:
    init: ()->
      @position =
        new web.gui.selectBox
          option: ["", "static", "absolute", "relative", "fixed"]
      @display =
        new web.gui.selectBox
          option: ["", "inline", "block", "list-item", "run-in", "inline-block", "table", "inline-table",
                    "table-row-group", "table-header-group", "table-footer-group", "table-row", "table-column-group",
                    "table-column", "table-cell", "table-caption", "none", "inherit"]
      @zIndex =
        new web.gui.slider
          param:
            max: 1000
            min: -1000
      @float =
        new web.gui.selectBox
          option: ["", "left", "right"]
      @clear =
        new web.gui.selectBox
          option: ["", "left", "right", "both"]
      @whiteSpace =
        new web.gui.selectBox
          option: ["", "normal", "nowrap", "pre"]      
      for section in ["top", "left", "bottom", "right"]
        @[section] =
          getUnitSliderGuiData(
              {
                param:
                  max: 2000
                  min: -2000
              },
              {
                val: ""
                option: ["", "auto", "px", "%"]
              }
            )
      @overflow = {}
      for section in ["x", "y"]
        @overflow[section] =
          new web.gui.selectBox
            option: ["", "visible", "scroll", "hidden", "auto"]
  boxShadow:
    init: ()->
      for section in ["x", "y"]
        @[section] =
          new web.gui.slider
            param:
              max: 1000
              min: -1000
      @shade =
        new web.gui.slider
          param:
            max: 500
      @size =
        new web.gui.slider
          param:
            max: 1000
            min: -1000
      @color =
        getColorGuiData()
      @inset =
        new web.gui.selectBox
          option: ["", "inset"]
  size:
    init:() ->
      for section in ["normal", "max", "min"]
        @[section] =
          width:
            getUnitSliderGuiData(
              {
                param:
                  max: 2000            
              },
              {
                val: ""
                option: ["", "auto", "%", "px", "none"]
              }
            )
          height:
            getUnitSliderGuiData(
              {
                param:
                  max: 2000            
              },
              {
                val: ""
                option: ["", "auto", "%", "px", "none"]
              }
            )
  space:
    init:() ->
      for section in ["all", "left", "top", "right", "bottom"]
        @[section] = 
          margin:
            getUnitSliderGuiData(
              {
                param:
                  max: 1000
                  min: -1000
              },
              {
                val: ""
                option: ["", "auto", "%", "px"]
              }
            )
          padding:
            getUnitSliderGuiData(
              {
                param:
                  max: 1000
                  min: -1000
              },
              {
                val: ""
                option: ["", "auto", "%", "px"]
              }
            )
  transform:
    init: ()->
      @scale =
        new web.gui.slider
          val: 1
          param:
            max: 10
            step: 0.01
      @rotate = {}
      for section in ["x", "y", "z"]
        @rotate[section] = 
          new web.gui.slider
            param:
              max: 180
              min: -180
      @skew = {}
      for section in ["x", "y"]
        @skew[section] =
          new web.gui.slider
            param:
              max: 180
              min: -180
      @translate = {}
      for section in ["x", "y"]
        @translate[section] = 
          new web.gui.slider
            param:
              max: 2000
              min: -2000
      @origin = {}
      for section in ["x", "y"]
        @origin[section] = 
          new web.gui.slider {}

core.obj.allCall(@gui_css, {key:"init", arg:[]})
core.obj.allDelete(@gui_css, "init")
setID(@gui_css)

#==============================================================================
# setWebele
#==============================================================================
map = [@responsiveList, @webeleList, @animationState]
core.obj.setMapVal(@webele, map, @gui_css)

exports.css = {}
for res in @responsiveList
  @css[res] = {}
  for ele in @webeleList
    @css[res][ele] = {}
    for anime in @animationState
      @css[res][ele][anime] = {}
      propData =
        id:res + "_" + ele + "_" + anime
        selector: ["[data-webele=\"" + ele + "\"]"]
        media: 
          name: "min-width"
          val: web.size.getResponsiveMinWidth(res)
      @css[res][ele][anime].main =
        new css.prop propData

      propData.selector = [propData.selector[0] + " a"]
      @css[res][ele][anime].link =
        new css.prop propData

core.obj.allCall(@css, {key:"init", arg:[]})
core.obj.allDelete(@css, "init")

#==============================================================================
# option
#==============================================================================
exports.optionData = {}
exports.gui_option =
  trans:
    init: ()->
      @time =
        new web.gui.slider
          param:
            max: 10000
            step: 100
      @method =
        new web.gui.selectBox
          val: "none"
          option: ["none", "fade", "ver_blind", "hor_blind", "clip", "drop_up", "drop_down", "drop_left", "drop_right", "ver_slide", "hor_slide", "fold", "puff_on", "puff_off"]

core.obj.allCall(@gui_option, {key:"init", arg:[]})
core.obj.allDelete(@gui_option, "init")
setID(@gui_option)
core.obj.setMapVal(@optionData, [], @gui_option)

#==============================================================================
# pv method
#==============================================================================
getPageCookieName = () ->
  strList = location.href.split("/")
  strList[strList.length-1].split(".")[0] + @name
  
getJsonData = () =>
  {
    webele        : @webele
    gui_css       : @gui_css
    gui_option    : @gui_option
    HSL           : @HSL
    optionData    : @optionData
    responsiveMax : @responsiveMax  
  }

setLocalData = () =>
  setJSONData = (data) =>
    core.obj.marge(@gui_css, data.gui_css)
    core.obj.marge(@gui_option, data.gui_option)
    core.obj.marge(@webele, data.webele)
    
    core.obj.setMapVal(@gui_css, [["position"], ["left", "right", "bottom", "top"]], {name:"unitSlider"})
    core.obj.setMapVal(@gui_css, [["background"], ["image"]], {option:debug.data.imageList})
    #console.log @gui_css
    @HSL           = data.HSL
    @optionData    = data.optionData
    @responsiveMax = data.responsiveMax
    
  jsonLoadEvent = (data) =>
    setJSONData(data)
    ctr = require("./ctr")
    ctr.init()
  
  if localStorage.getItem(getPageCookieName())
    setJSONData(JSON.parse(localStorage.getItem(getPageCookieName())))
  else if localStorage.getItem(@name)
    setJSONData(JSON.parse(localStorage.getItem(@name)))
  else
    core.file.getJSONFile("./src/webCustomizer/" + getPageCookieName() + ".json", jsonLoadEvent)
    
#==============================================================================
# ex method
#==============================================================================
exports.setCookie_G = () ->
  localStorage.setItem(@name, JSON.stringify(getJsonData()))

exports.clearCookie_G = () ->
  localStorage.removeItem(@name)

exports.setCookie = () ->
  localStorage.setItem(getPageCookieName(), JSON.stringify(getJsonData()))

exports.clearCookie = () ->
  localStorage.removeItem(getPageCookieName())

exports.saveAsFile = () ->
  core.file.downloadData(JSON.stringify(getJsonData()), getPageCookieName() + ".json")

#==============================================================================
# main
#==============================================================================
setLocalData()