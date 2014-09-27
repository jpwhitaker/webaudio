if (Meteor.isClient) {
  var makeAudioWidget = function(options){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

    var audioContext = new webkitAudioContext();
    var audioData = [];

    var _loadAudio = function(url, callback){
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
      // debugger
      audioContext.decodeAudioData( arraybuffer,
      function(buffer) {
        _generateWaveformData(buffer);
        _playAudio(buffer);
      } );
    };

    var _generateWaveformData = function(buffer){
      var data = buffer.getChannelData( 0 );
      var dataLength = data.length;

      var step = Math.ceil( dataLength / player.height );
      var amp = player.width / 2;
      minMax = [];

      for(var i=0; i < player.height; i++){
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
      _drawWaveFormData(minMax);
      // return minMax
    }

    var _drawWaveFormData = function(waveformData){
      for(var i=0; i < waveformData.length; i++){
        var x1 = waveformData[i][0]
        var x2 = waveformData[i][1]
        context.beginPath();
        context.moveTo(x1, i+0.5);
        context.lineTo(x2, i+0.5);
        context.lineCap="round";
        context.lineWidth=1;
        context.strokeStyle = "red";
        context.stroke();
      }
    }

    var _drawProgress = function(){
      //
    };

    var _playAudio = function(){
      //
    };
    return {
      fileName: options.fileName,
      width: options.width,
      height: options.height,
      play: function(){
        _loadAudio('magic-short.mp3', _decodeAudio);
      }
    };

  };

  window.addEventListener('load', function(){ player = makeAudioWidget({fileName:'magic', width:100, height:1380})} );
}

