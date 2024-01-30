import { PrismaClient, OrderStatusNameEnum } from '@prisma/client'
import { adminUser, orderStatusList, productsByCategory } from './data'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()
  await prisma.productCategories.deleteMany()
  await prisma.item.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  await prisma.user
    .create({
      data: adminUser,
    })
    .then((user) => {
      console.log(`- Admin user with login "${user.login}" created`)
    })

  await Promise.all(
    productsByCategory.map(async (category) => {
      const categoryCreated = await prisma.category.create({
        data: {
          name: category.category,
        },
      })
      category.products.map(async (product) => {
        const productCreated = await prisma.product.create({
          data: {
            name: product.name,
            price: product.price,
            description: product.description,
          },
        })

        await prisma.productCategories.create({
          data: {
            productId: productCreated.id,
            categoryId: categoryCreated.id,
          },
        })
      })
    }),
  ).then(() => {
    console.log('- Products created')
  })

  await Promise.all(
    orderStatusList.map(async (orderStatus) => {
      await prisma.orderStatus.create({
        data: {
          name: OrderStatusNameEnum[orderStatus.name as keyof typeof OrderStatusNameEnum],
          sequenceOrder: orderStatus.sequenceOrder,
          description: orderStatus.description,
        },
      })
    }),
  ).then(() => {
    console.log('- Order status created')
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
