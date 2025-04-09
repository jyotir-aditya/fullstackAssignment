import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FilterProductDto } from "./dto/filter-product.dto";
import { Request } from "express";
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto, req: Request): Promise<import("./entities/product.entity").Product>;
    findAll(filterDto: FilterProductDto): Promise<{
        data: import("./entities/product.entity").Product[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto, req: Request): Promise<import("./entities/product.entity").Product>;
    remove(id: string, req: Request): Promise<void>;
}
