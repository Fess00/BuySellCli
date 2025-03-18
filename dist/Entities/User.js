"use strict";
class User {
    constructor(name = "None", surname = "None", email = "None", password = "None") {
        this.name = email;
        this.surname = surname;
        this.email = email;
        this.password = password;
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
