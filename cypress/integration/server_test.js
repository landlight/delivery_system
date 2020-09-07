before(() => {
    // runs once before all tests in the block
    console.log('before 1')
})

beforeEach(() => {
    // runs before each test in the block
    console.log('before all')
})

afterEach(() => {
    // runs after each test in the block
    console.log('end all')
})

after(() => {
    // runs once after all tests in the block
    console.log('end 1')
})

describe('Hooks Tests', () => {
    it('Test Server', () => {
        cy.visit('/')
    })
})

describe('Test Delivery Route', () => {
    it('Test Delivery Route', () => {
        const result = cy.request('GET', '/api/deliveryRoute/')
        console.log(result, "result")
    })
})
