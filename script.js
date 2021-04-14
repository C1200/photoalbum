window.onload = () => {
    var data = document.createElement("script");
    data.src = "data.js";
    var style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "style.css";
    var colcontain = document.createElement("div");
    colcontain.className = "collection-container";
    var view = document.createElement("div");
    view.className = "view";
    document.body.append(colcontain, view, data, style);

    data.onload = () => {
        home();
        hash();
    }
}

document.onscroll = () => {
    var x = document.getElementsByClassName("controls-container")[0];
    x.style.bottom = `${10-window.scrollY}px`;
    var view = document.getElementsByClassName("view")[0];
    view.style.top = `${window.scrollY}px`;
}

var hash = () => {
    var q = new URLSearchParams(`?${location.hash.substr(1, location.hash.length)}`);

    if (q.has("col")) {
        loadcol(parseInt(q.get("col")));
    }
    if (q.has("view")) {
        if (!q.has("col")) { home(); return location.hash = "#"; }
        loadimg(parseInt(q.get("col")), parseInt(q.get("view")))
    }
    if (!q.has("view")) {
        document.getElementsByClassName("view")[0].style.display = "none";
    }
    if (!q.has("col") && !q.has("view")) {
        home();
    }
}

var loadcol = (idx) => {
    var colcontain = document.getElementsByClassName("collection-container")[0];
    var q = new URLSearchParams(`?${location.hash.substr(1, location.hash.length)}`);

    colcontain.innerHTML = "";

    if (!album.collections[idx]) {
        location.hash = "#";
        home();
    }

    var controls = document.createElement("div");
    controls.className = "controls-container";

    var x = document.createElement("span");
    x.innerHTML = "x";
    x.className = "controls";
    x.onclick = () => { q.delete("col"); location.hash = `#${q.toString()}`; hash(); }
    controls.append(x);
    colcontain.append(controls);

    document.title = `${album.collections[idx].name} - ${album.title}`;
    album.collections[idx].photos.forEach((image, idx) => {
        var c = document.createElement("div");
        var img = document.createElement("img");
        var p = document.createElement("p");
        c.className = "collection";
        img.src = image.url;
        c.append(img);
        p.innerText = image.caption;
        c.append(p);
        c.onclick = () => { q.set("view", idx); location.hash = `#${q.toString()}`; }
        colcontain.append(c);
    });
}

var loadimg = (col, img) => {
    var q = new URLSearchParams(`?${location.hash.substr(1, location.hash.length)}`);

    if (!album.collections[col].photos[img]) {
        location.hash = `#col=${col}`;
    }

    _filter = [];

    var controls = document.createElement("div");
    controls.className = "controls-container";

    var x = document.createElement("span");
    x.innerHTML = "x";
    x.className = "controls";
    x.onclick = () => { q.delete("view"); location.hash = `#${q.toString()}`; hash(); }
    controls.append(x);
    if (parseInt(q.get("view")) > 0) {
        var prev = document.createElement("span");
        prev.innerText = "<"
        prev.className = "controls";
        prev.onclick = () => { q.set("view", parseInt(q.get("view")) - 1); location.hash = `#${q.toString()}`; hash(); }
        controls.append(prev);
    }
    if (parseInt(q.get("view")) < album.collections[col].photos.length-1) {
        var next = document.createElement("span");
        next.innerText = ">"
        next.className = "controls";
        next.onclick = () => { q.set("view", parseInt(q.get("view")) + 1); location.hash = `#${q.toString()}`; hash(); }
        controls.append(next);
    }

    var image = document.createElement("img");

    var filters = document.createElement("div");
    filters.className = "filters-container";
    filters.innerText = "Filters:"

    var bandw = document.createElement("button");
    bandw.innerText = "Black and White";
    bandw.onclick = () => filter(image, "grayscale");
    filters.append(bandw);
    var negative = document.createElement("button");
    negative.innerText = "Negative";
    negative.onclick = () => filter(image, "invert");
    filters.append(negative);
    var sepia = document.createElement("button");
    sepia.innerText = "Sepia";
    sepia.onclick = () => filter(image, "sepia");
    filters.append(sepia);

    image.src = album.collections[col].photos[img].url;
    image.title = "Click to open image in new tab";
    image.onclick = () => window.open(album.collections[col].photos[img].url);
    var p = document.createElement("p");
    p.innerText = album.collections[col].photos[img].caption;
    document.getElementsByClassName("view")[0].innerHTML = "";
    document.getElementsByClassName("view")[0].append(controls, image, p, filters);
    document.getElementsByClassName("view")[0].style.display = "block";
}

var home = () => {
    var colcontain = document.getElementsByClassName("collection-container")[0];
    colcontain.innerHTML = "";
    document.getElementsByClassName("view")[0].style.display = "none";

    var q = new URLSearchParams(`?${location.hash.substr(1, location.hash.length)}`);

    document.title = album.title;

    if (q.has("col")) return loadcol(parseInt(q.get("col")));

    album.collections.forEach((collection, idx) => {
        var c = document.createElement("div");
        var img = document.createElement("img");
        var p = document.createElement("p");
        c.className = "collection";
        img.src = collection.photos[0].url;
        c.append(img);
        p.innerText = collection.name;
        c.append(p);
        c.onclick = () => location.hash = `#col=${idx}`;
        colcontain.append(c);
    });
}

var _filter = [];
var filter = (i, f) => {
    f = `${f}()`;
    if (!_filter.find(_ => _ === f)) _filter.push(f);
    else _filter = _filter.filter(_ => _ !== f);
    i.style.filter = _filter.join(" ");
}

window.onhashchange = hash;
