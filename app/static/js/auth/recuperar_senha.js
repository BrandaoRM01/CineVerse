let form = document.querySelector('#form-recuperar');
let mensagem_div = document.querySelector('#mensagem-recuperar');

if (form) {
    let email_input = form.querySelector('#email');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensagem_div.innerHTML = '';

        let email = email_input.value.trim().toLowerCase();

        if (!email) {
            mensagem_div.textContent = 'Por favor, informe seu e-mail.';
            mensagem_div.className = 'mt-3 text-danger text-center';
            return;
        }

        let verificar_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!verificar_email.test(email)) {
            mensagem_div.textContent = 'Digite um e-mail válido.';
            mensagem_div.className = 'mt-3 text-danger text-center';
            return;
        }

        let dados = new FormData();
        dados.append('email', email);

        try {
            let resposta = await fetch('/auth/recuperar_senha', {
                method: 'POST',
                body: dados,
            });

            let resultado = await resposta.json();

            if (resultado.sucesso) {
                mensagem_div.textContent = resultado.sucesso;
                mensagem_div.className = 'mt-3 text-success text-center';
                email_input.value = '';
            }
            else {
                mensagem_div.textContent = resultado.erro || 'Não foi possível enviar o e-mail.';
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
        input.addEventListener('focus', () => {
            mensagem_div.innerHTML = '';
        });
    }

    document.addEventListener('click', () => {
        mensagem_div.innerHTML = '';
    });
}

window.addEventListener('pageshow', (e) => {
    if (e.persisted && mensagem_div) {
        mensagem_div.innerHTML = '';
    }
});