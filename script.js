
var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");

function drawLine(begin, end, color) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}

// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
  video.srcObject = stream;
  video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
  video.play();
  requestAnimationFrame(tick);
});

async function tick() {
  loadingMessage.innerText = "⌛ Loading video..."
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    loadingMessage.hidden = true;
    canvasElement.hidden = false;
    outputContainer.hidden = false;

    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    if (code) {
      drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
      drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
      drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
      drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
      outputMessage.hidden = true;
      outputData.parentElement.hidden = false;
      outputData.innerText = code.data;
      const arr=code.data.split("_");
      if(arr[0]==arr[1])
        await fetch("https://script.google.com/macros/s/AKfycbzi-SYIvAh0N_KVuZACzPAcUSV91lS6FD8dGU3uX8L2sqNLjHnCtBnCFzoAlcHsV0ID7g/exec?number="+arr[0])
        .then(res=>res.json())
        .then(data=>{
          alert(data.join(" "));
        })
      else {
        choice(arr);
        return
      }
    } else {
      outputMessage.hidden = false;
      outputData.parentElement.hidden = true;
    }
  }
  requestAnimationFrame(tick);
}

function choice(arr){
    $('#Area').fadeIn();
    console.log(arr[0])
    let string=`<a href="javascript:void(0)" class="btn btn--orange btn--radius" id="${arr[1]}" onclick="get(this)">団体(${arr[2]}名)</a>`;
    string+=`<a href="javascript:void(0)" class="btn btn--brue btn--radius" onclick="get(this)" id="${arr[0]}">個人</a>`;
    document.getElementById("btnarea").insertAdjacentHTML("beforeend",string);
}

async function get(btn){
    await fetch("https://script.google.com/macros/s/AKfycbzi-SYIvAh0N_KVuZACzPAcUSV91lS6FD8dGU3uX8L2sqNLjHnCtBnCFzoAlcHsV0ID7g/exec?number="+btn.id)
        .then(res=>res.json())
        .then(data=>{
            data=data.map(e=>`お名前：${e[0]} 、 入場時刻：${e[1]}`);
            alert(data.join("\n"));
        })
        $('#Area').fadeOut();
        const ele=document.getElementById("btnarea");
        while( ele.firstChild ){
            ele.removeChild( ele.firstChild );
          }
    requestAnimationFrame(tick);
}
