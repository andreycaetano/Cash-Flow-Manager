import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'first_name', type: 'varchar', nullable: false })
    fName: string;

    @Column({ name: 'last_name', type: 'varchar', nullable: false })
    lName: string;

    @Column({ unique: true, nullable: false})
    email: string;

    @Column()
    password: string;

    @Column({ name: 'phone_number', nullable: false })
    phoneNumber: string;

    @Column({ name: 'birthdate', type: 'date', nullable: false})
    birtDate: Date;

    @Column({ default: 'pt-BR' })
    language: string;

    @Column({ name: 'profile_picture_url' ,nullable: false })
    profilePictureUrl: string;

    @Column({ default: 'BRL'})
    currency: string;

    @Column({ name: 'time_zone', default: 'America/Sao_Paulo' })
    timeZone: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @Column({type: 'varchar', default: 'user'})
    role: string;

    @Column({ name: 'reset_password_token' ,type: 'varchar', nullable: true, default: false })
    resetPasswordToken: string
}
