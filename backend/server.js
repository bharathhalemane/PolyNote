const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors())
app.use(express.json());


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

app.listen(5000, () => console.log("⚡ PolyNote backend running on port 5000"))