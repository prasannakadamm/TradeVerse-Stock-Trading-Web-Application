# Repository Split Guide

I have successfully created two separate project folders for you inside your current workspace:

1.  **`tradeverse-backend`** (Backend Code)
2.  **`tradeverse-frontend`** (Frontend Code)

Both folders have been initialized as Git repositories.

## Next Steps: Push to GitHub

You need to create two **new** repositories on your GitHub account and push these folders to them.

### 1. Push Backend
1.  Go to [GitHub.com](https://github.com/new) and create a new repository named **`tradeverse-backend`**.
2.  Open your terminal and run:
    ```bash
    cd "tradeverse-backend"
    git add .
    git commit -m "Initial commit of backend"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/tradeverse-backend.git
    git push -u origin main
    ```

### 2. Push Frontend
1.  Go to [GitHub.com](https://github.com/new) and create a new repository named **`tradeverse-frontend`**.
2.  Open your terminal and run:
    ```bash
    cd "../tradeverse-frontend"
    git add .
    git commit -m "Initial commit of frontend"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/tradeverse-frontend.git
    git push -u origin main
    ```

### 3. Move Folders (Optional)
Currently, these folders are inside your old project folder. You can now move them to your Desktop or anywhere else you keep your projects!
