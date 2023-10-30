export class Profile {
  private readonly profile: number
  get value(): number {
    return this.profile
  }

  /**
   *  Check is profile is valid
   * 0 = root
   * 1 = administrator
   * 2 = chef
   * 3 = receptionist
   * @param profile
   * @returns boolean
   */
  private isProfileValid(profile: number): boolean {
    return profile >= 0 && profile <= 3
  }

  constructor(profile: number) {
    if (!this.isProfileValid(profile)) throw new Error('Invalid profile')
    this.profile = profile
  }
}
