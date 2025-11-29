document.addEventListener('DOMContentLoaded', async () => {
    let form_editar = document.querySelector('#form-editar-filme');
    let campos_div = document.querySelector('#campos-editar');
    let mensagem = document.querySelector('#mensagem_editar');

    let tmdb_id = parseInt(window.location.pathname.split('/').pop());

    function title(str) {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    let carregar_filme = async (id) => {
        try {
            let resposta = await fetch(`/admin/editar/${id}`);
            if (!resposta.ok) throw new Error();

            let filme = await resposta.json();
            campos_div.innerHTML = '';

            let poster_url =
                filme.poster_custom && filme.poster_custom.trim() !== ""
                    ? filme.poster_custom
                    : (filme.poster_path && filme.poster_path.trim() !== ""
                        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                        : '/static/img/default_movie.png');

            campos_div.innerHTML += `
                <div class="mb-3 text-center">
                    <img id="preview-poster"
                        src="${poster_url}"
                        alt="${filme.titulo}"
                        class="img-filme"
                        style="height:400px;object-fit:cover;cursor:pointer;border-radius:8px;"
                        onerror="this.src='${filme.poster_path ? `https://image.tmdb.org/t/p/w500${filme.poster_path}` : '/static/img/default_movie.png'}'">
                </div>

                <div class="mb-3 text-center">
                    <input type="file" id="poster_input" name="poster" accept="image/*"
                        class="form-control input-transparent" style="display:none;">
                    <button class="btn btn-outline-light" type="button" id="btn-trocar-poster">Trocar Pôster</button>
                </div>

                <div class="mb-3">
                    <label class="form-label text-light">Título: <span style="color:red">*</span></label>
                    <input type="text" name="titulo" value="${filme.titulo}" 
                        class="form-control input-transparent obrigatorio">
                </div>

                <div class="mb-3">
                    <label class="form-label text-light">Data lançamento: <span style="color:red">*</span></label>
                    <input type="date" name="data_lancamento" value="${filme.data_lancamento}"
                        class="form-control input-transparent obrigatorio">
                </div>

                <div class="mb-3">
                    <label class="form-label text-light">Diretor: <span style="color:red">*</span></label>
                    <input type="text" name="diretor" value="${filme.diretor}"
                        class="form-control input-transparent obrigatorio">
                </div>

                <div class="mb-3">
                    <label class="form-label text-light">Avaliação: <span style="color:red">*</span></label>
                    <input type="number" name="avaliacao" value="${filme.avaliacao}"
                        class="form-control input-transparent obrigatorio" readonly>
                </div>

                <div class="mb-3">
                    <label class="form-label text-light">Descrição: <span style="color:red">*</span></label>
                    <textarea name="descricao" rows="4"
                        class="form-control input-transparent obrigatorio descricao">${filme.descricao || ''}</textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label text-light">Gêneros: <span style="color:red">*</span></label>
                    <textarea name="generos" rows="2"
                        class="form-control input-transparent obrigatorio">${(filme.generos || []).join(', ')}</textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label text-light">Atores principais: <span style="color:red">*</span></label>
                    <textarea name="atores_principais" rows="2"
                        class="form-control input-transparent obrigatorio">${(filme.atores_principais || []).join(', ')}</textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label text-light">Trailer (URL do YouTube):</label>
                    <input type="text" id="trailer_input" name="trailer_url" value="${filme.trailer_url || ''}"
                        class="form-control input-transparent">
                </div>

                <div id="trailer_preview" class="mb-3 text-center"></div>
            `;

            document.querySelectorAll('.obrigatorio').forEach(campo => {
                if (campo.classList.contains('descricao')) {
                    campo.addEventListener('input', () => {
                        campo.value = campo.value[0].toUpperCase() + campo.value.slice(1);
                    });
                }
                else {
                    campo.addEventListener('input', () => {
                        campo.value = title(campo.value);
                    });
                }
            });

            let trailer_preview = document.querySelector('#trailer_preview');

            if (filme.trailer_url) {
                let embed_url = filme.trailer_url.replace('watch?v=', 'embed/');
                trailer_preview.innerHTML = `
                    <iframe 
                        width="560" 
                        height="315" 
                        src="${embed_url}"
                        class="rounded border border-secondary"
                        allowfullscreen>
                    </iframe>
                `;
            }

            let poster_img = document.querySelector('#preview-poster');
            let poster_input = document.querySelector('#poster_input');
            let btn_trocar_poster = document.querySelector('#btn-trocar-poster');

            poster_img.onerror = () => {
                if (filme.poster_path) {
                    poster_img.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
                }
                else {
                    poster_img.src = '/static/img/default_movie.png';
                }
            };

            poster_img.addEventListener('click', () => poster_input.click());
            btn_trocar_poster.addEventListener('click', () => poster_input.click());

            poster_input.addEventListener('change', () => {
                let file = poster_input.files[0];
                if (file) {
                    let url_temp = URL.createObjectURL(file);
                    let teste_img = new Image();
                    teste_img.src = url_temp;

                    teste_img.onload = () => {
                        poster_img.src = url_temp;
                    };

                    teste_img.onerror = () => {
                        poster_img.src = filme.poster_path
                            ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                            : '/static/img/default_movie.png';

                        mensagem.innerHTML = `<span class="text-danger">Pôster inválido. Usando imagem padrão.</span>`;
                    };
                }
            });

            let trailer_input = document.querySelector('#trailer_input');
            trailer_input.addEventListener('input', () => {
                let url = trailer_input.value.trim();
                if (!url) {
                    trailer_preview.innerHTML = '';
                    return;
                }

                if (!url.includes('watch?v=')) {
                    trailer_preview.innerHTML = `<span class="text-warning">URL inválida</span>`;
                    return;
                }

                let embed = url.replace('watch?v=', 'embed/');
                trailer_preview.innerHTML = `
                    <iframe 
                        width="560" 
                        height="315" 
                        src="${embed}"
                        class="rounded border border-secondary"
                        allowfullscreen>
                    </iframe>
                `;
            });

        }
        catch {
            mensagem.textContent = 'Não foi possível carregar o filme.';
            mensagem.className = 'text-danger text-center mb-3';
        }
    };

    if (form_editar) {
        form_editar.addEventListener('submit', async (e) => {
            e.preventDefault();

            mensagem.textContent = '';
            mensagem.className = '';

            let obrigatorios = form_editar.querySelectorAll('.obrigatorio');
            let erro = false;
            obrigatorios.forEach(campo => {
                if (!campo.value || campo.value.trim() === '') {
                    erro = true;
                }
            });

            if (erro) {
                mensagem.innerHTML = '<span class="text-danger">Por favor, preencha todos os campos obrigatórios.</span>';
                return;
            }

            let form_data = new FormData(form_editar);

            try {
                let resposta = await fetch(`/admin/editar/${tmdb_id}`, {
                    method: 'POST',
                    body: form_data
                });

                let data = await resposta.json();

                if (resposta.ok && data.sucesso) {
                    mensagem.textContent = data.sucesso;
                    mensagem.className = 'text-success text-center mb-3';
                    setTimeout(() => window.location.href = '/adicionar_filme', 1500);
                }
                else {
                    mensagem.textContent = data.erro || 'Erro ao editar filme.';
                    mensagem.className = 'text-danger text-center mb-3';
                }

            }
            catch {
                mensagem.textContent = 'Erro ao enviar os dados.';
                mensagem.className = 'text-danger text-center mb-3';
            }
        });
    }

    carregar_filme(tmdb_id);
});