let express = require('express'),
    app = express(),
    port = process.env.PORT || 8050,
    path = require('path'),
    htmlRouters = require(path.join(__dirname+'/app/routing/htmlRoutes.js')),
    apiRouters = require(path.join(__dirname+'/app/routing/apiRoutes.js'));

app.use(express.static('app'));
app.use('/', htmlRouters);
app.use('/api', apiRouters);

let  server = app.listen(port, function(){
    let port = server.address().port;
    console.log("Friend Finder app listening on port %s",+port);
});
