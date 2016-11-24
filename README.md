# polygonize
## API
```
  Polygonize({
    src: src,
    cellSize: 10,
    progress: function (progress) {
      console.log(progress + '%');
    },
    onSuccess: function(canvas) {
      const canvasContainer = document.getElementById('canvas-container')
      canvasContainer.innerHTML = '';
      canvasContainer.appendChild(canvas);
    }
  });
```

* src (string): any acceptable image url or data url
* cellSize (int): grid cell size in pixels
* progress (function(int)): a callback function that will be called when image processing updates
* onSuccess (function(canvasElem)): a callback function that will be called when processing is done successfully
* onError (function()): a callback function that will be called when processing fails

## Dependencies
* [delaunay](https://github.com/ironwallaby/delaunay)

## TODO
* Intensive JavaScript computations blocks the single thread

## Issues ?
If you found any issues or if you have any ideas to improve this tool please don't hesitate to create a new issue on github.
  
