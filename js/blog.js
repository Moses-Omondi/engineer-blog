// blog.js - Loads and displays blog posts for Moses's Engineer Blog

// Sample blog posts data
const blogPosts = [
    {
        title: "Setting Up CI/CD with GitHub Actions",
        date: "September 1, 2025",
        excerpt: "Learning how to automate deployments using GitHub Actions. This is my journey into DevOps and continuous integration/deployment.",
        content: "Today I learned about GitHub Actions and how to set up automated deployments. The process involves creating workflow files in .github/workflows/ directory..."
    },
    {
        title: "My Software Engineering Journey",
        date: "August 28, 2025",
        excerpt: "Welcome to my blog! I'm Moses Omondi, a software engineer passionate about learning new technologies and sharing my experiences.",
        content: "Starting this blog to document my learning journey in software engineering and DevOps. Excited to share what I learn along the way..."
    },
    {
        title: "Learning Git and Version Control",
        date: "August 25, 2025",
        excerpt: "Understanding the fundamentals of Git, branching strategies, and collaborative development workflows.",
        content: "Git has been a game-changer in my development workflow. Learning about branches, merging, and collaboration..."
    }
];

// Function to create HTML for a single blog post
function createBlogPostHTML(post) {
    return `
        <article class="blog-post">
            <h3>${post.title}</h3>
            <p class="date">${post.date}</p>
            <p class="excerpt">${post.excerpt}</p>
            <button onclick="toggleContent('${post.title}')" class="read-more-btn">Read More</button>
            <div id="content-${post.title.replace(/\s+/g, '-')}" class="full-content" style="display: none;">
                <p>${post.content}</p>
            </div>
        </article>
    `;
}

// Function to toggle full content visibility
function toggleContent(title) {
    const contentId = `content-${title.replace(/\s+/g, '-')}`;
    const contentDiv = document.getElementById(contentId);
    const button = event.target;

    if (contentDiv.style.display === 'none') {
        contentDiv.style.display = 'block';
        button.textContent = 'Read Less';
    } else {
        contentDiv.style.display = 'none';
        button.textContent = 'Read More';
    }
}

// Function to load and display all blog posts
function loadBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');

    // Clear the loading message
    blogContainer.innerHTML = '';

    // Add some basic styling
    const style = document.createElement('style');
    style.textContent = `
        .blog-post {
            background: #f4f4f4;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid #007acc;
        }
        .blog-post h3 {
            color: #333;
            margin-top: 0;
        }
        .date {
            color: #666;
            font-size: 0.9em;
            font-style: italic;
        }
        .excerpt {
            margin: 10px 0;
        }
        .read-more-btn {
            background: #007acc;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
        }
        .read-more-btn:hover {
            background: #005a9e;
        }
        .full-content {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
        }
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);

    // Generate HTML for all blog posts
    const postsHTML = blogPosts.map(post => createBlogPostHTML(post)).join('');
    blogContainer.innerHTML = postsHTML;
}

// Load blog posts when the page is ready
document.addEventListener('DOMContentLoaded', loadBlogPosts);