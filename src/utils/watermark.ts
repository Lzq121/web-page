export default function beforeUpload(file:any, text:any) {
  return new Promise((resolve, reject) => {
    //把文件转换为base64
    fileByBase64(file, async (base64:any) => { // 1.调用方法1： 把文件转换为base64字符串
      // 把文件转换为Canvas
      let tempCanvas = await imgToCanvas(base64) // 2. 调用方法2：把base64转换为Canvas
      // 把水印写入
      const canvas = addWatermark(tempCanvas, text) //3.调用方法3： 写入水印到Canvas
      // canvas转成img
      const img = convasToImg(canvas, file.type) //4. 调用方法4：把Canvas转换为image文件
      //被canvas转换为文件
      let newFile = base64ToFile(img.src, file.name) //5.调用方法5：被image转换为File文件
      resolve(newFile)
    })
  })
}

function convasToImg(canvas:any, type:any) {
  // 新建Image对象，可以理解为DOM
  let image = new Image()
  // canvas.toDataURL 返回的是一串Base64编码的URL
  // 指定格式 PNG
  image.src = canvas.toDataURL(type)
  return image
}
/**
 * 文件转base64
 * @param  file 文件流
 * @param  callback 回调函数
 */
function fileByBase64(file:any, callback:any) {
  let reader = new FileReader();
  // 传入一个参数对象即可得到基于该参数对象的文本内容
  reader.readAsDataURL(file);
  reader.onload = function (e:any) {
    // target.result 该属性表示目标对象的DataURL
    callback(e.target.result)
  };
}

async function imgToCanvas(base64:any) {
  // 创建img元素
  const img = document.createElement('img')
  img.setAttribute('src', base64)
  await new Promise((resolve) => (img.onload = resolve))
  // 创建canvas DOM元素，并设置其宽高和图片一样
  const canvas:any = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
  canvas.getContext('2d').drawImage(img, 0, 0)
  return canvas
}

function addWatermark(canvas:any, text:any) {
  // 正中间
  // const ctx = canvas.getContext('2d')
  // ctx.fillStyle = 'rgba(255,0,0,0.1)'
  // ctx.textBaseline = 'middle'
  // ctx.font = 'bold 50px Arial'
  // ctx.textAlign = 'center'
  // ctx.textBaseline = 'middle'
  // // ctx.rotate(45);
  // // ctx.rotate((45 * Math.PI) / 180);
  // ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  // return canvas

  // 放到右下角
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgba(255,0,0,0.1)'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.font = "bold 60px Arial";
  let lenW = ctx.measureText(text).width
  let right = canvas.width - lenW - 70
  let bottom = canvas.height - 70
  ctx.fillText(text, right, bottom)
  return canvas
}

function
/**
 * @param urlData  base64
 * @param fileName 文件名称
 * @returns {File}
 */
base64ToFile(urlData:any, fileName:any) {
  let arr = urlData.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bytes = atob(arr[1]); // 解码base64
  let n = bytes.length
  let ia = new Uint8Array(n);
  while (n--) {
    ia[n] = bytes.charCodeAt(n);
  }
  return new File([ia], fileName, {
    type: mime
  });
}
