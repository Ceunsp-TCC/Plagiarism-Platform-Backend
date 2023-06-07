import Schools from 'App/Models/Schools'
import SchoolAddress from 'App/Models/SchoolAddress'

export default interface SchoolRepositoryInterface {
  create(school: Schools, schoolAddress: SchoolAddress): Promise<boolean>
  findByEmail(email: string): Promise<Schools | null>
}
