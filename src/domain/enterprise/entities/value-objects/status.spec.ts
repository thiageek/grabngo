import { Status } from './status'

describe('Status', () => {
  it('should be able to create a status', () => {
    const spy = new Status('done')

    expect(spy).toBeTruthy()
  })

  it('should not be able throw new error when status is invalid', () => {
    expect(() => new Status('invalid')).toThrow()
  })
})
