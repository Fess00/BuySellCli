"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Advert {
    constructor(title, description, publishDate, imagePath, advertType, commentCount, price, author, categories) {
        this.title = title;
        this.description = description;
        this.publishDate = publishDate;
        this.imagePath = imagePath;
        this.advertType = advertType;
        this.commentCount = commentCount;
        this.price = price;
        this.author = author;
        this.categories = categories;
    }
    static MakeAdvert(title, description, publishDate, imagePath, advertType, commentCount, price, author, categories) {
        if (title.length < 10 || title.length > 100) {
            throw new Error("Наименование должно быть от 10 до 100 символов.");
        }
        if (description.length < 20 || description.length > 1024) {
            throw new Error("Описание должно быть от 20 до 1024 символов.");
        }
        if (!imagePath.match(/\.(jpg|png)$/i)) {
            throw new Error("Изображение должно быть в формате .jpg или .png.");
        }
        if (price < 100 || price > 200000) {
            throw new Error("Стоимость должна быть в диапазоне от 100 до 200 000.");
        }
        if (!author) {
            throw new Error("Автор объявления обязателен.");
        }
        if (!categories || categories.length === 0) {
            throw new Error("Объявление должно принадлежать хотя бы к одной категории.");
        }
        return new Advert(title, description, publishDate, imagePath, advertType, commentCount, price, author, categories);
    }
    GetTitle() {
        return this.title;
    }
    GetDescription() {
        return this.description;
    }
    GetPublishDate() {
        return this.publishDate;
    }
    GetImagePath() {
        return this.imagePath;
    }
    GetAdvertType() {
        return this.advertType;
    }
    GetCommentCount() {
        return this.commentCount;
    }
    GetPrice() {
        return this.price;
    }
    GetAuthor() {
        return this.author;
    }
    GetCatergories() {
        return this.categories;
    }
}
exports.default = Advert;
