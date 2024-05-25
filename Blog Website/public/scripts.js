document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    const createArticleBtn = document.getElementById('create-article');
    const submitBlogBtn = document.getElementById('submit-blog');
    const editBlogBtn = document.getElementById('edit-blog');
    let currentArticleId = null;

    // Show modal to create a new article
    createArticleBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        currentArticleId = null; // Reset current article ID
        document.getElementById('blog-title').value = '';
        document.getElementById('blog-content').value = '';
    });

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Submit a new article or edit existing article
    submitBlogBtn.addEventListener('click', async () => {
        const title = document.getElementById('blog-title').value;
        const content = document.getElementById('blog-content').value;
        if (title && content) {
            if (currentArticleId) {
                // Edit existing article
                await fetch(`/api/articles/${currentArticleId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content }),
                });
            } else {
                // Create new article
                await fetch('/api/articles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content }),
                });
            }
            modal.style.display = 'none';
            fetchArticles();
        }
    });

    // Fetch articles and display them
    async function fetchArticles() {
        try {
            articlesContainer.innerHTML = '';
            const response = await fetch('/api/articles');
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const articles = await response.json();
            articles.forEach(article => {
                const articleDiv = document.createElement('article');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h2>${article.title}</h2>
                    <p class="content">${truncateContent(article.content, 200)}</p>
                    <button class="read-more">Read More</button>
                    <button class="hide" style="display: none;">Hide</button>
                    <button class="edit" data-id="${article._id}">Edit</button>
                    <button class="delete-button" data-id="${article._id}">Delete</button>
                    <div class="full-content" style="display: none;">${article.content}</div>
                    <hr>
                `;
                articlesContainer.appendChild(articleDiv);

                // Add event listener for read more button
                const readMoreBtn = articleDiv.querySelector('.read-more');
                const hideBtn = articleDiv.querySelector('.hide');
                const editBtn = articleDiv.querySelector('.edit');
                const content = articleDiv.querySelector('.content');
                const fullContent = articleDiv.querySelector('.full-content');
                
                readMoreBtn.addEventListener('click', () => {
                    fullContent.style.display = 'block';
                    readMoreBtn.style.display = 'none';
                    hideBtn.style.display = 'block';
                    editBtn.style.display = 'none';
                    content.style.display = 'none';
                });

                // Add event listener for hide button
                hideBtn.addEventListener('click', () => {
                    fullContent.style.display = 'none';
                    readMoreBtn.style.display = 'block';
                    hideBtn.style.display = 'none';
                    editBtn.style.display = 'block';
                    content.style.display = 'block';
                });

                // Add event listener for edit button
                editBtn.addEventListener('click', () => {
                    modal.style.display = 'block';
                    currentArticleId = article._id;
                    document.getElementById('blog-title').value = article.title;
                    document.getElementById('blog-content').value = article.content;
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    // Delete article
    articlesContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-button')) {
            const articleId = e.target.getAttribute('data-id');
            await fetch(`/api/articles/${articleId}`, {
                method: 'DELETE',
            });
            fetchArticles();
        }
    });

    // Truncate content if it's longer than maxLength
    function truncateContent(content, maxLength) {
        if (content.length <= maxLength) {
            return content;
        } else {
            return content.substring(0, maxLength) + '...';
        }
    }

    // Initial fetch
    fetchArticles();
});
