var app = new Vue({
    el: '#app',
    data: {
        trainerCode: '',
    },
    methods: {
        clickShare(){
            axios.post('/api/trainer/code/', {trainerCode: this.trainerCode}).then(()=>{
                alert('Shared!')
            }).catch(() => {
                alert('Error! Retry!')
                // window.location.reload()
            })
        }
    }
})
