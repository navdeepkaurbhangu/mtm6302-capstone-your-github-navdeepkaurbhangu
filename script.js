document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('date-form');
    const apodContainer = document.getElementById('apod-container');
    const favouritesContainer = document.getElementById('favourites-container');

    const apiKey = '6GGh12bLupFe7UheeGeRuWa3S5hFLP8oJqC0iuDZ'; // Replace with your NASA API key

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const date = document.getElementById('date-input').value;
        if (date) {
            const apodData = await fetchApodData(date);
            displayApod(apodData);
        }
    });

    function fetchApodData(date) {
        return fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`)
            .then(response => response.json())
            .catch(error => console.error('Error fetching APOD data:', error));
    }

    function displayApod(data) {
        const { url, title, date, explanation, hdurl } = data;
        apodContainer.innerHTML = `
            <h3>${title}</h3>
            <p>${date}</p>
            <img src="${url}" alt="${title}" id="apod-image">
            <p>${explanation}</p>
        `;
        const apodImage = document.getElementById('apod-image');
        apodImage.addEventListener('click', () => {
            window.open(hdurl, '_blank');
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save to Favourites';
        saveButton.className = 'btn btn-success my-3';
        saveButton.addEventListener('click', () => saveToFavourites(data));
        apodContainer.appendChild(saveButton);
    }

    function saveToFavourites(data) {
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        if (!favourites.some(fav => fav.date === data.date)) {
            favourites.push(data);
            localStorage.setItem('favourites', JSON.stringify(favourites));
            displayFavourites();
        }
    }

    function displayFavourites() {
        favouritesContainer.innerHTML = '';
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        favourites.forEach(favourite => {
            const { url, title, date } = favourite;
            const favouriteDiv = document.createElement('div');
            favouriteDiv.className = 'col-md-4 favourite';
            favouriteDiv.innerHTML = `
                <img src="${url}" alt="${title}">
                <button class="delete-button">Delete</button>
                <h5>${title}</h5>
                <p>${date}</p>
            `;
            favouriteDiv.querySelector('.delete-button').addEventListener('click', () => {
                deleteFavourite(date);
            });
            favouritesContainer.appendChild(favouriteDiv);
        });
    }

    function deleteFavourite(date) {
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        favourites = favourites.filter(favourite => favourite.date !== date);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        displayFavourites();
    }

    displayFavourites();
});
