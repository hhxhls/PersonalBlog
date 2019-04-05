Vue.use(window.VueQuillEditor)
const quill = new Vue({
    el:'#quill',
    data:{
        content:``,
        title:``,
        tags:``,
        views:0,
        ctime: null,
        utime: null,
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
            alert('提交成功');
            console.log(this.content);
            axios.post('/edit_article',{
                title: this.title,
                content: this.content,
                tags:this.tags,
                views: this.views,
                ctime: this.ctime,
                utime: this.utime,
            }).then(()=>{
                this.title = '';
                this.content = '';
                this.tags = '';
            },(err)=>{
                console.log(err);
            })
        }
    }
});