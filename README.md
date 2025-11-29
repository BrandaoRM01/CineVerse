# 🎬 CineVerse

### Plataforma de organização, exibição e gerenciamento de filmes

**Projeto escolar – IFSP Campus Araraquara • 4º Bimestre • Aplicações Web**

---

**Desenvolvido por Raul Molina Brandão**

---

## 📌 Sobre o Projeto

O **CineVerse** é uma plataforma web desenvolvida em Flask para permitir que usuários visualizem, organizem e gerenciem filmes de forma prática e interativa.

Usuários cadastrados podem salvar filmes em listas personalizadas, visualizar mais detalhes sobre cada título e atualizar suas informações pessoais. Já os administradores podem adicionar, editar e excluir filmes utilizando a API do TMDB.

---

## 🚀 Funcionalidades

### 👤 Área do Usuário

* Criar conta e fazer login
* Atualizar nome e foto de perfil
* Recuperar senha via e-mail usando **Brevo API**
* Marcar filmes como:

  * ⭐ Favoritos
  * ⏳ Assistir mais tarde
  * ✔️ Assistido
* Visualizar tudo na página **Meus Filmes**

### 🎥 Visualização de Filmes

* Exibição dos **Top 10 filmes**, ordenados por avaliação
* Página com **todo o catálogo de filmes**
* Usuários não logados podem visualizar os filmes, mas não salvá-los

### 🛠️ Painel Administrativo

* Adicionar filmes ao catálogo usando **API do TMDB**
* Editar informações de filmes (exceto avaliação)
* Excluir filmes
* Administrador principal pode atribuir permissões a novos administradores

---

## 🧰 Tecnologias Utilizadas

* **Python 3**
* **Flask**
* **JSON** para armazenamento local
* **API Brevo** – envio de e-mail para recuperação de senha
* **API TMDB** – busca e cadastro de filmes
* **Requests** – integração com APIs externas
* **HTML • CSS • JavaScript • Jinja2**

---

## ⚙️ Instalação e Configuração

### 1. Criar o ambiente virtual

```bash
python3 -m venv .venv
```

### 2. Ativar o ambiente virtual

**Linux/macOS**

```bash
. .venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\activate
```

### 3. Instalar dependências

```bash
pip install flask
pip install email_validator
pip install sib_api_v3_sdk
pip install requests
```

---

# 🔧 Configuração Obrigatória Antes de Usar o Sistema

Para que o CineVerse funcione corretamente, **duas configurações precisam ser feitas manualmente**:

---

## ✅ 1. Definir o administrador principal

Acesse o arquivo:

```
app/utils/admin_utils.py
```

Neste arquivo, defina os dados do **ADMINISTRADOR PRINCIPAL**, preenchendo:

* **username**
* **senha**
* **email**

Essas informações serão usadas para acessar o **painel administrativo** logo após iniciar o sistema.

---

## 2. Inserir suas chaves reais no config

O arquivo:

```
app/config/config.py
```

contém chaves **fictícias** por segurança.
Você deve substituir pelos seus valores reais:

* `SECRET_KEY`
* `TMDB_API_KEY`
* `BREVO_API_KEY`

Exemplo:

```python
SECRET_KEY = "SUA_SECRET_KEY_REAL_AQUI"
TMDB_API_KEY = "SUA_CHAVE_TMDB_REAL_AQUI"
BREVO_API_KEY = "SUA_CHAVE_BREVO_REAL_AQUI"
```

Essas chaves são necessárias para:

* Segurança da sessão (SECRET_KEY)
* Consulta de filmes pela API do TMDB
* Envio de e-mails pela Brevo (recuperação de senha)

---

## Executando o Projeto

O arquivo principal é **run.py**, contendo:

```python
if __name__ == "__main__":
    app.run()
```

### 🔹 Opção 1 — Pelo botão “Run” do editor

Se seu editor possui botão “Run” (VSCode, PyCharm etc.), basta abrir `run.py` e executar.

### 🔹 Opção 2 — Via terminal

**Usando Flask:**

```bash
flask run
```

**Ou executando diretamente:**

```bash
python run.py
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
