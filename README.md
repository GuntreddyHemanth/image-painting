# Image Inpainting Widget

## Overview

The **Image Inpainting Widget** allows users to upload an image, apply a mask by drawing on it, and export both the original and masked images. Users can also save their inpainting history and delete entries as needed. The app provides an interactive canvas for drawing on top of uploaded images, allowing for creative masking.

## Features

- Upload an image to the canvas.
- Draw on the image using a customizable brush size.
- Export both the original image and the masked version.
- Save your inpainting history locally and view past modifications.
- Clear the canvas for a fresh start.

## Technologies Used

- **React** - For building the user interface.
- **react-canvas-draw** - A React component for drawing on the canvas.
- **localStorage** - For saving and retrieving the inpainting history.
- **CSS Flexbox** - For responsive layout adjustments.

## Prerequisites

Before you can run this app locally, you need to have the following installed:

- **Node.js** and **npm** (Node Package Manager)

  You can download and install them from [Node.js official website](https://nodejs.org/).

## Getting Started

### Step 1: Clone the Repository

First, clone this repository to your local machine.

```bash
git clone https://github.com/your-username/image-inpainting-widget.git
```

### Step 2: Install Dependencies

Navigate to the project folder and install the required dependencies.

```bash
cd image-inpainting-widget
npm install
```

### Step 3: Run the App

Now, you can start the development server to run the app locally.

```bash
npm start
```

This will launch the app in your default web browser at [http://localhost:3000](http://localhost:3000).

### Step 4: Open the App in Your Browser

Once the development server is running, open your browser and go to [http://localhost:3000](http://localhost:3000). You should see the image inpainting widget in action.

## Features in Detail

1. **Image Upload:**

   - The user can upload an image by clicking the "Choose File" button.
   - Once an image is uploaded, it will appear on the canvas.

2. **Drawing on the Canvas:**

   - Use the brush to draw over the image. The brush size is adjustable with a slider.

3. **Exporting Images:**

   - The "Export Images" button allows you to download both the original image and the masked (inpainted) image.

4. **Saving History:**

   - Every inpainting action can be saved to local storage for future reference.
   - The history will show both the original image and the masked version.

5. **History:**

   - The history section displays all previous inpaintings, and you can delete any entry.
   - It is displayed on the right side of the app and adjusts automatically based on screen size (responsive design).

6. **Clearing the Canvas:**
   - The canvas can be cleared to start fresh with the "Clear Canvas" button.

## Responsive Design

The layout is optimized for both desktop and mobile devices. On mobile, the history section appears below the image upload section for better usability.

### Media Queries:

- For screens smaller than `768px`, the layout switches from a horizontal layout (`flex-direction: row`) to a vertical layout (`flex-direction: column`).

## Local Storage

The app saves the history of inpainted images to the browser's local storage, allowing you to access previous inpainting actions even after refreshing the page.

## Troubleshooting

1. **App is not running:**

   - Make sure you have `Node.js` and `npm` installed correctly.
   - Run `npm install` to ensure all dependencies are installed.

2. **Canvas issues:**
   - Ensure the canvas is being properly rendered by checking the console for errors. If you encounter issues, try clearing the browser cache.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request with improvements or fixes.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

This `README.md` provides an overview, installation instructions, and an explanation of how the app works. You can adjust the sections based on your specific needs or updates.
