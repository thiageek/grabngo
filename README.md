# grabngo

![DDD](./docs/ddd.png "DDD")

Miro: https://miro.com/welcomeonboard/SVdxc1dwQjZBVGI1bGxYRDJjSndNdnlxZ2ZJOXVOMlVTTWF0ZThlcUZRbEh0UDlNc2RwbVdrVklJWEt3RG80Q3wzMDc0NDU3MzYwMDIzOTExMTc1fDI=?share_link_id=553122589040

## Glossário

- Catálogo: Conjunto de produtos disponíveis para serem adicionados em pedidos.
- Cliente: Usuário que solicita o pedido, podendo ser identificado com nome, CPF, e-mail.
- Cozinheiro: Usuário responsável por preparar e entregar um pedido.
- Pedido: Solicitação de preparo e entrega de produtos, vinculado a um pagamento, podendo estar vinculado a um cliente. Possui um status de acompanhamento.
- Status de acompanhamento: Indicação do estado de um pedido, podendo ser "Realizado", "Na fila", "Expirado", "Em preparo", "Cancelado", "Pronto", "Aguardando Retirada", "Descartado" e "Entregue"

## Scripts

_i. Executar migrations no banco de dados do ambiente de desenvolvimento:_
```bash 
$ npx prisma migrate dev
```

_ii. Executar migrations no banco de dados dos ambientes de staging ou produção:_
```bash
$ npx prisma migrate deploy
```

_iii. Popular banco de dados:_
```bash
$ npm run prisma:seed
```

_iv. Executar o sistema no ambiente de desenvolvimento:_
```bash
$ npm run start:dev
```

_v. Preparar ambiente para teste de integração:_
```bash
$ npm run pretest:e2e
```

_vi. Executar testes de integração:_
```bash
$ npm run test:e2e
```
