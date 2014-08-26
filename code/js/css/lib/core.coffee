###*
  @class css.core
  基本となるメソッドを扱います。
###
core = require('core')
styleSheet       = document.styleSheets[document.styleSheets.length - 2]
cssRulesNumber   = styleSheet.cssRules.length

#==============================================================================
# method
#==============================================================================
###*
  @method getVender
  vender名一覧を取得します。
  @return {Array} vender一覧
###
exports.getVendor = () ->
  ["", "-webkit-", "-moz-", "-o-", "-ms-"]

###*
  @method make
  css構造データからcssを生成します。
  @param {Object} cssData css構造データ
  @return 生成したcss
###
exports.make = (cssData, selectorParentList=[], level=0) ->
  setTag = (tag) =>
    getName = (name) =>
      nameList = []
      switch name
        when "transform", "transform-origin", "transition"
          for vender in @getVendor()
            nameList.push(vender + name)
        else
          nameList.push(name)
      nameList
    str = ""
    for key, param of tag
      nameList = getName(key)
      for name in nameList
        str += core.str.getIndent(level+1) + name + ": " + param + ";\n"
    str

  setSelector = (selector, selectorParentList) ->
    getParentNameList = (selectorParentList) ->
      strList = []
      for selectorParent in selectorParentList
        str  = ""
        for parentName in selectorParent.name
          str += parentName
          str += ":" + selectorParent.event if selectorParent.event
          str += " "
          strList.push(str)
      strList

    getVal = (name, selector) ->
      str = ""
      str += name
      str += ":" + selector.event if selector.event
      str
 
    str = core.str.getIndent(level)
    for index, name of selector.name
      str += ", " if index > 0
      if selectorParentList.length > 0
        for index_parent, parentName of getParentNameList(selectorParentList)
          str += ", " if index_parent > 0
          str += getVal(parentName + name, selector)
      else
        str += getVal(name, selector)

    str += " {\n"
    str

  setMedia = (media) ->
    str = core.str.getIndent(level)
    switch media.type
      when "min-width"
        str += "@media screen and (min-width:" + media.val + "px){ \n"
    str

  css = ""
  for key, param_css of cssData
    if param_css.media
      css += setMedia(param_css.media)
      if param_css.child
        css += @make(param_css.child, selectorParentList, level + 1)
      css += core.str.getIndent(level) + "}\n"
    else
      css += setSelector(param_css.selector, selectorParentList)
      css += setTag(param_css.tag)
      css += core.str.getIndent(level) + "}\n"
      if param_css.child
        selectorParentList.push(param_css.selector)
        css += @make(param_css.child, selectorParentList, level)
        selectorParentList.pop()
  css

exports.setRule = (cssStr, num) ->
  if num
    styleNum = cssRulesNumber + num - 1
  else
    styleNum = styleSheet.cssRules.length
  styleSheet.insertRule(cssStr, styleNum)

exports.deleteRule = (num) ->
  if num
    styleNum = cssRulesNumber + num - 2
  else
    styleNum = styleSheet.cssRules.length - 1
  styleSheet.deleteRule(styleNum)

exports.deleteAllRule = () ->
  len = styleSheet.cssRules.length
  while len > cssRulesNumber
    styleSheet.deleteRule(styleSheet.cssRules.length - 1)
    len = styleSheet.cssRules.length
