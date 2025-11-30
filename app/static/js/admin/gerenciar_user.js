document.addEventListener('DOMContentLoaded', async () => {
    let usuarios_lista = [];
    let usuario_logado = null;
    let tabela_container = document.querySelector('#usuarios-container');

    let carregar_usuario_logado = async () => {
        try {
            let resposta = await fetch('/user/api/usuario');
            if (!resposta.ok) throw new Error('Erro ao buscar usuário logado.');
            let data = await resposta.json();
            usuario_logado = data?.usuario || null;
        }
        catch (erro) {
            console.error("Erro ao carregar usuário logado:", erro);
            usuario_logado = null;
        }
    };

    let carregar_usuarios = async () => {
        try {
            let resposta = await fetch('/admin/listar_usuarios');
            if (!resposta.ok) throw new Error('Erro ao buscar usuários.');
            let data = await resposta.json();
            usuarios_lista = Array.isArray(data) ? data : [];
        } catch (erro) {
            tabela_container.innerHTML = `<p class="text-center text-danger">Não foi possível carregar os usuários.</p>`;
            console.error(erro);
            return;
        }
        montar_tabela();
    };

    let alterar_admin = async (usuario_id, tornar_admin) => {
        if (!usuario_logado?.principal) return;
        if (!confirm(`Tem certeza que deseja ${tornar_admin ? 'tornar admin' : 'remover permissão'} este usuário?`)) return;

        try {
            let form_data = new FormData();
            form_data.append('admin', tornar_admin);

            let resposta = await fetch(`/admin/alterar_permissao/${usuario_id}`, {
                method: 'POST',
                body: form_data
            });

            let data = await resposta.json();

            if (resposta.ok && data.sucesso) {
                alert(data.sucesso);
                await carregar_usuarios();
            } else {
                alert(data.erro || 'Erro ao alterar permissão.');
            }
        } catch (erro) {
            alert('Erro ao alterar permissão.');
            console.error(erro);
        }
    };

    window.alterar_admin = alterar_admin;

    let montar_tabela = () => {
        if (!usuarios_lista.length) {
            tabela_container.innerHTML = `<p class="text-center text-light">Nenhum usuário encontrado.</p>`;
            return;
        }

        let tabela_html = `
            <table class="table table-dark table-striped table-hover table-bordered align-middle text-light">
                <thead style="background-color:#343a40; color:white;">
                    <tr>
                        <th>Imagem</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Senha</th>
                        <th>Permissão</th>
        `;

        if (usuario_logado?.principal) tabela_html += `<th>Ações</th>`;
        tabela_html += `</tr></thead><tbody>`;

        usuarios_lista.forEach(usuario => {
            let permissao_txt = usuario.principal ? 'Admin Principal' : (usuario.admin ? 'Admin' : 'Usuário');

            tabela_html += `
                <tr>
                    <td>
                        <img src="${usuario.imagem_url || '/static/img/default_user.png'}"
                             alt="${usuario.username}"
                             style="width:50px; height:50px; object-fit:cover;"
                             class="rounded">
                    </td>
                    <td>${usuario.username}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.senha.slice(0, 10)}...</td>
                    <td>${permissao_txt}</td>
            `;

            if (usuario_logado?.principal) {
                tabela_html += `<td class="text-center">
                    <div class="d-flex justify-content-center align-items-center gap-2">`;

                if (usuario.principal) {
                    tabela_html += `<span class="btn btn-outline-primary btn-sm disabled" style="pointer-events:none;">Admin Principal</span>`;
                }
                else if (usuario.admin) {
                    tabela_html += `<button class="btn btn-outline-danger btn-sm" onclick="alterar_admin('${usuario.id}', false)">Remover Admin</button>`;
                }
                else {
                    tabela_html += `<button class="btn btn-outline-warning btn-sm" onclick="alterar_admin('${usuario.id}', true)">Tornar Admin</button>`;
                }


                tabela_html += `</div></td>`;
            }

            tabela_html += `</tr>`;
        });

        tabela_html += `</tbody></table>`;
        tabela_container.innerHTML = tabela_html;
    };

    await carregar_usuario_logado();
    await carregar_usuarios();
});
