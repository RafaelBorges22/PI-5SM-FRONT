# 💈 UP Barber App

> Aplicação mobile em React Native (Expo) para o sistema de autoatendimento de barbearia.

---

## 📋 Sobre o Projeto

O **UP Barber App** é o front-end mobile do sistema de autoatendimento da barbearia, inspirado em totens digitais como os do McDonald's. A aplicação permite que clientes realizem:

- Visualização de serviço feito
- Pagamentos via PIX, Cartões de Crédito e Débito

O app consome a API desenvolvida em **Spring Boot** para pagamentos via PIX, e utilizando sua conta do **Infinitepay** do dispositivo móvel para pagamentos via cartão com InfiniteTap.

Caso de duvidas acesse a documentação:
- [InfiniteTap](https://www.infinitepay.io/checkout-tap#codeSetupBlock)

**Repositório do Back-end (API REST):**  
https://github.com/RafaelBorges22/PI-5SM-BACK

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| React Native | Desenvolvimento mobile |
| Expo | Ambiente de execução e build |
| JavaScript / TypeScript | Linguagem principal |
| Axios / Fetch | Requisições HTTP |
| Expo Router (opcional) | Navegação |
| React Navigation | Gerenciamento de telas |

---

## ⚙️ Pré-requisitos

Antes de começar, instale:

- [Node.js 18+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- App **Expo Go** no celular (Android/iOS)
- Backend rodando localmente
- Conta no Infinitepay
- Dispositivo movél estar na mesma rede WI-FI da API local

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/RafaelBorges22/PI-5SM-FRONT.git
cd PI-5SM-FRONT

# Instale as dependências
npm install
```
## 🔧 Variaveis de ambiente .env
```
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080/api
```
---
## 🏁 Iniciando o projeto
```
npx expo start
ou
npm start
```
