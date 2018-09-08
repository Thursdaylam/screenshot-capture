
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
  var div = document.createElement("div");
  div.style.position = 'fixed';
  div.style.top = 10;
  div.style.right = 0;
  //div.style.backgroundColor = "#99f";
  div.style.zIndex = "100";
  div.style.cursor = 'pointer';
  div.style.width = "30%";
  div.style.height = "80%";
  div.innerHTML = '<embed src="../popup/popup.html"></object>';
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
