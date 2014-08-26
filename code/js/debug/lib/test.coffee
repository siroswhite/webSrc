###*
  @class debug.test
    テストを行います。
###
core = require("core")

###*
  @method startTimer
  時間計測を開始します。
  @param {String} testID テストID
###
exports.startTimer = (testID) ->
  core.time.startTimer(testID)

###*
  @method endTimer
  時間計測を終了します。
  @param {String} testID テストID
###
exports.endTimer = (testID) ->
  console.log(testID + "_time:" + core.time.endTimer(testID) + "ms")
