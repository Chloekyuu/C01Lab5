test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
});

const axios = require('axios');
const SERVER_URL = "http://localhost:4000";

// Helper function to create a note
async function createNote(title, content, color = null) {
    const response = await axios.post(
        `${SERVER_URL}/postNote`,
        { title, content, ...(color && { color }) }
    );
    return response.data.insertedId;
}

// Helper function to delete all notes
async function deleteAllNotes() {
    await axios.delete(`${SERVER_URL}/deleteAllNotes`);
}  

describe("Note API Tests", () => {
    beforeEach(async () => {
      // Ensure the database is in a known state before each test
      await deleteAllNotes();
    });

    test("/postNote - Post a note", async () => {
        await fetch(`${SERVER_URL}/deleteAllNotes`, {method: "DELETE"});
        const title = "NoteTitleTest";
        const content = "NoteTitleContent";

        const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            title: title,
            content: content,
            }),
        });

        const postNoteBody = await postNoteRes.json();

        expect(postNoteRes.status).toBe(200);
        expect(postNoteBody.response).toBe("Note added succesfully.");
    });

    test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
        // Code here
        const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
        const getAllNotesBody = await getAllNotesRes.json();

        expect(getAllNotesRes.status).toBe(200);
        expect(getAllNotesBody.response).toEqual([]);
    });

    test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
        // Create two notes for testing
        await createNote("NoteTitleTest1", "NoteTitleContent1");
        await createNote("NoteTitleTest2", "NoteTitleContent2");
        
        // Retrieve all notes after creating them
        const getAllNotesRes = await axios.get(`${SERVER_URL}/getAllNotes`);

        // Check if the server responds with the expected number of notes
        expect(getAllNotesRes.status).toBe(200);
        expect(getAllNotesRes.data.response.length).toBe(2);
    });

    test("/deleteNote - Delete a note", async () => {
        // Create a note for testing
        const insertedId = await createNote("NoteTitleTest1", "NoteTitleContent1");
    
        // Delete the note
        const deleteNoteRes = await axios.delete(`${SERVER_URL}/deleteNote/${insertedId}`);
        const deleteNoteBody = deleteNoteRes.data;
    
        // Check if the server responds with success message
        expect(deleteNoteRes.status).toBe(200);
        expect(deleteNoteBody.response).toBe(`Document with ID ${insertedId} deleted.`);
    });

    test("/patchNote - Patch with content and title", async () => {
        // Create a note for testing
        const insertedId = await createNote("NoteTitleTest1", "NoteTitleContent1");
    
        // Patch the note
        const patchNoteRes = await axios.patch(`${SERVER_URL}/patchNote/${insertedId}`, {
            title: "NewTitle",
            content: "NewContent"
        });
        const patchNoteBody = patchNoteRes.data;
    
        // Check if the server responds with success message
        expect(patchNoteRes.status).toBe(200);
        expect(patchNoteBody.response).toBe(`Document with ID ${insertedId} patched.`);
    });

    test("/patchNote - Patch with just title", async () => {
        // Create a note for testing
        const insertedId = await createNote("NoteTitleTest1", "NoteTitleContent1");
    
        // Patch the note with just title
        const patchNoteRes = await axios.patch(`${SERVER_URL}/patchNote/${insertedId}`, {
            title: "NewTitle"
        });
        const patchNoteBody = patchNoteRes.data;
    
        // Check if the server responds with success message
        expect(patchNoteRes.status).toBe(200);
        expect(patchNoteBody.response).toBe(`Document with ID ${insertedId} patched.`);
    });
    
    test("/patchNote - Patch with just content", async () => {
        // Create a note for testing
        const insertedId = await createNote("NoteTitleTest1", "NoteTitleContent1");
    
        // Patch the note with just content
        const patchNoteRes = await axios.patch(`${SERVER_URL}/patchNote/${insertedId}`, {
            content: "NewContent"
        });
        const patchNoteBody = patchNoteRes.data;
    
        // Check if the server responds with success message
        expect(patchNoteRes.status).toBe(200);
        expect(patchNoteBody.response).toBe(`Document with ID ${insertedId} patched.`);
    });
    
    test("/deleteAllNotes - Delete one note", async () => {
        // Create a note for testing
        const insertedId = await createNote("NoteTitleTest1", "NoteTitleContent1");
    
        // Delete all notes
        const deleteAllNotesRes = await axios.delete(`${SERVER_URL}/deleteAllNotes`);
        const deleteAllNotesBody = deleteAllNotesRes.data;
    
        // Check if the server responds with success message
        expect(deleteAllNotesRes.status).toBe(200);
        expect(deleteAllNotesBody.response).toBe(`1 note(s) deleted.`);
    });
    
    test("/deleteAllNotes - Delete three notes", async () => {
        // Create three notes for testing
        await createNote("NoteTitleTest1", "NoteTitleContent1");
        await createNote("NoteTitleTest2", "NoteTitleContent2");
        await createNote("NoteTitleTest3", "NoteTitleContent3");
    
        // Delete all notes
        const deleteAllNotesRes = await axios.delete(`${SERVER_URL}/deleteAllNotes`);
        const deleteAllNotesBody = deleteAllNotesRes.data;
    
        // Check if the server responds with success message
        expect(deleteAllNotesRes.status).toBe(200);
        expect(deleteAllNotesBody.response).toBe(`3 note(s) deleted.`);
    });
    
    test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
        // Create a note for testing
        const insertedId = await createNote("NoteTitleTest1", "NoteTitleContent1");
    
        // Update the color of the note
        const updateNoteColorRes = await axios.patch(`${SERVER_URL}/updateNoteColor/${insertedId}`, {
            color: "#000000"
        });
        const updateNoteColorBody = updateNoteColorRes.data;
    
        // Check if the server responds with success message
        expect(updateNoteColorRes.status).toBe(200);
        expect(updateNoteColorBody.message).toBe("Note color updated successfully.");
    });    
});