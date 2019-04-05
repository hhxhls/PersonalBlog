const eventbus = new Vue();
const articleDetail = new Vue({
    el: '#article_detail',
    data: {
        id: 0,
        title: '',
        content: '',
        date: '',
        tags: [],
        views: '',
    },
    computed: {},
    methods: {
        getDateString(timeStamp) {
            const time = new Date(timeStamp);
            const date = time.getDate().toString().padStart(2, '0');
            const month = (time.getMonth() + 1).toString().padStart(2, '0');
            const year = time.getFullYear();
            return `${year}-${month}-${date}`;
        },
        getArticle() {
            const getUrlParams = location.search.includes('?') ? location.search.split('?')[1].split('&') : '';
            if (getUrlParams === '') {
                return;
            }
            const params = {};
            getUrlParams.forEach((ele) => {
                const temp = ele.split('=');
                params[temp[0]] = temp[1]
            });

           return  axios({
                method: 'get',
                url: '/query_article_by_id',
                params: {
                    aid: params.aid
                }
            }).then((res) => {
                const result = res.data.data[0];
                this.id = result.id;
                this.title = result.title;
                this.content = result.content;
                this.date = this.getDateString(result.ctime * 1000);
                this.views = result.views;
                this.tags = result.tags.split(',');
                return Promise.resolve({id:result.id,views:result.views})
            }).catch((err) => {
                console.log(err);
            })
        },
        updateViews({id,views}) {
            axios.post('/update_article_views', {
                    aid: id,
                    views: views
                })
        }
    },
    created() {
        this.getArticle().then((res)=>{
            console.log(res);
            this.updateViews(res);
        });
    }
});

const postComment = new Vue({
    el: '#post_comment',
    data: {
        reply: -1,
        replyUser: 'none',
        nickname: '',
        email: '',
        content: '',
        captcha: '',
        captchaInput: '',
        captchaSvg: '',
        options: ''
    },
    computed: {},
    created() {
        this.getCaptcha();
    },
    mounted() {
        eventbus.$on('commentreply', ({reply, replyUser}) => {
            this.reply = reply;
            this.replyUser = replyUser;
        })
    },
    methods: {
        postComment() {
            if (this.captcha !== this.captchaInput) {
                console.log('in');
                alert('验证码错误，请重新输入');
                this.getCaptcha();
                return;
            }
            const getUrlParams = location.search.includes('?') ? location.search.split('?')[1].split('&') : '';
            if (getUrlParams === '') {
                return;
            }

            const params = {};
            getUrlParams.forEach((ele) => {
                const temp = ele.split('=');
                params[temp[0]] = temp[1];
            });

            axios.post('/post_comment', {
                data: {
                    aid: params.aid,
                    nickname: this.nickname,
                    email: this.email,
                    content: this.content,
                    parent: this.reply,
                    parentName: this.replyUser
                }
            }).then(() => {
                alert('评论提交成功');
                this.resetComment()
            })
        },
        resetComment() {
            this.nickname = '';
            this.email = '';
            this.content = '';
            this.reply = -1;
            this.replyUser = 'none';
        },
        getCaptcha() {
            axios({
                methods: 'get',
                url: '/query_random_captcha'
            }).then((res) => {
                this.captcha = res.data.data.text;
                this.captchaSvg = res.data.data.data;
            })
        },
    }
});

const commentList = new Vue({
    el: '#comment_list',
    data: {
        page: 1,
        totalComment: 0,
        pageSize: 5,
        commentList: []
    },
    created() {
        this.getCommentList();
        this.getCommentCount();
    },
    methods: {
        getCommentList() {
            const getUrlParams = location.search.includes('?') ? location.search.split('?')[1].split('&') : '';
            if (getUrlParams === '') {
                return;
            }
            const params = {};
            getUrlParams.forEach((ele) => {
                const temp = ele.split('=');
                params[temp[0]] = temp[1];
            });

            axios({
                methods: 'get',
                url: '/query_comment_list',
                params: {
                    aid: params.aid,
                    page: this.page - 1,
                    pageSize: this.pageSize
                }
            }).then((res) => {
                console.log(res);
                const data = res.data.data;
                const temp = [];
                data.forEach((ele) => {
                    const obj = {
                        id: ele.id,
                        parent: ele.parent,
                        parentName: ele.parent_name,
                        nickname: ele.username,
                        content: ele.comments,
                        ctime: ele.ctime,
                    };
                    temp.push(obj);
                });
                this.commentList = temp;
            }).catch((err) => {
                console.log(err);
            })
        },

        getCommentCount() {
            const getUrlParams = location.search.includes('?') ? location.search.split('?')[1].split('&') : '';
            if (getUrlParams === '') {
                return;
            }
            const params = {};
            getUrlParams.forEach((ele) => {
                const temp = ele.split('=');
                params[temp[0]] = temp[1];
            });
            axios({
                methods: 'get',
                url: '/query_comment_count',
                params,
            }).then((res) => {
                console.log(res);
                if (res && res.data && res.data.data && res.data.data[0] && res.data.data[0].count) {
                    this.totalComment = res.data.data[0].count;
                }
            }).catch((err) => {
                console.log(err);
            })

        },

        commentReply(index) {

            const params = {
                reply: this.commentList[index].id,
                replyUser: this.commentList[index].nickname,
            };
            eventbus.$emit('commentreply', params);

        }
        ,
        parseDate(timeStamp) {
            const time = new Date(timeStamp);
            const date = time.getDate().toString().padStart(2, '0');
            const month = (time.getMonth() + 1).toString().padStart(2, '0');
            const year = time.getFullYear();
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            return `${year}年${month}月${date}日 ${hours}:${minutes}`;
        },

        changePage(page, pageSize) {
            this.page = page;
            this.getCommentList();
        },
    },
});
