# 🎬 CineVerse

### Plataforma de organização, exibição e gerenciamento de filmes

**Projeto escolar – IFSP Campus Araraquara • 4º Bimestre • Aplicações Web**

---

**Desenvolvido por Raul Molina Brandão**

---

# 📌 Sobre o Projeto

O **CineVerse** é uma plataforma web desenvolvida em Flask para permitir que usuários visualizem, organizem e gerenciem filmes de forma prática e interativa.

Usuários cadastrados podem salvar filmes em listas personalizadas, visualizar detalhes completos sobre cada título e atualizar suas informações pessoais. Administradores podem adicionar, editar e excluir filmes utilizando a API do TMDB.

---

# 🚀 Funcionalidades

## 👤 Área do Usuário

* Criar conta e fazer login
* Atualizar nome e foto de perfil
* Recuperar senha via e-mail usando **Brevo API**
* Marcar filmes como:

  * ⭐ Favoritos
  * ⏳ Assistir mais tarde
  * ✔️ Assistido
* Visualizar tudo na página **Meus Filmes**

## 🎥 Visualização de Filmes

* Exibição dos **Top 10 filmes**, ordenados por avaliação e ordem alfabética em caso de empate
* Página com **todo o catálogo de filmes**
* Usuários não logados podem visualizar, mas não salvar filmes

## 🛠️ Painel Administrativo

* Adicionar filmes usando a **API do TMDB**
* Editar informações dos filmes (exceto avaliação)
* Excluir filmes
* Atribuir permissões de administrador

---

# 🧰 Tecnologias Utilizadas

* **Python 3**
* **Flask**
* **JSON** – armazenamento de usuários e filmes
* **API Brevo** – envio de e-mail para recuperação de senha
* **API TMDB** – busca e informações de filmes
* **Requests**
* **HTML • CSS • JavaScript • Jinja2**

---

# 🔧 Instalação e Configuração

Todas as configurações e chaves necessárias devem ser definidas no arquivo:

```
app/config/config.py
```

---

## 1. Criar e ativar o ambiente virtual

```bash
python3 -m venv .venv
```

**Ativar ambiente (Linux/macOS):**

```bash
. .venv/bin/activate
```

**Ativar ambiente (Windows):**

```bash
.venv\Scripts\activate
```

---

## 2. Instalar dependências

```bash
pip install flask
pip install email_validator
pip install sib_api_v3_sdk
pip install requests
```

---

## 3. Definir variáveis de ambiente

### Linux/macOS:

```bash
export FLASK_APP=run.py
export FLASK_DEBUG=1
```

### Windows (PowerShell):

```powershell
setx FLASK_APP "run.py"
setx FLASK_DEBUG "1"
```

> Após usar `setx`, feche e abra o terminal para aplicar.

---

# ⚙️ Configurações Obrigatórias no `config.py`

---

## 1. Administrador Principal

**Coloque as informações que seu usuário usará na criação da conta de admin**
**Exemplo:**

```python
USERNAME_ADMIN = "admin"
EMAIL_ADMIN = "admin@localhost.com"
SENHA_ADMIN = "senha123"
```

---

## 2. Chaves de API e Segurança

**Coloque suas chaves pessoais para uso**
**Exemplo:**

```python
SECRET_KEY = "SUA_SECRET_KEY_AQUI"
TMDB_API_KEY = "SUA_CHAVE_TMDB_AQUI"
BREVO_API_KEY = "SUA_CHAVE_BREVO_AQUI"
```

---

# ▶️ Executando o Projeto

### Pelo terminal

```bash
flask run
```

### Ou executando diretamente:

**Caso execute pelo seu editor diretamente no botão de executar do arquivo que contém o trecho abaixo (run.py), também será executado a aplicação**

```bash
if __name__ == '__main__':
    app.run()
```

O servidor ficará disponível em:

```
http://127.0.0.1:5000
```

---

Este projeto foi desenvolvido para o **4º bimestre** do curso técnico integrado do **Instituto Federal de São Paulo – Campus Araraquara**, na disciplina de **Aplicações Web**.

---

### Este projeto foi desenvolvido exclusivamente para fins educacionais.

---
