import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FilterProductDto } from "./dto/filter-product.dto";
import { User } from "../user/entities/user.entity";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

// FIXME: Move these to env variables
const SUPABASE_URL = "https://kuselopeqgsjoqdtkcyj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1c2Vsb3BlcWdzam9xZHRrY3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDE0MzgwMCwiZXhwIjoyMDU5NzE5ODAwfQ.MLhg0-8zW6qsg6KEPMDo6WmWGPIDS9bc4dzXqXH0XYc";

@Injectable()
export class ProductService {
  private supabase: SupabaseClient;

  constructor() {
    // Init client
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async create(
    createProductDto: CreateProductDto,
    user: User
  ): Promise<Product> {
    // Insert product into DB
    const { data, error } = await this.supabase
      .from("products")
      .insert([{ ...createProductDto, user_id: user.id }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Product;
  }

  async findAll(
    filterDto: FilterProductDto
  ): Promise<{ data: Product[]; total: number }> {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      sortBy = 'id', // default sort changed to 'id'
      sortOrder = 'DESC',
      page = 1,
      limit = 8,
    } = filterDto;

    let query = this.supabase.from("products").select("*", { count: "exact" });

    // TODO: Add user filtering?
    
    // Apply filters if they exist
    if (search) {
      // Basic search
      query = query.ilike("name", `%${search}%`);
    }

    if (category) {
      // Filter by category
      query = query.ilike("category", `%${category}%`);
    }

    // Price filters
    if (minPrice !== undefined && maxPrice !== undefined) {
      query = query.gte("price", minPrice).lte("price", maxPrice);
    } else if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    } else if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    // Rating filter
    if (minRating !== undefined) {
      query = query.gte("rating", minRating);
    }

    // Apply sort
    if (sortBy) {
      query = query.order(sortBy, { ascending: sortOrder !== "DESC" });
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return { 
      data: data as Product[], 
      total: count || 0 
    };
  }

  async findOne(id: string): Promise<Product> {
    console.log("Fetching product ID:", id);

    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      throw new NotFoundException(`Product not found`);
    }

    return data as Product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: User
  ): Promise<Product> {
    // Get current product
    const product = await this.findOne(id);

    // Check ownership
    if (product.user_id !== user.id) {
      throw new NotFoundException(`Product not found or you don't have permission to update it`);
    }

    // Validate update data
    if (Object.keys(updateProductDto).length === 0) {
      throw new Error("Nothing to update - no fields provided");
    }

    // Do the update
    const { data, error } = await this.supabase
      .from("products")
      .update(updateProductDto)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update failed:", error);
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return data as Product;
  }

  async remove(id: string, user: User): Promise<void> {
    // First check if product exists and belongs to user
    const product = await this.findOne(id);

    if (product.user_id !== user.id) {
      throw new NotFoundException(`Product not found or you don't have permission to delete it`);
    }

    // Then delete it
    const { error } = await this.supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete: ${error.message}`);
    }
  }
}
