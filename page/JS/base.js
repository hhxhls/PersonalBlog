const EventBus = new Vue();
const randomText = new Vue({
    el:'#random_tags',
    data:{
        limit: 30,
        tags:[]
    },
    created(){
        this.getRandomTags()
    },
    methods:{
        getRandomTags(){
            axios({
                methods: 'get',
                url: '/query_random_tags',
                 params:{
                    limit:this.limit
                 }
            }).then((res)=>{
                console.log(res);
                const result = res.data.data;
                const temp = [];
                result.forEach((ele)=>{
                    const obj = {
                        tagName:ele.tag,
                        link: '?tagid=' + ele.id,
                    };
                    temp.push(obj)
                });
                this.tags = temp;
            }).catch((err)=>{
                console.log(err)
            })
        },
        randomColor(){
            let red = Math.floor(Math.random()*205 + 50),
                green=Math.floor(Math.random()*205 + 50),
                blue=Math.floor(Math.random()*205 + 50);

            return `rgb(${red},${green},${blue})`
        },
        randomSize(){
            return `${Math.floor(Math.random() * 10 + 12 )}px`
        }
    }
});

const newHot = new Vue({
    el:'#new_hot',
    data:{
        limit: 5,
        hotList : []
    },
    created(){
        this.getHotList();
    },
    methods:{
        getHotList(){
            axios({
                methods:'get',
                url:'/query_hot_article',
                params:{
                    limit: this.limit
                }
            }).then((res) =>{
                const result = res.data.data;
                const temp = [];
                result.forEach((ele) => {
                    const obj = {
                        id: ele.id,
                        title: ele.title,
                        link: '/article_detail.html?aid=' + ele.id, //待补全
                    };
                    temp.push(obj);
                });
                this.hotList = temp;

            }).catch((err)=>{
                console.log(err)
            })
        }
    }
});

const new_comments = new Vue({
    el:'#new_comments',
    data:{
        limit: 5,
        commentList:[]
    } ,
    created(){
        this.getNewComment()
    },
    methods:{
        getDateString(timeStamp) {
            const time = new Date(timeStamp);
            const date = time.getDate().toString().padStart(2, '0');
            const month = (time.getMonth() + 1).toString().padStart(2, '0');
            const year = time.getFullYear();
            return `${year}-${month}-${date}`;
        },
        getNewComment(){
            axios({
                methods:'get',
                url: '/query_new_comment',
                params: {
                    limit:this.limit
                }
            }).then((res) =>{
                const result = res.data.data;
                const temp = [];
                result.forEach((ele) => {
                    const obj = {
                        id: ele.id,
                        userName:ele.username,
                        cdate:this.getDateString(ele.ctime * 1000),
                        comment:ele.comments
                    };
                    temp.push(obj);
                });
                this.commentList = temp;

            }).catch((err)=>{
                console.log(err)
            })
        }
    }
});

const searchBar = new Vue({
    el:'#search_bar',
    data:{
        searchWord:''
    },
    methods:{
        searchArticle(){

            if(this.searchWord  === ''){
                location.href ='/';
            }else{
                location.href ='/?s=' + this.searchWord;
            }

        }
    }
});


Vue.component('page-tool',{
    props:{
        count:Number,
        pagesize:Number,
        searchword:String,
        page:Number,
    },
    computed:{
        totalPage(){
            let totalPage = 0;
            if(this.count % this.pagesize !== 0){
                totalPage = parseInt(this.count / this.pagesize )+ 1
            }else{
                totalPage = parseInt(this.count / this.pagesize )
            }
            return totalPage;
        }
    },
    methods:{
        onpageChange(index){
            let currentPage = this.page;
            if(index === currentPage){
                return
            }
            if(index === '++'){
                currentPage ++;
            }else if(index === '--'){
                currentPage --;
            }else{
                currentPage = index;
            }

            if( this.searchword === ''){
                this.$emit('pagechange',currentPage, this.pagesize);
            }else{

            }

        }
    },
    template: `
    <div class="turn-page-wrap" v-if="totalPage > 1">
        <button class="prev" v-show="page > 1" @click="onpageChange('--')">上一页</button>
        <button class="first-page" v-show="page -2 > 1 && page != 1" :class="{active:page === 1}" @click="onpageChange(1)">1</button>
        <button class="prev-ellipsis" v-show="page -2 > 2">...</button>
        <button class="main-btn" v-for="(item,index) in 5" :key="index" :class="{active:page === page -2 + index}"
                v-show="page -2 + index > 0 && page -2 + index <= totalPage" @click="onpageChange(page -2 + index)"
                >{{page -2 + index}}</button>
        <button class="next-ellipsis" v-show ="totalPage- page > 3">...</button>
        <button class="last-page" v-show="page + 2 < totalPage" :class="{active:page === totalPage}"
            @click="onpageChange(totalPage)">{{totalPage}}</button>
        <button class="next" v-show ="page < totalPage " @click="onpageChange('++')">下一页</button>
    </div>
    `
});