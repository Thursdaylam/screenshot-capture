
var jcrop, selection

var overlay = ((active) => (state) => {
  active = (typeof state === 'boolean') ? state : (state === null) ? active : !active
  $('.jcrop-holder')[active ? 'show' : 'hide']()
  chrome.runtime.sendMessage({message: 'active', active})
})(false)

var image = (done) => {
  var image = new Image()
  image.id = 'fake-image'
  image.src = chrome.runtime.getURL('/images/pixel.png')
  image.onload = () => {
    $('body').append(image)
    done()
  }
}

var init = (done) => {
  $('#fake-image').Jcrop({
    bgColor: 'none',
    onSelect: (e) => {
      selection = e
      capture()
    },
    onChange: (e) => {
      selection = e
    },
    onRelease: (e) => {
      setTimeout(() => {
        selection = null
      }, 100)
    }
  }, function ready () {
    jcrop = this

    $('.jcrop-hline, .jcrop-vline').css({
      backgroundImage: 'url(' + chrome.runtime.getURL('/images/Jcrop.gif') + ')'
    })

    if (selection) {
      jcrop.setSelect([
        selection.x, selection.y,
        selection.x2, selection.y2
      ])
    }

    done && done()
  })
}

var capture = (force) => {
  chrome.storage.sync.get((config) => {
    if (selection && (config.method === 'crop' || (config.method === 'wait' && force))) {
      jcrop.release()
      setTimeout(() => {
        chrome.runtime.sendMessage({
          message: 'capture', area: selection, dpr: devicePixelRatio
        }, (res) => {
          overlay(false)
          selection = null
          save(res.image)
        })
      }, 50)
    }
    else if (config.method === 'view') {
      chrome.runtime.sendMessage({
        message: 'capture',
        area: {x: 0, y: 0, w: innerWidth, h: innerHeight}, dpr: devicePixelRatio
      }, (res) => {
        overlay(false)
        save(res.image)
      })
    }
  })
}

var filename = () => {
  var pad = (n) => ((n = n + '') && (n.length >= 2 ? n : '0' + n))
  var timestamp = ((now) =>
    [pad(now.getFullYear()), pad(now.getMonth() + 1), pad(now.getDate())].join('-')
    + ' - ' +
    [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join('-')
  )(new Date())
  return 'Screenshot Capture - ' + timestamp + '.png'
}

var save = (image) => {
  //chrome.browserAction.setPopup({popup: "/content/popup.html"})

  // var link = document.createElement('a')
  // link.download = filename()
  // link.href = image
  // link.click()

//  var imgData = JSON.stringify(getBase64Image(image));
  console.log("saved")
  image = image.substr(22)
  console.log(image)
  $.ajax({
  url: 'http://localhost:3000/api/retrieveSimilarClothings',
  dataType: 'json',
  data: {image: image},
  type: 'POST',
  success: function(data) {
    console.log(data);
    }
  });
  var data = {
    "results": [{
      "dir": "Clean clothes/Tops/plainshirts268.jpg",
      "description": "Linen Short Sleeve Shirt",
      "url": "https://www.zalora.sg/zalora-linen-short-sleeve-shirt-blue-422855.html",
      "brand": "ZALORA",
      "image": "https://dynamic.zacdn.com/gzwwD_jc5dYLubXK3HywjmBZO9M=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/zalora-2410-558224-1.jpg",
      "price": "25",
      "anotherdir": "bottlenecks/Clean clothes/Tops/plainshirts268.jpg.txt",
      "id": "dad748d3-9c4e-4438-a7f6-1fe73894f31c",
      "createdAt": "2018-09-08T12:09:57.707Z",
      "updatedAt": "2018-09-08T12:09:57.707Z",
      "version": "1",
      "deleted": 0
    },
    {
      "dir": "Clean clothes/Tops/shortsleeveshirts0.jpg",
			"description": "Walter Shirt",
			"url": "https://www.zalora.sg/indicode-jeans-walter-shirt-blue-437000.html",
			"brand": "Indicode Jeans",
			"image": "https://dynamic.zacdn.com/4PTOSoNGbWJtFpPSSNUoP2AByrU=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/indicode-jeans-9933-000734-1.jpg",
			"price": "20",
			"anotherdir": "bottlenecks/Clean clothes/Tops/shortsleeveshirts0.jpg.txt",
			"id": "e2b2f897-a50b-4b8b-b32f-8843c3d057a9",
			"createdAt": "2018-09-08T12:09:57.845Z",
			"updatedAt": "2018-09-08T12:09:57.845Z",
			"version": "1",
			"deleted": 0
    },
    {
      "dir": "Clean clothes/Tops/shortsleeveshirts8.jpg",
			"description": "Short Sleeve Blue Geo Printed Shirt",
			"url": "https://www.zalora.sg/topman-short-sleeve-blue-geo-printed-shirt-blue-588411.html",
			"brand": "TOPMAN",
			"image": "https://dynamic.zacdn.com/LcwdpxRPoOD09eMB9Qm7q_-XYQI=/fit-in/762x1100/filters:quality(95):fill(ffffff)/http://static.sg.zalora.net/p/topman-7201-114885-1.jpg",
			"price": "80",
			"anotherdir": "bottlenecks/Clean clothes/Tops/shortsleeveshirts8.jpg.txt",
			"id": "caf19797-3deb-42d8-9b59-7e7c9fd400e8",
			"createdAt": "2018-09-08T12:09:58.319Z",
			"updatedAt": "2018-09-08T12:09:58.319Z",
			"version": "1",
			"deleted": 0
    }]
  }
  let results = data.results

  let description0 = results[0].description
  let url0 = results[0].url
  let image0 = results[0].image
  let price0 = results[0].price
  let brand0 = results[0].brand

  let description1 = results[1].description
  let url1 = results[1].url
  let image1 = results[1].image
  let price1 = results[1].price
  let brand1 = results[1].brand

  let description2 = results[2].description
  let url2 = results[2].url
  let image2 = results[2].image
  let price2 = results[2].price
  let brand2 = results[2].brand

  var div = document.createElement("div");
  div.setAttribute("id", "sghack");
  div.style.position = 'fixed';
  div.style.top = 100;
  div.style.right = 0;
  div.style.backgroundColor = "#eeeeee";
  div.style.zIndex = "500";
  div.style.cursor = 'pointer';
  div.style.width = "336px";
  div.style.overflow = "hidden"
  div.style.marginTop = "60px";
  div.style.marginRight = "30px";
  div.style.borderRadius = "3px";
  div.style.boxShadow = "1px 1px 10px rgba(34,34,34,0.6)";
  div.innerHTML = '<style> #sghack div { width: 336px; text-align: left;} #sghack .div_header { height: 30px; border-bottom: 1px solid #DDDDDD; text-align: center; font-weight: bold; font-size: 20px; font-family:sans-serif; padding:8px; margin-top:2px; margin-bottom:6px; background-color: #FEFFFF;}' +
'#sghack p.a { font-weight: bold; font-size: 20px; margin: 0px; margin-top: 0px; margin-bottom:0px;} #sghack p.b { font-size: 12px; line-height: 1.6; margin-bottom: -28px;}' +
'#sghack span.a { font-size: 25px; font-weight: bold; line-height: 1.2;} #sghack .button { width: 320px; height: auto; margin: 8px; margin-top: 0px; background-color: white; border: 1px solid #D5D5D5; border-radius: 6px; color: black; text-align: left; text-decoration: none; display: inline-block; -webkit-transition-duration: 0.4s; /* Safari */ transition-duration: 0.4s; cursor: pointer;}' +
'#sghack .button1:hover { background-color: #c8e6f0; color: black;} ' +
'#sghack .button_icon{ width: 20px; height: 20px; border: none; float: right; background-color: #feffff; margin-top: 4px; margin-right: 8px} #iconImage{ width: 20px; height: 20px; float: right;}' +
'#sghack .rss.opacity { filter: opacity(20%); } #sghack .rss.opacity:hover{ filter: opacity(50%);} </style>' +
'<div class="div_header"><font size = "5">Yux</font><button class = "button_icon"><img id = "iconImage" src="http://cdn.onlinewebfonts.com/svg/img_127536.png" title="opacity" class="rss opacity"></button></div>' +
'<!-- Recommendation #1 --><a href='+ url0 +' style="text-decoration:none; color: black;"><button class = "button button1" type="button"><img src=' + image0 +' style="float:left;width:118px;height:auto;margin-right:10px;"> <br><br> <span class="a">ZALORA</span><br> <font size = "3">' + brand0 +'</font> <br> <p class = "b">' + description0 + '<p><br> <p class="a">$' + price0 + '</p> <br> </button> <br></a>' +
'<!-- Recommendation #2 --><a href='+ url1 +' style="text-decoration:none; color: black;"><button class = "button button1" type="button"><img src=' + image1 +' style="float:left;width:118px;height:auto;margin-right:10px;"> <br><br> <span class="a">Zalora</span><br> <font size = "3">' + brand1 +'</font> <br> <p class = "b">' + description1 + '<p><br> <p class="a">$' + price1 + '</p> <br> </button> <br></a>' +
'<!-- Recommendation #3 --><a href='+ url2 +' style="text-decoration:none; color: black;"><button class = "button button1" type="button"><img src=' + image2 +' style="float:left;width:118px;height:auto;margin-right:10px;"> <br><br> <span class="a">ZALORA</span><br> <font size = "3">' + brand2 +'</font> <br> <p class = "b">' + description2 + '<p><br> <p class="a">$' + price2 + '</p> <br> </button> <br></a></div>'

  // div.innerHTML = ' <style> #sghack div { width: 350px; height: 30px; border-bottom: 1px solid #D3D3D3; text-align: center; font-weight: bold; font-size: 20px; font-family:sans-serif; } #sghack p.a { font-weight: bold; } #sghack .button { width: 350px; height: 128px;' +
  // ' background-color: white; /* Green */ border: none; border-bottom: 1px solid #D3D3D3; color: black; text-align: left; text-decoration: none; display: inline-block; -webkit-transition-duration: 0.4s; /* Safari */ transition-duration: 0.4s; cursor: pointer; } #sghack .button1:hover ' +
  // '{ background-color: #c8e6f0; color: black; } #close-image img { display: block; height: 15px; width: 15px; } #sghack .button_icon{ width: 15px; height: 15px; float: right; } #iconImage{ width: auto; height: auto; max-width: 15px; max-height: 15px; } </style>' +
  // '<br><br><br><div> YUX <button class = "button_icon"><img class = "iconImage" src="../images/close.png"></button> </div> <div> Top 3 Matches </div> <!-- Recommendation #1 --> '+
  // '<button class = "button button1" onclick="window.open(\"https://www.lazada.sg/\")" type="button"> <img src=' + image0 +' style="float:left;width:128px;height:128px;"> <font size = "4"> Zalora </font> <br>' + brand0 +'<br>' + description0 + '<br>$' + price0 + '<br> </button> <br> <!-- Recommendation #2 --> <button class = "button button1" onclick="window.open("https://www.lazada.sg/")" type="button"> <img src=' + image1 +' style="float:left;width:128px;height:128px;"> <font size = "4"> Zalora </font> <br>' + brand1 +'<br>' + description1 + '<br>$' + price1 + '<br> </button> <br> <!-- Recommendation #3 --> <button class = "button button1" onclick="window.open("https://www.lazada.sg/")" type="button"> <img src=' + image2 +' style="float:left;width:128px;height:128px;"> <font size = "4"> Zalora </font> <br>' + brand2 +'<br>' + description2 + '<br>$' + price2 + '<br> </button> <br> ';
  //div.innerHTML = '<div>asdfasdf</div> <div>afjhajbiasdfka</div>'
  document.body.appendChild(div)
}

window.addEventListener('resize', ((timeout) => () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    jcrop.destroy()
    init(() => overlay(null))
  }, 100)
})())

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'init') {
    res({}) // prevent re-injecting

    if (!jcrop) {
      image(() => init(() => {
        overlay()
        capture()
      }))
    }
    else {
      overlay()
      capture(true)
    }
  }
  return true
})
