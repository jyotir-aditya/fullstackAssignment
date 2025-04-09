import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
} from "class-validator";
import { CreateProductDto } from "./create-product.dto";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
}
