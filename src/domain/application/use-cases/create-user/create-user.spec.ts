import { MockUserRepository } from '@test/repositories/mock-user-repository'
import { CreateUser } from '.'
import { UserRepository } from '../../repositories/user-repository'
import { ResourceAlreadyExists } from '@/core/errors/resource-already-exists.error'

let sut: CreateUser
let repository: UserRepository
describe('Create user', () => {
  beforeEach(() => {
    repository = new MockUserRepository()
    sut = new CreateUser(repository)
  })

  it('Should be able create a user', async () => {
    await sut.execute({
      name: 'test',
      login: 'test',
      password: '123456',
      profile: 1,
    })

    const spy = await repository.findUser('test@grabngo')
    expect(spy).toBeTruthy()
  })

  it('Should be able throw an error when user already exists', async () => {
    await sut.execute({
      name: 'test',
      login: 'test',
      password: '123456',
      profile: 1,
    })
    expect(async () => {
      await sut.execute({
        name: 'test',
        login: 'test',
        password: '123456',
        profile: 1,
      })
    }).rejects.toThrow(ResourceAlreadyExists)
  })
})
