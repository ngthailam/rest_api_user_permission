import { Role } from "src/modules/role/entities/role.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

const userTblName = 'app_user'
const userTblColId = 'id'
const userTblColName = 'name'
const userTblColPasswordSalt = 'password_salt'
const userTblColPassword = 'password'

@Entity({ name: userTblName })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: userTblColId })
    public id: string

    @Column({ name: userTblColName, unique: true, nullable: false })
    public name: string

    @Column({ name: userTblColPasswordSalt })
    public passwordSalt: string

    // in hash form
    @Column({ name: userTblColPassword })
    public password: string

    @ManyToMany(() => Role, (role: Role) => role.users)
    @JoinTable()
    public roles: Role[]
}
