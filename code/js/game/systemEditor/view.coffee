data = require('./data')
html = require('html')

getHeader = (id, iconName, domList) ->
    dom = [
      ["div", {id:id, class:"game box_accordion draggable"}]
      [
        ["div", {class: "trigger", "data-webele": "debugGameToolArea_icon"}]
        [
          html.dom.icon(id + "Icon", iconName, "fa-2x")
        ]
        ["div", {class: "contents","data-webele": "debugGameToolArea_contents"}]
        domList
      ]
    ]
    dom

getContents = (contentsData) ->
  makeContents = (dataParam) ->
    dom = []
    for key, param of dataParam
      if !param.name
        dom.push.apply(dom,
          [
            ["td", {class:"sub", colspan:"3"}, key]
            makeContents(param)
          ]
        )
      else
        getGuiDom = (param, key, attr={}) ->
          tempDom = []
          switch param.name
            when "slider"
              slider = param.makeDom()
              tempDom =
                [
                  ["td", {}, key]
                  ["td"]
                  [
                    slider.slider
                    ["span"]
                    slider.input
                  ]
                ]
            when "selectBox"
              tempDom =
                [
                  ["td", {}, key]
                  ["td"]
                  param.makeDom()
                ]
            when "input", "button"
              tempDom =
                [
                  ["td", {}, key]
                  ["td"]
                  [
                    param.makeDom()
                  ]
                ]
            when "colorPicker"
              tempDom =
              [
                ["td"]
                [
                  ["div", {id: param.id}]
                  ["input", {id: param.id + "_input", type: "text", value: "0:0:0_#000000"}]
                ]
              ]
          tempDom

        dom_gui = []
        if param.name == "unitSlider" or param.name == "color"
          for subKey, subParam of param
            dom_gui.push.apply(dom_gui, getGuiDom(subParam, subKey))              
        else
          dom_gui.push.apply(dom_gui, getGuiDom(param, key))
        dom.push.apply(dom,
          [
            ["tr"]
            dom_gui
          ]
        )
    dom

  dom = []
  for key, param of contentsData
    dom.push.apply(dom, [
      ["div", {id:key + "Setter" , class:"box_accordion", "data-webele": "editor_setterArea"}]
        [
          ["div", {class:"trigger"}, key]
          ["div", {class: "contents", "data-webele":"setterContents"}]
          [
            ["table"]
            makeContents(param)
          ]
        ]
      ]
    )
  dom

getLayer = () ->
  getHeader("layerEditor", "copy",
    [
      ["div", {class: "headerArea", "data-webele":"editor_header"}]
      [
        ["span", {}, "layerID"]
        html.dom.input("layerID_input", 10, "none")
      ]
      ["div", {class: "contentsArea css", "data-webele":"editor_contentsArea"}]
      getContents(data.layer.gui)
    ]
  )

getObj = () ->
  getHeader("objEditor", "edit",
    [
      ["div", {class: "headerArea", "data-webele":"editor_header"}]
      [
        ["span", {}, "objID"]
        html.dom.input("objID_input", 10, "none")
      ]
      ["div", {class: "contentsArea css", "data-webele":"editor_contentsArea"}]
      getContents(data.obj.gui)
    ]
  )

dom = []
dom.push.apply(dom, getObj())
dom.push.apply(dom, getLayer())
#dom.push.apply(dom, getLayerMonitor())

console.log html.core.make(dom)
$("#debugGameToolArea").append(html.core.make(dom))