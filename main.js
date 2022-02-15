const randomBtn = document.getElementById('random-btn');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const contentField = document.getElementById('content-field');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumField = document.getElementById('page-num-field');

let baseURL = "https://api.punkapi.com/v2/beers";
let itemsPerPage = 30;
let page = 1;
let searchTerm;
let hasSearched = false;

async function onPageLoad() {
    page = 1;
    let beers = await getAll();
    updateUI(beers);
}

searchBtn.addEventListener('click', async () => {
    if (searchInput.value != "") {
        page = 1;
        hasSearched = true;
        searchTerm = searchInput.value.replace(' ', '_');
        contentField.innerHTML = "";
        let beers = await getSearch();
        updateUI(beers);
    }
})

searchInput.addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
})

randomBtn.addEventListener('click', async () => {
    contentField.innerHTML = "";
    let beer = await getRandom();
    updateUI(beer);
})

prevPageBtn.addEventListener('click', async () => {
    page = page - 1;
    contentField.innerHTML = "";
    if (hasSearched) {
        let beers = await getSearch();
        updateUI(beers);
    } else {
        let beers = await getAll();
        updateUI(beers);
    }
})

nextPageBtn.addEventListener('click', async () => {
    page = page + 1;
    contentField.innerHTML = "";
    if (hasSearched) {
        let beers = await getSearch();
        updateUI(beers);
    } else {
        let beers = await getAll();
        updateUI(beers);
    }
})

function updateUI(beers) {

    if (beers.length < itemsPerPage) {
        nextPageBtn.style.display = "none";
    } else {
        nextPageBtn.style.display = "block";
    };

    if (page == 1) {
        prevPageBtn.style.display = "none";
    } else {
        prevPageBtn.style.display = "block";
    };

    pageNumField.value = `${page}`;

    beers.forEach(beer => {
        let article = document.createElement('article');
        let image = document.createElement('img');
        let imgField = document.createElement('figure');
        let textField = document.createElement('figure');
        let innerTextField = document.createElement('figure');
        let title = document.createElement('h3');
        let desc = document.createElement('p');

        if (beer.image_url != null) {
            image.setAttribute('src', beer.image_url);
        } else {
            image.setAttribute('src', "https://via.placeholder.com/100x200?text=NO+IMG")
        }

        article.addEventListener('click', function () {
            gotoBeerPage(beer);
        });

        article.setAttribute('class', 'item');
        imgField.setAttribute('class', 'img-field');
        textField.setAttribute('class', 'text-field');
        title.innerText = `${beer.name} (${beer.abv}%) `;
        desc.innerText = `${beer.description.slice(0, 120)}...`;

        contentField.appendChild(article);
        article.appendChild(imgField)
        article.appendChild(textField);
        imgField.appendChild(image);
        textField.appendChild(innerTextField);
        innerTextField.appendChild(title);
        innerTextField.appendChild(desc);
    });
}

function gotoBeerPage(beerObj) {
    console.log(beerObj);
    let overlay = document.querySelector('.overlay');
    let overlayItem = document.querySelector('.overlay-item');

    overlay.style.display = 'block';
    let image = document.createElement('img');
    let info = document.createElement('figure');
    let title = document.createElement('h2');
    let tagline = document.createElement('span');
    let desc = document.createElement('p');
    let food = document.createElement('p');

    let btn = document.createElement('button');

    if (beerObj.image_url != null) {
        image.setAttribute('src', beerObj.image_url);
    } else {
        image.setAttribute('src', "https://via.placeholder.com/100x200?text=NO+IMG")
    }

    title.innerHTML = `${beerObj.name} (${beerObj.abv}%)`;
    tagline.innerHTML = `<em>${beerObj.tagline}</em>`;
    desc.innerHTML = `<strong>Description: </strong>${beerObj.description}`;
    food.innerHTML = `<strong>Served with: </strong>${beerObj.food_pairing.join(', ')}.`;
    btn.innerText = "Read more..."

    overlayItem.append(image, info);
    info.append(title, tagline, desc, food);
    info.appendChild(btn);

    btn.addEventListener('click', () => {
        window.localStorage.setItem('beerObj', JSON.stringify(beerObj));
        window.location.href = "product.html";
    });

    overlay.addEventListener('click', clearModal);
}

function clearModal() {
    let overlay = document.querySelector('.overlay');
    let overlayItem = document.querySelector('.overlay-item');
    overlay.style.display = 'none';
    overlayItem.innerHTML = '';
}

async function getAll() {
    let fullURL = `${baseURL}?page=${page}&per_page=${itemsPerPage}`;
    let result = await getData(fullURL);
    return await result;
}

async function getSearch() {
    let fullURL = `${baseURL}?beer_name=${searchTerm}&page=${page}&per_page=${itemsPerPage}`;
    let result = await getData(fullURL);
    return await result;
}

async function getRandom() {
    let fullURL = `${baseURL}/random`;
    let result = await getData(fullURL);
    return await result;
}

async function getData(URLinput) {
    console.log(URLinput);
    try {
        let response = await fetch(URLinput);
        let data = await response.json();
        return await data;

    } catch (err) {
        console.error(err);
    }
}

window.onload = onPageLoad;