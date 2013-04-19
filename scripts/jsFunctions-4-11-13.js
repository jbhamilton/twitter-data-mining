//function to listen for jquery datepicker plugin
$(function() {
//    $(".datepicker").datepicker({ dateFormat:'D, dd M yy'});
    $(".datepicker").datepicker({altField:'#startDate',altFormat:'@',dateFormat:'D, dd M yy'});
    $(".datepickerEndDate").datepicker({altField:'#endDate',altFormat:'@',dateFormat:'D, dd M yy'});
})

$(document).ready(function(){
    $('h1').live('click',function(){
//        alert($('input[name="startDate"]').val());
        alert($('#startDate').val());
        alert($('#endDate').val());
    })

})

//This is the Control module. 
//In it we listen for our view changing methods
//set the current active tag
//set the current page view
//and store data
var viewControl = {
    //active - tag(s) being viewed
    active : undefined,
    //section of the page being viewed {tags,links,tweets}
    viewing : undefined,
    //data for each tag(s)
    both_data : undefined,
    ows_data : undefined,
    anon_data : undefined,
    //all tags data
    both_tags : undefined,
    both_links : undefined,
    both_tweets : undefined,
    both_users : undefined,
    //ows tag data
    ows_tags : undefined,
    ows_links : undefined,
    ows_tweets : undefined,
    ows_users : undefined,
    //anon tag data
    anon_tags : undefined,
    anon_links : undefined,
    anon_tweets : undefined,
    anon_users : undefined,

    //initiliaze our view once the document is ready
    initView : function(){
        $(document).ready(function(){
            viewControl.setView();
        });
    }(),//initView
    //generic method to set the current view from anywhere in the application
    setView : function(){
        var active = $('#viewControl').children('.selected').attr('id');
        viewControl.active = active;
        var view = $('#controls').children('.selected').attr('id');
        viewControl.viewing = view;
    },//setView
    //generic method to store the data that is being viewed 
    //before we request new information from the server
    storeData : function(){
        if(this.active == 'All'){
            if(this.viewing == 'conTags'){
                var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html() + $('#gut').children().eq(2).clone().wrap('<div>').parent().html();
                this.both_tags = store;
            }//if
            else if(this.viewing == 'conLinks'){
               var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html(); 
               this.both_links = store;
            }//elif
            else if(this.viewing == 'conUsers'){
               var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html(); 
               this.both_users = store;
            }//elif
            else {
               var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html(); 
               this.both_tweets = store;
            }//else
        }//if
        else if(this.active == 'ows'){
            if(this.viewing == 'conTags'){
                var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html() + $('#gut').children().eq(2).clone().wrap('<div>').parent().html();
                this.ows_tags = store;
            }//if
            else if(this.viewing == 'conLinks'){
               var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html(); 
               this.ows_links = store;
            }//elif
            else if(this.viewing == 'conUsers'){
               var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html(); 
               this.ows_users = store;
            }//elif
            else {
               var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html(); 
               this.ows_tweets = store;
            }//else
        }//elif
        else {
            if(this.viewing == 'conTags'){
                var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html() + $('#gut').children().eq(2).clone().wrap('<div>').parent().html();
                this.anon_tags = store;
            }//if
            else if(this.viewing == 'conLinks'){
               var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html(); 
               this.anon_links = store;
            }//elif
            else if(this.viewing == 'conUsers'){
               var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html(); 
               this.anon_users = store;
            }//elif
            else {
               var store = $('#gut').children().eq(1).clone().wrap('<div>').parent().html(); 
               this.anon_tweets = store;
            }//else
        }//elif

    },//storeData

    //method for changing the date range of data that is being viewed
    changeDate : function(){
        $('#filter').live('click',function(){
            
            if($('input[name=startDate]').val()!=''){  
                var startDate =  parseInt($('#startDate').val().toString().substr(0,10));
                //subtract 18000 or 5 hours to start from midnight
                viewControl.startDate = startDate - 18000;
            }//if
            if($('input[name=endDate]').val()!=''){  
                //add 68399 to get 23:59 of that date aka end of the day
                var endDate = parseInt($('#endDate').val().toString().substr(0,10))
                viewControl.endDate = endDate + 68399;
            }//if
            if($('#sTime').val() != ''){
                var sTime = $('#sTime').val();
                var length = sTime.length;
                var time = sTime.substring(0,length-3);
                time = parseInt(time.replace(':',''));
                var preFix = sTime.substring(length-2,length);
                if(preFix == 'PM'){
                   time += 1200; 
                }//if
                viewControl.startTime = time;
            }//if
            if($('#eTime').val() != ''){
                var eTime = $('#eTime').val();
                var length = eTime.length;
                var time = eTime.substring(0,length-3);
                time = parseInt(time.replace(':',''));
                var preFix = eTime.substring(length-2,length);
                if(preFix == 'PM'){
                   time += 1200; 
                }//if
                viewControl.endTime = time;

            }//if


            if(viewControl.viewing == 'conLinks' || viewControl.viewing == 'conTweets'){
                $('#gut').children('div').eq(1).remove()
                $('#gut').children('div').after(viewControl.both_tags);
                $('#stats').empty();
                $('#dataBubbles').empty();
                $('#tagListing').empty();
                $('#controls').children('button').attr('class','BG');
                $('#conTags').attr('class','selected');
                viewControl.setView();

            }//if

            TF.request();
            viewControl.storeData();
        });//live
    }(),//changeDate

    //generic method to prepare the banner for each tag
    banner : function(json){
        var dateRange = '';
        if(viewControl.startDate !== undefined){
            dateRange += '<span>'+$('input[name=startDate]').val()+'</span>';
            if(viewControl.endDate === undefined){
                dateRange += '<span> - Now</span>';
            }//if
            else if($('input[name=endDate]').val()!=$('input[name=startDate]').val()){
                dateRange += '<span> - </span>';
            }//else
        }//if
        if(viewControl.endDate !== undefined){
            if($('input[name=endDate]').val()!=$('input[name=startDate]').val()){
                dateRange +='<span>'+$('input[name=endDate]').val()+'</span>';
                if(viewControl.startDate === undefined){
                    dateRange = '<span>All time - </span>' + dateRange;
                }//if
            }//if
        }//if
        if(dateRange != ''){
            $('#dateRange').html(dateRange);
        }//if

        var timeRange = '';
        if(viewControl.startTime !== undefined){
            timeRange += $('#sTime').val();
            if(viewControl.endTime === undefined){
                timeRange += " - 11:59 PM";
            }
        }//if
        if(viewControl.endTime !== undefined){
            if(viewControl.startTime === undefined){
                timeRange += '12:00 PM ';
            }//if
            timeRange += ' - <span>'+$('#eTime').val()+'</span>';
        }//if
        if(timeRange != ''){
            $('#timeRange').html(timeRange);
        }


        if(this.active == "All"){
            //add togethor the sum of both anon + ows
            //then subtract the number of instances both occured in the same tweet
            var all = json.data[0][2] + json.data[1][2];
            viewControl.allTweetsCount = all - json.data[0][1];
            $('#totalTweets').children('span').html(viewControl.allTweetsCount);
            var tagCount = json.data[0][1];
            $('#info').html('<span class="context">Context</span>: Tweets being analayzed are tweets that contained both the hashtag <span>#ows</span> and <span>#anonymous</span>');
        }//if
        else {
            var all = this.allTweetsCount; 
            var tagCount = json.data[0][1];
            if(this.active == 'ows'){
                $('#info').html('<span class="context">Context</span>: Tweets being analayzed are tweets that contained the hash tag <span>#ows</span>');
            }//if
            else{
                $('#info').html('<span class="context">Context</span>: Tweets being analayzed are tweets that contained the hash tag <span>#anonymous</span>');
            }//else

        }//else

        $('#viewingTweets').children('span').html(tagCount);
        $('#prcTweets').children('span').html(viewControl.round(tagCount/viewControl.allTweetsCount));

    },//banner 

    //listener for Both tags top control
    allListener : function(){
        $('#All').live('click',function(){
            viewControl.storeData();
            $('#viewControl').children('button').attr('class','BG');
            $(this).attr('class','selected');
            $('#controls').children('button').attr('class','BG');
            $('#conTags').attr('class','selected');

            viewControl.setView();
            viewControl.prepareNewTagSet();
            TF.setUp(viewControl.all_data);
           
        });//live
    }(),//allListener
    //listener for ows tag top control
    owsListener : function(){
        $('#ows').live('click',function(){
            viewControl.storeData();
            $('#viewControl').children('button').attr('class','BG');
            $(this).attr('class','selected');
            $('#controls').children('button').attr('class','BG');
            $('#conTags').attr('class','selected');

            viewControl.setView();
            viewControl.prepareNewTagSet();
            if(viewControl.ows_data === undefined){
                TF.request();
            }//if
            else{
                TF.setUp(viewControl.ows_data);
            }//else
           
        });//live
    }(),//owsListener
    //listener for anonymous tag top control
    anonListener : function(){
        $('#anonymous').live('click',function(){
            viewControl.storeData();
            $('#viewControl').children('button').attr('class','BG');
            $(this).attr('class','selected');
            $('#controls').children('button').attr('class','BG');
            $('#conTags').attr('class','selected');

            viewControl.setView();
            viewControl.prepareNewTagSet();
            if(viewControl.anon_data === undefined){
                TF.request();
            }//if
            else{
                TF.setUp(viewControl.anon_data);
            }//else

        });//live
    }(),//anonListener

    //generic method to prepare the gut(page) for a new tag(s)
    prepareNewTagSet : function(){
        if(viewControl.viewing == 'conTags'){
            $('#gut').children('div').eq(1).remove()
            $('#gut').children('div').eq(1).remove()
        }
        else{
            $('#gut').children('div').eq(1).remove()
        }//else

        //this is the html that comes pre-loaded in the index.html
        //we have to rebuild it in case user is not viewing the tags section
        var setup = '<div class="fivecol"><div id="view"><div id="stats"></div><div id="dataBubbles"></div></div></div>';
            setup += '<div class="fourcol last"><div id="tagList"></div></div>';
        $('#gut').children('div').after(setup);
    },//prepare

    //method to round out divisions for % 
    round : function(num){
        var multiple = Math.pow(10,4);
        return (Math.round(num * multiple)*100 / multiple) ;
    }//end round

}//end viewControl

//module to hold/build our tag list in tags
var tags = {
    //listener for changing the view to tags
    listen : function(){
        $('#conTags').live('click',function(){
            //if were already viewing tags do nothing
            if($(this).attr('class')=='selected'){
                return;
            }//if
            var that = this;
            tags.setUp(that);
        });
    }(),//listen

    //method to setup the gut for the tag list and our data bubbles
    setUp : function(that){
        //store the currently viewed data
        viewControl.storeData();
        //we know were not viewing the tags so remove the links or tweets
        $('#gut').children('div').eq(1).remove()

        //we don't need to test if the tags has been requested from the server
        //because we always start from tags, therefore its always going to be loaded if
        //we come back to the tags from any given view 
        if(viewControl.active == 'All'){
            $('#gut').children('div').after(viewControl.both_tags);
            $('#dataBubbles').empty();
            TF.build(viewControl.all_data);
        }//if
        else if (viewControl.active == 'ows'){
            $('#gut').children('div').after(viewControl.ows_tags);
            $('#dataBubbles').empty();
            TF.build(viewControl.ows_data);
        }//elif
        else {
            $('#gut').children('div').after(viewControl.anon_tags);
            $('#dataBubbles').empty();
            TF.build(viewControl.anon_data);
        }//else
        
        //make this button the selected one
        $('#controls').children('button').attr('class','BG');
        $(that).attr('class','selected');
        //set the new view
        viewControl.setView();


    },//setUp

    //this method is called from TF.setUp
    //it is passed the data that is received from TF.request on initial tag load
    currentTags : function(json){
        //clear tagList
        $('#tagList').empty();

        var i = 0
        var p = '';
        var header = '<div class="tagHeader">Tag <span>Total</span><span class="context">Context</span></div>';
        //build the tag list
        while(json.data[i]!==undefined){
            p += '<div id="'+json.data[i][0]+'Tag">'+json.data[i][0]+'<span class="totalCount">'+json.data[i][2]+'</span><span class="contextCount tagHere">'+json.data[i][1]+'</span></div>';
            i++;
        }//end while
        $('#tagList').append(header+'<div id="tagListing">'+p+'</div>');

    }//end currentTags
}//tags

//this is the links module.
//it makes the request for the links
//listens for the link button to be clicked
//and builds/formats the list of links
var links = {

    //listener for links button to be clicked
    listen : function(){
        $('#conLinks').live('click',function(){
            //if were already viewing links do nothing
            if($(this).attr('class')=='selected'){
                return;
            }//if

            var that = this;
            links.setUp(that);
        });
    }(),//listen
    
    //method to prepare the page for the links
    setUp : function(that){
        //store the data were currently viewing
        viewControl.storeData();

        //if for our active tab, links is undefined, make the request for the data
        if((viewControl.active == 'All' && viewControl.both_links === undefined)||
            (viewControl.active == 'ows' && viewControl.ows_links === undefined)||
            (viewControl.active == 'anonymous' && viewControl.anon_links === undefined)){
            //request the data
            links.request();
        }//if
        else{
            $('#gut').children('div').eq(1).remove();
            $('#gut').children('div').eq(1).remove();
            if(viewControl.active == 'All'){
                $('#gut').children('div').eq(0).after(viewControl.both_links);
            }//if
            else if(viewControl.active == 'ows'){
                $('#gut').children('div').eq(0).after(viewControl.ows_links);
            }//elif
            else{
                $('#gut').children('div').eq(0).after(viewControl.anon_links);
            }//else
        }//else

        $('#controls').children('button').attr('class','BG');
        $(that).attr('class','selected');
        viewControl.setView();

    },//setUp

    //format the received data to be put into the gut
    buildLinks : function(json){
        var i = 0;
        var p = '';
        var header = '<div class="tagHeader">Link <span>Total</span><span class="context">Context</span></div>';

        while(json.data[i] !== undefined){
            var url_idx = 0;
            if(json.data[i][0]=="") { 
                url_idx = 1;
            }
            p += '<div class="linkList lBG"><p class="singleLink"><a href="'+json.data[i][url_idx]+'" target="_blank">'+json.data[i][url_idx]+'</a></p>';
            p+='<p class="totalCount">'+json.data[i][3]+'</p><p class="contextCount">'+json.data[i][2]+'</p></div>';
            i++;
        }//end while

        //change the columns
        $('#gut').children().eq(1).remove();
        $('#gut').children().eq(1).remove();
        $('#gut').children('div').after('<div id="view" class="ninecol last"></div>');

        //set the links
        $('#view').html(header+p);

    },//end buildLinks

    //method to send our query to the server 
    //calls buildLinks after it has received the data
    request : function(){
        var q = '';
        if(viewControl.active == 'All'){
            q += "START twt=node(*),ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') "; 
            q+="MATCH twt-[l:LINKED]->lnk ";
            q+="WHERE ows<-[:TAGGED]-twt-[:TAGGED]->anon ";
        }//if
        else if(viewControl.active == 'ows'){
            q += "START twt=node(*),ows=node:tags(tag='ows') "; 
            q+="MATCH twt-[l:LINKED]->lnk ";
            q+="WHERE ows<-[:TAGGED]-twt ";
        }//elif
        else {
            q += "START twt=node(*),anon=node:tags(tag='anonymous') "; 
            q+="MATCH twt-[l:LINKED]->lnk ";
            q+="WHERE anon<-[:TAGGED]-twt ";
        }//elif


        //if the data has been set use it in the query
        if(viewControl.startDate !== undefined){
            q+= "AND twt.date > "+viewControl.startDate+" ";
        }//if
        if(viewControl.endDate !== undefined){
            q+= "AND twt.date < "+viewControl.endDate+" ";
        }//if
        if(viewControl.startTime !== undefined){
            q+= "AND twt.time >= "+viewControl.startTime+" ";
        }//if
        if(viewControl.endTime !== undefined){
            q+= "AND twt.time <= "+viewControl.endTime+" ";
        }//if


            q+="RETURN distinct lnk.link?,lnk.short,count(l) AS c,lnk.count ";
            q+="ORDER BY c DESC LIMIT 30";

        $.ajax({
            type:'POST',
            url:'http://localhost:7474/db/data/cypher',
            data: JSON.stringify({"query" : q,"params":{}}),
            contentType:"application/json",
            dataType:'json',
            success:function(json){
//                console.log(json);

                //pass the data to be formatted
                links.buildLinks(json);
            },//end success               
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                console.log(XMLHttpRequest);
            }

        });//end ajax
    }//end request


}//links

var users = {
    //listener for the users button to be clicked
    listen : function(){
        $('#conUsers').live('click',function(){
            //if Users is currently active do nothing
            if($(this).attr('class')=='selected'){
                return;
            }//if

            var that = this;
            users.setUp(that);
        });

    }(),//listen
    setUp : function(that){
        viewControl.storeData();
        //if for our active tab, tweets is undefined, make the request for the data
        if((viewControl.active == 'All' && viewControl.both_users === undefined)||
            (viewControl.active == 'ows' && viewControl.ows_users === undefined)||
            (viewControl.active == 'anonymous' && viewControl.anon_users === undefined)){

            if(viewControl.viewing == 'conTags'){
                $('#gut').children('div').eq(1).remove();
                $('#gut').children('div').eq(1).remove();
                $('#gut').children('div').after('<div id="view" class="ninecol last"></div>');
            }//if

            //request the tweets from the server
            users.request();
        }//if
        else{

             if(viewControl.viewing == 'conTags'){
                 $('#gut').children('div').eq(1).remove();
                 $('#gut').children('div').eq(1).remove();
             }//if
             else{
                 $('#gut').children('div').eq(1).remove();
             }//else

             var current;
             if(viewControl.active == 'All'){
                current = viewControl.both_users;
             }//if
             else if (viewControl.active == 'ows'){
                current = viewControl.ows_users;
             }//elif
             else {
                current = viewControl.anon_users;
             }//else

             $('#gut').children('div').eq(0).after(current);
        }//else

        //make this button active
        $('#controls').children('button').attr('class','BG');
        $(that).attr('class','selected');
        //set the current view
        viewControl.setView();

    },//setUp
    request : function(){
        var q = '';
        if(viewControl.active == 'All'){
            q = "START user=node(*),ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
            q += "MATCH user-[:TWEETED]->twt ";
            q += " WHERE ows<-[:TAGGED]-twt-[:TAGGED]->anon ";
        }//if
        else if(viewControl.active == 'ows'){
            q = "START tag=node(*),ows=node:tags(tag='ows') ";
            q += "MATCH user-[:TWEETED]->twt ";
            q += "WHERE ows<-[:TAGGED]-twt ";
        }//elif
        else {
            q = "START tag=node(*),anon=node:tags(tag='anonymous') ";
            q += "MATCH user-[:TWEETED]->twt ";
            q += "WHERE anon<-[:TAGGED]-twt ";
        }//elif

        //if the data has been set use it in the query
        if(viewControl.startDate !== undefined){
            q+= "AND twt.date > "+viewControl.startDate+" ";
        }//if
        if(viewControl.endDate !== undefined){
            q+= "AND twt.date < "+viewControl.endDate+" ";
        }//if
        if(viewControl.startTime !== undefined){
            q+= "AND twt.time >= "+viewControl.startTime+" ";
        }//if
        if(viewControl.endTime !== undefined){
            q+= "AND twt.time <= "+viewControl.endTime+" ";
        }//if



            q +="RETURN distinct user.name,COUNT(*) AS t ";
            q +="ORDER BY t DESC ";
            q +="LIMIT 30 ";
        $.ajax({
            type:'POST',
            url:'http://localhost:7474/db/data/cypher',
            data: JSON.stringify({"query" : q ,"params":{}}),
            contentType:"application/json",
            dataType:'json',
            success:function(json){
//                console.log(json);
                //build the tweets 
                users.buildUsers(json);
            },//end success               
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                console.log(XMLHttpRequest);
            }

        });//end ajax
    },//end request

    buildUsers : function(json){
        var p = "";
        for(var i=0;i<(json.data).length;i++){
            p += '<div class="singleTweet lBG">'+twts.parseURL(json.data[i][0])+'</div>';
        }//for

        $('#view').html(p);
    }//buildUsers


}//users

//this is the tweets module
//in it we listen for the tweets button to be clicked
//build/format the list of tweets
//and request our tweets from the server
var twts = {
    //listener for the tweets button to be clicked
    listen : function(){
        $('#conTweets').live('click',function(){
            //if tweets is currently active do nothing
            if($(this).attr('class')=='selected'){
                return;
            }//if

            var that = this;
            twts.setUp(that);
        });

    }(),//listen

    //method to setup the gut(page) for the tweets
    setUp : function(that){
        viewControl.storeData();

        //if for our active tab, tweets is undefined, make the request for the data
        if((viewControl.active == 'All' && viewControl.both_tweets === undefined)||
            (viewControl.active == 'ows' && viewControl.ows_tweets === undefined)||
            (viewControl.active == 'anonymous' && viewControl.anon_tweets === undefined)){

            if(viewControl.viewing == 'conTags'){
                $('#gut').children('div').eq(1).remove();
                $('#gut').children('div').eq(1).remove();
                $('#gut').children('div').after('<div id="view" class="ninecol last"></div>');
            }//if

            //request the tweets from the server
            twts.request();
        }//if
        else{

             if(viewControl.viewing == 'conTags'){
                 $('#gut').children('div').eq(1).remove();
                 $('#gut').children('div').eq(1).remove();
             }//if
             else{
                 $('#gut').children('div').eq(1).remove();
             }//else

             var current;
             if(viewControl.active == 'All'){
                current = viewControl.both_tweets;
             }//if
             else if (viewControl.active == 'ows'){
                current = viewControl.ows_tweets;
             }//elif
             else {
                current = viewControl.anon_tweets;
             }//else

             $('#gut').children('div').eq(0).after(current);
        }//else

        //make this button active
        $('#controls').children('button').attr('class','BG');
        $(that).attr('class','selected');
        //set the current view
        viewControl.setView();

    },//setUp

    //format the tweets and set them
    buildTwts : function(json){
        var p = '';

//         //here we go through the tweets and delete the duplicates
//         //using the levenshtein distance algorithm 
//         for(var x=0;x<(json.data).length;x++){
//             if(json.data[x] === undefined){ continue;}
//             for(var it=x;it<(json.data).length;it++){
//                 if(x==it){ continue;}
//                 if(json.data[x] === undefined){ continue;}
//                 if(json.data[it] === undefined){ continue;}
//                 var ld = stats.levenshtein_distance(json.data[x][0],json.data[it][0]);
//                 if(ld<30){
//                     delete json.data[it];
//                 }//if
//             }//for
//         }//for
       
        for(var i=0;i<(json.data).length;i++){
            if(json.data[i] === undefined){continue;}
            p += '<div class="singleTweet lBG">'+twts.parseURL(json.data[i][0])+'</div>';
        }//for

        $('#view').html(p);

    },//buildTwts

    //make the urls in the tweets a link
    parseURL : function(inc){
        return inc.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
                return url.link(url);
            });
    },//parseURL

    //method to send our query to the server for the tweets 
    //calls buildTwts after it has received the data
    request : function(){
        var q = '';
        if(viewControl.active == 'All'){
            q = "START tag=node(*),ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
            q += "MATCH tag<-[:TAGGED]-twt ";
            q += " WHERE ows<-[:TAGGED]-twt-[:TAGGED]->anon AND twt.text =~ '^RT\\\\s+.*$' ";
        }//if
        else if(viewControl.active == 'ows'){
            q = "START tag=node(*),ows=node:tags(tag='ows') ";
            q += "MATCH tag<-[:TAGGED]-twt ";
            q += "WHERE ows<-[:TAGGED]-twt AND twt.text =~ '^RT\\s+.*$' ";
        }//elif
        else {
            q = "START tag=node(*),anon=node:tags(tag='anonymous') ";
            q += "MATCH tag<-[:TAGGED]-twt ";
            q += "WHERE anon<-[:TAGGED]-twt AND twt.text =~ '^RT\\s+.*$' ";
        }//elif

        //if the data has been set use it in the query
        if(viewControl.startDate !== undefined){
            q+= "AND twt.date > "+viewControl.startDate+" ";
        }//if
        if(viewControl.endDate !== undefined){
            q+= "AND twt.date < "+viewControl.endDate+" ";
        }//if
        if(viewControl.startTime !== undefined){
            q+= "AND twt.time >= "+viewControl.startTime+" ";
        }//if
        if(viewControl.endTime !== undefined){
            q+= "AND twt.time <= "+viewControl.endTime+" ";
        }//if



            q +="RETURN distinct twt.text ";
            q +="LIMIT 30 ";
        $.ajax({
            type:'POST',
            url:'http://localhost:7474/db/data/cypher',
            data: JSON.stringify({"query" : q ,"params":{}}),
            contentType:"application/json",
            dataType:'json',
            success:function(json){
//                console.log(json);
                //build the tweets 
                twts.buildTwts(json);
            },//end success               
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                console.log(XMLHttpRequest);
            }

        });//end ajax
    },//end request
}//twts

var TF = {

    setUp : function(json){
        viewControl.banner(json);
        pie.setUpData(json);
        tags.currentTags(json);
        TF.build(json);

    },//setUp

    request : function(){
        var q = "";
        if(viewControl.active=="All"){
            q += "START twt=node(*),ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
            q+="MATCH twt-[:TAGGED]->tag ";
            q+="WHERE ows<-[:TAGGED]-twt-[:TAGGED]->anon ";

        }//if
        else if(viewControl.active=="ows"){
            q += "START twt=node(*),ows=node:tags(tag='ows') ";
            q+="MATCH twt-[:TAGGED]->tag ";
            q+="WHERE ows<-[:TAGGED]-twt ";

        }//elif
        else {
            q += "START twt=node(*),anon=node:tags(tag='anonymous') ";
            q+="MATCH twt-[:TAGGED]->tag ";
            q+="WHERE anon<-[:TAGGED]-twt ";

        }//elif

        if(viewControl.startDate !== undefined){
            q+= "AND twt.date >= "+viewControl.startDate+" ";
        }//if
        if(viewControl.endDate !== undefined){
            q+= "AND twt.date <= "+viewControl.endDate+" ";
        }//if
        if(viewControl.startTime !== undefined){
            q+= "AND twt.time >= "+viewControl.startTime+" ";
        }//if
        if(viewControl.endTime !== undefined){
            q+= "AND twt.time <= "+viewControl.endTime+" ";
        }//if

            q+="RETURN distinct tag.name,count(*) AS c,tag.count ";
            q+="ORDER BY c ";
            q+="DESC LIMIT 20"

         $.ajax({
             type:'POST',
             url:'http://localhost:7474/db/data/cypher',
             data: JSON.stringify({"query" : q,"params":{}}),
             contentType:"application/json",
             dataType:'json',
             success:function(json){
 //                console.log(json);
                 if(viewControl.active == 'All'){ 
                     viewControl.all_data = json;
                 }//if
                 else if(viewControl.active == 'ows'){
                     viewControl.ows_data = json;
                 }//elif
                 else{
                     viewControl.anon_data = json;
                 }//else
                 TF.setUp(json);
             },//end success               
             error: function (XMLHttpRequest, textStatus, errorThrown) {
                 alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                 console.log(XMLHttpRequest);
             }
 
         });//end ajax
    },//end request

    radiusScale : function(d){
        var radius = d3.scale.pow().exponent(0.8).domain([TF.build.min,TF.build.max]).range([TF.build.minR,TF.build.maxR]);
        return radius(d);
    },//end radiusScale

    buildNodes : function(data){
        var nodes = [];
        data.forEach(function(d){
                var node;
                node = {
                    tag : d[0],
                    count : d[1],
                    totalCount : d[2],
                    radius : TF.radiusScale(d[1]),
                    group : TF.colorPicker(d[1]),
                    stroke : TF.colorStroke(d[1]),
                    xCord : Math.random() * 600,
                    yCord : Math.random() * 500
                };
                nodes.push(node);
            });
        return nodes;
    },//end buildNodes

    moveTowardCenter : function(alpha,x,y){
        return function(d){
            d.xCord = d.xCord + (x -  TF.build.largestRadius) * (TF.build.damper + 0.08) * alpha;
            d.yCord = d.yCord + (y -  TF.build.largestRadius) * (TF.build.damper + 0.08) * alpha;
        };
    },//end moveTowardCenter

    charge : function(d) {
        return -Math.pow(d.radius,1.0)/8;
    },//end charge

    prior :{
        style : undefined, 
        last : undefined,
    },//prior

    build : function(data){
            //neo4j response
            var data = data.data;

            //set up coloring
            TF.colorDefiner.handle(data);

            //empty nodes container
            var nodes = [];

            //instantiate all our json node objects
            nodes = TF.buildNodes(data);

            //height and width of svg
            var height = 428;
            var width = 350;

            //variables for charge
            var layoutGravity = 0.024;
            var damper = 0.1;

            //get the maximum value in the node set
            var max = d3.max(nodes,function(d){ return d.count; });
            //get the minimum value in the node set
            var min = d3.min(nodes,function(d){ return d.count;});

            //this corresponds with the minimum/maximum radius of a circle
            var minR = 10;
            var maxR = 70;
            var center = { "x":width/2, "y":height/2 };

            //normalize our radius across our range and domain
            var radiusScale = d3.scale.pow().exponent(0.5).domain([min,max]).range([minR,maxR]);

            var charge = function(d){ return -Math.pow(d.radius,1.65)/8 ; }

            var force = d3.layout.force().nodes(nodes).size([width,height]);

            //empty the dataBubbles
            $('#dataBubbles').empty();
            //empty the stats
            $('#stats').empty();
            //unselect a prior selected tag
            $('#tagListing').children('div').attr('class','');


            //create our svg to layout our graph on
            var svg = d3.select('#dataBubbles').append("svg").attr("width",width).attr("height",height);

            //create the circles on the svg
            var circles = svg.selectAll("circle").data(nodes).enter().append("circle")
                .attr("cy",function(d){return d.yCord;})
                .attr("cx",function(d){return d.xCord;})
                .attr("r",function(d){return 0 ;})
                .style("fill",function(d){ return d.group;})
                .style("stroke",function(d){ return d.stroke;})
                .style("stroke-width","2")
                .on("click", function(d){
                    if(TF.prior.last !== undefined){
                        TF.prior.last.attr("style",TF.prior.style);
                    }//if
                    TF.prior.last = $(this);
                    TF.prior.style = $(this).attr("style");
                    $(this).attr("style","fill : rgb(221, 229, 61); stroke:rgb(152,38,33);stroke-width:2;");
                    TF.displaySingle(d);
            //        dendrogram(d.tag);
            }) ;

            var largestRadius = 0;
 
            //change the radius from initially set 0 value to actual scaled radius
            circles.transition().duration(2000).attr("r",function(d){
                d.radius = radiusScale(d.count);
                if(d.count==max){
                   largestRadius = d.radius; 
                }
                return radiusScale(d.count);
            });



            //log our nodes on the console
            //FOR DEBUGGING ONLY
            //DO NOT USE IN PRODUCTION
//            console.log(nodes);

            //move the circles which were seeded at a random value towards the center of the svg
            force.gravity(layoutGravity).charge(charge).friction(0.95).on("tick",function(e) {
                    return circles.each(TF.moveTowardCenter(e.alpha,center.x,center.y))
                    .attr("cx",function(d){ return d.x; })
                    .attr("cy",function(d){ return d.y; })
                    });
            force.start();
    },//end build

    displaySingle : function(d){
        var total = parseInt($('#viewingTweets').children('span').text());
        var print = '<p class="tag">#'+d.tag+'</p>';
            print += '<p class="tagContext">In <span class="context">context</span></p>';
            print += '<div id="inContext">';
            print += '<p class="tagCount">Used '+d.count+' times within '+total+' tweets</p>';
            print += '<p class="percentage">Occuring in '+viewControl.round(d.count/total)+'% of tweets</p>';
            print += '</div>';
            print += '<p class="tagContext">Out of <span class="context">context</span></p>';
            print += '<div id="outContext">';
            print += '<p>Used '+d.count+' times out of '+d.totalCount+'</p>';
            print += '<p>'+viewControl.round(d.count/d.totalCount)+'% of total use</p>';
            print += '<p>Used '+d.totalCount+' times within '+viewControl.allTweetsCount+' tweets</p>';
            print += '<p>Occuring in '+viewControl.round(d.totalCount/viewControl.allTweetsCount)+'% of tweets</p>';
            print += '</div>';
        $('#stats').html(print);
        $('#tagListing').children('div').attr('class','');
        $('#tagListing').children('#'+d.tag+'Tag').addClass('selected');
    },//end displaySingle

    colorPicker : function(val){
        var color =  {"small":"#CC817E","medium-small":"#B7FFFA","medium":"#7EA8CC","large":"#306999"};
        if(val<TF.colorDefiner.q1Avr){ return color.small;}
        else if(val<TF.colorDefiner.q2){ return color.medium-small;}
        else if(val<TF.colorDefiner.q3Avr){ return color.medium;}
        else { return color.large;}
    },//end colorPick

    colorStroke : function(val){
        var color =  {"small":"#7F4442","medium-small":"#6eb2ae","medium":"#42637F","large":"#10314c"};
        if(val<TF.colorDefiner.q1Avr){ return color.small;}
        else if(val<TF.colorDefiner.q2){ return color.medium-small;}
        else if(val<TF.colorDefiner.q3Avr){ return color.medium;}
        else { return color.large;}
    },//end colorStroke

    colorDefiner : {
        q1Ar:0,
        q3Avr:0,
        handle : function(data){ 
            var counts = [];
            var q1 = [];
            var q2 = [];
            var q3 = [];
            for(var i=0;i<data.length;i++){
                counts[i]=data[i][1];
            }//end for

            q2 = stats.getAvr(counts);
            q1 = [];
            q3 = [];

            for(var i=0;i<data.length;i++){
                if(data[i][1]<= q2){
                    q1.push(data[i]);
                }
                else{
                    q3.push(data[i]);
                }//end else
            }//end for

            var counts = [];
            for(var i=0;i<q1.length;i++){
                counts[i]=q1[i][1];
            }//end for
            this.q1Avr = stats.getAvr(counts);
            TF.colorPicker.measures

            var counts = [];
            for(var i=0;i<q3.length;i++){
                counts[i]=q1[i][1];
            }//end for
            this.q3Avr = stats.getAvr(counts);
        }//end handle

    }//end colorDefined


}//end TF

//module to build the pie chart
var pie = {
    setUpData : function(json){
        var viewing = '';
        if(viewControl.active == 'All'){
            var all = json.data[0][2] + json.data[1][2];
            var tagCount = json.data[0][1]+json.data[1][1];
            viewing = 'ows + anonymous'; 
            var d = [{"tag":"All","population":all-tagCount},{"tag":viewing,"population":tagCount}];
        }
        else{
            var all = viewControl.allTweetsCount;
            var tagCount = json.data[0][1];
            if(viewControl.active == 'ows'){
                viewing = 'ows';
            }//if
            else {
                viewing = 'anonymous';
            }//else
            var d = [{"tag":"All","population":all-tagCount},{"tag":viewing,"population":tagCount}];
        }//else

        pie.buildPie(d);
    },//end setUpData

    buildPie : function(data){
        //empty old pie
        $('#pieChart').empty();

        var width = 200,
            height = 300,
            radius = Math.min(width, height) / 2;
        
        var color = d3.scale.ordinal().range(["#a64845","#DDE53D","#B7FFFA","#7EA8CC"]);
        
        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);
        
        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.population; });
        
        var svg = d3.select("#pieChart").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
          data.forEach(function(d) {
            d.population = + parseInt(d.population);
          });
        
          var g = svg.selectAll(".arc")
              .data(pie(data))
            .enter().append("g")
              .attr("class", "arc");
        
          g.append("path")
              .attr("d", arc)
              .style("fill", function(d) { return color(d.data.tag); });
        
          g.append("text")
              .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .text(function(d) { return d.data.tag; });
        
    }//end buildPie
}//end pie



var stats = {
    meanA : undefined,
    meanB : undefined,
    
    isArray : function(arr){
        return Object.prototype.toString.call(arr) === "[object Array]";
    },//end isArray
    setDec : function(num){
        var pow10 = Math.pow(10,8);
        return Math.round(pow10 * num) / pow10;

    },//end setDec
    getAvr : function(arr){
        if(this.isArray(arr)){
            var sum=0;
            for(var i=0;i<arr.length;i++){
                sum += arr[i];
            }//end for
            return this.setDec(sum/arr.length);
        }//end if
        return false;
    },//end getAvr
    getVariance : function(arr){
        if(this.isArray(arr)){
            var avr = this.getAvr(arr);
            var v = 0;
            for(var i=0;i<arr.length;i++){
                v += Math.pow((arr[i]-avr),2);
            }//end for
            v /= arr.length;
            return this.setDec(v);
        }//end if

    },//end getVariance
    getStandardDeviation : function(arr){
        if(this.isArray){
            return  this.setDec(Math.sqrt(this.getVariance(arr)));
        }//end if
    },//end getStandardDeviation
    charArrToNum : function(arr){
        var nums=[];
        arr = arr.toLowerCase();
        for(var i=0;i<arr.length;i++){
            nums[i] = arr.charAt(i).charCodeAt();
        }//end for
        return nums;
    },//end charArrToNum
    correlationCoeffecient : function(arr1,arr2){
        if(typeof arr1=='string' && typeof arr2=='string'){
            arr1 = this.charArrToNum(arr1);
            arr2 = this.charArrToNum(arr2);
        }//if
        var stdDevA = this.getStandardDeviation(arr1);
        var stdDevB = this.getStandardDeviation(arr2);
        var meanA = this.getAvr(arr1);
        var meanB = this.getAvr(arr2);
        var v = 0;
        for(var i=0;i<arr1.length;i++){
                v += this.setDec((arr1[i] - meanA)*(arr2[i] - meanB));
        }//end for

        v = this.setDec(v/(arr1.length*stdDevA*stdDevB));
        return v;
    },//end corCof

    levenshtein_distance : function(a,b) {
      if(a.length == 0) return b.length; 
      if(b.length == 0) return a.length; 
    
      var matrix = [];
    
      // increment along the first column of each row
      var i;
      for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
      }
    
      // increment each column in the first row
      var j;
      for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
      }
    
      // Fill in the rest of the matrix
      for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
          if(b.charAt(i-1) == a.charAt(j-1)){
            matrix[i][j] = matrix[i-1][j-1];
          } else {
            matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                    Math.min(matrix[i][j-1] + 1, // insertion
                                             matrix[i-1][j] + 1)); // deletion
          }
        }
      }
    
      return matrix[b.length][a.length];
    }//levenshtein

}//end stats


function dendrogram(tag){

    var m = [80, 160, 40, 80],
    w = 1200 - m[1] - m[3],
    h = 600 - m[0] - m[2],
    i = 0,
    root;
    var tree = d3.layout.tree() .size([h, w]);

    var diagonal = d3.svg.diagonal() .projection(function(d) { return [d.y, d.x]; });

    $('#dendro').empty();
    var vis = d3.select("#dendro").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");


        $.ajax({
            type:'POST',
            url:'http://localhost:7474/db/data/cypher',
            data: JSON.stringify({"query" : "START tag=node:tags(tag={tag}) MATCH tag<-[:TAGGED]-twt-[rel:LINKED]->lnk RETURN tag.name AS tags,tag.count, collect(distinct lnk) AS users, collect(distinct twt) AS twts, collect(rel) AS relationship ",
                "params":{'tag':tag}}),
            contentType:"application/json",
            dataType:'json',
            success:function(json){

                console.log(json);

                var newJson = {};

                newJson.name = json.data[0][0];
                newJson.children = json.data[0][2];

                console.log(newJson);

                //iterate through links
                for(var i = 0; i<newJson.children.length;i++){

                    //set the name of the child
                    newJson.children[i].name = newJson.children[i].data.short;

                    //place holder for children of links
                    newJson.children[i].children = [];

                    //iterate through tweets to build children of the links
                    for(var n=0;n<json.data[0][3].length;n++){

                        //iterate through realtionships to see which tweets belong with which links 
                        for(var x=0;x<json.data[0][4].length;x++){
                            if(json.data[0][3][n].self == json.data[0][4][x].start && newJson.children[i].self == json.data[0][4][x].end){
                                json.data[0][3][n].name = json.data[0][3][n].data.text;
                                newJson.children[i].children.push(json.data[0][3][n]);
                            }//end if
                        }//end for

                    }//end for

                }//end for

                console.log(newJson);


                 root = newJson;
                 root.x0 = h / 2;
                 root.y0 = 0;
                 function toggleAll(d) {
                     if (d.children) {
                         d.children.forEach(toggleAll);
                         toggle(d);
                         }
                 }
 
                 // Initialize the display to show a few nodes.
                root.children.forEach(toggleAll);
                 toggle(root.children[0]);
                 update(root);

            },//end success               
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                console.log(XMLHttpRequest);
            }

        });//end ajax



    function display(d){
        if(d.children === undefined){
        }
    }//end display

    function update(source) {
        var duration = d3.event && d3.event.altKey ? 5000 : 500;
        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse();
        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });
        // Update the nodes…
        var node = vis.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", function(d) { 
            toggle(d); 
            update(d);
            display(d);
        });

        nodeEnter.append("svg:circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "green" : "#fff"; });

        nodeEnter.append("svg:text")
        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);


        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
        nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function(d) { return d._children ? "green" : "#fff"; });

        nodeUpdate.select("text")
        .style("fill-opacity", 1);
        // Transition exiting nodes to the parent's new position.

        var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

        nodeExit.select("circle")
        .attr("r", 1e-6);

        nodeExit.select("text")
        .style("fill-opacity", 1e-6);

        // Update the links…
        var link = vis.selectAll("path.link")
        .data(tree.links(nodes), function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        })
        .transition()
        .duration(duration)
        .attr("d", diagonal);

        // Transition links to their new position.
        link.transition()
        .duration(duration)
        .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
        .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    // Toggle children.
    function toggle(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
            } else {
            d.children = d._children;
            d._children = null;
        }
    } 

}//end dendrogram

$(document).ready(function(){
    $('#sTime').ptTimeSelect({timeFormat:'hhmm'});
    $('#eTime').ptTimeSelect({timeFormat:'hhmm'});
    TF.request();
})


