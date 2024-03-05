import { User } from "src/auth/auth.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "../payment/payment.entity";
import { Wisata } from "../wisata/wisata.entity";

@Entity()
export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    date_booking: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_user' })
    id_user: User;

    @ManyToOne(() => Wisata)
    @JoinColumn({ name: 'id_wisata' })
    id_wisata: Wisata;

    @Column({ nullable: false })
    name_booking: string;

    @Column({ nullable: false })
    contact_booking: string;

    @Column({ nullable: false })
    qty_booking: number;

    @Column({ nullable: false })
    total_booking: number;

    @ManyToOne(() => Payment)
    @JoinColumn({ name: 'id_payment' })
    id_payment: Payment;

    @Column({ nullable: false })
    status_booking: boolean;

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