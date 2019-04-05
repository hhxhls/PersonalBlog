Vue.use(window.VueQuillEditor)
const quill = new Vue({
    el:'#quill',
    data:{
        content:'',
        author:'',
        editorOption:{
            placeholder: 'Insert your great thoughts here...',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['clean'],
                    ['link', 'image', 'video']
                ],
            }
        }
    },
    components:{
        VueQuillEditor,
    },
    methods:{
        onEditorBlur(e){

        },
        onEditorFocus(e){

        },
        onEditorReady(e){

        },
        onArticleSubmit(){
            //remove html tag mark '<></>'
            const reg1=/<[^\/>]+>/gim;
            const reg2=/<[^>]+>/gim;
            console.log(this.content);
            const content = this.content.replace(reg1,'\n').replace(reg2,'').replace('\n','');
            console.log(content);
            axios.post('/edit_every_day',{
                    author: this.author,
                    content: content
            }).then(()=>{
                alert('提交成功');
                this.content= '';
                this.author = '';
            },(err)=>{
                console.log(err);
            })
        }
    }
});