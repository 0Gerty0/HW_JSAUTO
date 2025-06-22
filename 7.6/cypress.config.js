const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // plugins / reporters и т.-д.
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/commands.js',
    viewportWidth: 1920,
    viewportHeight: 1080,   
  }
})