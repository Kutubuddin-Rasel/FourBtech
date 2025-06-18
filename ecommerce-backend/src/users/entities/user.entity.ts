import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserRole } from '../../auth/decorators/roles.decorator';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Order } from '../../orders/entities/order.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  role: UserRole;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ nullable: true })
  businessName: string;

  @OneToOne(() => Vendor, vendor => vendor.user)
  @JoinColumn()
  vendorProfile: Vendor;

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];

  @OneToMany(() => CartItem, cartItem => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => Wishlist, wishlist => wishlist.customer)
  wishlist: Wishlist[];

  @OneToMany(() => Review, review => review.customer)
  reviews: Review[];

  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// export { UserRole }; // Not needed, as enum is defined directly 