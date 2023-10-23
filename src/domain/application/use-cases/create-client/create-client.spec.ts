import { MockClientRepository } from '@/infra/app/repositories/in-memory/mock-client-repository'
import { CreateClient } from '.'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'

let sut: CreateClient
let repository: MockClientRepository
describe('Create client', () => {
  beforeEach(() => {
    repository = new MockClientRepository()
    sut = new CreateClient(repository)
  })

  it('Should be able create a client', async () => {
    await sut.execute({
      cpf: '123.456.789.10',
      email: 'test@example.com',
      name: 'test',
    })

    const spy = await repository.find('123.456.789.10')
    expect(spy).toBeTruthy()
  })

  it('Should be able throw an error when client already exists', async () => {
    const data = {
      cpf: '123.456.789.10',
      email: 'test@example.com',
      name: 'test',
    }
    await sut.execute(data)

    expect(async () => {
      return await sut.execute(data)
    }).rejects.toThrow(ResourceAlreadyExists)
  })
})
