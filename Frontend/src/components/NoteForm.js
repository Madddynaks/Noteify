import React, { useState, useEffect } from "react";
import Narrow from "../components/Common/Narrow";
import { useAuth0 } from "@auth0/auth0-react";

const NoteForm = ({ onSave, noteToEdit }) => {
  const { user, isAuthenticated } = useAuth0();

  const [note, setNote] = useState(
    noteToEdit || {
      email: isAuthenticated ? user.email : "",
      group: "",
      text: "",
      color: "bg-blue-500",
      position: { x: 0, y: 0 },
    }
  );

  useEffect(() => {
    if (noteToEdit) {
      setNote(noteToEdit);
    }
  }, [noteToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote({
      ...note,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...note,
      email: isAuthenticated ? user.email : note.email,
    });
    setNote({
      email: isAuthenticated ? user.email : "",
      group: "",
      text: "",
      color: "bg-blue-500",
      position: { x: 0, y: 0 },
    });
  };

  return (
    <Narrow>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          name="group"
          value={note.group}
          onChange={handleChange}
          placeholder="Group"
          className="p-2 m-2 border rounded-lg"
        />
        <textarea
          name="text"
          value={note.text}
          onChange={handleChange}
          placeholder="Text"
          className="p-2 m-2 border rounded-lg"
        />
        <select
          name="color"
          value={note.color}
          onChange={handleChange}
          className="p-2 m-2 border rounded-lg"
        >
          <option value="bg-red-300">Red</option>
          <option value="bg-green-300">Green</option>
          <option value="bg-blue-300">Blue</option>
          <option value="bg-[#FFD966]">Yellow</option>
          <option value="bg-pink-300">Pink</option>
          <option value="bg-orange-300">Orange</option>
        </select>
        <button type="submit" className="p-2 m-2 bg-blue-500 text-white rounded-lg">
          Save
        </button>
      </form>
    </Narrow>
  );
};

export default NoteForm;
