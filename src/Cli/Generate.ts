import axios from 'axios';
import * as fs from 'fs';

interface User {
    id: string;
    name: string;
}

interface Ad {
    title: string;
    description: string;
    price: number;
    userId: string;
    userName: string;
}

export async function generateTsv(n: number, filepath: string, url: string) {
    try {
        console.log(`Генерация ${n} объявлений...`);

        // Получение данных с сервера
        const response = await axios.get<User[]>(url); // Указываем тип данных для ответа
        const users: User[] = response.data;

        // Генерация объявлений
        const ads: Ad[] = [];
        for (let i = 0; i < n; i++) {
            const user = users[i % users.length];
            ads.push({
                title: `Ad ${i + 1}`,
                description: `Description for Ad ${i + 1}`,
                price: Math.floor(Math.random() * 1000),
                userId: user.id,
                userName: user.name
            });
        }

        // Формирование заголовков и строк TSV
        const headers = Object.keys(ads[0]) as (keyof Ad)[];
        const tsvData = [headers.join('\t')];
        ads.forEach(ad => {
            const row = headers.map(header => String(ad[header]));
            tsvData.push(row.join('\t'));
        });

        // Запись в файл
        fs.writeFileSync(filepath, tsvData.join('\n'));
        console.log(`TSV файл успешно создан: ${filepath}`);
    } catch (error) {
        console.error('Ошибка при генерации TSV:', error);
    }
}