###*
  @class core.time
    時間データを操作します。
###
timer = {}

#==============================================================================
# method
#==============================================================================
###*
  @method startTimer
  タイマーを開始します。
  @param {String} id タイマーID
###
exports.startTimer = (id) ->
  date = new Date()
  timer[id] = date.getTime()

###*
  @method endTimer
  タイマーを終了し、経過時間を取得します。
  @param {String} id タイマーID
  @return {Number} 計測時間
###
exports.endTimer = (id) ->
  date = new Date()
  time = date.getTime() - timer[id]
  delete timer[id]
  time