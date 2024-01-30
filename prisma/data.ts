import { OrderStatusNameEnum } from '@prisma/client'

export const adminUser = {
  login: 'admin@grabngo',
  name: 'Admin',
  password:
    '$argon2id$v=19$m=65536,t=3,p=4$Za2R9qjZIDDgGqRP/5wLeA$wCL3jr/aoV51v+0IIycDuanG9OcKWKp8DCZtDA3m+zE', //password
  profile: 0,
  enabled: true,
  createdAt: new Date(),
}

export const productsByCategory = [
  {
    category: 'Lanche',
    products: [
      {
        name: 'X-Burger',
        price: 10.0,
        description: 'Pão, carne, queijo, alface e tomate',
      },
      {
        name: 'X-Bacon',
        price: 12.0,
        description: 'Pão, carne, queijo, alface, tomate e bacon',
      },
    ],
  },
  {
    category: 'Acompanhamento',
    products: [
      {
        name: 'Batata Frita',
        price: 3.0,
        description: '70g de batata frita',
      },
    ],
  },
  {
    category: 'Bebida',
    products: [
      {
        name: 'Coca-Cola',
        price: 4.0,
        description: 'Lata de 350ml Coca-Cola',
      },
      {
        name: 'Guaraná',
        price: 4.0,
        description: 'Lata de 350ml Guaraná',
      },
    ],
  },
]

export const orderStatusList = [
  {
    name: OrderStatusNameEnum.CREATED,
    sequenceOrder: 1,
    description: 'O pedido foi criado pelo cliente.',
  },
  {
    name: OrderStatusNameEnum.INQUEUE,
    sequenceOrder: 2,
    description: 'O pedido está na fila para ser preparado.',
  },
  {
    name: OrderStatusNameEnum.EXPIRED,
    sequenceOrder: 3,
    description: 'O pedido expirou.',
  },
  {
    name: OrderStatusNameEnum.INPROGRESS,
    sequenceOrder: 4,
    description: 'O pedido está sendo preparado.',
  },
  {
    name: OrderStatusNameEnum.CANCELED,
    sequenceOrder: 5,
    description: 'O pedido foi cancelado.',
  },
  {
    name: OrderStatusNameEnum.READY,
    sequenceOrder: 6,
    description: 'O pedido está pronto e em breve poderá ser entregue.',
  },
  {
    name: OrderStatusNameEnum.WAITINGPICKUP,
    sequenceOrder: 7,
    description: 'O pedido está pronto e aguardando retirada.',
  },
  {
    name: OrderStatusNameEnum.DISCARDED,
    sequenceOrder: 8,
    description: 'O pedido foi descartado.',
  },
  {
    name: OrderStatusNameEnum.DELIVERED,
    sequenceOrder: 9,
    description: 'O pedido foi entregue ao cliente.',
  },
]
