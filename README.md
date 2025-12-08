# Mushood - Personal Portfolio Website

A modern, responsive personal portfolio website showcasing professional experience, skills, projects, and blog posts. Built with vanilla HTML, CSS, and JavaScript for optimal performance and simplicity.

<img src="./assets/images/mushood.png" alt="Portfolio Preview" width="150" height="150" />

## 🌟 Features

### 📱 Responsive Design

- Fully responsive layout that adapts seamlessly to all screen sizes
- Mobile-first approach with optimized navigation
- Collapsible sidebar for mobile devices
- Touch-friendly interface elements

### 🎨 Modern UI/UX

- Clean and professional design aesthetic
- Smooth animations and transitions
- Custom gradient backgrounds and shadows
- Icon-based visual elements using Ionicons
- Interactive hover effects

### 📄 Multi-Section Layout

#### About Section

- Professional introduction and bio
- Service offerings showcase:
  - Frontend Development (React, Next.js, TypeScript, Tailwind CSS)
  - Backend Development (Node.js, Express, Nest.js)
  - Mobile Apps (React Native)
  - AI and Automation (n8n, OpenAI)

#### Resume Section

- **Education**: BSc in Computer Science from University of Management and Technology (CGPA: 3.7/4.0)
- **Professional Experience**:
  - Software Engineer at Texagon (Aug 2025 - Present)
  - Web Developer at Code To Kloud (April 2025 - Aug 2025)
  - Software Engineer Intern at Arbisoft (July 2024 - Sep 2024)
- **Skills Visualization**: Interactive progress bars for technical skills including:
  - React/React Native (90%)
  - Node.js/Express/Nest.js (85%)
  - PostgreSQL/Prisma ORM (80%)
  - AWS (EC2, RDS, Nginx, PM2) (75%)
  - Redux/Redux Toolkit/Redux Saga (90%)
  - And many more...

#### Portfolio Section

- Filterable project gallery with categories:
  - Web Development
  - Web Design
  - Applications
- Interactive project cards with hover effects
- Custom dropdown filter for mobile devices

#### Blog Section

- Integration with Medium blog posts
- Featured articles on:
  - React 19's Activity Component
  - Local HTTPS Development with mkcert
  - Axios + Zustand + Persist in React
  - Environment Variables in Vite
  - Zoom Web SDK Integration
- External links to full articles

#### Contact Section

- Interactive contact form with validation
- Google Maps integration
- Real-time form validation
- Disabled submit button until form is valid

## 🛠️ Technologies Used

### Frontend

- **HTML5**: Semantic markup for better SEO and accessibility
- **CSS3**: Custom properties (CSS variables) for theming
- **JavaScript (ES6+)**: Vanilla JavaScript for interactivity

### Design & Icons

- **Google Fonts**: Poppins font family
- **Ionicons 5.5.2**: Modern icon library
- **Custom SVG Icons**: Service and feature icons

### External Services

- **Google Maps API**: Location embedding
- **Medium**: Blog content hosting

## 📁 Project Structure

```
Portfolio-FE/
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet (1882 lines)
│   ├── images/
│   │   ├── my-avatar.png      # Profile picture
│   │   ├── logo.ico           # Favicon
│   │   ├── icon-*.svg         # Service icons
│   │   ├── project-*.jpg/png  # Portfolio project images
│   │   ├── blog-*.jpg         # Blog post thumbnails
│   │   └── avatar-*.png       # Testimonial avatars
│   └── js/
│       └── script.js          # Main JavaScript file
├── index.html                 # Main HTML file (1149 lines)
└── README.md                  # Project documentation
```

## 🎯 Key Features Implementation

### 1. Dynamic Navigation System

- Single-page application (SPA) behavior
- Active state management for navigation links
- Smooth scrolling to top on page change
- URL-free navigation for better UX

### 2. Portfolio Filtering

- Real-time project filtering by category
- Dual filter interface (desktop buttons + mobile dropdown)
- Smooth show/hide animations
- "All" category to display all projects

### 3. Contact Form Validation

- Real-time input validation
- Dynamic submit button state
- Required field checking
- Email format validation

### 4. Responsive Sidebar

- Collapsible contact information
- Toggle animation for mobile devices
- Social media links (LinkedIn, GitHub, Medium)
- Contact details (Email, Phone, Birthday, Location)

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--orange-yellow-crayola: hsl(45, 100%, 72%)
--vegas-gold: hsl(45, 54%, 58%)
--light-gray: hsl(0, 0%, 84%)
--light-gray-70: hsla(0, 0%, 84%, 0.7)
--bittersweet-shimmer: hsl(0, 43%, 51%)

/* Background Colors */
--eerie-black-1: hsl(240, 2%, 13%)
--eerie-black-2: hsl(240, 2%, 12%)
--smoky-black: hsl(0, 0%, 7%)
--white-1: hsl(0, 0%, 100%)
--white-2: hsl(0, 0%, 98%)
```

### Typography

- **Font Family**: Poppins (Google Fonts)
- **Font Weights**: 300, 400, 500, 600
- **Font Sizes**: Responsive scale from 11px to 24px

### Shadows & Effects

- Multiple shadow layers for depth
- Gradient backgrounds for modern look
- Smooth transitions (0.25s - 0.5s)
- Backdrop blur effects

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic web server (optional, for local development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Portfolio-FE
   ```

2. **Open the project**

   - Simply open `index.html` in your web browser, or
   - Use a local development server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

3. **Access the portfolio**
   - Direct file: `file:///path/to/Portfolio-FE/index.html`
   - Local server: `http://localhost:8000`

## 📝 Customization Guide

### Updating Personal Information

1. **Profile Information** (`index.html` lines 44-120)

   - Update name, title, and avatar image
   - Modify contact details (email, phone, birthday, location)
   - Update social media links

2. **About Section** (`index.html` lines 195-308)

   - Edit bio text
   - Update service offerings
   - Modify service icons and descriptions

3. **Resume Section** (`index.html` lines 315-565)

   - Add/remove education entries
   - Update work experience
   - Modify skill percentages

4. **Portfolio Projects** (`index.html` lines 572-844)

   - Add new projects to the project list
   - Update project images in `assets/images/`
   - Modify project categories

5. **Blog Posts** (`index.html` lines 850-1067)
   - Add new blog entries
   - Update Medium article links
   - Change blog thumbnails

### Styling Customization

1. **Colors** (`assets/css/style.css` lines 18-84)

   - Modify CSS custom properties in `:root`
   - Update gradient definitions
   - Change accent colors

2. **Typography** (`assets/css/style.css`)

   - Update font family in `:root`
   - Adjust font sizes and weights
   - Modify line heights

3. **Layout** (`assets/css/style.css`)
   - Adjust spacing and padding
   - Modify grid layouts
   - Update responsive breakpoints

## 🔧 JavaScript Functionality

### Core Features (`assets/js/script.js`)

1. **Element Toggle Function** (Line 4-6)

   - Utility function for toggling active states
   - Used throughout the application

2. **Sidebar Toggle** (Line 8-15)

   - Mobile sidebar collapse/expand
   - Touch-friendly interaction

3. **Portfolio Filter** (Line 17-65)

   - Category-based filtering
   - Dual interface (desktop/mobile)
   - Active state management

4. **Contact Form Validation** (Line 67-82)

   - Real-time validation
   - Submit button state control
   - HTML5 form validation

5. **Page Navigation** (Line 84-102)
   - SPA-style navigation
   - Active page highlighting
   - Scroll to top on navigation

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance Optimizations

- **Lazy Loading**: Images use `loading="lazy"` attribute
- **Minimal Dependencies**: Only Ionicons library loaded
- **Optimized CSS**: Custom properties for efficient styling
- **Vanilla JavaScript**: No heavy frameworks, fast load times
- **Compressed Images**: Optimized image assets

## 🔒 SEO & Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- Alt text for all images
- Meta tags for social sharing
- Descriptive link text
- ARIA attributes where needed
- Keyboard navigation support

## 📄 License

This project is open source and available for personal and commercial use.

## 👤 Author

**Mushood**

- Email: khawaja.muhammad.mushood@gmail.com
- Phone: +92 302 4202082
- Location: Lahore, Pakistan
- LinkedIn: [khawaja-muhammad-mushood](https://www.linkedin.com/in/khawaja-muhammad-mushood/)
- GitHub: [mushood123](https://github.com/mushood123)
- Medium: [@khawaja.muhammad.mushood](https://medium.com/@khawaja.muhammad.mushood)

## 🙏 Acknowledgments

- **Ionicons**: For the beautiful icon library
- **Google Fonts**: For the Poppins font family
- **Design Inspiration**: Modern portfolio design trends

## 📞 Contact

For any inquiries or collaboration opportunities, feel free to reach out through:

- Email: khawaja.muhammad.mushood@gmail.com
- LinkedIn: [Profile Link](https://www.linkedin.com/in/khawaja-muhammad-mushood/)
- GitHub: [Profile Link](https://github.com/mushood123)

---

**Built with ❤️ by Mushood** | Last Updated: December 2025
