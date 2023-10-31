import { Client } from '@/domain/enterprise/entities/client'
import { FindClient } from '@/domain/application/use-cases/find-client/index'
import { MockClientRepository } from '@test/repositories/mock-client-repository'
import { ResourceNotFound } from '@/core/errors/resource-not-found-exists.error'

let sut: FindClient
let repository: MockClientRepository
let client: Client
describe('Find client', () => {
  beforeEach(() => {
    repository = new MockClientRepository()
    sut = new FindClient(repository)
    client = Client.create({
      name: 'Client #1',
      cpf: '000.000.000-00',
      email: 'client@email.com',
    })
    repository.mockClients.push(client)
  })

  it('Should be able to find client by id', async () => {
    const got = await sut.execute(client.id.toString())

    expect(got).not.toBeNull()
  })

  it('Should be able to find client by name', async () => {
    const got = await sut.execute('Client #1')

    expect(got).not.toBeNull()
  })

  it('Should be able to find client by cpf', async () => {
    const got = await sut.execute('000.000.000-00')

    expect(got).not.toBeNull()
  })

  it('Should be able to find client by email', async () => {
    const got = await sut.execute(client.email)

    expect(got).not.toBeNull()
  })

  it('Should be able to throw an error when client not found', async () => {
    expect(async () => {
      return await sut.execute('000.000.000-01')
    }).rejects.toThrow(ResourceNotFound)
  })
})
