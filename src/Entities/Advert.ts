import { AdvertTypes } from "../Enums/AdvertTypes";
import Category from "./Category";
import User from "./User";

export default class Advert {
    private title: string;
    private description: string;
    private publishDate: Date;
    private imagePath: string;
    private advertType: AdvertTypes;
    private commentCount: number;
    private price: number;
    private author: User;
    private categories: Category[];
    

    private constructor(
        title: string,
        description: string,
        publishDate: Date,
        imagePath: string,
        advertType: AdvertTypes,
        commentCount: number,
        price: number,
        author: User,
        categories: Category[]
    ) {
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

    public static MakeAdvert(
        title: string,
        description: string,
        publishDate: Date,
        imagePath: string,
        advertType: AdvertTypes,
        commentCount: number,
        price: number,
        author: User,
        categories: Category[]
    ): Advert {
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

        return new Advert(
            title,
            description,
            publishDate,
            imagePath,
            advertType,
            commentCount,
            price,
            author,
            categories
        );
    }

    public GetTitle(): string {
        return this.title;
    }

    public GetDescription(): string {
        return this.description;
    }

    public GetPublishDate(): Date {
        return this.publishDate;
    }

    public GetImagePath(): string {
        return this.imagePath;
    }

    public GetAdvertType(): AdvertTypes {
        return this.advertType;
    }

    public GetCommentCount(): number {
        return this.commentCount;
    }

    public GetPrice(): number {
        return this.price;
    }

    public GetAuthor(): User {
        return this.author;
    }

    public GetCatergories(): Category[] {
        return this.categories;
    }

}