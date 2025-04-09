import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  rating!: number;
}
