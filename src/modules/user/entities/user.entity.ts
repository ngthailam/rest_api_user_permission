import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

const userTblName = 'app_user'
const userTblColId = 'id'
const userTblColName = 'name'

@Entity({ name: userTblName })
export class User {
    @PrimaryGeneratedColumn('uuid', {
        name: userTblColId
    })
    public id: string

    @Column({
        name: userTblColName
    })
    public name: string
}
