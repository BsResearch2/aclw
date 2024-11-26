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

    // Enable/disable post button based on content input
    postContent.addEventListener('input', () => {
        submitPostBtn.disabled = postContent.value.trim() === '';
    });

    // Enable/disable revision button based on content input
    revisionContent.addEventListener('input', () => {
        submitRevisionBtn.disabled = revisionContent.value.trim() === '';
    });

    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBf3w3osCrlXqIRhbAcRFpYkg-JAVWCidQ",
        authDomain: "ac-experiment.firebaseapp.com",
        projectId: "ac-experiment",
        storageBucket: "ac-experiment.firebasestorage.app",
        messagingSenderId: "83447059204",
        appId: "1:83447059204:web:b1ec41e75843466a73f651",
        measurementId: "G-07YV9JK6XG",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log("Firebase initialized successfully");

    // Post Submission Logic
    submitPostBtn.addEventListener('click', async () => {
        const content = postContent.value.trim();
        if (content) {
            try {
                await savePost(content, "initial"); // Save to Firestore
                displayPost(content); // Display the post
                postContent.value = ''; // Clear input field
                submitPostBtn.disabled = true; // Disable button until new input
                thankYouSection.classList.remove('hidden'); // Show thank you section
                localStorage.setItem('currentPost', content); // Store initial post temporarily
            } catch (error) {
                alert("Failed to save the post. Please try again.");
                console.error(error);
            }
        } else {
            alert('Please write something before posting!');
        }
    });

    // Handle revision button click
    revisePostBtn.addEventListener('click', () => {
        thankYouSection.classList.add('hidden'); // Hide thank you section
        revisionSection.classList.remove('hidden'); // Show revision section
        revisionContent.value = localStorage.getItem('currentPost'); // Load initial post into revision textarea
    });

    // Submit revised post
    submitRevisionBtn.addEventListener('click', async () => {
        const revisedContent = revisionContent.value.trim();
        const originalContent = localStorage.getItem('currentPost'); // Retrieve the initial post
        if (revisedContent) {
            try {
                await savePost(revisedContent, "revised"); // Save to Firestore
                displayPost(revisedContent); // Display the revised post
                localStorage.removeItem('currentPost'); // Clear temporary storage
                revisionContent.value = ''; // Clear revision input
                submitRevisionBtn.disabled = true; // Disable revision button
                revisionSection.classList.add('hidden'); // Hide the revision section
                alert('Revised post saved successfully!');
            } catch (error) {
                alert("Failed to save the revised post. Please try again.");
                console.error(error);
            }
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

    // Save post to Firestore
    async function savePost(content, type) {
        try {
            await addDoc(collection(db, "posts"), { content, type, timestamp: new Date() });
            console.log(`${type} post saved successfully!`);
        } catch (error) {
            throw new Error("Error saving post to Firestore");
        }
    }
});
