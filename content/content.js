
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

	var div = document.createElement("div");
	div.style.position = 'fixed';
	div.style.top = 10;
	div.style.left = 0;
	div.style.backgroundColor = "#99f";
	div.style.zIndex = "3";
	div.style.cursor = 'pointer';
	div.style.width = "30%";
	div.style.height = "80%";
	div.innerHTML = "any html you want";
	document.body.appendChild(div)

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
