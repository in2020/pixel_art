const RGB_DIFFERENCE = 30
const CANVAS_LOCAL_STORAGE_KEY = 'pixelPaintingCanvas'
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
        selectedColorPixels: [],
        simplifiedPixels: null,
        isFocusColorsContainer: false,
        images: [
            {src: 'assets/images/pikachu.jpg', id:'image-pika'},
            {src: 'assets/images/turtle30.jpg', id:'image-turtle'},
            {src: 'assets/images/blue-monster.png', id:'blue-monster'},
            {src: 'assets/images/blue-monster2.png', id:'blue-monster2'},
            {src: 'assets/images/cat-monster.png', id:'cat-monster'},
            {src: 'assets/images/flower-monster.png', id:'flower-monster'},
            {src: 'assets/images/green-monster.png', id:'green-monster'},
            {src: 'assets/images/green-monster2.png', id:'green-monster2'},
            {src: 'assets/images/mouse-monster.png', id:'mouse-monster'},
            {src: 'assets/images/muscle-monster.png', id:'muscle-monster'},
            {src: 'assets/images/orage-monster.png', id:'orage-monster'},
            {src: 'assets/images/stone-monster.png', id:'stone-monster'},
            {src: 'assets/images/tiger-monster.png', id:'tiger-monster'},
            {src: 'assets/images/yellow-monster.png', id:'yellow-monster'},
        ],
    },
    computed:{
        computedColors(){
          return this.colors.filter(color => this.isCompletedColor(color) === false)
        },
      computedGuideColorNumber(){
          return (x, y) => {
              const guidePixel = this.getPixelFromGuidePixels(x,y)
              return this.colors.findIndex(color => color === this.getCssRgb(guidePixel))
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
                    return this.selectedColorPixels.find(gPixel => gPixel.x === x && gPixel.y === y) === undefined
                        ? 'rgb(255,255,255)'
                        : 'rgb(220,220,220)'
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
                const guidePixel = this.getPixelFromGuidePixels(x, y)

                if(guidePixel.isBackground){
                    return true
                }

                const canvasPixel = this.getPixelFromCanvas(x, y)
                if (canvasPixel === undefined) {
                    return false
                }

                return canvasPixel.r === guidePixel.r
                    && canvasPixel.g === guidePixel.g
                    && canvasPixel.b === guidePixel.b
            }
        },
        getSameColorGuidePixels(){
          return (rgbO) => {
              return this.guidePixels.filter(gPixel => this.ieEqualRgb(rgbO, gPixel))
          }
        },
        isSelectedColorCompleted(){
            if(this.selectedColor === ''){
                return false
            }

            let isCompleted = true
            this.selectedColorPixels.forEach(sPixel => {
                const cPixel = this.getPixelFromCanvas(sPixel.x, sPixel.y)
                if(!cPixel || this.ieEqualRgb(cPixel, sPixel) === false){
                    isCompleted = false
                    return false
                }
            })
            return isCompleted
        },
        isCompletedColor(){
            return (cssRgb) => {
                if(!cssRgb){
                    return false
                }

                let isCompleted = true
                const rgbO = this.getRgbObjectFromCssRgb(cssRgb)
                if(rgbO.r === 260 && rgbO.g === 260 && rgbO.b ===260){
                    return true
                }

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
        setLocalStorageCanvas(){
            window.localStorage.setItem(CANVAS_LOCAL_STORAGE_KEY + this.selectedImageId, JSON.stringify(this.canvas))
        },
        setCanvasByLocalStorage(){
            const lsCanvas = window.localStorage.getItem(CANVAS_LOCAL_STORAGE_KEY+ this.selectedImageId)
            if(lsCanvas === null || confirm('Load saved data?') === false){
                return
            }
            this.canvas = JSON.parse(lsCanvas)
        },
        isInSelectedColorPixels(x, y){
          let isIn = false
          this.selectedColorPixels.every(p => {
              if(p.x === x && p.y === y){
                  isIn = true
                  return false
              }
          })
            return isIn
        },
        selectImage(image){
            history.replaceState(null, '', '?id='+image.id);
            this.selectedImageId = image.id
            this.page='canvas'

            this.setCanvasElement()
            this.setColorsAndGuide()
            this.setCanvasByLocalStorage()
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
            this.isFocusColorsContainer = false
            if(this.selectedColor === color){
                this.selectedColor = ''
                this.selectedColorPixels = []
                return
            }

            this.selectedColor = color
            const selectedColorRgbO = this.getRgbObjectFromCssRgb(this.selectedColor)
            this.selectedColorPixels =  this.getSameColorGuidePixels(selectedColorRgbO)
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
            if(this.selectedColor === ''){
                alert('Choose a color!')
                this.isFocusColorsContainer = true
                document.querySelector('#canvasContainer').scrollIntoView({behavior: 'smooth', block: "end", inline: "end"})
                return
            }

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

            if(this.isSelectedColorCompleted){
                this.selectedColor =''
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
                    pixel.isBackground = (pixel.r === 260 && pixel.g === 260 && pixel.b === 260)
                    simplifiedPixels.push(pixel)
                    this.guidePixels.push(pixel)
                }

                this.guidePixels.push({
                    x: pixel.x,
                    y: pixel.y,
                    r: similarPixel.r,
                    g: similarPixel.g,
                    b: similarPixel.b,
                    isBackground: (similarPixel.r === 260 && similarPixel.g === 260 && similarPixel.b === 260)
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
        reset(){
            this.canvas.splice(0, this.canvas.length)
        }
    },
    watch:{
        canvas(){
            this.setLocalStorageCanvas()
        },
        computedColors(){
            if(this.computedColors.length === 0){
                alert('Complete! 👍🏻')
            }
        }
    }
})
