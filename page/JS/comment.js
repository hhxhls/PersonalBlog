const eventbus = new Vue();

const postComment = new Vue({
    el:'#post_comment',
    data:{
        reply: -1,
        replyUser:'none',
        nickname:'',
        email: '',
        content:'',
        captcha:'',
        captchaInput:'',
        captchaSvg:'',
        options:''
    },
    computed: {

    },
    created(){
        this.getCaptcha();
    },
    mounted(){
        eventbus.$on('commentreply',({reply,replyUser}) => {
            this.reply = reply;
            this.replyUser = replyUser;
        })
    },
    methods: {
        postComment(){
            if(this.captcha !== this.captchaInput){
                console.log('in');
                alert('验证码错误，请重新输入');
                this.getCaptcha();
                return;
            }
            axios.post('/post_comment',{
                data:{
                    aid:-2,
                    nickname:this.nickname,
                    email:this.email,
                    content:this.content,
                    parent:this.reply,
                    parentName: this.replyUser
                }
            }).then(()=>{
                alert('评论提交成功');
                this.resetComment()
            })
        },
        resetComment(){
            this.nickname = '';
            this.email = '';
            this.content = '';
            this.reply = -1;
            this.replyUser = 'none';
        },
        getCaptcha(){
            axios({
                methods:'get',
                url: '/query_random_captcha'
            }).then((res)=>{
                this.captcha = res.data.data.text;
                this.captchaSvg = res.data.data.data;
            })
        },
    }
});


const commentList = new Vue({
    el:'#comment_list',
    data:{
        page: 1,
        totalComment:0,
        pageSize: 5,
        commentList: []
    },
    created(){
        this.getCommentList();
        this.getCommentCount();
    },
    methods:{
        getCommentList(){
            axios({
                methods:'get',
                url:'/query_comment_list',
                params:{
                    aid:-2,
                    page: this.page - 1,
                    pageSize: this.pageSize
                }
            }).then((res)=>{
                console.log(res);
                const data = res.data.data;
                const temp = [];
                data.forEach((ele)=>{
                    const obj = {
                        id:ele.id,
                        parent : ele.parent,
                        parentName:ele.parent_name,
                        nickname:ele.username,
                        content:ele.comments,
                        ctime: ele.ctime,
                    };
                    temp.push(obj);
                });
                this.commentList = temp;
            }).catch((err) => {
                console.log(err);
            })
        },

        getCommentCount(){
            axios({
                methods:'get',
                url:'/query_comment_count',
                params:{
                    aid:-2
                },
            }).then((res)=>{
                console.log(res);
                if(res && res.data && res.data.data && res.data.data[0] && res.data.data[0].count){
                    this.totalComment = res.data.data[0].count;
                }
            }).catch((err) => {
                console.log(err);
            })

        },

        commentReply(index){

            const params = {
                reply:this.commentList[index].id,
                replyUser:this.commentList[index].nickname,
            };
            eventbus.$emit('commentreply',params);

        }
        ,
        parseDate(timeStamp){
            const time = new Date(timeStamp);
            const date = time.getDate().toString().padStart(2, '0');
            const month = (time.getMonth() + 1).toString().padStart(2, '0');
            const year = time.getFullYear();
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            return `${year}年${month}月${date}日 ${hours}:${minutes}`;
        },

        changePage(page, pageSize){
            this.page = page;
            this.getCommentList();
        },
    },
});