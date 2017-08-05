'use strict';

let vkBot = require('node-vk-bot');

let config = require('./config.json');

const bot = new vkBot.Bot({
    token: config.api_key,
    prefix: /./
}).start();

let procedPosts = [];
let posts = [];

function msleep(e){for(var o=new Date;(new Date).getTime()<o.getTime()+e;);}function isNode(){return"undefined"!=typeof module&&"undefined"!=typeof module.exports}isNode?module.exports=msleep:window.msleep=msleep;

function continueProcPost(){
    msleep(config.hold_time_ms);
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
        let name = post.text.slice(0,10)
        console.log(`>>New post "${name}${name == post.text?"":"..."}" was found`);
        bot.api("wall.createComment", {
            owner_id: post.source_id,
            post_id: post.post_id,
            message: config.message.text,
            attachments: config.message.attachments
        }).then(res => {
            console.log("<<Post was proced");
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
        msleep(config.refresh_time_ms)
    });
}

bot.api('users.get').then(res=>{
    console.log(`Staring at profile ${res[0].first_name} ${res[0].last_name}`);
    console.log(`Delay of every comment is ${config.hold_time_ms} ms`);
    console.log(`Flooder checks wall posts after ${config.refresh_time_ms} ms`);
    console.log(`Posts "${config.message.text}" with "${config.message.attachments}" attachments.`);
    checkWall();
});

