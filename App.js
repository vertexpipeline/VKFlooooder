'use strict';

let vkBot = require('node-vk-bot');
let sleep = require('msleep');

const bot = new vkBot.Bot({
    token: '25f3d9bf2162d0c9c7178e2287316f5ed9fe0b0baf2bb6deff390c9e5f05e2bb58735049715d55e7cab6d',
    prefix: /./
}).start();

let procedPosts = [];
let posts = [];

function msleep(e){for(var o=new Date;(new Date).getTime()<o.getTime()+e;);}function isNode(){return"undefined"!=typeof module&&"undefined"!=typeof module.exports}isNode?module.exports=msleep:window.msleep=msleep;

function continueProcPost(){
    msleep(500);
    if (posts.length > 2) {
        posts.splice(0, 1);
        procPost(posts);
    } else if (posts.length === 1) {
        procPost(posts)
    } else {
        checkWall();
    }
}

function procPost() {
    let post = posts[0];
    let id = post.post_id;

    if (procedPosts.indexOf(id) == -1 && post.type == "post") {
        console.log("Найден новый пост, флудим...");
        bot.api("wall.createComment", {
            owner_id: post.source_id,
            post_id: post.post_id,
            message: "Пройдите опрос по беспроводной передаче данных. Спасибо.",
            attachments: "https://docs.google.com/forms/d/e/1FAIpQLSfh801Nndk6VElU1A4SNDUINeNOd011htu41DY45dc-tYcOyA/viewform?usp=sf_link"
        }).then(res => {
            console.log("Пост обработан ");
            procedPosts.push(id);
            continueProcPost();
        }).catch(error=>{
            console.log(error.error_msg);
        });
    }else{
        continueProcPost()
    }
}

function checkWall() {
    bot.api("newsfeed.get").then(res => {
        posts = res.items;
        procPost();
        msleep(1000)
    });
}

checkWall();

