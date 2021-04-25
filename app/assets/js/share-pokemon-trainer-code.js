var app = new Vue({
    el: '#app',
    data: {
        trainerCode: '',
    },
    methods: {
        clickShare(){
            axios({
                method: 'post',
                url: '/api/trainer/code/',
                params: {
                    trainerCode: this.trainerCode,
                }
            }).then(()=>{
                alert('Shared!')
            }).catch(() => {
                alert('Error! Retry!')
                // window.location.reload()
            })
        }
    }
})
