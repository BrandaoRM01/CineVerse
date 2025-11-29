let form = document.querySelector('#form-login');
let mensagem_div = document.querySelector('#mensagem-login');

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
    let btn_mudar_senha = document.querySelector('#mudar-senha-login');
    alternar_senha(input_senha, btn_mudar_senha);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensagem_div.innerHTML = '';

        let email = form.querySelector('#email').value.trim().toLowerCase();
        let senha = input_senha.value;

        if (!email || !senha) {
            mensagem_div.textContent = 'Por favor, preencha todos os campos.';
            mensagem_div.className = 'mt-3 text-danger text-center';
            return;
        }

        let verificar_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!verificar_email.test(email)) {
            mensagem_div.textContent = 'Digite um e-mail válido.';
            mensagem_div.className = 'mt-3 text-danger text-center';
            return;
        }

        let usuario = new FormData();
        usuario.append('email', email);
        usuario.append('senha', senha);

        try {
            let resposta = await fetch('/auth/login', {
                method: 'POST',
                body: usuario
            });

            let resultado = await resposta.json();

            if (resposta.status === 200) {
                window.location.href = '/';
            }
            else {
                mensagem_div.textContent = resultado.erro || 'Email ou senha incorretos.';
                mensagem_div.className = 'mt-3 text-danger text-center';
            }
        }
        catch (erro) {
            mensagem_div.innerHTML = '<div class="alert alert-danger">Erro na conexão com o servidor.</div>';
            console.error(erro);
        }
    });

    let inputs = document.querySelectorAll('#form-login input');
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