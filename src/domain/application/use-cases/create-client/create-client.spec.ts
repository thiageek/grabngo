import { MockClientRepository } from '@/infra/app/repositories/in-memory/mock-client-repository'
import { CreateClient } from '.'

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
})
