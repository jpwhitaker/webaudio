Meteor.startup(function(){
  data = []
  var makeAudioWidget = function(options){
    var audioContext = new webkitAudioContext();
    var audioData = [];
    var height = 1380;
    var width = 200;
    var BOPPO = [];

     _loadAudio = function(url, callback){
      //xml request
      var audioRequest = new XMLHttpRequest();
      audioRequest.responseType = "arraybuffer";
      audioRequest.onload = function() {
        callback(audioRequest.response);
      };
      audioRequest.open("GET", url, true);
      audioRequest.send();
    };

    //arraybuffer from load audio
    var _decodeAudio = function(arraybuffer){
      audioContext.decodeAudioData( arraybuffer,
      function(buffer) {
        _generateWaveformData(buffer);
      } );
    };

    var _generateWaveformData = function(buffer){
      var data = buffer.getChannelData( 0 );
      var dataLength = data.length;

      var step = Math.ceil( dataLength / height );
      var amp = width / 2;
      minMax = [];

      for(var i=0; i < height; i++){
        var min = 1.0;
        var max = -1.0;
        //getting min and max val of each step's n bytes
        for (var j=0; j<step; j++) {
          var datum = data[(i*step)+j];
          if (datum < min)
              min = datum;
          if (datum > max)
              max = datum;
        }
        var x1=(1+min)*amp;
        var x2=((1+min)*amp)+(Math.max(1,(max-min)*amp));
        minMax[i] = [x1,x2];
      }

      _drawWaveForm(minMax);
    };

    var _drawWaveForm = function(mM){
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 200,
          height = 1380;

      // var line = d3.svg.line()
      //     .x1(function(d) {d[0]})
      //     .x2(function(d) {d[1]});

      var svg = d3.select("body").append("svg")
          .attr("width", width )
          .attr("height", height)
        // .append("g")
          // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      svg.selectAll('line')
        .data(mM)
      .enter().append('line')
        .attr('x1', function(d) { return d[0]; })
        .attr('x2', function(d) { return d[1]; })
        .attr('y1', function(d, i) { return i +0.5; })
        .attr('y2', function(d, i) { return i +0.5; })
        .attr("stroke-width", 1)
        .attr("stroke", "green");

      // mM.forEach(function(data,i){

      //   svg.append("line")
      //       .attr('x1', data[0])
      //       .attr('x2', data[1])
      //       .attr('y1', i +0.5)
      //       .attr('y2', i +0.5)
      //       .attr("stroke-width", 1)
      //       .attr("stroke", "black");

      // })
      // d3.tsv("data.tsv", function(error, data) {
      //   data.forEach(function(d) {
      //     d.date = parseDate(d.date);
      //     d.close = +d.close;
      //   });
      // });
    }
    return {
      generateWaveformData: function(){

        _loadAudio('magic-short.mp3', _decodeAudio);
      },
    };


  };

  window.addEventListener('load', function(){ player = makeAudioWidget({fileName:'magic', width:100, height:1380})});




});