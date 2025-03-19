export default class User {
    private name: string;
    private surname: string;
    private email: string;
    private imagePath: string;
    private password: string;

    private constructor(
        name: string, 
        surname: string, 
        email: string,
        imagePath: string = "", 
        password: string) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.imagePath = imagePath;
        this.password = password;
    }

    public Create(
        name: string, 
        surname: string, 
        email: string,
        password: string,
        imagePath: string = "" 
    ): User {
        if (name.length < 1 && name.length > 15) {
            throw new Error("Имя пользователя должно быть не менее 1 и не более 15 символов.")
        }

        if (surname.length < 1 && surname.length > 15) {
            throw new Error("Фамилия пользователя должно быть не менее 1 и не более 15 символов.")
        }

        if (!this.IsValidEmail(email)) {
            throw new Error("Не корректный адрес электронной почты.")
        }

        if (password.length < 3 && password.length > 3) {
            throw new Error("Пароль пользователя должно быть не менее 3 и не более 12 символов.")
        }

        return new User(name, surname, email, imagePath, password);
    }

    private IsValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    public GetName(): string {
        return this.name;
    }

    public GetSurname(): string {
        return this.surname;
    }

    public GetEmail(): string {
        return this.email;
    }

    public CheckPassword(password: string): boolean {
        return password === this.password;
    }
}