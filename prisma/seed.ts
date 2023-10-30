import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const adminUser = await prisma.user.upsert({
    where: { login: 'admin@grabngo' },
    update: {},
    create: {
      login: 'admin@grabngo',
      name: 'Admin',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$Za2R9qjZIDDgGqRP/5wLeA$wCL3jr/aoV51v+0IIycDuanG9OcKWKp8DCZtDA3m+zE', //password
      profile: 0,
      enabled: true,
      createdAt: new Date(),
    },
  })

  console.log({ adminUser })
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
