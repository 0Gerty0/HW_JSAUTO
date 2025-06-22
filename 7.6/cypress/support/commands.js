const userEmail = Cypress.env('userEmail')
const userPass  = Cypress.env('userPass')

Cypress.Commands.add('openLoginForm', () => {
  cy.visit('/booksNode')
  cy.contains('Log in').click()
})
Cypress.Commands.add('login', () => {
  cy.visit('/booksNode')
  cy.contains('Log in').click()
  cy.get('#mail').clear().type(userEmail)
  cy.get('#pass').clear().type(userPass)
  cy.contains('Submit').click()
})

Cypress.Commands.add('openHome', () => {
  cy.visit('/')
})

Cypress.Commands.add('openFavorites', () => {
  cy.visit('/favorites')
})
