import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

const permTblName = 'permission'
const permTblColId = 'id'
const permTblColCode = 'code'
const permTblColDesc = 'description'

@Entity({ name: permTblName })
export class Permission {
    @PrimaryGeneratedColumn({ name: permTblColId })
    public id: number

    @Column({ name: permTblColCode, unique: true, nullable: false })
    public code: string

    @Column({ name: permTblColDesc, default: '' })
    public description: string
}
