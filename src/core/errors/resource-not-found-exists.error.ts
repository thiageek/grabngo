export class ResourceNotFound extends Error {
  constructor(message?: string) {
    super(message ?? 'Resource not found')
  }
}
