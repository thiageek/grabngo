import { User } from './user'
import { Profile } from './value-objects/profile'

describe('User', () => {
  it('should be able to create a user', () => {
    const spy = User.create({
      name: 'test',
      login: 'test',
      password: '123456',
      profile: new Profile(1),
      updatedAt: undefined,
    })

    expect(spy).toBeTruthy()
  })
})
