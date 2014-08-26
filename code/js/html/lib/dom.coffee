###*
  @class html.dom
  dom配列を生成します。
###

#==============================================================================
# method
#==============================================================================
###*
  @method selectBox
  selectBoxを生成します。
  @param {String} id id
  @param {Array} optionList option配列
  @param {String} [className=""] クラス名
  @return {Array} dom配列 
###
exports.selectBox = (id, optionList, className="") ->
  html_selectBoxOption = []
  for option in optionList
    html_selectBoxOption.push(
      ["option", {value: option}, option]
    )
  [
    ["select", {id: id, class:className + " select"}]
    html_selectBoxOption
  ]

###*
  @method slider
  sliderを生成します。
  @param {String} id id
  @param {String} [className=""] クラス名
  @param {Number} [size=4] inputサイズ
  @return {Array} dom配列 
###
exports.slider = (id, className="", size=4) ->
  {
    slider: ["div", {id:id, class:className + " slider"}]
    input: @input(id + "_input", 4, "", className + " sliderInput")
  }

###*
  @method icon
  iconを生成します。
  @param {String} id id
  @param {String} iconName icon名
  @param {String} [className=""] クラス名
  @return {Array} dom配列 
###
exports.icon = (id, iconName, className="") ->
  ["i", {id:id, class: className + " fa fa-" + iconName}]

###*
  @method input
  inputを生成します。
  @param {String} id id
  @param {Number} [size=5] inputサイズ
  @param {String} val inputの値
  @param {String} [className=""] クラス名
  @return {Array} dom配列 
###
exports.input = (id, size="5", val="", className="") ->
  ["input", {id:id, class:className, type:"text", size:size, value:val}]

###*
  @method checkbox
  checkboxを生成します。
  @param {String} id id
  @param {String} checked checked
  @param {String} [className=""] クラス名
  @return {Array} dom配列 
###
exports.checkbox = (id, checked, className="") ->
  ["input", {id:id, class:className, type:"checkbox", checked:checked}]

###*
  @method button
  buttonを生成します。
  @param {String} id id
  @param {String} text ボタンテキスト
  @param {String} [className=""] クラス名
  @return {Array} dom配列 
###
exports.button = (id, text, className="") ->
  ["button", {id:id, type: "button", class:className}, text]
