import express, { Express, Request, response, Response } from 'express';
import dotenv from 'dotenv';
import { MongoClient, WithId } from 'mongodb';

dotenv.config();

const client: MongoClient = new MongoClient(process.env.DB_URI!.toString());

(async () => {
    client.connect();
})();

const enteredUsers: {userName: string, token: string}[] = [];

const app: Express = express();

app.get('/advert/create', async (req, res) => {
    const from: {
        token: string,
        title: string,
        description: string,
        publishDate: string,
        imagePath: string,
        advertType: string,
        price: string,
        author: string,
        categories: string
    } = req?.body;

    if (from.token === process.env.PORT) {
        const all = await client.db(process.env.DB_NAME!.toString()).collection("Adverts").find({}).toArray();
        await client.db(process.env.DB_NAME!.toString()).collection("Adverts").insertOne({
            id: all[all.length],
            title: from.title,
            description: from.publishDate,
            imagePath: from.imagePath,
            advertType: from.advertType,
            commentCount: "0",
            price: from.price,
            author: from.author,
            categories: from.categories
        });
        res.json({
            id: all[all.length],
            title: from.title,
            description: from.publishDate,
            imagePath: from.imagePath,
            advertType: from.advertType,
            commentCount: "0",
            price: from.price,
            author: from.author,
            categories: from.categories
        });
        return;
    }

    res.json({type: "error", message: "Нет пользователя"});
});

app.get('/advert/change', async (req, res) => {
    const from: {
        token: string,
        title: string,
        description: string,
        publishDate: string,
        imagePath: string,
        advertType: string,
        price: string,
        author: string,
        categories: string
    } = req?.body;

    if (from.token === process.env.PORT) {
        const all = await client.db(process.env.DB_NAME!.toString()).collection("Adverts").findOne({
            title: from.title,
            description: from.description,
            publishDate: from.publishDate,
            imagePath: from.imagePath,
            advertType: from.advertType,
            price: from.price,
            author: from.author,
            categories: from.categories
        });

        if (all && from.author === all.author) {
            await client.db(process.env.DB_NAME!.toString()).collection("Adverts").replaceOne(all, {
                id: all.id,
                title: from.title,
                description: from.description,
                publishDate: from.publishDate,
                imagePath: from.imagePath,
                advertType: from.advertType,
                commentCount: all.commentCount,
                price: from.price,
                categories: from.categories
            });

            res.json({type: "error", message: "Попытка отредактировать чужое объявление"});
            return;
        }
        res.json({type: "error", message: "Нет авторизации"});
    }
});

app.get('/advert/delete', async (req, res) => {
    const from: {
        token: string,
        title: string,
        description: string,
        publishDate: string,
        imagePath: string,
        advertType: string,
        price: string,
        author: string,
        categories: string
    } = req?.body;

    const all = await client.db(process.env.DB_NAME!.toString()).collection("Adverts").findOne({
        title: from.title,
        description: from.description,
        publishDate: from.publishDate,
        imagePath: from.imagePath,
        advertType: from.advertType,
        price: from.price,
        author: from.author,
        categories: from.categories
    });

    if (all && from.author === all.author && from.token === process.env.PORT) {
        await client.db(process.env.DB_NAME!.toString()).collection("Adverts").deleteOne(all);
    }

    res.json({type: "error", message: "Нет авторизации или попытка удалить чужое объявление"});
});

app.get('/category/list', async (req, res) => {
    const all = await client.db(process.env.DB_NAME!.toString()).collection("Categories").find({}).toArray();

    if (all) {
        res.json(all);
        return;
    }

    res.json({type: "error", message: "Нет категорий"});
});

app.get('/advert/list/by', async (req, res) => {
    const from: {
        name: string,
    } = req?.body;

    const all = await client.db(process.env.DB_NAME!.toString()).collection("Categories").find({}).toArray();
    let idx: number = -1;

    if (all) {
        all.forEach((category, index) => {
            if (category.name === from.name)
                idx = index + 1;
        });
    }

    if (idx === -1) {
        res.json({type: "error", message: "Нет категории"});
    }

    const adverts = await client.db(process.env.DB_NAME!.toString()).collection("Adverts").find({}).toArray();

    let count: number = 0;
    const out: WithId<import('mongodb').Document>[] = [];

    adverts.forEach((advert, index) => {
        if (String(advert.categories).includes(idx.toString())) {
            out.push(advert);
            count++;
        }

        if (count > 24) {
            res.json(out);
            return;
        }
    });
    res.json(out);
});

app.get('/advert/list/new', async (req, res) => {
    const adverts = await client.db(process.env.DB_NAME!.toString()).collection("Adverts").find({}).toArray();
    const dates: Date[] = [];
    const out: WithId<import('mongodb').Document>[] = [];

    adverts.forEach(advert => {
        dates.push(new Date(Date.parse(String(advert.publishDate))));
    });

    dates.sort((a, b) => a.getTime() - b.getTime());

    dates.forEach(date => {
        adverts.forEach(advert => {
            if (new Date(Date.parse(String(advert.publishDate))) === date)
            {
                out.push(advert);
            }
        });
    });
    res.json(out);
});

app.get('/advert/list/popular', async(req, res) => {
    const adverts = await client.db(process.env.DB_NAME!.toString()).collection("Adverts").find({}).toArray();
    const out: WithId<import('mongodb').Document>[] = [];
    let count: number = 0;

    adverts.sort((a, b) => Number(a.commentCount) - Number(b.commentCount));

    adverts.forEach(advert => {
        out.push(advert);
        count++;
        if (count > 5)
            return;
    });
    res.json(out);
});

app.get('/advert/info', async (req, res) => {
    const from: {
        id: string,
    } = req?.body;

    const adverts = await client.db(process.env.DB_NAME!.toString()).collection("Adverts").find({id: from.id}).toArray();
    res.json(adverts);
});

app.get('/comment/add', async (req, res) => {
    const from: {
        token: string,
        id: string
    } = req?.body;

    const adverts = await client.db(process.env.DB_NAME!.toString()).collection("Adverts").findOne({id: from.id});

    if (from.token !== process.env.PORT) {
        res.json({type: "error", message: "Нет авторизации"});
        return;
    }
    if (adverts) {
        await client.db(process.env.DB_NAME!.toString()).collection("Adverts").replaceOne(adverts, {
            commentCount: String(Number(adverts.commentCount) + 1)
        });
    }
    res.json({response: "ok"});
});

app.get('/user/add', async (req, res) => {
    const from: {name: string, surname: string, email: string, imagePath: string, password: string} = req?.body;

    const user = await client.db(process.env.DB_NAME!.toString()).collection("Users").find({}).toArray();
    
    await client.db(process.env.DB_NAME!.toString()).collection("Users").insertOne({
        id: user.length,
        name: from.name,
        surname: from.surname,
        email: from.email, 
        imagePath: from.imagePath,
        password: from.password
    });

});

app.get('/user/login', async (req, res) => {
    const from: {email: string, password: string} = req?.body;

    const user = await client.db(process.env.DB_NAME!.toString()).collection("Users").findOne({email: from.email, password: from.password});

    if (user) {
        res.json({token: process.env.TOKEN});
        return;
    }

    res.json({type: "error", message: "Нет пользователя"});
});

app.on("close", () => {
    client.close();
});

app.listen(process.env.PORT, () => {
    console.log(`Server started listening at port ${process.env.PORT}`);
});