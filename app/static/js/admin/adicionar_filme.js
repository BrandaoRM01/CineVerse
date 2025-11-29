document.addEventListener('DOMContentLoaded', async () => {
    let base_poster_local = '/static/uploads/poster/';
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
        if (!valor) return false;
        if (valor === "null") return false;
        if (typeof valor === "string" && valor.trim() === "") return false;
        return true;
    }

    async function escolher_poster(filme) {
        let poster_final = default_poster;

        if (validar_valor(filme.poster_custom)) {
            let url = filme.poster_custom;
            if (await url_existe(url)) {
                return url;
            }
        }

        if (validar_valor(filme.poster_path)) {
            let url_local = base_poster_local + filme.poster_path.replace('/', '');
            if (await url_existe(url_local)) {
                return url_local;
            }
        }

        if (validar_valor(filme.poster_path)) {
            return `https://image.tmdb.org/t/p/w200${filme.poster_path}`;
        }

        return default_poster;
    }

    let filmes_lista = [];
    let form_adicionar = document.querySelector('#form-adicionar-filme');
    let input_titulo = document.querySelector('#titulo');
    let mensagem_adicionar = document.querySelector('#mensagem-adicionar');
    let tabela_container = document.querySelector('#tabela-filmes-container');

    let carregar_filmes = async () => {
        try {
            let resposta = await fetch('/filmes/listar');
            if (!resposta.ok) throw new Error();
            filmes_lista = await resposta.json();
        }
        catch {
            mensagem_adicionar.textContent = 'Não foi possível carregar os filmes.';
            mensagem_adicionar.className = 'text-danger text-center';
            return;
        }

        montar_tabela();
    };

    window.deletar_filme = async (id, titulo) => {
        if (!confirm(`Tem certeza que deseja deletar o filme "${titulo}"?`)) return;

        try {
            let resposta = await fetch(`/admin/deletar/${id}`, { method: 'POST' });
            let data = await resposta.json();

            if (resposta.ok && data.sucesso) {
                alert(data.sucesso);
                await carregar_filmes();
            }
            else {
                alert(data.erro || 'Erro ao deletar filme.');
            }
        }
        catch {
            mensagem_adicionar.textContent = 'Erro ao deletar filme.';
            mensagem_adicionar.className = 'text-danger text-center';
        }
    };

    let montar_tabela = async () => {
        if (filmes_lista.length === 0) {
            tabela_container.innerHTML = `<p class="text-center text-light">Nenhum filme cadastrado ainda.</p>`;
            return;
        }

        let tabela_html =
            `
            <table class="table table-dark table-striped table-hover table-bordered align-middle text-light">
                <thead style="background-color:#343a40; color:white;">
                    <tr>
                        <th>Poster</th>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Data de Lançamento</th>
                        <th>Avaliação</th>
                        <th>Gêneros</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let filme of filmes_lista) {

            let generos_txt = '';

            if (Array.isArray(filme.generos)) {
                generos_txt = filme.generos.join(', ');
            }
            else if (typeof filme.generos === 'string') {
                try {
                    generos_txt = JSON.parse(filme.generos).join(', ');
                }
                catch {
                    generos_txt = filme.generos;
                }
            }

            let poster_src = await escolher_poster(filme);

            tabela_html +=
                `
                <tr>
                    <td>
                        <img 
                            src="${poster_src}"
                            alt="${filme.titulo}"
                            onerror="this.onerror=null; this.src='${default_poster}';"
                            style="width:80px; height:120px; object-fit:cover;"
                            class="rounded"
                        >
                    </td>

                    <td>${filme.titulo}</td>

                    <td>${filme.descricao?.length > 120 ? filme.descricao.slice(0, 120) + '...' : (filme.descricao || '')}</td>

                    <td>${filme.data_lancamento || ''}</td>

                    <td>${filme.avaliacao ?? ''}</td>

                    <td>${generos_txt}</td>

                    <td class="text-center">
                        <div class="d-flex justify-content-center align-items-center gap-2">

                            <button
                                class="btn btn-outline-warning w-100 mt-auto"
                                onclick="window.location.href='/editar_filme/${filme.tmdb_id}'"
                            >Editar</button>

                            <button
                                class="btn btn-outline-danger w-100 mt-auto"
                                onclick="deletar_filme(${filme.tmdb_id}, '${filme.titulo.replace(/'/g, "\\'")}')"
                            >Deletar</button>

                        </div>
                    </td>

                </tr>
            `;
        }

        tabela_html +=
            `
                </tbody>
            </table>
        `;

        tabela_container.innerHTML = tabela_html;
    };

    if (form_adicionar) {
        form_adicionar.addEventListener('submit', async (e) => {
            e.preventDefault();
            mensagem_adicionar.textContent = '';

            let titulo_valor = input_titulo.value.trim();
            if (!titulo_valor) {
                mensagem_adicionar.textContent = 'Digite o título do filme.';
                mensagem_adicionar.className = 'text-danger text-center';
                return;
            }

            try {
                let formData = new FormData();
                formData.append('titulo', titulo_valor);

                let resposta = await fetch('/admin/adicionar', {
                    method: 'POST',
                    body: formData
                });

                let data = await resposta.json();

                if (resposta.ok && data.sucesso) {
                    mensagem_adicionar.textContent = data.sucesso;
                    mensagem_adicionar.className = 'text-success text-center';

                    input_titulo.value = '';
                    await carregar_filmes();
                }
                else {
                    mensagem_adicionar.textContent = data.erro || 'Erro ao adicionar filme.';
                    mensagem_adicionar.className = 'text-danger text-center';
                }
            }
            catch {
                mensagem_adicionar.textContent = 'Erro ao adicionar filme.';
                mensagem_adicionar.className = 'text-danger text-center';
            }
        });
    }

    form_adicionar.addEventListener('focusin', () => mensagem_adicionar.textContent = '');

    document.addEventListener('click', (e) => {
        if (!mensagem_adicionar.contains(e.target)) {
            mensagem_adicionar.textContent = '';
            mensagem_adicionar.className = '';
        }
    });

    if (input_titulo) {
        input_titulo.addEventListener('focus', () => {
            mensagem_adicionar.textContent = '';
            mensagem_adicionar.className = '';
        });
    }

    await carregar_filmes();
});