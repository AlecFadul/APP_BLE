# APP_BLE

Aplicativo React Native com Expo para comunicação via **Bluetooth Low Energy (BLE)**, com leitura de dados do dispositivo e exibição no app.

---

## Tecnologias e versões do projeto

### Ambiente utilizado
- **Node.js:** `22.19.0`
- **npm:** `11.6.2`

### Stack principal
- **Expo:** `54.0.10`
- **React Native:** `0.81.4`
- **React:** `19.1.0`

### Dependências instaladas
- `@react-native-community/cli`: `20.0.2`
- `base64-js`: `1.5.1`
- `expo-status-bar`: `3.0.8`
- `expo-system-ui`: `6.0.7`
- `expo`: `54.0.10`
- `lucide-react-native`: `0.552.0`
- `nativewind`: `4.2.1`
- `react-native-ble-plx`: `3.5.0`
- `react-native-linear-gradient`: `2.8.3`
- `react-native-permissions`: `5.4.2`
- `react-native-safe-area-context`: `5.6.1`
- `react-native`: `0.81.4`
- `react`: `19.1.0`

---

## Objetivo deste README

Este guia foi criado para que **qualquer pessoa consiga baixar e executar o projeto em outro computador** com o menor número possível de problemas de compatibilidade.

---

## Requisitos para rodar o projeto

Antes de começar, instale no computador:

- **Git**
- **Node.js**
- **npm**
- **Expo Go** no celular **ou** ambiente Android/iOS para emulador
- editor como **VS Code** (opcional, mas recomendado)

---

## Recomendação importante sobre versão do Node

Mesmo que o projeto atualmente tenha sido testado com:

- **Node:** `22.19.0`
- **npm:** `11.6.2`

é uma boa prática usar uma versão padronizada de Node em todos os computadores da equipe.

Se o projeto apresentar incompatibilidade em outra máquina, tente usar a mesma versão do Node do computador em que ele foi desenvolvido.

---

## Como baixar e rodar o projeto

### 1. Clonar o repositório

git clone https://github.com/AlecFadul/APP_BLE.git

### 2. Entrar na pasta do projeto
cd APP_BLE
### 3. Instalar as dependências
npm install

Esse comando vai:

ler o arquivo package.json

ler o arquivo package-lock.json

baixar todas as dependências

criar automaticamente a pasta node_modules

Como iniciar o projeto

## Depois da instalação, execute:

npx expo start

ou

npm start

Isso abrirá o servidor do Expo.

Depois disso você pode:

pressionar a para abrir no Android

pressionar i para abrir no iOS (somente macOS)

escanear o QR Code com o app Expo Go no celular

Estrutura esperada após instalação

Depois do npm install, a estrutura do projeto deve ficar parecida com esta:

APP_BLE/
├── node_modules/
├── package.json
├── package-lock.json
├── App.js
├── README.md
└── ...
Arquivos importantes do projeto
package.json

Define:

nome do projeto

scripts

dependências

versões esperadas

package-lock.json

Trava as versões exatas das dependências instaladas.

Esse arquivo é muito importante para que o projeto funcione da mesma forma em outro computador.

node_modules/

É a pasta criada automaticamente pelo npm install.

Essa pasta não deve ser enviada para o GitHub.

O que fazer se o projeto não rodar em outro computador

Se aparecer erro de dependência, versão ou pacote corrompido, tente os passos abaixo.

Opção 1: reinstalar dependências
rm -rf node_modules package-lock.json
npm install

No Windows PowerShell:

Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
Opção 2: limpar cache do Expo
npx expo start --clear
Opção 3: verificar versões instaladas
node -v
npm -v
npm list --depth=0
Como verificar as versões usadas no projeto
Ver versão do Node
node -v
Ver versão do npm
npm -v
Ver dependências instaladas
npm list --depth=0
Observação sobre BLE

Este projeto utiliza:

react-native-ble-plx

Essa biblioteca é responsável pela comunicação Bluetooth Low Energy.

Dependendo do ambiente usado para rodar o app, recursos BLE podem exigir configuração nativa adicional, permissões e testes em dispositivo físico.

Em alguns casos, BLE funciona melhor em:

celular Android real

build de desenvolvimento apropriada

ambiente nativo corretamente configurado

Passo a passo completo para qualquer pessoa rodar o projeto
Pré-requisitos

Instalar Git

Instalar Node.js

Instalar npm

Instalar Expo Go no celular ou configurar emulador

Execução
git clone https://github.com/AlecFadul/APP_BLE.git
cd APP_BLE
npm install
npx expo start
Boas práticas para manter o projeto portátil

Sempre subir o package.json

Sempre subir o package-lock.json

Nunca subir node_modules

Documentar a versão do Node usada

Manter este README atualizado ao trocar versões de dependências

Sugestão de .gitignore

Caso ainda não exista, use algo como:

node_modules/
.expo/
dist/
build/
Comandos úteis
Instalar dependências
npm install
Rodar o projeto
npx expo start
Rodar com cache limpo
npx expo start --clear
Ver dependências instaladas
npm list --depth=0
Ver versão do Node e npm
node -v
npm -v
