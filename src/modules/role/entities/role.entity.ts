import { Permission } from "src/modules/permission/entities/permission.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

const roleTblName = 'role'
const roleTblColId = 'id'
const roleTblColName = 'name'
const roleTblColDesc = 'description'

@Entity({ name: roleTblName })
export class Role { 
    @PrimaryGeneratedColumn({ name: roleTblColId })
    public id: number

    @Column({ name: roleTblColName, unique: true, nullable: false })
    public name: string

    @Column({ name: roleTblColDesc, default: '' })
    public description: string

    @ManyToMany(() => Permission, (permission: Permission) => permission.roles)
    @JoinTable()
    public permissions: Permission[]

    @ManyToMany(() => User, (user: User) => user.roles)
    public users: User[]
}
