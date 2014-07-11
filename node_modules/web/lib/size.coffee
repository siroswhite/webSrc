###*
  @class web.size
    ブラウザ周りのサイズを操作します。
###

#==============================================================================
# method
#==============================================================================
###*
  @method getResponsiveName
  現在のinnnerWidthに対応したレスポンシブ名を取得します。
  @return {String} サイズ名 
###
exports.getResponsiveName = () ->
  widthName = ""
  width = $(window).innerWidth()
  switch
    when width > 1280
      widthName = "large"
    when width > 768
      widthName = "middle"
    when width > 480
      widthName = "small"
    else
      widthName = "exSmall"
  widthName

###*
  @method getResponsiveMaxWidth
  指定したレスポンシブ名の最大width値取得します。
  @param {String} name レスポンシブ名
  @return {Number} innerWidth最大値
###
exports.getResponsiveMaxWidth = (name) ->
  width = 0
  switch name
    when "large"
      width = 1920
    when "middle"
      width = 1280
    when "small"
      width = 768
    when "exSmall"
      width = 480
  width

###*
  @method getResponsiveMinWidth
  指定したレスポンシブ名の最小width値取得します。
  @param {String} name レスポンシブ名
  @return {Number} innerWidth最小値
###
exports.getResponsiveMinWidth = (name) ->
  width = 0
  switch name
    when "large"
      width = 1281
    when "middle"
      width = 769
    when "small"
      width = 481
    when "exSmall"
      width = 0
  width

###*
  @method chooseResponsiveMax
  レスポンシブ名と最大値名を比較し、最大値以下の最小値である値を取得します。
  @param {String} resNameレスポンシブ名
  @param {String} resMax 最大値名
  @return {Number} 選択された最大値以下の最小レスポンシブ名
###
exports.chooseResponsiveMax = (resName, resMax) ->
  getVal = (name) ->
    val = 0
    switch name
      when "exSmall"
        val = 0
      when "small"
        val = 1
      when "middle"
        val = 2
      when "large"
        val = 3
      when "all"
        val = 4
    val
  nowResVal = getVal(resName)
  maxResVal = getVal(resMax)
  if nowResVal > maxResVal
    return resMax
  resName