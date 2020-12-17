window.count = 200
var g_hidden_canvas
var g_loaded = false
var mapinfo ={
    scale:{
        x:1,
        y:1
    },
    rotate:{
        angle:0
    },
    translate:{
        x:0,
        y:0
    }
}

document.querySelectorAll('.img-clipping button').forEach((e)=>{
    e.addEventListener('click',displayChange)
})
document.querySelector('#precision').value = window.count
document.querySelector('#precision').addEventListener('change',(e)=>{
    window.count = e.target.value
})
var c = document.querySelector('.img-clipping .display')
var ctx = c.getContext('2d')
var filepicker = document.querySelector('#file-picker')
filepicker.addEventListener('change',()=>{
    LoadImage(filepicker.files[0],ctx)
})
var old_color = [0,0,0,0]
c.addEventListener('mousemove',(e)=>{
    if(!g_loaded){
        return
    }
    var pos = getMousePosition(e)
    var src_pos = {
        x:Math.ceil((pos.x)/mapinfo.scale.x - mapinfo.translate.x),
        y:Math.ceil((pos.y)/mapinfo.scale.y - mapinfo.translate.y)
    }

    
    // var temp = g_hidden_canvas.getContext('2d')
    // var color = temp.getImageData(src_pos.x,src_pos.y,1,1)
    // display(g_hidden_canvas,ctx,mapinfo)
    
    // console.log(color_distance(old_color,color.data))
    // old_color = color.data
    // var xxx = c.getContext('2d')
    // xxx.fillStyle = 'rgba('+color.data.join(',')+')'
    // xxx.clearRect(oldpos.x,oldpos.y,20,20)
    // xxx.fillRect(pos.x,pos.y,20,20)
    // oldpos={
    //     x:pos.x,
    //     y:pos.y
    // }
    // console.log(color)
    // console.log(src_pos)
    // console.log(mapinfo.translate)

})
/**
 * load Test file.
 */
var testImg = new Image();
testImg.src = './img/test.jpg'
testImg.onload = function(){
        var _c = document.querySelector('#hidden-canvas')
        _c.height = testImg.height
        _c.width = testImg.width
        g_hidden_canvas = _c
        var _ctx = _c.getContext('2d')
        _ctx.drawImage(testImg,0,0,testImg.width,testImg.height)        
        mapinfo.scale.x = mapinfo.scale.y = 400.0/Math.max(testImg.width,testImg.height)
        ctx.clearRect(0,0,400,400)
        display(_c,ctx,mapinfo) 
        g_loaded = true       
    }

c.addEventListener('click',(e)=>{
    if(!g_loaded){
        return
    }
    var pos = getMousePosition(e)
    var src_pos = {
        x:Math.ceil((pos.x)/mapinfo.scale.x - mapinfo.translate.x),
        y:Math.ceil((pos.y)/mapinfo.scale.y - mapinfo.translate.y)
    }
    if(src_pos.x > g_hidden_canvas.width || src_pos.x < 0 || src_pos.y > g_hidden_canvas.height || src_pos.y < 0)
        return
    console.log('RGBA: ('+clip(src_pos).join(',')+')')
})
function clip(pos) {
    var imgdata = g_hidden_canvas.getContext('2d').getImageData(0,0,g_hidden_canvas.width,g_hidden_canvas.height)
    if(window.Worker){
        var myWroker = new Worker('worker.js')
    }
    else{
        alert('浏览器不支持Web Worker')
        return [1,1,1]
    }
    myWroker.postMessage([imgdata, pos, window.count])
    myWroker.onmessage = function(e) {
        g_hidden_canvas.getContext('2d').putImageData(e.data,0,0)
        display(g_hidden_canvas,ctx,mapinfo)
    }
    return [0,0,0]
}
// function clip(pos){
//     var imgdata = g_hidden_canvas.getContext('2d').getImageData(0,0,g_hidden_canvas.width,g_hidden_canvas.height)
//     var width = imgdata.width, height = imgdata.height, data = imgdata.data
//     var color = _color(pos.x,pos.y)
//     var g_arr0 = new Array(width * height), g_arr1 = new Array(width * height) 
//     var newarr

//     newarr = recursion([pos.x,pos.y]) 
//     // newarr.forEach((e)=>{
//     //     newarr = newarr.concat(recursion(e))
//     // })
//     for(var i = 0, p = 0; newarr[i];i++){
//         newarr = newarr.concat(recursion(newarr[i]))
//         if(i/newarr.length - p > 0.1){
//             p = i/newarr.length
//             console.log(p)
//         }
//     }
//     g_arr1.forEach(
//         (e,i)=>{
//             imgdata.data[i] = 255
//             imgdata.data[i+1] = 255
//             imgdata.data[i+2] = 255
//             imgdata.data[i+4] = 255
//             // console.log(i)
//         }
//     )
    
//     g_hidden_canvas.getContext('2d').putImageData(imgdata,0,0)
//     display(g_hidden_canvas,ctx,mapinfo)
//     // console.log(g_arr1)  
//     return color
//     function recursion(point){
//         var new_arr        
//         var near = _nearby(point[0], point[1])
//         new_arr = []
//         near.forEach((e,i)=>{
//             var D = color_distance(color, _color(e[0],e[1]))
//             var index = _(e[0],e[1])
//             if(g_arr0[index] || g_arr1[index]){
//                 return
//             }
//             if(D > window.count){
//                 g_arr0[index] = 1
//             }else{
//                 g_arr1[index] = 1
//                 new_arr.push(e)
//             }
//         })
//         return new_arr;
        

//     }
//     function _nearby(x, y){
//         var arr = [[x-1,y-1],[x-1,y],[x-1,y+1],[x,y-1],[x,y+1],[x+1,y-1],[x+1,y],[x+1,y+1]]
//         var result = []
//         arr.forEach((e,i)=>{
//             if(e[0]>width || e[0]<0 || e[1]>height || e[1]<0)
//                 return            
//             result.push([e[0],e[1]])
//         })
//         return result
//     }
//     function _color(x,y){
//         if(x>width || y>height)
//             return NaN
//         var i = (y*width+x)*4
//         return [data[i],data[i+1],data[i+2],data[i+3]]
//     }
//     function _(x,y){
//         if(x>width || y>height)
//             return NaN
//         var i = (y*width+x)*4
//         return i//[data[i],data[i+1],data[i+2],data[i+3]]
//     }
// }
function display(src_c,dst_ctx,mapinfo){
    // console.log(mapinfo)
    dst_ctx.save()
    dst_ctx.clearRect(0,0,800,800)
    dst_ctx.scale(mapinfo.scale.x,mapinfo.scale.y)
    dst_ctx.rotate(mapinfo.rotate.angle)
    dst_ctx.translate(mapinfo.translate.x,mapinfo.translate.y)
    dst_ctx.drawImage(src_c,0,0)
    dst_ctx.restore()
}
function displayChange(event){
    switch(event.target.className){
        case 'zoomin':
            mapinfo.scale.x = mapinfo.scale.y *= 1.1
            break
        case 'zoomout':
            mapinfo.scale.x = mapinfo.scale.y *= 0.9
            break
        case 'left':
            mapinfo.translate.x += 10
            break
        case 'right':
            mapinfo.translate.x -= 10
            break
        case 'up':
            mapinfo.translate.y -= 10
            break
        case 'down':
            mapinfo.translate.y += 10
            break
        case 'save':
            var savedImg = g_hidden_canvas.toDataURL('png')
            savedImg.replace(_fixType('png'),'image/octet-stream')
            var filename = 'save_' + (new Date()).getTime() + '.' + 'png';
            saveFile(savedImg,filename);
            break
        default:
            break
    }
    ctx.clearRect(0,0,800,800)
    display(g_hidden_canvas,ctx,mapinfo)
}
/**
 * 引用自：
 * https://www.baidufe.com/item/65c055482d26ec59e27e.html
 */
var _fixType = function(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    var r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
};

var saveFile = function(data, filename){
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;
   
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};
   

/*
LoadImage(img_file,ctx)
将input（file）中读取到的文件加载至canvas
*/
function LoadImage(img_file,ctx){
    var img = new Image()
    // window.img = img
    var reader = new FileReader()
    reader.readAsDataURL(img_file)
    reader.onload = function(){
        img.src = reader.result
    }
    img.onload = function(){
        var _c = document.querySelector('#hidden-canvas')
        _c.height = img.height
        _c.width = img.width
        g_hidden_canvas = _c
        var _ctx = _c.getContext('2d')
        _ctx.drawImage(img,0,0,img.width,img.height)        
        mapinfo.scale.x = mapinfo.scale.y = 400.0/Math.max(img.width,img.height)
        ctx.clearRect(0,0,400,400)
        display(_c,ctx,mapinfo) 
        g_loaded = true       
    }
}
function getMousePosition(e){
    var x, y
    if (e.layerX || e.layerX == 0) {
        x = e.layerX
        y = e.layerY
    } else if (e.offsetX || e.offsetX == 0) {
        x = e.offsetX
        y = e.offsetY
    }
    return {x:x,y:y}
}
function color_distance(rgb0,rgb1){
    return parseInt( Math.sqrt( 3*Math.pow(rgb0[0]-rgb1[0],2) +
            4*Math.pow(rgb0[1]-rgb1[1],2) +
            2*Math.pow(rgb0[2]-rgb1[2],2)))
}
function color_distance11(rgb0,rgb1){
    var sum = 0, sum0 = 0, sum1 = 0
    var i = 0
    for(i = 0; i < 3; i++)
    {
        var e = rgb0[i]
        // console.log(e+' '+rgb1[i])
        if(i>2)
            return
        sum += (e * rgb1[i])
        sum0 += (e*e)
        sum1 += (rgb1[i]*rgb1[i])
    }
    // console.log([sum,sum0,sum1].join(' '))
    var theta = Math.acos(sum/(sum0*sum1==0?1:sum0*sum1))*510/Math.PI
    // console.log(theta+' theta')
    var max = Math.max(vector(rgb0)[3],vector(rgb1)[3])
    var min = Math.min(vector(rgb0)[3],vector(rgb1)[3])
    if(max == min){
        max = 1
        min = 1
    }
    if(min == 0)
        min = 1
    var top = Math.abs(max/min) - 1
    // console.log(top+" top")
    var D = Math.pow(2,top) * theta
    return D
    function vector(rgb){
        var u = (rgb[0]+rgb[1]+rgb[2])/3
        return [rgb[0] - u, rgb[1] - u, rgb[2] - u, u]
    }
}

// Google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-101510834-1', 'auto');
    ga('send', 'pageview');