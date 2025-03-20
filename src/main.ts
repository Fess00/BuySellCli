import axios from "axios";
import { AdvertTypes } from "./Enums/AdvertTypes";

(async () => {
    const response = await axios.get<{dobzik: string}[]>("http://localhost:3000/users");
    response.data.forEach((user, index) => {
        console.log(`${user}`)
    })
    console.log(AdvertTypes.Buy);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log(emailRegex.test("saimon283@gmail.com"));
})();