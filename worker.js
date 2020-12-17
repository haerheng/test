onmessage = function(e) {
    const time_start = performance.now()

    var imgdata = e.data[0]//imgdata
    var pos = e.data[1]//pos
    var width = imgdata.width, height = imgdata.height, data = imgdata.data
    var color = _color(pos.x, pos.y)
    var g_arr0 = new Array(width * height), g_arr1 = new Array(width * height) 
    var newarr = recursion([pos.x,pos.y]) 
    var count = e.data[2]
    // newarr.forEach((e)=>{
    //     newarr = newarr.concat(recursion(e))
    // })
    for(var i = 0, p = 0; newarr[i];i++){
        newarr = newarr.concat(recursion(newarr[i]))
        if(i/newarr.length - p > 0.1){
            p = i/newarr.length
            console.log((100 * p).toFixed(1) + '% -> ' + (performance.now() - time_start))
        }
    }
    /**
     * change color to white
     * 应该移除！
     */
    console.log('开始替换-> ' + (performance.now() - time_start))

    g_arr1.forEach(
        (e,i)=>{
            imgdata.data[i] = 255
            imgdata.data[i+1] = 255
            imgdata.data[i+2] = 255
            imgdata.data[i+4] = 255
        }
    )
    postMessage(imgdata)
    console.log('-> ' + (performance.now() - time_start))
    close()
   
    /**
     * point: [pos_x, pos_y]
     * 
     * return: [[pos_x, pos_y], [pos_x, pos_y]...]
     */
    function recursion(point){
        var point_list        
        var near = _nearby(point[0], point[1])
        point_list = []
        near.forEach((e,i)=>{
            var D = color_distance(color, _color(e[0],e[1]))
            var index = _(e[0],e[1])
            if(g_arr0[index] || g_arr1[index]){
                //色差已比较
                return
            }
            if(D > count){
                //色差超过范围
                g_arr0[index] = 1
            }else{
                //色差符合精度范围
                g_arr1[index] = 1
                point_list.push(e)//以此点为基础，继续迭代搜索
            }
        })
        return point_list
        

    }
    function _nearby(x, y){
        var arr = [[x-1,y-1],[x-1,y],[x-1,y+1],[x,y-1],[x,y+1],[x+1,y-1],[x+1,y],[x+1,y+1]]
        var result = []
        arr.forEach((e,i)=>{
            if(e[0]>width || e[0]<0 || e[1]>height || e[1]<0)
                return            
            result.push([e[0],e[1]])
        })
        return result
    }
    function _color(x,y){
        if(x>width || y>height)
            return NaN
        var i = (y*width+x)*4
        return [data[i],data[i+1],data[i+2],data[i+3]]
    }
    function _(x,y){
        if(x>width || y>height)
            return NaN
        var i = (y*width+x)*4
        return i//[data[i],data[i+1],data[i+2],data[i+3]]
    }
}

function color_distance(rgb0,rgb1){
    return parseInt( Math.sqrt( 3*Math.pow(rgb0[0]-rgb1[0],2) +
            4*Math.pow(rgb0[1]-rgb1[1],2) +
            2*Math.pow(rgb0[2]-rgb1[2],2)))
}
