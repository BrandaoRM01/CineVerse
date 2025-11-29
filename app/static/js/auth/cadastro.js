let form = document.querySelector('#form-cadastro');
let mensagem_div = document.querySelector('#mensagem-cadastro');

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

    let input_confirmar_senha = document.querySelector('#confirmar-senha');
    let btn_mudar_confirmar_senha = document.querySelector('#mudar-confirmar-senha');
    alternar_senha(input_confirmar_senha, btn_mudar_confirmar_senha);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensagem_div.innerHTML = '';

        let username = form.querySelector('#username').value.trim().toLowerCase();
        let email = form.querySelector('#email').value.trim().toLowerCase();
        let senha = input_senha.value;
        let confirmar_senha = input_confirmar_senha.value;
        let foto = form.querySelector('#foto').files[0];

        if (!username || !email || !senha || !confirmar_senha) {
            mensagem_div.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            mensagem_div.className = 'mt-3 text-danger text-center';
            return;
        }

        let verificar_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!verificar_email.test(email)) {
            mensagem_div.textContent = 'Digite um e-mail válido.';
            mensagem_div.className = 'mt-3 text-danger text-center';
            return;
        }

        if (senha !== confirmar_senha) {
            mensagem_div.textContent = 'As senhas não coincidem.';
            mensagem_div.className = 'mt-3 text-danger text-center';
            return;
        }

        if (senha.length < 8) {
            mensagem_div.textContent = 'A senha deve ter pelo menos 8 caracteres.';
            mensagem_div.className = 'mt-3 text-danger text-center';
            return;
        }

        let usuario = new FormData();
        usuario.append('username', username);
        usuario.append('email', email);
        usuario.append('senha', senha);
        usuario.append('confirmar_senha', confirmar_senha);
        if (foto) usuario.append('imagem', foto);

        try {
            let resposta = await fetch('/auth/cadastro', {
                method: 'POST',
                body: usuario
            });

            let resultado = await resposta.json();

            if (resultado.sucesso) {
                mensagem_div.textContent = resultado.sucesso;
                mensagem_div.className = 'mt-3 text-success text-center';
                setTimeout(() => window.location.href = '/login', 1500);
            }
            else {
                mensagem_div.textContent = resultado.erro || 'Erro desconhecido no cadastro.';
                mensagem_div.className = 'mt-3 text-danger text-center';
            }
        }
        catch (erro) {
            mensagem_div.innerHTML = '<div class="alert alert-danger">Erro na conexão com o servidor.</div>';
            console.error(erro);
        }
    });

    let inputs = document.querySelectorAll('#form-cadastro input');
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