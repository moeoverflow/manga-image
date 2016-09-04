MangaImage.prototype.transparent = function(img, options, callback) {
    if (options.scale) options.scale = 0.85
    img.crossOrigin = '';
    img.src = img.src;
    img.onload = function() {
        img.onload = null;
        var canvas = document.createElement('canvas');
        var width = img.naturalWidth, height = img.naturalHeight;
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext('2d');
        ctx.width = width;
        ctx.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        var imageData = ctx.getImageData(0, 0, width, height);
        var pixel = imageData.data;
        var r = 0, g = 1, b = 2, a = 3;
        options.scale *= 255;

        var gray = 0, color = 0;
        for (var p = 0; p < pixel.length; p += 4) {
            if (options.auto) {
                //0-510
                var value = (Math.abs(pixel[p+r] - pixel[p+g]) +
                Math.abs(pixel[p+r] - pixel[p+b]) +
                Math.abs(pixel[p+g] - pixel[p+b]));
                if (value < 10) {
                    gray++;
                } else {
                    color++;
                }
            }
            if (options.scale <= pixel[p+r] &&
                options.scale <= pixel[p+g] &&
                options.scale <= pixel[p+b]) {
                pixel[p+a] = 0;
            }
        }
        if (options.auto) {
            var ratio = gray / (gray + color)
            if (ratio < 0.2) {
                // console.log(this.src +' is full color img');
                return;
            } else if (ratio < 0.5) {
                // console.log(this.src +' is more color img');
                return;
            } else if (ratio < 0.95) {
                // console.log(this.src +' is more gray img');
            } else {
                // console.log(this.src +' is gray img');
            }
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.style.width = img.width + 'px';
        canvas.style.height = img.height + 'px';
        img.style.display = 'none';
        img.parentNode.insertBefore(canvas, img.nextSibling);
        img.parentNode.removeChild(img);
        callback();
    }
}

function MangaImage(options) {
    this.el = options.el;
    this.scale = options.scale;
    this.imgClass = options.imgClass
    this.auto = options.auto
    var manga = this;
    window.onload = function() {
        if (manga.el) {
            var images = Array.from(manga.el.getElementsByTagName('img'))
            .filter(function(img) {
                if (img.src.match(/\.(png|gif)$/)) return false;
                if (manga.imgClass) {
                    return (img.className.split(' ').indexOf(manga.imgClass) == -1 ? false : true);
                }
                return true;
            });
            if (images.length) {
                var i = 0;
                var transp = function() {
                    if (++i < images.length) manga.transparent(images[i], options, transp);
                }
                manga.transparent(images[0], options, transp);
            }
        }
    }
}
