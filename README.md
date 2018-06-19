
# [RioCoin](https://github.com/pedrorv/SO-2018.1) ·          
RioCoin é a implementação de uma blockchain simples com uma criptomoeda e suporte para transações entre carteiras.
O projeto foi desenvolvido em JavaScript para ser executado com NodeJS.
## Documentação
Ao ser executado RioCoin estará servindo um Front-end simples e um Back-end por onde fará a comunicação com os outros nós. Para tal atenderá a 2 portas de rede, uma onde receberá requisições http e outra por onde trefegarão mensagens WebSocket. No ambiente de produção essas portas são 1116 e 2316 respectivamente.
*	Front-end tem as seguintes funcionalidades: 
1.	Exibe a chave pública da carteira daquele nó.
2.	Permite cadastrar uma transação.
3.	Exibe as transações que estão na pool para serem mineradas.
4.	Exibe os blocos minerados até o momento.
5.	Permite trigar o início da mineração de um bloco.

*	Back-end permite as seguintes requisições Http (http://ipDoServidor:1116/api/...):
1.	Get /blocos – Retorna a blockchain que o nó está seguindo.
2.	Get /blocos/(hash) – Retorna o bloco da hash enviada.
3.	Get /transacoes – Retorna as transações que estão na pool.
4.	Get /transacoes/(id) – Retorna a transação da pool com o id passado.
5.	Post /transação – Cria uma transação, deve conter os parâmetros amount e address em seu corpo.
6.	Get /chave-publica – Retorna a chave pública do nó.
7.	Get /saldo – Retorna o saldo do nó (saldo na blockchain menos valor das transações se saída de recursos que estão na pool).
8.	Get /minerar-transacoes – Triga o início da mineração de um bloco.

## Instalação
Para execução da RioCoin é necessária a instalação dos seguintes programas:

*	[Git](https://git-scm.com/) – Versionador de código.
*	[NodeJS](https://nodejs.org/en/) – Interpretador de código JavaScript.
*	[npm](https://www.npmjs.com/) – Gerenciador de pacotes do NodeJS.
*	[Webpack](https://webpack.js.org/) – Empacotador de código JavaScript.
*	[UFW](https://help.ubuntu.com/community/UFW) – Firewall.

Para correta instalação dos programas acima utilize os seguintes comandos:

#entrar em modo duper usuário
$sudo su
$apt-get update
#instala git
$apt-get install git
#instala node
$apt-get install nodejs
#instala npm
$apt-get install npm
#instala webpack
$npm install --save-dev webpack
#instala ufw (firewall)
$apt-get install ufw
#libera porta p2p do websocket
$ufw allow 2316
#caso use ssh
$ufw allow ssh
$ufw allow 22
$ufw allow 2222
#habilita firewall
$ufw enable
#sair do modo sudo
$exit

Para execução da RioCoin execute os seguintes comandos:
#sair do modo sudo
$exit
#clona repositório
$git clone https://github.com/pedrorv/SO-2018.1.git
$cd SO-2018.1
#importa referências do npm
$npm install
#exibe modos de execução
$npm run
#executa em modo de produção.
$npm run production

Para visualizar a carteira acesse: [http://localhost:1116](http://localhost:1116)

## Licença
RioCoin is [MIT licensed](https://github.com/facebook/react/blob/master/LICENSE)

