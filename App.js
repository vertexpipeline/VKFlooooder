'use strict';

let vkBot = require('node-vk-bot');

const bot = new vkBot.Bot({
    token: '25f3d9bf2162d0c9c7178e2287316f5ed9fe0b0baf2bb6deff390c9e5f05e2bb58735049715d55e7cab6d',
    prefix: /./
}).start();

let procedPosts = [];

function procPost(posts){
        let post = posts[0];
        let id = post.post_id;
        if (procedPosts.indexOf(id) == -1 && post.type == "post") {
            bot.api("wall.createComment", {
                owner_id: post.source_id,
                post_id: post.post_id,
                message: "Пройдите опрос по беспроводной передаче данных. Спасибо. ",
                attachments: "https://docs.google.com/forms/d/e/1FAIpQLSfh801Nndk6VElU1A4SNDUINeNOd011htu41DY45dc-tYcOyA/viewform?usp=sf_link"
            }).then(res => {
                procedPosts.push(post.post_id);
                console.log("1 request was proced " + post.post_id)
                setTimeout(out => {
                    if(posts.length > 2){
                        posts.splice(1, 1);
                        procPost(posts);
                    }else if(posts.length() === 1){
                        procPost(posts)
                    }else{
                        checkWall();
                    }
                }, 500);
            }).catch(error => {
                console.log("1 request was raised");
                setTimeout(out => {
                    procPost(posts)
                }, 3000);
            })
        }
}

function checkWall() {
    console.log("Checking");
    bot.api("newsfeed.get").then(res => {
        procPost(res.items);
    });
}

checkWall();

