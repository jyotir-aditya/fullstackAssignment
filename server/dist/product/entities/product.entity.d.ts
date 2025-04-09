import { Repository } from "typeorm";
import { User } from "../../user/entities/user.entity";
export declare class Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    rating: number;
    user: User;
    user_id: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProductRepository extends Repository<Product> {
}
