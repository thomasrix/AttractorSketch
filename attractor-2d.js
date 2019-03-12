const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  scaleToView: true,
  animate:false,
  loop:true,
  fps:30,
  playbackRate:'fixed',
  duration:4,
};

const sketch = () => {
  let parameters = {
    // Values for the attractor function
    a : 2,
    b : -1.4,
    c : -1.7,
    d : 0.5
  }
  let counter = {
    startRadius:1000,
    numOfParticles:1500,
    numOfFrames:200
  }
  let points;
  
  let setupPoints = ()=>{
    points = [];
    let {width, height} = {width:settings.dimensions[0], height:settings.dimensions[1]};
    let radius = counter.startRadius,
    center = {
      x:height * 0.5,
      y:width * 0.5
    },
    angle = 0,
    slice = Math.PI * 2 / counter.numOfParticles;
    
    for(var i = 0; i < counter.numOfParticles; i++) {
      angle = i*slice;
      
      points.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius, 
        vx: 0,
        vy: 0
      })
    };
    // console.log(points);
  }
  
  const drawPoints = (props)=>{
    // console.log(points)
    let {context, width, height} = props;
    context.strokeStyle = '#151515';
    context.globalAlpha = 0.1;
    context.lineWidth = 3;
    context.fillStyle = '#151515';

    for(let i = 0; i < points.length; i++) {
      // get each point and do what we did before with a single point
      let p = points[i];
      let value = getValue(p.x, p.y, props);
      p.vx += Math.cos(value) * 0.3;
      p.vy += Math.sin(value) * 0.3;
      
      // move to current position
      context.beginPath();
      context.moveTo(p.x, p.y);
      
      // add velocity to position and line to new position
      p.x += p.vx;
      p.y += p.vy;
      context.lineTo(p.x, p.y);
      context.stroke();

      // context.beginPath();
      // context.arc(p.x, p.y, 5, 0, Math.PI * 2, false);
      // context.fill();

      
      // apply some friction so point doesn't speed up too much
      p.vx *= 0.99;
      p.vy *= 0.99;
      
      // wrap around edges of screen
      if(p.x > width) p.x = 0;
      if(p.y > height) p.y = 0;
      if(p.x < 0) p.x = width;
      if(p.y < 0) p.y = height;
    }
    
    // call this function again in one frame tick
    /*       counter.tic++;
    if(counter.tic<counter.maxFrames){
      requestAnimationFrame(render);
    }
    */  
  }
  const getValue = (x, y, props)=>{
    // console.log('gv', settings)
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
    
    context.strokeStyle = '#151515';
    context.fillStyle = '#151515';
    context.lineWidth = 1;
    // context.clearRect(0, 0, width, height);
    for(var x = 0; x < width; x += res) {
      for(var y = 0; y < height; y += res) {
        var value = getValue(x, y, props);
        context.save();
        context.translate(x, y);
        
        context.beginPath();
        context.arc(0, 0, 1.5, 0, Math.PI * 2, false);
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
    console.log('render', playhead)
    context.fillStyle = '#c7bf9d';
    context.fillRect(0, 0, width, height);
    // drawTheFlow(props);
    setupPoints();
    for(let i = 0 ; i < counter.numOfFrames ; i++){
      drawPoints(props);
    }
  };
};

canvasSketch(sketch, settings);
