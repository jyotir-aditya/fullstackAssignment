import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Repository,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("text")
  description!: string;

  @Column()
  category!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column("decimal", { precision: 3, scale: 1 })
  rating!: number;

  @ManyToOne(() => User, (user) => user.products)
  user!: User;

  @Column({ name: "user_id", nullable: true })
  user_id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export class ProductRepository extends Repository<Product> {
  // Custom methods for ProductRepository can be added here
}
