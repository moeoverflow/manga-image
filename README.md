# manga-image
show manga image without white background.

## Usage

```javascript
new MangaImage({
    el: document.getElementsByTagName('article')[0], // section filter.
    //imgClass: 'manga-image', //class filter.
    auto: true, // auto recognize black and white image.
    scale: 0.85 // recommend 0.8 ~ 0.95.
});
```

External image links must support CORS.

Not support IE.

## LICENSE

This project is published under MIT License. See the LICENSE file for more.