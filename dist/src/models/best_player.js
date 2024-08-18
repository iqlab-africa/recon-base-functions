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
exports.BestPlayer = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let BestPlayer = class BestPlayer extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.INTEGER,
        comment: "The famous identifier",
    }),
    __metadata("design:type", Number)
], BestPlayer.prototype, "bestPlayerId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], BestPlayer.prototype, "robotName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], BestPlayer.prototype, "robotDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], BestPlayer.prototype, "bestPlayer", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], BestPlayer.prototype, "date", void 0);
BestPlayer = __decorate([
    sequelize_typescript_1.Table
], BestPlayer);
exports.BestPlayer = BestPlayer;
//# sourceMappingURL=best_player.js.map