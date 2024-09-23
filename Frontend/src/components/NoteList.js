import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import { useAuth0 } from "@auth0/auth0-react";
import Narrow from "./Common/Narrow";
import Navbar from "./Common/NotesNavbar";
import Note from "./Note";
import Avatar from "../components/Images/Avatar.png";

export default function NotesPage() {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

  const [notes, setNotes] = useState([]);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);

  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [groupByData, setGroupByData] = useState([]);
  const [selectedGroupBy, setSelectedGroupBy] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await axios.get("http://localhost:5000/api/notes");
    setNotes(response.data);
  };

  const addNote = async (note) => {
    const response = await axios.post("http://localhost:5000/api/notes", note);
    setNotes([...notes, response.data]);
  };

  const updateNote = async (id, updatedNote) => {
    const response = await axios.put(`http://localhost:5000/api/notes/${id}`, updatedNote);
    setNotes(notes.map((note) => (note._id === id ? response.data : note)));
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`);
    setNotes(notes.filter((note) => note._id !== id));
  };

  const handleEdit = (note) => {
    setNoteToEdit(note);
    setShowNoteModal(true);
  };

  const handleSave = (note) => {
    if (note._id) {
      updateNote(note._id, note);
    } else {
      addNote(note);
    }
    setNoteToEdit(null);
    setShowNoteModal(false);
  };

  const handleColorSelect = (color) => {
    const defaultNote = {
      title: "New Note",
      content: "This is a default note",
      color: `bg-${color}`,
      group: "Untitled Note",
      text: "Add text of your choice here..",
      email: user.email,
    };
    addNote(defaultNote);
  };

  const handleGroupChange = (event) => {
    setGroupFilter(event.target.value);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleGroupBy = () => {
    if (!selectedGroupBy) {
      const groupedData = filteredNotes.reduce((acc, note) => {
        if (!acc[note.group]) {
          acc[note.group] = {
            count: 0,
            notes: [],
          };
        }
        acc[note.group].count += 1;
        acc[note.group].notes.push(note);
        return acc;
      }, {});

      const groupedArray = Object.keys(groupedData).map((group) => ({
        group,
        count: groupedData[group].count,
        notes: groupedData[group].notes,
      }));

      setGroupByData(groupedArray);
      setSelectedGroupBy(true);
    } else {
      setSelectedGroupBy(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      let filtered = notes.filter((note) => note.email === user.email);

      if (selectedColor) {
        filtered = filtered.filter((note) => note.color === selectedColor);
      }

      if (groupFilter) {
        filtered = filtered.filter((note) =>
          note.group.toLowerCase().includes(groupFilter.toLowerCase())
        );
      }

      setFilteredNotes(filtered);
    }
  }, [user, notes, selectedColor, groupFilter, isAuthenticated]);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAvatarClick = () => {
    setShowUserModal(!showUserModal);
  };

  const onDelete = (id) => {
    setNoteIdToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    deleteNote(noteIdToDelete);
    setShowConfirmationModal(false);
    setNoteIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setNoteIdToDelete(null);
  };

  return (
    <div>
      <div className="flex">
        <div className={`px-10 border-r-2 ${darkMode ? "bg-black" : ""}`}>
          <Navbar darkMode={darkMode} onColorSelect={handleColorSelect} />
        </div>
        <div className={`w-full ${darkMode ? "bg-[#1E1E1E]" : "bg-gray-100"}`}>
          <Narrow>
            <div className="flex justify-between mb-5 mt-5">
              <div className="w-full pr-5">
                <input
                  type="text"
                  placeholder="Search by Group"
                  value={groupFilter}
                  onChange={handleGroupChange}
                  className={`p-2 m-2 border w-full rounded-xl ${
                    darkMode ? "bg-black text-gray-100 border-gray-100" : ""
                  }`}
                />
              </div>
              <div className="flex gap-2 relative">
                <select
                  onChange={handleColorChange}
                  value={selectedColor}
                  className={`p-2 m-2 border w-full rounded-xl ${
                    darkMode ? "bg-black text-gray-100 border-gray-100" : ""
                  }`}
                >
                  <option value="">All Colors</option>
                  <option value="bg-red-500">Red</option>
                  <option value="bg-green-500">Green</option>
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-yellow-500">Yellow</option>
                  <option value="bg-purple-500">Purple</option>
                </select>
                <button className="border p-2 rounded-md" onClick={handleGroupBy}>
                  Group Notes
                </button>
                <button onClick={handleDarkMode}>
                  <img
                    src={`https://img.icons8.com/?size=100&id=54382&format=png&color=${
                      darkMode ? "ffffff" : "000000"
                    }`}
                    className="h-[40px] my-auto"
                    alt=""
                  />
                </button>
                <button onClick={handleAvatarClick}>
                  <img
                    className={`h-[60px] ${darkMode ? "bg-[#1E1E1E]" : "bg-gray-100"}`}
                    src={Avatar}
                    alt=""
                  />
                </button>
                {showUserModal && (
                  <div className="absolute right-0 top-full mt-2 w-[20vw] bg-white dark:bg-gray-400 border rounded-lg shadow-lg p-4">
                    <div className="flex items-center mb-3">
                      <img className="h-12 w-12 rounded-full" src={user.picture} alt={user.name} />
                      <div className="ml-3">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-black ">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => logout()}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between mb-5 mt-5">
              <button
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={() => setGroupFilter("")}
              >
                Clear Group Filter
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={() => setSelectedColor("")}
              >
                Clear Color Filter
              </button>
            </div>
            {selectedGroupBy !== true ? (
              <div className="flex flex-wrap">
                {filteredNotes.map((note) => (
                  <Note
                    key={note._id}
                    note={note}
                    onDelete={() => onDelete(note._id)}
                    onEdit={() => handleEdit(note)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap w-full">
                {groupByData.map((group) => (
                  <div key={group.group} className="border-2 m-3 p-3 w-auto">
                    <h2>{group.group}</h2>
                    {group.notes.map((note) => (
                      <Note
                        key={note._id}
                        note={note}
                        onDelete={() => onDelete(note._id)}
                        onEdit={() => handleEdit(note)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Narrow>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div
            className={`${
              darkMode ? "bg-gray-200" : "bg-gray-900"
            } p-6 rounded-lg shadow-lg flex w-[50vw] h-[50vh]`}
          >
            <div className="w-1/2 p-1">
              <h2 className={`${darkMode ? "" : "text-white"} text-xl font-bold mb-4`}>
                Note Details
              </h2>
              <div
                className={`${
                  darkMode ? "" : "border-white"
                } border border-black p-4 rounded-lg h-[90%] overflow-auto`}
              >
                <p className="text-lg font-semibold mb-2">{noteToEdit.title}</p>
                <p className="text-gray-600 mb-2">{noteToEdit.content}</p>
                <p className={`text-xl ${darkMode ? "" : "text-white"}`}>
                  Group: {noteToEdit.group}
                </p>
                <p className={`text-xl ${darkMode ? "" : "text-white"}`}>Text: {noteToEdit.text}</p>
                <p className={`text-xl ${darkMode ? "" : "text-white"}`}>
                  Color: {noteToEdit.color}
                </p>
              </div>
            </div>
            <div className="w-1/2 p-4">
              <h2 className="text-xl font-bold mb-4">Edit Note</h2>
              <NoteForm onSave={handleSave} noteToEdit={noteToEdit} />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className={`${darkMode ? "bg-gray-200" : "bg-gray-900"} p-6 rounded-lg shadow-lg`}>
            <h2 className={`${darkMode ? "" : "text-white"} text-xl font-bold mb-4`}>
              Confirm Deletion
            </h2>
            <p className={`${darkMode ? "" : "text-white"} mb-4`}>
              Are you sure you want to delete this note?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
