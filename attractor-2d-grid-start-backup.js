const canvasSketch = require('canvas-sketch');
const {lerp} = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1000, 1000],
  // pixelsPerInch:300,
  scaleToView: true,
};

const sketch = () => {
  let bgColor = '#f0f0d7';
  let lineColor = '#1e3440';
  let parameters = {
    // Values for the attractor function
    a : -1.5,
    b : -1.6,
    c : 1.4,
    d : 0.8
  }
  let counter, points;
  
  let setupCounter = (props)=>{
    let {width} = props;
    counter = {
      gridSize:24,
      // startRadius:width * 0.49,
      // numOfParticles:300,
      numOfFrames:200,
      fadeIn:80,
      fadeOut:120
    }
  }
  
  let setupPoints = (props)=>{
    points = [];
    // console.log(props)
    let {width, height} = props;
    let margin = width * 0.22;
    for (let y = 0 ; y < counter.gridSize ; y++){
      for (let x = 0 ; x < counter.gridSize; x++){
        const u = x / (counter.gridSize - 1);
        const v = y / (counter.gridSize - 1);
        points.push({
          x:lerp(margin, width - margin, u),
          y:lerp(margin, height - margin, v),
          vx:0,
          vy:0
        })
      }
    }
    
    console.log(points.length);
  }
  const envelope = (frame)=>{
    let fadeOut = counter.numOfFrames - counter.fadeOut;
    let maxAlpha = alpha = 0.05;
    if(frame < counter.fadeIn){
      alpha = lerp(0, maxAlpha, frame/counter.fadeIn);
    }
    else if(frame > fadeOut){
      alpha = lerp(maxAlpha, 0, (frame - fadeOut) / (counter.numOfFrames - fadeOut));
    }
    // console.log('alpha', frame, alpha);
    return alpha;
  }
  const drawPoints = (props, frame)=>{
    // console.log(points)
    let {context, width, height} = props;
    let norm = frame/counter.numOfFrames;
    // console.log('norm', norm);
    context.strokeStyle = lineColor;
    // context.globalAlpha = 0.1;
    let env = envelope(frame);
    context.lineWidth = env * 600;
    context.globalAlpha = env;
    // context.fillStyle = '#151515';
    
    for(let i = 0; i < points.length; i++) {
      // get each point and accellerate according to the attractor function
      let p = points[i];
      let value = getValue(p.x, p.y, props);
      p.vx += Math.cos(value) * 0.3;
      p.vy += Math.sin(value) * 0.3;
      
      context.beginPath();
      // move to current position
      context.moveTo(p.x, p.y);
      
      // add velocity to position and draw line to new position
      p.x += p.vx;
      p.y += p.vy;
      context.lineTo(p.x, p.y);
      context.stroke();
      
      // slow down the accelleration
      p.vx *= 0.995;
      p.vy *= 0.995;
      
      // wrap the overflow
/*       if(p.x > width) p.x = 0;
      if(p.y > height) p.y = 0;
      if(p.x < 0) p.x = width;
      if(p.y < 0) p.y = height;
 */    }
    
  }
  const getValue = (x, y, props)=>{
    // Using the Clifford Attractor
    // http://paulbourke.net/fractals/clifford/
    
    let {width, height} = props;
    
    // Scale down x and y
    let scale = 0.005;
    x = (x - width / 2) * scale;
    y = (y - height / 2)  * scale;
    
    // Attactor offsets x and y
    let x1 = Math.sin(parameters.a * y) + parameters.c * Math.cos(parameters.a * x);
    let y1 = Math.sin(parameters.b * x) + parameters.d * Math.cos(parameters.b * y);
    
    // find angle from old to new. that's the value.
    return Math.atan2(y1 - y, x1 - x);
  }
  
  const drawTheFlow = (props)=>{
    const {context, width, height} = props;
    const res = 35;
    
    context.strokeStyle = lineColor;
    context.fillStyle = lineColor;
    context.lineWidth = 2;
    context.globalAlpha = 0.2;
    // context.clearRect(0, 0, width, height);
    for(var x = 0; x < width; x += res) {
      for(var y = 0; y < height; y += res) {
        var value = getValue(x, y, props);
        context.save();
        context.translate(x, y);
        
        context.beginPath();
        context.arc(0, 0, 3, 0, Math.PI * 2, false);
        context.fill();
        
        context.rotate(value);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(res * 0.75, 0);
        context.stroke();
        context.restore();
      }
    }
  }
  
  return (props) => {
    const { context, width, height, playhead } = props;
    // console.log('render', playhead)
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    drawTheFlow(props);
    setupCounter(props);
    setupPoints(props);
    for(let i = 0 ; i < counter.numOfFrames ; i++){
      drawPoints(props, i);
    }
  };
};

canvasSketch(sketch, settings);
