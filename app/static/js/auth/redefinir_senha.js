document.addEventListener('DOMContentLoaded', () => {
    let form = document.querySelector('#form-nova-senha');
    let mensagem_div = document.querySelector('#mensagem-nova-senha');

    let params = new URLSearchParams(window.location.search);
    let token = params.get('token');
    let input_token = document.querySelector('input[name="token"]');
    if (input_token && token) input_token.value = token;

    if (form) {
        let alternar_senha = (input, botao) => {
            let icone = botao.querySelector('img');
            botao.addEventListener('click', () => {
                if (input.type === 'password') {
                    input.type = 'text';
                    icone.src = '/static/img/close_eye.svg';
                }
                else {
                    input.type = 'password';
                    icone.src = '/static/img/open_eye.svg';
                }
            });
        };

        let input_senha = document.querySelector('#senha');
        let btn_mudar_senha = document.querySelector('#mudar-senha');
        alternar_senha(input_senha, btn_mudar_senha);

        let input_confirmar = document.querySelector('#confirmar_senha');
        let btn_mudar_confirmar = document.querySelector('#mudar-confirmar-senha');
        alternar_senha(input_confirmar, btn_mudar_confirmar);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            mensagem_div.innerHTML = '';

            let senha = input_senha.value;
            let confirmar = input_confirmar.value;
            let tokenValue = input_token ? input_token.value.trim() : null;

            if (!senha || !confirmar) {
                mensagem_div.textContent = 'Por favor, preencha todos os campos.';
                mensagem_div.className = 'mt-3 text-danger text-center';
                return;
            }

            if (senha.length < 8) {
                mensagem_div.textContent = 'A senha deve ter pelo menos 8 caracteres.';
                mensagem_div.className = 'mt-3 text-danger text-center';
                return;
            }

            if (senha !== confirmar) {
                mensagem_div.textContent = 'As senhas não coincidem.';
                mensagem_div.className = 'mt-3 text-danger text-center';
                return;
            }

            if (!tokenValue) {
                mensagem_div.textContent = 'Token inválido ou ausente.';
                mensagem_div.className = 'mt-3 text-danger text-center';
                return;
            }

            let dados = new FormData();
            dados.append('token', tokenValue);
            dados.append('senha', senha);
            dados.append('confirmar_senha', confirmar);

            try {
                let resposta = await fetch('/auth/redefinir_senha', {
                    method: 'POST',
                    body: dados
                });

                let resultado = await resposta.json();

                if (resultado.sucesso) {
                    mensagem_div.textContent = resultado.sucesso;
                    mensagem_div.className = 'mt-3 text-success text-center';
                    setTimeout(() => { window.location.href = '/login'; }, 1500);
                }
                else {
                    mensagem_div.textContent = resultado.erro || 'Erro ao redefinir senha.';
                    mensagem_div.className = 'mt-3 text-danger text-center';
                }
            }
            catch (erro) {
                mensagem_div.innerHTML = '<div class="alert alert-danger">Erro na conexão com o servidor.</div>';
                console.error(erro);
            }
        });

        let inputs = form.querySelectorAll('input');
        for (let input of inputs) {
            input.addEventListener('focus', () => { mensagem_div.innerHTML = ''; });
        }
    }

    window.addEventListener('pageshow', (e) => {
        if (e.persisted && mensagem_div) mensagem_div.innerHTML = '';
    });
});