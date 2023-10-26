import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Bag } from './bag'
import { BagItem } from './bag-item'

describe('Bag', () => {
  it('should be able create a bag', () => {
    const item = BagItem.create({
      productId: new UniqueEntityId(),
    })
    const spy = Bag.create({
      orderId: new UniqueEntityId(),
      items: [item],
    })

    expect(spy).toBeTruthy()
    expect(spy.items.length).toEqual(1)
  })

  it('should', () => {
    const item = BagItem.create({
      productId: new UniqueEntityId(),
    })
    const spy = Bag.create({
      orderId: new UniqueEntityId(),
      items: [item],
    })

    expect(spy).toBeTruthy()
    expect(spy.items.length).toEqual(1)
  })
})
