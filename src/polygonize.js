((window) => {
  window.Polygonize = ((opts)=> {
    if (!window.Delaunay) {
      throw new Error('Polygonize\'s JavaScript requires Delaunay (https://github.com/ironwallaby/delaunay)');
    }
    if (!opts.src) {
      throw new Error('Image source is undefined');
    }

    const defaults = {
      cellSize: 10
    };

    opts.cellSize = opts.cellSize || defaults.cellSize;

    const image = new Image();
    image.src = opts.src;

    let progress = 0;

    image.onload = function () {
      const canvas = polygonize();
      if (opts.onSuccess) {
        opts.onSuccess(canvas);
      }
    };

    image.onerror = function () {
      throw new Error('Invalid image source');
    };

    function randomIntFromInterval(min, max) {
      return parseInt(Math.floor(Math.random() * (max - min + 1) + min));
    }

    function componentToHex(c) {
      const hex = c.toString(16);
      if (hex.length === 1) {
        return `0${hex}`;
      }
      return hex;
    }

    function rgbToHex(r, g, b) {
      return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    }

    function getPixel(x, y) {
      const pixelData = image.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      if (pixelData[3] !== 0) {
        return rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
      }
    }

    function updateProgress(index, length) {
      const currentProgress = parseInt(((index + 1) / length) * 100);
      if (currentProgress !== progress) {
        progress = currentProgress;
        if (opts.progress) {
          opts.progress(progress);
        }
      }
    }

    function drawTriangle(triangle, color, ctx) {
      ctx.beginPath();
      ctx.moveTo(triangle[0][0], triangle[0][1]);
      ctx.lineTo(triangle[1][0], triangle[1][1]);
      ctx.lineTo(triangle[2][0], triangle[2][1]);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.fill();
      ctx.stroke();
    }

    function polygonize() {
      const outputCanvas = document.createElement('canvas');
      const ctx = outputCanvas.getContext('2d');

      image.canvas = document.createElement('canvas');
      const points = [];

      const imageWidth = parseInt(image.width);
      const imageHeight = parseInt(image.height);

      image.canvas.width = imageWidth;
      image.canvas.height = imageHeight;
      image.canvas.getContext('2d').drawImage(image, 0, 0, imageWidth, imageHeight);

      outputCanvas.width = imageWidth;
      outputCanvas.height = imageHeight;

      const xCells = parseInt(imageWidth / opts.cellSize);
      const yCells = parseInt(imageHeight / opts.cellSize);

      const gridStart = {
        x: -opts.cellSize,
        y: -opts.cellSize
      };

      const gridEnd = {
        x: (xCells + 1) * opts.cellSize,
        y: (yCells + 1) * opts.cellSize
      };

      for (let x = gridStart.x; x <= gridEnd.x; x += opts.cellSize) {
        for (let y = gridStart.y; y <= gridEnd.y; y += opts.cellSize) {
          const point = {
            x: randomIntFromInterval(x, x + opts.cellSize),
            y: randomIntFromInterval(y, y + opts.cellSize)
          };
          points.push([point.x, point.y]);
        }
      }

      const indices = Delaunay.triangulate(points);

      //@TODO Intensive JavaScript computations blocks the single thread
      for (let index = 0; index < indices.length; index += 3) {
        const triangle = [indices[index], indices[index + 1], indices[index + 2]].map(index => points[index]);
        const centerX = parseInt((triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3);
        const centerY = parseInt((triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3);

        const color = getPixel(centerX, centerY) || getPixel(triangle[0][0], triangle[0][1]) || getPixel(triangle[1][0], triangle[1][1]) || getPixel(triangle[2][0], triangle[2][1]);
        drawTriangle(triangle, color, ctx);
        updateProgress(index, indices.length - 3);
      }
      return outputCanvas;
    }

  });
})(window);
