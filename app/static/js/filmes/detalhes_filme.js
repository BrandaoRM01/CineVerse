document.addEventListener('DOMContentLoaded', async () => {
    let detalhes_container = document.querySelector('#detalhes-filme');
    let mensagem = document.querySelector('#mensagem');

    let caminho = window.location.pathname.split('/');
    let filme_id = parseFloat(caminho[caminho.length - 1]);

    async function url_existe(url) {
        try {
            let resp = await fetch(url, { method: 'HEAD' });
            return resp.ok;
        }
        catch {
            return false;
        }
    }

    try {
        let resposta = await fetch(`/filmes/detalhes/${filme_id}`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar detalhes do filme.');
        }

        let filme = await resposta.json();

        let poster_final = '/static/img/default_movie.png';

        if (filme.poster_custom && filme.poster_custom.trim() !== '') {
            if (await url_existe(filme.poster_custom)) {
                poster_final = filme.poster_custom;
            }
            else if (filme.poster_path && filme.poster_path.trim() !== '') {
                let tmdb = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
                if (await url_existe(tmdb)) poster_final = tmdb;
            }
        }
        else if (filme.poster_path && filme.poster_path.trim() !== '') {
            let tmdb = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
            if (await url_existe(tmdb)) poster_final = tmdb;
        }

        let trailer_embed = filme.trailer_url
            ? filme.trailer_url.replace('watch?v=', 'embed/')
            : null;

        detalhes_container.innerHTML = `
        <div class="row">

            <div class="col-md-5 text-center">
                <img 
                    src="${poster_final}" 
                    alt="Capa de ${filme.titulo}" 
                    class="img-fluid rounded shadow-sm poster-ajustado"
                    onerror="this.src='/static/img/default_movie.png'"
                >
            </div>

            <div class="col-md-7">
                <h2>${filme.titulo}</h2>

                <p><strong>Diretor:</strong> ${filme.diretor || 'Não informado'}</p>
                <p><strong>Gêneros:</strong> ${(filme.generos || []).join(', ') || 'Não especificado'}</p>
                <p><strong>Atores Principais:</strong> ${(filme.atores_principais || []).join(', ') || 'Não informados'}</p>
                <p><strong>Lançamento:</strong> ${filme.data_lancamento || 'Desconhecida'}</p>

                <p><strong>Sinopse:</strong></p>
                <p>${filme.descricao || 'Sem descrição disponível.'}</p>

                <p><strong>Avaliação:</strong> ⭐ ${!isNaN(parseFloat(filme.avaliacao))
                ? parseFloat(filme.avaliacao).toFixed(1)
                : 'N/A'}
                </p>

                ${trailer_embed
                ? `
                        <div class="ratio ratio-16x9 mt-3">
                            <iframe 
                                src="${trailer_embed}" 
                                title="Trailer de ${filme.titulo}" 
                                allowfullscreen
                            ></iframe>
                        </div>
                    `
                : ''
            }

                <a onclick="history.back()" class="btn btn-outline-danger w-100 mt-auto"> Voltar </a>

            </div>

        </div>
    `;

    }
    catch (erro) {
        console.error(erro);

        mensagem.classList.remove('d-none', 'alert-success');
        mensagem.classList.add('alert-danger');
        mensagem.textContent = 'Não foi possível carregar os detalhes do filme.';
    }
});