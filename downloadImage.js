let url = "https://xieranmaya.github.io/images/cats/cats.json"
let imgs
let span = document.createElement("span")
let divs = document.body.getElementsByTagName("div")
let event = new Event('Widthchange')
document.addEventListener('Widthchange', () => {
  document.documentElement.scrollLeft = document.body.scrollWidth - document.body.offsetWidth
});

span.textContent = "加载中"
span.dataset.text = "..."

function get(url, callback) {
  let x = new XMLHttpRequest()
  x.open("GET", url)
  x.onload = () => {
    imgs = JSON.parse(x.responseText)
    span.style.top = "50px"
    callback()
  }
  x.send()
}

 
document.onclick = (e) => {
  if (e.target.nodeName === "DIV") {
    Array.from(divs).forEach((node) => node.style.display = "none")
    document.body.appendChild(span)
    if (e.target.className === "OneByOne") get(url, downloadOneByOne)
    if (e.target.className === "TwoByTwo") get(url, downloadTwoByTwo)
    if (e.target.className === "Max4") get(url, downloadMax4)
  }
}

//一张一张下载
function downloadOneByOne(i = 1) {
    span.textContent = `正在加载第${i}张图片`
    let node = document.createElement("img")
    node.onload = () => {
      document.body.appendChild(node)
      document.dispatchEvent(event)
      if (i < imgs.length) downloadOneByOne(i + 1)
      else {
        span.textContent = imgs.length + "张图片已全部加载完成！"
        span.dataset.text = ""
      }
    }
    node.src = "https://xieranmaya.github.io/images/cats/" + imgs[i - 1].url
}


//两个一组，都下载完以后，下载下一组
function downloadTwoByTwo(i = 1) {
  let judge, nodes = []
  if (i <= imgs.length - 1) {
    nodes[0] = document.createElement("img")
    nodes[1] = document.createElement("img")
    span.textContent = `正在加载第${i}/${i + 1}张图片`
  } else {
    nodes = [document.createElement("img")]
    span.textContent = `正在加载第${i}张图片`
  }
  judge = nodes.length
  nodes.forEach((node,index) => {
    node.onload = () => {
      document.body.appendChild(node)
      document.dispatchEvent(event)
      judge--
      if (i === imgs.length - 1 && judge === 0) {
        span.textContent = imgs.length + "张图片已全部加载完成！"
        span.dataset.text = ""
      }
      if (judge === 0 && i < imgs.length - 1) downloadTwoByTwo(i + 2)
    }
    node.src = "https://xieranmaya.github.io/images/cats/" + imgs[i - 1 + index].url
  }) 
}


//最多同时下载4张，有任何一张下载完，就开始一张新的下载
function downloadMax4(i = 1) {
  let judge = 0, num = 1
  function loadimg() {
    if (judge < 4 && i <= imgs.length) {
      let node = document.createElement("img")
      span.textContent = `正在加载第${i}张图片`
      node.onload =  () => {
        document.body.appendChild(node)
        document.dispatchEvent(event)
        judge--
        num++
        if (num === imgs.length) {
          span.textContent = imgs.length + "张图片已全部加载完成！"
          span.dataset.text = ""
        }
      }
      node.src = "https://xieranmaya.github.io/images/cats/" + imgs[i - 1].url
      judge++
      i++
    }
  }
  let load = setInterval(() => {
      if (i > imgs.length) {
        clearInterval(load)
        return
      } 
    loadimg()
  },50)
}