function updateXML() {
};

function importComic() {
};





$(".fancybox")
    .attr('rel', 'gallery')
    .fancybox({
    beforeShow: function () {
        if (this.title) {


                var url_encoded = "http%3A%2F%2Fwww.muchpolitik.fr%2F%3Fid%3D"+id_current_cronique+"%23comic%2F&amp";
                var txt = "Regardez%20cette%20croniqe%20san%20concecion%20de%20Much%20Politik%20!!&amp";
                var href_twitter = 'https://twitter.com/intent/tweet?original_referer='+url_encoded+';ref_src=twsrc%5Etfw&amp;text='+txt+';tw_p=tweetbutton&amp;url='+url_encoded;
                var href_facebook = url_encoded;



            this.title += '<br />';
           this.title +=  '<iframe  width="1000px" height="1000px" frameborder="0" allowtransparency="true" allowfullscreen="true" scrolling="no" title="fb:share_button Facebook Social Plugin" src="http://www.facebook.com/v2.2/plugins/share_button.php?&description=jajoujaj&amp;href='+href_facebook+';sdk=joey&amp;description=bjr&amp;type=button" style="border: none; visibility: visible; width: 71px; height: 61px;" class=""></iframe>';
            
            this.title += '<a class="twitter-share-button" href="'+href_twitter+'" data-count=none>Tweet</a> ';
        }                 

    },
    afterShow: function () {
        // Render tweet button
        twttr.widgets.load();
    },
    helpers: {
        title: {
            type: 'inside'
        }, //<-- add a comma to separate the following option
         //<-- add this for buttons
    },
    closeBtn: true, // you will use the buttons now
    arrows: false
});



/* KONAMI CODE */
    var easter_egg = new Konami(function() { alert('san concecion !')});
