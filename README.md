# Cadastro-Tarefas-Front

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Tecnologias e requisitos
* Angular CLI 17
* npm 11.16.0+
* Karma-jasmine 5.1.0

Criei um componente de login e fiz com que a aplicação sempre volte ao login e esqueça o token ao recarregar, escondi o path para mais segurança, e criei 4 componentes e 2 services (um para login e autenticação e o outro para realizar as requisições a api) e um inteceptador para injetar o token JWT nas requisições sem precisar fazer isso manualmente.

## Docker Compose
Para criar a imagem desta aplicação (incluindo banco e api), deve-se clonar este projeto na mesma pasta do back-end e executar o `docker compose up --build` na raiz do back-end;

