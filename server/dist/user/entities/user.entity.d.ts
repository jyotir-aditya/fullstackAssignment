import { Product } from "../../product/entities/product.entity";
export declare class User {
    id: string;
    email: string;
    password: string;
    role: string;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
