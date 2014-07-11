###*
  @class core.file
  ファイルを操作します。
###

#==============================================================================
# method
#==============================================================================
###*
  @method downloadData
  データをファイルとしてダウンロードさせます。
  @param {object} content データ
  @param {string} fileName ファイル名
###
exports.downloadData = (content, fileName) ->
  contentType = 'application/octet-stream'
  blob = new Blob([content], {'type':contentType})
  a = document.createElement('a')
  a.href = window.URL.createObjectURL(blob)
  a.download = fileName
  a.click()

###*
  @method registFileAPI
  file apiとidを紐付けし、load実行時に指定したメソッドを呼び出します。
  @param {string} id id名
  @param {function} callback 呼び出すメソッド(e:イベント、parent:呼び出し元インスタンス が渡される。)
  @param {object} parent このメソッドを実行したインスタンス
###
exports.registFileAPI = (id, callback, parent) =>
  $(id).bind "change", (e) =>
    file = e.target.files[0]
    fr = new FileReader()
    fr.onload = (e) =>
      callback(e, parent)
    fr.readAsText(file)

###*
  @method getJSONFile
  JSONファイルを読み込み、指定したメソッドを呼び出します。
  @param {string} id id名
  @param {function} callback 呼び出すメソッド(data:読み込んだファイルデータ が渡される。)
###
exports.getJSONFile = (fileName, callback) =>
  $.getJSON(fileName, (data) =>
    callback(data)
  )

###*
  @method getFileList
  指定したディレクトリのファイル名リストを取得します。
  @param {string} dir ディレクトリ名
  @param {function} ファイル名リスト
###
