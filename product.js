const beerArticle = document.getElementById('beer-article');
const imgField = document.getElementById('img-field');
const infoField = document.getElementById('info-field');

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let beerObj = JSON.parse(window.localStorage.getItem('beerObj'));
console.log(beerObj);

function updatePage(beer) {

    let image = document.createElement('img');
    let title = document.createElement('h1');
    let tagline = document.createElement('span');
    let desc = document.createElement('p');
    let food = document.createElement('p');
    let tips = document.createElement('p');
    let created = document.createElement('p');
    let volume = document.createElement('p');
    let heading = document.createElement('h2');
    let yeast = document.createElement('p');
    let hops = document.createElement('p');
    let malt = document.createElement('p');

    let dateArray = beer.first_brewed.split("/");
    let brewDate = new Date(dateArray[1], (dateArray[0] - 1));
    let dateString = `${months[brewDate.getMonth()]} ${brewDate.getFullYear()}`;

    title.innerText = `${beer.name} (${beer.abv}%)`;
    tagline.innerHTML = `<em>${beer.tagline}</em>`;
    desc.innerHTML = `<strong>Description:</strong> ${beer.description}`;
    food.innerHTML = `<strong>Served with:</strong> ${beer.food_pairing.join(', ')}.`;
    tips.innerHTML = `<strong>Brew tips:</strong> ${beer.brewers_tips}`;
    created.innerHTML = `<strong>First brewed:</strong> ${dateString}`;
    volume.innerHTML = `<strong>Volume:</strong> ${beer.volume.value} ${beer.volume.unit} 
    (<strong>Boil:</strong> ${beer.boil_volume.value} ${beer.boil_volume.unit})`;

    heading.innerText = "Ingredients";
    yeast.innerHTML = `<strong>Yeast:</strong> ${beer.ingredients.yeast}`;
    hops.innerHTML = "<strong>Hops:</strong><br>"
    malt.innerHTML = "<strong>Malt:</strong><br>"

    beer.ingredients.hops.forEach((element, index) => {
        hops.innerHTML += `<strong>${index + 1}. ${element.name}</strong> (${element.attribute}) 
            - add at ${element.add} (${element.amount.value} ${element.amount.unit})<br>`;
    });

    beer.ingredients.malt.forEach((element, index) => {
        malt.innerHTML += `<strong>${index + 1}. ${element.name}</strong> 
        (${element.amount.value} ${element.amount.unit})<br>`;
    });

    if (beer.image_url != null) {
        image.setAttribute('src', beer.image_url);
    } else {
        image.setAttribute('src', "https://via.placeholder.com/100x200?text=NO+IMG")
    }

    infoField.append(title, tagline, desc, food, tips, created, volume, heading, yeast, hops, malt);
    imgField.append(image);

}

updatePage(beerObj);