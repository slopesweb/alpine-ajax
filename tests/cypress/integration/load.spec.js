import { test, html } from '../utils'

test('content is lazily loaded on page load',
  html``,
  ({ get }) => {
    cy.intercept('GET', '/', {
      statusCode: 200,
      body: '<h1 id="title">Success</h1><div id="replace">Loaded</div>'
    }).as('response')
    // Injecting the component code after the intercept has been setup
    // because this request fires immediately
    cy.get('#root').then(([el]) => {
      el.innerHTML = '<div x-data x-load="/" id="replace"></div>'
    })
    cy.wait('@response').then(() => {
      cy.get('#title').should('not.exist')
      cy.get('#replace').should('have.text', 'Loaded')
    })
  }
)

test('replaced content gets a source',
  html`<a href="/" x-data x-ajax id="replace">Click Me</a>`,
  ({ get }) => {
    cy.intercept('GET', '/', {
      statusCode: 200,
      body: '<h1 id="title">Success</h1><div id="replace">Loaded</div>'
    }).as('response')
    cy.get('a').click()
    cy.wait('@response').then(() => {
      cy.get('#replace').should('have.attr', 'data-source')
    })
  }
)

test('content is lazily loaded with a custom event trigger',
  html`<div x-data><div x-load:button:clicked="/" id="replace"></div><button type="button" @click="$dispatch('button:clicked')"></button></div>`,
  ({ get }) => {
    cy.intercept('GET', '/', {
      statusCode: 200,
      body: '<h1 id="title">Success</h1><div id="replace">Loaded</div>'
    }).as('response')
    get('button').click()
    cy.wait('@response').then(() => {
      cy.get('#title').should('not.exist')
      cy.get('#replace').should('have.text', 'Loaded')
    })
  }
)
