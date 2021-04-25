var app = new Vue({
    el: '#app',
    data: {
        trainerCode: '',
        trainerCodes:[],
    },
    created(){
      this.fetchTrainerCodes()
    },
    methods: {
        clickShare(){
            this.requestShareCode()
        },
        clickInvalidCode(trainerCode){
            this.requestSetInvalid(trainerCode)
        },
        requestShareCode(){
            axios.post('/api/trainer/code/', {trainerCode: this.trainerCode}).then(()=>{
                alert('Shared!')
            }).catch(() => {
                alert('Error! Retry!')
                // window.location.reload()
            })
        },
        requestSetInvalid(trainerCode){
            axios.post('/api/trainer/code/invalid/', {trainerCode}).then(()=>{
                alert('Set invalid code!')
            }).catch(() => {
                alert('Error! Retry!')
                // window.location.reload()
            })
        },
        async fetchTrainerCodes(){
            const response = await axios.get('/api/trainer/codes/')
            this.trainerCodes = response.data.trainerCodes
        }
    }
})
