import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import debounce from "lodash/debounce";
import './CodeCell.css'
import { useCallback } from "react";

const CodeCell = ({ cell }) => {
    const [title, setTitle] = useState();
    const [code, setCode] = useState(cell.code);
    const [lang, setLang] = useState(cell.lang);
    const [output, setOutput] = useState("Waiting for code...");

    const runCode = async (latestCode = code, latestLang = lang) => {
        try {
            const res = await fetch("http://localhost:5000/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language: latestLang, code: latestCode }),
            });
            const data = await res.json();
            setOutput(data.output);
        } catch (e) {
            setOutput("⚠ Error connecting to server");
        }
    };

    // Debounced version ( runs 2 sec after typing stops)
    const debouncedRun = useCallback(
        debounce((latestCode, latestLang) => {
            runCode(latestCode, latestLang);
        }, 2000), []
    );

    const handleEditorChange = (value) => {
        setCode(value);
        debouncedRun(value, lang);
    };

    const handleLangChange = (newLang) => {
        setLang(newLang);
        debouncedRun(code, newLang);
    }

    return (
        <div className="code">
            {/* Title Input */}
            <input className="cell-title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title" />
            
             <div className="body">
            
            {/* Language Selector */}
            <select value={lang} onChange={(e) => handleLangChange(e.target.value)}>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
            </select>

            {/* Monaco Editor */}
            <Editor height="200px"
                width="auto"

                defaultLanguage={lang}
                language={lang === "javascript" ? "javascript" :
                    lang === "java" ? "java" :
                        lang === "python" ? "python" :
                            lang === "c" ? "c" : "cpp"
                }
                value={code}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                }}
            />


            {/* Run Button */}
            <button onClick={runCode}>▶ Run</button>

            {/* Output */}
            <pre>
                {output}
            </pre>
        </div>
            
        </div>
       
    );

}

export default CodeCell;