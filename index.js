if (!localStorage.getItem("HIMNOS_URL_BASE"))
    localStorage.setItem("HIMNOS_URL_BASE", '');
if (!localStorage.getItem("HIMNOS_TOKEN"))
    localStorage.setItem("HIMNOS_TOKEN", '');
if (!localStorage.getItem("HIMNOS_HIMNARIO"))
    localStorage.setItem("HIMNOS_HIMNARIO", '');
if (!localStorage.getItem("HIMNOS_NUMERO"))
    localStorage.setItem("HIMNOS_NUMERO", '0');

var app = new Vue({
    el: "#app",
    data() {
        return {
            showData: false,
            formData: {
                url_base: localStorage.getItem("HIMNOS_URL_BASE"),
                token: localStorage.getItem("HIMNOS_TOKEN"),
            },
            formHimno: {
                himnario: localStorage.getItem("HIMNOS_HIMNARIO"),
                number: parseInt(localStorage.getItem("HIMNOS_NUMERO")),
                title: '',
                content: '',
            },
        }
    },
    mounted() {
        this.$refs.hTitle.focus();
    },
    methods: {
        toggleShowData() {
            this.showData = !this.showData;
        },
        cleanCamps() {
            this.formHimno.title = '';
            this.formHimno.content = '';
            this.$refs.hTitle.focus();
        },
        saveData() {
            localStorage.setItem("HIMNOS_URL_BASE", this.formData.url_base);
            localStorage.setItem("HIMNOS_TOKEN", this.formData.token);
        },
        calcNetxNumber() {
            this.formHimno.number ++;
            localStorage.setItem("HIMNOS_NUMERO", this.formHimno.number); 
        },
        validaDataHimno() {
            if (this.formHimno.himnario.trim() === '') {
                alert("Falta colocar himnario");
                return false;
            }
            if (this.formHimno.number === '' || this.formHimno.number < 1) {
                alert("Falta colocar numero");
                return false;
            }
            if (this.formHimno.title.trim() === '') {
                alert("Falta colocar titulo");
                return false;
            }
            if (this.formHimno.content.trim() === '') {
                alert("Falta colocar contenido");
                return false;
            }
            return true;
        },
        async saveHimno() {
            if (!this.validaDataHimno()) return false;
            localStorage.setItem("HIMNOS_HIMNARIO", this.formHimno.himnario.trim());
            try {
                const response = await axios({
                    method: 'post',
                    url: this.formData.url_base + '/himnosGeneral',
                    data: {
                        himnario: this.formHimno.himnario.trim(),
                        num: this.formHimno.number,
                        title: this.formHimno.title.trim(),
                        contenido: this.formHimno.content.trim(),
                    },
                    headers: {
                        'Authorization': this.formData.token,
                    },
                })
                
                if (response.data.success) {
                    // alert("Repuesta: " + response.data.message);
                    console.log("Repuesta: " + response.data.message);
                    this.calcNetxNumber();
                    this.cleanCamps();
                } else {
                    alert("Repuesta: " + response.data.message);
                }
            } catch (error) {
                console.log(error);
                if (error.response) {
                    alert("Error: " + error.response.data.message);
                }
            }
        },
    },
});