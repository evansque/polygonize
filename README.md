# polygonize

## Quickstart

Install with Bower 
```
bower install polygonize --save
```

Load the script files
```
<script type="text/javascript" src="./bower_components/delaunay-fast/delaunay.js"></script>
<script type="text/javascript" src="./bower_components/polygonize/dist/polygonize.js"></script>
```

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

## Examples
<img width='400' src='https://cloud.githubusercontent.com/assets/3917887/20608286/6bec4a1a-b24e-11e6-8b9e-78e39ba60d91.png'>
<img width='400' src='https://cloud.githubusercontent.com/assets/3917887/20608302/97bdb354-b24e-11e6-8347-e38de06df4ae.png'>
<img width='400' src='https://cloud.githubusercontent.com/assets/3917887/20608316/adedbaf2-b24e-11e6-89e9-d0a67096556d.png'>

## TODO
* Intensive JavaScript computations blocks the single thread

## Issues ?
If you found any issues or if you have any ideas to improve this tool please don't hesitate to create a new issue on github.
  
