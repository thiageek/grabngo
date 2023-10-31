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
