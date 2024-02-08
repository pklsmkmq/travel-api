import { User } from "src/auth/auth.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Kategori } from "../kategori/kategori.entity";

@Entity()
export class Wisata extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    nama_wisata: string;

    @Column({ nullable: false })
    gambar_wisata: string;

    @Column({ nullable: false })
    lokasi_wisata: string;

    @Column({ nullable: false })
    rating_wisata: number;

    @Column({ type: 'text', nullable: false })
    deskripsi_wisata: string;

    @Column({ type: 'double', precision: 18, scale: 2, nullable: false })
    harga_wisata: number;

    @ManyToOne(() => Kategori)
    @JoinColumn({ name: 'kategori_id' })
    kategori_id: Kategori;

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