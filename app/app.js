const RGB_DIFFERENCE = 30

var app = new Vue({
    el: '#app',
    data: {
        page: 'index',
        canvasElement: null,
        canvas: [],
        guidePixels: [],
        colors: [],
        selectedImageId: '',
        selectedColor: '',
        simplifiedPixels: null,
        images: [
            {src: 'images/pikachu.jpg', id:'image-pika'},
            {src: 'images/turtle30.jpg', id:'image-turtle'},
        ],
    },
    computed:{
        computedColors(){
          return this.colors.filter(color => this.isCompletedColor(color) === false)
        },
      computedGuideColorNumber(){
          return (x, y) => {
              const guidePixel = this.getPixelFromGuidePixels(x,y)
              return this.colors.findIndex(color => color === this.getCssRgb(guidePixel)) + 1
          }
      },
        computedCanvasPixelColor(){
            return (x, y) => {
                const canvasPixel = this.getPixelFromCanvas(x,y)
                if(canvasPixel !== undefined){
                    return this.getCssRgb(canvasPixel)
                }

                if(this.selectedColor === '' ){
                    return this.computedGuidePixelColor(x, y)
                }else{
                    const selectedRgbO = this.getRgbObjectFromCssRgb(this.selectedColor)
                    const sameColorGuidePixels =this.getSameColorGuidePixels(selectedRgbO)
                    return sameColorGuidePixels.find(gPixel => gPixel.x === x && gPixel.y === y) === undefined
                        ? 'rgb(255,255,255)'
                        : this.computedGuidePixelColor(x, y)
                }
            }
        },
        computedGuidePixelColor(){
            return (x, y) => {
                const guidePixel = this.getPixelFromGuidePixels(x, y)
                return guidePixel === undefined ? 'rgb(255,255,255)' : this.getCssRgb(guidePixel)
            }
        },

        isGuidedColor(){
            return (x, y) => {
                const canvasPixel = this.getPixelFromCanvas(x, y)
                if (canvasPixel === undefined) {
                    return false
                }

                const guidePixel = this.getPixelFromGuidePixels(x, y)

                return canvasPixel.r === guidePixel.r
                    && canvasPixel.g === guidePixel.g
                    && canvasPixel.b === guidePixel.b
            }
        },
        computedSelectedColorGuidePixels(){
            const selectedColorRgbO = this.getRgbObjectFromCssRgb(this.selectedColor)
            return this.guidePixels.filter(gPixel => this.ieEqualRgb(selectedColorRgbO, gPixel))
        },
        getSameColorGuidePixels(){
          return (rgbO) => {
              return this.guidePixels.filter(gPixel => this.ieEqualRgb(rgbO, gPixel))
          }
        },
        isCompletedColor(){
            return (cssRgb) => {
                let isCompleted = true
                const rgbO = this.getRgbObjectFromCssRgb(cssRgb)
                const sameColorGuidePixels = this.getSameColorGuidePixels(rgbO)
                sameColorGuidePixels.forEach(gPixel => {
                    const cPixel = this.getPixelFromCanvas(gPixel.x, gPixel.y)
                    if(this.ieEqualRgb(cPixel, gPixel) === false){
                        isCompleted = false
                        return false
                    }
                })
                return isCompleted
            }
        },

        getPixelFromCanvas(){
            return (x, y) => {
                return _.find(this.canvas, {x, y})
            }

        },
        getPixelFromGuidePixels(){
            return (x, y) => {
                return _.find(this.guidePixels, {x, y})
            }
        },
    },

    methods:{
        isInSelectedColorPixels(x, y){
          let isIn = false
          this.computedSelectedColorGuidePixels.every(p => {
              if(p.x === x && p.y === y){
                  isIn = true
                  return false
              }
          })
            return isIn
        },
        selectImage(image){
            this.selectedImageId = image.id
            this.page='canvas'

            this.setCanvasElement()
            this.setColorsAndGuide()
        },
        ieEqualRgb(a, b){
            if(!a || !b){
                return false
            }
            return a.r === b.r && a.g === b.g && a.b === b.b
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
            if(this.selectedColor === color){
                this.selectedColor = ''
            }else{
                this.selectedColor = color
            }
        },
        touchTest(){
            this.test.touch = this.test.touch ? '' : 'blue'
        },
        touchSelectColor(color){
            return (direction, event) =>{
                this.selectColor(color)
            }
        },
        touchPaintColor (x, y) {
            return (direction, event) =>{
                this.paintColor(x, y)
            }
        },
        paintColor(x, y){
            const canvasPixel = this.getPixelFromCanvas(x,y)
            if(canvasPixel !== undefined && canvasPixel.isCompleted === true){
                return;
            }

            const rgbObject = this.getRgbObjectFromCssRgb(this.selectedColor)
            if(canvasPixel === undefined){
                this.canvas.push({
                    x,
                    y,
                    r: rgbObject.r,
                    g: rgbObject.g,
                    b: rgbObject.b,
                    isCompleted: this.isInSelectedColorPixels(x, y)
                })
            }else{
                canvasPixel.r = rgbObject.r
                canvasPixel.g = rgbObject.g
                canvasPixel.b = rgbObject.b
                canvasPixel.isCompleted = this.isInSelectedColorPixels(x, y)
            }

            if(this.isCompletedColor(this.selectedColor)){
                alert('Selected Color is completed!!')
            }
        },
        setCanvasElement(){
            const canvas = document.createElement('canvas')
            const pixelImageElement = document.getElementById(this.selectedImageId)
            canvas.width = pixelImageElement.width
            canvas.height = pixelImageElement.height
            canvas.getContext('2d').drawImage(pixelImageElement, 0, 0, pixelImageElement.width, pixelImageElement.height)
            this.canvasElement = canvas
        },
        setColorsAndGuide(){
            let pixelData = null
            let colors = []
            let simplifiedPixel = {}
            let pixels = []
            for(let y = 0 ; y <this.canvasElement.height; y++){
                for(let x = 0 ; x <this.canvasElement.width ; x++){
                    pixelData = this.canvasElement.getContext('2d').getImageData(x, y, 1, 1).data;
                    simplifiedPixel = this.simplifyRGB(pixelData[0], pixelData[1], pixelData[2])
                    simplifiedPixel.x = x
                    simplifiedPixel.y = y
                    pixels.push(simplifiedPixel)
                }
            }

            this.simplifiedPixels =this.simplifyPixelsAndSetGuide(pixels)

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
        simplifyPixelsAndSetGuide(pixels){

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
    },
})
