document.addEventListener('DOMContentLoaded', async () => {
    let menu_principal = document.querySelector('#menu_principal');
    let area_nav_direita = document.querySelector('#area_nav_direita');

    let usuario = null;
    let admin = false;

    try {
        let resposta = await fetch('/user/api/usuario');
        let data = await resposta.json();
        usuario = data?.usuario || null;
        admin = data?.admin || false;
    }
    catch (erro) {
        console.error('Erro ao buscar usuário logado:', erro);
    }

    let logado = usuario !== null;

    menu_principal.innerHTML = "";
    area_nav_direita.innerHTML = "";

    let html_esquerda = `
        <li class="nav-item">
            <a class="nav-link" href="/">Início</a>
        </li>

        <li class="nav-item">
            <a class="nav-link" href="/filmes">Filmes</a>
        </li>
    `;

    if (logado) {
        html_esquerda += `
            <li class="nav-item">
                <a class="nav-link" href="/meus_filmes">Meus Filmes</a>
            </li>
        `;
    }

    if (admin) {
        html_esquerda += `
            <li class="nav-item">
                <a class="nav-link text-warning fw-semibold" href="/painel_admin">
                    Painel Admin
                </a>
            </li>
        `;
    }

    menu_principal.innerHTML = html_esquerda;

    if (logado) {
        area_nav_direita.innerHTML = `
        <div class="d-flex align-items-center gap-3">

           <a href="/editar_perfil">
                <img src="${usuario.imagem_url || '/static/img/default_user.jpg'}"
                    alt="Foto do usuário"
                    class="img-perfil"
                    style="cursor:pointer;"
                    onerror="this.onerror=null; this.src='/static/img/default_user.jpg';">
           </a>

            <span class="fw-bold text-light" style="text-transform: capitalize;">
                ${usuario.username}
            </span>

            <button class="btn btn-outline-danger btn-sm" id="btn_logout">
                Sair
            </button>

        </div>
    `;

        document.querySelector("#btn_logout").addEventListener("click", async () => {
            try {
                let resposta = await fetch('/auth/logout', { method: 'POST' });
                let data = await resposta.json();

                if (data.successo) {
                    window.location.href = "/";
                }
                else {
                    console.error("Erro ao fazer logout.");
                }
            }
            catch (erro) {
                console.error("Erro ao fazer logout:", erro);
            }
        });
    }

    else {
        area_nav_direita.innerHTML = `
            <div class="d-flex gap-2">
                <a href="/login" class="btn btn-outline-light btn-sm">Entrar</a>
                <a href="/cadastro" class="btn btn-outline-danger btn-sm">Cadastrar</a>
            </div>
        `;
    }

});
