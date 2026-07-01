async function loadAnimes(query = '') {
    const grid = document.getElementById('anime-grid');
    const title = document.getElementById('section-title');
    
    grid.innerHTML = '<div class="col-span-full text-center py-12 text-zinc-500">Carregando animes...</div>';
    
    let url = 'https://api.jikan.moe/v4/top/anime?limit=24';
    if (query) {
        url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=24`;
        title.textContent = `Resultados para "${query}"`;
    } else {
        title.textContent = 'Animes Populares';
    }
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        grid.innerHTML = '';
        document.getElementById('result-count').textContent = `${data.data.length} animes`;
        
        data.data.forEach(anime => {
            const card = document.createElement('div');
            card.className = "group cursor-pointer";
            card.innerHTML = `
                <div class="bg-zinc-900 rounded-3xl overflow-hidden border border-transparent group-hover:border-yellow-500/30 transition-colors">
                    <img src="${anime.images.jpg.image_url}" 
                         class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                         alt="${anime.title}">
                    <div class="p-4">
                        <p class="font-medium text-sm line-clamp-2">${anime.title}</p>
                        <div class="flex justify-between mt-3 text-xs">
                            <span class="text-zinc-400">${anime.type || 'TV'}</span>
                            <span class="text-yellow-400 font-medium">${anime.score ? anime.score : '—'}</span>
                        </div>
                    </div>
                </div>
            `;
            card.onclick = () => showModal(anime);
            grid.appendChild(card);
        });
    } catch (e) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-red-400">Erro ao carregar os dados</div>';
    }
}

function searchAnime() {
    const query = document.getElementById('search').value.trim();
    loadAnimes(query);
}

async function showRandom() {
    try {
        const res = await fetch('https://api.jikan.moe/v4/random/anime');
        const data = await res.json();
        showModal(data.data);
    } catch (e) {
        alert('Não foi possível carregar anime aleatório');
    }
}

function showModal(anime) {
    document.getElementById('modal-img').style.backgroundImage = `url(${anime.images.jpg.large_image_url || anime.images.jpg.image_url})`;
    document.getElementById('modal-title').textContent = anime.title;
    document.getElementById('modal-info').innerHTML = `
        ${anime.score ? `★ ${anime.score}` : ''} • 
        ${anime.episodes ? anime.episodes + ' episódios' : 'Em exibição'}
    `;
    document.getElementById('modal-synopsis').textContent = anime.synopsis || 'Sinopse não disponível.';
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').showModal();
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
    modal.close();
}
// Inicialização
window.onload = () => loadAnimes();



//vendo se faco a aba de generos...
