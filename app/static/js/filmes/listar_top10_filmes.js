document.addEventListener('DOMContentLoaded', async () => {
    let lista_filmes = document.querySelector('#top10-filmes');
    if (!lista_filmes) return;

    async function url_existe(url) {
        try {
            let r = await fetch(url, { method: 'HEAD' });
            return r.ok;
        }
        catch {
            return false;
        }
    }

    let filmes = [];
    let usuario = null;

    try {
        let resp_usuario = await fetch('/user/api/usuario');
        let dados_usuario = await resp_usuario.json();
        usuario = dados_usuario?.usuario || null;
    }
    catch {
        usuario = null;
    }

    try {
        let resposta = await fetch('/filmes/top10');
        filmes = await resposta.json();
    }
    catch (erro) {
        lista_filmes.innerHTML = '<p class="text-danger text-center">Não foi possível carregar os filmes.</p>';
        return;
    }

    if (filmes.length === 0) {
        lista_filmes.innerHTML = '<p class="text-center text-light">Nenhum filme encontrado.</p>';
        return;
    }

    lista_filmes.innerHTML = '';

    for (let filme of filmes) {

        let poster_final = '/static/img/default_movie.png';

        if (filme.poster_custom && filme.poster_custom.trim() !== '') {
            if (await url_existe(filme.poster_custom)) {
                poster_final = filme.poster_custom;
            }
            else if (filme.poster_path) {
                let url_tmdb = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
                if (await url_existe(url_tmdb)) poster_final = url_tmdb;
            }
        }
        else if (filme.poster_path) {
            let url_tmdb = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
            if (await url_existe(url_tmdb)) poster_final = url_tmdb;
        }

        let posicao = filmes.indexOf(filme) + 1;
        let favorito = usuario?.favoritos?.includes(Number(filme.tmdb_id));
        let assistido = usuario?.assistidos?.includes(Number(filme.tmdb_id));
        let pretende_assistir = usuario?.assistir_mais_tarde?.includes(Number(filme.tmdb_id));

        let classe_top = '';
        if (posicao === 1) classe_top = 'top1';
        else if (posicao === 2) classe_top = 'top2';
        else if (posicao === 3) classe_top = 'top3';

        lista_filmes.innerHTML += `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card bg-black text-light shadow h-100 border-secondary d-flex flex-column position-relative">

                <div class="position-absolute top-0 start-0 text-black fw-bold px-2 py-1 rounded-bottom shadow ${classe_top}" 
                     style="font-size: 1.1rem;">
                    #${posicao}
                </div>

                <img src="${poster_final}"
                     alt="${filme.titulo}"
                     class="img-filme"
                     style="height:400px;object-fit:cover;"
                     onerror="this.src='/static/img/default_movie.png'">

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold text-danger">${filme.titulo}</h5>

                    <p class="card-text text-light" style="flex-grow: 1;">
                        ${filme.descricao.length > 100 ? filme.descricao.slice(0, 100) + '...' : filme.descricao}
                    </p>

                    <p class="card-text text-secondary small">Lançamento: ${filme.data_lancamento}</p>

                    <p class="card-text text-warning small mb-2">Avaliação: ${filme.avaliacao}</p>

                    <a href="/detalhes_filme/${filme.tmdb_id}" 
                       class="btn btn-outline-danger w-100 mt-auto mb-2">
                       Ver mais
                    </a>

                    ${usuario ? `
                        <div class="caixa-botoes">
                            <span 
                                class="icone ${favorito ? 'ativo-favorito' : ''}" 
                                data-texto="Favorito"
                                onclick="mudar_status('${filme.tmdb_id}', 'favorito', this)">
                                ⭐
                            </span>

                            <span 
                                id="icone-pretende-${filme.tmdb_id}"
                                class="icone ${pretende_assistir ? 'ativo-pretender' : ''}" 
                                data-texto="Assistir Mais Tarde"
                                style="${assistido ? 'display:none;' : ''}"
                                onclick="mudar_status('${filme.tmdb_id}', 'assistir_mais_tarde', this)">
                                ⏳
                            </span>

                            <span 
                                id="icone-assistido-${filme.tmdb_id}"
                                class="icone ${assistido ? 'ativo-assistido' : ''}" 
                                data-texto="Assistido"
                                style="${pretende_assistir ? 'display:none;' : ''}"
                                onclick="mudar_status('${filme.tmdb_id}', 'assistido', this)">
                                ✔️
                            </span>
                        </div>
                    ` : `
                        <p class="text-secondary text-center mt-2 small"></p>
                    `}
                </div>
            </div>
        </div>
        `;
    }
});

window.mudar_status = async (filme_id, tipo, icone) => {
    try {
        let resp = await fetch(`/user/filme/${filme_id}/${tipo}`, { method: 'POST' });
        let dados = await resp.json();

        if (!resp.ok) {
            alert(dados.erro || 'Erro ao atualizar status.');
            return;
        }

        let marcado = dados.marcado;

        if (tipo === 'favorito') icone.classList.toggle('ativo-favorito');
        if (tipo === 'assistido') icone.classList.toggle('ativo-assistido');
        if (tipo === 'assistir_mais_tarde') icone.classList.toggle('ativo-pretender');

        let icone_assistido = document.querySelector(`#icone-assistido-${filme_id}`);
        let icone_pretende = document.querySelector(`#icone-pretende-${filme_id}`);

        if (tipo === 'assistido') {
            if (marcado) icone_pretende.style.display = "none";
            else icone_pretende.style.display = "inline-block";
        }

        if (tipo === 'assistir_mais_tarde') {
            if (marcado) icone_assistido.style.display = "none";
            else icone_assistido.style.display = "inline-block";
        }

    }
    catch {
        alert('Erro ao conectar ao servidor.');
    }
};