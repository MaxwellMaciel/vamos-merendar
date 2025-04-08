# Galeria Doja Cat

Um site dedicado à artista Doja Cat, desenvolvido com Django, apresentando sua discografia, galeria de fotos e informações sobre sua carreira.

## Funcionalidades

- Página inicial com design moderno e interativo
- Seção de álbuns com detalhes sobre cada lançamento:
  - Amala
  - Hot Pink
  - Planet Her
  - Scarlet
- Galeria de fotos da artista
- Página de biografia e informações sobre a carreira
- Links para streaming nas principais plataformas:
  - Spotify
  - Apple Music
  - YouTube
- Interface responsiva e moderna
- Menu de navegação intuitivo

## Tecnologias Utilizadas

- Python 3.12
- Django 5.2
- HTML5/CSS3
- Design responsivo
- Efeitos de transição e animações CSS

## Como Executar o Projeto

1. Clone o repositório
2. Crie um ambiente virtual: `python3 -m venv venv`
3. Ative o ambiente virtual: `source venv/bin/activate`
4. Instale as dependências: `pip install -r requirements.txt`
5. Execute as migrações: `python manage.py migrate`
6. Inicie o servidor: `python manage.py runserver`
7. Acesse http://localhost:8000 no navegador

## Estrutura do Projeto

```
galeria/
├── static/galeria/
│   ├── css/         # Arquivos de estilo
│   └── img/         # Imagens e recursos
├── templates/galeria/
│   ├── index.html   # Página inicial
│   ├── albuns.html  # Lista de álbuns
│   ├── galeria.html # Galeria de fotos
│   ├── artista.html # Biografia
│   ├── stream.html  # Links de streaming
│   └── ...          # Páginas dos álbuns
└── views.py         # Lógica das views
```

## Recursos e Características

- Design moderno e minimalista
- Navegação fluida entre as páginas
- Efeitos de transição suaves
- Galeria de fotos responsiva
- Links diretos para plataformas de streaming
- Informações detalhadas sobre cada álbum
- Biografia completa da artista

## Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
