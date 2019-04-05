const everyDay = new Vue({
    el: '#every_day',
    data: {
        content: {
            mainEN: 'It\'s amazing how you can speak right to my heart. Without saying a word, you can light up the dark.',
            mainCN: '你一开口就能契合我的心意，这何等的神奇；不言一语，就足以把黑暗驱离。',
            author: 'Ronan Keating, "When You Say'
        }
    },
    computed: {},
    created() {
        // 请求数据，给content赋值 待定
        axios({
            method: 'get',
            url: '/query_every_day',
        }).then((res) => {
            console.log(res);
            const result = res.data.data[0],
                mainEN = result.content.split('\n')[0],
                mainCN = result.content.split('\n')[1],
                author = result.author;
            this.content = {
                mainEN,
                mainCN,
                author
            }
        }).catch((err) => {
            console.log(err);
        })
    }
});

const articleList = new Vue({
    el: '#article_list',
    data: {
        page: 1,
        pageSize: 5,
        count: 1,
        articleList: [
            {
                id: '0',
                title: '',
                content: ``,
                date: ``,
                views: '',
                tags: [],
                link: '',
            }
        ]
    },
    created() {
            this.getPage(this.page, this.pageSize);
    },
    computed: {
        getArticleList() {
            return this.articleList;
        },
    },
    methods: {
        getPage(page, pageSize) {
            const getUrlParams = location.search.includes('?') ? location.search.split('?')[1].split('&') : [];
            const params = {};
            getUrlParams.forEach((ele) => {
                const temp = ele.split('=');
                params[temp[0]] = temp[1]
            });
            if (params.tagid === undefined && params.s !== undefined) {
                axios({
                    method: 'get',
                    url: 'search_article',
                    params: {
                        page: page - 1,
                        pageSize,
                        key: params.s,
                    }
                }).then((res) => {
                    const result = res.data.data;
                    const temp = [];
                    result.forEach((ele) => {
                        const obj = {
                            id: ele.id,
                            title: ele.title,
                            content: ele.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, ''),
                            date: this.getDateString(ele.ctime * 1000),
                            views: ele.views,
                            tags: ele.tags.split(','),
                            link: '/article_detail.html?aid=' + ele.id,
                        };
                        temp.push(obj);
                    });
                    this.articleList = temp;
                }).catch((err) => {
                    console.log(err)
                });
                axios({
                    method:'get',
                    url: 'search_article_count',
                    params:{
                        key: params.s,
                    }
                }).then((res)=>{
                    this.count = res.data.data[0].count;
                }).catch((err)=>{
                    console.log(err);
                })
            }else if (params.tagid !== undefined && params.s === undefined){
                axios({
                    method: 'get',
                    url: 'query_article_by_tag',
                    params: {
                        page: page - 1,
                        pageSize,
                        tagId:params.tagid
                    }
                }).then((res) => {
                    const result = res.data.data;
                    const temp = [];
                    result.forEach((ele) => {
                        const obj = {
                            id: ele.id,
                            title: ele.title,
                            content: ele.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, ''),
                            date: this.getDateString(ele.ctime * 1000),
                            views: ele.views,
                            tags: ele.tags.split(','),
                            link: '/article_detail.html?aid=' + ele.id, //待补全
                        };
                        temp.push(obj);
                    });
                    this.articleList = temp;
                }).catch((err) => {
                    console.log(err)
                });

                axios({
                    method:'get',
                    url: 'query_article_count_with_tag',
                    params:{
                        tagId:params.tagid
                    }
                }).then((res)=>{
                    this.count = res.data.data[0].count;
                }).catch((err)=>{
                    console.log(err);
                })
            }else{
                axios({
                    method: 'get',
                    url: 'query_article_by_page',
                    params: {
                        page: page - 1,
                        pageSize,
                    }
                }).then((res) => {
                    const result = res.data.data;
                    const temp = [];
                    result.forEach((ele) => {
                        const obj = {
                            id: ele.id,
                            title: ele.title,
                            content: ele.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, ''),
                            date: this.getDateString(ele.ctime * 1000),
                            views: ele.views,
                            tags: ele.tags.split(','),
                            link: '/article_detail.html?aid=' + ele.id, //待补全
                        };
                        temp.push(obj);
                    });
                    this.articleList = temp;
                }).catch((err) => {
                    console.log(err)
                });
                axios({
                    method:'get',
                    url: 'query_article_count',
                }).then((res)=>{
                    this.count = res.data.data[0].count;
                }).catch((err)=>{
                    console.log(err);
                })
            }

        },
        changePage(page, pageSize){
            this.page = page;
            this.getPage(page, pageSize);
        },
        getDateString(timeStamp) {
            const time = new Date(timeStamp);
            const date = time.getDate().toString().padStart(2, '0');
            const month = (time.getMonth() + 1).toString().padStart(2, '0');
            const year = time.getFullYear();
            return `${year}-${month}-${date}`;
        },
    }
});