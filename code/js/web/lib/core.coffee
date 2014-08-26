###*
  @class web.core
    web操作の基本となるメソッドを管理します。
###
core = require("core")

###*
  @method getDataValList
  指定したデータ属性の値を配列として重複なく習得します。
  @param {string} dataName データ属性名
  @return {array} データ属性の値一覧
###
exports.getDataValList = (dataName) ->
  array = $("*").map( ->
    $(this).data(dataName)
  ).get()
  core.array.repFilter(array)

###*
  @method getIdList
  セレクタで指定した要素のIDを配列として重複なく習得します。
  @param {string} selector セレクタ
  @return {array} IDリスト
###
exports.getEleIDList = (selector) ->
  array = $(selector).map( ->
  	$(this).attr("id")
  ).get()
  core.array.repFilter(array)
