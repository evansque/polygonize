'use strict';

(function (window) {
  window.Polygonize = function (opts) {
    if (!window.Delaunay) {
      throw new Error('Polygonize\'s JavaScript requires Delaunay (https://github.com/ironwallaby/delaunay)');
    }
    if (!opts.src) {
      throw new Error('Image source is undefined');
    }

    var defaults = {
      cellSize: 10
    };

    opts.cellSize = opts.cellSize || defaults.cellSize;

    var image = new Image();
    image.src = opts.src;

    var progress = 0;

    image.onload = function () {
      var canvas = polygonize();
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
      var hex = c.toString(16);
      if (hex.length === 1) {
        return '0' + hex;
      }
      return hex;
    }

    function rgbToHex(r, g, b) {
      return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function getPixel(x, y) {
      var pixelData = image.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      if (pixelData[3] !== 0) {
        return rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
      }
    }

    function updateProgress(index, length) {
      var currentProgress = parseInt((index + 1) / length * 100);
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
      var outputCanvas = document.createElement('canvas');
      var ctx = outputCanvas.getContext('2d');

      image.canvas = document.createElement('canvas');
      var points = [];

      var imageWidth = parseInt(image.width);
      var imageHeight = parseInt(image.height);

      image.canvas.width = imageWidth;
      image.canvas.height = imageHeight;
      image.canvas.getContext('2d').drawImage(image, 0, 0, imageWidth, imageHeight);

      outputCanvas.width = imageWidth;
      outputCanvas.height = imageHeight;

      var xCells = parseInt(imageWidth / opts.cellSize);
      var yCells = parseInt(imageHeight / opts.cellSize);

      var gridStart = {
        x: -opts.cellSize,
        y: -opts.cellSize
      };

      var gridEnd = {
        x: (xCells + 1) * opts.cellSize,
        y: (yCells + 1) * opts.cellSize
      };

      for (var x = gridStart.x; x <= gridEnd.x; x += opts.cellSize) {
        for (var y = gridStart.y; y <= gridEnd.y; y += opts.cellSize) {
          var point = {
            x: randomIntFromInterval(x, x + opts.cellSize),
            y: randomIntFromInterval(y, y + opts.cellSize)
          };
          points.push([point.x, point.y]);
        }
      }

      var indices = Delaunay.triangulate(points);

      //@TODO Intensive JavaScript computations blocks the single thread
      for (var index = 0; index < indices.length; index += 3) {
        var triangle = [indices[index], indices[index + 1], indices[index + 2]].map(function (index) {
          return points[index];
        });
        var centerX = parseInt((triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3);
        var centerY = parseInt((triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3);

        var color = getPixel(centerX, centerY) || getPixel(triangle[0][0], triangle[0][1]) || getPixel(triangle[1][0], triangle[1][1]) || getPixel(triangle[2][0], triangle[2][1]);
        drawTriangle(triangle, color, ctx);
        updateProgress(index, indices.length - 3);
      }
      return outputCanvas;
    }
  };
})(window);