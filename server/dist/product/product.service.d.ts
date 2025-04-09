import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FilterProductDto } from "./dto/filter-product.dto";
import { User } from "../user/entities/user.entity";
export declare class ProductService {
    private supabase;
    constructor();
    create(createProductDto: CreateProductDto, user: User): Promise<Product>;
    findAll(filterDto: FilterProductDto): Promise<{
        data: Product[];
        total: number;
    }>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto, user: User): Promise<Product>;
    remove(id: string, user: User): Promise<void>;
}
