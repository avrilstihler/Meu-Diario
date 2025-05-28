<div align="center">
   
# Meu Diário App 📑💐

>*Escrever e compartilhar o que sente e gosta é, no fundo, um jeito bonito de se cuidar.*

[Acessar o site](https://avrilstihler.github.io/Meu-Diario/)

</div>

#

Este projeto é uma aplicação web para um diário pessoal, desenvolvida com HTML, CSS e JavaScript puro. O objetivo é criar um espaço simples e acessível onde cada pessoa possa registrar seus pensamentos, sentimentos, coisas que gosta, além de salvar fotos e vídeos do YouTube. 

A aplicação oferece uma interface para criar, gerenciar e revisitar entradas de diário, com persistência de dados localmente no navegador do usuário, utilizando a API `localStorage`.


##

<div align="center">

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white&labelColor=E34F26)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white&labelColor=1572B6)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black&labelColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white&labelColor=528DD7)](https://fontawesome.com/)
[![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white&labelColor=000000)](https://www.json.org/json-en.html)

</div>

## 📝 Funcionalidades Implementadas

A aplicação inclui as seguintes funcionalidades:

1.  **Criação e Edição de Postagens:**
    *   Campo de texto para conteúdo da entrada.
    *   Opção para anexar uma imagem (upload local, armazenada como string Base64).
    *   Opção para adicionar um link de vídeo (otimizado para URLs do YouTube, que são embutidos).
    *   Pré-visualização da mídia selecionada antes de salvar.
    *   Interface de edição para modificar postagens existentes.

2.  **Gerenciamento de Postagens:**
    *   Listagem cronológica inversa das postagens na tela principal ("Diário").
    *   Exclusão de postagens com diálogo de confirmação.

3.  **Sistema de Favoritos:**
    *   Possibilidade de marcar/desmarcar postagens como favoritas.
    *   Tela dedicada ("Memórias Favoritas") para listar todas as postagens favoritadas.

4.  **Funcionalidade "Flashbacks":**
    *   Tela para visualização de postagens antigas.
    *   Filtro padrão: exibe postagens com um ano ou mais de antiguidade.
    *   Filtro adicional por ano específico.

5.  **Perfil do Usuário:**
    *   Campos para nome, nome de usuário (@handle), biografia e URL da foto de perfil.
    *   Os dados do perfil são utilizados na interface (ex: avatar exibido nas postagens).

6.  **Cálculo de Estatísticas (Perfil):**
    *   Contagem total de postagens.
    *   Contagem de dias únicos com postagens.
    *   Exibição da data de "ingresso" (baseada na data da primeira postagem).

7.  **Atalho "My Diary Journey" (Perfil):**
    *   Link para uma tela que lista todas as postagens do ano corrente.

8.  **Persistência de Dados:**
    *   Utilização da API `localStorage` do navegador para armazenar postagens e dados do perfil, permitindo que os dados persistam entre as sessões.

9.  **Navegação:**
    *   Menu de navegação inferior fixo para acesso às seções principais: Diário, Novo Post, Flashbacks e Perfil.


## 📸 Capturas de Tela

| Tela Principal | Criação/Edição de Postagem |
|---|---|
| [![2.jpg](https://i.postimg.cc/j5Phr25B/2.jpg)](https://postimg.cc/YG2F6pQx) | [![3.jpg](https://i.postimg.cc/vTyt8yxT/3.jpg)](https://postimg.cc/TLkDQZ9v) |

| Tela de Flashbacks com Filtro | Tela de Perfil do Usuário |
|---|---|
| [![4.jpg](https://i.postimg.cc/qMkx9kdZ/4.jpg)](https://postimg.cc/HjhMM1nQ) | [![5.jpg](https://i.postimg.cc/8kdbK7x6/5.jpg)](https://postimg.cc/t7TP74qq) |

## 📄 Licença
Este projeto está licenciado sob a licença MIT.

Para mais detalhes, consulte o arquivo [LICENSE](./LICENSE).

#

<div align="center">

<p align="center">
  <img src="https://i.postimg.cc/yYsvJj9D/1.jpg" alt="Criadora" width="100" style="border-radius: 50%;">
</p>

<p align="center">
  Desenvolvido por <strong>Avril Stihler</strong>
</p>
&copy; 2025 Meu Diário — Todos os direitos reservados.  
</div>

