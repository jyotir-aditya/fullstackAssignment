"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const SUPABASE_URL = "https://kuselopeqgsjoqdtkcyj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1c2Vsb3BlcWdzam9xZHRrY3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDE0MzgwMCwiZXhwIjoyMDU5NzE5ODAwfQ.MLhg0-8zW6qsg6KEPMDo6WmWGPIDS9bc4dzXqXH0XYc";
let ProductService = class ProductService {
    constructor() {
        this.supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
    }
    async create(createProductDto, user) {
        const { data, error } = await this.supabase
            .from("products")
            .insert([Object.assign(Object.assign({}, createProductDto), { user_id: user.id })])
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async findAll(filterDto) {
        const { search, category, minPrice, maxPrice, minRating, sortBy = 'id', sortOrder = 'DESC', page = 1, limit = 8, } = filterDto;
        let query = this.supabase.from("products").select("*", { count: "exact" });
        if (search) {
            query = query.ilike("name", `%${search}%`);
        }
        if (category) {
            query = query.ilike("category", `%${category}%`);
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            query = query.gte("price", minPrice).lte("price", maxPrice);
        }
        else if (minPrice !== undefined) {
            query = query.gte("price", minPrice);
        }
        else if (maxPrice !== undefined) {
            query = query.lte("price", maxPrice);
        }
        if (minRating !== undefined) {
            query = query.gte("rating", minRating);
        }
        if (sortBy) {
            query = query.order(sortBy, { ascending: sortOrder !== "DESC" });
        }
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);
        const { data, error, count } = await query;
        if (error) {
            console.error("Error fetching products:", error);
            throw new Error(`Failed to fetch products: ${error.message}`);
        }
        return {
            data: data,
            total: count || 0
        };
    }
    async findOne(id) {
        console.log("Fetching product ID:", id);
        const { data, error } = await this.supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            console.error("Error fetching product:", error);
            throw new common_1.NotFoundException(`Product not found`);
        }
        return data;
    }
    async update(id, updateProductDto, user) {
        const product = await this.findOne(id);
        if (product.user_id !== user.id) {
            throw new common_1.NotFoundException(`Product not found or you don't have permission to update it`);
        }
        if (Object.keys(updateProductDto).length === 0) {
            throw new Error("Nothing to update - no fields provided");
        }
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
        return data;
    }
    async remove(id, user) {
        const product = await this.findOne(id);
        if (product.user_id !== user.id) {
            throw new common_1.NotFoundException(`Product not found or you don't have permission to delete it`);
        }
        const { error } = await this.supabase
            .from("products")
            .delete()
            .eq("id", id);
        if (error) {
            throw new Error(`Failed to delete: ${error.message}`);
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProductService);
//# sourceMappingURL=product.service.js.map