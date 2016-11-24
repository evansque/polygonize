let src = '';

function updateVisibleValue() {
  document.getElementById('cell-size-value').innerText = document.getElementById('cell-size').value;
  if (src) {
    poly()
  }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = event => {
      src = event.target.result;
      poly();
      document.getElementById('image-file').value = '';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function poly() {
  loading(true);
  Polygonize({
    src: src,
    cellSize: parseInt(document.getElementById('cell-size').value),
    progress: function (progress) {
      // console.log(progress + '%');
    },
    onSuccess: function(canvas) {
      const canvasContainer = document.getElementById('canvas')
      canvasContainer.innerHTML = '';
      canvasContainer.appendChild(canvas);
      loading(false);
    }
  });
}

function loading(show) {
  let loading = document.getElementById('loading');
  loading.style.display = show ? "flex" : "none";
}