# Photo Album
A nice one page site to display photos.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/C1200/photoalbum)

## Setup

1. Upload photos to some sort of host.
2. Edit the title in `data.js`.
3. Add a new collection object to the collections array in `data.js` and give it a name.
4. In the collection object create a new array called photos. This is where you put the photo object.
5. Add a new photo object to the array and give it a caption and the url of where the photo is hosted.

## Objects

### Collection

name: `string` The name of the collection.

photos: `Photo[]` The photos in the collection.

### Photo

caption: `string` The caption of the photo.

url: `string` The url of the photo.

## To Do

- Next/previous photo button
- Slide show button
- Caching