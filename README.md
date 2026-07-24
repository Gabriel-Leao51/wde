<h1 align="center"> WDE </h1>

<p align="center"> Projeto de loja virtual</p>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;

<br>

<p align="center">
  <img alt="cart" src="github\admin-main-page.png" width="100%">
</p>

<p align="center">
  <img alt="cart" src="github\product-form.png" width="100%">
</p>

<p align="center">
  <img alt="cart" src="github\order-management.png" width="100%">
</p>

<p align="center">
  <img alt="main-page" src="github\main-page.png" width="50%"><img alt="mobile-nav" src="github\mobile-nav.png" width="50%">
</p>

<p align="center">
  <img alt="cart" src="github\cart.png" width="50%"><img alt="mobile-nav" src="github\stripe.png" width="50%">
</p>

<p align="center">
  <img alt="cart" src="github\payment-success.png" width="50%"><img alt="mobile-nav" src="github\orders.png" width="50%">
</p>

</p>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- EJS e CSS
- Javascript, Ajax e Node.js
- MongoDB
- Stripe
- Git e Github

## 💻 Projeto

A WDE é uma loja virtual que permite dois níveis de acesso:

Administrador:

- Pode adicionar, editar e deletar produtos
- Gerenciar os pedidos
- Interface otimizada para desktop

Cliente:

- Pode ver detalhes dos produtos
- Adicionar produtos no carrinho
- Realizar pagamento através da API Stripe
- Observar o andamento dos seus pedidos realizados
- Design otimizada para mobile

## 🐳 Rodando localmente com Docker

Pré-requisitos: [Docker Desktop](https://www.docker.com/products/docker-desktop/).

1. Copie o arquivo de exemplo de variáveis de ambiente e preencha sua chave de teste do Stripe:

   ```bash
   cp .env.example .env
   # edite .env e defina STRIPE_KEY com uma chave de teste (sk_test_...) da sua conta Stripe
   ```

2. Suba os containers (app + MongoDB). Na primeira execução, um serviço `seed` popula o banco automaticamente:

   ```bash
   docker compose up --build
   ```

3. Acesse [http://localhost:3000](http://localhost:3000).

Credenciais já populadas pelo seed:

| Papel      | Email               | Senha      |
| ---------- | ------------------- | ---------- |
| Admin      | admin@test.com       | tester     |
| Cliente    | user2@example.com    | usertest   |

O seed também cria alguns produtos de exemplo (incluindo o "GTRACING - Black Gaming Chair") e um pedido pendente, para que a aplicação já suba pronta para uso e para testes automatizados.

O MongoDB fica acessível em `127.0.0.1:27017` (apenas loopback) — usado pela suíte de testes de segurança do [`wde-test-automation`](https://github.com/Gabriel-Leao51/wde-test-automation) para a prova de conceito do `BUG-SEC-005`, e útil para inspecionar o banco localmente com qualquer client MongoDB.

Para resetar completamente os dados (remove os volumes do MongoDB):

```bash
docker compose down -v
```
