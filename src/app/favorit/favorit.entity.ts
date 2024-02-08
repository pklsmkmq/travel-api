import { User } from "src/auth/auth.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Wisata } from "../wisata/wisata.entity";

@Entity()
export class Favorit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_user' })
    id_user: User;

    @ManyToOne(() => Wisata)
    @JoinColumn({ name: 'id_wisata' })
    id_wisata: Wisata;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    created_by: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'updated_by' })
    updated_by: User;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}