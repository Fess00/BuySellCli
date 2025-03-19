import { Command } from 'commander';
import { generateTsv } from './Generate';
import { importToMongoDB } from './Import';
import { version } from '../../package.json';

const program = new Command();

program
    .name('version')
    .description('Вывод версии приложения.')
    .version(version);

program
    .command('generate <n> <filepath> <url>')
    .description('Создает TSV файл с тестовыми данными')
    .action(async (n, filepath, url) => {
        const count = parseInt(n, 10);
        if (isNaN(count)) {
            console.error('Ошибка: Параметр n должен быть числом');
            process.exit(1);
        }
        await generateTsv(count, filepath, url);
    });

program
    .command('import <filepath>')
    .description('Импортирует данные из TSV файла в MongoDB')
    .action(importToMongoDB);

program
    .command('help')
    .description('Выводит справку')
    .action(() => program.outputHelp())
    .addHelpText("after", `
    
        --help : выводит список и описание всех поддерживаемых аргументов.
        --generate <n> <filepath> <url> :
            n - кол-во генерируемых объявлений.
            filepath - путь для сохранения файла
            url - адрес сервера с которого нужно взять данные
        `);

program.parse(process.argv);