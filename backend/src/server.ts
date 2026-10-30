import app from "./app.js";
import "./database/init.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Backend ejecutándose en http://localhost:${PORT}`);
});

