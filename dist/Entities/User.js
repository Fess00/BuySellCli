"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(name, surname, email, imagePath = "", password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.imagePath = imagePath;
        this.password = password;
    }
    Create(name, surname, email, password, imagePath = "") {
        if (name.length < 1 && name.length > 15) {
            throw new Error("Имя пользователя должно быть не менее 1 и не более 15 символов.");
        }
        if (surname.length < 1 && surname.length > 15) {
            throw new Error("Фамилия пользователя должно быть не менее 1 и не более 15 символов.");
        }
        if (!this.IsValidEmail(email)) {
            throw new Error("Не корректный адрес электронной почты.");
        }
        if (password.length < 3 && password.length > 3) {
            throw new Error("Пароль пользователя должно быть не менее 3 и не более 12 символов.");
        }
        return new User(name, surname, email, imagePath, password);
    }
    IsValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    GetName() {
        return this.name;
    }
    GetSurname() {
        return this.surname;
    }
    GetEmail() {
        return this.email;
    }
    CheckPassword(password) {
        return password === this.password;
    }
}
exports.default = User;
