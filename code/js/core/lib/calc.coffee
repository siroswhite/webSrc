###*
  @class core.calc
    演算を主体としたクラスです。
###
core_obj = require("./obj")

#==============================================================================
# method
#==============================================================================
###*
  @method hslToRGB
  HSLをRGBに変換した値を返します。
  @param {Object} argHSL 変換するHSL値
  @return {Array} 変換したRGB値
###
exports.hslToRGB = (argHSL) ->
  HSL = core_obj.clone(argHSL)
  
  HSL["L"] /= 100 # 0～1に正規化
  HSL["S"] /= 100 # 0～1に正規化
  if(HSL["L"] <= 0.5)
    max = HSL["L"] * (1 + HSL["S"])
  else
    max = HSL["L"] + HSL["S"] - HSL["L"] * HSL["S"]
  min = 2 * HSL["L"] - max
  
  hslToRGB_calc = (n1, n2, hue) ->
    hue = (hue + 180) % 360
    if(hue < 60)
      return n1 + (n2 - n1) * hue / 60
    else if(hue < 180)
      return n2
    else if(hue < 240)
      return n1 + (n2 - n1) * (240 - hue) / 60
    else
      return n1
  
  r = Math.floor(hslToRGB_calc(max, min, HSL["H"] + 120) * 255).toString(16)
  g = Math.floor(hslToRGB_calc(max, min, HSL["H"]) * 255).toString(16)
  b = Math.floor(hslToRGB_calc(max, min, HSL["H"] - 120) * 255).toString(16)
  if r.length < 2
    r = "0" + r
  if g.length < 2
    g = "0" + g
  if b.length < 2
    b = "0" + b
  
  HSL = null
  return "#" + r + g + b
