class DogApp {
    constructor() {
        this.apiKey = 'live_6itwyq9pwHqb3DGhEa5mQPoPm5w18i8W4tg2MOjMtzDsiqmsDMzwbmkrMz9Z6tTk';
        this.baseUrl = 'https://api.thedogapi.com/v1';
        this.favContainer = document.getElementById('favoritesGrid');
        this.loadFavorites();
    }

    async loadFavorites() {
        const res = await fetch(`${this.baseUrl}/favourites`, {
            headers: { 'x-api-key': this.apiKey }
        });
        const data = await res.json();

        // Limpar o container antes de adicionar novas imagens.
        this.favContainer.innerHTML = '';

        // Adicionar as imagens favoritas na grade com 03 colunas.
        data.forEach(fav => {
            const imgElement = document.createElement('img');
            imgElement.src = fav.image.url;
            this.favContainer.appendChild(imgElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DogApp();
});
