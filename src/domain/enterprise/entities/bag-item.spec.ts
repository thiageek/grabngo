import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { BagItem } from './bag-item'

describe('Bag item', () => {
  it('should be able create a bag item', () => {
    const spy = BagItem.create({
      productId: new UniqueEntityId(),
    })

    expect(spy).toBeTruthy()
  })
})
