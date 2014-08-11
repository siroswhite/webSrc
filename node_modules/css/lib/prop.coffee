core = require('core')
css_core = require("./core")
###*
  @class css.prop
  プロパティを制御します。
###
class prop
  constructor: (param) ->
  	@id = param.id if param.id
  	@selector = param.selector if param.selector
  	if param.media
      @media = 
        name: param.media.name
        val: param.media.val
  	@animation =
  	  init:(param) ->
        @trigger = ""
        @time = 0
    @background =
      init:(param) ->
        @color = ""
        @image = ""
        @gradation = ""
        @size = ""
        @repeat = ""
        @attachment = ""
        @position = ""
    @border =
      init:(param) ->
        for section in ["left", "top", "right", "bottom"]
          @[section] = ""
    @radius =
      init:(param) ->
        @radius = ""
    @font =
      init:(param) ->
        @family = ""
        @size = ""
        @lineHeight = ""
        @weight = ""
        @color = ""
        @align = ""
        @decoration = ""
        @shadow = ""
    @opacity =
      init:(param) ->
        @opacity = ""
    @position =
      init:(param) ->
        @position = ""
        @display = ""
        @overflow =
          x: ""
          y: ""
        @zIndex = ""
        @float = ""
        @whiteSpace = ""
        @clear = ""
        @top = ""
        @left = ""
        @bottom = ""
        @right = ""
    @boxShadow =
      init:(param) ->
        @boxShadow = ""
    @size =
      init:(param) ->
        for type in ["normal", "min", "max"]
          @[type] =
            width: ""
            height: ""
    @space =
      init:(param) ->
        for section in ["left", "top", "right", "bottom"]
          @[section] =
            margin: ""
            padding: ""
    @transform =
      init:(param) ->
        @transform = ""
        @origin = ""

  make: () ->
    cssData = 
      1:
        media:
          type: "min-width"
          val: @media.val
        child:
          1:
            selector:
              name: @selector
              event:
                @animation.trigger if @animation.trigger
            tag: {}
            child: {}
    
    tagData = cssData["1"].child["1"].tag

    tagData.transition = "all " + @animation.time + "s linear" if @animation.time

    tagData["background-color"] = @background.color if @background.color    
    if @background.image && @background.gradation
      tagData["background-image"] = "url(\"" + @background.image + "\"), " + @background.gradation
    else if @background.image
      tagData["background-image"] = "url(\"" + @background.image + "\")"
    else if @background.gradation
      tagData["background-image"] = @background.gradation
    tagData["background-size"] = @background.size if @background.size
    tagData["background-repeat"] = @background.repeat if @background.repeat
    tagData["background-attachment"] = @background.attachment if @background.attachment
    tagData["background-position"] = @background.position if @background.position
    for section in ["left", "top", "right", "bottom"]
      tagData["border-" + section] = @border[section] if @border[section]
    tagData["border-radius"] = @radius.radius if @radius.radius
    tagData["font-family"] = @font.family if @font.family
    tagData["font-size"] = @font.size if @font.size
    tagData["line-height"] = @font.lineHeight if @font.lineHeight
    tagData["font-weight"] = @font.weight if @font.weight
    tagData["color"] = @font.color if @font.color
    tagData["text-align"] = @font.align if @font.align
    tagData["text-decoration"] = @font.decoration if @font.decoration
    tagData["text-shadow"] = @font.shadow if @font.shadow
    tagData["opacity"] = @opacity.opacity if @opacity.opacity
    tagData["position"] = @position.position if @position.position
    tagData["display"] = @position.display if @position.display
    tagData["overflow-x"] = @position.overflow.x if @position.overflow.x
    tagData["overflow-y"] = @position.overflow.y if @position.overflow.y
    tagData["z-index"] = @position.zIndex if @position.zIndex
    tagData["float"] = @position.float if @position.float
    tagData["clear"] = @position.clear if @position.clear
    tagData["white-space"] = @position.whiteSpace if @position.whiteSpace
    tagData["top"] = @position.top if @position.top
    tagData["left"] = @position.left if @position.left
    tagData["bottom"] = @position.bottom if @position.bottom
    tagData["right"] = @position.right if @position.right
    tagData["box-shadow"] = @boxShadow.boxShadow if @boxShadow.boxShadow
    tagData["width"] = @size.normal.width if @size.normal.width
    tagData["height"] = @size.normal.height if @size.normal.height
    tagData["max-width"] = @size.max.width if @size.max.width
    tagData["max-height"] = @size.max.height if @size.max.height
    tagData["min-width"] = @size.min.width if @size.min.width
    tagData["min-height"] = @size.min.height if @size.min.height
    for section in ["left", "top", "right", "bottom"]
      tagData["margin-" + section] = @space[section].margin if @space[section].margin
      tagData["padding-" + section] = @space[section].padding if @space[section].padding
    tagData["transform"] = @transform.transform if @transform.transform
    tagData["transform-origin"] = @transform.origin if @transform.origin

    if Object.keys(tagData).length != 0
      css_core.make cssData
    else
      ""
module.exports = {
  prop: prop
}