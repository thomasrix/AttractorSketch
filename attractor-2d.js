const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  scaleToView: true
};

const sketch = () => {
  
  const getValue = ()=>{
    // clifford attractor
    // http://paulbourke.net/fractals/clifford/
    
    // scale down x and y
    var scale = 0.005;
    x = (x - width / 2) * scale;
    y = (y - height / 2)  * scale;
    
    // attactor gives new x, y for old one. 
    var x1 = Math.sin(parameters.a * y) + parameters.c * Math.cos(parameters.a * x);
    var y1 = Math.sin(parameters.b * x) + parameters.d * Math.cos(parameters.b * y);
    
    // find angle from old to new. that's the value.
    return Math.atan2(y1 - y, x1 - x);
    
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
