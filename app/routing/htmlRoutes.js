module.exports = (function(){
    'use strict';
    //define router and path
    let router = require('express').Router(),
        path = require('path');

    // router get method for home url i.e http://127.0.0.1:8000/
    router.get('/',function(req,res){
        //return html file ..app/public/home.html
        res.sendFile(path.join(__dirname, '../public/home.html'));
    });

    //router get method for survey, will be tyrigger if user click on Go to Survey
    router.get('/survey',function(req,res){
        //return html file ..app/public/survey.html
        res.sendFile(path.join(__dirname, '../public/survey.html'));
    });

    return router;
})();
