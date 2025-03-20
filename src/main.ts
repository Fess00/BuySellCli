import axios from "axios";
import { AdvertTypes } from "./Enums/AdvertTypes";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

(async () => {
    const response = await axios.get<{dobzik: string}[]>("http://localhost:3000/users");
    response.data.forEach((user, index) => {
        console.log(`${user}`)
    })
    console.log(AdvertTypes.Buy);
    const enteredUsers: {userName: string, token: string}[] = [];
    let email:string = "sss@mail.ru";
    let client: MongoClient = new MongoClient(process.env.DB_URI!.toString());
    await client.connect();
    const r = await client.db("buysell").collection("Users").find({}).toArray();
    console.log(r[r.length - 1].id);
    client.close();
})();