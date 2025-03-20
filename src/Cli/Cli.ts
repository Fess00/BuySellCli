import { generateTsv } from './Generate';
import { ImportToMongoDB } from './Import';
import { version } from '../../package.json';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
        --help : выводит список и описание всех поддерживаемых комманд.
        --generate <n> <filepath> <url> : генерирует tsv файл, где
            n - кол-во генерируемых объявлений.
            filepath - путь для сохранения файла
            url - адрес сервера с которого нужно взять данные
        --version : выводит версию приложения
        --import <filepath> : импортирует указанный фаайл tsv в базу данных MongoDB, где
            filepath - путь к файлу tsv
        `);
    process.exit();
}

const command = args[0];

switch (command) {
    case '--generate':
        if (args.length < 4) {
            console.error("Команда --generate требует 3 аргумента. Справка: npm run cli --help");
            process.exit();
        }
        const generateArgs: string[] = args.slice(1);
        const count = parseInt(generateArgs[0], 10);
        if (isNaN(count)) {
            console.error('Ошибка: Параметр n должен быть числом');
            process.exit();
        }
        (async (n: number = count, filepath: string = generateArgs[1], url: string = generateArgs[2]) => {
            await generateTsv(count, filepath, url);
        })();
        break;
    case '--help':
        console.log(`
        --help : выводит список и описание всех поддерживаемых комманд.
        --generate <n> <filepath> <url> : генерирует tsv файл, где
            n - кол-во генерируемых объявлений.
            filepath - путь для сохранения файла
            url - адрес сервера с которого нужно взять данные
        --version : выводит версию приложения
        --import <filepath> : импортирует указанный фаайл tsv в базу данных MongoDB, где
            filepath - путь к файлу tsv
        `);
        break;
    case '--version':
        console.log(version);
        break;
    case '--import':
        if (args.length < 2) {
            console.error("Команда --import требует 1 аргумент. Справка: npm run cli --help");
            process.exit();
        }
        const importArgs: string[] = args.slice(1);
        ImportToMongoDB(importArgs[0]);
        break;
    default:
        console.error(`Неизвестная комманда: ${command}`)
        process.exit();
}