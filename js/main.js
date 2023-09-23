var _____WB$wombat$assign$function_____ = function (name) {
  return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]
}
if (!self.__WB_pmw) {
  self.__WB_pmw = function (obj) {
    this.__WB_source = obj
    return this
  }
}
{
  let window = _____WB$wombat$assign$function_____("window")
  let self = _____WB$wombat$assign$function_____("self")
  let document = _____WB$wombat$assign$function_____("document")
  let location = _____WB$wombat$assign$function_____("location")
  let top = _____WB$wombat$assign$function_____("top")
  let parent = _____WB$wombat$assign$function_____("parent")
  let frames = _____WB$wombat$assign$function_____("frames")
  let opener = _____WB$wombat$assign$function_____("opener")

  // 繧ｰ繝ｭ繝ｼ繝舌Ν螟画焚
  var leftMargin = 20
  var rightMargin = leftMargin
  var bottomMargin = 10
  var headerHeight = 20
  var thumbnailHeight = 50
  var renderer = null
  var base = null
  var stage = null
  var thumbnail = null
  var measures = []
  var data = null
  var md5 = ""

  // - 繝ｬ繝ｳ繝繝ｪ繝ｳ繧ｰ繝代Λ繝｡繝ｼ繧ｿ
  var urlParam = {}
  var scaleW = 7
  var minScaleW = 4
  var maxScaleW = 10
  var scaleH = 2
  var minScaleH = 0.5
  var maxScaleH = 3.5
  var playSide = 1
  var pattern = null
  var measureFrom = 0
  var measureTo = 0
  var colorScheme = "default"

  // 螳壽焚
  var measureGridSize = {
    5: 19,
    7: 23,
    9: 22,
    10: 34,
    14: 42,
  }
  var measureLeftLaneSize = {
    5: measureGridSize[5] - 4,
    7: measureGridSize[7] - 4,
    9: measureGridSize[9] - 4,
    10: (measureGridSize[10] - 4) / 2,
    14: (measureGridSize[14] - 4) / 2,
  }
  var keypatInit = {
    5: "12345",
    7: "1234567",
    9: "123456789",
    10: "12345",
    14: "1234567",
  }
  var keyCh = {
    5: ["11", "12", "13", "14", "15"],
    7: ["11", "12", "13", "14", "15", "18", "19"],
    9: ["11", "12", "13", "14", "15", "22", "23", "24", "25"],
    10: [
      ["11", "12", "13", "14", "15"],
      ["21", "22", "23", "24", "25"],
    ],
    14: [
      ["11", "12", "13", "14", "15", "18", "19"],
      ["21", "22", "23", "24", "25", "28", "29"],
    ],
  }
  var schemes = {
    default: {
      backgroundFill: 0x000000,
      outerBound: 0xffffff,
      quarterLine: 0x808080,
      sixteenthLine: 0x404040,
      laneLine: 0x404040,
      labelFill: 0x808080,
      labelText: 0xffffff,
      bpmLine: 0x00ff00,
      bpmText: 0x00ff00,
      bpmTextStroke: 0x808080,
      stopLine: 0xff0000,
      stopText: null,
      stopTextStroke: null,
      noteBlueFill: 0x5074fe,
      noteBlueLine: null,
      noteWhiteFill: 0xbebebe,
      noteWhiteLine: null,
      noteRedFill: 0xe04a4a,
      noteRedLine: null,
      lnoteBlueFill: 0xb0c0ff,
      lnoteBlueLine: null,
      lnoteWhiteFill: 0xe6ffc2,
      lnoteWhiteLine: null,
      lnoteRedFill: 0xff9a9a,
      lnoteRedLine: null,
      mineRedFill: 0x700000,
      mineRedLine: 0x700000,
      lnWidthRatio: 0,
      bpmLineH: 1,
    },
    mono: {
      backgroundFill: 0xffffff,
      outerBound: 0x000000,
      quarterLine: 0x7f7f7f,
      sixteenthLine: 0xbfbfbf,
      laneLine: 0x7f7f7f,
      labelFill: 0xffffff,
      labelText: 0x000000,
      bpmText: 0x000000,
      bpmTextStroke: 0xffffff,
      stopLine: 0x000000,
      stopText: 0x000000,
      stopTextStroke: 0xffffff,
      noteBlueFill: 0x000000,
      noteBlueLine: 0x000000,
      noteWhiteFill: 0xffffff,
      noteWhiteLine: 0x000000,
      noteRedFill: 0x000000,
      noteRedLine: 0x000000,
      lnoteBlueFill: 0x000000,
      lnoteBlueLine: 0x000000,
      lnoteWhiteFill: 0xffffff,
      lnoteWhiteLine: 0x000000,
      lnoteRedFill: 0xffffff,
      lnoteRedLine: 0x000000,
      mineRedFill: 0x7f7f7f,
      mineRedLine: 0x7f7f7f,
      lnWidthRatio: 0.8,
      bpmLineH: 2,
    },
  }

  // 蟆冗ｯ繧ｪ繝悶ず繧ｧ繧ｯ繝�
  function Measure(param) {
    var lineWidth = 1
    var container = new PIXI.Container()
    var g = new PIXI.Graphics()
    container.addChild(g)

    // 繧ｳ繝ｳ繝�リ繧ｵ繧､繧ｺ繧呈ｱｺ螳�
    container.innerHeight = g.innerHeight = param.length * param.scaleH * param.exratio
    container.innerWidth = g.innerWidth = measureGridSize[param.keys] * param.scaleW

    // 繝代Λ繝｡繝ｼ繧ｿ繧偵そ繝�ヨ
    g.logicalLength = param.length
    g.unitLength = param.unit
    g.index = param.index
    g.score = param.score
    g.lnmap = param.lnmap
    g.keys = param.keys
    g.gridX = param.scaleW
    g.gridY = g.innerHeight / g.logicalLength
    g.side = param.side
    g.pattern = param.pattern

    // 螟匁棧謠冗判繝｡繧ｽ繝�ラ
    g.drawOuterBound = function () {
      g.lineStyle(lineWidth, schemes[colorScheme].outerBound, 1)
      g.moveTo(-lineWidth, 0)
      g.lineTo(g.innerWidth + lineWidth, 0)
      g.lineTo(g.innerWidth + lineWidth, g.innerHeight - lineWidth)
      g.lineTo(-lineWidth, g.innerHeight - lineWidth)
      g.lineTo(-lineWidth, 0)
    }

    // 蟆冗ｯ邱壽緒逕ｻ繝｡繧ｽ繝�ラ
    g.drawMeasureLines = function () {
      var grid = g.innerHeight / g.logicalLength
      for (var i = 1; (i * g.unitLength) / 16 < g.logicalLength; i++) {
        var color = schemes[colorScheme].sixteenthLine //  16蛻�浹隨ｦ
        if (i % 4 == 0) {
          color = schemes[colorScheme].quarterLine
        } // 4蛻�浹隨ｦ
        g.lineStyle(lineWidth, color, 1)
        g.moveTo(-1, g.innerHeight - (grid * i * g.unitLength) / 16 - lineWidth)
        g.lineTo(g.innerWidth, g.innerHeight - (grid * i * g.unitLength) / 16 - lineWidth)
      }
    }

    // 繝弱�繝亥｢�阜邱壽緒逕ｻ繝｡繧ｽ繝�ラ
    g.drawNoteLines = function () {
      switch (g.keys) {
        case 5:
        case 7:
          g.drawNoteLinesSP(g.keys)
          break
        case 9:
          g.drawNoteLinesPMS(9)
          break
        case 10:
        case 14:
          g.drawNoteLinesDP(g.keys)
          break
        default:
          break
      }
    }

    // 繝弱�繝亥｢�阜邱咼P
    g.drawNoteLinesDP = function (keys) {
      // 繝弱�繝亥｢�阜邱壹ｒ謠冗判
      // SC:5, KEY:2, LABEL:2
      var grid = g.gridX
      var color = schemes[colorScheme].laneLine
      var idx = 5
      // SC1
      g.lineStyle(lineWidth, color, 1)
      g.moveTo(grid * idx, 0)
      g.lineTo(grid * idx, g.innerHeight - lineWidth)
      // KEY1P 1-7
      for (var i = 0; i < keys / 2; i++) {
        idx += 2
        g.moveTo(grid * idx, 0)
        g.lineTo(grid * idx, g.innerHeight - lineWidth)
      }
      // LABEL
      idx = keys + 5
      color = schemes[colorScheme].labelFill
      g.beginFill(color)
      g.lineStyle(0, null, 1)
      g.moveTo(grid * idx, 0)
      g.lineTo(grid * idx, g.innerHeight - lineWidth)
      g.lineTo(grid * (4 + idx), g.innerHeight - lineWidth)
      g.lineTo(grid * (4 + idx), 0)
      g.endFill()
      if (g.logicalLength >= g.unitLength / 4 / param.scaleH) {
        idx += 2
        var fontSetting = "bold " + grid * 2 + "px Arial"
        var labelText = new PIXI.Text(g.index, {
          font: fontSetting,
          fill: schemes[colorScheme].labelText,
        })
        labelText.anchor.x = 0.5
        labelText.anchor.y = 0.5
        labelText.x = grid * idx
        labelText.y = g.innerHeight / 2
        container.addChild(labelText)
      }
      // KEY2P
      idx += 2
      color = schemes[colorScheme].laneLine
      g.lineStyle(lineWidth, color, 1)
      g.moveTo(grid * idx, 0)
      g.lineTo(grid * idx, g.innerHeight - lineWidth)
      for (var i = 0; i < keys / 2; i++) {
        idx += 2
        g.moveTo(grid * idx, 0)
        g.lineTo(grid * idx, g.innerHeight - lineWidth)
      }
    }
    // 繝弱�繝亥｢�阜邱售P
    g.drawNoteLinesSP = function (keys) {
      // 繝弱�繝亥｢�阜邱壹ｒ謠冗判
      // SC:5, KEY:2, LABEL:2
      var grid = g.gridX
      var color = schemes[colorScheme].laneLine
      var idx = g.side == 1 ? 5 : 2 * keys + 5
      // SC
      g.lineStyle(lineWidth, color, 1)
      g.moveTo(grid * idx, 0)
      g.lineTo(grid * idx, g.innerHeight - lineWidth)
      // KEY
      if (g.side == 2) idx = 0
      for (var i = 0; i < keys; i++) {
        idx += 2
        g.moveTo(grid * idx, 0)
        g.lineTo(grid * idx, g.innerHeight - lineWidth)
      }
      // LABEL
      idx = 2 * keys + 5
      color = schemes[colorScheme].labelFill
      g.beginFill(color)
      g.lineStyle(0, null, 1)
      g.moveTo(grid * idx, 0)
      g.lineTo(grid * idx, g.innerHeight - lineWidth)
      g.lineTo(grid * (4 + idx), g.innerHeight - lineWidth)
      g.lineTo(grid * (4 + idx), 0)
      g.endFill()
      if (g.logicalLength >= g.unitLength / 4 / param.scaleH) {
        idx += 2
        var fontSetting = "bold " + grid * 2 + "px Arial"
        var labelText = new PIXI.Text(g.index, {
          font: fontSetting,
          fill: schemes[colorScheme].labelText,
        })
        labelText.anchor.x = 0.5
        labelText.anchor.y = 0.5
        labelText.x = grid * idx
        labelText.y = g.innerHeight / 2
        container.addChild(labelText)
      }
    }
    // 繝弱�繝亥｢�阜邱啀MS
    g.drawNoteLinesPMS = function (keys) {
      var idx = 0
      var grid = g.gridX
      var color = schemes[colorScheme].laneLine
      g.lineStyle(lineWidth, color, 1)
      // KEY
      for (var i = 0; i < keys; i++) {
        idx += 2
        g.moveTo(grid * idx, 0)
        g.lineTo(grid * idx, g.innerHeight - lineWidth)
      }
      // LABEL
      idx = 2 * keys
      color = schemes[colorScheme].labelFill
      g.beginFill(color)
      g.lineStyle(0, null, 1)
      g.moveTo(grid * idx, 0)
      g.lineTo(grid * idx, g.innerHeight - lineWidth)
      g.lineTo(grid * (4 + idx), g.innerHeight - lineWidth)
      g.lineTo(grid * (4 + idx), 0)
      g.endFill()
      if (g.logicalLength >= g.unitLength / 4 / param.scaleH) {
        idx += 2
        var fontSetting = "bold " + grid * 2 + "px Arial"
        var labelText = new PIXI.Text(g.index, {
          font: fontSetting,
          fill: schemes[colorScheme].labelText,
        })
        labelText.anchor.x = 0.5
        labelText.anchor.y = 0.5
        labelText.x = grid * idx
        labelText.y = g.innerHeight / 2
        container.addChild(labelText)
      }
    }

    // 繝弱�繝域緒逕ｻ繝｡繧ｽ繝�ラ
    g.drawNotes = function () {
      switch (g.keys) {
        case 5:
        case 7:
          g.drawNotesSP(g.keys)
          break
        case 9:
          g.drawNotesPMS(g.keys)
          break
        case 10:
        case 14:
          g.drawNotesDP(g.keys)
          break
        default:
          break
      }
    }
    // 繝弱�繝�DP
    g.drawNotesDP = function (keys) {
      // 繝ｬ繝ｼ繝ｳ蜈･繧梧崛縺�
      var keych1P = keyCh[keys][0]
      var keych2P = keyCh[keys][1]
      var scch1P = "16"
      var scch2P = "26"
      if (g.side == 2) {
        // FLIP
        var temp = keych1P
        keych1P = keych2P
        keych2P = temp
        temp = scch1P
        scch1P = scch2P
        scch2P = temp
      }
      if (g.pattern != null && g.pattern.length == keys) {
        var temp1 = keych1P
        var temp2 = keych2P
        keych1P = []
        keych2P = []
        for (var i = 0; i < keys / 2; i++) {
          keych1P.push(temp1[g.pattern[i]])
          keych2P.push(temp2[g.pattern[i + keys / 2]])
        }
      }

      // 繝弱�繝域緒逕ｻ
      var noteThickness = 4
      var blue = schemes[colorScheme].noteBlueFill
      var white = schemes[colorScheme].noteWhiteFill
      var red = schemes[colorScheme].noteRedFill
      var blueLine = schemes[colorScheme].noteBlueLine
      var whiteLine = schemes[colorScheme].noteWhiteLine
      var redLine = schemes[colorScheme].noteRedLine
      var lnWhite = schemes[colorScheme].lnoteWhiteFill
      var lnBlue = schemes[colorScheme].lnoteBlueFill
      var lnRed = schemes[colorScheme].lnoteRedFill
      var lnWhiteLine = schemes[colorScheme].lnoteWhiteLine
      var lnBlueLine = schemes[colorScheme].lnoteBlueLine
      var lnRedLine = schemes[colorScheme].lnoteRedLine
      var mineRed = schemes[colorScheme].mineRedFill
      var mineRedLine = schemes[colorScheme].mineRedLine
      var lnRatio = schemes[colorScheme].lnWidthRatio

      // KEY
      ;[
        [5, keych1P],
        [keys + 9, keych2P],
      ].forEach(function (p) {
        var idx = p[0]
        var color = blue
        var colorLine = blueLine
        var lnColor = lnBlue
        p[1].forEach(function (key) {
          if (color == blue) {
            color = white
            colorLine = whiteLine
          } else {
            color = blue
            colorLine = blueLine
          }
          if (lnColor == lnBlue) {
            lnColor = lnWhite
            lnColorLine = lnWhiteLine
          } else {
            lnColor = lnBlue
            lnColorLine = lnBlueLine
          }

          if (key in g.lnmap) {
            g.lnmap[key].forEach(function (area) {
              if (area[0][0] <= g.index && area[1][0] >= g.index) {
                var lnBegin = 0
                var lnEnd = g.logicalLength
                if (area[0][0] == g.index) {
                  lnBegin = area[0][1]
                }
                if (area[1][0] == g.index) {
                  lnEnd = area[1][1]
                }
                var noteLineWidth = lnColorLine != null ? 1 : 0
                var noteLineAlpha = lnColorLine != null ? 1 : 0
                g.beginFill(lnColor)
                g.lineStyle(noteLineWidth, lnColorLine, noteLineAlpha)
                g.drawRect(
                  idx * g.gridX - (idx == 0 ? lineWidth : 0) + (lnRatio * g.gridX) / 2,
                  g.innerHeight - g.gridY * lnEnd - lineWidth + (lnEnd == g.logicalLength ? noteLineWidth : 0),
                  2 * g.gridX - (idx == 0 ? 0 : lineWidth) - lnRatio * g.gridX,
                  g.gridY * (lnEnd - lnBegin) +
                    (lnBegin == 0 ? lineWidth : 0) -
                    lineWidth -
                    (lnEnd == g.logicalLength ? noteLineWidth : 0)
                )
                g.endFill()
              }
            })
          }
          ;[
            [(key.charAt(0) == "1" ? "D" : "E") + key.charAt(1), mineRed, mineRedLine],
            [key, color, colorLine],
          ].forEach(function (q) {
            var _key = q[0]
            var _color = q[1]
            var _colorLine = q[2]
            if (_key in g.score) {
              g.score[_key].forEach(function (pos) {
                var noteLineWidth = _colorLine != null ? 1 : 0
                var noteLineAlpha = _colorLine != null ? 1 : 0
                g.beginFill(_color)
                g.lineStyle(noteLineWidth, _colorLine, noteLineAlpha)
                g.drawRect(
                  idx * g.gridX - (idx == 0 ? lineWidth : 0),
                  g.innerHeight - (g.gridY * pos[0] + noteThickness) - lineWidth,
                  2 * g.gridX - (idx == 0 ? 0 : lineWidth) + noteLineWidth,
                  noteThickness
                )
                g.endFill()
              })
            }
          })
          idx += 2
        })
      })

      // SC
      ;[
        [0, scch1P],
        [2 * keys + 9, scch2P],
      ].forEach(function (p) {
        idx = p[0]
        color = red
        colorLine = red
        lnColor = lnRed
        lnColorLine = lnRedLine
        if (p[1] in g.lnmap) {
          g.lnmap[p[1]].forEach(function (area) {
            if (area[0][0] <= g.index && area[1][0] >= g.index) {
              var lnBegin = 0
              var lnEnd = g.logicalLength
              if (area[0][0] == g.index) {
                lnBegin = area[0][1]
              }
              if (area[1][0] == g.index) {
                lnEnd = area[1][1]
              }
              var noteLineWidth = lnColorLine != null ? 1 : 0
              var noteLineAlpha = lnColorLine != null ? 1 : 0
              g.beginFill(lnColor)
              g.lineStyle(noteLineWidth, lnColorLine, noteLineAlpha)
              g.drawRect(
                idx * g.gridX - (idx == 0 ? lineWidth : 0) + (lnRatio * g.gridX) / 2,
                g.innerHeight - g.gridY * lnEnd - lineWidth + (lnEnd == g.logicalLength ? noteLineWidth : 0),
                5 * g.gridX - lnRatio * g.gridX,
                g.gridY * (lnEnd - lnBegin) +
                  (lnBegin == 0 ? lineWidth : 0) -
                  lineWidth -
                  (lnEnd == g.logicalLength ? noteLineWidth : 0)
              )
              g.endFill()
            }
          })
        }
        ;[
          [(p[1].charAt(0) == "1" ? "D" : "E") + p[1].charAt(1), mineRed, mineRedLine],
          [p[1], color, colorLine],
        ].forEach(function (q) {
          var _key = q[0]
          var _color = q[1]
          var _colorLine = q[2]
          if (_key in g.score) {
            g.score[_key].forEach(function (pos) {
              var noteLineWidth = _colorLine != null ? 1 : 0
              var noteLineAlpha = _colorLine != null ? 1 : 0
              g.beginFill(_color)
              g.lineStyle(noteLineWidth, _colorLine, noteLineAlpha)
              g.drawRect(
                idx * g.gridX - (idx == 0 ? lineWidth : 0),
                g.innerHeight - (g.gridY * pos[0] + noteThickness) - lineWidth,
                5 * g.gridX + noteLineWidth,
                noteThickness
              )
              g.endFill()
            })
          }
        })
      })
    }
    // 繝弱�繝�SP
    g.drawNotesSP = function (keys) {
      // 繝ｬ繝ｼ繝ｳ蜈･繧梧崛縺�
      var keych = keyCh[keys]
      if (g.pattern != null && g.pattern.length == keys) {
        var temp = keych
        keych = []
        for (var i = 0; i < keys; i++) {
          keych.push(temp[g.pattern[i]])
        }
      }

      // 繝弱�繝域緒逕ｻ
      var noteThickness = 4
      var blue = schemes[colorScheme].noteBlueFill
      var white = schemes[colorScheme].noteWhiteFill // 0x8b8b8b
      var red = schemes[colorScheme].noteRedFill
      var blueLine = schemes[colorScheme].noteBlueLine
      var whiteLine = schemes[colorScheme].noteWhiteLine
      var redLine = schemes[colorScheme].noteRedLine
      var lnWhite = schemes[colorScheme].lnoteWhiteFill
      var lnBlue = schemes[colorScheme].lnoteBlueFill
      var lnRed = schemes[colorScheme].lnoteRedFill
      var lnWhiteLine = schemes[colorScheme].lnoteWhiteLine
      var lnBlueLine = schemes[colorScheme].lnoteBlueLine
      var lnRedLine = schemes[colorScheme].lnoteRedLine
      var mineRed = schemes[colorScheme].mineRedFill
      var mineRedLine = schemes[colorScheme].mineRedLine
      var lnRatio = schemes[colorScheme].lnWidthRatio

      // KEY
      var idx = g.side == 1 ? 5 : 0
      var color = blue
      var colorLine = blueLine
      var lnColor = lnBlue
      var lnColorLine = lnBlueLine
      keych.forEach(function (key) {
        if (color == blue) {
          color = white
          colorLine = whiteLine
        } else {
          color = blue
          colorLine = blueLine
        }
        if (lnColor == lnBlue) {
          lnColor = lnWhite
          lnColorLine = lnWhiteLine
        } else {
          lnColor = lnBlue
          lnColorLine = lnBlueLine
        }

        if (key in g.lnmap) {
          g.lnmap[key].forEach(function (area) {
            if (area[0][0] <= g.index && area[1][0] >= g.index) {
              var lnBegin = 0
              var lnEnd = g.logicalLength
              if (area[0][0] == g.index) {
                lnBegin = area[0][1]
              }
              if (area[1][0] == g.index) {
                lnEnd = area[1][1]
              }
              var noteLineWidth = lnColorLine != null ? 1 : 0
              var noteLineAlpha = lnColorLine != null ? 1 : 0
              g.beginFill(lnColor)
              g.lineStyle(noteLineWidth, lnColorLine, noteLineAlpha)
              g.drawRect(
                idx * g.gridX - (idx == 0 ? lineWidth : 0) + (lnRatio * g.gridX) / 2,
                g.innerHeight - g.gridY * lnEnd - lineWidth + (lnEnd == g.logicalLength ? noteLineWidth : 0),
                2 * g.gridX - (idx == 0 ? 0 : lineWidth) - lnRatio * g.gridX,
                g.gridY * (lnEnd - lnBegin) +
                  (lnBegin == 0 ? lineWidth : 0) -
                  lineWidth -
                  (lnEnd == g.logicalLength ? noteLineWidth : 0)
              )
              g.endFill()
            }
          })
        }
        ;[
          ["D" + key.charAt(1), mineRed, mineRed],
          [key, color, colorLine],
        ].forEach(function (q) {
          var _key = q[0]
          var _color = q[1]
          var _colorLine = q[2]
          if (_key in g.score) {
            g.score[_key].forEach(function (pos) {
              var noteLineWidth = _colorLine != null ? 1 : 0
              var noteLineAlpha = _colorLine != null ? 1 : 0
              g.beginFill(_color)
              g.lineStyle(noteLineWidth, _colorLine, noteLineAlpha)
              g.drawRect(
                idx * g.gridX - (idx == 0 ? lineWidth : 0),
                g.innerHeight - (g.gridY * pos[0] + noteThickness) - lineWidth,
                2 * g.gridX - (idx == 0 ? 0 : lineWidth) + noteLineWidth,
                noteThickness
              )
              g.endFill()
            })
          }
        })
        idx += 2
      })

      // SC
      idx = g.side == 1 ? 0 : 2 * keys
      color = red
      colorLine = redLine
      lnColor = lnRed
      lnColorLine = lnRedLine
      if ("16" in g.lnmap) {
        g.lnmap["16"].forEach(function (area) {
          if (area[0][0] <= g.index && area[1][0] >= g.index) {
            var lnBegin = 0
            var lnEnd = g.logicalLength
            if (area[0][0] == g.index) {
              lnBegin = area[0][1]
            }
            if (area[1][0] == g.index) {
              lnEnd = area[1][1]
            }
            var noteLineWidth = lnColorLine != null ? 1 : 0
            var noteLineAlpha = lnColorLine != null ? 1 : 0
            g.beginFill(lnColor)
            g.lineStyle(noteLineWidth, lnColorLine, noteLineAlpha)
            g.drawRect(
              idx * g.gridX - (idx == 0 ? lineWidth : 0) + (lnRatio * g.gridX) / 2,
              g.innerHeight - g.gridY * lnEnd - lineWidth + (lnEnd == g.logicalLength ? noteLineWidth : 0),
              5 * g.gridX - (idx == 0 ? 0 : lineWidth) - lnRatio * g.gridX,
              g.gridY * (lnEnd - lnBegin) +
                (lnBegin == 0 ? lineWidth : 0) -
                lineWidth -
                (lnEnd == g.logicalLength ? noteLineWidth : 0)
            )
            g.endFill()
          }
        })
      }
      ;[
        ["D6", mineRed, mineRedLine],
        ["16", color, colorLine],
      ].forEach(function (q) {
        var _key = q[0]
        var _color = q[1]
        var _colorLine = q[2]
        if (_key in g.score) {
          g.score[_key].forEach(function (pos) {
            var noteLineWidth = _colorLine != null ? 1 : 0
            var noteLineAlpha = _colorLine != null ? 1 : 0
            g.beginFill(_color)
            g.lineStyle(noteLineWidth, _colorLine, noteLineAlpha)
            g.drawRect(
              idx * g.gridX - (idx == 0 ? lineWidth : 0),
              g.innerHeight - (g.gridY * pos[0] + noteThickness) - lineWidth,
              5 * g.gridX - (idx == 0 ? 0 : lineWidth) + noteLineWidth,
              noteThickness
            )
            g.endFill()
          })
        }
      })
    }
    // 繝弱�繝�PMS
    g.drawNotesPMS = function (keys) {
      // 繝ｬ繝ｼ繝ｳ蜈･繧梧崛縺�
      var keych = keyCh[keys]
      if (g.pattern != null && g.pattern.length == keys) {
        var temp = keych
        keych = []
        for (var i = 0; i < keys; i++) {
          keych.push(temp[g.pattern[i]])
        }
      }

      // 繝弱�繝域緒逕ｻ
      var schemes = [0xc4c4c4, 0xfff500, 0x99ff67, 0x30b9f9, 0xff6c6c, 0x30b9f9, 0x99ff67, 0xfff500, 0xc4c4c4]
      var lncolors = [0x909090, 0xc5b400, 0x00ab1e, 0x006bd5, 0xd60000, 0x006bd5, 0x00ab1e, 0xc5b400, 0x909090]
      var mineRed = 0x700000
      var barThickness = 3
      var noteRadius = 3
      var noteThickness = barThickness * 3

      // KEY
      var idx = 0
      keych.forEach(function (key, i) {
        // LN
        if (key in g.lnmap) {
          g.lnmap[key].forEach(function (area) {
            if (area[0][0] <= g.index && area[1][0] >= g.index) {
              var lnBegin = 0
              var lnEnd = g.logicalLength
              if (area[0][0] == g.index) {
                lnBegin = area[0][1]
              }
              if (area[1][0] == g.index) {
                lnEnd = area[1][1]
              }

              g.beginFill(lncolors[i])
              g.lineStyle(0, null, 1)
              g.drawRect(
                idx * g.gridX - (idx == 0 ? lineWidth : 0) + (i % 2 == 0 ? 0 : 1),
                g.innerHeight - g.gridY * lnEnd - lineWidth,
                2 * g.gridX - (idx == 0 ? 0 : lineWidth) - 2 * (i % 2 == 0 ? 0 : 1),
                g.gridY * (lnEnd - lnBegin) + (lnBegin == 0 ? lineWidth : 0)
              )
            }
          })
        }
        ;[
          [(key.charAt(0) == "1" ? "D" : "E") + key.charAt(1), mineRed],
          [key, schemes[i]],
        ].forEach(function (q) {
          var _key = q[0]
          var _color = q[1]
          if (_key in g.score) {
            g.score[_key].forEach(function (pos) {
              // note
              g.beginFill(_color)
              g.lineStyle(0, null, 1)
              g.drawRoundedRect(
                idx * g.gridX - (idx == 0 ? lineWidth : 0) + (i % 2 == 0 ? 0 : 1),
                g.innerHeight - (g.gridY * pos[0] + (barThickness + noteThickness) / 2) - lineWidth,
                2 * g.gridX - (idx == 0 ? 0 : lineWidth) - 2 * (i % 2 == 0 ? 0 : 1),
                noteThickness,
                noteRadius
              )
              g.endFill()

              // bar
              g.beginFill(0xffffff)
              g.lineStyle(0, null, 1)
              g.drawRect(
                idx * g.gridX - (idx == 0 ? lineWidth : 0) + (i % 2 == 0 ? 0 : 1),
                g.innerHeight - (g.gridY * pos[0] + barThickness) - lineWidth,
                2 * g.gridX - (idx == 0 ? 0 : lineWidth) - 2 * (i % 2 == 0 ? 0 : 1),
                barThickness
              )
              g.endFill()
            })
          }
        })
        idx += 2
      })
    }

    // BPM謠冗判繝｡繧ｽ繝�ラ
    g.drawBPM = function () {
      var colorLine = schemes[colorScheme].bpmLine
      var colorText = schemes[colorScheme].bpmText
      var colorStroke = schemes[colorScheme].bpmTextStroke
      var lineH = schemes[colorScheme].bpmLineH
      // BPM, exBPM
      var ch = ["03", "08"]
      ch.forEach(function (key) {
        if (key in g.score) {
          g.score[key].forEach(function (pos) {
            g.lineStyle(lineH, colorLine, 1)
            g.moveTo(-1, g.innerHeight - g.gridY * pos[0] - lineH)
            g.lineTo(g.gridX * measureLeftLaneSize[g.keys], g.innerHeight - g.gridY * pos[0] - lineH)

            if (g.keys == 10 || g.keys == 14) {
              // for DP
              g.moveTo(
                g.gridX * (measureGridSize[g.keys] - measureLeftLaneSize[g.keys]),
                g.innerHeight - g.gridY * pos[0] - lineH
              )
              g.lineTo(g.gridX * measureGridSize[g.keys], g.innerHeight - g.gridY * pos[0] - lineH)
            }
            if (colorText != null) {
              var fontSetting = "bold " + g.gridX * 1.5 + "px Arial"
              var labelText = new PIXI.Text(Math.round(pos[1] * 10) / 10, {
                font: fontSetting,
                fill: colorText,
                stroke: colorStroke,
                strokeThickness: colorStroke != null ? 2 : 0,
              })
              labelText.anchor.x = 0.5
              labelText.anchor.y = 0.5
              labelText.x = g.gridX * (measureLeftLaneSize[g.keys] + 2)
              labelText.y = g.innerHeight - g.gridY * pos[0] - lineWidth
              container.addChild(labelText)
            }
          })
        }
      })
    }

    // STOP謠冗判繝｡繧ｽ繝�ラ
    g.drawStop = function () {
      var colorLine = schemes[colorScheme].stopLine
      var colorText = schemes[colorScheme].stopText
      var colorStroke = schemes[colorScheme].stopTextStroke
      var lineH = schemes[colorScheme].bpmLineH
      // STOP
      var ch = ["09"]
      ch.forEach(function (key) {
        if (key in g.score) {
          g.score[key].forEach(function (pos) {
            g.lineStyle(lineH, colorLine, 1)
            g.moveTo(-1, g.innerHeight - g.gridY * pos[0] - lineH)
            g.lineTo(g.gridX * measureLeftLaneSize[g.keys], g.innerHeight - g.gridY * pos[0] - lineH)

            if (g.keys == 10 || g.keys == 14) {
              // for DP
              g.moveTo(
                g.gridX * (measureGridSize[g.keys] - measureLeftLaneSize[g.keys]),
                g.innerHeight - g.gridY * pos[0] - lineH
              )
              g.lineTo(g.gridX * measureGridSize[g.keys], g.innerHeight - g.gridY * pos[0] - lineH)
            }

            if (colorText != null) {
              var fontSetting = "bold " + g.gridX * 1.75 + "px Arial"
              var labelText = new PIXI.Text(/*Math.round(pos[1] * 10 / 48) / 10*/ "S", {
                font: fontSetting,
                fill: colorText,
                stroke: colorStroke,
                strokeThickness: colorStroke != null ? 2 : 0,
              })
              labelText.anchor.x = 0.5
              labelText.anchor.y = 0.5
              labelText.x = g.gridX * (measureLeftLaneSize[g.keys] + 2)
              labelText.y = g.innerHeight - g.gridY * pos[0] - lineWidth
              container.addChild(labelText)
            }
          })
        }
      })
    }

    // 謠冗判
    g.drawMeasureLines()
    g.drawNoteLines()
    g.drawOuterBound()
    g.drawBPM()
    g.drawStop()
    g.drawNotes()

    return container
  }
  // 繧ｵ繝�繝阪う繝ｫ繧ｪ繝悶ず繧ｧ繧ｯ繝�
  function Thumbnail(param) {
    var lineWidth = 1
    var container = new PIXI.Container()

    // 繧ｵ繝�繝阪う繝ｫ譫�繧剃ｽ懈�
    g = new PIXI.Graphics()
    g.beginFill(0x0)
    g.lineStyle(lineWidth, 0x404040, 1)
    g.moveTo(0, 0)
    g.lineTo(renderer.width + lineWidth, 0)
    g.lineTo(renderer.width + lineWidth, thumbnailHeight)
    g.lineTo(0, thumbnailHeight)
    g.lineTo(0, 0)
    g.endFill()
    container.addChild(g)

    // 繧ｵ繝�繝阪う繝ｫ菴懈�
    container.widthShrinkRatio = renderer.width / stage.width
    container.heightShrinkRatio = thumbnailHeight / stage.height
    var texture = stage.generateTexture(renderer, 2 * container.widthShrinkRatio, PIXI.SCALE_MODES.NEAREST)
    container.thumbnail = new PIXI.Sprite(texture)
    container.thumbnail.width = renderer.width /*- leftMargin - rightMargin*/
    container.thumbnail.height = thumbnailHeight
    // CANVAS 縺ｧ縺ｯ縺�∪縺上せ繝励Λ繧､繝医′菴懈�縺ｧ縺阪↑縺�ｼ溘�縺ｧ辟｡陦ｨ遉ｺ縺ｫ
    if (renderer.type != PIXI.RENDERER_TYPE.CANVAS) container.addChild(container.thumbnail)

    // 陦ｨ遉ｺ荳ｭ鬆伜沺縺ｮ逋ｽ譫�繧剃ｽ懈�
    container.drawViewBox = function () {
      if (container.viewBox == null) {
        container.viewBox = new PIXI.Container()

        // 繧ｰ繝ｬ繝ｼ繝懊ャ繧ｯ繧ｹ
        var grayMask = new PIXI.Graphics()
        //蟾ｦ
        grayMask.beginFill(0xffffff)
        grayMask.lineStyle(lineWidth, 0x404040, 1)
        grayMask.moveTo(0, 0)
        grayMask.lineTo(-renderer.width, 0)
        grayMask.lineTo(-renderer.width, thumbnailHeight)
        grayMask.lineTo(0, thumbnailHeight)
        grayMask.lineTo(0, 0)
        // 蜿ｳ
        grayMask.moveTo(renderer.width * container.widthShrinkRatio, 0)
        grayMask.lineTo(renderer.width, 0)
        grayMask.lineTo(renderer.width, thumbnailHeight)
        grayMask.lineTo(renderer.width * container.widthShrinkRatio, thumbnailHeight)
        grayMask.lineTo(renderer.width * container.widthShrinkRatio, 0)
        grayMask.endFill()
        // 繧｢繝ｫ繝輔ぃ
        grayMask.alpha = 0.4
        // 繧ｯ繝ｪ繝�け蜿ｯ閭ｽ縺ｫ縺吶ｋ
        grayMask.buttonMode = true
        grayMask.interactive = true
        grayMask.hitArea = new PIXI.Rectangle(-renderer.width, 0, 2 * renderer.width, thumbnailHeight + 50) // +50: 縺ｯ縺ｿ蜃ｺ縺励け繝ｪ繝�け蜿ｯ閭ｽ鬆伜沺
        grayMask.on("mousedown", onClick).on("touchstart", onClick)

        container.viewBox.addChild(grayMask)

        var frame = new PIXI.Graphics()
        frame.lineStyle(lineWidth, 0xffffff, 1)
        //譫�縺ｮ謠冗判
        frame.moveTo(lineWidth, 0)
        frame.lineTo(renderer.width * container.widthShrinkRatio, 0)
        frame.lineTo(renderer.width * container.widthShrinkRatio, thumbnailHeight)
        frame.lineTo(lineWidth, thumbnailHeight)
        frame.lineTo(lineWidth, 0)
        // 繝峨Λ繝�げ蜿ｯ閭ｽ縺ｫ縺吶ｋ
        frame.buttonMode = true
        frame.interactive = true
        frame.hitArea = new PIXI.Rectangle(
          lineWidth,
          0,
          renderer.width * container.widthShrinkRatio - lineWidth,
          thumbnailHeight + 50
        ) // +50: 縺ｯ縺ｿ蜃ｺ縺励け繝ｪ繝�け蜿ｯ閭ｽ鬆伜沺
        frame
          .on("mousedown", onDragStart)
          .on("touchstart", onDragStart)
          .on("mouseup", onDragEnd)
          .on("mouseupoutside", onDragEnd)
          .on("touchend", onDragEnd)
          .on("touchendoutside", onDragEnd)
          .on("mousemove", onDragMove)
          .on("touchmove", onDragMove)
        container.viewBox.addChild(frame)

        container.addChild(container.viewBox)
      }
      container.viewBox.position.x = (-leftMargin - stage.position.x) * container.widthShrinkRatio
      container.viewBox.position.y = 0
    }
    container.drawViewBox()
    return container
  }

  function render() {
    // show loading spinner
    HoldOn.open()

    thumbnailHeight = Math.max(window.innerHeight * 0.05, 25)
    //     headerHeight = $("#header").height();
    headerHeight = 50 /* WORKAROUND */

    if (stage == null) {
      // update canvas
      if (renderer != null) {
        renderer.destroy(true) // GPU 繝｡繝｢繝ｪ繝ｪ繝ｼ繧ｯ蟇ｾ遲�
      }
      renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight - headerHeight, {
        backgroundColor: schemes[colorScheme].backgroundFill,
      })
      // for performance optimization
      renderer.roundPixels = true
      renderer.clearBeforeRender = schemes[colorScheme].backgroundFill != 0x000000
      renderer.preserveDrawingBuffer = true
      if (renderer.type == PIXI.RENDERER_TYPE.CANVAS) {
        // CANVAS 縺ｧ縺ｯ騾乗�繧ｪ繝悶ず繧ｧ繧ｯ繝医�謠冗判縺後♀縺九＠縺上↑繧九�縺ｧ蜈�↓謌ｻ縺�
        renderer.clearBeforeRender = true
      }

      $("#content").append(renderer.view)
    } else {
      // window resize
      if (renderer != null) {
        renderer.resize(window.innerWidth, window.innerHeight - headerHeight)
      }
    }

    // 繧ｳ繝ｳ繝�リ縺ｫ霑ｽ蜉�
    var initStage = false
    if (stage == null) {
      initStage = true
      stage = new PIXI.Container()
    }
    var posXinit = leftMargin
    var posYinit = renderer.height - thumbnailHeight - bottomMargin
    var posX = posXinit
    var posY = posYinit
    for (var i = 0; i < data.score.length; i++) {
      if (i >= measureFrom && i <= measureTo) {
        var measure
        if (measures[i] == null || initStage) {
          var expLen = (data.score[i].length || data.unit) * scaleH
          measure = Measure({
            index: i,
            score: data.score[i],
            lnmap: data.lnmap,
            scaleW: scaleW,
            scaleH: scaleH,
            length: data.score[i].length || data.unit,
            side: playSide,
            keys: keys == 14 || keys == 10 || keys == 9 || keys == 7 || keys == 5 ? keys : 7,
            pattern: pattern,
            unit: data.unit,
            exratio: expLen > posYinit ? (posYinit - 1) / expLen : 1,
          })
          measures[i] = measure
        } else {
          measure = measures[i]
        }
        if (posY == posYinit || posY - measure.innerHeight > 0) {
          posY -= measure.innerHeight - 1
        } else {
          posY = posYinit - measure.innerHeight - 1
          posX += measure.innerWidth + posXinit
        }

        //measure.children[0].cacheAsBitmap = null;
        measure.children[0].cacheAsBitmap = false
        measure.position.x = posX
        measure.position.y = posY
        if (initStage) stage.addChild(measure)
        measure.children[0].cacheAsBitmap = true
      }
    }
    if (initStage) {
      stage.interactive = true
      stage.buttonMode = true
      stage
        .on("mousedown", onDragStart)
        .on("touchstart", onDragStart)
        .on("mouseup", onDragEnd)
        .on("mouseupoutside", onDragEnd)
        .on("touchend", onDragEnd)
        .on("touchendoutside", onDragEnd)
        .on("mousemove", onDragMove)
        .on("touchmove", onDragMove)
    }
    stage.hitArea = new PIXI.Rectangle(0, 0, stage.width, stage.height)
    stage.position.x = 0
    stage.position.y = 0

    // 繧ｵ繝�繝阪う繝ｫ繧ｪ繝悶ず繧ｧ繧ｯ繝医ｒ菴懈�
    thumbnail = Thumbnail()

    thumbnail.position.x = 0
    thumbnail.position.y = posYinit + bottomMargin

    // 荳崎ｦ√↑繝ｬ繝ｳ繝繝ｪ繝ｳ繧ｰ繧堤┌蜉ｹ蛹�
    //for (var i = 0; i < stage.children.length; i++) {
    //    if (-stage.position.x - stage.children[i].width <= stage.children[i].position.x && stage.children[i].position.x <= -stage.position.x + 2 * renderer.width) stage.children[i].visible = true;
    //    else stage.children[i].visible = false;
    //}

    // 繧ｳ繝ｳ繝�リ縺ｫ霑ｽ蜉�縺ｨ繝ｬ繝ｳ繝繝ｪ繝ｳ繧ｰ
    base = new PIXI.Container()
    base.addChild(stage)
    base.addChild(thumbnail)
    renderer.render(base)

    // close loading spinner
    HoldOn.close()
  }

  var refresh = function () {
    renderer.render(base)
  }

  var updateRender = function () {
    stage = null
    render()
  }

  var dragStartPos = null
  var startPos = null
  var curPosition = null

  function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data
    this.dragging = true
    if (this.parent.parent == thumbnail) {
      curPosition = this.data.getLocalPosition(thumbnail)
    } else {
      curPosition = this.data.getLocalPosition(this.parent)
    }
  }

  function onDragEnd() {
    this.dragging = false

    // set the interaction data to null
    this.data = null
    curPosition = null
  }

  function onDragMove() {
    if (this.dragging && curPosition != null) {
      var newPosition
      var deltaX
      if (this.parent.parent == thumbnail) {
        newPosition = this.data.getLocalPosition(thumbnail)
        deltaX = -curPosition.x + newPosition.x
        deltaX /= -thumbnail.widthShrinkRatio
      } else {
        newPosition = this.data.getLocalPosition(this.parent)
        deltaX = -curPosition.x + newPosition.x
      }
      stage.position.x = Math.min(
        Math.max(stage.position.x + deltaX, renderer.width - stage.width - leftMargin - rightMargin),
        0
      )
      thumbnail.drawViewBox()
      requestAnimationFrame(refresh)
      curPosition = newPosition
    }
  }

  function onClick(event) {
    this.data = event.data
    if (this.parent.parent == thumbnail) {
      curPosition = this.data.getLocalPosition(thumbnail)
      var posX = curPosition.x - (renderer.width * thumbnail.widthShrinkRatio) / 2
      stage.position.x = Math.min(
        Math.max(-posX / thumbnail.widthShrinkRatio, renderer.width - stage.width - leftMargin - rightMargin),
        0
      )
      thumbnail.drawViewBox()
      requestAnimationFrame(refresh)
    }
  }

  var resizeTimeout = false
  $(window).resize(function () {
    if (
      renderer == null ||
      (window.innerHeight - headerHeight == renderer.height && window.innerWidth == renderer.width)
    )
      return
    if (resizeTimeout !== false) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(render, 200)
  })

  function getUrlParam() {
    var vars = [],
      hash
    var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&")
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=")
      vars.push(hash[0])
      vars[hash[0]] = hash[1]
    }
    return vars
  }

  function setUrlParam() {
    if (urlParam == null || Object.keys(urlParam).length == 0) return
    var pathName = location.pathname + "?"
    pathName += $.map(urlParam, function (value, key) {
      return key + "=" + value
    }).join("&")
    history.replaceState("", "", pathName)
    // tweet繝懊ち繝ｳ縺ｮ繝ｪ繝ｳ繧ｯ蜈医ｒ蜷梧悄
    $("#tweet_button").attr(
      "href",
      "https://twitter.com/share?url=" + encodeURIComponent(location.href) + "&text=" + encodeURI(data.title)
    )
  }

  function validateKeyPattern(p, k) {
    var isValid = false
    var ret = []
    var str = ""

    if (p == 0) {
      str = String(p)
      for (var i = 0; i < k; i++) {
        ret.push(i)
      }
      isValid = true
    } else if (p == 1) {
      str = String(p)
      for (var i = 1; i <= k; i++) {
        ret.push(k - i)
      }
      isValid = true
    } else {
      var ar = p.split("")
      if (ar.length == k) {
        ar = ar.filter(function (x, i, self) {
          return self.indexOf(x) === i && x >= 1 && x <= k
        })
        if (ar.length == k) {
          ret = []
          str = ""
          for (var i = 0; i < k; i++) {
            ret.push(ar[i] - 1)
            str += ar[i]
          }
          isValid = true
        }
      }
    }
    return [isValid, ret, str]
  }

  function shuffle(arr) {
    var i, j, tmp, length
    for (length = arr.length, i = length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    return arr
  }

  function randomizeKeyPatternStr(str, keys) {
    if (keys == 10 || keys == 14) {
      // DP
      var ar1 = str.split("")
      var ar2 = ar1.splice(keys / 2, keys / 2)
      ar1 = shuffle(ar1)
      ar2 = shuffle(ar2)
      return ar1.join("") + ar2.join("")
    } else {
      // SP
      var ar = shuffle(str.split(""))
      return ar.join("")
    }
  }

  function start(tempParam) {
    // URL繝代Λ繝｡繝ｼ繧ｿ縺ｮ繧ｻ繝�ヨ
    // - md5: hash
    if (tempParam.md5 != null) {
      urlParam.md5 = md5 = tempParam.md5
    }
    // - w: scale width
    if (tempParam.w != null && tempParam.w >= minScaleW && tempParam.w <= maxScaleW) {
      urlParam.w = scaleW = parseInt(tempParam.w)
    }
    // - h: scale height
    if (tempParam.h != null && tempParam.h >= minScaleH && tempParam.h <= maxScaleH) {
      urlParam.h = scaleH = parseInt(2 * tempParam.h) / 2
    }
    // - p: play side or flip
    if (tempParam.p != null && (tempParam.p == "1" || tempParam.p == "2")) {
      urlParam.p = playSide = parseInt(tempParam.p)
    }
    // - k: key nums (hidden option)
    if (
      tempParam.k != null &&
      (tempParam.k == "5" || tempParam.k == "7" || tempParam.k == "9" || tempParam.k == "10" || tempParam.k == "14")
    ) {
      urlParam.k = keys = parseInt(tempParam.k)
    } else {
      keys = data.keys
    }
    // - c: color scheme
    if (tempParam.c != null && tempParam.c == "mono") {
      urlParam.c = colorScheme = "mono"
    }

    // - o: keys pattern
    // 繝ｩ繝ｳ繝繝�驟咲ｽｮ蛻晄悄繝代ち繝ｼ繝ｳ
    $("#random_pattern_input").val(randomizeKeyPatternStr(keypatInit[keys], keys >= 10 ? keys / 2 : keys))
    $("#random_pattern_input_2p").val(randomizeKeyPatternStr(keypatInit[keys], keys >= 10 ? keys / 2 : keys))
    // 莠呈鋤諤ｧ遒ｺ菫�
    if (tempParam.o != null && keys >= 10 && tempParam.o.length == keys) {
      tempParam.o2 = tempParam.o.substr(keys / 2)
      tempParam.o = tempParam.o.substr(0, keys / 2)
    }
    // pattern 蛻晄悄蛹�
    const default_pattern = validateKeyPattern(0, keys >= 10 ? keys / 2 : keys)[1]
    pattern = keys >= 10 ? default_pattern.concat(default_pattern) : default_pattern
    if (tempParam.o != null && tempParam.o > 0) {
      var result = validateKeyPattern(tempParam.o, keys >= 10 ? keys / 2 : keys)
      if (result[0]) {
        urlParam.o = result[2]
        pattern = keys >= 10 ? result[1].concat(pattern.slice(keys / 2)) : result[1]
        if (urlParam.o >= 2) {
          $("#random_pattern_input").val(result[2])
        }
      }
    }
    if (keys >= 10 && tempParam.o2 != null && tempParam.o2 > 0) {
      var result = validateKeyPattern(tempParam.o2, keys >= 10 ? keys / 2 : keys)
      if (result[0]) {
        urlParam.o2 = result[2]
        pattern = pattern.slice(0, keys / 2).concat(result[1])
        if (urlParam.o2 >= 2) {
          $("#random_pattern_input_2p").val(result[2])
        }
      }
    }
    // - f
    measureFrom = 0
    if (tempParam.f != null && tempParam.f > 0 && tempParam.f < data.score.length) {
      urlParam.f = measureFrom = parseInt(tempParam.f)
    }
    // - t
    measureTo = data.score.length - 1
    if (tempParam.t != null && tempParam.t >= measureFrom && tempParam.t < data.score.length - 1) {
      urlParam.t = measureTo = parseInt(tempParam.t)
    }
    // - replace url
    setUrlParam()

    // render canvas
    render()

    // menu
    $("#header").css("visibility", "visible")
    $("#menu").css("visibility", "visible")
    $("#menu").mmenu(
      {
        // options
        slidingSubmenus: false,
        extensions: ["pagedim-black", "theme-dark"],
        offCanvas: {
          position: "right",
          zposition: "front",
        },
        navbars: [
          {
            position: "bottom",
            content: [
              '<a id="tweet_button" href="https://twitter.com/share?" target="_blank"><i class="fa fa-twitter fa-lg"></i></a>',
              '<a id="save_ss_button" href="#" onclick="screenshot();"><i class="fa fa-camera-retro fa-lg"></a>',
            ],
          },
        ],
      },
      {
        // configurations
      }
    )

    // 讌ｽ譖ｲ諠��ｱ縺ｮ險ｭ螳�
    document.title = document.title + data.title
    $("#title").text(data.title)
    $("#artist").text(data.artist)
    $("#bpm").text(data.bpm)
    $("#totalnotes").text(data.notes)
    $("#total").text(data.total)
    $("#link_to_lr2ir").attr("href", "http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" + md5)
    $("#tweet_button").attr(
      "href",
      "https://twitter.com/share?url=" + encodeURIComponent(location.href) + "&text=" + encodeURI(data.title)
    )

    // menu events
    $("#menu_button").on("click", function (e) {
      e.preventDefault()
      if ($("html").hasClass("mm-opened")) {
        $("#menu").data("mmenu").close()
      } else {
        $("#menu").data("mmenu").open()
      }
    })

    // sliders
    // - scaleW
    $("#scaleW-slider").ionRangeSlider({
      type: "single",
      min: minScaleW,
      max: maxScaleW,
      from: scaleW,
      step: 1,
      onFinish: function (data) {
        console.log("onFinish")
        urlParam.w = scaleW = data.from
        updateRender()
        setUrlParam()
      },
    })
    // - scaleH
    $("#scaleH_slider").ionRangeSlider({
      type: "single",
      min: minScaleH,
      max: maxScaleH,
      from: scaleH,
      step: 0.5,
      onFinish: function (data) {
        urlParam.h = scaleH = data.from
        updateRender()
        setUrlParam()
      },
    })
    // - keys
    $(`#keys_${getUrlParam().hasOwnProperty("k") ? getUrlParam().k : 7}`)[0].checked = true
    $("#keys_button")
      .find("input")
      .on("change", function (event) {
        urlParam.k = this.value
        setUrlParam()
        location.reload()
      })
    // - play side
    $(playSide == 2 ? "#playside_2p" : "#playside_1p")[0].checked = true
    $("#playside_button")
      .find("input")
      .on("change", function (event) {
        urlParam.p = playSide = parseInt(this.value)
        updateRender()
        setUrlParam()
      })
    if (keys == 10 || keys == 14) {
      // DP 逕ｨ縺ｫ繧ｪ繝励す繝ｧ繝ｳ陦ｨ險倥ｒ螟画峩
      $("#playside_text").text("flip: ")
      $("#playside_text_1p").text("OFF")
      $("#playside_text_2p").text("ON")
    } else if (keys == 9) {
      // PMS 縺ｫ繧ｵ繧､繝峨�縺ｪ縺�
      $("#playside_option").css("display", "none")
    }
    // - option 1P
    if (keys >= 10) {
      $("#option_text").text("option 1P:")
    } else {
      $("#menu_box_option_2p").css("display", "none")
    }
    $("#random_pattern_input").attr("maxlength", keys >= 10 ? keys / 2 : keys) // 譁�ｭ玲焚蛻ｶ髯�=KEY謨ｰ
    if (!urlParam.o || urlParam.o == 0) {
      $("#option_off")[0].checked = true
    } else if (urlParam.o == 1) {
      $("#option_mirror")[0].checked = true
    } else {
      $("#option_random")[0].checked = true
    }
    $("#option_button")
      .find("input")
      .on("change", function (event) {
        switch (this.value) {
          case "0":
            $("#option_off")[0].checked = true
            delete urlParam.o
            pattern = keys >= 10 ? default_pattern.concat(pattern.slice(keys / 2)) : null
            updateRender()
            setUrlParam()
            break
          case "1":
            $("#option_mirror")[0].checked = true
            urlParam.o = 1
            pattern =
              keys >= 10
                ? validateKeyPattern(1, keys / 2)[1].concat(pattern.slice(keys / 2))
                : validateKeyPattern(1, keys)[1]
            updateRender()
            setUrlParam()
            break
          case "2":
            $("#option_random")[0].checked = true
            var result = validateKeyPattern($("#random_pattern_input").val(), keys >= 10 ? keys / 2 : keys)
            if (result[0]) {
              pattern = keys >= 10 ? result[1].concat(pattern.slice(keys / 2)) : result[1]
              urlParam.o = result[2]
              updateRender()
              setUrlParam()
            } else {
              $("#option_off").trigger("change")
            }
            break
          default:
            break
        }
      })
    $("#random_pattern_auto_button").on("click", function (event) {
      $("#random_pattern_input").val(randomizeKeyPatternStr(keypatInit[keys], keys >= 10 ? keys / 2 : keys))
      $("#option_random").trigger("change")
    })
    $("#random_pattern_input").on("change", function (event) {
      $("#option_random").trigger("change")
    })
    // - option 2P
    $("#random_pattern_input_2p").attr("maxlength", keys >= 10 ? keys / 2 : keys) // 譁�ｭ玲焚蛻ｶ髯�=KEY謨ｰ
    if (!urlParam.o2 || urlParam.o2 == 0) {
      $("#option_off_2p")[0].checked = true
    } else if (urlParam.o == 1) {
      $("#option_mirror_2p")[0].checked = true
    } else {
      $("#option_random_2p")[0].checked = true
    }
    $("#option_button_2p")
      .find("input")
      .on("change", function (event) {
        if (keys < 10) return
        switch (this.value) {
          case "0":
            $("#option_off_2p")[0].checked = true
            delete urlParam.o2
            pattern = pattern.slice(0, keys / 2).concat(default_pattern)
            updateRender()
            setUrlParam()
            break
          case "1":
            $("#option_mirror_2p")[0].checked = true
            urlParam.o2 = 1
            pattern = pattern.slice(0, keys / 2).concat(validateKeyPattern(1, keys / 2)[1])
            updateRender()
            setUrlParam()
            break
          case "2":
            $("#option_random_2p")[0].checked = true
            var result = validateKeyPattern($("#random_pattern_input_2p").val(), keys >= 10 ? keys / 2 : keys)
            if (result[0]) {
              pattern = pattern.slice(0, keys / 2).concat(result[1])
              urlParam.o2 = result[2]
              updateRender()
              setUrlParam()
            } else {
              $("#option_off_2p").trigger("change")
            }
            break
          default:
            break
        }
      })
    $("#random_pattern_auto_button_2p").on("click", function (event) {
      $("#random_pattern_input_2p").val(randomizeKeyPatternStr(keypatInit[keys], keys >= 10 ? keys / 2 : keys))
      $("#option_random_2p").trigger("change")
    })
    $("#random_pattern_input_2p").on("change", function (event) {
      $("#option_random_2p").trigger("change")
    })

    // - clip
    $("#clip_slider").ionRangeSlider({
      type: "double",
      min: 0,
      max: Math.max(data.score.length - 1, 0),
      from: measureFrom,
      to: measureTo,
      step: 1,
      onFinish: function (data) {
        urlParam.f = measureFrom = data.from
        urlParam.t = measureTo = data.to
        updateRender()
        setUrlParam()
      },
    })

    // - color scheme
    $(colorScheme == "mono" ? "#color_mono" : "#color_default")[0].checked = true
    $("#color_button")
      .find("input")
      .on("change", function (event) {
        colorScheme = this.value
        if (this.value != "default") {
          urlParam.c = colorScheme
        } else {
          delete urlParam.c
        }
        updateRender()
        setUrlParam()
      })

    // - open BMS
    $("#filer_input").filer({
      changeInput:
        '<div class="jFiler-input-dragDrop"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text">Drag & Drop a BMS file here or click</div></div></div>',
      showThumbs: false,
      theme: "dragdropbox",
      dragDrop: {
        dragEnter: null,
        dragLeave: null,
        drop: null,
      },
      limit: 1,
      maxSize: 10,
      extensions: ["bms", "bme", "bml", "pms"],
      captions: {
        errors: {
          filesLimit: "Only {{fi-limit}} files are allowed to be uploaded.",
          filesType: "Only BMS/BME/BML/PMS are allowed to be uploaded.",
          filesSize: "{{fi-name}} is too large! Please upload file up to {{fi-maxSize}} MB.",
          filesSizeAll: "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB.",
        },
      },
      onSelect: (blob) => {
        const reader = new FileReader()
        reader.onload = () => {
          localStorage.setItem("read_bms", reader.result)
          const md5Reader = new FileReader()
          md5Reader.onload = () => {
            urlParam.md5 = CryptoJS.MD5(CryptoJS.lib.WordArray.create(new Uint8Array(md5Reader.result))).toString()
            localStorage.setItem("read_bms_md5", urlParam.md5)
            setUrlParam()
            location.reload()
          }
          md5Reader.readAsArrayBuffer(blob)
        }
        reader.readAsText(blob, "shift-jis")
      },
    })

    // - enable all inputs as ionCheckRadio
    $("input[type='radio'], input[type='checkbox']").ionCheckRadio()
  }

  function reloadPage(l, p, o, s, jqXHR, textStatus) {
    if (jqXHR != null && jqXHR.responseJSON.status == "OK") {
      urlParam = {
        md5: jqXHR.responseJSON.md5,
      }
      setUrlParam()
    } else {
      alert("BMS繝輔ぃ繧､繝ｫ縺碁幕縺代∪縺帙ｓ縺ｧ縺励◆")
    }
    location.reload()
  }

  $(document).ready(function () {
    // show loading spinner
    HoldOn.open()

    // URL繝代Λ繝｡繝ｼ繧ｿ縺ｮ隗｣譫�
    var tempParam = getUrlParam()

    // 隴憺擇繝��繧ｿ縺ｮ蜿門ｾ�
    $.ajax({
      url: "marisa(ANOTHER7).bme", //"search?md5=" + tempParam.md5,
      type: "get",
      dataType: "text",
      beforeSend: function (xhr) {
        xhr.overrideMimeType("text/plain;charset=Shift_JIS")
      },
    }).then((response) => {
      if (localStorage.getItem("read_bms") !== null && localStorage.getItem("read_bms_md5") !== null) {
        const localStorageBMS = localStorage.getItem("read_bms")
        urlParam.md5 = localStorage.getItem("read_bms_md5")
        //localStorage.removeItem("read_bms")
        openBMS(localStorageBMS)
      } else {
        localStorage.setItem("read_bms_md5", "f8dcdfe070630bbb365323c662561a1a")
        openBMS(response)
      }
    })
  })

  // 逕ｻ蜒丈ｿ晏ｭ�
  function screenshot() {
    renderer.render(base)
    renderer.view.toBlob(function (blob) {
      saveAs(blob, "score.png")
    })
  }
}

const openBMS = (bmsSource) => {
  const tempParam = getUrlParam()
  tempParam.md5 = localStorage.getItem("read_bms_md5")

  const compileResult = bms.Compiler.compile(bmsSource)
  const chart = compileResult.chart

  const headers = chart.headers._data
  const lntype = headers.lntype
  const lnobj = headers.lnobj

  const objects = chart.objects._objects

  const timeSignatures = chart.timeSignatures._values
  let ribbitResponse = {
    artist: headers.artist,
    bpm: headers.bpm,
    genre: headers.genre,
    keys: parseInt(tempParam.keys) || 7,
    lnmap: {},
    notes: objects.filter(x => x.channel.match(/[12][1-9]/) && x.value !== lnobj).length + objects.filter(x => lntype === "1" && x.channel.match(/[56][1-9]/)).length / 2,
    score: [...Array(objects.slice(-1)[0].measure + 1).keys()].map(() => {
      return { length: 72 }
    }),
    title: headers.title,
    total: headers.total,
    unit: 72,
  }

  for (const [measure, timeSignature] of Object.entries(timeSignatures)) {
    ribbitResponse.score[measure] = { length: timeSignature * 72 }
  }

  let previousObjects = [...Array(36 ** 2).keys()].reduce(
    (obj, i) => Object.assign(obj, { [i.toString(36)]: undefined }),
    {}
  )

  for (const object of objects) {
    let channel = object.channel.charAt(0) === "5" ? `1${object.channel.charAt(1)}` : object.channel
    channel = object.channel.charAt(0) === "6" ? `2${object.channel.charAt(1)}` : channel
    if (!ribbitResponse.score[object.measure].hasOwnProperty(channel)) {
      ribbitResponse.score[object.measure][channel] = []
    }

    if (
      lntype == "1" &&
      (object.channel.charAt(0) === "5" || object.channel.charAt(0) === "6") &&
      previousObjects[object.channel] !== undefined
    ) {
      if (!ribbitResponse.lnmap.hasOwnProperty(channel)) {
        ribbitResponse.lnmap[channel] = []
      }
      ribbitResponse.lnmap[channel].push([
        previousObjects[object.channel],
        [object.measure, object.fraction * ribbitResponse.score[object.measure].length],
      ])
      previousObjects[object.channel] = undefined
    } else if (lnobj !== undefined && object.value === lnobj) {
      if (!ribbitResponse.lnmap.hasOwnProperty(object.channel)) {
        ribbitResponse.lnmap[object.channel] = []
      }
      ribbitResponse.lnmap[object.channel].push([
        previousObjects[object.channel],
        [object.measure, object.fraction * ribbitResponse.score[object.measure].length],
      ])
    } else if (object.channel === "08") {
      ribbitResponse.score[object.measure][object.channel].push([
        object.fraction * ribbitResponse.score[object.measure].length,
        headers[`bpm${object.value.toLowerCase()}`],
        object.value,
      ])
    } else {
      ribbitResponse.score[object.measure][channel].push([
        object.fraction * ribbitResponse.score[object.measure].length,
        parseInt(object.value, 16),
      ])
      previousObjects[object.channel] = [object.measure, object.fraction * ribbitResponse.score[object.measure].length]
    }
  }

  if (ribbitResponse != null && Object.keys(ribbitResponse).length != 0) {
    data = ribbitResponse
    var res = true
    if (data.notes > 100000) {
      res = confirm(
        "10荳�ヮ繝ｼ繝�ｻ･荳翫�隴憺擇繧帝幕縺薙≧縺ｨ縺励※縺�∪縺兔n邯夊｡後☆繧九→繝悶Λ繧ｦ繧ｶ縺後け繝ｩ繝�す繝･縺吶ｋ蜿ｯ閭ｽ諤ｧ縺後≠繧翫∪縺�"
      )
    }
    if (res) {
      start(tempParam)
      return
    }
  } else {
    HoldOn.close()
    location.reload()
  }
}
