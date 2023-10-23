export class ResourceAlreadyExists extends Error {
  constructor(message?: string) {
    super(message ?? 'Resource already exists')
  }
}
