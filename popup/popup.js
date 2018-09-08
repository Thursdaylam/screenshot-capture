console.log('loaded js')
window.onload = function(tab) {
  console.log("ran onload")
  chrome.runtime.sendMessage({message: "inject"}, (res) => {
    if (res) {
      console.log(res)
    }
  })
}
