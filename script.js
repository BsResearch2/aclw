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

    // Post Submission Logic
    submitPostBtn.addEventListener('click', () => {
        const content = postContent.value.trim();
        if (content) {
            displayPost(content); // Display the post
            postContent.value = ''; // Clear input field
            submitPostBtn.disabled = true; // Disable button until new input
            thankYouSection.classList.remove('hidden'); // Show thank you section
            localStorage.setItem('currentPost', content); // Store initial post temporarily in local storage
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
        const originalContent = localStorage.getItem('currentPost'); // Retrieve the initial post from local storage
        if (revisedContent) {
            displayPost(revisedContent); // Display the revised post
            localStorage.removeItem('currentPost'); // Clear temporary storage
            revisionContent.value = ''; // Clear revision input
            submitRevisionBtn.disabled = true; // Disable revision button
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
});
