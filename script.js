// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const postFeed = document.getElementById('post-feed');
    const submitPostBtn = document.getElementById('submit-post');
    const postContent = document.getElementById('post-content');
    const thankYouSection = document.getElementById('thank-you');
    const revisePostBtn = document.getElementById('revise-post');
    const revisionSection = document.getElementById('revision-section');
    const revisionContent = document.getElementById('revision-content');
    const submitRevisionBtn = document.getElementById('submit-revision');

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBf3w3osCrlXqIRhbAcRFpYkg-JAVWCidQ",
        authDomain: "ac-experiment.firebaseapp.com",
        projectId: "ac-experiment",
        storageBucket: "ac-experiment.firebasestorage.app",
        messagingSenderId: "83447059204",
        appId: "1:83447059204:web:c1d18e7d50ee80e673f651",
        measurementId: "G-1BYENTEQ7Z"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log("Firebase initialized successfully");

    // Enable/disable post button based on content input
    postContent.addEventListener('input', () => {
        console.log("Textarea input:", postContent.value.trim());
        submitPostBtn.disabled = postContent.value.trim() === '';
        console.log("Submit button disabled:", submitPostBtn.disabled);
    });

    // Enable/disable revision button based on content input
    revisionContent.addEventListener('input', () => {
        console.log("Revision textarea input:", revisionContent.value.trim());
        submitRevisionBtn.disabled = revisionContent.value.trim() === '';
        console.log("Revision button disabled:", submitRevisionBtn.disabled);
    });

    // Unified `click` event listener for the "Post" button
    submitPostBtn.addEventListener('click', async () => {
        const content = postContent.value.trim();
        console.log("Post button clicked. Content:", content);

        if (content) {
            // Save the post to Firebase
            try {
                await addDoc(collection(db, "posts"), { content, type: "initial", timestamp: new Date() });
                console.log("Post saved to Firebase successfully");
            } catch (error) {
                console.error("Error saving post to Firebase:", error);
                alert("Failed to save post. Please try again.");
                return;
            }

            // Submit revision logic
    submitRevisionBtn.addEventListener('click', async () => {
        const revisedContent = revisionContent.value.trim();
        const originalContent = localStorage.getItem('currentPost'); // Retrieve the initial post
        console.log("Submit revision clicked. Revised content:", revisedContent);

        if (originalContent && revisedContent) {
            try {
                await addDoc(collection(db, "posts"), { content: revisedContent, type: "revised", timestamp: new Date() });
                console.log("Revised post saved to Firebase successfully");
            } catch (error) {
                console.error("Error saving revised post to Firebase:", error);
                alert("Failed to save revised post. Please try again.");
                return;
            }

            // Save revised post locally
            const uniqueId = generateUniqueId(); // Generate a unique ID
            savePostPair(originalContent, revisedContent, uniqueId); // Save both as a pair locally

            // Clear revision input and disable revision button
            revisionContent.value = '';
            submitRevisionBtn.disabled = true;
            revisionSection.classList.add('hidden'); // Hide the revision section
            alert('Revised post saved successfully!');
        } else {
            alert('Please revise your post before submitting!');
        }
    });

    // Display the post in the feed
    function displayPost(content) {
        const post = document.createElement('div');
        post.classList.add('post');
        post.innerHTML = `<p>${content}</p>`;
        postFeed.prepend(post);
    }

    // Display the post in the feed
    function displayPost(content) {
        const post = document.createElement('div');
        post.classList.add('post');
        post.innerHTML = `<p>${content}</p>`;
        postFeed.prepend(post);
    }

    // Save original and revised posts as a pair with a unique ID locally
    function savePostPair(original, revised, id) {
        let postPairs = JSON.parse(localStorage.getItem("postPairs")) || [];
        postPairs.push({ id, original, revised }); // Add ID to each post pair
        localStorage.setItem("postPairs", JSON.stringify(postPairs));
        localStorage.removeItem('currentPost'); // Clear temporary storage
    }

    // Generate a unique identifier (using timestamp + random number for simplicity)
    function generateUniqueId() {
        return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
});
