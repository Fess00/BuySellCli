import { Db, MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export async function ImportToMongoDB(filepath: string) {
    let client: MongoClient = new MongoClient(process.env.DB_URI!.toString());

    try {
        const path: string = fs.readFileSync(filepath, 'utf-8');

        const lines: string[] = path.split('\n').map(line => line.trim());

        let users: {
            id: string
            name: string,
            surname: string,
            email: string,
            imagePath: string,
            password: string
        }[] = [];
        let categories: {
            id: string
            name: string,
            imagePath: string,
            advertCount: string
        }[] = [];
        let adverts: {
            id: string
            title: string,
            description: string,
            publishDate: string,
            imagePath: string,
            advertType: string,
            commentCount: string,
            price: string,
            author: string,
            categories: string
        }[] = [];
        let current: string;

        lines.forEach((line, index) => {
            if (line === "# Users")
                current = "Users";
            else if (line === "# Categories")
                current = "Categories"
            else if (line === "# Adverts")
                current = "Adverts"

            let data: string[] = [];
            if (line != "")
                data = line.split('\t');

            if (current === "Users" && line != "") {
                users.push({
                    "id": data[0],
                    "name": data[1],
                    "surname": data[2],
                    "email": data[3],
                    "imagePath": data[5],
                    "password": data[4],
                });
            }
            else if (current === "Categories" && line != "") {
                categories.push({
                    "id": data[0],
                    "name": data[1],
                    "imagePath": data[2],
                    "advertCount": data[3]
                });
            }
            else if (current === "Adverts" && line != "") {
                adverts.push({
                    "id": data[0],
                    "title": data[1],
                    "description": data[2],
                    "publishDate": data[3],
                    "imagePath": data[4],
                    "advertType": data[5],
                    "commentCount": data[6],
                    "price": data[7],
                    "author": data[8],
                    "categories": data[9]
                });
            }
        });

        await client.connect();
        console.log('Подключение к MongoDB успешно установлено');

        const db = client.db(process.env.DB_NAME!.toString());
        await MakeDeleteCollection("Users", db);
        await MakeDeleteCollection("Categories", db);
        await MakeDeleteCollection("Adverts", db);
        
        await db.collection("Users").insertMany(users);
        await db.collection("Categories").insertMany(categories);
        await db.collection("Adverts").insertMany(adverts);

        console.log('Данные успешно отправлены');
    } catch (error) {
        console.error('Ошибка при импорте данных:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('Соединение с MongoDB закрыто');
        }
    }
}

async function MakeDeleteCollection(name: string, db: Db) {
    if ((await db.collections()).find((collection) => collection.collectionName === name)) {
        await db.collection(name).drop();
        await db.createCollection(name);
    } else {
        await db.createCollection(name);
    }
}