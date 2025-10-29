# Contributing to RSA Demo

Thank you for your interest in contributing to the RSA Demo project! This document provides guidelines for contributing to this educational cryptography application.

## 🎯 Project Goals

This project is designed for educational purposes to demonstrate:
- RSA algorithm implementation
- Clean code architecture principles
- Modern web development practices
- Cryptography concepts

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 16+
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/NTS051205/RSA_web.git
cd RSA_web

# Setup virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
cd frontend && npm install && cd ..
```

## 📝 How to Contribute

### 1. Fork the Repository
Fork the repository on GitHub and clone your fork locally.

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Follow the existing code style
- Write clean, readable code
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes
```bash
# Test backend
cd backend && python app.py

# Test frontend
cd frontend && npm start
```

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

## 🎨 Code Style Guidelines

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions small and focused

### Frontend (React/JavaScript)
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Keep components small and focused

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors or warnings

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] No breaking changes

## Screenshots (if applicable)
Add screenshots to help explain your changes
```

## 🐛 Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS information

## 💡 Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Provide clear description
- Explain the educational value
- Consider implementation complexity

## 📚 Educational Focus

This project prioritizes:
- Code clarity and readability
- Educational value
- Clean architecture principles
- Modern development practices

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a positive environment

## 📞 Contact

For questions or discussions:
- Open an issue on GitHub
- Contact: [Your contact information]

Thank you for contributing to RSA Demo! 🎉
