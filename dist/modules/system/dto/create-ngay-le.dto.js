"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNgayLeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ngay_le_entity_1 = require("../entities/ngay-le.entity");
class CreateNgayLeDto extends (0, swagger_1.PartialType)(ngay_le_entity_1.NgayLe) {
}
exports.CreateNgayLeDto = CreateNgayLeDto;
//# sourceMappingURL=create-ngay-le.dto.js.map