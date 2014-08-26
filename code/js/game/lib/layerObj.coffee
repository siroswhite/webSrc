# core = require("core")
# data = require("./data")

# ###*
#   @class game.layerObj.layerObj
#   buttonを操作するクラスです
# ###
# class layerObj 
#   constructor:(param) ->
#     @id = param.id
#     @layerName = param.layerName
#     @clearWidth = 0
#     @clearHeight = 0    
#     if param.coord then @coord = param.coord else @coord = {x:0, y:0}
#     if param.width then @width = param.width else @width = "100"
#     if param.height then @height = param.height else @height = "100"
#     if param.color then @color = param.color else @color = "#bf3f3f"

#   clear:() ->
#     if @clearWidth != 0 or @clearHeight != 0
#       data.layer[@layerName].clear(@coord, @clearWidth, @clearHeight)

#   setColor:() ->
#     @clearWidth = @width
#     @clearHeight = @height
#     data.layer[@layerName].setColor(@color, @coord, @width, @height)

#   initEvent:(callback) =>
#     $("#" + data.layer[@layerName].id).bind 'mousedown', (e) =>
#       coord = data.layer[@layerName].getCoord({x:e.clientX, y:e.clientY})
#       if @coord.x <= coord.x <= @coord.x + @width and
#          @coord.y <= coord.y <= @coord.y + @height and
#          data.layer[@layerName].ctx.getImageData(e.clientX, e.clientY, 1, 1).data[3] != 0
#         callback(@)
        
# module.exports = {
#   layerObj: layerObj
# }