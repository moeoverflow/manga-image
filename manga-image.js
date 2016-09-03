MangaImage.prototype.transparent = function(img, scale = 0.85) {
    img.crossOrigin = "Anonymous";
    img.src = img.src;
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var width = img.naturalWidth, height = img.naturalHeight;
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext('2d');
        ctx.width = width;
        ctx.height = height;
        ctx.drawImage(this, 0, 0, width, height);

        var imageData = ctx.getImageData(0, 0, width, height);
        var pixel = imageData.data;
        var r = 0, g = 1, b = 2, a = 3;
        scale = scale * 255;
        for (var p = 0; p< pixel.length; p += 4) {
            if (scale <= pixel[p+r] &&
                scale <= pixel[p+g] &&
                scale <= pixel[p+b]) {
                var total = pixel[p+r] + pixel[p+g] + pixel[p+b]
                pixel[p+a] =  (total - 210*3) / total;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        img.onload = null;
        img.src = canvas.toDataURL('image/png');
    }
}

function MangaImage(options) {
    this.el = options.el;
    this.scale = options.scale;
    var mangaImage = this;
    window.onload = function() {
        if (mangaImage.el) {
            var images = mangaImage.el.getElementsByTagName('img');
            if (images) {
                images = Array.from(images);
                var i = 0;
                var worker = setInterval(function() {
                    mangaImage.transparent(images[i++], mangaImage.scale)
                    if (i >= images.length) clearInterval(worker);
                }, 100);
            }
        }
    }
}
