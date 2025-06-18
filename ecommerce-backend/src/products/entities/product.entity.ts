import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Specification } from './specification.entity';
import { Tag } from './tag.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Vendor, vendor => vendor.products)
  vendor: Vendor;

  @OneToMany(() => Specification, specification => specification.product)
  specifications: Specification[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems: CartItem[];

  @ManyToOne(() => User, user => user.products)
  seller: User;

  @OneToMany(() => Wishlist, wishlist => wishlist.product)
  wishlists: Wishlist[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 