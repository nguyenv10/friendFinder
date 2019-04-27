module.exports = (function(){
    'use strict';
    let router = require('express').Router(),
        path = require('path'),
        fs = require('fs'),
        bodyParser = require('body-parser'),
        urlEncodeParser = bodyParser.urlencoded({extended: true});
    //router get method for list of friend url i.e http://127.0.0.1:8000/api/friends
    router.get('/friends',function(req,res){
        res.json(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/friends.js'))));
    });

    //router post method for search for friend and store data
    router.post('/friends',urlEncodeParser,function(req,res){

        /**
         * Variable declaration where data will be used to store list of all data
         * Form data will store into name, photo and scores
         * Best match will store into friend
         */
        let datas = {
            friends: []
        },
            name = req.body.name,
            photo = req.body.photo,
            scores = req.body.scores,
            file = path.join(__dirname, '../data/friends.js'),
            friend = {
                name:  '',
                photo: '',
                status: 0

            },
            sum = 1000;

        //if friends.js file is available under app/data
        if(fs.existsSync(file)){
            //Read data file
            fs.readFile(file, function readFileCallback(err, data){
                if(err)
                    console.log(err);
                else{
                    //If there is no data in the file
                    if(data == ""){
                        //Put form data into data
                        datas.friends.push({name: name, photo: photo, scores:scores});
                        var jsonData = JSON.stringify(datas);
                        //Store data into file
                        fs.writeFile(file,jsonData, function(err){
                            if(err)
                                throw err;
                        });
                        //Make friend status 0 to show the message no result found, as this is first record.
                        friend.status = 0;
                        res.json(friend)
                    }else{
                        //If data is available in the file
                        datas = JSON.parse(data);
                        //Go through each record
                        for(let ind in datas.friends){
                            /*
                            * Let take ith record as current
                            */
                            let currentFriend = datas.friends[ind],
                                score = currentFriend.scores,
                                i = 0,
                                diffSum = 0;

                            //Loop through both score and take the absolute value of the score and sum.
                            for(i = 0; i< score.length; i++){
                                diffSum = diffSum + Math.abs(parseInt(score[i]) - parseInt(scores[i]));
                            }
                            /*
                            * First lets the sum is a big number. and friend is empty
                            * If the sum of their difference is less than the sum, update sum with the current difference sum
                            * update friend with the currentFriend(i th record of the records)
                            **/
                            if(diffSum < sum){
                                sum = diffSum;
                                friend.name = currentFriend.name;
                                friend.photo = currentFriend.photo;
                            }
                        };

                        //Append form data into datas
                        datas.friends.push({name: name, photo: photo, scores:scores});
                        var jsonData = JSON.stringify(datas);

                        //Store data into file
                        fs.writeFile(file,jsonData, function(err){
                            if(err)
                                throw err;
                        });

                        //If friend found
                        if(friend.name != ""){
                            //Make the friend status true
                            friend.status = 1;
                            res.json(friend)
                        }else{
                            //If friend not found make the friend status false
                            friend.status = 0;
                            res.json(friend)
                        }
                    }
                }
            });
        }else{
            //If friends.js file is not available under app/data
            //Put data into the datas variable.
            datas.friends.push({name: name, photo: photo, scores:scores});
            var jsonData = JSON.stringify(datas);

            //friends.js file will be created and record will be stored in the file.
            fs.writeFile(file,jsonData, function(err){
                if(err)
                    throw err;
            });
            //Make friend status 0 to show the message no result found, as this is first record.
            friend.status = 0;
            res.json(friend)
        }


    });

    return router;
})();

