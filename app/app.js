const RGB_DIFFERENCE = 30
var app = new Vue({
    el: '#app',
    created(){
        this.setCanvasElement()
        this.setColors()
        this.setGuide()
        // this.setCanvas()
    },
    data: {
        pixelImageElement:document.getElementById('pixelImage'),
        canvasElement: null,
        canvas: [],
        guidePixels: [],
        colors: [],
        selectedColor: 'fff',
        simplifiedPixels: null
    },
    computed:{
      computedGuideColorNumber(){
          return (x, y) => {
              const guidePixel = this.getPixelFromGuidePixels(x,y)
              return this.colors.findIndex(color => color === this.getCssRgb(guidePixel)) + 1
          }
      }
    },
    methods:{
        isGuidedColor(x, y){
            const canvasPixel = this.getPixelFromCanvas(x,y)
            if(canvasPixel === undefined){
                return false
            }

            const guidePixel = this.getPixelFromGuidePixels(x,y)

            return canvasPixel.r === guidePixel.r
            && canvasPixel.g === guidePixel.g
            && canvasPixel.b === guidePixel.b
        },
        getCanvasPixelColor(x, y) {
            const canvasPixel = this.getPixelFromCanvas(x,y)
            return canvasPixel === undefined ? 'rgb(255,255,255)' : this.getCssRgb(canvasPixel)
        },
        getGuidePixelColor(x, y) {
            const guidePixel = this.getPixelFromGuidePixels(x, y)
            return guidePixel === undefined ? 'rgb(255,255,255)' : this.getCssRgb(guidePixel)
        },
        selectColor(color){
          this.selectedColor = color
        },
        paintColor(x, y){
            const canvasPixel = this.getPixelFromCanvas(x,y)
            const rgbObject = this.getRgbObjectFromCssRgb(this.selectedColor)
            if(canvasPixel === undefined){
                this.canvas.push({x,y,r:rgbObject.r,g:rgbObject.g,b:rgbObject.b,})
            }else{
                canvasPixel.r = rgbObject.r
                canvasPixel.g = rgbObject.g
                canvasPixel.b = rgbObject.b
            }
        },
        getPixelFromCanvas(x, y){
            return _.find(this.canvas, {x, y})
        },
        getPixelFromGuidePixels(x, y){
            return _.find(this.guidePixels, {x, y})
        },
        setCanvasElement(){
            const canvas = document.createElement('canvas')
            canvas.width = this.pixelImageElement.width
            canvas.height = this.pixelImageElement.height
            canvas.getContext('2d').drawImage(this.pixelImageElement, 0, 0, this.pixelImageElement.width, this.pixelImageElement.height)
            this.canvasElement = canvas
        },
        setColors(){
            let pixelData = null
            let colors = []
            let simplifiedPixel = {}
            let pixels = []
            for(let y = 0 ; y <this.pixelImageElement.height; y++){
                for(let x = 0 ; x <this.pixelImageElement.width ; x++){
                    pixelData = this.canvasElement.getContext('2d').getImageData(x, y, 1, 1).data;
                    simplifiedPixel = this.simplifyRGB(pixelData[0], pixelData[1], pixelData[2])
                    simplifiedPixel.x = x
                    simplifiedPixel.y = y
                    pixels.push(simplifiedPixel)
                }
            }

            this.simplifiedPixels =this.simplifyPixels(pixels)

            this.simplifiedPixels.forEach(pixel => {
                colors.push(this.getCssRgb(pixel))
            })
            this.colors = _.uniq(colors)
        },
        simplifyRGB(r, g, b){
            return {
                r: Math.round(r / 10) * 10,
                g: Math.round(g / 10) * 10,
                b: Math.round(b / 10) * 10,
            }
        },
        simplifyPixels(pixels){

            let simplifiedPixels = []
            let isSimilarPixel = false
            let similarPixel = {}
            pixels.forEach(pixel => {
                isSimilarPixel = false
                similarPixel = {}
                simplifiedPixels.forEach(sPixel => {
                    if(Math.abs(sPixel.r - pixel.r)
                    + Math.abs(sPixel.g - pixel.g)
                    + Math.abs(sPixel.b - pixel.b)
                        <= RGB_DIFFERENCE
                    ){
                        isSimilarPixel = true
                        similarPixel = sPixel
                        return false
                    }
                })

                if(!isSimilarPixel){
                    simplifiedPixels.push(pixel)
                    this.guidePixels.push(pixel)
                }

                this.guidePixels.push({
                    x: pixel.x,
                    y: pixel.y,
                    r: similarPixel.r,
                    g: similarPixel.g,
                    b: similarPixel.b,
                })

            })

            return simplifiedPixels
        },
        getRgbObjectFromCssRgb(cssRgb){
            const rgb = cssRgb.substr(4).split(")")[0].split(',');
            return {
                r: Number(rgb[0]),
                g: Number(rgb[1]),
                b: Number(rgb[2]),
            }
        },
        getCssRgb(pixel){
            return 'rgb('+pixel.r+','+pixel.g+','+pixel.b+')'
        },
        setGuide(){

        },
        setCanvas(){
            this.canvas[0].push('fff')
            this.canvas[0].push('fff')
            this.canvas[0].push('fff')
            this.canvas[0].push('fff')
            this.canvas[0].push('fff')

            this.canvas[1].push('fff')
            this.canvas[1].push('fff')
            this.canvas[1].push('fff')
            this.canvas[1].push('fff')
            this.canvas[1].push('fff')

            this.canvas[2].push('fff')
            this.canvas[2].push('fff')
            this.canvas[2].push('fff')
            this.canvas[2].push('fff')
            this.canvas[2].push('fff')

            this.canvas[3].push('fff')
            this.canvas[3].push('fff')
            this.canvas[3].push('fff')
            this.canvas[3].push('fff')
            this.canvas[3].push('fff')

            this.canvas[4].push('fff')
            this.canvas[4].push('fff')
            this.canvas[4].push('fff')
            this.canvas[4].push('fff')
            this.canvas[4].push('fff')
        },
        rgbToHex(rgb) {
            // Choose correct separator
            let sep = rgb.indexOf(",") > -1 ? "," : " ";
            // Turn "rgb(r,g,b)" into [r,g,b]
            rgb = rgb.substr(4).split(")")[0].split(sep);

            let r = (+rgb[0]).toString(16),
                g = (+rgb[1]).toString(16),
                b = (+rgb[2]).toString(16);

            if (r.length == 1)
                r = "0" + r;
            if (g.length == 1)
                g = "0" + g;
            if (b.length == 1)
                b = "0" + b;

            return "#" + r + g + b;
        },

    },
})
