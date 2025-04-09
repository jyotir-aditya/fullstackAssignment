"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
let cachedServer;
async function bootstrap() {
    if (!cachedServer) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors();
        app.setGlobalPrefix("api");
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: false,
            transform: true,
        }));
        await app.init();
        cachedServer = app;
    }
    return cachedServer;
}
exports.default = async (req, res) => {
    const server = await bootstrap();
    server.getHttpAdapter().getInstance()(req, res);
};
//# sourceMappingURL=vercel.js.map