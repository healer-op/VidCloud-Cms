// 📦 Packages
const cheerio = require("cheerio");
const axios = require("axios");
const express = require('express')
const cors = require('cors')
const fetch = require("node-fetch");
const app = express()
require('dotenv').config()

// 🧰 Utils
const port = process.env.PORT || 3000;

//Links
let urdomain = `${process.env.YOUR_DOMAIN_WITH_HTTP}`;
let urdomain1 = `${process.env.YOUR_DOMAIN_WITH_HTTPS}`;
let domain = `https://vidcloud.uno`;

// 🛣️ Routes
app.set('view engine', 'ejs')
app.use(express.static('public'))

///////////////////////////////////////// EJS FETCHING //////////////////////////////////////////////////////////////////////////////////

app.get("/", async function(req, res) {
    const res1 = await fetch(`${urdomain}/api/recent`);
    const datar = await res1.json();
    const res2 = await fetch(`${urdomain}/api/series`);
    const datas = await res2.json();
    const res3 = await fetch(`${urdomain}/api/cinema`);
    const datac = await res3.json();
    res.render("home", {datar , datas , datac});
});


app.get("/v/:li", async function(req, res) {
    var li = req.params.li;
    var tli = li;
    const res1 = await fetch(`${urdomain}/api/video/${li}`);
    const datav = await res1.json();
    res.render("watch", {datav,tli});
});


app.get("/search", async function(req, res) {
    var tli = req.query.s;
    // console.log(tli);
    const res1 = await fetch(`${urdomain}/api/search/${tli}`);
    const datasr = await res1.json();
    res.render("search", {datasr,tli});
});





////////////////////////////////////////// API ///////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////// API RULES

var whitelist = [`${urdomain}`,`${urdomain1}`]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

///////////////////////////////////////////// MADE BY HEALER

///////////////////////////////////////////// HOME PAGE
app.get('/api',cors(corsOptionsDelegate), (req, res) => {

    res.send(` VidCloudApi📺 <br>
    <p>Made By https://github.com/healer-op</p>
    <hr>
    🧯Recent : /v <br>
    >>>>>>>>>Example : <a href="/api/recent">Click Me</a> <br>
    🧯TvSeries : /v/series <br>
    >>>>>>>>>Example : <a href="/api/series">Click Me</a> <br>
    🧯Cinema : /v/cinema <br>
    >>>>>>>>>Example : <a href="/api/cinema">Click Me</a> <br>
    🧯Search : /v/search/:searchterm <br>
    >>>>>>>>>Example : <a href="/api/search/james">Click Me</a> <br>
    🧯VideoLink : /v/video/:li <br>
    >>>>>>>>>Example : <a href="/api/video/the-ice-age-adventures-of-buck-wild/">Click Me</a> <br>
    🧯Related : /v/related/:li <br>
    >>>>>>>>>Example : <a href="/api/related/the-ice-age-adventures-of-buck-wild/">Click Me</a> <br>
    <hr>
`)
})

/////////////////////////////////////////////  RECENT ON VIDCLOUD

app.get('/api/recent',cors(corsOptionsDelegate), (req, res) => {
    var data=[];
    
    axios.get(`${domain}`).then(urlResponse =>{
        const $ = cheerio.load(urlResponse.data);
        $('div.col-md-2.col-sm-6.col-xs-6.item.responsive-height.post').each((i,element) =>{
            data.push({
                link: $(element).find('h3').find('a').attr('href').split(`${domain}/video/`)[1],
                title: $(element).find('h3').text(),
                img: $(element).find('img').attr('src')  
            });
        });
    })
    .then(() => {
        res.send(data);
    })

})

////////////////////////////////////////////////////////////// VID CLOUD TV SERIES

app.get('/api/series',cors(corsOptionsDelegate), (req, res) => {
    var data=[];
    
    axios.get(`${domain}/series`).then(urlResponse =>{
        const $ = cheerio.load(urlResponse.data);
        $('div.col-md-2.col-sm-6.col-xs-6.item.responsive-height.post').each((i,element) =>{
            data.push({
                link: $(element).find('h3').find('a').attr('href').split(`${domain}/video/`)[1],
                
                title: $(element).find('h3').text(),

                img: $(element).find('img').attr('src')

            });
        });
    })
    .then(() => {
        res.send(data);
    })

})

////////////////////////////////////////////////////////////// VID CLOUD CINEMA

app.get('/api/cinema',cors(corsOptionsDelegate), (req, res) => {
    var data=[];
    
    axios.get(`${domain}/cinema-movies`).then(urlResponse =>{
        const $ = cheerio.load(urlResponse.data);
        $('div.col-md-2.col-sm-6.col-xs-6.item.responsive-height.post').each((i,element) =>{
            data.push({
            link: $(element).find('h3').find('a').attr('href').split(`${domain}/video/`)[1],
            title:  $(element).find('h3').text(),
            img: $(element).find('img').attr('src')
            });
        });
    })
    .then(() => {
        res.send(data);
    })

})

////////////////////////////////////////////////////////////// VID CLOUD SEARCH

app.get('/api/search/:searchterm',cors(corsOptionsDelegate), (req, res) => {
    var li = req.params.searchterm;
    var data=[];
    
    axios.get(`${domain}/?s=${li}`).then(urlResponse =>{
        const $ = cheerio.load(urlResponse.data);
        $('div.item.responsive-height.col-md-4.col-sm-6.col-xs-6').each((i,element) =>{
            data.push({
                link: $(element).find('h3').find('a').attr('href').split(`${domain}/video/`)[1],
                title: $(element).find('h3').text(),
                img: $(element).find('img').attr('src')
            });
        });
    })
    .then(() => {
        res.send(data);
    })

})

////////////////////////////////////////////////////////////// VID CLOUD VIDEO LINK

app.get('/api/video/:li',cors(corsOptionsDelegate), async (req, res) => {
    var li = req.params.li;
    var lis = li;


    // 🔴 Note** Have to pass bash64 encode link like 
    // for example : /v/video/aHR0cHM6Ly92aWRjbG91ZC51bm8vdmlkZW8vYml0Y2hpbi10aGUtc291bmQtYW5kLWZ1cnktb2Ytcmljay1qYW1lcy8=
    // Go to https://www.base64encode.org/ an type this (aHR0cHM6Ly92aWRjbG91ZC51bm8vdmlkZW8vYml0Y2hpbi10aGUtc291bmQtYW5kLWZ1cnktb2Ytcmljay1qYW1lcy8=)
    // You Will Understand Everything


    var data=[];
    
        axios.get(`${domain}/video/${lis}`).then(urlResponse =>{
        const $ = cheerio.load(urlResponse.data);
        $('body').each((i,element) =>{
            data.push({
                title: $('body > div.container > div > div.col-md-8.col-sm-12.main-content > div.video-info.small > h1').text(),
                img: $('head > meta:nth-child(15)').attr('content'),
                link: $('iframe').attr('src')
            });
        });
    })
    .then(() => {
        res.send(data);
    })

})

////////////////////////////////////////////////////////////// VID CLOUD VIDEO RELATED

app.get('/api/related/:li', cors(corsOptionsDelegate), (req, res) => {
    var li = req.params.li;
    var lis = li;

    // 🔴 Note** Have to pass bash64 encode link like 
    // for example : /v/related/aHR0cHM6Ly92aWRjbG91ZC51bm8vdmlkZW8vYml0Y2hpbi10aGUtc291bmQtYW5kLWZ1cnktb2Ytcmljay1qYW1lcy8=
    // Go to https://www.base64encode.org/ an type this (aHR0cHM6Ly92aWRjbG91ZC51bm8vdmlkZW8vYml0Y2hpbi10aGUtc291bmQtYW5kLWZ1cnktb2Ytcmljay1qYW1lcy8=)
    // You Will Understand Everything

    var data=[];
    
    axios.get(`${domain}/video/${lis}`).then(urlResponse =>{
        const $ = cheerio.load(urlResponse.data);
        $('div.col-md-2.col-sm-2.col-xs-12.item.responsive-height').each((i,element) =>{
            data.push({
                link: $(element).find('h3').find('a').attr('href').split(`${domain}/video/`)[1],
                title: $(element).find('h3').text(),
                img: $(element).find('img').attr('src')
            });
        });
    })
    .then(() => {
        res.send(data);
    })

})

////////////////////////////////////////////////////////////// THANKS FOR USING API

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log('MADE BY HEALER')
  })