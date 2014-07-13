###*
  @class core.str
    文字列を操作します。
###

#==============================================================================
# method
#==============================================================================
###*
  @method addDQ
  前後にダブルクォーテーションを付与した文字列を返します。
  @param {String} 付与する文字列
  @return {String} 付与した文字列
###
exports.addDQ = (str) ->
  return "\"" + str + "\""

###*
  @method addSQ
  前後にシングルクォーテーションを付与した文字列を返します。
  @param {String} 付与する文字列
  @return {String} 付与した文字列
###
exports.addSQ = (str) ->
  return "\'" + str + "\'"

###*
  @method getIndent
  指定した数のインデントを取得します。
  @param {Number} num インデント数
  @return {String} インデント
###
exports.getIndent = (num) ->
  str = ""
  for index in [0...num]
    str += "\t"
  str
