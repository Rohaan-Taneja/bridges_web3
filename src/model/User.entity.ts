import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    emailId : string;

    @Column()
    password : string;
} 