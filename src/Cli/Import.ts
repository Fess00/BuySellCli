import { MongoClient } from 'mongodb';
import * as fs from 'fs';

const MONGO_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'test_db';
const COLLECTION_NAME = 'ads';

interface Ad {
    title: string;
    description: string;
    price: string;
    userId: string;
    userName: string;
}

export async function importToMongoDB(filepath: string) {
    let client: MongoClient = new MongoClient(MONGO_URI);

    try {
        // Чтение TSV файла
        const fileContent = fs.readFileSync(filepath, 'utf-8');
        const lines = fileContent.split('\n');
        const headers = lines[0].split('\t');

        const documents: Ad[] = lines.slice(1).map(line => {
            const values = line.split('\t');
            const ad: Partial<Ad> = {}; // Используем Partial для постепенного заполнения

            headers.forEach((header, index) => {
                ad[header as keyof Ad] = values[index];
            });

            return ad as Ad; // Преобразуем обратно к полному типу Ad
        });

        // Подключение к MongoDB
        await client.connect();
        console.log('Подключение к MongoDB успешно установлено');

        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Вставка документов
        await collection.insertMany(documents);
        console.log(`Данные успешно импортированы в MongoDB (${documents.length} записей)`);
    } catch (error) {
        console.error('Ошибка при импорте данных:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('Соединение с MongoDB закрыто');
        }
    }
}