import { PrismaClient } from '@prisma/client'
import { adminUser, productsByCategory } from './data'

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
