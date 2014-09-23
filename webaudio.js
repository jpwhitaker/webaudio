if (Meteor.isClient) {

  var audioContext = new webkitAudioContext();

  function drawBuffer( length, width, context, buffer ) {

      var data = buffer.getChannelData( 0 );
      var dataLength = data.length;
      var step = Math.ceil( dataLength / length );
      var amp = width / 2;

      //storing for later
      minMax = [];

      for(var i=0; i < length; i++){
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
          x1=(1+min)*amp;
          x2=((1+min)*amp)+(Math.max(1,(max-min)*amp));

          context.beginPath();
          context.moveTo(x1, i+0.5);
          context.lineTo(x2, i+0.5);
          context.lineCap="round";
          context.lineWidth=1;
          context.strokeStyle = "red";
          context.stroke();
          minMax[i] = [x1,x2];
      }
  }

  function initAudio() {
    var audioRequest = new XMLHttpRequest();
    audioRequest.open("GET", "magic-short.mp3", true);
    audioRequest.responseType = "arraybuffer";
    audioRequest.onload = function() {
        audioContext.decodeAudioData( audioRequest.response,
            function(buffer) {
                audioDuration = buffer.duration
                var canvas = document.getElementById("canvas");
                drawBuffer( 1380, 100, canvas.getContext('2d'), buffer );
                playSound(buffer);
                // debugger
                // audioContext.addEventListener('timeupdate', startLine);

            } );
    };
    audioRequest.send();
  }

  function playSound(buffer) {
    var source = audioContext.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
    startLine();
  }
  pos = 0
  function startLine() {
    speed = (audioDuration/1380)*1000
    Meteor.setInterval(drawPos,speed)
  }

  function drawPos(){
    pos++;
    x1 = minMax[pos][0];
    x2 = minMax[pos][1];
    context = canvas.getContext('2d')
    context.beginPath();
    context.moveTo(x1, pos+0.5);
    context.lineTo(x2, pos+0.5);
    context.lineCap="round";
    context.lineWidth=1;
    context.strokeStyle = "black";
    context.stroke();
  }

  window.addEventListener('load', initAudio );
}

