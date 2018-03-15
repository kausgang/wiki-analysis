var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var path = require('path');


var express = require('express');
var router = express.Router();




/* GET users listing. */
router.get('/', function(req, res, next) {

    // res.send('respond with a resource');


    var url = req.query.url;

    get_toc(url,res);




    // res.render('testing');

});


function get_toc(url,res) {

    function final_toc_element() {
        var section_number;
        var section_header;
        var parent_section_number;
    }



    request.get(url, function (err, res_code, body) {

        var final_toc = [];

        var $ = cheerio.load(body);

        var toc = $('#toc');
        var data1 = (toc.children('ul')).text();

        data1 = data1.split(/\n/);

        var data2 = [];
        for (i = 0; i < data1.length; i++) {

            if (data1[i] != "") {
                data2.push(data1[i]);
            }
        }

        var data3 = [];
        for (i = 0; i < (data2.length - 1); i++) {
            var start = 0;
            var end = data2[i].indexOf(' ');

            //HOLD THE NUMBERS
            data3[i] = data2[i].slice(start, end);

            //HOLD THE HEADINGS
            var obj = new final_toc_element();
            obj.section_number = i;
            obj.section_header = data2[i].slice(end + 1, data2[i].length);

            final_toc[i] = obj;
        }

        //count number of .
        var count = 0;
        //markers
        var a1, a2, a3, a4, a5, a6, a7, a8, a9, a10 = 0;
        for (i = 0; i < data3.length; i++) {
            for (j = 0; j < data3[i].length; j++) {
                if (data3[i].charAt(j) == '.') {
                    count++;
                }
            }
            //console.log(data3[i]+"\t\t"+count);
            if (count == 0) {
                final_toc[i].parent_section_number = -1; // -1 denotes root element
                a1 = a2 = a3 = a4 = a5 = a6 = a7 = a8 = a9 = a10 = i;
            }
            if (count == 1) {
                final_toc[i].parent_section_number = final_toc[a1].section_number;
                a2 = a3 = a4 = a5 = a6 = a7 = a8 = a9 = a10 = i;
            }
            if (count == 2) {
                final_toc[i].parent_section_number = final_toc[a2].section_number;
                a3 = a4 = a5 = a6 = a7 = a8 = a9 = a10 = i;
            }
            if (count == 3) {
                final_toc[i].parent_section_number = final_toc[a3].section_number;
                a4 = a5 = a6 = a7 = a8 = a9 = a10 = i;
            }
            if (count == 4) {
                final_toc[i].parent_section_number = final_toc[a4].section_number;
                a5 = a6 = a7 = a8 = a9 = a10 = i;
            }
            if (count == 5) {
                final_toc[i].parent_section_number = final_toc[a5].section_number;
                a6 = a7 = a8 = a9 = a10 = i;
            }
            if (count == 6) {
                final_toc[i].parent_section_number = final_toc[a6].section_number;
                a7 = a8 = a9 = a10 = i;
            }
            if (count == 7) {
                final_toc[i].parent_section_number = final_toc[a7].section_number;
                a8 = a9 = a10 = i;
            }
            if (count == 8) {
                final_toc[i].parent_section_number = final_toc[a8].section_number;
                a9 = a10 = i;
            }
            if (count == 9) {
                final_toc[i].parent_section_number = final_toc[a9].section_number;
                a10 = i;
            }
            if (count == 10) {
                final_toc[i].parent_section_number = final_toc[a10].section_number;
            }
            count = 0
        }

        // console.log(final_toc);



        //format the final_toc object in a string & write it to a json file
        var data = {

            nodes:[],
            links:[]
        };

        //create root node
        data.nodes[0] = { section_number: -1 };

        for(var i = 0; i < final_toc.length ; i++){

            data.nodes[i+1] = {
                section_number: final_toc[i].section_number,
                section_header: final_toc[i].section_header,
                parent_section_number: final_toc[i].parent_section_number
            };
            data.links[i] = {
                source: final_toc[i].section_number,
                target : final_toc[i].parent_section_number
            }
        }

        // console.log(data)

        // fs.writeFileSync('data.json', JSON.stringify(data, null, 2) , 'utf-8');
        //save the data.json file in public/D3 folder


        // console.log(__dirname);
        var filename = path.join(__dirname,'../public/data.json');

        //write the json file for wikipedia toc
        fs.writeFileSync(filename, JSON.stringify(data, null, 2) , 'utf-8');

        //send an empty string as I'll not be using the response from this function.
        // a static html page will be loaded. that static page will use the dynamic json data

        // res.send('');
        res.render('d3');



    });


}








module.exports = router;
