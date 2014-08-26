###*
  @class web.data
    data属性値を操作します。
###
core = require("core")

#==============================================================================
# method
#==============================================================================
###*
  @method getValues
  指定したデータ属性の値を配列として重複なく習得します。
  @param {string} dataName データ属性名
  @return {array} データ属性の値一覧
###
getValues = (dataName) ->
  array = $("*").map( ->
    $(this).data(dataName)
  ).get()
  core.array.repFilter(array)

module.exports = {
  getValues: getValues
}