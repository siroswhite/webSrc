###*
  @class html.core
  基本となるメソッドを扱います。
###
core = require('core')

#==============================================================================
# method
#==============================================================================
###*
  @method make
  dom配列データをhtmlに変換します。
  @param {Array} dom 変換するdomデータ
  @param {Number} [level=0] インデントレベル
  @return {String} htmlコード
###
exports.make = (dom, level=0) ->
  addHtmlLine = (htmlLine, level) ->
    level + htmlLine + "\n"
    
  getClosedTag = (htmlLine, level) ->
    tagName = htmlLine.split(">")[0].split(" ")[0].substr(1)
    tag = ""
    if tagName != "br"
      tag = level + "</" + tagName + ">" + "\n"
    tag
  
  formatTag = (tag, attrList, val) ->
    getOpenedTag = (tag) ->
      "<" + tag      
    getAttr = (attrList) ->
      str = ""
      for key, attr of attrList
        if key == "checked" and attr == "false"
          continue
        str += " " + key + "=" + core.str.addDQ(attr)
      str
    closeOpenedTag = () ->
      ">"
    getValue = (val) ->
      if val != undefined then val else ""
      
    str = getOpenedTag(tag)
    str += getAttr(attrList)
    str += closeOpenedTag()
    str += getValue(val)
  
  html = closedTag = ""  
  for htmlLine in dom
    if htmlLine[0] instanceof Array
      html += @make(htmlLine, level + 1)
    else
      htmlLine = formatTag(htmlLine[0], htmlLine[1], htmlLine[2])
      if closedTag != ""
        html += closedTag
      closedTag = getClosedTag(htmlLine, core.str.getIndent(level))
      html += addHtmlLine(htmlLine, core.str.getIndent(level))
      
  html += closedTag