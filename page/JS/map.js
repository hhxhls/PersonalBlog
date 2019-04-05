const newArticle = new Vue({
    el:'#new_article',
    data:{
        limit: 30,
        newArticle : []
    },
    created(){
        this.getNewList();
    },
    methods:{
        getNewList(){
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
                console.log(temp);
                this.newArticle = temp;

            }).catch((err)=>{
                console.log(err)
            })
        }
    }
});