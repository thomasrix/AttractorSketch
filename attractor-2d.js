const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  scaleToView: true
};

const sketch = () => {
  let parameters = {
    // Values for the attractor function
    a : 2,
    b : -1.4,
    c : -1.6,
    d : 0.2
  }

  const getValue = (x, y, props)=>{
    // console.log('gv', settings)
    // clifford attractor
    // http://paulbourke.net/fractals/clifford/
    
    // scale down x and y
    let {width, height} = props;

    let scale = 0.005;
    x = (x - width / 2) * scale;
    y = (y - height / 2)  * scale;
    
    // attactor gives new x, y for old one. 
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
            //context.circle(2, 2);
            //context.fill();
            context.restore();
        }
    }
  }

  return (props) => {
    const { context, width, height } = props;
    // console.log(props);
    context.fillStyle = '#c7bf9d';
    context.fillRect(0, 0, width, height);
    drawTheFlow(props);
  };
};

canvasSketch(sketch, settings);
