document.addEventListener("DOMContentLoaded", () => {
    const postFeed = document.getElementById('post-feed');
    const submitPostBtn = document.getElementById('submit-post');
    const postContent = document.getElementById('post-content');
    const thankYouSection = document.getElementById('thank-you');
    const revisePostBtn = document.getElementById('revise-post');
    const revisionSection = document.getElementById('revision-section');
    const revisionContent = document.getElementById('revision-content');
    const submitRevisionBtn = document.getElementById('submit-revision');
    const feedbackSection = document.getElementById('feedback');

    // Enable/disable post button based on content input
    postContent.addEventListener('input', () => {
        submitPostBtn.disabled = postContent.value.trim() === '';
    });

    // Enable/disable revision button based on content input
    revisionContent.addEventListener('input', () => {
        submitRevisionBtn.disabled = revisionContent.value.trim() === '';
    });

    // Post Submission Logic
    submitPostBtn.addEventListener('click', () => {
        const content = postContent.value.trim();
        if (content) {
            displayPost(content); // Display the post
            postContent.value = ''; // Clear input field
            submitPostBtn.disabled = true; // Disable button until new input
            thankYouSection.classList.remove('hidden'); // Show thank you section
            localStorage.setItem('currentPost', content); // Store initial post temporarily
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
    submitRevisionBtn.addEventListener('click', () => {
        const revisedContent = revisionContent.value.trim();
        const originalContent = localStorage.getItem('currentPost'); // Retrieve the initial post
        if (revisedContent) {
            const highlightedRevisions = highlightRevisions(originalContent, revisedContent);
            displayPost(highlightedRevisions); // Display the revised post with highlights
            localStorage.removeItem('currentPost'); // Clear temporary storage
            revisionContent.value = ''; // Clear revision input
            submitRevisionBtn.disabled = true; // Disable revision button
            revisionSection.classList.add('hidden'); // Hide the revision section
            feedbackSection.classList.remove('hidden'); // Show feedback section
            displayFeedbackMessage(); // Display a generic feedback message
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

    // Highlight revisions in the post content
    function highlightRevisions(original, revised) {
        const originalWords = original.split(' ');
        const revisedWords = revised.split(' ');
        let highlightedContent = '';

        for (let i = 0; i < revisedWords.length; i++) {
            if (originalWords[i] !== revisedWords[i]) {
                highlightedContent += `<span class="highlight">${revisedWords[i]}</span> `;
            } else {
                highlightedContent += `${revisedWords[i]} `;
            }
        }
        return highlightedContent.trim();
    }

    // Display a generic feedback message
    function displayFeedbackMessage() {
        const feedbackMessage = document.getElementById('feedback-message');
        feedbackMessage.textContent = "The algorithm has analyzed your revisions and updated your post reach and engagement scores.";
    }
});
