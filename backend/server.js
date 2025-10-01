require("dotenv").config();
const mongoose = require('mongoose');

const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const fs = require("fs");
const path = require("path");


const app = express();
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "*"
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

//connection of mongodb
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongodb connected");
    } catch (err) {
        console.error("mongodb connection error:", err);
        process.exit(1);
    }
}
connectDB();

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", UserSchema);

app.post("/save-user", async (req, res) => {
    const { email, uid } = req.body;
    console.log("req.body:", req.body);

  if (!email || !uid) {
    return res.status(400).json({ error: "Email and UID required" });
  }

  try {
    let user = await User.findOne({ uid });  // ✅ match schema field
    if (!user) {
      user = new User({ email, uid });  // ✅ use uid consistently
      await user.save();
    } else {
      // optional: update email if it changed
      user.email = email;
      await user.save();
    }

    res.json({ message: "User saved", user });
  } catch (err) {
    console.error("Error in /save-user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/execute", (req, res) => {
    const { language, code } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: "Language and code required" });
    }

    if (language === "javascript") {

        // Run JS using Node
        exec(`node -e "${code.replace(/"/g, '\\"')}"`, (err, stdout,
            stderr) => {
            if (err) return res.json({ output: stderr });
            res.json({ output: stdout });
        });

    } else if (language === "java") {
        const filePath = path.join(__dirname, "Main.java");
        fs.writeFileSync(filePath, code);

        // Compile & run Java 
        exec(`javac Main.java && java Main`, { cwd: __dirname }, (err, stdout, stderr) => {
            if (err) return res.json({ output: stderr });
            res.json({ output: stdout });
        });
    } else if (language === "python") {
        const filePath = path.join(__dirname, "script.py");
        fs.writeFileSync(filePath, code);

        exec(`python3 script.py`, { cwd: __dirname }, (err, stdout, stderr) => {
            if (err) return res.json({ output: stderr });
            res.json({ output: stdout });
        });

    } else if (language == "c") {
    
        const fileId = Date.now();
        const sourceFile = `program_${fileId}.c`;
        const exeFile = `program_${fileId}.exe`;
        
        fs.writeFileSync(sourceFile, code);

        exec(`gcc ${sourceFile} -o ${exeFile} && ${exeFile}`, (err, stdout, stderr) => {
            fs.unlinkSync(sourceFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);

            if (err) return res.json({ output: stderr });
            res.json({ output: stdout });
        });

    } else if (language === "cpp") {
        const fileId = Date.now();
        const sourceFile = `program_${fileId}.cpp`;
        const exeFile = `program_${fileId}.exe`;
        
        fs.writeFileSync(sourceFile, code);

        exec(`g++ ${sourceFile} -o ${exeFile} && ${exeFile}`, (err, stdout, stderr) => {
            fs.unlinkSync(sourceFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);

            if (err) return res.json({ output: stderr });
            res.json({ output: stdout });
        });
    }
    else {
        res.status(400).json({ error: "Unsupported language" });
    }
});

app.listen(PORT, () => console.log("⚡ PolyNote backend running on port 5000"))