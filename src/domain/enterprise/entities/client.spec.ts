import { Client } from './client'

describe('Clients', () => {
  it('should be able create a client', () => {
    const spy = Client.create({
      cpf: '123.456.789.10',
      email: 'test@example.com',
      name: 'test',
    })

    expect(spy).toBeTruthy()
  })
})
