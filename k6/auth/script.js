import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '1m', target: 1000 },
    { duration: '3m', target: 3000 },
    { duration: '1m', target: 1000 },
  ],
}
export default function () {
  const data = { login: 'user', password: 'password' }
  let res = http.post('http://server/api/v1/auth/sig-in', data)

  check(res, { 'success login': (r) => r.status === 201 })

  sleep(5)
}
