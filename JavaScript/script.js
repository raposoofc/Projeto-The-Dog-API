class DogApp {
    constructor() {
        this.apiKey = 'live_6itwyq9pwHqb3DGhEa5mQPoPm5w18i8W4tg2MOjMtzDsiqmsDMzwbmkrMz9Z6tTk';
        this.baseUrl = 'https://api.thedogapi.com/v1';
        this.currentImage = null;

        this.imgElement = document.getElementById('imagedogs');
        this.likeBtn = document.getElementById('like');
        this.dislikeBtn = document.getElementById('deslike');
        this.heartBtn = document.getElementById('heart');
        this.favsBtn = document.getElementById('favs');
        this.breedsBtn = document.getElementById('breeds');
        this.backBtn1 = document.getElementById('backToVoting1');
        this.backBtn2 = document.getElementById('backToVoting2');

        this.votingSection = document.getElementById('votingSection');
        this.favSection = document.getElementById('favoritesSection');
        this.breedsSection = document.getElementById('breedsSection');
        this.favContainer = document.getElementById('favoritesContainer');

        this.breedDropdown = document.getElementById('breedDropdown');
        this.breedImage = document.getElementById('breedImage');

        this.init();
    }

    init() {
        this.loadRandomDog();
        this.loadBreeds();
        this.likeBtn.addEventListener('click', () => this.vote(1));
        this.dislikeBtn.addEventListener('click', () => this.vote(0));
        this.heartBtn.addEventListener('click', () => this.favorite());
        this.favsBtn.addEventListener('click', () => this.showFavorites());
        this.breedsBtn.addEventListener('click', () => this.showBreeds());
        this.backBtn1.addEventListener('click', () => this.showVoting());
        this.backBtn2.addEventListener('click', () => this.showVoting());
        this.breedDropdown.addEventListener('change', () => this.showBreedImage());
    }

    async loadRandomDog() {
        const res = await fetch(`${this.baseUrl}/images/search`, {
            headers: { 'x-api-key': this.apiKey }
        });
        const data = await res.json();
        this.currentImage = data[0];
        this.imgElement.src = this.currentImage.url;
    }

    async vote(value) {
        if (!this.currentImage?.id) return;
        await fetch(`${this.baseUrl}/votes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey
            },
            body: JSON.stringify({
                image_id: this.currentImage.id,
                value: value
            })
        });
        this.loadRandomDog();
    }

    async favorite() {
        if (!this.currentImage?.id) return;
        await fetch(`${this.baseUrl}/favourites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey
            },
            body: JSON.stringify({ image_id: this.currentImage.id })
        });
        alert("Imagem favoritada!");
    }

    async showFavorites() {
        this.switchSection('favorites');
        const res = await fetch(`${this.baseUrl}/favourites`, {
            headers: { 'x-api-key': this.apiKey }
        });
        const data = await res.json();
        
        // Limpar o container antes de adicionar novas imagens.
        this.favContainer.innerHTML = '';

        // Criar a tabela com 03 colunas.
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const header1 = document.createElement('th');
        header1.textContent = 'Imagem';
        const header2 = document.createElement('th');
        header2.textContent = 'Remover';
        headerRow.appendChild(header1);
        headerRow.appendChild(header2);
        table.appendChild(headerRow);

        // Adicionar as imagens favoritadas na tabela.
        data.forEach(fav => {
            const row = document.createElement('tr');

            const imgCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = fav.image.url;
            imgCell.appendChild(img);

            const removeCell = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-btn');
            removeBtn.textContent = 'X';
            removeBtn.onclick = () => this.removeFavorite(fav.id);
            removeCell.appendChild(removeBtn);

            row.appendChild(imgCell);
            row.appendChild(removeCell);
            table.appendChild(row);
        });

        // Adicionar a tabela ao container de favoritos.
        this.favContainer.appendChild(table);
    }

    async removeFavorite(favId) {
        await fetch(`${this.baseUrl}/favourites/${favId}`, {
            method: 'DELETE',
            headers: { 'x-api-key': this.apiKey }
        });
        this.showFavorites();  // Atualizar a lista de favoritos a cada nova ação de favoritar na tela inicial.
    }

    async loadBreeds() {
        const res = await fetch(`${this.baseUrl}/breeds`, {
            headers: { 'x-api-key': this.apiKey }
        });
        const data = await res.json();
        this.breedDropdown.innerHTML = '<option value="">Selecione uma raça</option>';
        data.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            this.breedDropdown.appendChild(option);
        });
    }

    async showBreedImage() {
        const breedId = this.breedDropdown.value;
        if (!breedId) return;
        const res = await fetch(`${this.baseUrl}/images/search?breed_id=${breedId}`, {
            headers: { 'x-api-key': this.apiKey }
        });
        const data = await res.json();
        this.breedImage.src = data[0].url;
    }

    showBreeds() {
        this.switchSection('breeds');
    }

    showVoting() {
        this.switchSection('voting');
    }

    switchSection(section) {
        this.votingSection.style.display = section === 'voting' ? 'flex' : 'none';
        this.favSection.style.display = section === 'favorites' ? 'flex' : 'none';
        this.breedsSection.style.display = section === 'breeds' ? 'flex' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DogApp();
});
