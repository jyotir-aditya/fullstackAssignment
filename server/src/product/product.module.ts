import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { Product } from "./entities/product.entity";

@Module({
  imports: [], // Removed TypeOrmModule and ProductRepository
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
