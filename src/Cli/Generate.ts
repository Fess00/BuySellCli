import axios, { all } from 'axios';
import * as fs from 'fs';
import Category from '../Entities/Category';
import Advert from '../Entities/Advert';
import User from '../Entities/User';
import { AdvertTypes } from '../Enums/AdvertTypes';
import { start } from 'repl';

export async function generateTsv(n: number, filepath: string, url: string) {
    try {
        console.log(`Генерация ${n} объявлений...`);

        const mockUsers = await axios.get<{
            name: string,
            surname: string,
            email: string,
            imagePath: string,
            password: string
        }[]>(url + "/users");
        const users = mockUsers.data;

        const mockCategories = await axios.get<{
            name: string,
            imagePath: string
        }[]>(url + "/categories");
        const categories = mockCategories.data;

        const allUsers: User[] = [];
        const allCategories: Category[] = [];

        users.forEach((user, index) => {
            if (user.imagePath === "")
                user.imagePath = "None";
            allUsers.push(User.Create(
                user.name,
                user.surname,
                user.email,
                user.password,
                user.imagePath
            ));
        });

        categories.forEach((category, index) => {
            allCategories.push(Category.Create(
                category.name,
                category.imagePath
            ));
        });

        const allAdverts: Advert[] = CreateAdverts(n, allUsers, allCategories);

        allCategories.forEach((category, index) => {
            let count: number = allAdverts.filter(advert => 
                advert.GetCatergories().some(match => 
                    category.GetName() === match.GetName())).length;
            category.SetAdvertCount(count);
        });

        // Формирование заголовков и строк TSV
        const userHeaders = ["id\tname\tsurname\temail\tpassword\timagePath"];
        const categoryHeaders = ["id\tname\timagePath\tadvertCount"];
        const advertHeaders = ["id\ttitle\tdescription\tpublishDate\timagePath\tadvertType\tcommentCount\tprice\tauthor\tcategories"];

        const userTsvData = [userHeaders.join('\t')];
        users.forEach((user, index) => {
            userTsvData.push(`${index + 1}\t${user.name}\t${user.surname}\t${user.email}\t${user.password}\t${user.imagePath}`);
        });

        const categoryTsvData = [categoryHeaders.join('\t')];
        allCategories.forEach((category, index) => {
            categoryTsvData.push(`${index + 1}\t${category.GetName()}\t${category.GetImagePath()}\t${category.GetAdvertCount()}`);
        });

        const advertTsvData = [advertHeaders.join('\t')];
        allAdverts.forEach((advert, index) => {
            let cats: string = "";
            advert.GetCatergories().forEach((adcat, index) => {
                allCategories.forEach((cat, cindex) => {
                    if (cat.GetName() === adcat.GetName()) {
                        cats += cindex + ",";
                    }
                });
            });

            advertTsvData.push(`${index + 1}\t${advert.GetTitle()}\t${advert.GetDescription()}\t${advert.GetPublishDate().toString()}\t${advert.GetImagePath()}\t${advert.GetAdvertType()}\t${advert.GetCommentCount()}\t${advert.GetPrice()}\t${GetRandom(1, 5)}\t${cats.substring(0, cats.length - 2)}`);
        });

        const combinedTsv: string = [
            '# Users',
            userTsvData.join('\n'),
            '\n# Categories',
            categoryTsvData.join('\n'),
            '\n# Adverts',
            advertTsvData.join('\n'),
        ].join('\n');

        // Запись в файл
        fs.writeFileSync(filepath, combinedTsv);
        console.log(`TSV файл успешно создан: ${filepath}`);
    } catch (error) {
        console.error('Ошибка при генерации TSV:', error);
    }
}

function CreateAdverts(n: number, users: User[], categories: Category[]): Advert[] {
    const ads: Advert[] = [];

    const titles: string[] = [
        "Obj obj obj obj 1", 
        "Obj obj obj obj 2", 
        "Obj obj obj obj 3", 
        "Obj obj obj obj 4", 
        "Obj obj obj obj 5", 
        "Obj obj obj obj 6"];
    const descs: string[] = [
        "Desc Desc Desc Desc Desc 1",
         "Desc Desc Desc Desc Desc 2",
          "Desc Desc Desc Desc Desc 3",
           "Desc Desc Desc Desc Desc 4",
            "Desc Desc Desc Desc Desc 5",
             "Desc Desc Desc Desc Desc 6"];
    const types: string[] = ["Buy", "Sell"];

    for (let i = 0; i < n; i++) {
        let type: AdvertTypes = types[GetRandom(0, 1)] === "Buy" ? AdvertTypes.Buy : AdvertTypes.Sell;
        ads.push(Advert.Create(
            titles[GetRandom(0, 5)],
            descs[GetRandom(0, 5)],
            GetRandomDate(),
            "./logo.png",
            type,
            GetRandom(0, 60),
            GetRandom(100, 200000),
            users[GetRandom(0, 4)],
            ChooseCategories(categories)
        ));    
    }

    return ads;
}

function ChooseCategories(categories: Category[]): Category[] {
    const howMuch: number = GetRandom(1, 6);
    const selected = new Set<Category>();
    const res: Category[] = [];

    while (selected.size < howMuch && selected.size < categories.length) {
        const randomIndex = GetRandom(0, 5);
        const element = categories[randomIndex];
        
        if (!selected.has(element)) {
            selected.add(element);
            res.push(element);
        }
    }
    
    return res;
}

function GetRandom(min: number, max: number): number {
    const m = Math.floor(Math.random() * (max - min + 1)) + min;
    return m;
}

function GetRandomDate(): Date {
    const begin: Date = new Date(2024, 1, 1);
    const end: Date = new Date(2025, 0, 0);
    return new Date(begin.getTime() + Math.random() * (end.getTime() - begin.getTime()));
}