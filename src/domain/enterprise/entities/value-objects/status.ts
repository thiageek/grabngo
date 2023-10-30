export class Status {
  private readonly status: string
  statusValid: string[] = [
    'done',
    'in-queue',
    'expired',
    'in-progress',
    'canceled',
    'ready',
    'waiting-pickup',
    'discarded',
    'delivered',
  ]
  get value(): string {
    return this.status
  }

  private isValid(status: string): boolean {
    return this.statusValid.includes(status)
  }

  constructor(status: string) {
    if (!this.isValid(status)) throw new Error('Invalid status')
    this.status = status
  }
}
