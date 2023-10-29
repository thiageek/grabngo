import { Profile } from './profile'

describe('User profile', () => {
  it('should be able valid profile', () => {
    const profile = new Profile(1)
    expect(profile).toBeTruthy()
  })

  it('should not be able throw new error when profile is invalid', () => {
    expect(() => new Profile(9)).toThrow()
  })
})
