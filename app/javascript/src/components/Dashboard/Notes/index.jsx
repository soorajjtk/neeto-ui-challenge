import React, { useState, useEffect } from "react";

import EmptyNotesListImage from "images/EmptyNotesList";
import { Button, PageLoader } from "neetoui";
import { Container, Header } from "neetoui/layouts";

import notesApi from "apis/notes";
import { EmptyState, Menubar } from "components/Common";

import Card from "./Card";
import { MENUBAR_DATA } from "./constants";
import DeleteAlert from "./DeleteAlert";
import NewNotePane from "./Pane/Create";
import { convertDateToWeekdayTime, calculateCreatedAgo } from "./utils";

const Notes = () => {
  const [loading, setLoading] = useState(true);
  const [showNewNotePane, setShowNewNotePane] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [notes, setNotes] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDeleteSelection = id => {
    setSelectedNoteIds([id]);
    setShowDeleteAlert(true);
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data } = await notesApi.fetch();
      const populatedNotes = data.notes.map(note => ({
        ...note,
        time: convertDateToWeekdayTime(note.created_at),
        createdAgo: calculateCreatedAgo(note.created_at),
      }));
      setNotes(populatedNotes);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Menubar title="Notes" options={MENUBAR_DATA} setCategory={setCategory} />
      <Container>
        <Header
          menuBarToggle
          title={category}
          actionBlock={
            <Button
              onClick={() => setShowNewNotePane(true)}
              label="Add New Note"
              size="large"
              icon="ri-add-line"
            />
          }
          searchProps={{
            value: searchTerm,
            onChange: e => setSearchTerm(e.target.value),
          }}
        />
        {notes.length ? (
          <>
            {notes?.map(note => (
              <Card
                key={note?.id}
                note={note}
                action={{ delete: handleDeleteSelection }}
              />
            ))}
          </>
        ) : (
          <EmptyState
            image={EmptyNotesListImage}
            title="Looks like you don't have any notes!"
            subtitle="Add your notes to send customized emails to them."
            primaryAction={() => setShowNewNotePane(true)}
            primaryActionLabel="Add New Note"
          />
        )}
        <NewNotePane
          showPane={showNewNotePane}
          setShowPane={setShowNewNotePane}
          fetchNotes={fetchNotes}
        />
        {showDeleteAlert && (
          <DeleteAlert
            selectedNoteIds={selectedNoteIds}
            onClose={() => setShowDeleteAlert(false)}
            refetch={fetchNotes}
            setSelectedNoteIds={setSelectedNoteIds}
          />
        )}
      </Container>
    </>
  );
};

export default Notes;
