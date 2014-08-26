###*
  @class web.color
    web上で使用する色情報を扱います。
###
core = require("core")

#==============================================================================
# method
#==============================================================================
###*
  @method getColorList
  指定したHSLからカラーリストを取得します
  @param {object} HSL HSLデータ
  @return {object} カラーリスト
###
exports.getColorList = (HSL) ->
  monoHSL = core.obj.clone(HSL)
  monoHSL["S"] = 0
  
  reverseMonoHSL = core.obj.clone(HSL)
  reverseMonoHSL["S"] = 0
  reverseMonoHSL["L"] = 100 - HSL["L"]
  
  baseColorList　= {
    base: core.calc.hslToRGB(HSL)
    reverse: $.xcolor.complementary(core.calc.hslToRGB(HSL))
    sepia: $.xcolor.sepia(core.calc.hslToRGB(HSL))
    black: "#000"
    white: "#fff"
    blue: "#11c"
    mono: core.calc.hslToRGB(monoHSL)
    reverseMono: core.calc.hslToRGB(reverseMonoHSL)
  }

  addColorList = (list, name, xColor) ->
    list[name] = {}
    list[name]["normal"] = xColor
    list[name]["dim"] = $.xcolor.subtractive("#eeeeee", xColor)
    list[name]["dark"] = $.xcolor.darken(xColor)
    list[name]["moreDark"] = $.xcolor.darken($.xcolor.darken(xColor))
    list[name]["light"] = $.xcolor.lighten(xColor)
    list[name]["moreLight"] = $.xcolor.lighten($.xcolor.lighten(xColor))
    list[name]["webSafe"] = $.xcolor.webround(xColor)
  
  toneColorList = {}
  for name, baseColor of baseColorList
    triadColorList = $.xcolor.triad(baseColor)
    addColorList(toneColorList, name, triadColorList[0])
    if name == "base" || name == "reverse"
      addColorList(toneColorList, name + "Second", triadColorList[1])
      addColorList(toneColorList, name + "Third", triadColorList[2])
  
  return toneColorList

###*
  @method getColorName
  getColorListで取得できる色の名前一覧を取得します。
  @return {object} 名前一覧
###
exports.getColorName = () ->
  colorNameList = {
    color: []
    tone: []
  }
  colorList = @getColorList({H:"0", S:"0", L:"0"})
  
  for key, data of colorList
    colorNameList.color.push(key)
  for key, data of colorList.base
    colorNameList.tone.push(key)
  colorNameList.color = core.array.repFilter(colorNameList.color)
  colorNameList.tone = core.array.repFilter(colorNameList.tone)
  
  colorNameList