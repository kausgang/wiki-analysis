var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var https = require('https');
var path = require('path');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

    var url = req.query.url;
    var section_number = req.query.section_number;

    get_section(url,section_number,res);

    // res.send('respond with a resource');
});

function get_section(url,section_number,res) {


    var wikipedia_url = url;
    var section = Number(section_number)+1;



//EZTRACT TITLE
//get the last position of /
    var start = wikipedia_url.lastIndexOf('/');
//get title
    var end = wikipedia_url.length;
    var title = wikipedia_url.slice(start+1,end);


    if(section_number == -1){

        var url = "https://en.wikipedia.org/w/api.php?"+
            "action=parse"+
            "&page="+  title+
            "&format=json"+
            "&prop=text";
    }

    else{
        //FORM URL
        var url = "https://en.wikipedia.org/w/api.php?"+
            "action=parse"+
            "&page="+  title+
            "&format=json"+
            "&prop=text&section="+ section;



    }

    // console.log(url);

//check if folder with title name exists
//     fs.exists(title, function (exists) {
//
//         if (exists) {
//             // console.log(exists)
//         }
//         else {
//             fs.mkdir(title)
//         }
//     });

    function download_img(img_url,img_filename){

        //create file inside title folder
        var path_seperator = path.sep;
        filename = title+path_seperator+img_filename;
        //create the file & download content into the file
        var file = fs.createWriteStream(filename);
        https.get(img_url,function (response) {
            response.pipe(file);
        });

    }

    function section_data_manipulation($){
        //REMOVE ALL LINKS
        $('a').each(function(){
            var link_html = $(this).html();
            $(this).replaceWith(link_html);
        });

        // Remove references next to links
        $('sup').remove();
            //REMOVE ALL THE REFERENCE AT THE END OF PAGE
            //METHOD 1 .. SEARCH ALL CITE_NOTE_**** ID ELEMENTS & REMOVE THEM
            //EXAMPLE
            // <ol class="references">
            //      <li id="cite_note-FOOTNOTEPetragliaAllchin20076-1"><span class="mw-cite-backlink"><b>^</b></span> <span class="reference-text">Petraglia, Allchin &amp; 2007, p.&#xA0;6.</span></li>
            //      <li id="cite_note-FOOTNOTESingh2009545-28"><span class="mw-cite-backlink">^   </span> <span class="reference-text">Singh 2009, p.&#xA0;545.</span></li>
            //     <li id="cite_note-FOOTNOTEStein199898&#x2013;99-29"><span class="mw-cite-backlink"><b>^</b></span> <span class="reference-text">Stein 1998, pp.&#xA0;98&#x2013;99.</span></li>
            // </ol>
            //USE WILDCARD
            //$('[id^=cite_note]').remove();

        //METHOD 2
        $('.references').remove();

        //DOWNLOAD IMAGE
        $('img').each(function () {
            //get the url for image
            var img = $(this).attr('src');

            //extract the filename
            var img_filename = img.slice(img.lastIndexOf('/')+1,img.length);

            //form the proper url
            var img_url = "https:"+img;

            //download image
            // download_img(img_url,img_filename);

            //replace image source with locally downloaded image
            $(this).attr('src',img_url);

        });

        return $;
    }

//REQUEST VIA HTTP GET
    request.get(url, function(err,responsecode,body) {


        if(err)throw err;

        //PARSE THE DATA INTO JSON OBJECT .. AS JSON OBJECT IS RETURNED BY WIKIPEDIA
        body = JSON.parse(body);


        console.log(body);

        //IF SECTIONING IS NOT DONE PROPERLY FOR THE MAIN WIKIPEDIA PAGE
        // FOR EXAMPLE https://en.wikipedia.org/wiki/St_Peter%27s_Basilica
        if('error' in body){

            var section_error = "This wikipedia page doesn't allow section display<p class='section_display_error' color='red'>Wikipedia errorcode:- "+body.error.code
            res.send(section_error);

        }
        else{

            //because of the structure of the json object...the main data is held inside parse => test => *
            var key = body.parse.text;
            var $ = cheerio.load(key['*']);

            //DISABLE FORMATTING (if needed) by commenting out below line
            $ = section_data_manipulation($);

            //read the file completely before moving on to write it
            // var js_content = fs.readFileSync('jquery.js');

            //append content
            var html_data = $.html();

            /*
            var final_content = html_data+"\n"+js_content.toString();

            //write content into file
            var path_seperator = path.sep;
            filename = title + path_seperator + "section_" + section + ".html";
            fs.writeFile(filename,final_content,function (err) {
                console.log(err);
            });
    */
            //console.log(final_content);


            res.send(html_data);
        }



    });



}

module.exports = router;
