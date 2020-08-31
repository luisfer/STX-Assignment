# STX Assignment
Luisfer Romero Calero

2020, Leiden, Netherlands

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```



## I used:
- **Vue 2**. As this was just an assignment for a proof of concept, I decided to use it so Buefy and Vuelidate could work within the project with stable support.
- **Vue-cli** to create and build the project from terminal and manage plugins with the GUI
- **Yarn** to install and manage dependencies, and serve the project
- **Vuelidate** for form validations within the Vue components
- **Buefy**, a Bulma wrapper to prettify the layout and use their grid system and components such as panels, buttons, select elements
- **Axios** to handle the API requests (GET, POST, PUT, DELETE)
- **MirageJS** to mock an API, and a server in development env
- **Moment.js** to validate date format
- I decided not to use Vuex or router for being an over-engineering on the requirements asked and the expected outcome.

## Architecture:
- **main.js** mounts the new Vue instance in the #app div.
- **App.vue** calls child components OrderDetails, Sellers and Items, in the Components folder.
- To finalize order, it capture refs of all the children components to sequence the 'save' of all the blocks one by one, and validate its values in each field for every block.
- **server.js** has a mock API, built with Mirage.js, that takes care of all the API calls that axios makes through the Vue components.
- data folder has the source of truth for all the object that will be the store retrieved in the GET calls to be served to the Vue components.
- I used scoped styles in the components. Nevertheless, a few CSS properties for common validation highlighting are in **assets/styles.css**.

## Features:
- All the blocks can be saved separately (the save button becomes 'saved'), and if there is change after saving, the 'save' button gets enabled again.
- Validation errors are treated one by one by fields according to the requirements, and highlighted in red if invalid/error in values for that field.
- Finalize order is only possible when all data is validated and there is at least one item.
- Items can be created as generic or especial, with each specific fields.

## To do:
- Support for POST and then PUT (create and then update) mock API calls.
- Error handling in the mock API calls. Only successful responses are supported.
- Improve communication of parent-child components (using on and emit, for example) when submitting/saving data.
- Unit tests
