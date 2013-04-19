//This is the Control object. 
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
            //set the view
            viewControl.setView();
            //request our intial ows and anonymous tag data
            TF.request();
            $('#sTime').ptTimeSelect({timeFormat:'hhmm'});
            $('#eTime').ptTimeSelect({timeFormat:'hhmm'});
        
            $("#loading").bind("ajaxSend", function(){
                $(this).show();
            }).bind("ajaxComplete", function(){
                $(this).hide();
            });
        });//document ready
    }(),//initView
    //generic method to set the current view from anywhere in the application
    setView : function(){
        $('#tagsvg').slideUp(200);
        $('#tagsvg').remove();
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
        $('.doAddContext').live('click',function(){
            
            if($('input[name=startDate]').val()!=''){  
                var startDate =  parseInt($('#startDate').val().toString().substr(0,10));
                //subtract 14400 or 4 hours to start from midnight
                viewControl.startDate = startDate - 14400;
            }//if
            else{
                viewControl.startDate = undefined;
            }//else
            if($('input[name=endDate]').val()!=''){  
                //add 72000 - 1 to get 23:59 of that date aka end of the day
                var endDate = parseInt($('#endDate').val().toString().substr(0,10))
                viewControl.endDate = endDate + 71999;
            }//if
            else{
                viewControl.endDate = undefined;
            }//else
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
            else{
                viewControl.startTime = undefined;
            }//else
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
            else{
                viewControl.endTime = undefined;
            }//else

            if(viewControl.viewing == 'conLinks' || viewControl.viewing == 'conTweets' || viewControl.viewing == 'conUsers'){
                $('#gut').children('div').eq(1).remove()
                $('#gut').children('div').after(viewControl.both_tags);
                $('#stats').empty();
                $('#dataBubbles').empty();
                $('#tagListing').empty();
                $('#controls').children('button').attr('class','BG');
                $('#conTags').attr('class','selected');
                viewControl.setView();
            }//if

            //purge our data
            tags.singleTags.tags=[];
            tags.singleTags.context=[];
            tags.singleTags.total=[];
            //all tags data
            viewControl.both_links = undefined;
            viewControl.both_tweets = undefined;
            viewControl.both_users = undefined;
            //ows tag data
            viewControl.ows_links = undefined;
            viewControl.ows_tweets = undefined;
            viewControl.ows_users = undefined;
            //anon tag data
            viewControl.anon_links = undefined;
            viewControl.anon_tweets = undefined;
            viewControl.anon_users = undefined;
            
            $('.addedContext').remove();
            $('#tagsvg').remove();
            if(viewControl.startTime===undefined && viewControl.endTime===undefined && viewControl.startDate===undefined && viewControl.endDate===undefined){
                $('#dateRange').remove();
            }//if
            

            TF.request();
            viewControl.storeData();
        });//live
    }(),//changeDate

    prepareQuery : function(q){

        if(viewControl.active == 'All'){
            q+="All=1";
        }//if
        else if(viewControl.active == 'ows'){
            q+="ows=1";
        }//elif
        else {
            q+="anon=1";
        }//elif

        if(viewControl.startDate !== undefined){
            q += "&sd="+viewControl.startDate;
        }//if
        if(viewControl.endDate !== undefined){
            q+= "&ed="+viewControl.endDate;
        }//if
        if(viewControl.startTime !== undefined){
            q+= "&st="+viewControl.startTime;
        }//if
        if(viewControl.endTime !== undefined){
            q+= "&et="+viewControl.endTime;
        }//if
        var count = 0;
        for(var i=0;i<(tags.addTagList.tags).length;i++){
            if(tags.addTagList.tags[i]===undefined){
                continue;
            }//if
            if(count==0){
                q+= "&t"+count+"="+encodeURIComponent(tags.addTagList.tags[i])+"&";
            }//if
            else{
                q+= "t"+count+"="+encodeURIComponent(tags.addTagList.tags[i])+"&";
            }//else
            count++;
        }//for

        return q;
    },//prepareDate

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

        var addedContext= "<div class='addedContext'><span>Added Context </span>:";
        var ac = false;
        for(var i=0;i<(tags.addTagList.tags).length;i++){
            if(tags.addTagList.tags[i]===undefined){
                continue;
            }//if
           addedContext += "<img src='images/tagBanner.png'/><span class='removeTag'>"+tags.addTagList.tags[i]+"</span> "; 
           ac=true;
        }//for
        addedContext+="</div>";
        if(ac){
            $('#info').after(addedContext);
        }//if

        $('#viewingTweets').children('span').html(tagCount);
        $('#prcTweets').children('span').html(viewControl.round(tagCount/viewControl.allTweetsCount));

    },//banner 

    //listener for Both tags top control
    allListener : function(){
        $('#All').live('click',function(){
            viewControl.storeData();
            tags.addTagList.tags = [];
            $('.addedContext').remove();
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
            tags.addTagList.tags = [];
            $('.addedContext').remove();
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
            tags.addTagList.tags = [];
            $('.addedContext').remove();
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
    },//end round
    //method to wrap urls in strings with an <a> tag
    parseURL : function(inc){
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        inc = inc.replace(exp,"<a target='_blank' href='$1'>$1</a>"); 
        return inc.parseHashtag();
    },//parseURL
    //method to close our pop up if need be
    closePopUpListener : function(){
        $('#closePopUp').live('click',function(){
            $('#loading').hide();
            $('#loading').empty();
            $('#shades').hide();
        });
    }()//closePopUpListener

}//end viewControl


//object to hold/build our tag list in tags
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
        var buttons = '<div id="fixedAddContext"> <span class="BG button doAddContext">Add context</span> <span class="BG button doAddContext">Remove context</span> </div>';

        var header = '<div class="tagHeader">Tag <span>Total</span><span class="context">Context</span></div>';
        //build the tag list
        while(json.data[i]!==undefined){
            tags.singleTags.tags.push(json.data[i][0]);
            tags.singleTags.context.push(json.data[i][1]);
            tags.singleTags.total.push(json.data[i][2]);

            if(json.data[i][0]=='anonymous'||json.data[i][0]=='ows'){
                p += '<div id="'+json.data[i][0]+'Tag"><span>'+json.data[i][0]+'</span>';
            }//if
            else{
                var f = false;
                for(var x=0;x<(tags.addTagList.tags).length;x++){
                    if(json.data[i][0]==tags.addTagList.tags[x]){
                        f = true;
                        p += '<div id="'+json.data[i][0]+'Tag"><span class="removeTag"><img class="tagIMG" src="images/added.png"/></span><span>'+json.data[i][0]+'</span>';
                    }
                }//for
                if(!f){
                    p += '<div id="'+json.data[i][0]+'Tag"><span class="addTag"><img class="tagIMG" src="images/add.png"/></span><span>'+json.data[i][0]+'</span>';
                }//if
            }
            p +='<span class="totalCount">'+json.data[i][2]+'</span>';
            p +='<span class="contextCount tagHere">'+json.data[i][1]+'</span></div>';
            i++;
        }//end while
        $('#tagList').append(buttons+header+'<div id="tagListing">'+p+'</div>');

    },//end currentTags
    singleTags : {
        tags : [],
        context : [],
        total : [],
        buildPopUp : function(tag,context,total,popup){
            $(popup).append('<p class="popupTag">'+tag+'</p><div><span class="context">Context</span><span class="totalPopUp">Total</span>');
            $(popup).append('<div><span class="context">'+context+'</span><span class="totalPopUp">'+total+'</span></div>');
            $(popup).fadeIn(600);
            $(popup).attr('active','1');
        },//buildPopUp
        singleTagsListen : function(){
        $('.singleTagInfo').live('click',function(){
            var tag = ($(this).text().substring(1,$(this).text().length)).toLowerCase();
            var popup = $(this).children('.popup');

            if($(popup).attr('active')=='1'){
                $(popup).attr('active','0');
                $(popup).fadeOut(600).empty();
                return;
            }//if
            else {
                for(var i=0;i<tags.singleTags.tags.length;i++){
                    if(tags.singleTags.tags[i]==tag){
                        tags.singleTags.buildPopUp(tag,tags.singleTags.context[i],tags.singleTags.total[i],popup);
                        return;
                    }//if
                }//for
            }//if

            var q = "http://twitter.localhost/ajax.php?singleTag="+encodeURIComponent(tag)+"&";
            q = viewControl.prepareQuery(q);
        
            $.ajax({
                url:q,
                global:false,
                dataType:'json',
                success:function(json){
                    tags.singleTags.buildPopUp(tag,json.data[0][0],json.data[0][1],popup);
                    tags.singleTags.tags.push(tag);
                    tags.singleTags.context.push(json.data[0][0]);
                    tags.singleTags.total.push(json.data[0][1]);
                    
                },//end success               
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                    console.log(XMLHttpRequest);
                }
    
            });//end ajax


            });//live
        }()//singleTagListen
    },//singleTags
    singleTagDates : function(tag){
            var q = "http://twitter.localhost/ajax.php?singleTagDate="+encodeURIComponent(tag)+"&";
            q = viewControl.prepareQuery(q);
        
            $.ajax({
                url:q,
                global:false,
                dataType:'json',
                success:function(json){
                    console.log(json);
                    $('#tagsvg').remove();
                    $('#gut').before('<div id="tagsvg"></div>');
                    lineChart(json);
                    
                },//end success               
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                    console.log(XMLHttpRequest);
                }
            });//end ajax
    },//singleTagDates
    addTagList:{
        tags:[],
        addTagListener : function(){
            $('.addTag').live('click',function(){
                (tags.addTagList.tags).push($(this).next().text());
                $(this).attr('class','removeTag');
                $(this).children('img').attr('src','images/added.png');
            });//live
            $('.removeTag').live('click',function(){
                for(var i=0;i<(tags.addTagList.tags).length;i++){
                    if(tags.addTagList.tags[i]==$(this).next().text()){
                        delete tags.addTagList.tags[i];
                    }//if
                }//for
                $(this).attr('class','addTag');
                $(this).children('img').attr('src','images/add.png');
            });//live
        }()//addTagListener
    }//addTag
}//tags

//this is the links object.
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

        if(json.data[0]===undefined){
            header ='<div class="header">No links for current context.</div>';
        }//if
        else {

            while(json.data[i] !== undefined){
                var url_idx = 0;
                if(json.data[i][0]=="") { 
                    url_idx = 1;
                }
                p += '<div class="linkList lBG"><p class="singleLink"><a href="'+decodeURIComponent(json.data[i][url_idx])+'" target="_blank">'+decodeURIComponent(json.data[i][url_idx])+'</a></p>';
                p+='<p class="totalCount">'+json.data[i][3]+'</p><p class="contextCount">'+json.data[i][2]+'</p>';
                p+= '<span class="list singleLinkTweets"><img src="images/list.png"></span>';
                p+='</div>';
                i++;
            }//end while
        }//else

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
        var q = "http://twitter.localhost/ajax.php?links=1&";

        q = viewControl.prepareQuery(q);

        $.ajax({
            url:q,
            dataType:'json',
            success:function(json){
                //pass the data to be formatted
                links.buildLinks(json);
            },//end success               
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                console.log(XMLHttpRequest);
            }//error
        });//end ajax
    },//end request
    singleLinkTweets : function(){
        $('.singleLinkTweets').live('click',function(){
            
            var userDiv = $(this).parent();
            $(userDiv).append("<div class='svgCon'></div><div class='nodeInfo'></div>");
            var link= $(userDiv).children('.singleLink').children('a').text();

            if($(userDiv).attr('req')=='1'){
                $(userDiv).find('svg').remove();
                $(userDiv).find('.nodeInfo').remove();
                $(userDiv).children('.singleLinksTweets').slideUp(600);
                $(userDiv).attr('req','0');
                $(userDiv).children('.list').children('img').attr('src','images/list.png');
                return;
            }//if
            else if($(userDiv).attr('req')=='0'){
                $(userDiv).attr('req','1');
                $(userDiv).children('.singleLinksTweets').slideDown(600);
                lChart.request(link);
                $(userDiv).children('.list').children('img').attr('src','images/close.png');
                return;
            }//elif

            $(userDiv).children('.list').children('img').attr('src','images/close.png');

            $(userDiv).attr('req','1');
            lChart.request(link);
            var q = "http://twitter.localhost/ajax.php?singleLink="+encodeURIComponent(link)+"&";
            q = viewControl.prepareQuery(q);
            $.ajax({
                url:q,
                global: false,
                dataType:'json',
                success:function(json){
                console.log(json);
                    //build the list of tweets 
                    links.buildSingleLinkTweets(json,userDiv);
                },//end success               
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                    console.log(XMLHttpRequest);
                }
    
            });//end ajax

        });//live
    }(),//singleUserTweets
    //make the urls in the tweets a link

    buildSingleLinkTweets : function(json,userDiv){
        var p = "";
        for(var i=0;i<(json.data).length;i++){
            p += '<div class="singleUserSingleTweet">'+viewControl.parseURL(json.data[i][0])+'</div>';
        }//for
        $(userDiv).append('<div class="singleLinksTweets" style="display:none;"></div>');
        $(userDiv).children('.singleLinksTweets').html(p);
        $(userDiv).children('.singleLinksTweets').slideDown(600);


    },//buildSingleUserTweets
    singleLink : function(){
        $('.linkInfo').live('click',function(){
            var link = encodeURIComponent($(this).prev().text());
            var popup = $(this).children('.popup1');
            $(this).children('.popup1').attr('use','1');
            var q = "http://twitter.localhost/ajax.php?singleLinkDate="+link+"&short=1&";
            q = viewControl.prepareQuery(q);
            $.ajax({
                url:q,
                global:false,
                dataType:'json',
                url:q,
                success:function(json){
                    console.log(json);
                    lineChart(json);
                    $(popup).fadeIn(600);
                }//success
            });//ajax

        });//live

    }()//singleLink

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
        //if for our active tab, users is undefined, make the request for the data
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
        var q = "http://twitter.localhost/ajax.php?users=1&";
        q = viewControl.prepareQuery(q);

        $.ajax({
            url:q,
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
            p += '<div class="singleTweet lBG"><span class="user">'+json.data[i][0]+'</span><span class="list singleUserTweets"><img src="images/list.png"/></span></div>';
        }//for

        $('#view').html(p);
    },//buildUsers
    singleUserTweets : function(){
        $('.singleUserTweets').live('click',function(){
            
            var userDiv = $(this).parent();

            if($(userDiv).attr('req')=='1'){
//                $(userDiv).children('.singleUsersTweets').css('display','none');
                $(userDiv).children('.singleUsersTweets').slideUp(600);
                $(userDiv).attr('req','0');
                $(userDiv).children('.list').children('img').attr('src','images/list.png');
                return;
            }//if
            else if($(userDiv).attr('req')=='0'){
//                $(userDiv).children('.singleUsersTweets').css('display','block');
                $(userDiv).children('.singleUsersTweets').slideDown(600);
                $(userDiv).attr('req','1');
                $(userDiv).children('.list').children('img').attr('src','images/close.png');
                return;
            }//elif

            $(userDiv).children('.list').children('img').attr('src','images/close.png');

            var user= $(this).prev().text();
            var q = "http://twitter.localhost/ajax.php?singleUser="+encodeURIComponent(user)+"&";
            q = viewControl.prepareQuery(q);
            $.ajax({
                url:q,
                global:false,
                dataType:'json',
                success:function(json){
                console.log(json);
                    //build the list of tweets 
                    users.buildSingleUserTweets(json,userDiv);
                },//end success               
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                    console.log(XMLHttpRequest);
                }
    
            });//end ajax

        });//live
    }(),//singleUserTweets
    //make the urls in the tweets a link

    buildSingleUserTweets : function(json,userDiv){
        var p = "";
        for(var i=0;i<(json.data).length;i++){
            p += '<div class="singleUserSingleTweet">'+viewControl.parseURL(json.data[i][0])+'</div>';
        }//for
        $(userDiv).append('<div class="singleUsersTweets" style="display:none;"></div>');
        $(userDiv).children('.singleUsersTweets').html(p);
        $(userDiv).attr('req','1');
        $(userDiv).children('.singleUsersTweets').slideDown(600);


    }//buildSingleUserTweets

}//users

//this is the tweets object 
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
       
        for(var i=0;i<(json.data).length;i++){
            if(json.data[i] === undefined){continue;}
            p += '<div class="singleTweet lBG">'+viewControl.parseURL(json.data[i][0])+'</div>';
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
        var q = "http://twitter.localhost/ajax.php?tweets=1&";
        q = viewControl.prepareQuery(q);

        $.ajax({
            url:q,
            dataType:'json',
            success:function(json){
                console.log(json);
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
        var q = "http://twitter.localhost/ajax.php?tags=1&";
        q = viewControl.prepareQuery(q);
        $('#shades').css('height',$(document).height());
        $('#shades').show();
        $('#loading').show();
         $.ajax({
             url:q,
             dataType:'json',
             global:false,
             success:function(json){
 //                console.log(json);
                if(json.data[0]===undefined){
                    $('#loading').children('img').remove();

                    var div = '<div id="errorMessage"><p>There was no data found to match your tweets.</p>';
                    for(var i=0;i<(tags.addTagList.tags).length;i++){
                        if(tags.addTagList.tags[i]!==undefined){
                            if(i==0){
                                div+='<p>With added context of:</p>';
                            }//if
                            div+='<p>'+tags.addTagList.tags[i]+'</p>';

                        }//if
                    }//for
                    div += '<div id="closePopUp"><span class="BG">Close</span></div>';
                    div += '</div>';
                    $('#loading').append(div);
                    return;
                }//if
                else{
                    $('#loading').hide();
                    $('#shades').hide();

                }//else
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
//                history.pushState(json,"tags","tags");
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
            var height = 600;
            var width = 450;

            //variables for charge
            var layoutGravity = 0.024;
            var damper = 0.1;

            //get the maximum value in the node set
            var max = d3.max(nodes,function(d){ return d.count; });
            //get the minimum value in the node set
            var min = d3.min(nodes,function(d){ return d.count;});

            //this corresponds with the minimum/maximum radius of a circle
            var minR = 5;
            var maxR = 55;
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
                    tags.singleTagDates(d.tag);
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
            //TF.colorPicker.measures

            var counts = [];
            for(var i=0;i<q3.length;i++){
                if(q1[i]!==undefined){
                    counts[i]=q1[i][1];
                }//if
            }//end for
            this.q3Avr = stats.getAvr(counts);
        }//end handle

    }//end colorDefined


}//end TF

//object to build the pie chart
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

//stats object to hold basic computation tasks
var stats = {
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
    }//end getAvr
}//end stats

//object to hold line chart requests
var lChart = {
    request:function(link){
        var q = "http://twitter.localhost/ajax.php?singleLinkDate="+encodeURIComponent(link)+"&";
        q = viewControl.prepareQuery(q);
         $.ajax({
             url:q,
             dataType:'json',
             global:false,
             success:function(json){
                    console.log(json);
                    lineChart(json);

            },//end success               
             error: function (XMLHttpRequest, textStatus, errorThrown) {
                 alert(XMLHttpRequest + ' : ' + textStatus + ' : ' + errorThrown);
                 console.log(XMLHttpRequest);
             }
 
         });//end ajax
    }//request

}//lChart

//function to build lineCharts
function lineChart(json){

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;


var x = d3.time.scale()
      .range([0,width]);


var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var div;
var nodeInfo;

if(viewControl.viewing=='conTags'){
   div = '#tagsvg';
   nodeInfo = '<div class="nodeInfo"></div>'; 
}//if
else{
    div = '.linkList[req="1"] .svgCon';
}
var svg = d3.select(div).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if(viewControl.viewing=='conTags'){
        $(div).append(nodeInfo);
    }//if

    var realData = [];
    var alterTime;
    var format="";
    var interval;
    var span = json.data[(json.data).length-1][0] - json.data[0][0];
    var parseDate= d3.time.format("%a %b %d %Y %H:%M").parse;

    if(span > 3600 * 24 * 3){
        alterTime = -3;
        interval = 3600 * 24;
        parseDate = d3.time.format("%a %b %d %Y").parse;
    }//if
    else if(span > 3600 * 24){
        format = ":00";
        interval = 3600;
        alterTime = 0;
    }//elif
    else if(span > 3600*4){
        alterTime=2;
        format = "0";
        interval = 600;
    }//elif
    else{
        alterTime = 3;
        interval = 60;
    }//else

    for(var i=0;i<(json.data).length;i++){
        var time= json.data[i][0] * 1000;
        var date = new Date(time);
        var newDate ="";
        newDate = date.toString();
        newDate = newDate.substring(0,newDate.indexOf(':')+alterTime);
        json.data[i][1] = json.data[i][0];
        json.data[i][0]=newDate;
    }//for
    var range = [];
    for(var i=0;i<(json.data).length;i++){
        var count=1;
        while(json.data[i+count]!==undefined && json.data[i][0]==json.data[i+count][0]){
               count++;
        }//while

        var date = parseDate(json.data[i][0]+format);
        var node = {date:date,close:count};
        realData.push(node);
        range.push(date);

        if(json.data[i+count+1]!==undefined){
           var currentTime = new Date(json.data[i][0]+format).getTime();

           var date = new Date(json.data[i+count+1][0]+format);
           var newDate = "";
           date = new Date(date);
           newDate = date.toString();
           endDate = newDate.substring(0,newDate.indexOf(':')+alterTime);
           endDate = new Date(endDate+format).getTime();

           var inLoop=false;
           var loopCount = 0;
           while(currentTime < endDate){
               if(endDate - currentTime  == interval*1000){
                   break;
               }//if

               if(!inLoop){
                   var date = new Date(currentTime+(interval*1000));
                   var newDate = "";
                   newDate = date.toString();
                   newDate = newDate.substring(0,newDate.indexOf(':')+alterTime);
                   date = parseDate(newDate+format);
                   var node = {date:date,close:0};
                   realData.push(node);
                   range.push(date);
                   inLoop = true;
               }//if
               currentTime+=(interval*1000);
               loopCount++;
           }//while
           if(loopCount>1){
               var date = new Date(currentTime);
               var newDate = "";
               newDate = date.toString();
               newDate = newDate.substring(0,newDate.indexOf(':')+alterTime);
               date = parseDate(newDate+format);
               var node = {date:date,close:0};
               realData.push(node);
               range.push(date);
           }//if
           
        }//if

        i = i + count;
    }//for

     x.domain(d3.extent(realData, function(d) { return d.date; }));
     y.domain(d3.extent(realData, function(d) { return d.close; }));

     var start = (realData[0].date).toString().substring(0,15);
     var end = (realData[realData.length-1].date).toString().substring(0,15);

     var date=start+" - "+end; 
     
     svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .style("padding-bottom",10)
         .call(xAxis)
         .append("text")
             .attr("x",width-250)
             .attr("y",-height)
             .text(date);
     
     svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
     .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 2)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Usage");

     svg.selectAll("circle").data(realData).enter().append("circle")
         .attr("cy",function(d){return y(d.close);})
         .attr("cx",function(d){return x(d.date);})
         .attr("r",3)
         .on("mouseover", function(d){
             var p = d.date+" - "+d.close;
             if(viewControl.viewing == 'conTags'){
                p+=" Tweets";
             }//if
             else{
                p+=" Links";
             }//else
             $('.nodeInfo').html(p);
         }) ;

     svg.append("path")
         .datum(realData)
         .attr("class", "line")
         .attr("d", line);

}//lineChart

//prototype strings so that they can have a method called parseHashtag directly from them like
//string.parseHashtag()
String.prototype.parseHashtag = function() {
    return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
        return t.replace(t,"<span class='singleTagInfo'>"+t+"<div class='popup BG'></div></span>")
    });
};

$(document).ready(function(){
    $('#sTime').ptTimeSelect({timeFormat:'hhmm'});
    $('#eTime').ptTimeSelect({timeFormat:'hhmm'});
//    TF.request();

    $("#loading").bind("ajaxSend", function(){
        $(this).show();
    }).bind("ajaxComplete", function(){
        $(this).hide();
    });
})

//function to listen for jquery datepicker plugin
$(function() {
    $(".datepicker").datepicker({altField:'#startDate',altFormat:'@',dateFormat:'D, dd M yy'});
    $(".datepickerEndDate").datepicker({altField:'#endDate',altFormat:'@',dateFormat:'D, dd M yy'});
})
