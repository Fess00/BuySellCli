import axios from "axios";

(async () => {
    const response = await axios.get<{dobzik: string}[]>("http://localhost:3000/users");
    response.data.forEach((user, index) => {
        console.log(`${user}`)
    })
})();