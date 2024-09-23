import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "../components/NoteForm";
import Note from "./Note";
import { useAuth0 } from "@auth0/auth0-react";
import Narrow from "./Common/Narrow";
import Navbar from "./Common/NotesNavbar";
import Avatar from "../components/Images/Avatar.png";
import DMode from "../components/Images/dark-mode.png";
import LMode from "../components/Images/day-mode.png";
import { Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import TrashNote from "./TrashNote";
import plus from "./Images/plus.png";

export default function NotesPage() {
  const { isAuthenticated, logout, user } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  const [notes, setNotes] = useState([]);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);
  const [trash, setTrash] = useState([]);
  const [openTrash, setOpenTrash] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [groupBy, setGroupBy] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [trashEnable, setTrashEnable] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (!openTrash) {
      fetchNotes();
    }
  }, [openTrash]);


  useEffect(()=>{
    console.log(showConfirmationModal)
  },[showConfirmationModal])

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_PATH}/api/notes/fetchNotes`);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async (note) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_PATH}/api/notes/save`, note);
      setNotes([...notes, response.data]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_PATH}/api/notes/update/${id}`,
        updatedNote
      );
      setNotes(notes.map((note) => (note._id === id ? response.data : note)));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_PATH}/api/notes/delete/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const onRemove = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_PATH}/api/notes/restoreTrash/${id}`);
      setTrash(trash.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error removing note from trash:", error);
    }
  };

  useEffect(() => {
    if (trashEnable) {
      fetchTrashNotes();
      setOpenTrash(true);
    } else {
      setOpenTrash(false);
    }
  }, [trashEnable]);

  const fetchTrashNotes = async () => {
    const result = await axios.get(`${process.env.REACT_APP_BACKEND_PATH}/api/notes/fetchTrash`);
    const trashed = result.data.filter((note) => note.email === user.email);
    setTrash(trashed);
  };

  const handleEdit = (note) => {
    setNoteToEdit(note);
    setCurrentNote({ ...note });
    setShowNoteModal(true);
  };

  const handleSave = (note) => {
    if (note._id) {
      updateNote(note._id, note);
    } else {
      addNote(note);
    }
    setNoteToEdit(null);
    setCurrentNote(null);
    setShowNoteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentNote({
      ...currentNote,
      [name]: value,
    });
  };

  const handleColorSelect = (color) => {
    const defaultNote = {
      title: "New Notes",
      content: "This is a default note",
      color: `${color}`,
      group: "Untitled",
      text: "Add text of your choice here..",
      email: user.email,
      trash: false,
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
    setGroupBy(!groupBy);
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

      if (groupBy) {
        filtered.sort((a, b) => a.group.localeCompare(b.group));
      }

      setFilteredNotes(filtered);
    }
  }, [user, notes, selectedColor, groupFilter, groupBy, isAuthenticated]);

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
        <div className={`px-10 max-md:px-0 ${darkMode ? "bg-black border-black" : ""}`}>
          <Navbar
            darkMode={darkMode}
            onColorSelect={handleColorSelect}
            setTrashEnable={setTrashEnable}
            trashEnable={trashEnable}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
          />
        </div>
        <button
          className="fixed hidden bottom-7 right-7 max-md:block z-50 "
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <div className=" relative rounded-full">
            <img src={plus} alt="Plus icon" style={{ height: "50px" }} />
          </div>
        </button>
        <div className={`w-full max-md:px-3 ${darkMode ? "bg-[#1E1E1E]" : "bg-gray-100"}`}>
          <Narrow>
            <div className="flex justify-between mb-5 mt-10">
              <div className="w-full pr-5">
                <input
                  type="text"
                  placeholder="Search by Group"
                  value={groupFilter}
                  onChange={handleGroupChange}
                  className={`py-4 px-7  border w-full rounded-3xl ${
                    darkMode ? "bg-black text-white border-black" : ""
                  }`}
                />
              </div>
              <div className="flex gap-2 relative">
                <button onClick={handleDarkMode}>
                  <img
                    src={` ${darkMode ? `${LMode}` : `${DMode}`}`}
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
                  <div className="absolute right-0 top-full mt-2 w-[20vw] bg-white dark:bg-gray-400 border rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-center mb-3">
                      <img className="h-12 w-12 rounded-full" src={user.picture} alt={user.name} />
                      <div className="ml-3">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-black ">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => logout()}
                      className="w-full bg-[#5169F6] hover:bg-[#5169F6] text-white py-2 rounded"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-5">
              <select
                onChange={handleColorChange}
                value={selectedColor}
                className={`p-2 border rounded-xl ${
                  darkMode ? "bg-black text-gray-100 border-black" : ""
                }`}
              >
                <option value="">All Colors</option>
                <option value="bg-red-300">Red</option>
                <option value="bg-green-300">Green</option>
                <option value="bg-blue-300">Blue</option>
                <option value="bg-[#FFD966]">Yellow</option>
                <option value="bg-pink-300">Pink</option>
                <option value="bg-orange-300">Orange</option>
                <option value="bg-purple-300">Purple</option>
              </select>
              <button
                className="bg-[#5169F6] px-3 rounded-xl text-sm text-white"
                onClick={() => setSelectedColor("")}
              >
                Clear Color Filter
              </button>
              <button
              className={`border p-2 rounded-xl ${
                darkMode ? "bg-black text-white border-black" : "bg-white"
              }`}
              onClick={handleGroupBy}
            >
              Group Notes
            </button>
            </div>
            

            <div className="flex flex-wrap mt-5">
              {filteredNotes.map((note) => (
                <Note
                  key={note._id}
                  note={note}
                  onDelete={onDelete}
                  onEdit={() => handleEdit(note)}
                />
              ))}
            </div>
          </Narrow>
        </div>

        {/* Note Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg flex w-[50vw] h-[50vh]">
              <div className="w-1/2 p-1">
                <h2 className="text-xl font-bold mb-4">Note Details</h2>
                <div
                  className={`${
                    currentNote?.color || noteToEdit.color
                  } border p-4 rounded-lg h-[90%] overflow-auto`}
                >
                  <p className="text-lg font-semibold mb-2">
                    {currentNote?.title || noteToEdit.title}
                  </p>
                  <p className="text-gray-600 mb-2">{currentNote?.content || noteToEdit.content}</p>
                  <p className="text-4xl">{currentNote?.group || noteToEdit.group}</p>
                  <p className="text-2xl mt-5">{currentNote?.text || noteToEdit.text}</p>
                </div>
              </div>
              <div className="w-1/2 p-4">
                <h2 className="text-xl font-bold mb-4">Edit Note</h2>
                <NoteForm
                  onSave={handleSave}
                  noteToEdit={currentNote}
                  onInputChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-4">Are you sure you want to delete this note?</p>
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
        <Modal
          open={openTrash}
          onClose={() => {
            setTrashEnable(false);
          }}
        >
          <ModalDialog style={{ width: "80vw" }}>
            <ModalClose style={{ zIndex: "10" }} />
            <div className="text-center text-5xl">Trashed Notes</div>
            <div className="flex flex-wrap mt-5">
              {trash.map((note) => (
                <TrashNote
                  key={note._id}
                  note={note}
                  onDelete={onRemove} // Pass the onRemove function directly
                />
              ))}
            </div>
          </ModalDialog>
        </Modal>
      </div>
    </div>
  );
}
