import http from 'k6/http'
import { sleep } from 'k6'

export const options = {
  stages: [
    { duration: '10m', target: 20000 },
    { duration: '30m', target: 2000 },
    { duration: '5m', target: 1000 },
  ],
}
export default function () {
  const data = { login: 'user', password: 'password' }
  let res = http.post('http://server/api/v1/auth/sig-in', data)

  check(res, { 'success login': (r) => r.status === 200 })

  sleep(10)
}
