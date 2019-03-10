const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  scaleToView: true
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
