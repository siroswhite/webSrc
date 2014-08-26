core = require('core')
config = require("./config").config
data = require("./data")

###*
  @class game.layer
  layerを生成、操作するクラスです
###


# class layer
#   ###*
#     @method constructor
#     layerを初期化します。
#     @param {Object} param id
#   ###
#   constructor: (param) ->
#     @id = param.id
#     @obj = {}
#     if param.zIndex then @zIndex = param.zIndex else @zIndex = 1

#     if param.x && param.y
#       @point = new Point(param.x, param.y)
#     else
#       @point = new Point(0, 0)      

#     if param.width && param.height
#       @size = new Size(param.width, param.height)
#     else
#       @size = new Size(config.window.width, config.window.height)

#     ###
#     $("<canvas id=\'" + @id + "\'></canvas>").appendTo("#viewport")
#     $("#" + @id).css("z-index", @index)

#     @canvas = document.getElementById(@id)
#     if param.width then @canvas.width = param.width else @canvas.width = config.window.width
#     if param.height then @canvas.height = param.height else @canvas.height = config.window.height
#     @ctx = @canvas.getContext("2d")
#     @ctx.font = "60px 'ＭＳ Ｐゴシック'"
#     @ctx.fillStyle = "red"
#     ###
#     myPath = new Path();
#     myPath.strokeColor = 'red';
#     myPath.add(new Point(40, 90));
#     myPath.add(new Point(90, 40));
#     myPath.add(new Point(140, 90));

#     myPath.closed = true
#     #view.onFrame = (e) ->
#     #  console.log e.count

#   createObj:(objClass, param) ->
#     param.layerName = @id
#     console.log param.id
#     @obj[param.id] =
#       new objClass param

#   clear:(coord, width, height) ->
#     coord = {x:0, y:0} if !coord
#     width = @canvas.width if !width
#     height = @canvas.height if !height
#     @ctx.clearRect(coord.x, coord.y, width, height)   


#   setColor: (color, coord, width, height) ->
#     coord = {x:0, y:0} if !coord
#     width = @canvas.width if !width
#     height = @canvas.height if !height
#     @ctx.fillStyle = color
#     @ctx.fillRect(coord.x, coord.y, width, height)

#   setImage:(fileName, coord) ->
#     coord = {x:0, y:0} if !coord
#     if fileName
#       img = new Image()
#       img.src = data.imgPath + fileName
#       img.onload = () =>
#         @ctx.drawImage(img, coord.x, coord.y)

#   setText:(text) ->
#     @ctx.fillText(text, 100, 100)

#   hide:() ->
#     $("#" + @id).css("display", "none")

#   show:() ->
#     $("#" + @id).css("display", "block")

#   getCoord:(coord) ->
#     layerCoord = {}
#     layerCoord.x = coord.x * 1920 / $(window).width()
#     layerCoord.y = coord.y * 1920 / $(window).width()
#     layerCoord

# module.exports = {
#   layer: layer
# }