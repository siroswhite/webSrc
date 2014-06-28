###*
  @class core.array
  配列を操作します。
###
core_obj = require("./obj")

#==============================================================================
# method
#==============================================================================
###*
  @method repFilter
  配列の重複する要素を一つにまとめます。
  @param {array} target 対象の配列
###
exports.repFilter = (array) ->
  array.filter( (x, i, self) ->
    self.indexOf(x) == i
  )

###*
  @method getPopClone
  指定した配列のポップされたクローンを取得します。
  @param {array} target 対象の配列
  @return {array} return.popClone ポップした配列のクローン
###
exports.getPopClone = (array) ->
  clone = core_obj.clone(array)
  clone.shift()
  clone