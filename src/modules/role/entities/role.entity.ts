import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

const roleTblName = 'role'
const roleTblColId = 'id'
const roleTblColName = 'name'

@Entity({ name: roleTblName })
export class Role { 
    @PrimaryGeneratedColumn({ name: roleTblColId })
    public id: number

    @Column({ name: roleTblColName, unique: true, nullable: false })
    public name: string
}
