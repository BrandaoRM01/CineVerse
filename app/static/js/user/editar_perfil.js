document.addEventListener('DOMContentLoaded', async () => {
    let form = document.querySelector('#form-editar-perfil');
    let mensagem_div = document.querySelector('#mensagem-editar');
    let username_input = document.querySelector('#username');
    let img_perfil_preview = document.querySelector('#img-perfil-previa');
    let foto_input = document.querySelector('#foto');

    try {
        let resposta = await fetch('/user/api/usuario');
        let data = await resposta.json();
        let usuario = data?.usuario || null;

        if (usuario) {
            username_input.value = usuario.username
                ? usuario.username.charAt(0).toUpperCase() + usuario.username.slice(1)
                : '';
            img_perfil_preview.src = usuario.imagem_url || '/static/img/default_user.jpg';
            img_perfil_preview.onerror = () => {
                img_perfil_preview.src = '/static/img/default_user.jpg';
            };
        }
    }
    catch (erro) {
        console.error(erro);
    }

    if (foto_input && img_perfil_preview) {
        foto_input.addEventListener('change', () => {
            let file = foto_input.files[0];
            if (file) {
                img_perfil_preview.src = URL.createObjectURL(file);
            }
        });

        img_perfil_preview.addEventListener('click', () => foto_input.click());
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            mensagem_div.innerHTML = '';

            let username = username_input.value.trim();
            let foto = foto_input.files[0];

            if (!username) {
                mensagem_div.textContent = 'Digite um username.';
                mensagem_div.className = 'mt-3 text-danger text-center';
                return;
            }

            let dados = new FormData();
            dados.append('username', username);
            if (foto) dados.append('imagem', foto);

            try {
                let resposta = await fetch('/user/editar_perfil', {
                    method: 'POST',
                    body: dados
                });

                let resultado = await resposta.json();

                if (resultado.sucesso) {
                    mensagem_div.textContent = resultado.sucesso;
                    mensagem_div.className = 'mt-3 text-success text-center';
                    setTimeout(() => window.location.href = '/', 1500);
                }
                else {
                    mensagem_div.textContent = resultado.erro || 'Erro desconhecido.';
                    mensagem_div.className = 'mt-3 text-danger text-center';
                }
            }
            catch (erro) {
                mensagem_div.innerHTML = '<div class="alert alert-danger">Erro na conexão com o servidor.</div>';
                console.error(erro);
            }
        });

        let inputs = document.querySelectorAll('#form-editar-perfil input');
        for (let input of inputs) {
            input.addEventListener('focus', () => {
                mensagem_div.innerHTML = '';
            });
        }
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted && mensagem_div) {
            mensagem_div.innerHTML = '';
        }
    });
});