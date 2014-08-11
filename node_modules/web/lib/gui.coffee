core = require("core")
html = require('html')
color  = require("./color")

###*
  @class web.gui
    guiをコントロールします。
###
class gui
  constructor: () ->
    @id = ""

###*
  @class web.gui.slider
    スライダーをコントロールします。
###
class slider extends gui
  constructor: (arg) ->
    super()
    @val = 0
    @name = "slider"
    @param =
      max: 100
      min: 0
      step: 1
      range: false
    core.obj.marge(@, arg) if arg

  makeDom: () ->
    html.dom.slider(@id + "-slider")

  initEvent: (callback) ->
    $("#" + @id + "-slider").slider(
      max: @param.max
      min: @param.min
      step: @param.step
      if !@param.range
        value: @val
      if @param.range
        values: @val
      if @param.range
        range: @param.range 
    )

    $("#" + @id + "-slider").bind 'slide', (e, ui) =>
      @val = ui.value
      @val = ui.values if ui.values
      @setGuiVal()
      callback.arg.unshift @val
      callback.arg.unshift @id
      callback.method callback.arg... if callback

    $("#" + @id + "-slider_input").bind 'change', (e) =>
      @val = $(e.currentTarget).val()
      @setGuiVal()
      callback.arg.unshift @val
      callback.arg.unshift @id
      callback.method callback.arg... if callback

  setGuiVal: () ->
    if @param.range
      @val = @val.split(",") if !Array.isArray(@val)
      $("#" + @id + "-slider").slider(values:@val)
    else
      $("#" + @id + "-slider").slider(value:@val)
    $("#" + @id + "-slider_input").val(@val)

###*
  @class web.gui.selectBox
    セレクトボックスをコントロールします。
###
class selectBox extends gui
  constructor: (arg) ->
    super()
    @val = ""
    @name = "selectBox"
    @option = []
    core.obj.marge(@, arg) if arg

  makeDom: () ->
    html.dom.selectBox(@id + "-selectBox", @option)

  initEvent: (callback) ->
    $("#" + @id + "-selectBox").change (e) =>
      @val = $(e.currentTarget).val()
      @setGuiVal()
      callback.arg.unshift @val
      callback.arg.unshift @id
      callback.method callback.arg... if callback

  setGuiVal: () ->
    $("#" + @id + "-selectBox").val(@val)

###*
  @class web.gui.colorPicker
    colorPickerをコントロールします。
###
class colorPicker extends gui
  constructor: (arg) ->
    super()
    @val = 
      H: 0
      S: 50
      L: 50
    @name = "colorPicker"
    core.obj.marge(@, arg) if arg

  initEvent: (callback) =>
    $('#' + @id).farbtastic('#' + @id + "_input")
    $.farbtastic('#' + @id).setColor(core.calc.hslToRGB(@val))

    $("#" + @id + "_input").bind 'change', (e) =>
      getHSL = () ->
        hslSprit = $(e.currentTarget).val().split("_")[0].split(":")
        if hslSprit[0] == "NaN" || hslSprit[1] == "NaN" || hslSprit[2] == "NaN"
          return
        
        return  {
          H: Number(hslSprit[0])
          S: Number(hslSprit[1])
          L: Number(hslSprit[2])
        }

      @val = getHSL()
      callback.arg.unshift @val
      callback.arg.unshift @id
      callback.method callback.arg... if callback

  setGuiVal: () ->
    $.farbtastic('#' + @id).setColor(core.calc.hslToRGB(@val))

###*
  @class web.gui.input
    inputをコントロールします。
###
class input extends gui
  constructor: (arg) ->
    super()
    @val = ""
    @name = "input"
    @colorList = {}
    @event = true
    core.obj.marge(@, arg) if arg

  makeDom: () ->
    html.dom.input(@id + "-input", "10")

  initEvent: (callback) ->
    if @event
      $("#" + @id + "-input").bind 'change', (e) =>
        @val = $(e.currentTarget).val()
        callback.arg.unshift @val
        callback.arg.unshift @id
        callback.method callback.arg... if callback

###*
  @class web.gui.button
    inputをコントロールします。
###
class button extends gui
  constructor: (arg) ->
    super()
    @val = ""
    @text = ""
    @name = "button"
    @callback = ""
    core.obj.marge(@, arg) if arg

  makeDom: () ->
    html.dom.button(@id + "-button", @text)

  initEvent: () ->
    $("#" + @id + "-button").click (event) =>
      @callback(@)

module.exports = {
  gui: gui
  slider: slider
  selectBox: selectBox
  colorPicker: colorPicker
  input: input
  button: button
}