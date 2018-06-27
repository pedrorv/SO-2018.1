# [RIOCoin](https://github.com/pedrorv/SO-2018.1)

RIOCoin é a implementação de uma blockchain simples com uma criptomoeda e suporte para transações entre carteiras.
O projeto foi desenvolvido em JavaScript para ser executado com NodeJS. Este é um trabalho para a disciplina de Sistemas Operacionais do DEL/UFRJ. O objetivo é a implementação de um Sistema Distribuído.

## Documentação

Ao ser executada, a aplicação da RioCoin servirá um Front-end simples feito em React e um Back-end por onde fará a comunicação com os outros nós da rede. Para tal atenderá às requisições através de duas portas, uma onde para receber requisições HTTP, que devem ser feitas localmente, e outra por onde trafegarão mensagens por WebSockets que conectam um nó aos outros nós da rede. No ambiente de produção essas portas são 1116 e 2316 respectivamente.

- Front-end tem as seguintes funcionalidades:

1.  Exibe a chave pública da carteira do nó.
2.  Permite realizar uma transação.
3.  Exibe as transações que estão na pool para serem mineradas.
4.  Exibe os blocos minerados até o momento.
5.  Permite iniciar a mineração de um bloco.

- Back-end permite as seguintes requisições HTTP (http://localhost:1116/api/...):

1.  GET /blocos – Retorna a blockchain que o nó está seguindo.
2.  GET /blocos/:hash – Retorna o bloco da hash enviada.
3.  GET /transacoes – Retorna as transações que estão na pool.
4.  GET /transacoes/:id – Retorna a transação da pool com o id passado.
5.  POST /transação – Cria uma transação a partir de um JSON que deve conter os parâmetros recipient (destinatário) e amount (valor) da transação no seu corpo.
6.  GET /chave-publica – Retorna a chave pública do nó.
7.  GET /saldo – Retorna o saldo do nó.
8.  GET /minerar-transacoes – Inicia a mineração de um bloco.

## Instalação

Para execução da RioCoin é necessária a instalação dos seguintes programas:

- [Git](https://git-scm.com/) – Versionador de código.
- [NodeJS](https://nodejs.org/en/) – Interpretador de código JavaScript - instalar a versão 8 LTS.
- [npm](https://www.npmjs.com/) – Gerenciador de pacotes do NodeJS.

Além de instalar os programas é necessário abrir a porta 2316 do seu roteador. Uma explicação do processo pode ser vista [neste link](https://bitcoin.org/en/full-node#configuring-dhcp).

Para execução da RioCoin é necessário executar os seguintes comandos no terminal:

1.  Clonar o repositório

- git clone https://github.com/pedrorv/SO-2018.1.git
- cd SO-2018.1

2.  Instalar as dependências do projeto

- npm install

3.  Executar em modo de produção

- npm run production

Caso queira testar a criptomoeda, alguns outros comandos úteis:

1.  Rodar os testes unitários

- npm run test

2.  Rodar uma única instância do servidor para fazer testes da API (utiliza as portas 5000 e 6000)

- npm run development

3.  Rodar três instâncias do servidor localmente para fazer testes de comunicação (consultar o package.json para ver portas utilizadas)

- npm run dev-network

Para visualizar a carteira acesse: [http://localhost:1116](http://localhost:1116)

## Referências

[Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf)  
[Writing a simple blockchain with Elixir](https://sheharyar.me/blog/writing-blockchain-elixir/)  
[Creating your first blockchain with Java](https://medium.com/programmers-blockchain/create-simple-blockchain-java-tutorial-from-scratch-6eeed3cb03fa)  
[A blockchain in 200 lines of code](https://medium.com/@lhartikk/a-blockchain-in-200-lines-of-code-963cc1cc0e54)  
[Naivecoin](https://lhartikk.github.io/)  

## Feito por

- [Heitor Tomaz](https://github.com/heitortomaz)
- [Pedro Reis](https://github.com/pedrorv)

## Observação

A RIOCoin é só uma prova de conceito e não tem nenhuma relação com a [Riocoin](http://riocoin.org/).
