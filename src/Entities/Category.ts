export default class Category {
    private name: string;
    private imagePath: string;
    private advertCount: number;

    private constructor(name: string, imagePath: string, advertCount: number) {
        this.advertCount = advertCount;
        this.imagePath = imagePath;
        this.name = name;
    }

    public static Create(name: string, imagePath: string, advertCount: number = 0): Category {
        if (name.length < 3 && name.length > 12) {
            throw new Error("Длина должна быть от 3 до 12 символов!");
        }

        if (!imagePath.match(/\.(jpg|png)$/i)) {
            throw new Error("Изображение должно быть в формате .jpg или .png.");
        }

        return new Category(name, imagePath, advertCount);
    }

    public GetName(): string {
        return this.name;
    }

    public GetImagePath(): string {
        return this.imagePath;
    }

    public GetAdvertCount(): number {
        return this.advertCount;
    }

    public SetAdvertCount(count: number) {
        this.advertCount = count;
    }

    public Clone(): Category {
        return Category.Create(this.name, this.imagePath, this.advertCount);
    }
}