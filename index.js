const express = require('express');
const globalConfig = require('./config');
const loader =  require('./loader');
const app = new express();


app.use(express.static('./page/'));

//set middleware
app.post('/edit_every_day',loader.get('/edit_every_day'));
app.get('/query_every_day',loader.get('/query_every_day'));

app.post('/edit_article',loader.get('/edit_article'));
app.get('/query_article_by_page',loader.get('/query_article_by_page'));
app.get('/query_article_count',loader.get('/query_article_count'));
app.get('/query_article_count_with_tag',loader.get('/query_article_count_with_tag'));
app.get('/query_article_by_id',loader.get('/query_article_by_id'));
app.get('/query_article_by_tag',loader.get('/query_article_by_tag'));
app.get('/query_hot_article',loader.get('/query_hot_article'));

app.get('/search_article',loader.get('/search_article'));
app.get('/search_article_count',loader.get('/search_article_count'));

app.post('/update_article_views',loader.get('/update_article_views'));

app.post('/post_comment',loader.get('/post_comment'));
app.get('/query_random_captcha',loader.get('/query_random_captcha'));
app.get('/query_comment_list',loader.get('/query_comment_list'));
app.get('/query_comment_count',loader.get('/query_comment_count'));
app.get('/query_new_comment',loader.get('/query_new_comment'));

app.get('/query_random_tags',loader.get('/query_random_tags'));


app.listen(globalConfig.port,function(){
    console.log('server activated');
});

