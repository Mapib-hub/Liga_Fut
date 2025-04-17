import 'dotenv/config'; // <-- ¡Añade esta línea al principio de todo!
import app from "./app.js";
import { conectDB } from "./db.js";

// El resto del archivo sigue igual...
const PORT = process.env.PORT || 4000;

async function main() {
    await conectDB();
    app.listen(PORT);
    console.log(`>>> Servidor escuchando en el puerto ${PORT}`);
}

main();
