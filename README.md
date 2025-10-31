# Ryan Bieber's Personal Website

A modern, professional portfolio and blog website showcasing my work in Agentic AI, Production ML, and Decision Intelligence.

## 🌐 Live Site
Visit: [ryanbieber.github.io](https://ryanbieber.github.io)

## 📁 Structure

```
ryanbieber.github.io/
├── index.html          # Landing page
├── resume.html         # Full resume
├── projects.html       # Project portfolio
├── blog.html          # Blog listing
├── styles.css         # Shared styles
├── blog/              # Blog posts directory
│   └── building-agentic-ai.html
└── README.md          # This file
```

## ✨ Features

- **Multi-page Navigation**: Clean navigation between Home, Resume, Projects, and Blog
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Modern Styling**: Professional gradient headers and card-based layouts
- **Blog System**: Ready-to-use blog structure with sample posts
- **Project Showcase**: Highlight GitHub repos and production systems
- **Fast Loading**: No external dependencies, pure HTML/CSS

## 📝 Adding New Content

### Adding a Blog Post

1. Create a new HTML file in the `blog/` directory
2. Use `blog/building-agentic-ai.html` as a template
3. Add the post to `blog.html` in the blog posts section
4. Update the date and content

### Adding a Project

Edit `projects.html` and add a new project card in the `.project-grid` section:

```html
<div class="project">
    <h3>Project Name</h3>
    <div class="project-type">Type</div>
    <p class="project-description">Description...</p>
    <div class="project-tech">
        <span class="tech-tag">Tech1</span>
        <span class="tech-tag">Tech2</span>
    </div>
    <a href="link" target="_blank">View Project →</a>
</div>
```

### Updating Resume

Edit `resume.html` to update your experience, skills, or education.

## 🎨 Customization

All styles are in `styles.css`. Key color variables:
- Primary gradient: `#667eea` to `#764ba2`
- Accent color: `#667eea`
- Success color: `#27ae60`

## 🚀 Deployment

This site is deployed via GitHub Pages. Any push to the `master` branch will automatically update the live site.

## 📧 Contact

- LinkedIn: [linkedin.com/in/ryan-bieber](https://linkedin.com/in/ryan-bieber)
- GitHub: [github.com/ryanbieber](https://github.com/ryanbieber)

---

Built with passion for AI and data science.
