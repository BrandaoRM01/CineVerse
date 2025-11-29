document.addEventListener('DOMContentLoaded', async () => {
    let default_poster = '/static/img/default_movie.png';

    async function url_existe(url) {
        try {
            let resp = await fetch(url, { method: 'HEAD' });
            return resp.ok;
        }
        catch {
            return false;
        }
    }

    function validar_valor(valor) {
        return valor && valor !== 'null' && (typeof valor !== 'string' || valor.trim() !== '');
    }

    async function escolher_poster(filme) {
        if (validar_valor(filme.poster_custom) && await url_existe(filme.poster_custom)) {
            return filme.poster_custom;
        }

        if (validar_valor(filme.poster_path)) {
            let tmdb_url = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
            if (await url_existe(tmdb_url)) return tmdb_url;
        }

        return default_poster;
    }

    function gerar_card(filme, tipo, poster_src) {
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4 card-container">
                <div class="card bg-black text-light shadow h-100 border-secondary d-flex flex-column">

                    <img src="${poster_src}"
                         alt="${filme.titulo}"
                         class="img-filme"
                         style="height:400px;object-fit:cover;">

                    <div class="card-body d-flex flex-column">

                        <h5 class="card-title fw-bold text-danger">${filme.titulo}</h5>

                        <p class="card-text" style="flex-grow:1;">
                            ${filme.descricao.length > 100 ? filme.descricao.slice(0, 100) + "..." : filme.descricao}
                        </p>

                        <p class="card-text text-secondary small">
                            Lançamento: ${filme.data_lancamento}
                        </p>

                        <p class="card-text text-warning small mb-2">
                            Avaliação: ${filme.avaliacao}
                        </p>

                        <a href="/detalhes_filme/${filme.tmdb_id}"
                           class="btn btn-outline-danger w-100 mt-auto mb-2">
                            Ver mais
                        </a>

                        <button class="btn btn-outline-danger w-100"
                                onclick="remover_filme('${tipo}','${filme.tmdb_id}', this)">
                            Remover
                        </button>

                    </div>
                </div>
            </div>
        `;
    }

    let filmes_favoritos = document.querySelector("#filmes-favoritos");
    let filmes_interesse = document.querySelector("#filmes-interesse");
    let filmes_assistidos = document.querySelector("#filmes-assistidos");
    if (!filmes_favoritos || !filmes_interesse || !filmes_assistidos) return;

    let usuario = null;
    let filmes = [];

    try {
        let resp = await fetch("/user/api/usuario");
        let data = await resp.json();
        usuario = data?.usuario || null;
    }
    catch {
        usuario = null;
    }

    if (!usuario) {
        let msg = `<p class="text-center text-light">Faça login para ver seus filmes salvos.</p>`;
        filmes_favoritos.innerHTML = filmes_interesse.innerHTML = filmes_assistidos.innerHTML = msg;
        return;
    }

    try {
        let resp = await fetch("/filmes/listar");
        filmes = await resp.json();
    }
    catch {
        let msg = `<p class="text-danger text-center">Não foi possível carregar os filmes.</p>`;
        filmes_favoritos.innerHTML = filmes_interesse.innerHTML = filmes_assistidos.innerHTML = msg;
        return;
    }

    for (let filme of filmes) {
        let poster_src = await escolher_poster(filme);

        if (usuario.favoritos.includes(Number(filme.tmdb_id))) {
            filmes_favoritos.innerHTML += gerar_card(filme, "favorito", poster_src);
        }

        if (usuario.assistir_mais_tarde.includes(Number(filme.tmdb_id))) {
            filmes_interesse.innerHTML += gerar_card(filme, "assistir_mais_tarde", poster_src);
        }

        if (usuario.assistidos.includes(Number(filme.tmdb_id))) {
            filmes_assistidos.innerHTML += gerar_card(filme, "assistido", poster_src);
        }
    }

    window.remover_filme = async (tipo, tmdb_id, botao) => {
        if (!confirm("Deseja realmente remover este filme?")) return;

        try {
            let resp = await fetch(`/user/remover_filme/${tipo}/${tmdb_id}`, { method: "POST" });
            if (!resp.ok) throw new Error("Erro ao remover filme");

            let card = botao.closest(".card-container");
            if (card) card.remove();

            atualizar_mensagens();
            alert("Filme removido com sucesso.");
        }
        catch {
            alert("Erro ao remover o filme.");
        }
    };

    function atualizar_mensagens() {
        if (!filmes_favoritos.innerHTML.trim())
            filmes_favoritos.innerHTML = `<p class="text-center text-light">Nenhum Filme Salvo em Favoritos</p>`;
        if (!filmes_interesse.innerHTML.trim())
            filmes_interesse.innerHTML = `<p class="text-center text-light">Nenhum Filme Salvo em Assistir Mais Tarde</p>`;
        if (!filmes_assistidos.innerHTML.trim())
            filmes_assistidos.innerHTML = `<p class="text-center text-light">Nenhum Filme Salvo em Assistidos</p>`;
    }

    atualizar_mensagens();
});