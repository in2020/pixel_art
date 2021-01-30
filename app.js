var app = new Vue({
    el: '#app',
    data: {
        numberOfRow: 5,
        numberOfColumn: 5,
        canvas: [[],[],[],[],[]],
        guide: [[],[],[],[],[]],
        colors: ['7b5f5f', '5f617b', '5f7b6e'],
        selectedColor: 'fff',
    },
    methods:{
        selectColor(color){
          this.selectedColor = color
        },
        paintColor(row, column){
            this.$set(this.canvas[row], column, this.selectedColor);
        },
        setGuide(){
            this.guide[0].push(2)
            this.guide[0].push(2)
            this.guide[0].push(2)
            this.guide[0].push(2)
            this.guide[0].push(2)

            this.guide[1].push(2)
            this.guide[1].push(1)
            this.guide[1].push(1)
            this.guide[1].push(1)
            this.guide[1].push(2)

            this.guide[2].push(2)
            this.guide[2].push(1)
            this.guide[2].push(1)
            this.guide[2].push(1)
            this.guide[2].push(2)

            this.guide[3].push(2)
            this.guide[3].push(1)
            this.guide[3].push(1)
            this.guide[3].push(1)
            this.guide[3].push(2)

            this.guide[4].push(2)
            this.guide[4].push(2)
            this.guide[4].push(2)
            this.guide[4].push(2)
            this.guide[4].push(2)
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

    },
    created(){
      this.setGuide()
      this.setCanvas()
    }
})
