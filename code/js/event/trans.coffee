#==============================================================================
# require
#==============================================================================
effect_anim = require("effect/anim")

#==============================================================================
# exports
#==============================================================================
exports.option = {
  target: "#transition"
  method: "none"
  time: 500
}

#------------------------------------------------------------------------------
# in
#------------------------------------------------------------------------------
exports.in = () ->
  effect("in")
  
#------------------------------------------------------------------------------
# out
#------------------------------------------------------------------------------
exports.out = (url) ->
  effect("out")
  setTimeout ->
     window.location.href = url;
    , @option.time
  false

effect = (state) =>
  switch @option.method
    when "none"
      if state == "in"
        $(@option.target).css("display", "block")    
    when "fade"
      if state == "in"
        effect_anim.fadein(@option.target, @option.time)
      else
        effect_anim.fadeout(@option.target, @option.time)
    when "ver_blind"
      effect_anim.blind(@option.target, @option.time, "up")
    when "hor_blind"
      if state == "in"
        effect_anim.blind(@option.target, @option.time, "left")
      else
        effect_anim.blind(@option.target, @option.time, "right")
    when "ver_clip"
      effect_anim.clip(@option.target, @option.time, "vertical")
    when "clip"
      effect_anim.clip(@option.target, @option.time, "horizontal")
    when "drop_up"
      effect_anim.drop(@option.target, @option.time, "up")
    when "drop_down"
      effect_anim.drop(@option.target, @option.time, "down")
    when "drop_left"
      effect_anim.drop(@option.target, @option.time, "left")
    when "drop_right"
      if state == "in"
        effect_anim.drop(@option.target, @option.time, "left")
      else
        effect_anim.drop(@option.target, @option.time, "right")
    when "ver_slide"
      if state == "in"
        effect_anim.slide(@option.target, @option.time, "up", 1000)
      else
        effect_anim.slide(@option.target, @option.time, "down", 1000)
    when "hor_slide"
      if state == "in"
        effect_anim.slide(@option.target, @option.time, "left")
      else
        effect_anim.slide(@option.target, @option.time, "right")
    when "fold"
      effect_anim.fold(@option.target, @option.time, true, 700)
    when "puff_on"
      effect_anim.puff(@option.target, @option.time, 150)
    when "puff_off"
      effect_anim.puff(@option.target, @option.time, 50)

#------------------------------------------------------------------------------
# check_access
#------------------------------------------------------------------------------
exports.check_access = () ->
  $.cookie('access')

#------------------------------------------------------------------------------
# check_anker
#------------------------------------------------------------------------------
exports.check_anker = (a) ->
  $(a).attr('href').indexOf("#") == -1

#------------------------------------------------------------------------------
# preLoading
#------------------------------------------------------------------------------
exports.preLoading = (preImageList, callback_trans) ->
  $("#loading").css("display", "block")
  loaded = 0
  persentCnt = 0
  persent = Math.ceil(100 / preImageList.length)
  
  for list in preImageList
    $('<img>').attr('src', "./src/img/" + list).load  =>
      loaded++
      timer = setInterval( ->
        if(persentCnt >= 100)
          clearTimeout(timer)
          $("#loading").fadeOut()
          $.cookie('access', 'true')
          callback_trans()
          
        else
          if(persentCnt <= loaded * persent)
            persentCnt += loaded * persent
          $('#load_count').text(persentCnt + '%')
      , 10)  
