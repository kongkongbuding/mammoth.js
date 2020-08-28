
let http = require('http')
let mammoth = require("./index")
let val = ''
let transformElement = e => {
  if (e.children) {
    e.children.forEach(transformElement);
  }
  if (e.type === "paragraph") {
    if (e.alignment === "center" && !e.styleId) {
      e.styleName = "center";
    }
    if (e.alignment === "left" && !e.styleId) {
      e.styleName = "left";
    }
    if (e.alignment === "right" && !e.styleId) {
      e.styleName = "right";
    }
    if (e.alignment === "justify" && !e.styleId) {
      e.styleName = "justify";
    }
  }
  return e
}


mammoth.convertToHtml({path: "../vue-cnpm/public/file/20190214四方德信大屏展示固废接口说明规范.docx"}, {
  stylePreservations: 'all',
  ignoreEmptyParagraphs: false,
  convertImage: mammoth.images.imgElement(function(image) {
    return image.read("base64").then(function(imageBuffer) {
      return {
        src: "data:" + image.contentType + ";base64," + imageBuffer
      }
    })
  }),
  styleMap: [
    
    "p[style-name='center'] => p:fresh > center",
    "p[style-name='right'] => p:fresh > right",
    "p[style-name='left'] => p:fresh > left",
    "p[style-name='justify'] => p:fresh > justify",

    "p[style-name='Heading 1'] => p:fresh > h1:fresh",
    "p[style-name='Heading 2'] => p:fresh > h2:fresh",
    "p[style-name='Heading 3'] => p:fresh > h3:fresh",
    "p[style-name='Heading 4'] => p:fresh > h4:fresh",
    "p[style-name='Heading 5'] => p:fresh > h5:fresh",
    "p[style-name='Heading 6'] => p:fresh > h6:fresh"

  ],
  transformDocument: transformElement
}).then(ret => {

  val = ret.value

})
.done()

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  req.on('data', function(chunk){
    post += chunk
  })
  req.on('end', function(){
    res.end(`<!doctype html>
    <html lang="en">
    <head>
      <title>React</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0, user-scalable=no" />
    </head>
    <body>
      <div id="root">${val}</div>
    </body>
    </html>
    `)
  })

}).listen('8888')

console.log('Serve runing at localhost:8888')

