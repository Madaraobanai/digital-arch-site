import { db, ref, push, set, onValue, serverTimestamp, query, limitToLast } from "./firebase.js";

const animeListEl = document.getElementById('anime-list');
const playerEl = document.getElementById('main-player');
const titleEl = document.getElementById('video-title');
const commentInput = document.getElementById('comment-input');
const sendBtn = document.getElementById('send-btn');
const commentsDisplay = document.getElementById('comments-display');

let currentAnimeId = "global";

// 1. BUSCAR ANIMES (JIKAN API)
async function fetchAnimes() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=20');
        const { data } = await response.json();
        
        animeListEl.innerHTML = data.map(anime => `
            <div class="anime-card" onclick="playAnime('${anime.mal_id}', '${anime.title.replace(/'/g, "")}')">
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <h4>${anime.title}</h4>
            </div>
        `).join('');
    } catch (err) {
        animeListEl.innerHTML = "<p>Erro ao carregar animes.</p>";
    }
}

// 2. FUNÇÃO PARA ASSISTIR
window.playAnime = (id, title) => {
    currentAnimeId = id;
    titleEl.innerText = "Assistindo: " + title;
    
    // Usando um provedor de embed que aceita ID do MyAnimeList (MAL_ID)
    // Nota: Verifique se o provedor está ativo. Exemplo comum:
    playerEl.src = `https://www.2embed.to/embed/anime/${id}/1/1`; 
    
    loadComments(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 3. COMENTÁRIOS EM TEMPO REAL
function loadComments(id) {
    const commentsRef = query(ref(db, `comments/${id}`), limitToLast(20));
    
    onValue(commentsRef, (snapshot) => {
        commentsDisplay.innerHTML = "";
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(msg => {
                const p = document.createElement('p');
                p.innerHTML = `<span>Anon:</span> ${msg.text}`;
                commentsDisplay.appendChild(p);
            });
            commentsDisplay.scrollTop = commentsDisplay.scrollHeight;
        }
    });
}

// 4. ENVIAR COMENTÁRIO
sendBtn.onclick = () => {
    const text = commentInput.value.trim();
    if (text) {
        const newMsgRef = push(ref(db, `comments/${currentAnimeId}`));
        set(newMsgRef, {
            text: text,
            timestamp: serverTimestamp()
        });
        commentInput.value = "";
    }
};

// Iniciar
fetchAnimes();
loadComments("global");
