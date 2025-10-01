import { useState } from "react";
import './Note.css';

const Note = () => {
    const [note, setNote] = useState("");
    const [showNote, setShowNote] = useState(false);

    return (
        <>
            <button className="toggle-note-btn" onClick={() => setShowNote(!showNote)}>
                {showNote ? "➖ Hide Note" : "📝 Add Note"}
            </button>

            {showNote && (
                <textarea className="note-editor" value={note} onChange={(e)=> setNote(e.target.value)} placeholder="Write your notes here..." name="" id=""></textarea>
            )}

        </>
    )
}

export default Note;