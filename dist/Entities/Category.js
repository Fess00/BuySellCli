"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Category {
    constructor(name, imagePath, advertCount) {
        this.advertCount = advertCount;
        this.imagePath = imagePath;
        this.name = name;
    }
    static MakeCategory(name, imagePath, advertCount) {
        if (name.length < 3 && name.length > 12) {
            throw new Error("Длина должна быть от 3 до 12 символов!");
        }
        if (!imagePath.match(/\.(jpg|png)$/i)) {
            throw new Error("Изображение должно быть в формате .jpg или .png.");
        }
        return new Category(name, imagePath, advertCount);
    }
    GetName() {
        return this.name;
    }
    GetImagePath() {
        return this.imagePath;
    }
    GetAdvertCount() {
        return this.advertCount;
    }
}
exports.default = Category;
