import "dotenv/config";
import app from "./index.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auto Assets API running on http://localhost:${PORT}`);
  console.log(`Admin panel: open your browser at http://localhost:5173/admin`);
});
