import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm"

@Entity('book')
export default class Book {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    name: string

    @Column()
    color: string

}