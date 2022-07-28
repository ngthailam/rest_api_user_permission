import { Role } from "src/modules/role/entities/role.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

const userTblName = 'app_user'
const userTblColId = 'id'
const userTblColName = 'name'

@Entity({ name: userTblName })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: userTblColId })
    public id: string

    @Column({ name: userTblColName })
    public name: string

    @ManyToMany(() => Role, (role: Role) => role.users)
    @JoinTable()
    public roles: Role[]
}
